"use client";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { Calendar, User, ArrowRight } from "lucide-react";
import { blogs, getBlogsByCategory } from "@/lib/blog";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [category, setCategory] = useState("Alle categorieën");
  const [blogPosts, setBlogPosts] = useState([]);

const categories = [
  "All categories",
  "Information",
  "Products",
  "Safety",
  "History",
  "News",
  "Legislation",
];
  useEffect(() => {
    const fetchData = async () => {
      const blogsData = await getBlogsByCategory(category);
      setBlogPosts(blogsData);
    };
    fetchData();
  }, [category]);

    
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }]} />

      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Link href={`/blog/${post.id}`} className="block">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.shortTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {post.date}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">
                      <Link
                        href={`/blog/${post.id}`}
                        className="hover:text-teal-600 transition-colors">
                        {post.shortTitle}
                      </Link>
                    </h2>

                    <p className="text-gray-600 mb-4">{post.excerpt || 0}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User size={14} className="mr-1" />
                        {post.author}
                      </div>

                      <Link
                        href={`/blog/${post.id}`}
                        className="text-teal-600 hover:text-teal-700 font-medium flex items-center text-sm">
                        Lees meer
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination
            <div className="flex justify-center mt-12">
              <nav className="inline-flex">
                <a
                  href="#"
                  className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Vorige
                </a>
                <a
                  href="#"
                  className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-teal-600 hover:bg-gray-50"
                >
                  1
                </a>
                <a
                  href="#"
                  className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  3
                </a>
                <a
                  href="#"
                  className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Volgende
                </a>
              </nav>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="md:w-1/4">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((c, index) => (
                  <li onClick={() => setCategory(c)} key={index}>
                    <h2
                      className={`block text-sm hover:text-teal-600 cursor-pointer ${
                        c === category 
                          ? "font-medium text-teal-600"
                          : "text-gray-700"
                      }`}>
                      {c}
                    </h2>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md relative flex-shrink-0">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 hover:text-teal-600 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
