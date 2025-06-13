import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";

export default function Footer() {
  const Products = products?.map((i) => ({
    id: i.id,
    name: i.name,
    slug: i.slug,
  }));
  const regex = new RegExp("kopen", "gi");

  return (
    <footer className="bg-gray-950 pt-12 pb-6 text-white text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1  md:grid-cols-5 gap-8">
          <div className="col-span- md:col-span-1">
            <Link href={"/"}>
              <Image
                src="/images/benzobestellen-logo-1.svg"
                alt="Benzobestellen"
                width={140}
                height={40}
                className="h-10 sm:w-[180px] w-auto"
              />
            </Link>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Category</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ Medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸  Erection pills
                </Link>
              </li>

              <li>
                <Link
                  href="/over-ons"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ About us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ my account
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ sign up
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-bold text-lg mb-4">Medicines & Erection Pills</h3>
            <div className="grid xl:grid-cols-2 gap-2">
              <ul className="space-y-2">
                {Products.slice(0, 20).map((product, index) => (
                  <li key={index}>
                    <Link
                      href={`/product/${product.slug.toLowerCase().split(' ').join('-')}`}
                      className="text-gray-400 hover:text-teal-400"
                    >
                      ▸ {product.name.replace(/tabletten/i, "").trim()}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {Products.slice(21).map((product, index) => (
                  <li key={index}>
                    <Link
                      href={`/product/${product.slug.toLowerCase().split(' ').join('-')}`}
                      className="text-gray-400 hover:text-teal-400"
                    >
                      ▸ {product.name.replace(/tabletten/i, "").trim()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ Contact
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ Retourneren
                </Link>
              </li> */}
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-teal-400">
                  ▸ FAQ
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/track-order"
                  className="text-gray-400 hover:text-teal-400"
                >
                  ▸ Bestelling volgen
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © SaveLife {new Date().getFullYear()} . All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="/payment-ideal.png" alt="iDEAL" className="size-8" />
              <img
                src="/payment-bancontact.png"
                alt="Bancontact"
                className="size-8"
              />
            </div>
          </div>
        </div>

        {/* <div className="mt-4 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-4">
            <Link href="/algemeen-voorwaarden" className="hover:text-teal-400">
              Algemeen Voorwaarden
            </Link>
            <Link href="/Privacybeleid" className="hover:text-teal-400">
              Privacybeleid
            </Link>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
