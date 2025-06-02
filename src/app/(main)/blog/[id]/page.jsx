"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Calendar,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import { getBlogDataById, getRelatedArticle } from "@/lib/blog";

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticle, setRelateArticle] = useState([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPost = async () => {
      setLoading(true);

      // Mock blog post data
      // const blogPost = {
      //   id: params.id,
      //   title: "Alles wat je moet weten over Research Chemicals",
      //   content: `
      //     <p>Research chemicals zijn synthetische stoffen die worden gebruikt voor wetenschappelijk onderzoek. Ze worden vaak gebruikt in laboratoria om nieuwe medicijnen te ontwikkelen of om bestaande stoffen te bestuderen.</p>

      //     <h2>Wat zijn Research Chemicals?</h2>
      //     <p>Research chemicals zijn synthetische stoffen die specifiek zijn ontworpen voor wetenschappelijk onderzoek. Ze worden vaak gebruikt in laboratoria om nieuwe medicijnen te ontwikkelen of om bestaande stoffen te bestuderen. Deze stoffen zijn niet bedoeld voor menselijke consumptie en worden uitsluitend verkocht voor onderzoeksdoeleinden.</p>

      //     <p>De term "research chemical" verwijst naar de primaire toepassing van deze stoffen: wetenschappelijk onderzoek. Ze worden vaak gebruikt in de farmaceutische industrie, bij academisch onderzoek en in andere wetenschappelijke disciplines.</p>

      //     <h2>Soorten Research Chemicals</h2>
      //     <p>Er zijn verschillende soorten research chemicals, elk met hun eigen eigenschappen en toepassingen. Enkele voorbeelden zijn:</p>

      //     <ul>
      //       <li><strong>2-CMC</strong>: Een synthetische stof die wordt gebruikt voor onderzoek naar neurotransmitters.</li>
      //       <li><strong>3-MMA</strong>: Een stof die wordt gebruikt voor onderzoek naar de effecten op het centrale zenuwstelsel.</li>
      //       <li><strong>2-FDCK</strong>: Een stof die wordt gebruikt voor onderzoek naar anesthetica.</li>
      //     </ul>

      //     <h2>Veiligheidsmaatregelen</h2>
      //     <p>Bij het werken met research chemicals is veiligheid van het grootste belang. Hier zijn enkele belangrijke veiligheidsmaatregelen:</p>

      //     <ol>
      //       <li>Draag altijd beschermende kleding, waaronder handschoenen, een labjas en een veiligheidsbril.</li>
      //       <li>Werk in een goed geventileerde ruimte of onder een zuurkast.</li>
      //       <li>Houd research chemicals uit de buurt van voedsel en dranken.</li>
      //       <li>Was je handen grondig na het hanteren van research chemicals.</li>
      //       <li>Bewaar research chemicals op een koele, droge plaats, uit de buurt van direct zonlicht en hittebronnen.</li>
      //     </ol>

      //     <h2>Wetgeving</h2>
      //     <p>De wetgeving rondom research chemicals verschilt per land. In Nederland vallen sommige research chemicals onder de Opiumwet, terwijl andere niet specifiek zijn gereguleerd. Het is belangrijk om op de hoogte te zijn van de lokale wetgeving voordat je research chemicals koopt of gebruikt.</p>

      //     <p>Bij X Sales verkopen we uitsluitend research chemicals voor legitieme onderzoeksdoeleinden. We vragen onze klanten om zich te houden aan alle toepasselijke wetten en voorschriften.</p>

      //     <h2>Conclusie</h2>
      //     <p>Research chemicals spelen een belangrijke rol in wetenschappelijk onderzoek en de ontwikkeling van nieuwe medicijnen. Ze bieden onderzoekers de mogelijkheid om nieuwe stoffen te bestuderen en hun eigenschappen te begrijpen. Bij het werken met research chemicals is het echter belangrijk om veiligheidsmaatregelen in acht te nemen en op de hoogte te zijn van de relevante wetgeving.</p>

      //     <p>Bij X Sales zijn we toegewijd aan het leveren van hoogwaardige research chemicals voor legitieme onderzoeksdoeleinden. We streven ernaar om onze klanten te voorzien van de informatie en ondersteuning die ze nodig hebben om veilig en verantwoord met deze stoffen te werken.</p>
      //   `,
      //   image: "https://img.waimaoniu.net/2016/2016-202009081713023878.jpg",
      //   date: "15 maart 2025",
      //   author: "Team Benzo Bestellen",
      //   category: "Informatie",
      //   tags: ["Research Chemicals", "Veiligheid", "Wetgeving", "Onderzoek"],
      // };

      // setPost(blogPost);

      const blog = await getBlogDataById(params?.id);
      setPost(blog);
      setLoading(false);
      const related = await getRelatedArticle(blog.category, blog?.id);
      setRelateArticle(related);
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Blog post not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Blog", href: "/blog" },
          { label: post.shortTitle, href: `/blog/${post.id}` },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8">
        <div className="mb-6">
          <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold mb-6">
          {post.shortTitle}
        </h1>

        <div className="flex items-center text-gray-500 mb-8">
          <div className="flex items-center mr-6">
            <User size={18} className="mr-2" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={18} className="mr-2" />
            <span>{post.date}</span>
          </div>
        </div>

        <div className="relative h-80 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <div
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>

          {relatedArticle?.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticle.map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Link href={`/blog/${item}`} className="block">
                    <div className="relative h-40 w-full">
                      <Image
                        src="https://img.waimaoniu.net/2016/2016-202009081713023878.jpg"
                        alt="Blog post"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <h4 className="font-bold mb-2 hover:text-teal-600 transition-colors">
                      <Link href={`/blog/${item}`}>
                        Related article title
                      </Link>
                    </h4>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span>10 March 2025</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h2 className="text-gray-600">
              No related articles found
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
