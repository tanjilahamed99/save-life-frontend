import {
  Clock,
  Shield,
  Truck,
  CreditCard,
  CheckCircle,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import NewsLetter from './NewsLetter';

export default function InfoSection() {

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Save Life
          </h2>
          <div className="w-24 h-1 bg-[#188687] mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
           For over 3 years we have been providing reliable, high-quality medication. Discover why thousands of customers trust us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-[#188687]"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#188687] mr-4">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Fast Delivery</h3>
              </div>
              <p className="text-gray-600 mb-4">
                We deliver within 1-2 working days throughout the Netherlands and Belgium.
                With our express option, we offer delivery within 24 hours. Your
                order will be discreetly packaged.
              </p>
              <div className="flex items-center text-[#188687]">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">Discreet packaging</span>
              </div>
              <div className="flex items-center text-[#188687] mt-2">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Track & trace available
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-[#188687]"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#188687] mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Quality guarantee</h3>
              </div>
              <p className="text-gray-600 mb-4">
                All products are of high quality and are supplied by
                reliable manufacturers. We guarantee authenticity.
              </p>
              <div className="flex items-center text-[#188687]">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Guaranteed quality
                </span>
              </div>
              <div className="flex items-center text-[#188687] mt-2">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Reliable suppliers
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <div className="h-3 bg-[#188687]"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#188687] mr-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Secure Payment</h3>
              </div>
              <p className="text-gray-600 mb-4">
              We offer several secure payment methods, including IDEAL, Bancontact and cryptocurrency for maximum privacy.
              </p>
              <div className="flex items-center text-[#188687]">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Multiple payment methods
                </span>
              </div>
              <div className="flex items-center text-[#188687] mt-2">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Secure transactions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 bg-[#188687] rounded-lg shadow-lg p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3+</div>
              <div className="text-white">Years of experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-white">Satisfied customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-white">Successful deliveries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white">Customer service</div>
            </div>
          </div>
        </div>

        {/* newsletter section */}
        <NewsLetter />

        {/* Customer Support Section */}
        <div className="w-full sm:w-[600px] mx-auto mt-16 flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">24/7 Customer Service</h3>
            <p className="text-gray-600 mb-6">
              Our customer service is always ready to answer all your questions. We strive to provide you with the best service.
            </p>
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-[#188687] mr-3" />
              <span>24/7 available</span>
            </div>
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-[#188687] mr-3" />
              <span>Assistance with orders</span>
            </div>
            <Link
              href={'/contact'}
              className="mt-4 bg-[#188687] hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
