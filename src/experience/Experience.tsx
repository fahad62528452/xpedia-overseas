import { Canvas } from '@react-three/fiber'
import { Suspense, lazy, useEffect, useState } from 'react'
import { siteStore, useSiteStore } from './siteStore'
import { Loader } from './Loader'
import { Progress } from './Progress'
import './experience.css'

const World = lazy(() =>
  import('./World').then((m) => ({ default: m.World })),
)

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

  // Paint the loader shell first, then mount WebGL on the next frames.
  useEffect(() => {
    let idleId = 0
    let raf1 = 0
    let raf2 = 0
    const start = () => setMountCanvas(true)

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if ('requestIdleCallback' in window) {
          idleId = (
            window as Window & {
              requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number
            }
          ).requestIdleCallback(start, { timeout: 400 })
        } else {
          start()
        }
      })
    })

    const fallback = window.setTimeout(start, 600)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.clearTimeout(fallback)
      if (idleId && 'cancelIdleCallback' in window) {
        ;(
          window as Window & { cancelIdleCallback: (id: number) => void }
        ).cancelIdleCallback(idleId)
      }
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => siteStore.setReady(true), 3500)
    return () => window.clearTimeout(t)
  }, [])

  // Warm later section chunks after first paint so scroll stays smooth
  useEffect(() => {
    const warm = window.setTimeout(() => {
      void import('./scenes/ServiceForms')
      void import('./scenes/JourneyRibbon')
      void import('./scenes/ConsultGate')
    }, 1200)
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
          <Suspense fallback={null}>
            <World />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  )
}
