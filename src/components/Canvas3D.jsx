import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF }                    from '@react-three/drei'
import { ScrollTrigger }              from 'gsap/ScrollTrigger'
import * as THREE                     from 'three'
import scrollState                    from '../scrollState'

/* ─────────────────────────────────────────────────────────────
   Préchargement du modèle (évite le flash blanc au montage)
   ──────────────────────────────────────────────────────────── */
useGLTF.preload('/mango_free_download.glb')

/* ─────────────────────────────────────────────────────────────
   MangoModel
   Charge le GLB, normalise la géométrie au centre & à l'échelle,
   crée deux copies clippées (top / bottom) et les anime via
   useFrame + scrollState (piloté par GSAP ScrollTrigger).
   ──────────────────────────────────────────────────────────── */
function MangoModel() {
  const groupRef     = useRef()   // groupe racine (float + scale global)
  const topRef       = useRef()   // moitié haute
  const bottomRef    = useRef()   // moitié basse
  const scannerRef   = useRef()   // plan laser orange

  /* Clip planes — en world space, constante mise à jour dans useFrame */
  const topPlane    = useRef(new THREE.Plane(new THREE.Vector3(0,  1, 0), 0))
  const bottomPlane = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), 0))

  /* ── Chargement du modèle ────────────────────────────────── */
  const { nodes, materials } = useGLTF('/mango_free_download.glb')

  /*  Le seul mesh est sur le node "Object_2" (mesh:0, mat:material_0)  */
  const rawGeo = nodes['Object_2']?.geometry
  const rawMat = materials['material_0']

  /* ── Normalisation de la géométrie (une seule fois) ──────── */
  useEffect(() => {
    if (!rawGeo || rawGeo._tropicNormalized) return

    // 1. Centrer la géométrie sur l'origine
    rawGeo.computeBoundingBox()
    const center = new THREE.Vector3()
    rawGeo.boundingBox.getCenter(center)
    rawGeo.translate(-center.x, -center.y, -center.z)

    // 2. Normaliser à une dimension max de 2 unités (± 1 unité autour de l'origine)
    rawGeo.computeBoundingBox()
    const size = new THREE.Vector3()
    rawGeo.boundingBox.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const s = 2.0 / maxDim
      rawGeo.scale(s, s, s)
    }

    rawGeo.computeBoundingBox()
    rawGeo.computeBoundingSphere()
    rawGeo._tropicNormalized = true
  }, [rawGeo])

  /* ── Clonage des matériaux (1 par moitié, clip planes séparées) */
  const topMat = useMemo(() => {
    if (!rawMat) return null
    const m = rawMat.clone()
    m.clippingPlanes  = [topPlane.current]
    m.clipIntersection = false
    m.side            = THREE.FrontSide
    return m
  }, [rawMat])

  const bottomMat = useMemo(() => {
    if (!rawMat) return null
    const m = rawMat.clone()
    m.clippingPlanes  = [bottomPlane.current]
    m.clipIntersection = false
    m.side            = THREE.FrontSide
    return m
  }, [rawMat])

  /* ── Activer le clipping local du renderer ───────────────── */
  const { gl } = useThree()
  useEffect(() => {
    gl.localClippingEnabled = true
  }, [gl])

  /* ── Boucle d'animation — 60 FPS constants ───────────────── */
  useFrame(({ clock }) => {
    const t  = clock.elapsedTime
    const ss = scrollState
    if (!groupRef.current || !topRef.current || !bottomRef.current) return

    /* Float idle — sans dépendance au composant Float de Drei */
    groupRef.current.position.y = Math.sin(t * 0.85) * 0.08

    /* Rotation Y ralentie au fur et à mesure du scroll Hero */
    groupRef.current.rotation.y += 0.0035 * (1 - ss.heroProgress * 0.65)

    /* Scale global piloté par heroProgress */
    const targetScale = 1 + ss.heroProgress * 0.30
    groupRef.current.scale.setScalar(targetScale)

    /* ── Split (ouverture en deux moitiés) ───────────────────
       offset = déplacement world-space de chaque moitié.
       Les clip planes suivent le mouvement de chaque mesh
       pour que la coupe reste propre sans artefacts. */
    const split  = ss.splitOpen
    const offset = split * 0.72          // max ±0.72 unités world

    topRef.current.position.y    =  offset
    bottomRef.current.position.y = -offset

    /* Mise à jour des clip planes en world space :
       - topPlane    montre world y ≥  offset  (moitié haute qui monte)
       - bottomPlane montre world y ≤ -offset  (moitié basse qui descend) */
    topPlane.current.constant    = -offset   // -offset → seuil y = offset
    bottomPlane.current.constant = -offset   // -offset → seuil y = -offset

    /* Légère rotation d'ouverture */
    topRef.current.rotation.x    =  split * 0.14
    bottomRef.current.rotation.x = -split * 0.14

    /* ── Scanner laser orange ────────────────────────────────
       Navette entre les deux moitiés, dans l'espace ouvert */
    if (scannerRef.current) {
      scannerRef.current.visible = split > 0.18
      // Va-et-vient à vitesse constante dans le gap
      const gap = offset * 0.85
      scannerRef.current.position.y =
        Math.sin(t * 2.0) * gap
      scannerRef.current.material.opacity =
        0.45 + Math.sin(t * 3.8) * 0.22
    }
  })

  /* Si le modèle n'est pas encore chargé/normalisé, ne rien rendre */
  if (!rawGeo || !topMat || !bottomMat) return null

  return (
    <group ref={groupRef}>

      {/* Moitié haute — clip : world y ≥ offset */}
      <mesh
        ref={topRef}
        geometry={rawGeo}
        material={topMat}
        castShadow
      />

      {/* Moitié basse — clip : world y ≤ –offset */}
      <mesh
        ref={bottomRef}
        geometry={rawGeo}
        material={bottomMat}
        castShadow
      />

      {/* Scanner laser — plan fin horizontal orange */}
      <mesh ref={scannerRef} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.0, 0.028]} />
        <meshBasicMaterial
          color="#F97316"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Halo ambiant vert derrière la mangue */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#4ADE80"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   Scene — éclairage
   ──────────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={1.4}
        color="#FFF5E0"
        castShadow
      />
      <directionalLight
        position={[-3, -2, -3]}
        intensity={0.4}
        color="#4ADE80"
      />
      <pointLight
        position={[0, 2, 2.5]}
        intensity={1.0}
        color="#F97316"
      />
      <MangoModel />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   Canvas3D
   Canvas fixed plein-écran z-index:1.
   ScrollTrigger → scrollState → useFrame (60 FPS).
   Opacité via rAF sur le wrapper div (jamais les materials).
   ──────────────────────────────────────────────────────────── */
export default function Canvas3D() {
  const wrapRef = useRef(null)

  /* ── Opacité CSS du wrapper (lit scrollState.canvasOpacity) */
  useEffect(() => {
    let rafId
    const sync = () => {
      if (wrapRef.current) {
        wrapRef.current.style.opacity = String(scrollState.canvasOpacity)
      }
      rafId = requestAnimationFrame(sync)
    }
    rafId = requestAnimationFrame(sync)
    return () => cancelAnimationFrame(rafId)
  }, [])

  /* ── ScrollTrigger → scrollState ─────────────────────────── */
  useEffect(() => {
    const setup = () => {
      const heroEl    = document.getElementById('hero-section')
      const techEl    = document.getElementById('tech-section')
      const humanEl   = document.getElementById('human-section')
      const closingEl = document.getElementById('closing-section')
      if (!heroEl || !techEl || !humanEl) return

      /* Hero (0 → 1) : rotation + début du split */
      ScrollTrigger.create({
        trigger: heroEl,
        start:   'top top',
        end:     'bottom top',
        scrub:   true,
        onUpdate(self) {
          scrollState.heroProgress = self.progress
          scrollState.splitOpen    = Math.min(1, self.progress * 2.4)
        },
      })

      /* Tech : ouverture totale atteinte au milieu de la section */
      ScrollTrigger.create({
        trigger: techEl,
        start:   'top bottom',
        end:     'bottom top',
        scrub:   true,
        onUpdate(self) {
          scrollState.techProgress = self.progress
          scrollState.splitOpen    = Math.min(1, 0.5 + self.progress * 0.5)
        },
      })

      /* Human : canvas s'estompe (fond blanc) */
      ScrollTrigger.create({
        trigger: humanEl,
        start:   'top 80%',
        end:     'top 10%',
        scrub:   true,
        onUpdate(self) {
          scrollState.canvasOpacity = 1 - self.progress
        },
      })

      /* Closing : canvas réapparaît + mangue se referme */
      if (closingEl) {
        ScrollTrigger.create({
          trigger: closingEl,
          start:   'top 85%',
          end:     'top 15%',
          scrub:   true,
          onUpdate(self) {
            scrollState.canvasOpacity = self.progress
            scrollState.splitOpen    = Math.max(0, 1 - self.progress * 0.4)
          },
        })
      }

      ScrollTrigger.refresh()
    }

    /* Délai minimal pour s'assurer que tous les composants
       enfants ont fini leurs propres useEffect */
    const id = setTimeout(setup, 100)
    return () => {
      clearTimeout(id)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position:      'fixed',
        inset:          0,
        zIndex:         1,
        pointerEvents: 'none',
        background:    '#000',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 48 }}
        gl={{
          antialias:         true,
          alpha:             false,
          powerPreference:   'high-performance',
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
        shadows
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
