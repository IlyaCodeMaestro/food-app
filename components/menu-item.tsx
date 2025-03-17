"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Star, Plus } from "lucide-react";

interface MenuItem {
  id: string;
  titleKaz: string;
  titleRus: string;
  titleEng: string;
  descriptionKaz: string;
  descriptionRus: string;
  descriptionEng: string;
  price?: number; // Сделал price необязательным, чтобы избежать ошибок
  image: string;
  tag?: string;
}

interface MenuItemProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuItem({ item, onAddToCart }: MenuItemProps) {
  if (!item) return null; // Проверка на случай, если item отсутствует

  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const title =
    language === "kk"
      ? item.titleKaz
      : language === "ru"
        ? item.titleRus
        : item.titleEng;
  const description =
    language === "kk"
      ? item.descriptionKaz
      : language === "ru"
        ? item.descriptionRus
        : item.descriptionEng;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => setIsDesktop(window.innerWidth > 1024);
    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      >
        <div
          className="relative w-full h-48 md:h-56 lg:h-64 cursor-pointer flex justify-center items-center bg-white"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={item.image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain rounded-lg"
          />
          {item.tag && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {t(`menu.${item.tag}`)}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">
              {(item.price ?? 0).toLocaleString()} ₸
            </span>
            <Button
              ref={buttonRef}
              onClick={() => {
                setIsAnimating(true);
                onAddToCart(item);
              }}
              size="sm"
              className="rounded-full cursor-pointer flex items-center"
              asChild
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <Plus className="w-5 h-5 mr-1" />
                {t("cart.addToCart")}
              </motion.button>
            </Button>
          </div>
        </div>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col items-center overflow-y-auto">
          <div className="relative w-full max-w-[90%] max-h-[80vh] flex justify-center">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={title}
              width={600}
              height={500}
              className="object-contain w-auto h-auto max-w-full max-h-full rounded-lg"
            />
          </div>
          <h3 className="font-semibold text-lg mt-4 text-center">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4 text-center">
            {description}
          </p>
          <span className="font-bold text-lg">
            {(item.price ?? 0).toLocaleString()} ₸
          </span>
        </DialogContent>
      </Dialog>
    </>
  );
}
