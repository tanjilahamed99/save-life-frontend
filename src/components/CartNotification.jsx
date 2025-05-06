'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartNotification() {
  const { isCartOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 z-50 bg-teal-800 text-white px-4 py-3 rounded-md shadow-lg">
      Product succesvol toegevoegd aan de winkelwagen!
    </div>
  );
}
