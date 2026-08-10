import { Suspense, lazy, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, useScroll, Stars, Line } from '@react-three/drei'
import * as THREE from 'three'
import { HeroGlobe } from './scenes/HeroGlobe'
import { HtmlLayers } from './HtmlLayers'
import { SectionRoom } from './SectionRoom'
import { SCROLL_PAGES } from './siteContext'
import { siteStore, useSiteStore } from './siteStore'
import { sectionVisibility, sectionIndexFromOffset, scrollTopForSection } from './scrollUtils'
import { BG, CAM_LOOK, CAM_POS, ROOM_POS } from './rooms'
import { AirplaneIcon } from './props/TravelIcons'
import { focusTargets } from './focusTargets'

const ServiceForms = lazy(() =>
  import('./scenes/ServiceForms').then((m) => ({ default: m.ServiceForms })),
)
const JourneyRibbon = lazy(() =>
  import('./scenes/JourneyRibbon').then((m) => ({ default: m.JourneyRibbon })),
)
const ConsultGate = lazy(() =>
  import('./scenes/ConsultGate').then((m) => ({ default: m.ConsultGate })),
)

function ScrollBridge() {
  const scroll = useScroll()

  useEffect(() => {
    const el = scroll.el as HTMLElement
    siteStore.setScrollEl(el)

    // Pin to hero while layout/WebGL settle — prevents snap/hash jumping down.
    el.scrollTop = 0
    const pinTop = () => {
      if (!siteStore.getSnapshot().bootComplete && el.scrollTop !== 0) {
        el.scrollTop = 0
      }
    }
    el.addEventListener('scroll', pinTop, { passive: true })

    const readyT = window.setTimeout(() => siteStore.setReady(true), 500)
    const bootT = window.setTimeout(() => {
      siteStore.setBootComplete(true)
      el.removeEventListener('scroll', pinTop)

      const hash = window.location.hash.replace('#', '')
      if (hash && hash !== 'top') {
        // Honor deep links only after a stable hero boot
        siteStore.scrollToHash(hash)
      } else {
        el.scrollTop = 0
        history.replaceState(null, '', '#top')
      }
    }, 1600)

    return () => {
      window.clearTimeout(readyT)
      window.clearTimeout(bootT)
      el.removeEventListener('scroll', pinTop)
      siteStore.setScrollEl(null)
    }
  }, [scroll.el])

  useFrame(() => {
    siteStore.setScrollProgress(scroll.offset)
  })

  return null
}

/** After the user stops scrolling, settle on the nearest section’s content */
function ScrollSnap() {
  const scroll = useScroll()
  const snapping = useRef(false)
  const idleTimer = useRef(0)

  useEffect(() => {
    const el = scroll.el as HTMLElement | undefined
    if (!el) return

    const settle = () => {
      if (snapping.current) return
      if (!siteStore.getSnapshot().bootComplete) return

      const max = el.scrollHeight - el.clientHeight
      if (max <= 0) return

      const offset = el.scrollTop / max
      const nearest = sectionIndexFromOffset(offset)
      const targetTop = scrollTopForSection(el, nearest)
      if (Math.abs(el.scrollTop - targetTop) < 4) return

      snapping.current = true
      const { reducedMotion } = siteStore.getSnapshot()
      el.scrollTo({
        top: targetTop,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
      window.setTimeout(() => {
        snapping.current = false
      }, reducedMotion ? 50 : 450)
    }

    const onScroll = () => {
      if (snapping.current) return
      if (!siteStore.getSnapshot().bootComplete) return
      window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(settle, 140)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.clearTimeout(idleTimer.current)
    }
  }, [scroll.el])

  return null
}

function CameraAndFog() {
  const scroll = useScroll()
  const { scene } = useThree()

  const lookCurrent = useRef(CAM_LOOK[0].clone())
  const tmpPos = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())
  const bg = useRef(new THREE.Color())
  const focusPos = useRef(new THREE.Vector3())
  const focusLook = useRef(new THREE.Vector3())
  const pinWorld = useRef(new THREE.Vector3())
  const lastFocusNonce = useRef(0)
  const focusMix = useRef(0)

  useFrame((state, delta) => {
    const { reducedMotion, activeId, focusNonce } = siteStore.getSnapshot()
    const o = scroll.offset
    const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * 2.6)

    const seg = Math.min(4, o * 4)
    const i = Math.floor(seg)
    const raw = seg - i
    const t = raw * raw * (3 - 2 * raw)
    const j = Math.min(4, i + 1)

    tmpPos.current.lerpVectors(CAM_POS[i], CAM_POS[j], t)
    tmpLook.current.lerpVectors(CAM_LOOK[i], CAM_LOOK[j], t)
    bg.current.lerpColors(BG[i], BG[j], t)

    const heroVis = sectionVisibility(o, 0)
    const destVis = sectionVisibility(o, 1)
    const onGlobeStage = Math.max(heroVis, destVis) > 0.35

    // Only nudge toward a pin after an explicit click — never auto-center
    // the default active country (that cancelled left/right framing).
    if (focusNonce !== lastFocusNonce.current) {
      lastFocusNonce.current = focusNonce
      focusMix.current = 1
    }
    focusMix.current = Math.max(0, focusMix.current - delta * 0.9)

    const target = activeId ? focusTargets.globe[activeId] : null
    if (target && onGlobeStage && focusMix.current > 0.02) {
      target.getWorldPosition(pinWorld.current)
      focusLook.current.copy(pinWorld.current)
      // Keep camera on the open side so the globe stays left/right
      const sideBias = destVis > heroVis ? 1.6 : -1.6
      focusPos.current.set(
        pinWorld.current.x * 0.15 + sideBias,
        1.05,
        6.4,
      )
      const mix = focusMix.current * 0.35
      tmpPos.current.lerp(focusPos.current, mix)
      tmpLook.current.lerp(focusLook.current, mix * 0.6)
    }

    state.camera.position.lerp(tmpPos.current, blend)
    lookCurrent.current.lerp(tmpLook.current, blend)
    state.camera.lookAt(lookCurrent.current)

    if (!(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color()
    }
    ;(scene.background as THREE.Color).copy(bg.current)

    if (!(scene.fog instanceof THREE.Fog)) {
      scene.fog = new THREE.Fog(bg.current.getHex(), 12, 38)
    } else {
      scene.fog.color.copy(bg.current)
      scene.fog.near = 12
      scene.fog.far = 38
    }
  })

  return null
}

function GroundHaze() {
  // Skip index 1 — destinations shares the hero stage (duplicate haze otherwise)
  return (
    <group>
      {ROOM_POS.map(([x, y, z], i) =>
        i === 1 ? null : (
          <mesh
            key={i}
            position={[x, y - 2.35, z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[4.8, 48]} />
            <meshStandardMaterial
              color={i === 4 ? '#1a5c3a' : '#cfe8da'}
              transparent
              opacity={i === 4 ? 0.35 : 0.45}
              roughness={1}
              metalness={0}
            />
          </mesh>
        ),
      )}
    </group>
  )
}

function Scenes() {
  const scroll = useScroll()
  const hero = useRef(1)
  const dest = useRef(0)
  const services = useRef(0)
  const journey = useRef(0)
  const consult = useRef(0)
  const journeyProgress = useRef(0)

  useFrame(() => {
    const o = scroll.offset
    hero.current = sectionVisibility(o, 0)
    dest.current = sectionVisibility(o, 1)
    services.current = sectionVisibility(o, 2)
    journey.current = sectionVisibility(o, 3)
    consult.current = sectionVisibility(o, 4)
    journeyProgress.current = THREE.MathUtils.clamp((o - 0.55) / 0.25, 0, 1)
  })

  return (
    <group>
      <GroundHaze />
      <SectionRoom
        visibleRef={hero}
        position={ROOM_POS[0]}
        // Keep globe alive through destinations — visibility handled inside
        holdOpenRef={dest}
      >
        <HeroGlobe heroVis={hero} destVis={dest} />
      </SectionRoom>
      <SectionRoom visibleRef={services} position={ROOM_POS[2]}>
        <Suspense fallback={null}>
          <ServiceForms visibleRef={services} />
        </Suspense>
      </SectionRoom>
      <SectionRoom visibleRef={journey} position={ROOM_POS[3]}>
        <Suspense fallback={null}>
          <JourneyRibbon visibleRef={journey} progressRef={journeyProgress} />
        </Suspense>
      </SectionRoom>
      <SectionRoom visibleRef={consult} position={ROOM_POS[4]}>
        <Suspense fallback={null}>
          <ConsultGate visibleRef={consult} />
        </Suspense>
      </SectionRoom>
      <AmbientField />
      <JourneyTrail />
    </group>
  )
}

function JourneyTrail() {
  const curve = useRef(
    new THREE.CatmullRomCurve3(
      // Skip duplicate destinations waypoint (shares hero stage)
      ROOM_POS.filter((_, i) => i !== 1).map(
        ([x, y, z]) => new THREE.Vector3(x, y, z),
      ),
      false,
      'catmullrom',
      0.35,
    ),
  )
  const traveler = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const linePoints = curve.current.getPoints(80)

  useFrame(() => {
    if (!traveler.current) return
    const t = scroll.offset
    const p = curve.current.getPoint(t)
    const tangent = curve.current.getTangent(t)
    traveler.current.position.copy(p)
    traveler.current.lookAt(p.clone().add(tangent))
  })

  return (
    <group>
      <Line
        points={linePoints}
        color="#3d9b68"
        lineWidth={1}
        transparent
        opacity={0.18}
      />
      <group ref={traveler} scale={0.4}>
        <AirplaneIcon active />
      </group>
    </group>
  )
}

function AmbientField() {
  const { reducedMotion, isMobile } = useSiteStore()
  if (reducedMotion) return null
  const count = isMobile ? 120 : 420

  return (
    <Stars
      radius={70}
      depth={50}
      count={count}
      factor={2.2}
      saturation={0}
      fade
      speed={0.25}
    />
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.68} />
      <directionalLight position={[8, 6, 5]} intensity={1.65} color="#fff8ea" />
      <directionalLight position={[-6, -1, -4]} intensity={0.48} color="#c5e0ff" />
      <hemisphereLight args={['#f0f7ff', '#d8eedf', 0.52]} />
      <pointLight position={[3, 2, 4]} intensity={0.48} color="#ffffff" />
      <pointLight position={[-3, 0, 2]} intensity={0.22} color="#8fd4aa" />
    </>
  )
}

export function World() {
  const { reducedMotion } = useSiteStore()

  return (
    <ScrollControls
      pages={SCROLL_PAGES}
      damping={reducedMotion ? 0.5 : 0.12}
      maxSpeed={reducedMotion ? 1 : 0.28}
    >
      <ScrollBridge />
      <ScrollSnap />
      <Lights />
      <CameraAndFog />
      <Scenes />
      <HtmlLayers />
    </ScrollControls>
  )
}
