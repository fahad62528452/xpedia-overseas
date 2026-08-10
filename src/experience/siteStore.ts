import { useSyncExternalStore } from 'react'
import { SECTION_HASHES } from '../data/destinations'
import { sectionIndexFromOffset, scrollTopForSection } from './scrollUtils'

type SiteState = {
  activeId: string | null
  reducedMotion: boolean
  scrollOffset: number
  sectionIndex: number
  ready: boolean
  isMobile: boolean
  focusNonce: number
  tabVisible: boolean
}

let state: SiteState = {
  activeId: 'ca',
  reducedMotion: false,
  scrollOffset: 0,
  sectionIndex: 0,
  ready: false,
  isMobile: false,
  focusNonce: 0,
  tabVisible: true,
}

let scrollEl: HTMLElement | null = null
let syncingHash = false
let lastEmitOffset = -1

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export const siteStore = {
  getSnapshot(): SiteState {
    return state
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setActiveId(id: string, opts?: { focus?: boolean }) {
    const focus = opts?.focus !== false
    if (state.activeId === id) {
      if (!focus) return
      state = { ...state, focusNonce: state.focusNonce + 1 }
      emit()
      return
    }
    state = {
      ...state,
      activeId: id,
      focusNonce: focus ? state.focusNonce + 1 : state.focusNonce,
    }
    emit()
  },
  setReducedMotion(value: boolean) {
    if (state.reducedMotion === value) return
    state = { ...state, reducedMotion: value }
    emit()
  },
  setReady(value: boolean) {
    if (state.ready === value) return
    state = { ...state, ready: value }
    emit()
  },
  setIsMobile(value: boolean) {
    if (state.isMobile === value) return
    state = { ...state, isMobile: value }
    emit()
  },
  setTabVisible(value: boolean) {
    if (state.tabVisible === value) return
    state = { ...state, tabVisible: value }
    emit()
  },
  setScrollEl(el: HTMLElement | null) {
    scrollEl = el
  },
  getScrollEl() {
    return scrollEl
  },
  setScrollProgress(offset: number) {
    const sectionIndex = sectionIndexFromOffset(offset)
    const sectionChanged = state.sectionIndex !== sectionIndex
    const offsetDelta = Math.abs(offset - lastEmitOffset)

    // Throttle React subscribers: section changes always, else ~every 1.5% scroll
    if (!sectionChanged && offsetDelta < 0.015) {
      return
    }

    lastEmitOffset = offset
    const prevSection = state.sectionIndex
    state = { ...state, scrollOffset: offset, sectionIndex }
    emit()

    if (!syncingHash && prevSection !== sectionIndex) {
      const hash = SECTION_HASHES[sectionIndex]
      if (hash && window.location.hash.replace('#', '') !== hash) {
        syncingHash = true
        history.replaceState(null, '', `#${hash}`)
        syncingHash = false
      }
    }
  },
  scrollToPage(page: number) {
    const el = scrollEl
    if (!el) return
    const behavior = state.reducedMotion ? 'auto' : 'smooth'
    const top = scrollTopForSection(el, page)
    el.scrollTo({ top, behavior })
  },
  scrollToHash(hash: string) {
    const clean = hash.replace('#', '')
    const page = SECTION_HASHES.indexOf(
      clean as (typeof SECTION_HASHES)[number],
    )
    if (page >= 0) this.scrollToPage(page)
  },
}

export function useSiteStore() {
  return useSyncExternalStore(siteStore.subscribe, siteStore.getSnapshot)
}
