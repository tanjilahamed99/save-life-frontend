import Breadcrumb from '@/components/Breadcrumb';
import { Award, Shield, Truck, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <Breadcrumb items={[{ label: 'Contact', href: '/over-ons' }]} />
      <main>
        {/* Hero Section */}
        <section className="bg-[#188687] py-16 text-white mt-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold">Over Ons</h1>
              <p className="text-lg">
                Benzobestellen.net is een toonaangevende online apotheek met
                meer dan 3 jaar ervaring in het leveren van hoogwaardige
                medicijnen.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 max-w-3xl mx-auto">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Ons Verhaal</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Benzobestellen.net werd opgericht in 1998 met een duidelijke
                    missie: het bieden van toegankelijke, betaalbare en
                    hoogwaardige medicijnen aan mensen die deze nodig hebben.
                    Wat begon als een kleine online apotheek is uitgegroeid tot
                    een vertrouwde naam in de farmaceutische industrie.
                  </p>
                  <p>
                    Onze oprichters, een team van ervaren apothekers en
                    gezondheidszorgprofessionals, zagen de behoefte aan een
                    betrouwbare bron voor medicijnen die niet altijd gemakkelijk
                    verkrijgbaar waren via traditionele kanalen. Met een focus
                    op kwaliteit, veiligheid en klanttevredenheid, hebben we een
                    reputatie opgebouwd als een betrouwbare partner voor
                    duizenden klanten in heel Europa.
                  </p>
                  <p>
                    Door de jaren heen hebben we ons assortiment uitgebreid om
                    te voldoen aan de groeiende behoeften van onze klanten,
                    terwijl we trouw blijven aan onze kernwaarden van
                    integriteit, discretie en uitmuntende service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Onze Waarden
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Value Item */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  Kwaliteit & Veiligheid
                </h3>
                <p className="text-gray-600">
                  We werken alleen met gerenommeerde fabrikanten en leveranciers
                  om de hoogste kwaliteit en veiligheid van onze producten te
                  garanderen.
                </p>
              </div>
              {/* Repeat similar blocks for other values */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Klantgerichtheid</h3>
                <p className="text-gray-600">
                  Onze klanten staan centraal in alles wat we doen. We streven
                  ernaar om uitzonderlijke service te bieden en aan hun
                  behoeften te voldoen.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Betrouwbaarheid</h3>
                <p className="text-gray-600">
                  We zijn toegewijd aan het nakomen van onze beloften, met
                  snelle levering, discrete verpakking en consistente
                  productbeschikbaarheid.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#188687]/80">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Integriteit</h3>
                <p className="text-gray-600">
                  We handelen met eerlijkheid en transparantie in al onze
                  zakelijke praktijken, en bouwen vertrouwensrelaties op met
                  onze klanten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#188687] py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-6 text-3xl font-bold">Klaar om te bestellen?</h2>
            <p className="mb-8 text-lg">
              Ontdek ons uitgebreide assortiment aan hoogwaardige medicijnen en
              ervaar onze uitzonderlijke service.
            </p>
            <Link
              href="/shop"
              className="inline-block rounded-lg bg-white px-6 py-3 text-[#188687] font-semibold shadow-md hover:bg-gray-100 transition duration-300"
            >
              Bekijk Producten
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
