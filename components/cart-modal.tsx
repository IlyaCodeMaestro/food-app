"use client";
import React, { useState, useEffect } from "react";
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
          <div className="space-y-4">
            {/* Отображение номера столика в чеке */}
            {tableNumber && (
              <div className="text-center bg-muted p-3 rounded-lg">
                <span className="font-semibold text-lg">
                  {t("cart.tableNumberLabel")}: {tableNumber}
                </span>
              </div>
            )}
            <div className="border rounded-lg max-h-[60vh] overflow-auto">
              <table className="w-full">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-3">{t("cart.name")}</th>
                    <th className="text-right p-3">{t("cart.quantity")}</th>
                    <th className="text-right p-3">{t("cart.sum")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ item, quantity }) => {
                    const title =
                      i18n.language === "kk" ? item.titleKaz : item.titleRus;
                    return (
                      <tr key={item.id} className="border-t">
                        <td className="p-3">{title}</td>
                        <td className="text-right p-3">{quantity}</td>
                        <td className="text-right p-3">
                          {formatPrice(item.price * quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center font-bold text-lg">
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
                    const title =
                      i18n.language === "kk" ? item.titleKaz : item.titleRus;
                    const description =
                      i18n.language === "kk"
                        ? item.descriptionKaz
                        : item.descriptionRus;
                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.titleKaz}
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
                  />

                  <Button
                    className="w-full"
                    onClick={() => setShowReceipt(true)}
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
