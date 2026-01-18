import { motion } from 'framer-motion'
import { Sparkle } from '@phosphor-icons/react'

export function LoadingFallback() {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="glass-panel p-8 text-center space-y-4 max-w-md flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkle size={32} weight="fill" className="text-accent" />
        </motion.div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
