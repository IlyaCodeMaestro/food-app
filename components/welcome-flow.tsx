"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const VALID_PROMO_CODE = "7777777";

export function WelcomeFlow() {
  const { t, i18n } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ✅ Загружаем язык при первой загрузке
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "kk"; // Казахский по умолчанию
    i18n.changeLanguage(savedLanguage); // Устанавливаем язык
  }, []);

  useEffect(() => {
    console.log("⚡ useEffect() выполнен!");
    setShowWelcome(true); // Теперь окно открывается всегда
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    setShowPromo(true); // Открываем окно промокода
  };

  const handlePromoClose = () => {
    setShowPromo(false);
    setShowConfirmation(true); // Открываем подтверждение ТОЛЬКО при закрытии вручную
  };

  const handlePromoSubmit = () => {
    if (promoCode.trim() === VALID_PROMO_CODE) {
      alert("🎉 Промокод активирован! Ваша скидка 10% успешно применена.");
      setShowPromo(false);
      localStorage.setItem("hasSeenPromo", "true");
      localStorage.setItem("hasSeenWelcome", "true");
    } else {
      alert("❌ Неверный промокод. Проверьте правильность ввода.");
    }
  };

  const handleLanguageChange = (value: string) => {
    console.log("🌍 Выбран язык:", value);
    i18n.changeLanguage(value); // Мгновенное переключение языка
    localStorage.setItem("language", value); // ✅ Сохраняем в localStorage
  };

  return (
    <>
      {/* 🔹 Первое модальное окно (Welcome) */}
      <Dialog
        open={showWelcome}
        onOpenChange={(open) => open && setShowWelcome(true)}
      >
        <DialogContent
          className="sm:max-w-md [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()} // 🔒 Блокируем клик по пустому месту
          onEscapeKeyDown={(e) => e.preventDefault()} // 🔒 Блокируем закрытие по `Esc`
        >
          <div className="text-center">
            <div className="mb-6">
              <Image
                src="/placeholder.svg"
                alt="Restaurant Logo"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t("welcome")}</h2>
            <p className="text-gray-600 mb-6">{t("description")}</p>

            {/* Выбор языка */}
            <div className="flex flex-col items-center mb-4">
              <span className="text-sm text-muted-foreground mb-2">
                {t("language")}:
              </span>
              <Select
                onValueChange={handleLanguageChange}
                defaultValue={i18n.language}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kk">Қазақша</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleWelcomeClose} className="w-full mt-4">
              {t("continue")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 🔹 Второе модальное окно (Промокод) */}
      <Dialog
        open={showPromo}
        onOpenChange={(open) =>
          open ? setShowPromo(true) : handlePromoClose()
        }
      >
        <DialogContent className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}> 
          {/* Крестик (X) для закрытия второго окна */}
          <DialogClose asChild>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handlePromoClose}
            ></button>
          </DialogClose>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t("specialOffer")}</h2>
            <p className="text-gray-600 mb-6">{t("enterPromoCode")}</p>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder={t("enterPromoCodePlaceholder")}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="text-center text-lg tracking-wider"
                onKeyDown={(e) => e.key === "Enter" && handlePromoSubmit()}
              />
              <Button onClick={handlePromoSubmit} className="w-full">
                {t("apply")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
