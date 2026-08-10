import { useRef, type MutableRefObject, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

type Props = {
  visibleRef: MutableRefObject<number>
  /** Optional second visibility that also keeps this room open (e.g. globe across two sections) */
  holdOpenRef?: MutableRefObject<number>
  position: [number, number, number]
  children: ReactNode
}

/**
 * Positions a section and scales/hides it with scroll visibility.
 * Avoids per-material opacity hacks (they break Text, maps, and depth).
 */
export function SectionRoom({
  visibleRef,
  holdOpenRef,
  position,
  children,
}: Props) {
  const group = useRef<THREE.Group>(null)

  useFrame(() => {
    const v = Math.max(visibleRef.current, holdOpenRef?.current ?? 0)
    if (!group.current) return
    group.current.visible = v > 0.03
    const s = 0.94 + v * 0.06
    group.current.scale.setScalar(s)
  })

  return (
    <group ref={group} position={position}>
      {children}
    </group>
  )
}
