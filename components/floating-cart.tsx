"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingCartProps {
  itemCount: number
  onClick: () => void
}

export function FloatingCart({ itemCount, onClick }: FloatingCartProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6 text-white" />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-white text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
              >
                {itemCount}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Button>
    </motion.div>
  )
}

