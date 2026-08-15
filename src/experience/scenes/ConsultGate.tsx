import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Float,
  RoundedBox,
  Sparkles,
  Text,
} from '@react-three/drei'
import * as THREE from 'three'
import { useSiteStore } from '../siteStore'

type Props = { visibleRef: MutableRefObject<number> }

function woodTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#3d2a1a'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 40; i += 1) {
    const y = (i / 40) * size
    ctx.strokeStyle = `rgba(20,10,5,${0.08 + Math.random() * 0.12})`
    ctx.beginPath()
    ctx.moveTo(0, y + Math.sin(i) * 3)
    ctx.lineTo(size, y + Math.cos(i) * 2)
    ctx.stroke()
  }
  for (let i = 0; i < 800; i += 1) {
    ctx.fillStyle = `rgba(255,220,160,${Math.random() * 0.04})`
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 1)
  }
  const map = new THREE.CanvasTexture(canvas)
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.set(2, 1.2)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

function paperTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#f3efe6'
  ctx.fillRect(0, 0, size, size)
  for (let y = 18; y < size - 10; y += 10) {
    ctx.strokeStyle = 'rgba(60,90,70,0.18)'
    ctx.beginPath()
    ctx.moveTo(14, y)
    ctx.lineTo(size - 14, y)
    ctx.stroke()
  }
  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

/**
 * Counsellor consultation vignette —
 * warm desk, lamp, notebook, and dawn window (not an airport gate).
 */
export function ConsultGate({ visibleRef }: Props) {
  const { reducedMotion, isMobile } = useSiteStore()
  const root = useRef<THREE.Group>(null)
  const glow = useRef<THREE.PointLight>(null)
  const steam = useRef<THREE.Group>(null)
  const wood = useMemo(() => woodTexture(), [])
  const paper = useMemo(() => paperTexture(), [])

  useFrame(({ clock }) => {
    const v = visibleRef.current
    if (root.current) root.current.visible = v > 0.04
    if (glow.current && !reducedMotion) {
      glow.current.intensity = 1.1 + Math.sin(clock.elapsedTime * 1.8) * 0.15
    }
    if (steam.current && !reducedMotion) {
      const t = clock.elapsedTime
      steam.current.children.forEach((child, i) => {
        child.position.y = 0.12 + ((t * 0.15 + i * 0.2) % 0.35)
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = 0.25 * (1 - child.position.y / 0.45)
      })
    }
  })

  return (
    <group ref={root} position={[0.6, -0.2, 0]}>
      {/* dawn window — soft clarity, not a travel gate */}
      <group position={[0.2, 0.55, -1.4]}>
        <RoundedBox args={[3.2, 2.4, 0.08]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color="#0a2a1c" roughness={0.7} metalness={0.1} />
        </RoundedBox>
        <mesh position={[0, 0.05, 0.06]}>
          <planeGeometry args={[2.7, 1.9]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#7bc99a"
            emissiveIntensity={0.55}
            roughness={0.4}
            metalness={0}
          />
        </mesh>
        {/* mullions */}
        <mesh position={[0, 0.05, 0.07]}>
          <boxGeometry args={[0.04, 1.9, 0.02]} />
          <meshStandardMaterial color="#1a5c3a" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.05, 0.07]}>
          <boxGeometry args={[2.7, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a5c3a" roughness={0.5} />
        </mesh>
        <Text
          position={[0, -0.75, 0.1]}
          fontSize={0.11}
          color="#ffffff"
          anchorX="center"
          letterSpacing={0.14}
        >
          CLARITY AWAITS
        </Text>
      </group>

      {/* soft dawn spill */}
      <pointLight
        position={[0.2, 0.8, -0.8]}
        intensity={0.85}
        color="#ffffff"
        distance={6}
      />

      <Float
        speed={reducedMotion ? 0 : 0.55}
        floatIntensity={reducedMotion ? 0 : 0.08}
        rotationIntensity={0}
      >
        {/* desk */}
        <group position={[0.35, -0.55, 0.35]} rotation={[0, -0.35, 0]}>
          <RoundedBox
            args={[2.2, 0.1, 1.1]}
            radius={0.03}
            smoothness={4}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              map={wood}
              color="#4a3322"
              roughness={0.55}
              metalness={0.05}
            />
          </RoundedBox>
          {/* legs */}
          {[
            [-0.95, -0.35, 0.4],
            [0.95, -0.35, 0.4],
            [-0.95, -0.35, -0.4],
            [0.95, -0.35, -0.4],
          ].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.65, 12]} />
              <meshStandardMaterial
                map={wood}
                color="#3a2818"
                roughness={0.6}
              />
            </mesh>
          ))}

          {/* open notebook */}
          <group position={[-0.35, 0.1, 0.05]} rotation={[0, 0.15, 0]}>
            <RoundedBox args={[0.55, 0.02, 0.7]} radius={0.01} position={[-0.28, 0, 0]} castShadow>
              <meshStandardMaterial color="#1a5c3a" roughness={0.65} />
            </RoundedBox>
            <RoundedBox args={[0.55, 0.02, 0.7]} radius={0.01} position={[0.28, 0, 0]} castShadow>
              <meshStandardMaterial color="#1a5c3a" roughness={0.65} />
            </RoundedBox>
            <mesh position={[-0.28, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.5, 0.64]} />
              <meshStandardMaterial map={paper} roughness={0.85} />
            </mesh>
            <mesh position={[0.28, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.5, 0.64]} />
              <meshStandardMaterial map={paper} roughness={0.85} />
            </mesh>
          </group>

          {/* fountain pen */}
          <group position={[0.35, 0.08, 0.15]} rotation={[0, 0.6, 0.05]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <capsuleGeometry args={[0.018, 0.28, 4, 12]} />
              <meshStandardMaterial color="#1a2420" roughness={0.35} metalness={0.4} />
            </mesh>
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.015, 0.06, 8]} />
              <meshStandardMaterial color="#c5a35a" roughness={0.3} metalness={0.85} />
            </mesh>
          </group>

          {/* desk lamp */}
          <group position={[0.75, 0.05, -0.25]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.04, 20]} />
              <meshStandardMaterial color="#c5a35a" roughness={0.35} metalness={0.75} />
            </mesh>
            <mesh position={[0, 0.28, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.52, 10]} />
              <meshStandardMaterial color="#c5a35a" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.52, 0.08]} rotation={[0.6, 0, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.18, 0.12, 20, 1, true]} />
              <meshStandardMaterial
                color="#2a4034"
                roughness={0.55}
                metalness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0.48, 0.1]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial
                color="#fff0c8"
                emissive="#ffd88a"
                emissiveIntensity={1.2}
                roughness={0.3}
              />
            </mesh>
            <pointLight
              ref={glow}
              position={[0, 0.35, 0.2]}
              intensity={1.15}
              color="#ffd9a0"
              distance={4}
              decay={2}
            />
          </group>

          {/* coffee cup */}
          <group position={[0.55, 0.12, 0.35]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.07, 0.06, 0.12, 20]} />
              <meshStandardMaterial color="#f4f0e8" roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.02, 20]} />
              <meshStandardMaterial
                color="#3d2914"
                roughness={0.7}
                metalness={0.05}
              />
            </mesh>
            <mesh position={[0.09, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#f4f0e8" roughness={0.55} />
            </mesh>
            <group ref={steam} position={[0, 0.08, 0]}>
              {[0, 1, 2].map((i) => (
                <mesh key={i} position={[(i - 1) * 0.03, 0.1, 0]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
                </mesh>
              ))}
            </group>
          </group>

          {/* small potted plant */}
          <group position={[-0.85, 0.08, -0.3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.06, 0.12, 16]} />
              <meshStandardMaterial color="#c5a35a" roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#2d7a52" roughness={0.7} />
            </mesh>
            <mesh position={[0.05, 0.18, 0.03]}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial color="#3d9b68" roughness={0.65} />
            </mesh>
          </group>
        </group>
      </Float>

      <Sparkles
        count={reducedMotion || isMobile ? 10 : 24}
        scale={[4, 2.5, 2]}
        size={2}
        speed={0.25}
        opacity={0.35}
        color="#ffffff"
        position={[0.2, 0.4, -0.5]}
      />

      <ContactShadows
        position={[0.35, -1.15, 0.35]}
        opacity={0.45}
        scale={8}
        blur={2.8}
        far={4}
        color="#04140c"
      />
    </group>
  )
}
