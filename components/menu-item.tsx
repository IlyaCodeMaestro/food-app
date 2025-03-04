"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Plus, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FlyingItem } from "./flying-item";
interface MenuItem {
  id: string;
  titleKaz: string;
  titleRus: string;
  titleEng: string;
  descriptionKaz: string;
  descriptionRus: string;
  descriptionEng: string;
  price: number;
  image: string;
  tag?: string;
}

interface MenuItemProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuItem({ item, onAddToCart }: MenuItemProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const title =
    language === "kk"
      ? item.titleKaz
      : language === "ru"
        ? item.titleRus
        : item.titleEng; // ✅ Теперь поддерживается английский

  const description =
    language === "kk"
      ? item.descriptionKaz
      : language === "ru"
        ? item.descriptionRus
        : item.descriptionEng; // ✅ Теперь поддерживается английский

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const handleAddToCart = () => {
    if (!buttonRef.current || isAnimating) return;
    const cartIcon = document.querySelector(".cart-icon");
    if (!cartIcon) {
      onAddToCart(item);
      return;
    }
    setIsAnimating(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      >
        {/* 🔍 Картинка, которая открывает модалку */}
        <div
          className="relative h-48 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={item.image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300"
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
              {item.price.toLocaleString()} ₸
            </span>

            <Button
              ref={buttonRef}
              onClick={handleAddToCart}
              size="sm"
              className="rounded-full"
              disabled={isAnimating}
            >
              <Plus className="w-5 h-5 mr-1" />
              {t("cart.addToCart")}
            </Button>
          </div>
        </div>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-6xl w-[95vw] sm:w-[90vw] md:w-[90vw] lg:w-[80vw] h-[90vh] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center rounded-lg bg-card relative overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 z-50 text-gray-500 hover:text-gray-800 transition-colors group"
          >
            <X
              className="h-6 w-6 stroke-current stroke-2 group-hover:rotate-90 transition-transform"
              strokeWidth={2}
            />
          </button>

          <div className="w-full h-full flex items-center justify-center relative">
            <div
              className={`w-full h-full flex items-center justify-center relative ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{
                  scale: isZoomed ? 2.5 : 1,
                  transformOrigin: "center center",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="w-full h-full flex items-center justify-center relative"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-contain w-full h-full max-w-full max-h-full rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 🛒 Анимация перелёта товара в корзину */}
      {isAnimating && (
        <FlyingItem
          imageUrl={item.image || "/placeholder.svg"}
          startPosition={{
            x: buttonRef.current!.getBoundingClientRect().left,
            y: buttonRef.current!.getBoundingClientRect().top,
          }}
          endPosition={{
            x: document.querySelector(".cart-icon")!.getBoundingClientRect()
              .right,
            y: document.querySelector(".cart-icon")!.getBoundingClientRect()
              .top,
          }}
          onComplete={() => {
            setIsAnimating(false);
            onAddToCart(item);
          }}
        />
      )}
    </>
  );
}
