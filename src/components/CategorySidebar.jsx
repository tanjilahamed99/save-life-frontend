"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CategorySidebar({
  priceRange,
  onPriceChange,
  categorySlug,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);

  const handleMinPriceChange = (e) => {
    const input = e.target.value;
    if (input === "") {
      setMinPrice(0);
      return;
    }
    const value = Number.parseInt(input);
    if (isNaN(value)) {
      return;
    }
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = Number.parseInt(e.target.value);
    setMaxPrice(value);
  };

  const applyPriceFilter = () => {
    onPriceChange([minPrice, maxPrice]);
  };

  const categories = [
    {
      name: "All Medicijnen",
      href: "/category/medicijnen",
    },
    {
      name: "All Erection",
      href: "/category/erection",
    },
  ];

  const recentProducts = [
    {
      id: 1,
      name: "Diazepam 10mg",
      price: 70,
      originalPrice: 85,
      category: "Slaappillen",
      categories: ["Medicijnen", "Slaappillen", "Benzodiazepinen"],
      stock: 120,
      image: "/images/products/Diazepam10mg.webp",
    },
    {
      id: 2,
      name: "Zolpidem 10mg",
      price: 70,
      originalPrice: 85,
      stock: 120,
      category: "Medicijnen",
      categories: ["Medicijnen", "Slaappillen"],
      image: "/images/products/Zolpidem10mg.webp",
    },
    {
      id: 3,
      name: "Temazepam 20mg",
      price: 100,
      originalPrice: 120,
      stock: 50,
      category: "Medicijnen",
      categories: ["Medicijnen", "Slaappillen"],
      image: "/images/products/Temazepam20mg.webp",
    },
    {
      id: 4,
      name: "Lorazepam 2.5mg",
      price: 70,
      originalPrice: 85,
      category: "Medicijnen, Slaappillen",
      categories: ["Medicijnen", "Slaappillen"],
      stock: 120,

      image: "/images/products/Lorazepam2mg.webp",
      updatedAt: new Date(),
    },
    // {
    //   id: 5,
    //   name: ' Alprazolam 1mg',
    //   price: 70,
    //   originalPrice: 85,
    //   category: 'Medicijnen',
    //   categories: ['Medicijnen', 'Slaappillen'],
    //   stock: 120,

    //   image: '/images/products/Alprazolam1mg.webp',
    //   updatedAt: new Date(),
    // },

    {
      id: 6,
      name: "Bromazepam 6mg Tabletten",
      price: 50,
      originalPrice: 65,
      category: "Medicijnen",
      categories: ["Medicijnen", "Slaappillen", "Benzodiazepinen"],
      stock: 28,

      image: "/images/products/Bromazepam6mg.webp",
    },
  ];

  return (
    <div className="space-y-8 sticky top-32">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-lg mb-4">Categorieën</h3>
        <ul className="space-y-2 ">
          {categories.map((category, index) => (
            <li key={index} className="border border-gray-200 rounded p-5">
              <Link
                href={category.href}
                className={`block text-sm hover:text-teal-600 ${
                  category.href.includes(categorySlug)
                    ? "font-medium text-teal-600"
                    : "text-gray-700"
                }`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <h3 className="font-bold text-lg">Prijs Filter</h3>
          {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {isFilterOpen && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-5/12">
                <label className="block text-sm text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  // value={minPrice}
                  defaultValue={0}
                  onChange={handleMinPriceChange}
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                  min="0"
                  max={maxPrice}
                />
              </div>
              <div className="text-gray-500">—</div>
              <div className="w-5/12">
                <label className="block text-sm text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  className="w-full border border-gray-300 rounded-md px-2 py-1"
                  min={minPrice}
                />
              </div>
            </div>

            <div className="relative h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="absolute h-2 bg-teal-500 rounded-full"
                style={{
                  left: `${(minPrice / 380) * 100}%`,
                  right: `${100 - (maxPrice / 380) * 100}%`,
                }}></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>€{minPrice}</span>
              <span>€{maxPrice || 0}</span>
            </div>

            <button
              onClick={applyPriceFilter}
              className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
              Filter
            </button>
          </div>
        )}
      </div>

      {/* Recent Products */}
      <div>
        <h3 className="font-bold text-lg mb-4">Recent Bekeken Producten</h3>
        <div className="space-y-4">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.name
                .toLowerCase()
                .split(" ")
                .join("-")}`}
              className="flex items-center">
              <div className="w-16 h-16 bg-teal-50 rounded-md relative flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  className="object-contain p-2"
                />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 hover:text-teal-600 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-sm font-bold text-gray-900">
                  €{product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
