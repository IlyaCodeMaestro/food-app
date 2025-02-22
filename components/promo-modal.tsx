"use client"

import { useState, useEffect } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PromoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPromo = localStorage.getItem("hasSeenPromo")
      if (!hasSeenPromo) {
        setIsOpen(true)
        localStorage.setItem("hasSeenPromo", "true")
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Специальное предложение</h2>
          <p className="text-gray-600 mb-6 text-center">Получите скидку 10% на ваш первый заказ</p>
          <Input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Введите промокод"
            className="mb-4"
          />
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Применить
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

