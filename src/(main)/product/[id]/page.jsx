"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/products";
import RelatedProducts from "@/components/RelatedProducts";
import Breadcrumb from "@/components/Breadcrumb";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  let discountPercentage = 0;

  useEffect(() => {
    if (typeof window !== undefined) {
      window.scrollTo(0, 0);
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(params.id);

        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    discountPercentage = product?.originalPrice
      ? Math.round(
          ((product?.originalPrice - product?.price) / product?.originalPrice) *
            100
        )
      : 0;
  }, [params.id]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Product niet gevonden</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          {
            label: product.category,
            href: `/category/${product.category.toLowerCase()}`,
          },
          {
            label: product.name,
            href: `/product/${product.slug.toLowerCase().split(" ").join("-")}`,
          },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* Product Images */}
        <div className="relative">
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}
          <div className="bg-teal-50 rounded-lg overflow-hidden">
            <div className="relative h-[400px] w-full">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex mt-4 space-x-2">
            <div className="border-2 border-teal-500 rounded-md overflow-hidden">
              <div className="relative h-20 w-20">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

          <div className="flex items-baseline mt-4">
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-lg mr-2">
                €{product?.originalPrice?.toFixed()}
              </span>
            )}
            <span className="text-2xl font-bold">
              €{product?.price?.toFixed(2)}
            </span>
          </div>

          <section className="mt-6">
            <p className="text-gray-600 mb-2">
              Categorieën: {product.categories?.join(", ")}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: product.shortDescription,
              }}
            />
          </section>

          <div className="flex items-center gap-2 mt-6">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 text-xl border-r border-gray-300">
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 text-xl border-l border-gray-300">
                +
              </button>
            </div>

            <div className="">
              <AddToCartButton
                id={product?.id}
                name={product?.name}
                price={product?.price}
                image={product?.image}
                className="w-full text-xs py-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <div className="flex sm:flex-row flex-col space-x-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-4 font-medium ${
                activeTab === "description"
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-600"
              }`}>
              Beschrijving
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="space-y-4 text-[#0e1703]">
              <div
                className="product-description"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        categoryId={product.category}
        currentProductId={product.id}
      />
    </div>
  );
}
