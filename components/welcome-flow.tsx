"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const { t, i18n } = useTranslation()
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

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value)
  }

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
      <h2 className="text-2xl font-bold mb-4">{t('welcome')}</h2>
      <p className="text-gray-600 mb-6">{t('description')}</p>
      
      {/* Обертка для центрирования селекта */}
      <div className="flex flex-col items-center mb-4">
        <span className="text-sm text-muted-foreground mb-2">{t('language')}:</span>
        <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ru">Русский</SelectItem>
            <SelectItem value="kk">Қазақша</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleWelcomeClose} className="w-full mt-4">
        {t('continue')}
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
            <h2 className="text-2xl font-bold mb-4">{t('specialOffer')}</h2>
            <p className="text-gray-600 mb-6">
              {t('enterPromoCode')}
            </p>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder={t('enterPromoCodePlaceholder')}
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
                {t('apply')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('youAreMissingOutOnDiscount')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>{t('stay')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>{t('continue')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
