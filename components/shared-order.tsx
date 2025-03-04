"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

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

export default function SharedOrder() {
  const { t, i18n } = useTranslation()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<CartItem[]>([])
  const [tableNumber, setTableNumber] = useState<string>("")
  const [total, setTotal] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Get parameters from URL
      const itemsParam = searchParams.get("items")
      const tableNumberParam = searchParams.get("tableNumber")
      const totalParam = searchParams.get("total")

      if (itemsParam) {
        const decodedItems = JSON.parse(decodeURIComponent(itemsParam)) as CartItem[]
        setItems(decodedItems)
      }

      if (tableNumberParam) {
        setTableNumber(tableNumberParam)
      }

      if (totalParam) {
        setTotal(Number(totalParam))
      }
    } catch (err) {
      console.error("Error parsing shared order data:", err)
      setError("Не удалось загрузить информацию о заказе")
    }
  }, [searchParams])

  const formatPrice = (price: number) => `${price.toLocaleString()} ₸`

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-xl font-bold mb-2">{t("error", "Ошибка")}</h1>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h1 className="text-xl font-bold text-center">{t("cart.yourOrder", "Ваш заказ")}</h1>
        </div>

        {/* Отображение номера столика */}
        {tableNumber && (
          <div className="text-center bg-muted p-3">
            <span className="font-semibold text-lg">
              {t("cart.tableNumberLabel", "Номер вашего столика")}: {tableNumber}
            </span>
          </div>
        )}

        <div className="border-t">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">{t("cart.name", "Название")}</th>
                <th className="text-right p-3">{t("cart.quantity", "Кол-во")}</th>
                <th className="text-right p-3">{t("cart.sum", "Сумма")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ item, quantity }) => {
                // Выбираем язык для отображения названия блюда
                const title = i18n.language === "kk" ? item.titleKaz : item.titleRus
                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{title}</td>
                    <td className="text-right p-3">{quantity}</td>
                    <td className="text-right p-3">{formatPrice(item.price * quantity)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-between items-center font-bold text-lg">
          <span>{t("cart.total", "Итого")}:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}

