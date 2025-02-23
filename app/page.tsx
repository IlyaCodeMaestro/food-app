"use client"

import { useState, useEffect } from "react"
import { MenuCategories } from "@/components/menu-categories"
import { MenuItem } from "@/components/menu-item"
import { CartModal } from "@/components/cart-modal"
import { WelcomeFlow } from "@/components/welcome-flow"
import { Header } from "@/components/header"
import { MOCK_CATEGORIES, MOCK_ITEMS } from "@/lib/data"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(MOCK_CATEGORIES[0].id)
  const [cartItems, setCartItems] = useState<Array<{ item: any; quantity: number }>>([])
  const [showCart, setShowCart] = useState(false)

  // Clear localStorage for testing welcome modal
  useEffect(() => {
    localStorage.removeItem("hasSeenWelcome")
    localStorage.removeItem("hasSeenPromo")
  }, [])

  // Load cart items from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: any) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.item.id === item.id)
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.item.id === itemId) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter(Boolean) as typeof cartItems
      return updated
    })
  }

  const itemCount = cartItems.reduce((sum, { quantity }) => sum + quantity, 0)
  const filteredItems = MOCK_ITEMS.filter((item) => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-secondary">
      <WelcomeFlow />
      
      <Header 
        cartItemCount={itemCount}
        onCartClick={() => setShowCart(true)}
      />
      
      <main className="container mx-auto px-4 pb-24">
        <div className="py-4 mb-4">
          <MenuCategories
            categories={MOCK_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} onAddToCart={addToCart} />
          ))}
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
