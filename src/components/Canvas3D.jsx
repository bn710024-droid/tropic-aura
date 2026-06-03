import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { IMAGES } from '../images'
import scrollState from '../scrollState'

/* ──────────────────────────────────────────────────────────
   MangoMesh
   Deux hémisphères (top/bottom) + caps intérieurs + scanner.
   Float géré manuellement dans useFrame pour garder
   le contrôle total et éviter tout conflit.
   ────────────────────────────────────────────────────────── */
function MangoMesh() {
  const groupRef      = useRef()   // groupe global (float + scroll scale)
  const topRef        = useRef()   // hémisphère supérieur
  const bottomRef     = useRef()   // hémisphère inférieur
  const topCapRef     = useRef()   // disque chair haut
  const bottomCapRef  = useRef()   // disque chair bas
  const scannerRef    = useRef()   // plan laser orange

  // Textures depuis l'objet IMAGES (jamais d'URL hardcodée)
  const texKent  = useTexture(IMAGES.mangoKent)
  const texCoupe = useTexture(IMAGES.mangoCoupe)

  useEffect(() => {
    texKent.colorSpace  = THREE.SRGBColorSpace
    texCoupe.colorSpace = THREE.SRGBColorSpace
    texCoupe.repeat.set(1, 1)
    texCoupe.center.set(0.5, 0.5)
  }, [texKent, texCoupe])

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime
    const ss = scrollState
    if (!groupRef.current) return

    /* ── Float idle autonome ──────────────────────────────
       Remplace le composant <Float> pour garder le contrôle
       complet sur le groupe sans conflit GSAP/R3F. */
    groupRef.current.position.y = Math.sin(t * 0.85) * 0.07
    groupRef.current.rotation.y += 0.003 * (1 - ss.heroProgress * 0.7)

    /* ── Scale piloté par heroProgress ────────────────── */
    const targetScale = 1 + ss.heroProgress * 0.35
    groupRef.current.scale.setScalar(targetScale)

    /* ── Ouverture (split) pilotée par splitOpen ──────── */
    const split = ss.splitOpen
    const offset = split * 0.72

    // Hémisphère haut monte, bas descend
    if (topRef.current)       topRef.current.position.y       =  offset
    if (bottomRef.current)    bottomRef.current.position.y    = -offset
    // Les caps suivent leurs demi-sphères
    if (topCapRef.current)    topCapRef.current.position.y    =  offset
    if (bottomCapRef.current) bottomCapRef.current.position.y = -offset

    // Légère rotation d'ouverture
    if (topRef.current)       topRef.current.rotation.x       =  split * 0.18
    if (bottomRef.current)    bottomRef.current.rotation.x    = -split * 0.18

    /* ── Scanner laser ────────────────────────────────── */
    if (scannerRef.current) {
      scannerRef.current.visible = split > 0.2
      // Va-et-vient dans l'espace ouvert entre les deux moitiés
      scannerRef.current.position.y = Math.sin(t * 2.0) * (offset * 0.8)
      scannerRef.current.material.opacity = 0.5 + Math.sin(t * 3.5) * 0.18
    }
  })

  return (
    <group ref={groupRef}>
      {/* Hémisphère supérieur — thetaStart=0, thetaLength=PI/2 */}
      <mesh ref={topRef}>
        <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          map={texKent}
          roughness={0.42}
          metalness={0.04}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Cap intérieur haut — disque de chair */}
      <mesh ref={topCapRef} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.998, 64]} />
        <meshStandardMaterial
          map={texCoupe}
          roughness={0.55}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Hémisphère inférieur — thetaStart=PI/2, thetaLength=PI/2 */}
      <mesh ref={bottomRef}>
        <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial
          map={texKent}
          roughness={0.42}
          metalness={0.04}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Cap intérieur bas — même disque de chair, face opposée */}
      <mesh ref={bottomCapRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.998, 64]} />
        <meshStandardMaterial
          map={texCoupe}
          roughness={0.55}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Scanner laser orange — plan fin entre les deux moitiés */}
      <mesh ref={scannerRef} visible={false}>
        <planeGeometry args={[2.6, 0.022]} />
        <meshBasicMaterial
          color="#F97316"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Halo ambient autour de la mangue */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 24, 24]} />
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

/* ──────────────────────────────────────────────────────────
   Scene — éclairage de la scène
   ────────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4,  5,  4]} intensity={1.3} color="#FFF5E0" />
      <directionalLight position={[-3, -2, -3]} intensity={0.35} color="#4ADE80" />
      <pointLight position={[0, 2, 2.5]} intensity={0.9} color="#F97316" />
      <MangoMesh />
    </>
  )
}

/* ──────────────────────────────────────────────────────────
   Canvas3D — canvas fixe plein écran, z-index 1
   ScrollTrigger → scrollState (lu par useFrame à 60 FPS)
   Opacité : rAF sur le wrapper div (jamais via materials)
   ────────────────────────────────────────────────────────── */
export default function Canvas3D() {
  const wrapRef = useRef(null)

  /* ── rAF loop : sync l'opacité CSS du wrapper ─────────
     Plus propre et moins coûteux que traverser les materials
     Three.js à chaque frame. */
  useEffect(() => {
    let rafId
    const syncOpacity = () => {
      if (wrapRef.current) {
        wrapRef.current.style.opacity = String(scrollState.canvasOpacity)
      }
      rafId = requestAnimationFrame(syncOpacity)
    }
    rafId = requestAnimationFrame(syncOpacity)
    return () => cancelAnimationFrame(rafId)
  }, [])

  /* ── ScrollTrigger → scrollState ─────────────────────── */
  useEffect(() => {
    // Attendre que toutes les sections soient dans le DOM
    const setup = () => {
      const heroSection    = document.getElementById('hero-section')
      const techSection    = document.getElementById('tech-section')
      const humanSection   = document.getElementById('human-section')
      const closingSection = document.getElementById('closing-section')
      if (!heroSection || !techSection || !humanSection) return

      // Hero → splitOpen 0→1 au fur et à mesure du scroll
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end:   'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scrollState.heroProgress = self.progress
          scrollState.splitOpen    = Math.min(1, self.progress * 2.2)
        },
      })

      // Tech → ouverture complète atteinte en milieu de section
      ScrollTrigger.create({
        trigger: techSection,
        start: 'top bottom',
        end:   'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scrollState.techProgress = self.progress
          scrollState.splitOpen    = Math.min(1, 0.5 + self.progress * 0.5)
        },
      })

      // Human → canvas s'estompe (fond blanc prend l'écran)
      ScrollTrigger.create({
        trigger: humanSection,
        start: 'top 80%',
        end:   'top 10%',
        scrub: true,
        onUpdate: (self) => {
          scrollState.canvasOpacity = 1 - self.progress
        },
      })

      // Closing → canvas réapparaît + mangue se referme légèrement
      if (closingSection) {
        ScrollTrigger.create({
          trigger: closingSection,
          start: 'top 85%',
          end:   'top 15%',
          scrub: true,
          onUpdate: (self) => {
            scrollState.canvasOpacity = self.progress
            scrollState.splitOpen    = Math.max(0, 1 - self.progress * 0.35)
          },
        })
      }

      ScrollTrigger.refresh()
    }

    // Petit délai pour s'assurer que tous les composants enfants
    // ont fini leur propre useEffect avant ScrollTrigger.refresh()
    const id = setTimeout(setup, 80)
    return () => {
      clearTimeout(id)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: '#000',   // fond noir derrière la scène 3D
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 48 }}
        gl={{
          antialias: true,
          alpha: false,          // alpha:false → THREE gère le fond noir, plus performant
          powerPreference: 'high-performance',
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
