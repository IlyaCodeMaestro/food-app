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

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
  };

  if (!isLanguageLoaded) return null;

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Переключатель языка */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="bg-gray-700 text-white px-3 py-1 rounded-lg shadow-md hover:bg-gray-800" onClick={() => handleLanguageChange('ru')}>RU</button>
        <button className="bg-gray-700 text-white px-3 py-1 rounded-lg shadow-md hover:bg-gray-800" onClick={() => handleLanguageChange('kk')}>KK</button>
      </div>

      {/* Приветственное окно */}
      {step === 1 && (
        <Dialog open>
          <DialogContent className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-xl">
            <div className="text-center">
              <Image src="./preview.png" alt="Ак Кайын" width={150} height={150} className="mx-auto mb-4" />
              <h2 className="text-4xl font-extrabold drop-shadow-lg">{t("welcome")}</h2>
              <p className="mt-4 text-lg">{t("welcomeMessage")}</p>
              <p className="text-[#d8d0d5] mt-4 mb-4"> {t("language")} </p>
              <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
                <SelectTrigger className="w-[140px] mx-auto border-green-500 text-green-700 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kk">Қазақша</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-4 bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-100" onClick={() => setStep(2)}>{t("continue")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Объединённое окно с правилами и условиями */}
      {step === 2 && (
        <Dialog open>
          <DialogContent className="bg-gray-800 text-white p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-yellow-400">{t("know")}</h2>

            <ul className="mt-2 space-y-2 text-sm">
              <li>{t("workingHours")}</li>
              <li>{t("menuOrder")}</li>
              <li> {t("serviceCharge")}</li>
              <li>{t("rentalInfo")}</li>
              <li className="flex items-center gap-2 flex-wrap"> {t('dishBreakage')}</li>
            </ul>
            <p className="text-lg font-bold text-red-500 mt-2">{t("agreement")}</p>
            <div className="flex gap-4 justify-center mt-4">
              <Button className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600" onClick={() => setStep(3)}>{t("yes")}</Button>
              <Button className="bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700" onClick={reloadPage}>{t("no")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Окно с ценами на аренду */}
      {step === 3 && (
  <Dialog open>
  <DialogContent className="bg-gray-900 text-white p-4 md:p-6 rounded-lg shadow-xl border border-gray-700 animate-fadeIn max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] overflow-y-auto">

      <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-400 flex items-center gap-2">
        🏠 {t("rent")}
      </h2>

      <ul className="mt-2 space-y-2 md:space-y-3 text-sm md:text-base">
      <li className="flex items-center gap-2 flex-wrap"><span className="text-red-500">♨️</span> {t('grillHouse')} </li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-blue-500">🎤</span> {t('karaokeDeposit')} </li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-cyan-400">🔥</span> {t('sauna')} </li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-gray-400">🛖</span> {t('smallTapchan')}</li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-green-500">🛖</span> {t('mediumTapchan')}</li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-red-400">🎪</span> {t('bigGazebo')}</li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-orange-400">VIP</span> {t('vipGazebo')}</li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-pink-400">VIP</span> {t('vipCabin')}</li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-yellow-500">VIP</span> {t('vipHall')}</li>
      <li className="flex items-center gap-2 flex-wrap"><span className="text-purple-500">VIP</span> {t('vipTapchan')} </li>

    </ul>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 md:mt-4">
      <p className="text-[#8B5A2B] text-base md:text-lg mb-4 md:mb-6 italic text-center">{t("agree")}</p>
        <Button className="bg-green-500 text-white px-4 md:px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 w-full sm:w-auto" onClick={() => setStep(4)}>
          {t("yes")}
        </Button>
        <Button className="bg-gray-700 text-white px-4 md:px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-transform transform hover:scale-105 w-full sm:w-auto" onClick={reloadPage}>
          {t("no")}
        </Button>
      </div>
    </DialogContent>
  </Dialog>

)}
    </>
  );
}