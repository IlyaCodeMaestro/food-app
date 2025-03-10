"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { client, urlFor } from "@/sanity/client"
import { MenuCategories } from "@/components/menu-categories"
import { MenuItem } from "@/components/menu-item"
import { WelcomeFlow } from "@/components/welcome-flow"
import { Header } from "@/components/header"
import { CartModal } from "@/components/cart-modal"
import { SubcategorySelector } from "@/components/subcategory-selector"


// Updated query to include subcategory fields
const QUERY = `{
  "categories": *[_type == "category"]{ _id, titleKaz, titleRus, titleEng },
  "dishes": *[_type == "dish"]{
    _id,
    titleKaz,
    titleRus,
    titleEng,
    descriptionKaz,
    descriptionRus,
    descriptionEng,
    priceKZT,
    "image": image.asset->url,
    "category": category->{_id, titleKaz, titleRus, titleEng},
    subCategoryKaz,
    subCategoryRus,
    subCategoryEng
  }
}`

// Define the ID of the alcoholic beverages category
// You'll need to replace this with the actual ID from your Sanity data
const ALCOHOL_CATEGORY_ID = "alcohol-category-id" // Replace with your actual alcohol category ID

export default function Home() {
  const [categories, setCategories] = useState<any[]>([])
  const [dishes, setDishes] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [cartItems, setCartItems] = useState<Array<{ item: any; quantity: number }>>([])
  const [showCart, setShowCart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [alcoholCategoryId, setAlcoholCategoryId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const data = await client.fetch(QUERY)
        console.log("🚀 Получены данные из Sanity:", data)

        const categoriesData = data.categories.map((c: any) => ({
          id: c._id,
          titleKaz: c.titleKaz || "Категория без названия (KZ)",
          titleRus: c.titleRus || "Категория без названия (RU)",
          titleEng: c.titleEng || "Категория без названия (Eng)",
        }))

        setCategories(categoriesData)

        // Find alcohol category by checking if any dish has subcategories
        const dishesWithSubcategories = data.dishes.filter(
          (dish: any) => dish.subCategoryRus || dish.subCategoryKaz || dish.subCategoryEng,
        )

        if (dishesWithSubcategories.length > 0) {
          const alcoholCategory = dishesWithSubcategories[0].category?._id
          setAlcoholCategoryId(alcoholCategory)
          console.log("🍸 Найдена категория алкоголя:", alcoholCategory)
        }

        setDishes(data.dishes)
        console.log("✅ dishes после запроса:", data.dishes)
      } catch (error) {
        console.error("Ошибка загрузки данных:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("all")
  }, [selectedCategory])

  // Set first category when data is loaded
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id)
      console.log("🎯 Автоматически выбрана категория:", categories[0].id)
    }
  }, [categories, selectedCategory])

  const addToCart = useCallback((newItem: any) => {
    setCartItems((prev) => {
      const updatedCart = [...prev]
      const existingIndex = updatedCart.findIndex((i) => i.item.id === newItem._id)

      if (existingIndex !== -1) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1,
        }
      } else {
        updatedCart.push({
          item: {
            id: newItem._id,
            titleKaz: newItem.titleKaz,
            titleRus: newItem.titleRus,
            titleEng: newItem.titleEng,
            descriptionKaz: newItem.descriptionKaz,
            descriptionRus: newItem.descriptionRus,
            descriptionEng: newItem.descriptionEng,
            price: newItem.priceKZT,
            image: newItem.image,
            tag: newItem.tag,
          },
          quantity: 1,
        })
      }

      console.log("🛒 Обновленная корзина:", updatedCart)
      return updatedCart
    })
  }, [])

  const updateQuantity = useCallback((itemId: string, change: number) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.item.id === itemId) {
              const newQuantity = item.quantity + change
              return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
            }
            return item
          })
          .filter(Boolean) as typeof cartItems,
    )
  }, [])

  const itemCount = useMemo(() => cartItems.reduce((sum, { quantity }) => sum + quantity, 0), [cartItems])

  // Filter items by category and subcategory
  const filteredItems = useMemo(() => {
    if (!selectedCategory) {
      console.log("⚠️ Категория не выбрана, показываем все блюда")
      return dishes
    }

    let filtered = dishes.filter((item) => item.category?._id === selectedCategory)

    // Apply subcategory filter only for alcohol category and when a specific subcategory is selected
    if (selectedCategory === alcoholCategoryId && selectedSubcategory !== "all") {
      filtered = filtered.filter((item) => {
        return (
          item.subCategoryRus === selectedSubcategory ||
          item.subCategoryKaz === selectedSubcategory ||
          item.subCategoryEng === selectedSubcategory
        )
      })
    }

    console.log("✅ Отфильтрованные блюда:", filtered)
    return filtered
  }, [dishes, selectedCategory, selectedSubcategory, alcoholCategoryId])

  // Check if current category is alcohol category
  const isAlcoholCategory = selectedCategory === alcoholCategoryId

  return (
    <div className="min-h-screen bg-secondary">
      <WelcomeFlow />
      <Header cartItemCount={itemCount} onCartClick={() => setShowCart(true)} />
      <main className="container mx-auto px-4 pb-24">
        <div className="py-4 mb-4">
          {!isLoading && (
            <MenuCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}
        </div>

        {/* Subcategory selector - only visible for alcohol category */}
        <SubcategorySelector
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
          isVisible={isAlcoholCategory}
        />

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p>Загрузка...</p>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MenuItem
                key={item._id}
                item={{
                  ...item,
                  id: item._id,
                  image: item.image ? urlFor(item.image).url() : "/placeholder.svg",
                  price: item.priceKZT,
                }}
                onAddToCart={addToCart}
              />
            ))
          ) : (
            <p>Нет блюд в этой категории</p>
          )}
        </div>
      </main>
      <CartModal
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        open={showCart}
        onClose={() => setShowCart(false)}
      />
    </div>
  )
}

