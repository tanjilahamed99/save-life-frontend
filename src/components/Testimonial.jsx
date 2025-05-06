'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Jan Bakker',
    location: 'Amsterdam',
    rating: 5,
    text: 'Ik ben zeer tevreden over de service van Benzobestellen. De medicijnen werden snel geleverd en de kwaliteit is uitstekend. Zeker een aanrader voor iedereen die op zoek is naar betrouwbare medicatie.',
    image: '/placeholder.svg?height=100&width=100',
  },
  {
    id: 2,
    name: 'Lisa de Vries',
    location: 'Rotterdam',
    rating: 5,
    text: 'Al jaren bestel ik mijn medicatie bij Benzobestellen en ik ben nog nooit teleurgesteld. De website is gebruiksvriendelijk, de levering is discreet en de klantenservice is top!',
    image: '/placeholder.svg?height=100&width=100',
  },
  {
    id: 3,
    name: 'Pieter Jansen',
    location: 'Utrecht',
    rating: 5,
    text: 'Goede ervaring met Benzobestellen. De medicijnen zijn van hoge kwaliteit en de levering is altijd op tijd. De prijzen zijn redelijk en de website is gemakkelijk te navigeren.',
    image: '/placeholder.svg?height=100&width=100',
  },
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="bg-teal-500 py-12 text-white container mx-auto px-4 md:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-center text-2xl lg:text-3xl font-bold">
          Wat klanten zeggen
        </h2>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-teal-300 opacity-30">
            <Quote className="h-20 w-20" />
          </div>

          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-opacity duration-500 ${index === currentIndex
                    ? 'block opacity-100'
                    : 'hidden opacity-0'
                  }`}
              >
                <div className="mb-6 text-center text-lg italic leading-relaxed">
                  "{testimonial.text}"
                </div>

                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-lg font-medium">{testimonial.name}</h3>
                  <p className="mb-2 text-sm text-teal-100">
                    {testimonial.location}
                  </p>
                  <div className="mb-4">
                    <Image
                      src="/images/stars-5-1.svg"
                      alt="Stars"
                      width={150}
                      height={30}
                      loading='lazy'
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={prevTestimonial}
              className="rounded-full bg-[#188687] p-2 hover:bg-[#188687]/80 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="rounded-full bg-[#188687] p-2 hover:bg-[#188687]/80 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-8 text-center">
          1572 klanten waarderen ons gemiddeld met een 4.9/5
        </p>
      </div>
    </section>
  );
}
