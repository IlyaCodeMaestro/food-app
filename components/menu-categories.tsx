import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  titleKaz?: string;
  titleRus?: string;
  titleEng?: string;
}

interface MenuCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function MenuCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: MenuCategoriesProps) {
  const { i18n } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    console.log("📂 Категории перед рендером:", categories);
  }, [categories]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const targetScroll =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`${
        isSticky
          ? "fixed top-0 left-0 w-full bg-background shadow-md z-20"
          : "relative"
      }`}
    >
      <div className="relative flex items-center gap-2 px-4 max-w-full">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-0 z-10"
            >
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-background shadow-md"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-2 py-2 px-2 no-scrollbar scroll-smooth"
          onScroll={checkScroll}
        >
          {categories.length > 0 ? (
            categories.map((category) => {
              const categoryTitle =
                i18n.language === "kk"
                  ? category.titleKaz || "Неизвестная категория"
                  : i18n.language === "ru"
                  ? category.titleRus || "Неизвестная категория"
                  : category.titleEng || "Unknown category";

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    onClick={() => onSelectCategory(category.id)}
                    className="whitespace-nowrap rounded-full"
                  >
                    {categoryTitle}
                  </Button>
                </motion.div>
              );
            })
          ) : (
            <p className="text-muted-foreground text-sm">
              Категории не найдены
            </p>
          )}
        </div>

        <AnimatePresence>
          {showRightArrow && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-0 z-10"
            >
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white shadow-md"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
