import * as THREE from 'three'

/** World-space anchors for each scroll section */
export const ROOM_POS: [number, number, number][] = [
  [0, 0, 0], // Hero + destinations share the globe stage
  [0, 0.05, 0], // Destinations (same stage — kept for section index alignment)
  [26, 0.4, -1], // Services
  [13, -11, -5], // Journey
  [0, -20, -7], // Consult
]

/** Camera stays centered — globe moves into the right/left of frame */
export const CAM_POS = [
  new THREE.Vector3(0, 1.05, 7.2),
  new THREE.Vector3(0.35, 0.95, 6.15), // destinations: closer, open right for panel
  new THREE.Vector3(25.5, 1.35, 5.4),
  new THREE.Vector3(11.2, -9.2, 4.5),
  new THREE.Vector3(0.4, -18.8, 4.2),
]

export const CAM_LOOK = [
  new THREE.Vector3(0, 0.15, 0),
  new THREE.Vector3(-0.15, 0.15, 0), // keep frame centered so globe reads on the left
  new THREE.Vector3(25.1, 0.25, -1), // services cluster on the left
  new THREE.Vector3(13, -11, -5),
  new THREE.Vector3(0, -20, -7),
]

export const BG = [
  new THREE.Color('#ffffff'),
  new THREE.Color('#ffffff'),
  new THREE.Color('#fafafa'),
  new THREE.Color('#f5f5f5'),
  new THREE.Color('#0d3b28'),
]

export const SECTION_LABELS = [
  'Home',
  'Destinations',
  'Services',
  'Journey',
  'Consult',
] as const
