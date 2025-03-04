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
import { deflate} from "pako";


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


const compressOrderData = (items: CartItem[], tableNumber: string, total: number) => {
  const json = JSON.stringify({ i: items, t: tableNumber, tt: total });
  const compressed = deflate(json); // Убираем { to: "string" }

  // Преобразуем Uint8Array в строку Base64
  return btoa(String.fromCharCode(...compressed));
};

export function CartModal({ items, onUpdateQuantity, open, onClose }: CartModalProps) {
  const { t, i18n } = useTranslation();
  const [showReceipt, setShowReceipt] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [shortUrl, setShortUrl] = useState<string>("");

  useEffect(() => {
    sessionStorage.removeItem("tableNumber");
  }, []);

  useEffect(() => {
    if (!tableNumber.trim() || items.length === 0) return;
    const fullUrl = `${window.location.origin}/shared-order?data=${compressOrderData(items, tableNumber, total)}`;
    
    fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(fullUrl)}`)
      .then((res) => res.json())
      .then((data) => setShortUrl(data.result.short_link))
      .catch((err) => console.error("Ошибка сокращения:", err));
  }, [items, tableNumber]);

  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableNumber(value);
    sessionStorage.setItem("tableNumber", value);
  };

  const total = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showReceipt ? t("cart.yourOrder") : t("cart.title")}
            <button onClick={onClose} className="absolute top-0 right-0 hover:bg-accent p-1 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        {showReceipt ? (
          <div className="space-y-6 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl">
                {shortUrl ? (
                  <QRCode value={shortUrl}  size={256} level="L" className="rounded-lg" />
                ) : (
                  <p>{t("cart.generatingQr")}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground px-4">{t("cart.scanQrCodeText")}</p>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>{t("cart.total")}:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button className="w-full" onClick={() => setShowReceipt(false)}>
              {t("cart.continue")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">{t("cart.empty")}</p>
            ) : (
              <>
                <div className="space-y-4 max-h-[60vh] overflow-auto">
                  {items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16">
                        <Image src={item.image || "/placeholder.svg"} alt={item.titleKaz} fill className="object-cover rounded-lg" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{i18n.language === "kk" ? item.titleKaz : item.titleRus}</h4>
                        <p className="text-sm text-muted-foreground">{i18n.language === "kk" ? item.descriptionKaz : item.descriptionRus}</p>
                        <div className="text-sm text-muted-foreground">{formatPrice(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center">{quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("cart.total")}:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Input type="text" placeholder={t("tableNumberLabel")} value={tableNumber} onChange={handleTableNumberChange} />
                <Button className="w-full" onClick={() => setShowReceipt(true)} disabled={!tableNumber.trim()}>
                  {t("cart.checkout")}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
