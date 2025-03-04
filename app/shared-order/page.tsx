"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { X } from "lucide-react"

interface SimplifiedItem {
  id: string
  t: string // title
  p: number // price
  q: number // quantity
}

interface CompactOrderData {
  i: SimplifiedItem[] // items
  t: string // tableNumber
  s: number // sum (total)
}

export default function SharedOrder() {
  const searchParams = useSearchParams()
  const [orderData, setOrderData] = useState<CompactOrderData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<string>("ru") // Default language

  useEffect(() => {
    try {
      // Get data parameter from URL
      const dataParam = searchParams.get("data")

      if (dataParam) {
        // Decode URL-encoded JSON and parse
        const jsonData = decodeURIComponent(dataParam)
        const parsedData = JSON.parse(jsonData) as CompactOrderData
        setOrderData(parsedData)
      } else {
        setError("Информация о заказе не найдена")
      }
    } catch (err) {
      console.error("Error decoding shared order data:", err)
      setError("Не удалось загрузить информацию о заказе")
    }
  }, [searchParams])

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`

  // Translations
  const translations = {
    ru: {
      "cart.yourOrder": "Ваш заказ",
      "cart.tableNumberLabel": "Номер вашего столика",
      "cart.name": "Название",
      "cart.quantity": "Кол-во",
      "cart.sum": "Сумма",
      "cart.total": "Итого",
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
      error: "Қате",
      loading: "Жүктелуде...",
    },
  }

  const t = (key: string) =>
    translations[language as keyof typeof translations][
      key as keyof (typeof translations)[keyof typeof translations]
    ] || key

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

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h1 className="text-xl font-bold text-center">{t("cart.yourOrder")}</h1>
        </div>

        {/* Отображение номера столика */}
        {orderData.t && (
          <div className="text-center bg-muted p-3">
            <span className="font-semibold text-lg">
              {t("cart.tableNumberLabel")}: {orderData.t}
            </span>
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
              {orderData.i.map((item) => (
                <tr key={item.id} className="border-t">
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
          <span>{formatPrice(orderData.s)}</span>
        </div>

        <div className="p-4 border-t flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguage("ru")}
              className={`px-3 py-1 rounded ${language === "ru" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              Русский
            </button>
            <button
              onClick={() => setLanguage("kk")}
              className={`px-3 py-1 rounded ${language === "kk" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              Қазақша
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

