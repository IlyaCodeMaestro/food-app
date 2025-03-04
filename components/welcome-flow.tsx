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


export function WelcomeFlow() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "kk";
    i18n.changeLanguage(savedLanguage).then(() => setIsLanguageLoaded(true));
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
      {step === 1 && (
        <Dialog open>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="sm:max-w-lg p-8 bg-gradient-to-r from-green-100 to-[#F4E1C1] rounded-xl shadow-lg"
          >
            <div className="text-center">
              <Image
                src="./preview.png"
                alt="Ак Кайын"
                width={150}
                height={150}
                className="mx-auto mb-4"
              />
              <h2 className="text-3xl font-extrabold text-green-800 mb-4">
                {t("welcome")}
              </h2>
              <p className="text-[#8B5A2B] text-lg mb-6">
                {t("welcomeMessage")}
              </p>
              <p className="text-[#6B8E23] mb-4"> {t("language")} </p>
              <Select
                onValueChange={handleLanguageChange}
                defaultValue={i18n.language}
              >
                <SelectTrigger className="w-[140px] mx-auto border-green-500 text-green-700 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kk">Қазақша</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                {t("continue")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {step === 2 && (
        <Dialog open>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-4">{t("order")}</h2>
              <p className="text-[#6B8E23] mb-6">{t("agreement")}</p>
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

      {step === 3 && (
        <Dialog open>
          <DialogContent
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-green-800 mb-4">
                {t("rent")}
              </h2>
              <p className="text-[#8B5A2B] text-lg mb-6">{t("agree")}</p>

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