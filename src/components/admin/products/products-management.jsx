"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import LoadingSpinner from "@/components/admin/loading-spinner";
import { deleteAdminProduct, getAdminProducts } from "@/lib/admin";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const productsPerPage = 10;
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/product/all");
        setProducts([...data?.products]);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const filters = {
          search: searchTerm,
          category: filterCategory,
          sort: sortBy,
        };

        let filterProducts = [...products];
        const noFilters = Object.keys(filters).length === 0;

        if (noFilters) {
          setFilteredProducts(products);
          setTotalCount(products?.length);
        } else {
          // Apply filters
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filterProducts = filterProducts.filter(
              (product) =>
                product?.name?.toLowerCase().includes(searchTerm) ||
                product?.sku?.toLowerCase().includes(searchTerm)
            );
          }

          if (filters.category) {
            filterProducts = filterProducts.filter(
              (product) => product.category === filters.category
            );
          }

          if (filters.stock === "inStock") {
            filterProducts = filterProducts.filter(
              (product) => product.stock > 0
            );
          } else if (filters.stock === "outOfStock") {
            filterProducts = filterProducts.filter(
              (product) => product.stock === 0
            );
          }

          if (filters.featured === true) {
            filterProducts = filterProducts.filter(
              (product) => product.featured
            );
          }

          // ✅ Correct Sorting on filterProducts
          if (filters.sort) {
            switch (filters.sort) {
              case "name_asc":
                filterProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
              case "name_desc":
                filterProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
              case "price_asc":
                filterProducts.sort((a, b) => a.price - b.price);
                break;
              case "price_desc":
                filterProducts.sort((a, b) => b.price - a.price);
                break;
              case "stock_asc":
                filterProducts.sort((a, b) => a.stock - b.stock);
                break;
              case "stock_desc":
                filterProducts.sort((a, b) => b.stock - a.stock);
                break;
              case "date_asc":
                filterProducts.sort(
                  (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
                );
                break;
              case "date_desc":
                filterProducts.sort(
                  (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
                );
                break;
              default:
                break;
            }
          }
        }

        setTotalCount(filterProducts.length);
        setFilteredProducts(filterProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [searchTerm, filterCategory, sortBy, products]);

  const handleDelete = async (productId) => {
    const toastId = toast.loading("Loading...");
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { data } = await axiosInstance.delete(
          `/product/delete/${productId}`
        );
        if (data?.result?.deletedCount > 0) {
          setTotalCount(totalCount - 1);
          setProducts(products.filter((product) => product._id !== productId));
          toast.success("Product Delete successfully!", {
            id: toastId,
            duration: 200,
          });
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))];

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(totalCount / productsPerPage);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/add"
          className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
          <Plus size={18} className="mr-1" />
          Add New Product
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 sm:w-auto">
            <SlidersHorizontal size={18} className="mr-2" />
            Filters & Sort
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none">
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Filter
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="stock_asc">Stock (Low to High)</option>
                <option value="stock_desc">Stock (High to Low)</option>
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                              src={
                                product.images?.[0] ||
                                "/placeholder.svg?height=80&width=80"
                              }
                              alt={product.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <div className="text-sm text-gray-900">€{product?.price?.toFixed(2)}</div> */}
                        <div className="text-sm text-gray-900">
                          €{product?.price}
                        </div>
                        {/* {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          €{product.originalPrice.toFixed(2)}
                        </div>
                      )} */}
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            €{product.originalPrice}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="text-teal-600 hover:text-teal-900">
                            <Edit size={16} />
                            <span className="sr-only">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden">
          <div className="divide-y">
            {currentProducts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No Products Found
              </div>
            ) : (
              currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 md:p-6 rounded-lg border border-gray-200 hover:shadow-sm transition-all bg-white">
                  <div className="flex justify-between items-start">
                    {/* Left side (Product Info) */}
                    <div className="space-y-1">
                      <Link
                        href={`/admin/orders/${product?._id || product?.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                        Product #{product?._id?.slice(-4) || product?.id}
                      </Link>
                      <div className="text-sm text-gray-700 font-medium truncate max-w-[250px]">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </div>
                    </div>

                    {/* Right side (Price Info) */}
                    <div className="text-right space-y-1">
                      <div className="text-sm font-semibold text-gray-900">
                        €{product?.price.toFixed(2)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          €{product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-end items-center space-x-3">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="text-teal-600 hover:text-teal-800 transition-colors">
                      <Edit size={18} />
                      <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 size={18} />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastProduct, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> products
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } mr-2`}>
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}>
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
