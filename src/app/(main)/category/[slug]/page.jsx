"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
// import Breadcrumb from "@/components/breadcrumb"
// import ProductCard from "@/components/product-card"
// import CategorySidebar from "@/components/category-sidebar"
import { getProductsByCategory } from "@/lib/products";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 380]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryProducts = await getProductsByCategory(params.slug);
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.slug]);

  useEffect(() => {
    // Filter products by price range
    const filtered = products.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (featured)
        break;
    }

    setFilteredProducts(sorted);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, priceRange, sortBy]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
  };

  if (loading) {
    return (
      <div className="h-screen w-full mx-auto container px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          { label: "Zoektermen", href: "/category/zoektermen" },
          { label: params.slug, href: `/category/${params.slug}` },
        ]}
      />

      <div className="flex flex-col-reverse lg:flex-row gap-8 mt-6">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <CategorySidebar
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            categorySlug={params.slug}
          />
        </div>

        {/* Products */}
        <div className="lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold capitalize">
              {params.slug == "erection" ? "Erectiepillen" : params.slug} medicines
            </h1>

            <div className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-0">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2 hidden md:inline">
                  Sort by:
                </span>
                <span className="text-[11px] mr-2 text-gray-600 md:hidden">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                  <option value="default">Default sorting</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${viewMode === "grid" ? "bg-gray-200" : ""
                    }`}>
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${viewMode === "list" ? "bg-gray-200" : ""
                    }`}>
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-6 capitalize">
            {params.slug == "erection" ? "Erectiepillen" : params.slug} medicines
          </h2>

          {currentProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found.</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product?.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex border flex-col md:flex-row rounded-lg md:overflow-hidden">
                  <div className="md:w-1/3 bg-teal-50">
                    <div className="md:relative h-full">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        className="md:object-contain  w-[90%] mx-auto md:w-full p-4"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-4 flex flex-col">
                    <h3 className="font-medium text-lg mb-2">
                      <Link
                        href={`/product/${product.id}`}
                        className="hover:text-teal-600">
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-baseline mb-4">
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through text-sm mr-2">
                          €{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold">
                        €{product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {product.shortDescription ||
                        "Bekijk dit product voor meer informatie."}
                    </p>
                    <button className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors self-start">
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border ${currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-100"
                  }`}>
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === page
                      ? "bg-teal-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                      }`}>
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md border ${currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:bg-gray-100"
                  }`}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
