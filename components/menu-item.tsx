"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        {item.tag === "bestseller" && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Хит продаж
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">{item.price.toLocaleString()} ₸</span>
          <Button onClick={() => onAddToCart(item)} size="sm" className="rounded-full">
            <Plus className="w-5 h-5 mr-1" />В корзину
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

