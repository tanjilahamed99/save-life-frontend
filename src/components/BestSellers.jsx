'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import AddToCartButton from './AddToCartButton';

export default function BestSellers() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addToCart } = useCart();
  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const products = [
    {
      id: 1,
      name: 'Diazepam 10mg',
      price: 70,
      originalPrice: 85,
      category: 'Slaappillen',
      categories: ['Medicijnen', 'Slaappillen', 'Benzodiazepinen'],
      stock: 120,
      image: '/images/products/Diazepam10mg.webp',
    },
    {
      id: 2,
      name: 'Zolpidem 10mg',
      price: 70,
      originalPrice: 85,
      stock: 120,
      category: 'Medicijnen',
      categories: ['Medicijnen', 'Slaappillen'],
      image: '/images/products/Zolpidem10mg.webp',
    },
    {
      id: 3,
      name: 'Temazepam 20mg',
      price: 100,
      originalPrice: 120,
      stock: 50,
      category: 'Medicijnen',
      categories: ['Medicijnen', 'Slaappillen'],
      image: '/images/products/Temazepam20mg.webp',
    },
    {
      id: 4,
      name: 'Lorazepam 2.5mg',
      price: 70,
      originalPrice: 85,
      category: 'Medicijnen, Slaappillen',
      categories: ['Medicijnen', 'Slaappillen'],
      stock: 120,

      image: '/images/products/Lorazepam2mg.webp',
      updatedAt: new Date(),
    },
    {
      id: 5,
      name: 'Alprazolam 1mg',
      price: 70,
      originalPrice: 85,
      category: 'Medicijnen',
      categories: ['Medicijnen', 'Slaappillen'],
      stock: 120,
      image: '/images/products/Alprazolam1mg.webp',
      updatedAt: new Date(),
    },

    {
      id: 6,
      name: 'Bromazepam 6mg Tabletten',
      price: 50,
      originalPrice: 65,
      category: 'Medicijnen',
      categories: ['Medicijnen', 'Slaappillen', 'Benzodiazepinen'],
      stock: 28,
      image: '/images/products/Bromazepam6mg.webp',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Veel verkocht
            </h2>
            <p className="text-gray-600 mt-1">
              Bekijk hieronder een selectie van onze producten die veel worden
              verkocht!
            </p>
          </div>
          <div className="hidden md:flex space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${canScrollLeft
                ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${canScrollRight
                ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative" onScroll={checkScrollButtons}>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[250px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/product/${product.name
                    .toLowerCase()
                    .split(' ')
                    .join('-')}`}
                >
                  <div className="relative h-48 w-full bg-teal-50">
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className="object-contain p-4"
                      loading='lazy'
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 hover:text-teal-600 transition-colors line-clamp-2 h-12">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-end">
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          €{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-gray-900">
                        €{product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="mt-3">
                  <AddToCartButton
                    id={product?.id}
                    name={product?.name}
                    price={product?.price}
                    image={product?.image}
                    className="w-full text-xs py-1.5"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll buttons */}
          <div className="md:hidden flex justify-center mt-4 space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border ${canScrollLeft
                ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border ${canScrollRight
                ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
