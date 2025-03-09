"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { client, urlFor } from "@/sanity/client";
import { MenuCategories } from "@/components/menu-categories";
import { MenuItem } from "@/components/menu-item";
import { WelcomeFlow } from "@/components/welcome-flow";
import { Header } from "@/components/header";
import { CartModal } from "@/components/cart-modal";
const QUERY = `{
  "categories": *[_type == "category"]{ _id, titleKaz, titleRus, titleEng }, // ✅ Теперь загружаем titleKaz и titleRus
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
    "category": category->{_id, titleKaz, titleRus, titleEng} // ✅ Теперь категории тоже имеют titleKaz и titleRus
  }
}`;

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cartItems, setCartItems] = useState<
    Array<{ item: any; quantity: number }>
  >([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ Добавляем состояние загрузки

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await client.fetch(QUERY);
        console.log("🚀 Получены данные из Sanity:", data);

        setCategories(
          data.categories.map((c: any) => ({
            id: c._id,
            titleKaz: c.titleKaz || "Категория без названия (KZ)",
            titleRus: c.titleRus || "Категория без названия (RU)",
            titleEng: c.titleEng || "Категория без названия (Eng)",
          }))
        );

        setDishes(data.dishes);
        console.log("✅ dishes после запроса:", data.dishes);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Устанавливаем первую категорию, когда загрузились данные
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].id);
      console.log("🎯 Автоматически выбрана категория:", categories[0].id);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (dishes.length > 0) {
      console.log("✅ Данные загружены, обновляем UI");
    }
  }, [dishes]);
  const addToCart = useCallback((newItem: any) => {
    setCartItems((prev) => {
      // Создаем копию текущего массива корзины
      const updatedCart = [...prev];

      // Ищем индекс уже добавленного товара
      const existingIndex = updatedCart.findIndex(
        (i) => i.item.id === newItem._id
      );

      if (existingIndex !== -1) {
        // Если товар уже есть, увеличиваем количество
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1,
        };
      } else {
        // Если товара нет, добавляем новый
        updatedCart.push({
          item: {
            id: newItem._id,
            titleKaz: newItem.titleKaz,
            titleRus: newItem.titleRus,
            descriptionKaz: newItem.descriptionKaz,
            descriptionRus: newItem.descriptionRus,
            price: newItem.priceKZT,
            image: newItem.image,
            tag: newItem.tag,
          },
          quantity: 1,
        });
      }

      console.log("🛒 Обновленная корзина:", updatedCart);
      return updatedCart;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, change: number) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.item.id === itemId) {
              const newQuantity = item.quantity + change;
              return newQuantity > 0
                ? { ...item, quantity: newQuantity }
                : null;
            }
            return item;
          })
          .filter(Boolean) as typeof cartItems
    );
  }, []);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, { quantity }) => sum + quantity, 0),
    [cartItems]
  );
  const filteredItems = useMemo(() => {
    if (!selectedCategory) {
      console.log("⚠️ Категория не выбрана, показываем все блюда");
      return dishes;
    }
    console.log("✅ Фильтруем блюда:", dishes);
    return dishes.filter((item) => item.category?._id === selectedCategory);
  }, [dishes, selectedCategory]);

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
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p>Загрузка...</p> // ✅ Показываем загрузку, пока данные не пришли
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              console.log("🧐 item:", item);
              return (
                <MenuItem
                  key={item._id}
                  item={{
                    ...item,
                    image: urlFor(item.image).url(),
                    price: item.priceKZT,
                  }}
                  onAddToCart={addToCart}
                />
              );
            })
          ) : (
            <p>Нет блюд в этой категории</p> // Если блюд нет, показываем сообщение
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
  );
}
