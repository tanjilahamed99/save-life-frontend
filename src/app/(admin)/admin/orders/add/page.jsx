"use client";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { products } from "@/lib/products";
import { toast } from "sonner";

const AddOrders = ({}) => {
  const Products = products;
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Nederland",
      paymentMethod: "ideal",
      sameAsBilling: true,
      notes: "",
      shippingMethod: "standard",
    },
  });

  const [selectedProductItems, setSelectedProductItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
  });
  // Calculate order summary whenever selected products change
  useEffect(() => {
    const subtotal = selectedProductItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * parseFloat(item.quantity),
      0
    );

    //   console.log()

    // Determine shipping cost based on selected method
    const shippingMethod = watch("shippingMethod");
    const shippingCost = 5;

    setOrderSummary({
      subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost,
    });
  }, [selectedProductItems, watch]);

  const onSubmit = async (formData) => {
    if (selectedProductItems.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      // Prepare items for API
      const items = selectedProductItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image,
      }));

      const orderData = {
        ...formData,
        items,
        subtotal: orderSummary.subtotal,
        shipping: orderSummary.shipping,
        total: orderSummary.total,
                site: "https://benzobestellen.com",
        status: "pending",
        orderDate: new Date().toISOString(),
      };
            const {data} = await axiosInstance.post(
              "/orders/create-custom",
              orderData
      );
        if (data.status) {
          toast.success("Order created successfully!");
          router.push("/admin/orders");
        } else {
          toast.error(
            "Failed to create order: " +
              (data.message || "Unknown error")
          );
        }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(
        "Error creating order: " + (error.message || "Unknown error")
      );
    }
  };

  const handleProductChange = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setSelectedProductItems([]);
      return;
    }

    // Get the newly selected products
    const newSelectedIds = selectedOptions.map((option) => option.value);
    const currentSelectedIds = selectedProductItems.map((item) => item.id);

    // Find products that were just added
    const newlyAddedIds = newSelectedIds.filter(
      (id) => !currentSelectedIds.includes(id)
    );

    // Keep existing products with their quantities
    const existingProducts = selectedProductItems.filter((item) =>
      newSelectedIds.includes(item.id)
    );

    // Add newly selected products with quantity 1
    const newProducts = newlyAddedIds.map((id) => {
      const product = products.find((p) => p.id === id);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
    });

    setSelectedProductItems([...existingProducts, ...newProducts]);
  };

  const updateProductQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setSelectedProductItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedProductItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Map products into the format expected by react-select
  const productOptions = Products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Add New Order</h1>
        <Link
          href="/admin/orders"
          className="flex items-center text-sm md:text-base text-gray-600 hover:text-gray-900">
          <ArrowLeft size={18} className="mr-1" />
          Back to Orders
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 bg-white rounded-lg shadow overflow-hidden p-6">
        {/* Left Column - Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Selection */}
          <div className="">
            <h3 className="text-xl font-medium mb-4">Product Selection</h3>
            <div className="space-y-4">
              <div className="relative">
                <Select
                  isMulti
                  options={productOptions}
                  value={productOptions.filter((option) =>
                    selectedProductItems.some(
                      (item) => item.id === option.value
                    )
                  )}
                  onChange={handleProductChange}
                  className="text-sm text-gray-700"
                  classNamePrefix="select"
                  placeholder="Select products"
                  closeMenuOnSelect={false}
                  isSearchable={true}
                />
              </div>

              {/* Selected Products List */}
              {selectedProductItems.length > 0 && (
                <div className="mt-4">
                  {/* Table view for large devices */}
                  <div className="hidden lg:block border border-teal-700/20 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-teal-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Product</th>
                          <th className="px-4 py-2 text-center">Price</th>
                          <th className="px-4 py-2 text-center">Quantity</th>
                          <th className="px-4 py-2 text-right">Total</th>
                          <th className="px-4 py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProductItems.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-purple-700/20">
                            <td className="px-4 py-3 text-left">
                              <div className="flex items-center">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded mr-2"
                                  />
                                )}
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              €{item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateProductQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white">
                                  <Minus className="h-4 w-4" />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateProductQuantity(
                                      item.id,
                                      Number.parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-12 mx-2 text-center bg-white text-black border border-purple-700/30 rounded-md "
                                  min="1"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateProductQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              €{(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeProduct(item.id)}
                                className="p-1 text-red-400 hover:text-red-300">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Card view for small devices */}
                  <div className="lg:hidden space-y-4">
                    {selectedProductItems.map((item) => (
                      <div
                        key={item.id}
                        className="border border-teal-700/20 bg-teal-50 rounded-lg p-4 text-black">
                        <div className="flex items-center mb-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded mr-3"
                            />
                          )}
                          <div>
                            <h4 className="md:text-lg font-semibold">
                              {item.name}
                            </h4>
                            <p className="text-sm text-black">
                              €{item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm">Quantity:</span>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                updateProductQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              className="p-1 rounded-md bg-teal-800/50 hover:bg-teal-700/50">
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateProductQuantity(
                                  item.id,
                                  Number.parseInt(e.target.value) || 1
                                )
                              }
                              className="w-12 mx-2 text-center bg-white text-black border border-teal-700/30 rounded-md"
                              min="1"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateProductQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              className="p-1 rounded-md bg-teal-800/50 hover:bg-teal-700/50">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm mb-3">
                          <span>Total:</span>
                          <span className="font-semibold">
                            €{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => removeProduct(item.id)}
                            className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4 inline" />
                            <span className="ml-1 text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="">
            <h3 className="text-xl font-medium mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium">
                  Voornaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName", {
                    required: "Voornaam is verplicht",
                  })}
                  className={`w-full rounded-md border ${
                    errors.firstName
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium">
                  Achternaam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName", {
                    required: "Achternaam is verplicht",
                  })}
                  className={`w-full rounded-md border ${
                    errors.lastName
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "E-mail is verplicht",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ongeldig e-mailadres",
                    },
                  })}
                  className={`w-full rounded-md border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium">
                  Telefoonnummer <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone", {
                    required: "Telefoonnummer is verplicht",
                  })}
                  className={`w-full rounded-md border ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-1 block text-sm font-medium">
                  Adres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  {...register("address", { required: "Adres is verplicht" })}
                  className={`w-full rounded-md border ${
                    errors.address
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium">
                  Plaats <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  {...register("city", { required: "Plaats is verplicht" })}
                  className={`w-full rounded-md border ${
                    errors.city
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-1 block text-sm font-medium">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  {...register("postalCode", {
                    required: "Postcode is verplicht",
                  })}
                  className={`w-full rounded-md border ${
                    errors.postalCode
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-1 block text-sm font-medium">
                  Land <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  {...register("country", { required: "Land is verplicht" })}
                  className={`w-full rounded-md border ${
                    errors.country
                      ? "border-red-500"
                      : "border-gray-300 text-black"
                  } px-4 py-2 text-sm`}>
                  <option value="Nederland">Nederland</option>
                  <option value="België">België</option>
                  <option value="Luxemburg">Luxemburg</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="mb-1 block text-sm font-medium">
                  Opmerkingen
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  {...register("notes")}
                  className="w-full rounded-md border border-gray-300 text-black px-4 py-2 text-sm"
                  placeholder="Speciale instructies of opmerkingen voor deze bestelling"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary & Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="">
            <h3 className="text-xl font-medium mb-4">Order Summary</h3>

            {selectedProductItems.length === 0 ? (
              <div className="text-center py-6 text-black">
                No products selected
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {selectedProductItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span>€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-purple-700/30 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{orderSummary.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>€{orderSummary.shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-purple-700/30">
                    <span>Total</span>
                    <span>€{orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Shipping Method */}
          <div className="">
            <h3 className="text-xl font-medium mb-4">Shipping Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-teal-700/30 rounded-lg cursor-pointer hover:bg-teal-50">
                <input
                  type="radio"
                  value="standard"
                  {...register("shippingMethod")}
                  className="mr-3 h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="font-medium">Standard Shipping</div>
                  <div className="text-sm text-black">2-4 business days</div>
                </div>
                <div className="ml-auto">€5.00</div>
              </label>

              {/* <label className="flex items-center p-3 border border-purple-700/30 rounded-lg cursor-pointer hover:bg-purple-800/30">
                    <input
                      type="radio"
                      value="express"
                      {...register('shippingMethod')}
                      className="mr-3 h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-medium">Express Shipping</div>
                      <div className="text-sm text-purple-300">
                        1-2 business days
                      </div>
                    </div>
                    <div className="ml-auto">€9.95</div>
                  </label> */}
            </div>
          </div>

          {/* Payment Method */}
          <div className="">
            <h3 className="text-xl font-medium mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-teal-700/30 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors">
                <input
                  type="radio"
                  value="ideal"
                  {...register("paymentMethod", {
                    required: "Selecteer een betaalmethode",
                  })}
                  className="mr-3 h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="font-medium">iDEAL</div>
              </label>

              <label className="flex items-center p-3 border border-teal-700/30 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors">
                <input
                  type="radio"
                  value="paypal"
                  {...register("paymentMethod")}
                  className="mr-3 h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="font-medium">PayPal</div>
              </label>

              <label className="flex items-center p-3 border border-teal-700/30 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors">
                <input
                  type="radio"
                  value="creditcard"
                  {...register("paymentMethod")}
                  className="mr-3 h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="font-medium">Credit Card</div>
              </label>

              <label className="flex items-center p-3 border border-teal-700/30 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors">
                <input
                  type="radio"
                  value="banktransfer"
                  {...register("paymentMethod")}
                  className="mr-3 h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="font-medium">Bank Transfer</div>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-xs text-red-500">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting || selectedProductItems.length === 0}
              className={`w-full rounded-md text-white px-6 py-3 font-medium transition-colors flex items-center justify-center ${
                isSubmitting || selectedProductItems.length === 0
                  ? " cursor-not-allowed opacity-70  text-white rounded-md bg-teal-700 transition-colors"
                  : "bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-400"
              }`}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verzenden...
                </>
              ) : (
                "Plaats bestelling"
              )}
            </button>
            {selectedProductItems.length === 0 && (
              <p className="text-center text-sm text-red-400 mt-2">
                Please select at least one product
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddOrders;
