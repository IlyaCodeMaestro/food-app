"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface CartItem {
  item: {
    id: string
    name: string
    price: number
  }
  quantity: number
}

interface CartButtonProps {
  items: CartItem[]
}

export function CartButton({ items }: CartButtonProps) {
  const itemCount = items.reduce((total, { quantity }) => total + quantity, 0)
  const cartTotal = items.reduce((total, { item, quantity }) => total + item.price * quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Корзина</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          {items.map(({ item, quantity }) => (
            <div key={item.id} className="flex justify-between mb-4">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">x{quantity}</p>
              </div>
              <p className="font-medium">{item.price * quantity} ₸</p>
            </div>
          ))}
          {items.length > 0 ? (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <p>Итого:</p>
                <p>{cartTotal} ₸</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Корзина пуста</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

