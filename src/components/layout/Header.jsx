"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBagTwoTone } from "@mui/icons-material";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, loading, refreshUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  const cartTotal = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Function to determine if a link is active
  const isActive = (path) => {
    return pathname === path;
  };

  // Get the active class based on whether the link is active
  const getLinkClass = (path) => {
    return isActive(path)
      ? "text-teal-500 font-medium"
      : "text-gray-700 hover:text-teal-600 font-medium";
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchText)}`);

      setSearchText("");
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-44">
              <Image
                src="/images/benzobestellen-logo.svg"
                alt="Benzobestellen Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="To search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-teal-600">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {user?.role === "order_manager" && (
              <Link
                href="/admin/orders"
                className={`flex items-center text-sm font-medium ${
                  isActive("/orders")
                    ? "text-teal-500"
                    : "text-gray-700 hover:text-teal-600"
                }`}>
                <ShoppingBagTwoTone size={20} className="mr-1" />
                <span>Dashboard</span>
              </Link>
            )}
            {user?.role === "admin" ? (
              <Link
                href="/admin"
                className={`flex items-center text-sm font-medium ${
                  isActive("/admin")
                    ? "text-teal-500"
                    : "text-gray-700 hover:text-teal-600"
                }`}>
                <User size={20} className="mr-1" />
                <span>Dashboard</span>
              </Link>
            ) : (
              user?.role === "customer" && (
                <Link
                  href="/dashboard"
                  className={`flex items-center text-sm font-medium ${
                    isActive("/dashboard")
                      ? "text-teal-500"
                      : "text-gray-700 hover:text-teal-600"
                  }`}>
                  <User size={20} className="mr-1" />
                  <span>My account</span>
                </Link>
              )
            )}

            {!user && (
              <Link
                href="/login"
                className={`flex items-center text-sm font-medium ${
                  isActive("/login")
                    ? "text-teal-500"
                    : "text-gray-700 hover:text-teal-600"
                }`}>
                <User size={20} className="mr-1" />
                <span>Login / Register</span>
              </Link>
            )}

            <Link
              href="/cart"
              className={`flex items-center text-sm font-medium relative ${
                isActive("/cart")
                  ? "text-teal-500"
                  : "text-gray-700 hover:text-teal-600"
              }`}>
              <ShoppingBag size={20} className="mr-1" />
              <span>€{cartTotal}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/cart"
              className={`flex items-center text-[10px] font-medium relative ${
                isActive("/cart")
                  ? "text-teal-500"
                  : "text-gray-700 hover:text-teal-600"
              }`}>
              <ShoppingBag size={20} className="" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-1 bg-teal-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className=" text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="To search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-teal-600">
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden mt-4 pb-4">
            <nav
              className="flex flex-col space-y-4"
              onClick={() => setIsMenuOpen(false)}>
              <Link href="/shop" className={getLinkClass("/shop")}>
                Shop
              </Link>
              <Link
                href="/category/medicijnen"
                className={getLinkClass("/medicijnen")}>
                Medicines
              </Link>
              <Link
                href="/category/erection"
                className={getLinkClass("/erection")}>
                Erection pills
              </Link>
              <Link href="/over-ons" className={getLinkClass("/over-ons")}>
                About us
              </Link>
              <Link href="/faq" className={getLinkClass("/faq")}>
                Frequently Asked Questions
              </Link>
              <Link href="/blog" className={getLinkClass("/blog")}>
                Blog
              </Link>
              <Link href="/contact" className={getLinkClass("/contact")}>
                Contact
              </Link>
            </nav>
            <div className="mt-4 flex flex-col space-y-4">
              {user?.role === "order_manager" && (
                <Link
                  href="/admin/orders"
                  className={`flex items-center text-sm font-medium ${
                    isActive("/admin")
                      ? "text-teal-500"
                      : "text-gray-700 hover:text-teal-600"
                  }`}>
                  <User size={20} className="mr-1" />
                  <span>Bestellingen</span>
                </Link>
              )}
              {user?.role === "admin" ? (
                <Link
                  href="/admin"
                  className={`flex items-center text-sm font-medium ${
                    isActive("/admin")
                      ? "text-teal-500"
                      : "text-gray-700 hover:text-teal-600"
                  }`}>
                  <User size={20} className="mr-1" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                user?.role === "customer" && (
                  <Link
                    href="/dashboard"
                    className={`flex items-center text-sm font-medium ${
                      isActive("/dashboard")
                        ? "text-teal-500"
                        : "text-gray-700 hover:text-teal-600"
                    }`}>
                    <User size={20} className="mr-1" />
                    <span>My account</span>
                  </Link>
                )
              )}

              {!user && (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href="/login"
                  className={`flex items-center text-sm font-medium ${
                    isActive("/login")
                      ? "text-teal-500"
                      : "text-gray-700 hover:text-teal-600"
                  }`}>
                  <User size={20} className="mr-1" />
                  <span>Login / Register</span>
                </Link>
              )}
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/cart"
                className={`flex items-center ${
                  isActive("/cart")
                    ? "text-teal-500"
                    : "text-gray-700 hover:text-teal-600"
                } font-medium`}>
                <ShoppingBag size={20} className="mr-2" />
                <span>
                  Shopping cart ({cartCount}) - €{cartTotal}
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:block border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-8 py-4 text-sm lg:text-base">
            <li>
              <Link href="/shop" className={`py-3 ${getLinkClass("/shop")}`}>
                Shop
              </Link>
            </li>

            <li>
              <Link
                href="/category/medicijnen"
                className={getLinkClass("/medicijnen")}>
                Medicines
              </Link>
            </li>
            <li>
              <Link
                href="/category/erection"
                className={getLinkClass("/erection")}>
                Erection pills
              </Link>
            </li>
            <li>
              <Link
                href="/over-ons"
                className={`py-3 ${getLinkClass("/over-ons")}`}>
                About us
              </Link>
            </li>
            <li>
              <Link href="/faq" className={`py-3 ${getLinkClass("/faq")}`}>
                Frequently Asked Questions
              </Link>
            </li>
            <li>
              <Link href="/blog" className={`py-3 ${getLinkClass("/blog")}`}>
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`py-3 ${getLinkClass("/contact")}`}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
