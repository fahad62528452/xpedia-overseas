import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useSiteStore } from '../siteStore'
import {
  AirplaneIcon,
  DocumentIcon,
  MapPinIcon,
  PassportIcon,
} from '../props/TravelIcons'

const STEPS = [
  { n: '01', title: 'Profile', Icon: DocumentIcon },
  { n: '02', title: 'Corridor', Icon: MapPinIcon },
  { n: '03', title: 'Apply', Icon: PassportIcon },
  { n: '04', title: 'Depart', Icon: AirplaneIcon },
]

type Props = {
  visibleRef: MutableRefObject<number>
  progressRef: MutableRefObject<number>
}

export function JourneyRibbon({ visibleRef, progressRef }: Props) {
  const { reducedMotion } = useSiteStore()
  const root = useRef<THREE.Group>(null)
  const traveler = useRef<THREE.Group>(null)

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, 2.0, 0.4),
      new THREE.Vector3(-1.0, 1.2, -0.6),
      new THREE.Vector3(0.4, 0.2, 0.5),
      new THREE.Vector3(1.6, -0.8, -0.3),
      new THREE.Vector3(2.8, -1.9, 0.2),
    ])
  }, [])

  const points = useMemo(() => curve.getPoints(64), [curve])

  useFrame(({ clock }) => {
    const v = visibleRef.current
    if (root.current) root.current.visible = v > 0.04
    if (!traveler.current) return
    const progress = progressRef.current
    const t = reducedMotion
      ? Math.min(1, progress)
      : (Math.sin(clock.elapsedTime * 0.45) * 0.5 + 0.5) * 0.35 +
        progress * 0.65
    const clamped = THREE.MathUtils.clamp(t, 0, 1)
    const p = curve.getPoint(clamped)
    const tangent = curve.getTangent(clamped)
    traveler.current.position.copy(p)
    traveler.current.lookAt(p.clone().add(tangent))
  })

  return (
    <group ref={root}>
      <Line
        points={points}
        color="#3d9b68"
        lineWidth={2}
        transparent
        opacity={0.75}
      />
      <Line
        points={points}
        color="#2d7a52"
        lineWidth={6}
        transparent
        opacity={0.12}
      />

      {STEPS.map((step, i) => {
        const t = i / (STEPS.length - 1)
        const p = curve.getPoint(t)
        const Icon = step.Icon
        return (
          <Float
            key={step.n}
            speed={reducedMotion ? 0 : 1.1}
            floatIntensity={reducedMotion ? 0 : 0.22}
          >
            <group position={p}>
              <Icon scale={0.85} active />
              <Text
                position={[0.65, 0.05, 0]}
                fontSize={0.2}
                color="#1a5c3a"
                anchorX="left"
              >
                {`${step.n}  ${step.title}`}
              </Text>
            </group>
          </Float>
        )
      })}

      <group ref={traveler}>
        <AirplaneIcon scale={0.7} active />
      </group>
    </group>
  )
}
