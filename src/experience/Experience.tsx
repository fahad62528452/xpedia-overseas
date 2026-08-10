import { Canvas } from '@react-three/fiber'
import { Suspense, lazy, useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { siteStore, useSiteStore } from './siteStore'
import { Loader } from './Loader'
import { Progress } from './Progress'
import './experience.css'

const World = lazy(() =>
  import('./World').then((m) => ({ default: m.World })),
)

/** Keeps the branded loader up until the hero globe textures are in */
function TextureReadyGate() {
  const { active, progress, loaded, total } = useProgress()

  useEffect(() => {
    // Wait until loaders have started and finished (hero earth + flags)
    if (total > 0 && !active && progress >= 100) {
      const t = window.setTimeout(() => siteStore.setReady(true), 180)
      return () => window.clearTimeout(t)
    }
    if (loaded > 0 && !active && progress >= 100) {
      siteStore.setReady(true)
    }
  }, [active, progress, loaded, total])

  return null
}

export function Experience() {
  const { reducedMotion, isMobile, tabVisible } = useSiteStore()
  const [mountCanvas, setMountCanvas] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => siteStore.setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Mount WebGL on the next frame (loader already visible) — no long idle delay
  useEffect(() => {
    const id = requestAnimationFrame(() => setMountCanvas(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    // Safety: never leave the loader up forever if a CDN texture stalls
    const t = window.setTimeout(() => siteStore.setReady(true), 4000)
    return () => window.clearTimeout(t)
  }, [])

  // Warm later section chunks after hero is up
  useEffect(() => {
    const warm = window.setTimeout(() => {
      void import('./scenes/ServiceForms')
      void import('./scenes/JourneyRibbon')
      void import('./scenes/ConsultGate')
    }, 2000)
    return () => window.clearTimeout(warm)
  }, [])

  return (
    <div className="experience">
      <Loader />
      <Progress />
      {mountCanvas ? (
        <Canvas
          frameloop={tabVisible ? 'always' : 'never'}
          camera={{ position: [0, 1.05, 7.2], fov: 42, near: 0.1, far: 100 }}
          dpr={reducedMotion || isMobile ? [1, 1.15] : [1, 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: isMobile ? 'low-power' : 'high-performance',
            stencil: false,
            depth: true,
          }}
          style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
        >
          <TextureReadyGate />
          <Suspense fallback={null}>
            <World />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  )
}
