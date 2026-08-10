import type * as THREE from 'three'

/** Live globe pin objects for click-to-focus (world matrix is source of truth) */
export const focusTargets = {
  globe: {} as Record<string, THREE.Object3D | null>,
}
