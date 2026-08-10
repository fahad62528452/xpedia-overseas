import { useMemo, type ReactNode } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

type PropProps = {
  scale?: number
  children?: ReactNode
}

function leatherTexture(base: string, grain = 0.12) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 4800; i += 1) {
    const x = Math.random() * size
    const y = Math.random() * size
    const a = grain * (0.35 + Math.random() * 0.65)
    ctx.fillStyle = `rgba(0,0,0,${a})`
    ctx.fillRect(x, y, 1.2, 1.2)
  }
  for (let i = 0; i < 900; i += 1) {
    const x = Math.random() * size
    const y = Math.random() * size
    ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.05})`
    ctx.fillRect(x, y, 1, 1)
  }
  const map = new THREE.CanvasTexture(canvas)
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.set(2, 2)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

function fabricTexture(base: string) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  for (let y = 0; y < size; y += 3) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }
  for (let x = 0; x < size; x += 3) {
    ctx.strokeStyle = 'rgba(0,0,0,0.05)'
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)
    ctx.stroke()
  }
  const map = new THREE.CanvasTexture(canvas)
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.set(3, 3)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

function shellTexture(base: string) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, size, size)
  g.addColorStop(0, base)
  g.addColorStop(0.5, '#2a6b4a')
  g.addColorStop(1, base)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 200; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 8, 0, Math.PI * 2)
    ctx.fill()
  }
  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  return map
}

/** Realistic mortarboard with velvet board, gold button & hanging tassel */
export function RealisticGradCap({ scale = 1 }: PropProps) {
  const fabric = useMemo(() => fabricTexture('#152018'), [])
  const gold = '#c5a35a'

  return (
    <group scale={scale} rotation={[0.2, 0.45, -0.05]}>
      {/* skull / band */}
      <mesh position={[0, -0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.14, 32]} />
        <meshStandardMaterial
          map={fabric}
          color="#1a2420"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>
      {/* mortarboard */}
      <RoundedBox
        args={[0.72, 0.045, 0.72]}
        radius={0.012}
        smoothness={4}
        position={[0, 0.1, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={fabric}
          color="#121a16"
          roughness={0.88}
          metalness={0.04}
        />
      </RoundedBox>
      {/* button */}
      <mesh position={[0, 0.135, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 24]} />
        <meshStandardMaterial
          color={gold}
          roughness={0.28}
          metalness={0.85}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* tassel cord */}
      <mesh position={[0.18, 0.12, 0.18]} rotation={[0.55, 0.4, 0.2]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.22, 10]} />
        <meshStandardMaterial color={gold} roughness={0.35} metalness={0.75} />
      </mesh>
      {/* tassel head */}
      <mesh position={[0.28, 0.02, 0.28]} castShadow>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshStandardMaterial color={gold} roughness={0.3} metalness={0.8} />
      </mesh>
      {/* fringe strands */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              0.28 + Math.cos(a) * 0.02,
              -0.08,
              0.28 + Math.sin(a) * 0.02,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.006, 0.004, 0.16, 6]} />
            <meshStandardMaterial color={gold} roughness={0.4} metalness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Open navy passport with gold crest, pages, and ribbon */
export function RealisticPassport({ scale = 1 }: PropProps) {
  const leather = useMemo(() => leatherTexture('#1e3a5f', 0.14), [])
  const gold = '#d4af37'

  return (
    <group scale={scale} rotation={[0.55, 0.65, 0.08]}>
      {/* back cover */}
      <RoundedBox
        args={[0.48, 0.68, 0.03]}
        radius={0.012}
        smoothness={4}
        position={[0, 0, -0.04]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={leather}
          color="#1a3355"
          roughness={0.72}
          metalness={0.08}
        />
      </RoundedBox>
      {/* spine */}
      <mesh position={[-0.24, 0, -0.01]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.03, 0.68, 0.07]} />
        <meshStandardMaterial
          map={leather}
          color="#152a45"
          roughness={0.75}
          metalness={0.06}
        />
      </mesh>
      {/* front cover (slightly open) */}
      <group position={[-0.22, 0, 0.02]} rotation={[0, -0.35, 0]}>
        <RoundedBox
          args={[0.48, 0.68, 0.03]}
          radius={0.012}
          smoothness={4}
          position={[0.24, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={leather}
            color="#1e3a5f"
            roughness={0.7}
            metalness={0.1}
          />
        </RoundedBox>
        {/* gold crest */}
        <mesh position={[0.24, 0.12, 0.02]}>
          <circleGeometry args={[0.1, 28]} />
          <meshStandardMaterial
            color={gold}
            roughness={0.32}
            metalness={0.9}
            envMapIntensity={1.3}
          />
        </mesh>
        <mesh position={[0.24, 0.12, 0.025]}>
          <ringGeometry args={[0.06, 0.085, 28]} />
          <meshStandardMaterial color="#f0e0a8" roughness={0.35} metalness={0.85} />
        </mesh>
        {/* embossed title bars */}
        <mesh position={[0.24, -0.1, 0.02]}>
          <boxGeometry args={[0.28, 0.035, 0.008]} />
          <meshStandardMaterial color={gold} roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0.24, -0.16, 0.02]}>
          <boxGeometry args={[0.2, 0.025, 0.006]} />
          <meshStandardMaterial color={gold} roughness={0.45} metalness={0.75} />
        </mesh>
      </group>
      {/* page block */}
      <RoundedBox
        args={[0.44, 0.64, 0.045]}
        radius={0.006}
        smoothness={2}
        position={[0.01, 0, -0.005]}
        castShadow
      >
        <meshStandardMaterial color="#f4f0e6" roughness={0.85} metalness={0} />
      </RoundedBox>
      {/* page lines hint */}
      {[0.08, 0, -0.08].map((y) => (
        <mesh key={y} position={[0.08, y, 0.02]}>
          <boxGeometry args={[0.28, 0.012, 0.004]} />
          <meshStandardMaterial color="#c8c2b4" roughness={0.9} />
        </mesh>
      ))}
      {/* bookmark ribbon */}
      <mesh position={[0.12, -0.28, 0.03]} rotation={[0.2, 0, 0.1]} castShadow>
        <boxGeometry args={[0.05, 0.28, 0.006]} />
        <meshStandardMaterial color="#8b1e3f" roughness={0.55} metalness={0.05} />
      </mesh>
    </group>
  )
}

/** Hard-shell travel suitcase with wheels, handle, zippers */
export function RealisticSuitcase({ scale = 1 }: PropProps) {
  const shell = useMemo(() => shellTexture('#1f6b45'), [])
  const chrome = '#cfd8dc'
  const rubber = '#1a1f1c'

  return (
    <group scale={scale} rotation={[0.15, -0.55, 0.05]}>
      {/* main shell */}
      <RoundedBox
        args={[0.62, 0.42, 0.32]}
        radius={0.04}
        smoothness={5}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={shell}
          color="#247a52"
          roughness={0.35}
          metalness={0.22}
          envMapIntensity={1.1}
        />
      </RoundedBox>
      {/* side seam / zipper channel */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.34, 0.012, 10, 48]} />
        <meshStandardMaterial color={rubber} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* zipper pulls */}
      <mesh position={[0.12, 0.18, 0.17]} castShadow>
        <boxGeometry args={[0.05, 0.08, 0.02]} />
        <meshStandardMaterial color={chrome} roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[-0.12, 0.18, 0.17]} castShadow>
        <boxGeometry args={[0.05, 0.08, 0.02]} />
        <meshStandardMaterial color={chrome} roughness={0.25} metalness={0.9} />
      </mesh>
      {/* telescopic handle posts */}
      <mesh position={[-0.12, 0.28, -0.02]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.2, 12]} />
        <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.95} />
      </mesh>
      <mesh position={[0.12, 0.28, -0.02]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.2, 12]} />
        <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.95} />
      </mesh>
      {/* handle grip */}
      <RoundedBox
        args={[0.32, 0.045, 0.05]}
        radius={0.015}
        smoothness={3}
        position={[0, 0.38, -0.02]}
        castShadow
      >
        <meshStandardMaterial color={rubber} roughness={0.65} metalness={0.15} />
      </RoundedBox>
      {/* side carry handle */}
      <mesh position={[0.34, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.08, 0.016, 8, 16, Math.PI]} />
        <meshStandardMaterial color={chrome} roughness={0.28} metalness={0.9} />
      </mesh>
      {/* corner guards */}
      {[
        [-0.28, -0.17, 0.13],
        [0.28, -0.17, 0.13],
        [-0.28, -0.17, -0.13],
        [0.28, -0.17, -0.13],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={chrome} roughness={0.3} metalness={0.85} />
        </mesh>
      ))}
      {/* wheels */}
      {[
        [-0.22, -0.24, 0.1],
        [0.22, -0.24, 0.1],
        [-0.22, -0.24, -0.1],
        [0.22, -0.24, -0.1],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.035, 20]} />
            <meshStandardMaterial color="#111" roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 12]} />
            <meshStandardMaterial color={chrome} roughness={0.25} metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* ID tag */}
      <mesh position={[0.2, 0.05, 0.165]} castShadow>
        <boxGeometry args={[0.1, 0.07, 0.01]} />
        <meshStandardMaterial color="#f0f4f1" roughness={0.6} metalness={0.05} />
      </mesh>
    </group>
  )
}

/** Leather briefcase with brass hardware */
export function RealisticBriefcase({ scale = 1 }: PropProps) {
  const leather = useMemo(() => leatherTexture('#3d2914', 0.16), [])
  const brass = '#b8923a'

  return (
    <group scale={scale} rotation={[0.2, 0.5, 0.04]}>
      <RoundedBox
        args={[0.7, 0.42, 0.2]}
        radius={0.025}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={leather}
          color="#4a3320"
          roughness={0.68}
          metalness={0.08}
        />
      </RoundedBox>
      {/* lid seam */}
      <mesh position={[0, 0.08, 0.105]}>
        <boxGeometry args={[0.68, 0.01, 0.01]} />
        <meshStandardMaterial color="#2a1c10" roughness={0.8} />
      </mesh>
      {/* top handle mounts */}
      <mesh position={[-0.12, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.04, 0.08]} />
        <meshStandardMaterial color={brass} roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0.12, 0.22, 0]} castShadow>
        <boxGeometry args={[0.06, 0.04, 0.08]} />
        <meshStandardMaterial color={brass} roughness={0.3} metalness={0.85} />
      </mesh>
      {/* leather handle */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <torusGeometry args={[0.14, 0.025, 10, 24, Math.PI]} />
        <meshStandardMaterial
          map={leather}
          color="#3d2914"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>
      {/* clasps */}
      {[-0.16, 0.16].map((x) => (
        <group key={x} position={[x, 0.02, 0.11]}>
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.05, 0.025]} />
            <meshStandardMaterial color={brass} roughness={0.28} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02, 12]} />
            <meshStandardMaterial color="#e8d5a3" roughness={0.25} metalness={0.95} />
          </mesh>
        </group>
      ))}
      {/* lock plate */}
      <mesh position={[0, 0.02, 0.11]} castShadow>
        <boxGeometry args={[0.1, 0.07, 0.02]} />
        <meshStandardMaterial color={brass} roughness={0.32} metalness={0.88} />
      </mesh>
      {/* stitching hint */}
      <mesh position={[0, -0.15, 0.105]}>
        <boxGeometry args={[0.58, 0.008, 0.004]} />
        <meshStandardMaterial color="#c4a574" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* feet */}
      {[-0.28, 0.28].map((x) =>
        [-0.07, 0.07].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.23, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.025, 0.03, 10]} />
            <meshStandardMaterial color={brass} roughness={0.35} metalness={0.8} />
          </mesh>
        )),
      )}
    </group>
  )
}
