'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqCategories = [
    {
      title: 'Bestellingen',
      questions: [
        {
          question: 'Hoe kan ik een bestelling plaatsen?',
          answer:
            'U kunt eenvoudig een bestelling plaatsen via onze website. Selecteer de gewenste producten, voeg ze toe aan uw winkelwagen en volg de stappen om de bestelling af te ronden.',
        },
        {
          question: 'Kan ik een bestelling annuleren?',
          answer:
            'Ja, u kunt een bestelling annuleren voordat deze wordt verzonden. Neem hiervoor zo snel mogelijk contact op met onze klantenservice via e-mail of telefoon.',
        },
        {
          question: 'Hoe kan ik de status van mijn bestelling controleren?',
          answer:
            "U kunt de status van uw bestelling controleren door in te loggen op uw account en naar 'Bestellingen' te gaan. Hier vindt u een overzicht van al uw bestellingen en hun huidige status.",
        },
      ],
    },
    {
      title: 'Verzending & Levering',
      questions: [
        {
          question: 'Hoe lang duurt de levering?',
          answer:
            'Wij streven ernaar om alle bestellingen binnen 24 uur te leveren in Nederland. Voor België en andere Europese landen kan de levertijd 2-3 werkdagen bedragen.',
        },
        {
          question: 'Zijn de verzendingen discreet?',
          answer:
            'Ja, al onze verzendingen zijn volledig discreet. De verpakking is neutraal zonder verwijzingen naar de inhoud of ons bedrijf.',
        },
        {
          question: 'Wat zijn de verzendkosten?',
          answer:
            'De verzendkosten zijn afhankelijk van uw locatie en de grootte van uw bestelling. Voor bestellingen boven €100 bieden we gratis verzending binnen Nederland.',
        },
      ],
    },
    {
      title: 'Betaling',
      questions: [
        {
          question: 'Welke betaalmethoden accepteren jullie?',
          answer:
            'We accepteren verschillende betaalmethoden, waaronder iDEAL, Bancontact, creditcard (Visa en Mastercard) en PayPal.',
        },
        {
          question: 'Is betalen veilig?',
          answer:
            'Ja, alle betalingen worden verwerkt via beveiligde verbindingen. We maken gebruik van de nieuwste encryptietechnologieën om uw gegevens te beschermen.',
        },
        {
          question: 'Wanneer wordt mijn betaling verwerkt?',
          answer:
            'Uw betaling wordt direct verwerkt bij het plaatsen van uw bestelling. Zodra de betaling is bevestigd, wordt uw bestelling klaargemaakt voor verzending.',
        },
      ],
    },
    {
      title: 'Producten',
      questions: [
        {
          question: 'Wat is de kwaliteit van jullie producten?',
          answer:
            'Al onze producten zijn van de hoogste kwaliteit. We werken samen met gerenommeerde leveranciers en testen onze producten regelmatig om de kwaliteit te garanderen.',
        },
        {
          question: 'Zijn jullie producten legaal?',
          answer:
            'Al onze producten worden verkocht als research chemicals voor onderzoeksdoeleinden en zijn niet bedoeld voor menselijke consumptie. Het is de verantwoordelijkheid van de koper om zich te houden aan de lokale wetgeving.',
        },
        {
          question: 'Hoe moet ik de producten bewaren?',
          answer:
            'We raden aan om onze producten te bewaren op een koele, droge plaats, uit de buurt van direct zonlicht en hittebronnen. Voor specifieke bewaarinstructies per product, raadpleeg de productpagina.',
        },
      ],
    },
    {
      title: 'Retourneren',
      questions: [
        {
          question: 'Wat is jullie retourbeleid?',
          answer:
            'We accepteren retourzendingen binnen 14 dagen na ontvangst van uw bestelling, mits de producten ongeopend en in de originele verpakking zijn. Neem contact op met onze klantenservice voordat u een product retourneert.',
        },
        {
          question: 'Hoe vraag ik een retourzending aan?',
          answer:
            "Om een retourzending aan te vragen, logt u in op uw account en gaat u naar 'Mijn Bestellingen'. Selecteer de bestelling en klik op 'Retourneren'. Volg de instructies om het retourproces te voltooien.",
        },
        {
          question: 'Wanneer ontvang ik mijn terugbetaling?',
          answer:
            'Nadat we uw retourzending hebben ontvangen en gecontroleerd, verwerken we uw terugbetaling binnen 5-7 werkdagen. Het kan nog eens 3-5 werkdagen duren voordat het bedrag op uw rekening staat, afhankelijk van uw bank.',
        },
      ],
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: 'FAQ', href: '/faq' }]} />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">Veelgestelde Vragen</h1>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <h2 className="text-xl font-bold p-6 border-b">
                {category.title}
              </h2>

              <div className="divide-y">
                {category.questions.map((faq, faqIndex) => {
                  const index = categoryIndex * 100 + faqIndex;
                  return (
                    <div key={faqIndex} className="border-t">
                      <button
                        className="flex justify-between items-center w-full p-6 text-left"
                        onClick={() => handleToggle(index)}
                      >
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                        {openIndex === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>

                      {openIndex === index && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-teal-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Heeft u nog andere vragen?</h2>
          <p className="text-gray-600 mb-4">
            Heeft u een vraag die niet in onze FAQ staat? Neem dan contact met
            ons op via ons contactformulier of stuur ons een e-mail.
          </p>
          <a
            href="/contact"
            className="inline-block bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Contact opnemen
          </a>
        </div>
      </div>
    </div>
  );
}
