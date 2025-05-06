'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { getUserWishlist } from '@/lib/user';
import { useCart } from '@/context/CartContext';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userWishlist = await getUserWishlist();
        setWishlist(userWishlist);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    // In a real app, you would call an API to remove the item
    setWishlist(wishlist.filter((item) => item.id !== productId));
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold">Mijn wishlist</h1>
        <p className="text-gray-600 mt-2">
          Producten die je hebt opgeslagen voor later
        </p>
      </div>

      {/* Wishlist Items */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="p-12 text-center">
            <Heart size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Je wishlist is leeg
            </h3>
            <p className="text-gray-600 mb-4">
              Voeg producten toe aan je wishlist om ze later terug te vinden
            </p>
            <Link
              href="/shop"
              className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Producten bekijken
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/6 mb-4 sm:mb-0">
                    <div className="relative h-24 w-24 bg-teal-50 rounded-md mx-auto">
                      <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>

                  <div className="sm:w-3/6 sm:pl-4">
                    <Link
                      href={`/product/${product.id}`}
                      className="font-medium text-gray-900 hover:text-teal-600"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-baseline mt-2">
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through text-sm mr-2">
                          €{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold">
                        €{product.price.toFixed(2)}
                      </span>

                    </div>

                    {product.stock > 0 ? (
                      <p className="text-green-600 text-sm mt-2">Op voorraad</p>
                    ) : (
                      <p className="text-red-600 text-sm mt-2">
                        Niet op voorraad
                      </p>
                    )}
                  </div>

                  <div className="sm:w-2/6 flex flex-col sm:items-end mt-4 sm:mt-0">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex items-center px-3 py-2 rounded-md ${product.stock === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-teal-600 text-white hover:bg-teal-700'
                          }`}
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        In winkelwagen
                      </button>

                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Verwijderen
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-3">
                      Toegevoegd op{' '}
                      {new Date(product.dateAdded).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
