'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchIcon, XCircleIcon } from 'lucide-react';
import { products } from '@/lib/products';
import AddToCartButton from '@/components/AddToCartButton';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();

  const filteredProducts = products.filter((product) =>
    (product.name + product.shortDescription)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // Format price safely
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0.00';
    return typeof price === 'number' ? price.toFixed(2) : price.toString();
  };

  // Initialize query from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get('query');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Reset scroll position when filtering changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Product Zoeken
      </h1>

      {/* Responsive grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col bg-white">
              <Link
                href={`/product/${product.name
                  .toLowerCase()
                  .split(' ')
                  .join('-')}`}
                className="flex flex-col h-full p-4"
              >
                <div className="relative h-40 sm:h-48 mb-4 bg-gray-50 rounded flex items-center justify-center p-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={150}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="font-semibold text-lg line-clamp-2 mb-1">
                    {product.name}
                  </h2>
                </div>
                <p className="text-teal-600 font-medium text-lg">
                  €{formatPrice(product.price)}
                </p>
              </Link>
              <div className="p-4 pt-0 mt-auto">
                <AddToCartButton
                  id={product?.id}
                  name={product?.name}
                  price={product?.price}
                  image={product?.image}
                  className="w-full py-2 text-sm font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <SearchIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-xl font-medium text-gray-800 mb-2">
            Geen producten gevonden
          </p>
          <p className="text-gray-500 max-w-md">
            Probeer een andere zoekterm of controleer of u de juiste spelling
            heeft gebruikt.
          </p>
        </div>
      )}
    </div>
  );
}
