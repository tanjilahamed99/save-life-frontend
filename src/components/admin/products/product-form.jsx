"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "@/components/admin/loading-spinner";
import { getAdminProductById, updateAdminProduct } from "@/lib/admin";
import axiosInstance from "@/utils/axios";

export default function EditProduct({}) {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    category: "",
    featured: false,
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;

      try {
        const response = await axiosInstance.get(`/product/${params.id}`);
        const product = response?.data?.product;

        if (response?.data?.success && product) {
          setFormData({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            originalPrice: product.originalPrice?.toString() || "",
            stock: product.stock?.toString() || "",
            sku: product.sku || "",
            category: product.category || "",
            featured: product.featured || false,
            images: Array.isArray(product.images) ? [...product.images] : [],
          });
        }

        if (!product) {
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Auto-generate slug from name if slug is empty
    if (name === "name" && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert string values to appropriate types
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? Number.parseFloat(formData.originalPrice)
          : null,
        stock: Number.parseInt(formData.stock),
        images:
          formData.images.length > 0 ? formData.images : ["/placeholder.svg"],
      };

      const { data } = await axiosInstance.put(
        `/product/update/${params.id}`,
        productData
      );

      if (data?.success) {
        router.push("/admin/products");
        setSaving(false);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setSaving(false);
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const removeImageField = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="md:text-2xl text-xl font-bold">Edit Product</h1>
        <Link
          href="/admin/products"
          className="flex items-center text-sm md:text-base text-gray-600 hover:text-gray-900">
          <ArrowLeft size={18} className="mr-1" />
          Back to Products
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    URL-friendly version of the product name
                  </p>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div> */}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Inventory */}
            <div>
              <h2 className="text-lg font-medium mb-4">Pricing & Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (€)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty if there is no discount
                  </p>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div> */}
              </div>
            </div>

            {/* Organization */}
            <div>
              <h2 className="text-lg font-medium mb-4">Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the category slug (e.g., "2-cmc", "nep")
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 block text-sm text-gray-700">
                    Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Product Images</h2>
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center text-sm text-teal-600 hover:text-teal-700">
                  <Plus size={16} className="mr-1" />
                  Add Image
                </button>
              </div>

              {formData.images.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <p className="text-gray-500">
                    No images added yet. Click "Add Image" to add product
                    images.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData?.images?.map((image, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        placeholder="Image URL"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="md:ml-2 p-2 text-red-600 hover:text-red-800">
                        <X size={18} />
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Enter URLs for product images. The first image will be used as
                the main product image.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className=" px-2 md:px-4 text-sm md:text-base py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-3">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-2 md:px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-400">
            {saving ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
