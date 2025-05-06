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
            Waarom Kiezen voor Benzobestellen?
          </h2>
          <div className="w-24 h-1 bg-[#188687] mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Al meer dan 3 jaar bieden wij betrouwbare medicatie van hoge
            kwaliteit. Ontdek waarom duizenden klanten ons vertrouwen.
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
                <h3 className="text-xl font-bold">Snelle Levering</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Wij leveren binnen 1-2 werkdagen in heel Nederland en Belgie.
                Met onze spoedoptie bieden we leveringen binnen 24 uur. Uw
                bestelling wordt discreet verpakt.
              </p>
              <div className="flex items-center text-[#188687]">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">Discrete verpakking</span>
              </div>
              <div className="flex items-center text-[#188687] mt-2">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Track & trace mogelijk
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
                <h3 className="text-xl font-bold">Kwaliteitsgarantie</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Alle producten zijn van hoge kwaliteit en worden geleverd door
                betrouwbare fabrikanten. Wij garanderen de authenticiteit.
              </p>
              <div className="flex items-center text-[#188687]">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Gegarandeerde kwaliteit
                </span>
              </div>
              <div className="flex items-center text-[#188687] mt-2">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Betrouwbare leveranciers
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
                <h3 className="text-xl font-bold">Veilige Betaling</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Wij bieden verschillende veilige betaalmethoden aan, waaronder
                IDEAL, Bancontant en cryptocurrency voor maximale privacy.
              </p>
              <div className="flex items-center text-[#188687]">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Meerdere betaalmethoden
                </span>
              </div>
              <div className="flex items-center text-[#188687] mt-2">
                <CheckCircle className="h-5 w-5 mr-2 text-teal-500" />
                <span className="text-sm font-medium">
                  Beveiligde transacties
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
              <div className="text-white">Jaren ervaring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-white">Tevreden klanten</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-white">Succesvolle leveringen</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white">Klantenservice</div>
            </div>
          </div>
        </div>

        {/* newsletter section */}
        <NewsLetter />

        {/* Customer Support Section */}
        <div className="w-full sm:w-[600px] mx-auto mt-16 flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4">24/7 Klantenservice</h3>
            <p className="text-gray-600 mb-6">
              Onze klantenservice staat altijd voor u klaar om al uw vragen te
              beantwoorden. Wij streven ernaar om u de beste service te bieden.
            </p>
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-[#188687] mr-3" />
              <span>24/7 beschikbaar</span>
            </div>
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-[#188687] mr-3" />
              <span>Hulp bij bestellingen</span>
            </div>
            <Link
              href={'/contact'}
              className="mt-4 bg-[#188687] hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Contact opnemen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
