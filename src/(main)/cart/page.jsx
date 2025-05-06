"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Breadcrumb from "@/components/Breadcrumb";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, updateCartItemQuantity, removeFromCart } = useCart();
  const [error, setError] = useState("");
  const [discountPrice, setDiscountPrice] = useState(null);
  const router = useRouter();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.0 : 0;
  let total = subtotal + shipping;

  const handleQuantityChange = (productId, change, currentQuantity) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleDiscount = async (e) => {
    e.preventDefault();
    const discountCode = e.target.discountCode.value;

    try {
      const { data } = await axiosInstance.post("/orders/discount", {
        discountCode,
      });
      console.log(data);
      if (!data?.success) {
        setError(data?.message);
        return;
      }

      const discountAmount = (total * data?.discount) / 100;
      const discountPrice = total - discountAmount;
      setDiscountPrice(discountPrice);
      e.target.reset();
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigate = () => {
    localStorage.setItem("discountPrice", JSON.stringify(discountPrice));
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Winkelwagen", href: "/cart" }]} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 md:mt-6 mb-6 md:mb-8">
        Winkelwagen
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <p className="text-gray-600 mb-6">Je winkelwagen is leeg.</p>
          <Link
            href="/shop"
            className="inline-block bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
            Ga naar de shop
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          <div className="md:col-span-2">
            {/* Mobile Cart View (Shows on small screens) */}
            <div className="md:hidden space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center mb-3">
                    <div className="h-16 w-16 bg-teal-50 rounded-md relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <Link
                        href={`/product/${item.id}`}
                        className="font-medium text-gray-900 hover:text-teal-600 line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-gray-700 mt-1">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-500 p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, -1, item.quantity)
                        }
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
                        <Minus size={14} />
                      </button>
                      <span className="mx-3 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, 1, item.quantity)
                        }
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-medium">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Cart Table (Hidden on small screens) */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-4 px-4 md:px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-4 px-2 md:px-6 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Prijs
                    </th>
                    <th className="py-4 px-2 md:px-6 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Aantal
                    </th>
                    <th className="py-4 px-2 md:px-6 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Subtotaal
                    </th>
                    <th className="py-4 px-2 md:px-6 text-right text-sm font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex items-center">
                          <div className="h-16 w-16 bg-teal-50 rounded-md relative flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="ml-4">
                            <Link
                              href={`/product/${item.id}`}
                              className="font-medium text-gray-900 hover:text-teal-600">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 md:px-6 text-center">
                        <span className="text-gray-900">
                          €{item.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-2 md:px-6">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, -1, item.quantity)
                            }
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
                            <Minus size={14} />
                          </button>
                          <span className="mx-3 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, 1, item.quantity)
                            }
                            className="p-1 rounded-full border border-gray-300 hover:bg-gray-100">
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 md:px-6 text-right">
                        <span className="font-medium text-gray-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-2 md:px-6 text-right">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <form
                  onSubmit={handleDiscount}
                  className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-0">
                  <div>
                    <input
                      type="text"
                      placeholder="Kortingscode"
                      className="px-4 py-2 border border-gray-300 rounded-lg sm:rounded-r-none sm:rounded-l-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      name="discountCode"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-teal-700 transition-colors w-full sm:w-auto">
                    Toepassen
                  </button>
                </form>
                {error ? (
                  <h2 className="text-sm font-semibold text-red-700 mt-1">
                    {error}
                  </h2>
                ) : (
                  ""
                )}
              </div>

              <Link
                href="/shop"
                className="text-teal-600  hover:text-teal-700 font-medium flex items-center justify-center w-full sm:w-auto">
                <ArrowRight size={16} className="mr-1" />
                Verder winkelen
              </Link>
            </div>
          </div>

          <div className="md:col-span-1 mt-6 md:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Bestelsamenvatting</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotaal</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verzendkosten</span>
                  <span className="font-medium">€{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold">Totaal</span>
                  <span className="font-bold">
                    {discountPrice > 0 ? (
                      <div className="flex items-end gap-2">
                        <span className="text-base text-gray-500 line-through ">
                          €{total.toFixed(2)}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          €{discountPrice?.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      total.toFixed(2)
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleNavigate}
                className="w-full block text-center bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                Afrekenen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
