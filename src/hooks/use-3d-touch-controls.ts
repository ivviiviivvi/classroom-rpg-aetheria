import { useEffect, useRef, useCallback } from 'react'

interface Touch3DControls {
  onPinchZoom?: (delta: number) => void
  onTwoFingerRotate?: (deltaX: number, deltaY: number) => void
  onSingleFingerRotate?: (deltaX: number, deltaY: number) => void
  onDoubleTap?: () => void
}

interface TouchData {
  x: number
  y: number
  identifier: number
}

const DOUBLE_TAP_DELAY = 300
const MIN_PINCH_DISTANCE = 30

export function use3DTouchControls(
  canvasRef: React.RefObject<HTMLCanvasElement | HTMLDivElement>,
  handlers: Touch3DControls
) {
  const lastTouchesRef = useRef<TouchData[]>([])
  const lastDistanceRef = useRef<number>(0)
  const lastTapTimeRef = useRef<number>(0)
  const isZoomingRef = useRef(false)

  const getTouchData = useCallback((touch: Touch): TouchData => ({
    x: touch.clientX,
    y: touch.clientY,
    identifier: touch.identifier
  }), [])

  const getDistance = useCallback((touch1: TouchData, touch2: TouchData): number => {
    const dx = touch1.x - touch2.x
    const dy = touch1.y - touch2.y
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches).map(getTouchData)
    lastTouchesRef.current = touches

    if (touches.length === 2) {
      isZoomingRef.current = true
      lastDistanceRef.current = getDistance(touches[0], touches[1])
    } else if (touches.length === 1) {
      const now = Date.now()
      if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
        handlers.onDoubleTap?.()
        lastTapTimeRef.current = 0
      } else {
        lastTapTimeRef.current = now
      }
    }
  }, [getTouchData, getDistance, handlers])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    
    const touches = Array.from(e.touches).map(getTouchData)
    
    if (touches.length === 2 && lastTouchesRef.current.length === 2) {
      const currentDistance = getDistance(touches[0], touches[1])
      
      if (lastDistanceRef.current > MIN_PINCH_DISTANCE) {
        const delta = currentDistance - lastDistanceRef.current
        handlers.onPinchZoom?.(delta * 0.01)
      }
      
      lastDistanceRef.current = currentDistance

      const avgCurrentX = (touches[0].x + touches[1].x) / 2
      const avgCurrentY = (touches[0].y + touches[1].y) / 2
      const avgLastX = (lastTouchesRef.current[0].x + lastTouchesRef.current[1].x) / 2
      const avgLastY = (lastTouchesRef.current[0].y + lastTouchesRef.current[1].y) / 2

      const deltaX = avgCurrentX - avgLastX
      const deltaY = avgCurrentY - avgLastY

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        handlers.onTwoFingerRotate?.(deltaX, deltaY)
      }
    } else if (touches.length === 1 && lastTouchesRef.current.length === 1) {
      const deltaX = touches[0].x - lastTouchesRef.current[0].x
      const deltaY = touches[0].y - lastTouchesRef.current[0].y
      
      if (!isZoomingRef.current) {
        handlers.onSingleFingerRotate?.(deltaX, deltaY)
      }
    }

    lastTouchesRef.current = touches
  }, [getDistance, handlers])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touches = Array.from(e.touches).map(getTouchData)
    lastTouchesRef.current = touches

    if (touches.length < 2) {
      isZoomingRef.current = false
      lastDistanceRef.current = 0
    }
  }, [getTouchData])

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [canvasRef, handleTouchStart, handleTouchMove, handleTouchEnd])
}
