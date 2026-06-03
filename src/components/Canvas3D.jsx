import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Environment, Float } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { IMAGES } from '../images'
import scrollState from '../scrollState'

/* ──────────────────────────────────────────────────────────
   MangoMesh — Géométrie 3D de la mangue + scanner laser
   ────────────────────────────────────────────────────────── */
function MangoMesh() {
  const topRef     = useRef()
  const bottomRef  = useRef()
  const groupRef   = useRef()
  const scannerRef = useRef()
  const innerRef   = useRef()

  // Clipping planes — limitent chaque moitié à sa demi-sphère
  const topPlane    = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.01), [])
  const bottomPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0,  1, 0), 0.01), [])

  // Textures
  const texKent  = useTexture(IMAGES.mangoKent)
  const texCoupe = useTexture(IMAGES.mangoCoupe)

  // Correction texture UV
  useEffect(() => {
    texKent.colorSpace  = THREE.SRGBColorSpace
    texCoupe.colorSpace = THREE.SRGBColorSpace
  }, [texKent, texCoupe])

  const { gl } = useThree()
  useEffect(() => {
    gl.localClippingEnabled = true
  }, [gl])

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime
    const ss = scrollState

    if (!groupRef.current) return

    // ── Rotation de base (idle) ──────────────────────────
    const heroP = ss.heroProgress
    groupRef.current.rotation.y += 0.003 * (1 - heroP * 0.6)

    // ── Scale en fonction du scroll hero ────────────────
    const baseScale = 1 + heroP * 0.4
    groupRef.current.scale.setScalar(baseScale)

    // ── Ouverture (split) pilotée par techProgress ───────
    const split = ss.splitOpen
    if (topRef.current)    topRef.current.position.y    =  split * 0.65
    if (bottomRef.current) bottomRef.current.position.y = -split * 0.65

    // Rotation légère d'ouverture
    if (topRef.current)    topRef.current.rotation.x    =  split * 0.25
    if (bottomRef.current) bottomRef.current.rotation.x = -split * 0.25

    // ── Scanner laser ────────────────────────────────────
    if (scannerRef.current) {
      scannerRef.current.visible = split > 0.15
      scannerRef.current.position.y = Math.sin(t * 2.2) * 0.45
      scannerRef.current.material.opacity = 0.55 + Math.sin(t * 4) * 0.15
    }

    // ── Chair intérieure (visible quand ouvert) ──────────
    if (innerRef.current) {
      innerRef.current.material.opacity = Math.min(1, split * 2.5)
    }

    // ── Opacité globale canvas ───────────────────────────
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child !== scannerRef.current) {
          child.material.transparent = true
          child.material.opacity = ss.canvasOpacity
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* Moitié haute */}
      <mesh ref={topRef} castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={texKent}
          clippingPlanes={[topPlane]}
          clipShadows
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* Moitié basse */}
      <mesh ref={bottomRef} castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={texKent}
          clippingPlanes={[bottomPlane]}
          clipShadows
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* Chair intérieure (disque visible après ouverture) */}
      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[0.98, 64]} />
        <meshStandardMaterial
          map={texCoupe}
          transparent
          opacity={0}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Scanner laser orange */}
      <mesh ref={scannerRef} visible={false}>
        <boxGeometry args={[2.4, 0.018, 2.4]} />
        <meshBasicMaterial
          color="#F97316"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Halo orange autour de la mangue */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#F97316"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

/* ──────────────────────────────────────────────────────────
   Scene — éclairage + flottaison idle de la mangue
   ────────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      {/* Éclairage ambiant */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 3]}  intensity={1.2} color="#FFF8E7" />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#4ADE80" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#F97316" />

      {/* Float — idle animation subtile en Three.js */}
      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.18}>
        <MangoMesh />
      </Float>
    </>
  )
}

/* ──────────────────────────────────────────────────────────
   Canvas3D — canvas fixed plein écran en arrière-plan
   ────────────────────────────────────────────────────────── */
export default function Canvas3D() {
  const wrapRef = useRef(null)

  /* ── ScrollTrigger → scrollState ─────────────────────── */
  useEffect(() => {
    const heroSection  = document.getElementById('hero-section')
    const techSection  = document.getElementById('tech-section')
    const humanSection = document.getElementById('human-section')
    const closingSection = document.getElementById('closing-section')

    if (!heroSection || !techSection || !humanSection) return

    // Hero progress (0→1)
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end:   'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollState.heroProgress = self.progress
        scrollState.splitOpen    = Math.min(1, self.progress * 2.5)
      },
    })

    // Tech progress
    ScrollTrigger.create({
      trigger: techSection,
      start: 'top bottom',
      end:   'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollState.techProgress = self.progress
        // Ouverture totale en section Tech
        scrollState.splitOpen = Math.min(1, 0.5 + self.progress * 0.5)
      },
    })

    // Human — canvas disparaît (fond blanc)
    ScrollTrigger.create({
      trigger: humanSection,
      start: 'top 80%',
      end:   'top 20%',
      scrub: true,
      onUpdate: (self) => {
        scrollState.canvasOpacity = 1 - self.progress
      },
    })

    // Closing — canvas réapparaît
    if (closingSection) {
      ScrollTrigger.create({
        trigger: closingSection,
        start: 'top 80%',
        end:   'top 20%',
        scrub: true,
        onUpdate: (self) => {
          scrollState.canvasOpacity = self.progress
          // Referme légèrement pour le closing
          scrollState.splitOpen = 1 - self.progress * 0.3
        },
      })
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          localClippingEnabled: true,
        }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
