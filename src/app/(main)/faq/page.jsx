"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqCategories = [
    {
      title: "Orders",
      questions: [
        {
          question: "How can I place an order?",
          answer:
            "You can easily place an order through our Save Life website. Select the desired products, add them to your cart, and follow the steps to complete your purchase.",
        },
        {
          question: "Can I cancel an order?",
          answer:
            "Yes, you can cancel your order before it has been shipped. Please contact our customer service as soon as possible via email or phone.",
        },
        {
          question: "How can I check the status of my order?",
          answer:
            "Log in to your account and go to 'Orders' to view the status of your order. You'll find an overview of all your orders and their current status.",
        },
      ],
    },
    {
      title: "Shipping & Delivery",
      questions: [
        {
          question: "How long does delivery take?",
          answer:
            "We aim to deliver all orders within 24 hours in the Netherlands. For Belgium and other European countries, delivery may take 2–3 working days.",
        },
        {
          question: "Are shipments discreet?",
          answer:
            "Yes, all our shipments are completely discreet. Packaging is plain and does not mention the contents or our company name.",
        },
        {
          question: "What are the shipping costs?",
          answer:
            "Shipping costs depend on your location and the size of your order. Orders over €100 receive free shipping within the Netherlands.",
        },
      ],
    },
    {
      title: "Payment",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept various payment methods including iDEAL, Bancontact, credit card (Visa and Mastercard), and PayPal.",
        },
        {
          question: "Is payment secure?",
          answer:
            "Yes, all payments are processed through secure connections. We use the latest encryption technologies to protect your data.",
        },
        {
          question: "When is my payment processed?",
          answer:
            "Your payment is processed immediately when placing the order. Once payment is confirmed, your order will be prepared for shipping.",
        },
      ],
    },
    {
      title: "Products",
      questions: [
        {
          question: "What is the quality of your products?",
          answer:
            "All our products are of the highest quality. We work with reputable suppliers and regularly test our products to ensure quality.",
        },
        {
          question: "Are your products legal?",
          answer:
            "All our products are sold as research chemicals for research purposes only and are not intended for human consumption. It is the buyer’s responsibility to comply with local laws.",
        },
        {
          question: "How should I store the products?",
          answer:
            "We recommend storing our products in a cool, dry place away from direct sunlight and heat. For specific storage instructions, please refer to the product page.",
        },
      ],
    },
    {
      title: "Returns",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We accept returns within 14 days of receiving your order, provided the products are unopened and in their original packaging. Please contact our customer service before returning any item.",
        },
        {
          question: "How do I request a return?",
          answer:
            "To request a return, log in to your account and go to 'My Orders'. Select the order and click on 'Return'. Follow the instructions to complete the return process.",
        },
        {
          question: "When will I receive my refund?",
          answer:
            "Once we have received and inspected your return, we will process your refund within 5–7 business days. It may take an additional 3–5 days for the funds to appear in your account, depending on your bank.",
        },
      ],
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "FAQ", href: "/faq" }]} />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">
          Frequently Asked Questions (FAQ)
        </h1>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                        onClick={() => handleToggle(index)}>
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
          <h2 className="text-xl font-bold mb-4">
            Do you have other questions?
          </h2>
          <p className="text-gray-600 mb-4">
            Have a question that isn’t in our FAQ? Contact us via our contact
            form or send us an email.
          </p>
          <a
            href="/contact"
            className="inline-block bg-teal-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
