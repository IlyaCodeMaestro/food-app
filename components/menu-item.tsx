"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlyingItem } from "./flying-item"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  tag?: string
}

interface MenuItemProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export function MenuItem({ item, onAddToCart }: MenuItemProps) {
  const { t } = useTranslation()
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const handleAddToCart = () => {
    if (!buttonRef.current || isAnimating) return;
    
    const cartIcon = document.querySelector('.cart-icon')
    if (!cartIcon) {
      onAddToCart(item)
      return
    }

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const cartRect = cartIcon.getBoundingClientRect()
    
    setIsAnimating(true)
  }
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="relative h-48">
          <Image src={item.image || "/placeholder.svg"} alt={t(`dishes.${item.id}.name`)} fill className="object-cover" />
          {item.tag && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {t(`menu.${item.tag}`)}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{t(`dishes.${item.id}.name`)}</h3>
          <p className="text-muted-foreground text-sm mb-4">{t(`dishes.${item.id}.description`)}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">{item.price.toLocaleString()} ₸</span>
            <Button 
              ref={buttonRef}
              onClick={handleAddToCart} 
              size="sm" 
              className="rounded-full"
              disabled={isAnimating}
            >
              <Plus className="w-5 h-5 mr-1" />{t('cart.addToCart')}
            </Button>
          </div>
        </div>
      </motion.div>
      {isAnimating && (
        <FlyingItem
          imageUrl={item.image || "/placeholder.svg"}
          startPosition={{
            x: buttonRef.current!.getBoundingClientRect().left,
            y: buttonRef.current!.getBoundingClientRect().top
          }}
          endPosition={{
            x: document.querySelector('.cart-icon')!.getBoundingClientRect().right,
            y: document.querySelector('.cart-icon')!.getBoundingClientRect().top
          }}
          onComplete={() => {
            setIsAnimating(false)
            onAddToCart(item)
          }}
        />
      )}
    </>
  )
}
