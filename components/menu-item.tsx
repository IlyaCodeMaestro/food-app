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
  descriptionKaz: string;
  descriptionRus: string;
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
  const title = language === "kk" ? item.titleKaz : item.titleRus;
  const description =
    language === "kk" ? item.descriptionKaz : item.descriptionRus;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

      {/* 🔍 Модальное окно для увеличенного изображения */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-3xl max-h-screen p-6 lg:p-8 xl:p-10 flex flex-col items-center justify-center rounded-lg overflow-auto bg-card" // ✅ Гарантируем центрирование
          onPointerDownOutside={(e) => e.preventDefault()} // ❌ Блокируем закрытие кликом вне окна
          onEscapeKeyDown={(e) => e.preventDefault()} // ❌ Блокируем закрытие по Esc
        >
          {/* ❌ Кнопка закрытия */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 text-gray-500 hover:text-gray-800 transition"
          ></button>

          {/* Увеличенное изображение */}
          <Image
            src={item.image || "/placeholder.svg"}
            alt={title}
            width={700} // ✅ Сделали ещё больше
            height={700}
            className="rounded-lg"
          />
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
