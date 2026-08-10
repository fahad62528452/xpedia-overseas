import * as THREE from 'three'

export const SECTION_COUNT = 5

/** Normalized scroll offset (0–1) for a section center */
export function offsetForSection(index: number, total = SECTION_COUNT) {
  if (total <= 1) return 0
  return THREE.MathUtils.clamp(index / (total - 1), 0, 1)
}

export function sectionVisibility(offset: number, index: number, total = SECTION_COUNT) {
  const center = offsetForSection(index, total)
  const width = 0.24
  const dist = Math.abs(offset - center)
  return THREE.MathUtils.clamp(1 - dist / width, 0, 1)
}

/** Active section = strongest visibility peak (avoids round() jumping early) */
export function sectionIndexFromOffset(offset: number, total = SECTION_COUNT) {
  let best = 0
  let bestValue = -1
  for (let i = 0; i < total; i += 1) {
    const value = sectionVisibility(offset, i, total)
    if (value > bestValue) {
      bestValue = value
      best = i
    }
  }
  return best
}

/** Scroll pixel position for a section inside the drei ScrollControls element */
export function scrollTopForSection(
  el: HTMLElement,
  index: number,
  total = SECTION_COUNT,
) {
  const max = el.scrollHeight - el.clientHeight
  if (max <= 0) return 0
  return offsetForSection(index, total) * max
}
