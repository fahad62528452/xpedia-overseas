import { Suspense, useLayoutEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Line, Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import {
  DESTINATIONS,
  INDIA_ORIGIN,
  flagTextureUrl,
  latLonToVector3,
  type Destination,
} from '../../data/destinations'
import { siteStore, useSiteStore } from '../siteStore'
import { spinState } from '../spinState'
import { focusTargets } from '../focusTargets'
import { AirplaneIcon } from '../props/TravelIcons'

const EARTH_URL =
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/earth_atmos_2048.jpg'
const EARTH_BUMP =
  'https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-topology.png'

const Y_UP = new THREE.Vector3(0, 1, 0)

function radialPose(lat: number, lon: number, radius: number) {
  const position = new THREE.Vector3(...latLonToVector3(lat, lon, radius))
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    Y_UP,
    position.clone().normalize(),
  )
  return { position, quaternion }
}

function Atmosphere() {
  return (
    <>
      {/* close haze */}
      <Sphere args={[2.045, 64, 64]}>
        <meshBasicMaterial
          color="#9fd4ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
      {/* outer sky glow */}
      <Sphere args={[2.2, 48, 48]}>
        <meshBasicMaterial
          color="#c9e7ff"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </>
  )
}

function FlagCloth({
  code,
  width,
  height,
}: {
  code: string
  width: number
  height: number
}) {
  const map = useTexture(flagTextureUrl(code))
  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 4
    map.needsUpdate = true
  }, [map])

  return (
    <mesh position={[width / 2, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={map}
        transparent
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

function FlagClothFallback({
  width,
  height,
  color,
}: {
  width: number
  height: number
  color: string
}) {
  return (
    <mesh position={[width / 2, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

/** Physical flag on a pole — planted radially like a map pin */
function FlagPin({
  lat,
  lon,
  flag,
  primary,
  secondary,
  active = false,
  tall = false,
  interactive = false,
  onSelect,
  focusId,
  children,
}: {
  lat: number
  lon: number
  flag: string
  primary: string
  secondary: string
  active?: boolean
  tall?: boolean
  interactive?: boolean
  onSelect?: () => void
  focusId?: string
  children?: ReactNode
}) {
  const root = useRef<THREE.Group>(null)
  const cloth = useRef<THREE.Group>(null)
  const pose = useMemo(() => radialPose(lat, lon, 2.015), [lat, lon])

  const poleH = tall ? 0.44 : active ? 0.38 : 0.32
  const flagW = tall ? 0.28 : active ? 0.25 : 0.22
  const flagH = tall ? 0.19 : active ? 0.165 : 0.14
  const poleR = active || tall ? 0.011 : 0.009

  useFrame(({ clock }) => {
    if (focusId && root.current) {
      focusTargets.globe[focusId] = root.current
    }
    if (cloth.current) {
      const wave =
        Math.sin(clock.elapsedTime * 2.6 + lat * 0.08) * (active ? 0.18 : 0.12)
      cloth.current.rotation.y = wave
    }
  })

  return (
    <group ref={root} position={pose.position} quaternion={pose.quaternion}>
      {/* spike tip into the globe surface */}
      <mesh position={[0, -0.015, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.022, 0.055, 10]} />
        <meshStandardMaterial
          color={active ? secondary : primary}
          metalness={0.55}
          roughness={0.3}
        />
      </mesh>

      {/* pin base disc */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.032, 16]} />
        <meshStandardMaterial
          color={primary}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      {/* pole shaft */}
      <mesh position={[0, poleH / 2, 0]}>
        <cylinderGeometry args={[poleR, poleR * 1.05, poleH, 10]} />
        <meshStandardMaterial
          color="#d8e0e6"
          metalness={0.65}
          roughness={0.28}
        />
      </mesh>

      {/* finial ball */}
      <mesh position={[0, poleH + 0.014, 0]}>
        <sphereGeometry args={[0.017, 12, 12]} />
        <meshStandardMaterial
          color={active ? secondary : primary}
          emissive={active ? secondary : primary}
          emissiveIntensity={active ? 0.45 : 0.12}
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>

      {/* flag cloth hinged at top of pole */}
      <group ref={cloth} position={[0, poleH - flagH / 2 - 0.02, 0]}>
        <Suspense
          fallback={
            <FlagClothFallback
              width={flagW}
              height={flagH}
              color={primary}
            />
          }
        >
          <FlagCloth code={flag} width={flagW} height={flagH} />
        </Suspense>
        {children}
      </group>

      {active ? (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.085, 24]} />
          <meshBasicMaterial color={secondary} transparent opacity={0.45} />
        </mesh>
      ) : null}

      {/* click target */}
      {interactive ? (
        <mesh
          position={[flagW * 0.35, poleH * 0.55, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.()
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <boxGeometry args={[flagW + 0.12, poleH + 0.08, 0.18]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  )
}

function DestinationFlag({
  destination,
  active,
  onSelect,
}: {
  destination: Destination
  active: boolean
  onSelect: (id: string) => void
}) {
  const [primary, secondary] = destination.colors

  return (
    <FlagPin
      lat={destination.lat}
      lon={destination.lon}
      flag={destination.flag}
      primary={primary}
      secondary={secondary}
      active={active}
      interactive
      focusId={destination.id}
      onSelect={() => onSelect(destination.id)}
    />
  )
}

/** India home marker — flag pin + departing flight beside the cloth */
function IndiaOriginFlag() {
  const plane = useRef<THREE.Group>(null)
  const [saffron, green] = INDIA_ORIGIN.colors

  useFrame(({ clock }) => {
    if (!plane.current) return
    const t = clock.elapsedTime
    plane.current.position.y = Math.sin(t * 2.2) * 0.03
    plane.current.position.z = Math.sin(t * 1.4) * 0.02
    plane.current.rotation.y = 0.35 + Math.sin(t * 1.1) * 0.15
  })

  return (
    <FlagPin
      lat={INDIA_ORIGIN.lat}
      lon={INDIA_ORIGIN.lon}
      flag={INDIA_ORIGIN.flag}
      primary={saffron}
      secondary={green}
      active
      tall
    >
      <group ref={plane} position={[0.38, 0.02, 0.05]} scale={0.32}>
        <AirplaneIcon active scale={1} />
      </group>
    </FlagPin>
  )
}

function ArcNetwork({ activeId }: { activeId: string | null }) {
  const arcs = useMemo(() => {
    const points: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < DESTINATIONS.length; i += 1) {
      const a = DESTINATIONS[i]
      const b = DESTINATIONS[(i + 2) % DESTINATIONS.length]
      const start = new THREE.Vector3(...latLonToVector3(a.lat, a.lon, 2.01))
      const end = new THREE.Vector3(...latLonToVector3(b.lat, b.lon, 2.01))
      points.push([start, end])
    }
    return points
  }, [])

  return (
    <>
      {arcs.map(([start, end], index) => {
        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.55)
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        const pts = curve.getPoints(24)
        const highlight =
          activeId &&
          (DESTINATIONS[index]?.id === activeId ||
            DESTINATIONS[(index + 2) % DESTINATIONS.length]?.id === activeId)

        return (
          <Line
            key={index}
            points={pts}
            color={highlight ? '#52b788' : '#8ec8e8'}
            lineWidth={highlight ? 1.8 : 1}
            transparent
            opacity={highlight ? 0.85 : 0.28}
          />
        )
      })}
    </>
  )
}

function EarthBall({ lowPower }: { lowPower: boolean }) {
  const [colorMap, bumpMap] = useTexture([EARTH_URL, EARTH_BUMP])
  useLayoutEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace
    colorMap.anisotropy = 8
    colorMap.needsUpdate = true
  }, [colorMap])

  return (
    <Sphere args={[2, lowPower ? 48 : 72, lowPower ? 48 : 72]}>
      <meshStandardMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.05}
        color="#eaf2f8"
        roughness={0.48}
        metalness={0.04}
        envMapIntensity={1}
      />
    </Sphere>
  )
}

function EarthFallback() {
  return (
    <group>
      <Sphere args={[2, 48, 48]}>
        <meshStandardMaterial
          color="#8ec8e8"
          roughness={0.42}
          metalness={0.06}
        />
      </Sphere>
      <Sphere args={[2.01, 32, 32]}>
        <meshStandardMaterial
          color="#9ccc65"
          wireframe
          transparent
          opacity={0.16}
          roughness={0.8}
        />
      </Sphere>
    </group>
  )
}

type HeroGlobeProps = {
  heroVis: MutableRefObject<number>
  destVis: MutableRefObject<number>
}

export function HeroGlobe({ heroVis, destVis }: HeroGlobeProps) {
  const { activeId, reducedMotion, isMobile } = useSiteStore()
  const group = useRef<THREE.Group>(null)
  const root = useRef<THREE.Group>(null)
  const stage = useRef<THREE.Group>(null)
  const lowPower = reducedMotion || isMobile
  const side = useRef(0)
  const spinSpeed = useRef(0.022)

  useFrame((_, delta) => {
    const h = heroVis.current
    const d = destVis.current
    const v = Math.max(h, d)
    if (root.current) root.current.visible = v > 0.04

    // Live section refs (updated every frame) — not throttled React scroll state.
    // Hero wins → 0 (right). Destinations wins → 1 (left).
    const targetSide = h + d > 0.001 ? d / (h + d) : 0
    side.current = THREE.MathUtils.damp(side.current, targetSide, 7, delta)

    if (stage.current) {
      const t = side.current
      // Camera looks at origin: +X = right of frame, −X = left of frame
      const rightX = isMobile ? 1.85 : 2.55
      const leftX = isMobile ? -1.85 : -2.75
      stage.current.position.x = THREE.MathUtils.lerp(rightX, leftX, t)
      stage.current.position.y = THREE.MathUtils.lerp(0.08, 0.12, t)
      // Destinations: slightly zoomed in
      const s = THREE.MathUtils.lerp(
        isMobile ? 0.58 : 0.68,
        isMobile ? 0.78 : 0.92,
        t,
      )
      stage.current.scale.setScalar(s)
    }

    if (!group.current) return
    // Hero: slow spin. Destinations: ease to a full stop.
    const targetSpin = reducedMotion || side.current > 0.55 ? 0 : 0.022
    spinSpeed.current = THREE.MathUtils.damp(spinSpeed.current, targetSpin, 4, delta)
    if (spinSpeed.current > 0.0004) {
      group.current.rotation.y += delta * spinSpeed.current
    }
    spinState.globeY = group.current.rotation.y
  })

  return (
    <group ref={root}>
      <directionalLight
        position={[4.5, 3.2, 5]}
        intensity={1.8}
        color="#fff6e8"
      />
      <directionalLight
        position={[-3, 1.5, -2]}
        intensity={0.55}
        color="#b8d9ff"
      />
      <pointLight position={[2.5, 1.2, 3]} intensity={0.45} color="#ffffff" />

      <group
        ref={stage}
        position={[isMobile ? 1.85 : 2.55, 0.08, 0]}
        scale={isMobile ? 0.58 : 0.68}
      >
        <Float
          speed={reducedMotion ? 0 : 0.35}
          rotationIntensity={0}
          floatIntensity={reducedMotion ? 0 : 0.04}
        >
          <group ref={group} rotation={[0.18, -0.4, 0]}>
            <Suspense fallback={<EarthFallback />}>
              {lowPower ? <EarthFallback /> : <EarthBall lowPower={false} />}
            </Suspense>

            <Atmosphere />
            <ArcNetwork activeId={activeId} />

            <IndiaOriginFlag />

            {DESTINATIONS.map((destination) => (
              <DestinationFlag
                key={destination.id}
                destination={destination}
                active={activeId === destination.id}
                onSelect={siteStore.setActiveId}
              />
            ))}
          </group>
        </Float>
      </group>
    </group>
  )
}
