'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product?.image,
      quantity: 1,
    });

    toast.success(`${product?.name} toegevoegd aan winkelwagen`);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    )
    : 0;

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/product/${product.slug.toLowerCase().split(' ').join('-')}`}
        className="block relative"
      >
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
            <span className="bg-gray-900 text-white px-3 py-1 font-medium">
              Uitverkocht
            </span>
          </div>
        )}
        <div className="relative h-48 w-full bg-teal-50">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            loading='lazy'
            className="object-contain p-4"
          />
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-transparent bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Link
                href={`/product/${product.slug}`}
                className="bg-white p-2 rounded-full hover:bg-teal-600 hover:text-white transition-colors"
              >
                <Eye size={18} />
              </Link>
              <button
                onClick={handleAddToCart}
                className="bg-white p-2 rounded-full hover:bg-teal-600 hover:text-white transition-colors"
                disabled={product.stock === 0}
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        )}
      </Link>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 hover:text-teal-600 transition-colors line-clamp-2 h-12">
          <Link
            href={`/product/${product.name.toLowerCase().split(' ').join('-')}`}
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-end">
          {product?.originalPrice && (
            <span className="text-sm text-gray-500 line-through mr-2">
              €{product?.originalPrice?.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-gray-900">
            €{product?.price?.toFixed(2)}
          </span>

        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg transition-colors ${product.stock === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
        >
          {product.stock === 0 ? 'Uitverkocht' : 'In winkelwagen'}
        </button>
      </div>
    </div>
  );
}
