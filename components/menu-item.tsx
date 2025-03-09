"use client";
import { useState, useRef, useEffect } from "react";
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
        : item.titleEng;

  const description =
    language === "kk"
      ? item.descriptionKaz
      : language === "ru"
        ? item.descriptionRus
        : item.descriptionEng;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      // Typically, desktop is considered width > 1024px
      setIsDesktop(window.innerWidth > 1024);
    };

    // Check device type on mount
    checkDeviceType();

    // Add event listener to handle window resize
    window.addEventListener('resize', checkDeviceType);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const handleImageClick = () => {
    // Only open modal on desktop
    if (isDesktop) {
      setIsModalOpen(true);
    }
  };

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
        {/* Image with conditional click behavior */}
        <div
          className="relative h-48 cursor-pointer"
          onClick={handleImageClick}
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