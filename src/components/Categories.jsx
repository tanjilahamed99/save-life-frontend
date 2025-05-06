import Link from 'next/link';
import Image from 'next/image';

export default function Categories() {
  const categories = [
    {
      id: 'cat_1',
      name: 'Medicijnen',
      slug: 'medicijnen',
      description:
        'Een breed assortiment van medicijnen voor verschillende aandoeningen en behandelingen.',
      productCount: 9,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_2',
      name: 'Slaappillen',
      slug: 'slaappillen',
      description:
        'Medicijnen ter bevordering van een gezonde nachtrust en behandeling van slaapstoornissen.',
      productCount: 6,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_3',
      name: 'Benzodiazepinen',
      slug: 'benzodiazepinen',
      description:
        'Medicijnen met kalmerende, slaapverwekkende en spierontspannende werking voor slaapproblemen en angstklachten.',
      productCount: 3,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_4',
      name: 'Neurologische Medicatie',
      slug: 'neurologische-medicatie',
      description:
        'Medicijnen gericht op de behandeling van aandoeningen van het zenuwstelsel.',
      productCount: 1,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_5',
      name: 'Pijnstillers',
      slug: 'pijnstillers',
      description:
        'Medicatie voor het verlichten van acute en chronische pijnklachten.',
      productCount: 1,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_6',
      name: 'Psychostimulantia',
      slug: 'psychostimulantia',
      description:
        'Medicijnen die de activiteit van het centrale zenuwstelsel verhogen, gebruikt bij ADHD en narcolepsie.',
      productCount: 1,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_7',
      name: 'Antipsychotica',
      slug: 'antipsychotica',
      description:
        'Medicijnen voor de behandeling van psychotische stoornissen zoals schizofrenie en bipolaire stoornis.',
      productCount: 1,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_8',
      name: 'Erectiestoornissen',
      slug: 'erectiestoornissen',
      description:
        'Medicijnen en behandelingen voor erectieproblemen en seksuele gezondheid bij mannen.',
      productCount: 7,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_9',
      name: 'Vrouwelijke Gezondheid',
      slug: 'vrouwelijke-gezondheid',
      description:
        'Producten en medicijnen gericht op de gezondheid en het welzijn van vrouwen.',
      productCount: 1,
      image: '/placeholder.svg',
    },
    {
      id: 'cat_10',
      name: 'Erectiestoornissen & PE',
      slug: 'erectiestoornissen-pe',
      description:
        'Combinatiebehandelingen voor zowel erectiestoornissen als voortijdige ejaculatie.',
      productCount: 3,
      image: '/placeholder.svg',
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Categorieën
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              href={`/category/${category.name.toLowerCase()}`}
              key={index}
              className="group"
            >
              <div className="bg-white rounded-lg border border-teal-100 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full bg-gray-50">
                  <Image
                    src={category.image || '/placeholder.svg'}
                    alt={category.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium h-12 md:h-8 text-gray-900 group-hover:text-teal-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.productCount} producten
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
