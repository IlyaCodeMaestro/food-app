"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const [showReceipt, setShowReceipt] = useState(false)
  const total = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0)

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{showReceipt ? t('cart.yourOrder') : t('cart.title')}</DialogTitle>
        </DialogHeader>

        {showReceipt ? (
          <div className="space-y-4">
            <div className="border rounded-lg max-h-[60vh] overflow-auto">
              <table className="w-full">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-3">{t('cart.name')}</th>
                    <th className="text-right p-3">{t('cart.quantity')}</th>
                    <th className="text-right p-3">{t('cart.sum')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ item, quantity }) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.name}</td>
                      <td className="text-right p-3">{quantity}</td>
                      <td className="text-right p-3">{formatPrice(item.price * quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center font-bold text-lg">
              <span>{t('cart.total')}:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex gap-2">
              <Button className=" w-full flex-1" onClick={() => setShowReceipt(false)}>
                {t('cart.continue')}
              </Button>
           
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('cart.empty')}
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[60vh] overflow-auto">
                  {items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="text-sm text-muted-foreground">{formatPrice(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-2">
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
                  ))}
                </div>

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>{t('cart.total')}:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button className="w-full" onClick={() => setShowReceipt(true)}>
                  {t('cart.checkout')}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
