const ocean = '#1a5c3a'
const mid = '#2d7a52'
const brass = '#3d9b68'
const mist = '#ffffff'
const paper = '#ffffff'

type IconProps = {
  active?: boolean
  scale?: number
  primary?: string
  secondary?: string
}

/** Low-poly airplane — consultancy / departure cue */
export function AirplaneIcon({ active, scale = 1 }: IconProps) {
  const body = active ? brass : mid
  const wing = active ? '#ffffff' : ocean
  return (
    <group scale={scale} rotation={[0.15, 0.4, 0.1]}>
      <mesh>
        <capsuleGeometry args={[0.08, 0.55, 4, 8]} />
        <meshStandardMaterial color={body} roughness={0.35} metalness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.85, 0.04, 0.22]} />
        <meshStandardMaterial color={wing} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-0.28, 0.12, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.22, 0.04, 0.12]} />
        <meshStandardMaterial color={wing} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.32, 0, 0]}>
        <coneGeometry args={[0.07, 0.16, 8]} />
        <meshStandardMaterial color={body} roughness={0.35} metalness={0.45} />
      </mesh>
    </group>
  )
}

/** Passport booklet */
export function PassportIcon({ active, scale = 1 }: IconProps) {
  const cover = active ? brass : ocean
  return (
    <group scale={scale} rotation={[0.35, 0.5, 0.05]}>
      <mesh>
        <boxGeometry args={[0.42, 0.58, 0.06]} />
        <meshStandardMaterial color={cover} roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.08, 0.035]}>
        <circleGeometry args={[0.09, 20]} />
        <meshStandardMaterial color={brass} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.14, 0.035]}>
        <boxGeometry args={[0.28, 0.04, 0.01]} />
        <meshStandardMaterial color={mist} roughness={0.6} metalness={0} />
      </mesh>
    </group>
  )
}

/** Travel suitcase */
export function SuitcaseIcon({ active, scale = 1 }: IconProps) {
  const shell = active ? brass : mid
  return (
    <group scale={scale} rotation={[0.2, -0.35, 0]}>
      <mesh>
        <boxGeometry args={[0.55, 0.4, 0.28]} />
        <meshStandardMaterial color={shell} roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color={ocean} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.145]}>
        <boxGeometry args={[0.12, 0.08, 0.02]} />
        <meshStandardMaterial color={brass} roughness={0.35} metalness={0.55} />
      </mesh>
    </group>
  )
}

/** Graduation cap for admissions */
export function GradCapIcon({ active, scale = 1 }: IconProps) {
  const top = active ? brass : ocean
  return (
    <group scale={scale} rotation={[0.25, 0.3, 0]}>
      <mesh position={[0, 0.08, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.7, 0.05, 0.7]} />
        <meshStandardMaterial color={top} roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.18, 16]} />
        <meshStandardMaterial color={ocean} roughness={0.5} metalness={0.15} />
      </mesh>
      <mesh position={[0.22, 0.08, 0.22]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color={brass} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.32, -0.05, 0.32]} rotation={[0.4, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.28, 0.04]} />
        <meshStandardMaterial color={brass} roughness={0.4} metalness={0.35} />
      </mesh>
    </group>
  )
}

/** Map pin / destination marker — optional flag colors */
export function MapPinIcon({
  active,
  scale = 1,
  primary,
  secondary,
}: IconProps) {
  const top = primary ?? (active ? brass : mid)
  const bottom = secondary ?? (active ? brass : ocean)
  const ring = active ? brass : mist

  return (
    <group scale={scale}>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshStandardMaterial
          color={top}
          emissive={top}
          emissiveIntensity={active ? 0.35 : 0.08}
          roughness={0.35}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.245, 0.045, 8, 24]} />
        <meshStandardMaterial
          color={bottom}
          emissive={bottom}
          emissiveIntensity={active ? 0.2 : 0.05}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.17, 0.4, 18]} />
        <meshStandardMaterial
          color={bottom === '#ffffff' ? top : bottom}
          emissive={active ? brass : ocean}
          emissiveIntensity={active ? 0.25 : 0.08}
          roughness={0.35}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.22, 0.2]}>
        <circleGeometry args={[0.07, 16]} />
        <meshStandardMaterial color={ring} roughness={0.45} metalness={0.15} />
      </mesh>
      {active ? (
        <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.12, 0.22, 24]} />
          <meshBasicMaterial color={brass} transparent opacity={0.55} />
        </mesh>
      ) : null}
    </group>
  )
}

/** Document / application file */
export function DocumentIcon({ active, scale = 1 }: IconProps) {
  return (
    <group scale={scale} rotation={[0.3, -0.25, 0.1]}>
      <mesh>
        <boxGeometry args={[0.4, 0.55, 0.04]} />
        <meshStandardMaterial color={paper} roughness={0.7} metalness={0} />
      </mesh>
      <mesh position={[0, 0.12, 0.025]}>
        <boxGeometry args={[0.28, 0.04, 0.01]} />
        <meshStandardMaterial color={active ? brass : mid} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0.025]}>
        <boxGeometry args={[0.28, 0.03, 0.01]} />
        <meshStandardMaterial color="#b7c9c6" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.08, 0.025]}>
        <boxGeometry args={[0.22, 0.03, 0.01]} />
        <meshStandardMaterial color="#b7c9c6" roughness={0.6} />
      </mesh>
      <mesh position={[0.12, 0.2, 0.03]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 20]} />
        <meshStandardMaterial color={brass} roughness={0.35} metalness={0.5} />
      </mesh>
    </group>
  )
}

/** Briefcase for careers */
export function BriefcaseIcon({ active, scale = 1 }: IconProps) {
  const shell = active ? brass : ocean
  return (
    <group scale={scale} rotation={[0.2, 0.45, 0]}>
      <mesh>
        <boxGeometry args={[0.6, 0.38, 0.22]} />
        <meshStandardMaterial color={shell} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.24]} />
        <meshStandardMaterial color={mid} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.115]}>
        <boxGeometry args={[0.1, 0.06, 0.02]} />
        <meshStandardMaterial color={brass} roughness={0.3} metalness={0.55} />
      </mesh>
    </group>
  )
}

/** Soft compass for corridor center */
export function CompassIcon({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale} rotation={[Math.PI / 2.4, 0, 0.2]}>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
        <meshStandardMaterial color={ocean} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.02, 32]} />
        <meshStandardMaterial color={mist} roughness={0.55} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.08, 0.28, 8]} />
        <meshStandardMaterial color={brass} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[Math.PI, 0, 0.4]}>
        <coneGeometry args={[0.08, 0.28, 8]} />
        <meshStandardMaterial color={mid} roughness={0.35} metalness={0.35} />
      </mesh>
    </group>
  )
}
