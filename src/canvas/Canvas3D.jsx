import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF }          from '@react-three/drei'
import * as THREE           from 'three'
import mouseState           from '../mouseState'

useGLTF.preload('/mango_free_download.glb')

/* ── MangoModel ─────────────────────────────────────────── */
function MangoModel() {
  const groupRef = useRef()
  const { nodes, materials } = useGLTF('/mango_free_download.glb')

  const geo = nodes['Object_2']?.geometry
  const mat = materials['material_0']

  useEffect(() => {
    if (!geo || geo._tropicNormalized) return
    geo.computeBoundingBox()
    const center = new THREE.Vector3()
    geo.boundingBox.getCenter(center)
    geo.translate(-center.x, -center.y, -center.z)
    geo.computeBoundingBox()
    const size = new THREE.Vector3()
    geo.boundingBox.getSize(size)
    const s = 2.0 / Math.max(size.x, size.y, size.z)
    geo.scale(s, s, s)
    geo.computeBoundingBox()
    geo.computeBoundingSphere()
    geo._tropicNormalized = true
  }, [geo])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    // Rotation Y lente
    groupRef.current.rotation.y = t * 0.35
    // Légère oscillation verticale
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.06
    // Parallaxe souris douce
    groupRef.current.position.x += (mouseState.nx * 0.18 - groupRef.current.position.x) * 0.04
  })

  if (!geo || !mat) return null
  return (
    <group ref={groupRef}>
      <mesh geometry={geo} material={mat} castShadow />
      {/* Halo vert doux */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#4ADE80" transparent opacity={0.05}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

/* ── Canvas3D — rendu DANS la section 1 (pas fixed) ─────── */
export default function Canvas3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.0], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 4]}   intensity={2.2} color="#ffffff" />
      <directionalLight position={[-3, -2, -3]} intensity={0.6} color="#FFF3E0" />
      <MangoModel />
    </Canvas>
  )
}
