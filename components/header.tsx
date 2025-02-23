'use client';

import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">Аккайын</h1>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={onCartClick}
        >
          <span className="text-sm font-medium">{t('cart.label')}</span>
          <div className="relative cart-icon">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {cartItemCount}
              </motion.div>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}
