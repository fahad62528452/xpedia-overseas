import { siteStore } from './siteStore'

/** Scroll the drei ScrollControls viewport to a page index */
export function scrollToPage(page: number) {
  siteStore.scrollToPage(page)
}
