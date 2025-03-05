"use client"
import type React from "react"
import { useState, useEffect, useMemo } from "react"
import QRCode from "react-qr-code"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { X, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { deflate } from "pako"

interface CartItem {
  item: {
    id: string
    titleKaz: string
    titleRus: string
    descriptionKaz: string
    descriptionRus: string
    price: number
    image: string
    tag?: string
  }
  quantity: number
}

interface CartModalProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, change: number) => void
  open: boolean
  onClose: () => void
}

// Максимально оптимизируем структуру данных для уменьшения размера
const optimizeOrderData = (items: CartItem[], tableNumber: string, total: number) => {
  // Создаем минимальную структуру данных с короткими именами свойств
  const optimizedItems = items.map(({ item, quantity }) => ({
    i: item.id, // id
    t: item.titleRus, // title (только один язык)
    p: item.price, // price
    q: quantity, // quantity
  }))

  return { i: optimizedItems, t: tableNumber, s: total }
}

// Сжимаем данные максимально эффективно
const compressOrderData = (data: any): string => {
  const json = JSON.stringify(data)
  const compressed = deflate(json, { level: 9 }) // Максимальный уровень сжатия
  return btoa(String.fromCharCode.apply(null, Array.from(compressed)))
}

// Разделяем большие заказы на несколько QR-кодов
const splitOrderData = (items: CartItem[], tableNumber: string, total: number, maxItemsPerQR = 5) => {
  const chunks: CartItem[][] = []

  // Разделяем товары на группы
  for (let i = 0; i < items.length; i += maxItemsPerQR) {
    chunks.push(items.slice(i, i + maxItemsPerQR))
  }

  // Создаем оптимизированные данные для каждой группы
  return chunks.map((chunk, index) => {
    const optimizedData = optimizeOrderData(chunk, tableNumber, total)
    // Добавляем информацию о разделении
    return {
      ...optimizedData,
      p: index + 1, // part (номер части)
      tp: chunks.length, // totalParts (всего частей)
    }
  })
}

export function CartModal({ items, onUpdateQuantity, open, onClose }: CartModalProps) {
  const { t, i18n } = useTranslation()
  const [showReceipt, setShowReceipt] = useState(false)
  const [tableNumber, setTableNumber] = useState("")
  const [currentQRIndex, setCurrentQRIndex] = useState(0)
  const [qrSize, setQrSize] = useState(256)

  // Загружаем номер столика из sessionStorage
  useEffect(() => {
    const savedTableNumber = sessionStorage.getItem("tableNumber")
    if (savedTableNumber) {
      setTableNumber(savedTableNumber)
    }
  }, [])

  // Вычисляем общую сумму
  const total = items.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0)

  // Определяем, нужно ли разделять QR-код
  const needsSplitting = items.length > 5

  // Подготавливаем данные для QR-кода
  const qrData = useMemo(() => {
    if (!tableNumber.trim() || items.length === 0) return []

    if (needsSplitting) {
      // Разделяем на несколько QR-кодов
      return splitOrderData(items, tableNumber, total)
    } else {
      // Один QR-код для всего заказа
      const optimizedData = optimizeOrderData(items, tableNumber, total)
      return [optimizedData]
    }
  }, [items, tableNumber, total, needsSplitting])

  // Сжимаем текущие данные для QR-кода
  const currentQRValue = useMemo(() => {
    if (qrData.length === 0 || currentQRIndex >= qrData.length) return ""

    const compressed = compressOrderData(qrData[currentQRIndex])
    // Устанавливаем размер QR-кода в зависимости от длины данных
    const dataLength = compressed.length

    if (dataLength > 500) {
      setQrSize(400) // Очень большой QR для очень больших данных
    } else if (dataLength > 300) {
      setQrSize(350) // Большой QR для больших данных
    } else if (dataLength > 100) {
      setQrSize(300) // Средний QR
    } else {
      setQrSize(256) // Стандартный размер
    }

    return compressed
  }, [qrData, currentQRIndex])

  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTableNumber(value)
    sessionStorage.setItem("tableNumber", value)
  }

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`

  // Обработчики для навигации между QR-кодами
  const handlePrevQR = () => {
    setCurrentQRIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextQR = () => {
    setCurrentQRIndex((prev) => Math.min(qrData.length - 1, prev + 1))
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
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
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl">
                {currentQRValue ? (
                  <div className="flex flex-col items-center">
                    <QRCode
                      value={`${window.location.origin}/shared-order?data=${currentQRValue}`}
                      size={qrSize}
                      level="L" // Используем уровень L для меньшей плотности QR-кода
                      className="rounded-lg"
                    />

                    {needsSplitting && (
                      <div className="flex items-center justify-between w-full mt-4">
                        <Button variant="outline" size="sm" onClick={handlePrevQR} disabled={currentQRIndex === 0}>
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Назад
                        </Button>

                        <span className="text-sm text-muted-foreground">
                          {currentQRIndex + 1} из {qrData.length}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextQR}
                          disabled={currentQRIndex === qrData.length - 1}
                        >
                          Далее
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{t("cart.generatingQr")}</p>
                )}
              </div>
            </div>

            {needsSplitting && (
              <p className="text-sm text-amber-600 font-medium px-4">
                Ваш заказ разделен на {qrData.length} QR-кодов. Пожалуйста, отсканируйте все.
              </p>
            )}

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
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.titleKaz}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{i18n.language === "kk" ? item.titleKaz : item.titleRus}</h4>
                        <p className="text-sm text-muted-foreground">
                          {i18n.language === "kk" ? item.descriptionKaz : item.descriptionRus}
                        </p>
                        <div className="text-sm text-muted-foreground">{formatPrice(item.price)}</div>
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
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("cart.total")}:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Input
                  type="text"
                  placeholder={t("tableNumberLabel")}
                  value={tableNumber}
                  onChange={handleTableNumberChange}
                />
                <Button className="w-full" onClick={() => setShowReceipt(true)} disabled={!tableNumber.trim()}>
                  {t("cart.checkout")}
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

