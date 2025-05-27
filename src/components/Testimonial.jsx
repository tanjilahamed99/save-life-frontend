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
    text: 'I am very satisfied with the service from Benzobestellen. The medication was delivered quickly and the quality is excellent. Highly recommended for anyone looking for reliable medication.',
    image: '/placeholder.svg?height=100&width=100',
  },
  {
    id: 2,
    name: 'Lisa de Vries',
    location: 'Rotterdam',
    rating: 5,
    text: 'I’ve been ordering my medication from Benzobestellen for years and I’ve never been disappointed. The website is user-friendly, delivery is discreet, and the customer service is excellent!',
    image: '/placeholder.svg?height=100&width=100',
  },
  {
    id: 3,
    name: 'Pieter Jansen',
    location: 'Utrecht',
    rating: 5,
    text: 'Great experience with Benzobestellen. The medication is high quality and delivery is always on time. The prices are reasonable and the website is easy to navigate.',
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
         What customers say
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
          1572 customers rate us with an average of 4.9/5
        </p>
      </div>
    </section>
  );
}
