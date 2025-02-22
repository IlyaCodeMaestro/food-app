"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const VALID_PROMO_CODE = "7777777"

export function WelcomeFlow() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [showPromo, setShowPromo] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setShowPromo(true);
  };

  const showSuccessAlert = () => {
    alert("Промокод активирован! Поздравляем! Ваша скидка 10% успешно применена к заказу");
  };

  const showErrorAlert = () => {
    alert("Неверный промокод. Пожалуйста, проверьте правильность ввода и попробуйте еще раз");
  };

  const handlePromoSubmit = () => {
    if (promoCode.trim() === VALID_PROMO_CODE) {
      showSuccessAlert();
      setShowPromo(false);
      localStorage.setItem("hasSeenPromo", "true");
      localStorage.setItem("hasSeenWelcome", "true");
    } else {
      showErrorAlert();
    }
  };

  const handlePromoClose = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    setShowPromo(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Dialog
        open={showWelcome}
        onOpenChange={(open) => {
          if (!open) handleWelcomeClose()
        }}
      >
        <DialogContent 
          className="sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="text-center">
            <div className="mb-6">
              <Image src="/placeholder.svg" alt="Restaurant Logo" width={120} height={120} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Добро пожаловать в наше кафе</h2>
            <p className="text-gray-600 mb-6">Откройте для себя изысканный мир вкусов в Аққайын</p>
            <Button onClick={handleWelcomeClose} className="w-full">
              Продолжить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showPromo} 
        onOpenChange={(open) => {
          if (!open && !showConfirmation) {
            handlePromoClose()
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Специальное предложение</h2>
            <p className="text-gray-600 mb-6">
              Введите промокод и получите скидку 10% на ваш первый заказ
            </p>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Введите промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="text-center text-lg tracking-wider"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePromoSubmit()
                  }
                }}
              />
              <Button onClick={handlePromoSubmit} className="w-full">
                Применить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы упускаете возможность получить скидку 10% на ваш первый заказ
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>Остаться</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Продолжить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
