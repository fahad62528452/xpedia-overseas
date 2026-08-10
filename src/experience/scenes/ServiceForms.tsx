import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  RoundedBox,
  Text,
} from '@react-three/drei'
import * as THREE from 'three'
import { useSiteStore } from '../siteStore'
import {
  RealisticBriefcase,
  RealisticGradCap,
  RealisticPassport,
  RealisticSuitcase,
} from '../props/RealisticServiceProps'

/** Compact cluster — sits on the left so the services panel keeps the right */
const SERVICES = [
  {
    title: 'Admissions',
    position: [-1.15, 0.35, 0.15] as [number, number, number],
    Icon: RealisticGradCap,
  },
  {
    title: 'Visas',
    position: [-0.15, -0.2, 0.4] as [number, number, number],
    Icon: RealisticPassport,
  },
  {
    title: 'Relocation',
    position: [-1.05, -0.25, -0.35] as [number, number, number],
    Icon: RealisticSuitcase,
  },
  {
    title: 'Careers',
    position: [-0.05, 0.3, -0.3] as [number, number, number],
    Icon: RealisticBriefcase,
  },
]

function Pedestal() {
  return (
    <group position={[0, -0.52, 0]}>
      <RoundedBox
        args={[0.55, 0.055, 0.55]}
        radius={0.02}
        smoothness={4}
        receiveShadow
      >
        <meshStandardMaterial
          color="#d7ebe0"
          roughness={0.55}
          metalness={0.05}
        />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <ringGeometry args={[0.18, 0.26, 32]} />
        <meshBasicMaterial color="#3d9b68" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

type Props = { visibleRef: MutableRefObject<number> }

export function ServiceForms({ visibleRef }: Props) {
  const { reducedMotion, isMobile } = useSiteStore()
  const root = useRef<THREE.Group>(null)
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const v = visibleRef.current
    if (root.current) root.current.visible = v > 0.04
    if (!group.current || reducedMotion) return
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.1 * v
  })

  return (
    <group ref={root}>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.35}
        color="#fff6ea"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#b8d4ff" />
      <pointLight position={[0, 2, 2]} intensity={0.55} color="#ffffff" />
      <Environment preset="apartment" environmentIntensity={0.55} />

      {/* Shifted left + scaled down as a set */}
      <group
        ref={group}
        position={isMobile ? [-0.2, 0.85, 0] : [-1.35, 0.05, 0]}
        scale={isMobile ? 0.48 : 0.72}
      >
        {SERVICES.map((service, i) => {
          const Icon = service.Icon
          return (
            <Float
              key={service.title}
              speed={reducedMotion ? 0 : 0.85 + i * 0.1}
              floatIntensity={reducedMotion ? 0 : 0.16}
              rotationIntensity={reducedMotion ? 0 : 0.06}
            >
              <group position={service.position}>
                <Pedestal />
                <Icon scale={0.82} />
                <Text
                  position={[0, -0.78, 0]}
                  fontSize={0.13}
                  color="#1a5c3a"
                  anchorX="center"
                  anchorY="middle"
                  letterSpacing={0.04}
                >
                  {service.title}
                </Text>
              </group>
            </Float>
          )
        })}

        <mesh rotation={[Math.PI / 2.15, 0, 0.1]} position={[-0.4, -0.35, 0]}>
          <torusGeometry args={[1.55, 0.005, 8, 80, Math.PI * 1.15]} />
          <meshBasicMaterial color="#3d9b68" transparent opacity={0.16} />
        </mesh>
      </group>

      <ContactShadows
        position={isMobile ? [-0.2, -0.35, 0] : [-1.35, -0.95, 0]}
        opacity={0.32}
        scale={isMobile ? 4.5 : 6}
        blur={2.2}
        far={3.5}
      />
    </group>
  )
}
