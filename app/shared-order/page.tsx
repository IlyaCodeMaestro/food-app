"use client"

import { X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { inflate } from "pako"

interface SimplifiedItem {
  i: string // id
  t: string // title
  p: number // price
  q: number // quantity
}

interface OrderData {
  i: SimplifiedItem[] // items
  t: string // tableNumber
  s: number // sum (total)
  p?: number // part (номер части, если заказ разделен)
  tp?: number // totalParts (всего частей, если заказ разделен)
}

export default function SharedOrder() {
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [allOrderParts, setAllOrderParts] = useState<OrderData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<string>("ru") // Default language

  useEffect(() => {
    async function decodeOrderData() {
      try {
        const compressedData = searchParams.get("data")

        if (!compressedData) {
          setError("Order information not found")
          setLoading(false)
          return
        }

        // Декодируем из Base64
        try {
          const decoded = atob(compressedData)
          const byteArray = new Uint8Array([...decoded].map((c) => c.charCodeAt(0)))
          const jsonString = new TextDecoder().decode(inflate(byteArray))
          const parsedData: OrderData = JSON.parse(jsonString)

          setOrderData(parsedData)

          // Если это часть разделенного заказа, сохраняем в локальное хранилище
          if (parsedData.p && parsedData.tp && parsedData.tp > 1) {
            // Создаем уникальный ключ для заказа, используя номер столика и общую сумму
            const orderKey = `order_${parsedData.t}_${parsedData.s}`

            // Получаем существующие части заказа
            const storedPartsString = localStorage.getItem(orderKey)
            const storedParts: OrderData[] = storedPartsString ? JSON.parse(storedPartsString) : []

            // Добавляем или обновляем текущую часть
            const partIndex = storedParts.findIndex((part) => part.p === parsedData.p)
            if (partIndex >= 0) {
              storedParts[partIndex] = parsedData
            } else {
              storedParts.push(parsedData)
            }

            // Сохраняем обновленные части
            localStorage.setItem(orderKey, JSON.stringify(storedParts))
            setAllOrderParts(storedParts)
          }
        } catch (decodeError) {
          console.error("Error decoding data:", decodeError)
          setError("Failed to decode order data. The QR code may be damaged or invalid.")
          setLoading(false)
          return
        }
      } catch (err) {
        console.error("Error processing order:", err)
        setError("Failed to load order information")
      } finally {
        setLoading(false)
      }
    }

    decodeOrderData()
  }, [searchParams])

  // Объединяем все части заказа, если они есть
  const combinedOrderData = useMemo(() => {
    if (!orderData) return null

    // Если это не разделенный заказ или у нас только одна часть, возвращаем как есть
    if (!orderData.p || !orderData.tp || orderData.tp === 1) {
      return orderData
    }

    // Если у нас есть все части заказа
    if (allOrderParts.length === orderData.tp) {
      // Сортируем части по номеру
      const sortedParts = [...allOrderParts].sort((a, b) => (a.p || 0) - (b.p || 0))

      // Объединяем все товары
      const allItems = sortedParts.flatMap((part) => part.i || [])

      // Возвращаем объединенный заказ
      return {
        i: allItems,
        t: orderData.t,
        s: orderData.s,
      }
    }

    // Иначе возвращаем текущую часть
    return orderData
  }, [orderData, allOrderParts])

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`

  const translations = {
    ru: {
      "cart.yourOrder": "Ваш заказ",
      "cart.tableNumberLabel": "Номер вашего столика",
      "cart.name": "Название",
      "cart.quantity": "Кол-во",
      "cart.sum": "Сумма",
      "cart.total": "Итого",
      "cart.partialOrder": "Часть заказа",
      "cart.missingParts": "Отсканируйте остальные части заказа",
      "cart.scannedParts": "Отсканировано частей",
      error: "Ошибка",
      loading: "Загрузка...",
    },
    kk: {
      "cart.yourOrder": "Сіздің тапсырысыңыз",
      "cart.tableNumberLabel": "Үстел нөмірі",
      "cart.name": "Атауы",
      "cart.quantity": "Саны",
      "cart.sum": "Сомасы",
      "cart.total": "Барлығы",
      "cart.partialOrder": "Тапсырыс бөлігі",
      "cart.missingParts": "Тапсырыстың қалған бөліктерін сканерлеңіз",
      "cart.scannedParts": "Сканерленген бөліктер",
      error: "Қате",
      loading: "Жүктелуде...",
    },
  }

  const t = (key: string) =>
    translations[language as keyof typeof translations][
      key as keyof (typeof translations)[keyof typeof translations]
    ] || key

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-xl font-bold mb-2">{t("error")}</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!combinedOrderData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-xl font-bold mb-2">{t("error")}</h1>
          <p>No order data found</p>
        </div>
      </div>
    )
  }

  // Показываем информацию о частях заказа, если это разделенный заказ
  const isPartialOrder = orderData?.p && orderData?.tp && orderData.tp > 1
  const missingParts = isPartialOrder && allOrderParts.length < (orderData?.tp || 0)

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h1 className="text-xl font-bold text-center">
            {isPartialOrder && missingParts
              ? `${t("cart.partialOrder")} (${orderData?.p}/${orderData?.tp})`
              : t("cart.yourOrder")}
          </h1>
        </div>

        {combinedOrderData.t && (
          <div className="text-center bg-muted p-3">
            <span className="font-semibold text-lg">
              {t("cart.tableNumberLabel")}: {combinedOrderData.t}
            </span>
          </div>
        )}

        {isPartialOrder && (
          <div
            className={`text-center p-2 ${missingParts ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
          >
            {missingParts
              ? `${t("cart.missingParts")} (${allOrderParts.length}/${orderData?.tp})`
              : `${t("cart.scannedParts")}: ${allOrderParts.length}/${orderData?.tp}`}
          </div>
        )}

        <div className="border-t">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">{t("cart.name")}</th>
                <th className="text-right p-3">{t("cart.quantity")}</th>
                <th className="text-right p-3">{t("cart.sum")}</th>
              </tr>
            </thead>
            <tbody>
              {combinedOrderData.i.map((item, index) => (
                <tr key={`${item.i}-${index}`} className="border-t">
                  <td className="p-3">{item.t}</td>
                  <td className="text-right p-3">{item.q}</td>
                  <td className="text-right p-3">{formatPrice(item.p * item.q)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-between items-center font-bold text-lg">
          <span>{t("cart.total")}:</span>
          <span>{formatPrice(combinedOrderData.s)}</span>
        </div>
      </div>
    </div>
  )
}



