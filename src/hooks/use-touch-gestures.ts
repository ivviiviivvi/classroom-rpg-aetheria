import { useEffect, useRef, useState, useCallback } from 'react'

interface TouchGestureHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onDoubleTap?: () => void
  onLongPress?: () => void
}

interface TouchPoint {
  x: number
  y: number
  time: number
}

const SWIPE_THRESHOLD = 50
const SWIPE_VELOCITY = 0.3
const LONG_PRESS_DURATION = 500
const DOUBLE_TAP_DELAY = 300

export function useTouchGestures(handlers: TouchGestureHandlers) {
  const startTouch = useRef<TouchPoint | null>(null)
  const lastTap = useRef<number>(0)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const initialDistance = useRef<number>(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      startTouch.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }

      if (handlers.onLongPress) {
        longPressTimer.current = setTimeout(() => {
          handlers.onLongPress?.()
        }, LONG_PRESS_DURATION)
      }
    } else if (e.touches.length === 2 && handlers.onPinch) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      initialDistance.current = Math.sqrt(dx * dx + dy * dy)
    }
  }, [handlers])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (e.touches.length === 2 && handlers.onPinch && initialDistance.current > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const scale = distance / initialDistance.current
      handlers.onPinch(scale)
    }
  }, [handlers])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (!startTouch.current || e.changedTouches.length === 0) return

    const touch = e.changedTouches[0]
    const endTouch: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    const deltaX = endTouch.x - startTouch.current.x
    const deltaY = endTouch.y - startTouch.current.y
    const deltaTime = endTouch.time - startTouch.current.time
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime

    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      const now = Date.now()
      if (now - lastTap.current < DOUBLE_TAP_DELAY && handlers.onDoubleTap) {
        handlers.onDoubleTap()
        lastTap.current = 0
      } else {
        lastTap.current = now
      }
    } else if (velocity > SWIPE_VELOCITY) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          if (deltaX > 0) {
            handlers.onSwipeRight?.()
          } else {
            handlers.onSwipeLeft?.()
          }
        }
      } else {
        if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
          if (deltaY > 0) {
            handlers.onSwipeDown?.()
          } else {
            handlers.onSwipeUp?.()
          }
        }
      }
    }

    startTouch.current = null
    initialDistance.current = 0
  }, [handlers])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

export function useTouchSwipe(element: HTMLElement | null, handlers: TouchGestureHandlers) {
  const gestures = useTouchGestures(handlers)

  useEffect(() => {
    if (!element) return

    element.addEventListener('touchstart', gestures.onTouchStart, { passive: true })
    element.addEventListener('touchmove', gestures.onTouchMove, { passive: true })
    element.addEventListener('touchend', gestures.onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', gestures.onTouchStart)
      element.removeEventListener('touchmove', gestures.onTouchMove)
      element.removeEventListener('touchend', gestures.onTouchEnd)
    }
  }, [element, gestures])
}
