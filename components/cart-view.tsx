"use client"

import { useState } from "react"
import { Minus, Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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

interface CartViewProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, change: number) => void
  onClose: () => void
}

export function CartView({ items, onUpdateQuantity, onClose }: CartViewProps) {
  const [showWaiter, setShowWaiter] = useState(false)
  const total = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0)

  if (showWaiter) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="max-w-lg mx-auto p-4">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setShowWaiter(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">Ваш заказ</h2>
          </div>

          <div className="space-y-4 mb-6">
            {items.map(({ item, quantity }) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.tag && (
                    <p className="text-sm text-gray-600">
                      {item.tag === "bestseller" ? "• Хит продаж" : "• По умолчанию"}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.price} ₸</p>
                  <p className="text-sm text-gray-600">x{quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
            <Button className="w-full" onClick={() => onClose()}>
              В корзину
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-lg mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold">Ваш заказ</h2>
        </div>

        <div className="space-y-4 mb-20">
          {items.map(({ item, quantity }) => (
            <div key={item.id} className="flex gap-4">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {item.tag && (
                      <p className="text-sm text-gray-600">
                        • {item.tag === "bestseller" ? "Хит продаж" : "По умолчанию"}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">{item.price} ₸</p>
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
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Полная стоимость</p>
              <p className="font-medium">{total} ₸</p>
            </div>
            <Button className="w-full" onClick={() => setShowWaiter(true)}>
              Показать официанту
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
