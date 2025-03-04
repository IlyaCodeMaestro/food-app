"use client";
import type React from "react";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";

interface CartItem {
  item: {
    id: string;
    titleKaz: string;
    titleRus: string;
    descriptionKaz: string;
    descriptionRus: string;
    price: number;
    image: string;
    tag?: string;
  };
  quantity: number;
}

interface CartModalProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, change: number) => void;
  open: boolean;
  onClose: () => void;
}

const compressOrderData = (
  items: CartItem[],
  tableNumber: string,
  total: number
) => {
  const simplifiedItems = items.map(({ item, quantity }) => ({
    id: item.id,
    t: item.titleRus,
    p: item.price,
    q: quantity,
  }));

  const compactData = {
    i: simplifiedItems,
    t: tableNumber,
    s: total,
  };

  return encodeURIComponent(JSON.stringify(compactData));
};

export function CartModal({
  items,
  onUpdateQuantity,
  open,
  onClose,
}: CartModalProps) {
  const { t, i18n } = useTranslation();
  const [showReceipt, setShowReceipt] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    // Clear table number on page reload
    sessionStorage.removeItem("tableNumber");
  }, []);

  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableNumber(value);
    sessionStorage.setItem("tableNumber", value);
  };

  // Вычисляем общую сумму
  const total = items.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="relative">
            {showReceipt ? t("cart.yourOrder") : t("cart.title")}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 hover:bg-accent hover:rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        {showReceipt ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Улучшенный дизайн QR-кода */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl">
                  <QRCode
                    value={`${window.location.origin}/shared-order?data=${compressOrderData(items, tableNumber, total)}`}
                    size={256}
                    level="L"
                    className="rounded-lg"
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground px-4">
                {t("cart.scanQrCodeText")}
              </p>
            </div>

            <div className="flex justify-between items-center font-bold text-lg pt-4 border-t">
              <span>{t("cart.total")}:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex gap-2">
              <Button
                className="w-full flex-1"
                onClick={() => setShowReceipt(false)}
              >
                {t("cart.continue")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t("cart.empty")}
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[60vh] overflow-auto">
                  {items.map(({ item, quantity }) => {
                    // Выбираем язык
                    const title =
                      i18n.language === "kk" ? item.titleKaz : item.titleRus;
                    const description =
                      i18n.language === "kk"
                        ? item.descriptionKaz
                        : item.descriptionRus;
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {description}
                          </p>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-4 text-center">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>{t("cart.total")}:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder={t("tableNumberLabel")}
                    value={tableNumber}
                    onChange={handleTableNumberChange}
                    className="w-full"
                  />

                  <Button
                    className="w-full"
                    onClick={() => {
                      setShowReceipt(true);
                    }}
                    disabled={!tableNumber.trim()}
                  >
                    {t("cart.checkout")}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
