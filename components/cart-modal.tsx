"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface CartItem {
  item: {
    id: string
    name: string
    price: number
    description: string
    image: string
    tag?: string
  }
  quantity: number
}

interface CartModalProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, change: number) => void
  open: boolean
  onClose: () => void
}

export function CartModal({ items, onUpdateQuantity, open, onClose }: CartModalProps) {
  const [showReceipt, setShowReceipt] = useState(false)
  const total = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0)

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{showReceipt ? "Ваш заказ" : "Корзина"}</DialogTitle>
        </DialogHeader>

        {showReceipt ? (
          <div className="space-y-4">
            <div className="border rounded-lg max-h-[60vh] overflow-auto">
              <table className="w-full">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-3">Название</th>
                    <th className="text-right p-3">Кол-во</th>
                    <th className="text-right p-3">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ item, quantity }) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">
                        <div>{item.name}</div>
                      </td>
                      <td className="text-right p-3">{quantity > 1 && `x${quantity}`}</td>
                      <td className="text-right p-3">
                        {formatPrice(item.price * quantity)}
                        {quantity > 1 && (
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} x {quantity}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t">
                    <td colSpan={2} className="p-3 font-medium">Итого:</td>
                    <td className="text-right p-3 font-medium">{formatPrice(total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Button className="w-full" onClick={() => setShowReceipt(false)}>
              В корзину
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[600px]">
            <div className="flex-1 overflow-auto pr-2 space-y-4">
              <AnimatePresence>
                {items.length > 0 ? (
                  items.map(({ item, quantity }, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 border rounded-xl bg-white shadow-sm"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-medium">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-4 text-center">{quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-8">
                    Корзина пуста
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-4 mt-4 border-t bg-white">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium">Полная стоимость</p>
                <p className="font-medium">{formatPrice(total)}</p>
              </div>
              <Button className="w-full" onClick={() => setShowReceipt(true)}>
                Показать официанту
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
