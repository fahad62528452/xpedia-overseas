import { lazy, Suspense, useEffect } from 'react'
import { siteStore, useSiteStore } from './experience/siteStore'
import { Navbar } from './components/Navbar'
import { Loader } from './experience/Loader'

const Experience = lazy(() =>
  import('./experience/Experience').then((m) => ({ default: m.Experience })),
)

function usePrefersReducedMotion() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => siteStore.setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
}

function useTabVisibility() {
  useEffect(() => {
    const update = () =>
      siteStore.setTabVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
}

function useSectionKeyboard() {
  const { sectionIndex, ready } = useSiteStore()

  useEffect(() => {
    if (!ready) return

    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        siteStore.scrollToPage(Math.min(4, sectionIndex + 1))
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        siteStore.scrollToPage(Math.max(0, sectionIndex - 1))
      }
      if (event.key === 'Home') {
        event.preventDefault()
        siteStore.scrollToPage(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        siteStore.scrollToPage(4)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sectionIndex, ready])
}

function useHashRouting() {
  const { ready } = useSiteStore()

  useEffect(() => {
    if (!ready) return
    if (window.location.hash) {
      siteStore.scrollToHash(window.location.hash)
    }

    const onHash = () => siteStore.scrollToHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [ready])
}

export default function App() {
  usePrefersReducedMotion()
  useTabVisibility()
  useSectionKeyboard()
  useHashRouting()

  return (
    <>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Experience />
      </Suspense>
    </>
  )
}
