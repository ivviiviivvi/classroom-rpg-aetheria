import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface BackToTopProps {
  containerRef: React.RefObject<HTMLElement | null>
}

export function BackToTop({ containerRef }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsVisible(container.scrollTop > 300)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-8"
        >
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow bg-background/80 backdrop-blur-sm border border-border"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ArrowUp size={20} weight="bold" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
