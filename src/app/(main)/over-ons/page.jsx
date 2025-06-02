import Breadcrumb from "@/components/Breadcrumb";
import { Award, Shield, Truck, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="container mx-auto">
      <Breadcrumb items={[{ label: "About us", href: "/over-ons" }]} />
      </div>
      <main>
        {/* Hero Section */}
        <section className="bg-[#188687] py-16 text-white mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold">About us</h1>
              <p className="text-lg">
                Save Life is a leading online pharmacy with over 3 years of
                experience in delivering high-quality medications.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 max-w-3xl mx-auto">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Save Life was founded in 1998 with a clear mission: to
                    provide accessible, affordable, and high-quality medications
                    to people who need them. What started as a small online
                    pharmacy has grown into a trusted name in the pharmaceutical
                    industry.
                  </p>
                  <p>
                    Our founders, a team of experienced pharmacists and
                    healthcare professionals, recognized the need for a reliable
                    source of medications that were not always easily available
                    through traditional channels. With a focus on quality,
                    safety, and customer satisfaction, we have built a
                    reputation as a dependable partner for thousands of
                    customers across Europe.
                  </p>
                  <p>
                    Over the years, we have expanded our product range to meet
                    the growing needs of our customers while remaining true to
                    our core values of integrity, discretion, and exceptional
                    service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Value Item */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Quality & Safety</h3>
                <p className="text-gray-600">
                  We work only with reputable manufacturers and suppliers to
                  ensure the highest quality and safety of our products.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Customer Focus</h3>
                <p className="text-gray-600">
                  Our customers are at the heart of everything we do. We strive
                  to provide exceptional service and meet their needs.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Reliability</h3>
                <p className="text-gray-600">
                  We are committed to keeping our promises with fast delivery,
                  discreet packaging, and consistent product availability.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Integrity</h3>
                <p className="text-gray-600">
                  We act with honesty and transparency in all our business
                  practices, building trust-based relationships with our
                  customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#188687] py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-6 text-3xl font-bold">Ready to Order?</h2>
            <p className="mb-8 text-lg">
              Explore our wide range of high-quality medications and experience
              our exceptional service.
            </p>
            <Link
              href="/shop"
              className="inline-block rounded-lg bg-white px-6 py-3 text-[#188687] font-semibold shadow-md hover:bg-gray-100 transition duration-300">
              Browse Products
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
