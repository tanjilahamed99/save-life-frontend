import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const productImages = [
    { image: "/images/products/Diazepam10mg.webp", name: "Diazepam 10mg" },
    { image: "/images/products/Zolpidem10mg.webp", name: "Zolpidem 10mg" },
    { image: "/images/products/Temazepam20mg.webp", name: "Temazepam 20mg" },
    { image: "/images/products/Lorazepam2mg.webp", name: "Lorazepam 2.5mg" },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-50 to-teal-50 py-8 lg:py-16 border-b border-gray-200">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Content Section */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* <div className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-2">
            Reliable Online Pharmacy
          </div> */}
  
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
            Buy Medicines Without Prescription
          </h2>
  
          <div className="text-gray-700 space-y-4">
            <p className="lg:text-lg">
              At our online pharmacy, reliability and discretion are paramount. We understand that purchasing medication is a personal and confidential matter.
            </p>
            <p>
              That’s why we guarantee fast and discreet processing of every order. Your privacy and safety are our top priorities.
            </p>
            <p>
              We ensure that your order is handled with the utmost care and delivered to you as quickly as possible, so you can access your medication without unnecessary delay.
            </p>
          </div>
  
          <div className="pt-6 md:pt-2 lg:pt-6 flex flex-col sm:flex-row gap-4 md:gap-2 lg:gap-4">
            <Link href="/shop" legacyBehavior>
              <a
                className=" bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 
                lg:py-3 lg:px-6 md:py-2 md:px-2 flex items-center 
                rounded-md transition-colors duration-300 text-center md:text-sm lg:text-base">
                View Our Products
              </a>
            </Link>
            <Link href="/over-ons" legacyBehavior>
              <a
                className=" bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 
                font-medium py-3 px-6 lg:py-3 lg:px-6 md:py-2 md:px-2 flex items-center  rounded-md transition-colors duration-300 text-center md:text-sm lg:text-base">
                Learn More About Us
              </a>
            </Link>
          </div>
        </div>
  
        {/* Image Grid Section */}
        <div className="w-full md:w-1/2 mt-8 md:mt-0 hidden md:block ">
          <div className=" p-2 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              {productImages?.slice(0, 4).map((product, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-md border border-gray-100 transition-all duration-300 hover:border-teal-200">
                  <div className="relative w-full h-32 sm:h-40 md:h-48">
                    <Link
                      href={`/product/${product.name
                        .toLowerCase()
                        .split(" ")
                        .join("-")}`}>
                      <Image
                        src={product?.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading="lazy"
                        className="object-contain rounded-md"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  );
}
