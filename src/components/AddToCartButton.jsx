'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function AddToCartButton({
  id,
  name,
  price,
  image,
  quantity = 1,
  className = '',
}) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Convert price from string (€75.00) to number (75)
  const priceNumber =
    typeof price === 'string'
      ? Number.parseFloat(price.replace(/[^0-9.]/g, ''))
      : price;

  const handleAddToCart = () => {
    setIsAdding(true);

    addToCart({
      id,
      name,
      price: priceNumber,
      quantity,
      image,
    });

    // Show success message
    toast.success(`${name} toegevoegd aan winkelwagen`);

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`flex items-center cursor-pointer justify-center rounded-md bg-[#188687] px-4 py-2 text-white hover:bg-[#188687]/80 transition-colors ${
        isAdding ? 'opacity-75' : ''
      } ${className}`}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      <span>In winkelwagen</span>
    </button>
  );
}
