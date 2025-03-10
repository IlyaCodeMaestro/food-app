"use client";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the subcategories for alcoholic beverages
const ALCOHOL_SUBCATEGORIES = [
  { value: "all", titleRus: "Все", titleKaz: "Барлығы", titleEng: "All" },
  { value: "wine", titleRus: "Вино", titleKaz: "Вино", titleEng: "Wine" },
  {
    value: "liqueur",
    titleRus: "Ликер",
    titleKaz: "Ликер",
    titleEng: "Liqueur",
  },
  {
    value: "champaign",
    titleRus: "Шампанское",
    titleKaz: "Шампанское",
    titleEng: "Champagne",
  },
  {
    value: "bottled_beer",
    titleRus: "Пиво бутылочное",
    titleKaz: "Шөлмектегі сыра",
    titleEng: "Bottled Beer",
  },
  {
    value: "draught_beer",
    titleRus: "Пиво разливное",
    titleKaz: "Құйылмалы сыра",
    titleEng: "Draught Beer",
  },
  {
    value: "vodka",
    titleRus: "Водка",
    titleKaz: "Водка",
    titleEng: "Vodka",
  },
  {
    value: "vermouth",
    titleRus: "Вермут",
    titleKaz: "Вермут",
    titleEng: "Vermouth",
  },
  { value: "rum", titleRus: "Ром", titleKaz: "Ром", titleEng: "Rum" },
  {
    value: "cognac",
    titleRus: "Коньяк",
    titleKaz: "Коньяк",
    titleEng: "Cognac",
  },
  {
    value: "brandy",
    titleRus: "Бренди",
    titleKaz: "Бренди",
    titleEng: "Brandy",
  },
  {
    value: "whiskey",
    titleRus: "Виски",
    titleKaz: "Виски",
    titleEng: "Whiskey",
  },
  { value: "gin", titleRus: "Джин", titleKaz: "Джин", titleEng: "Gin" },
  {
    value: "tequila",
    titleRus: "Текила",
    titleKaz: "Текила",
    titleEng: "Tequila",
  },
];

interface SubcategorySelectorProps {
  selectedSubcategory: string;
  onSelectSubcategory: (subcategory: string) => void;
  isVisible: boolean;
}

export function SubcategorySelector({
  selectedSubcategory,
  onSelectSubcategory,
  isVisible,
}: SubcategorySelectorProps) {
  const { i18n } = useTranslation();
  const language = i18n.language;

  if (!isVisible) return null;

  return (
    <div className="mb-4 w-full max-w-xs">
      <Select value={selectedSubcategory} onValueChange={onSelectSubcategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите подкатегорию" />
        </SelectTrigger>
        <SelectContent>
          {ALCOHOL_SUBCATEGORIES.map((subcategory) => (
            <SelectItem key={subcategory.value} value={subcategory.value}>
              {language === "kk"
                ? subcategory.titleKaz
                : language === "ru"
                  ? subcategory.titleRus
                  : subcategory.titleEng}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
