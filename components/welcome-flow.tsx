"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Input } from "./ui/input";

export function WelcomeFlow() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false); // Флаг загрузки

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "kk";
    i18n.changeLanguage(savedLanguage).then(() => setIsLanguageLoaded(true)); // Устанавливаем флаг после загрузки
  }, []);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
  };
 
  if (!isLanguageLoaded) return null;

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Первое модальное окно: Приветствие */}
      {step === 1 && (
        <Dialog open>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="sm:max-w-lg p-8 bg-gradient-to-r from-blue-100 to-white rounded-xl shadow-lg"
          >
            <div className="text-center">
              <Image
                src="/logo.svg"
                alt="Ак Кайын"
                width={150}
                height={150}
                className="mx-auto mb-4"
              />
              <h2 className="text-3xl font-extrabold text-blue-800 mb-4">
                {t("welcome")}
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                {t("welcomeMessage")}
              </p>
              <p className="text-gray-600 mb-4"> {t("language")} </p>
              <Select
                onValueChange={handleLanguageChange}
                defaultValue={i18n.language}
              >
                <SelectTrigger className="w-[140px] mx-auto border-blue-500 text-blue-700 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kk">Қазақша</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setStep(2)}// Блокируем кнопку, если номер столика не введен
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                {t("continue")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Второе модальное окно: 10% обслуживание */}
      {step === 2 && (
        <Dialog open>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{t("order")}</h2>
              <p className="text-gray-600 mb-6">{t("agreement")}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setStep(3)}>{t("yes")}</Button>
                <Button onClick={reloadPage} variant="destructive">
                  {t("no")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Третье модальное окно: Аренда тапчанов и беседок */}
      {step === 3 && (
        <Dialog open>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-blue-800 mb-4">
                {t("rent")}
              </h2>
              <p className="text-gray-700 text-lg mb-6">{t("agree")}</p>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => setStep(4)}>{t("yes")}</Button>
                <Button onClick={reloadPage} variant="destructive">
                  {t("no")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
