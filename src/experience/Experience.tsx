import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { siteStore, useSiteStore } from './siteStore'
import { World } from './World'
import { Loader } from './Loader'
import { Progress } from './Progress'
import './experience.css'

export function Experience() {
  const { reducedMotion, isMobile, tabVisible } = useSiteStore()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => siteStore.setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => siteStore.setReady(true), 5000)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className="experience">
      <Loader />
      <Progress />
      <Canvas
        frameloop={tabVisible ? 'always' : 'never'}
        camera={{ position: [0, 1.05, 7.2], fov: 42, near: 0.1, far: 100 }}
        dpr={reducedMotion || isMobile ? [1, 1.25] : [1, 1.65]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <World />
        </Suspense>
      </Canvas>
    </div>
  )
}
