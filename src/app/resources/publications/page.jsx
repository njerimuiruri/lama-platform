"use client";
import LamaNavbar from "@/components/Navbar/navbar";
import LamaFooter from "@/components/Footer/footer";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const publications = [
  {
    title: "LAMA Policy Brief",
    authors: "Okwatch",
    year: "2025",
    description: "A policy brief on locally led adaptation measurement in Africa produced under the LAMA programme.",
    image: "/documents/policybrief.jpg",
    pdf: "/documents/LAMA_Policy_Brief_BY OKWATCH.pdf",
  },
];

export default function PublicationsPage() {
  return (
    <>
      <LamaNavbar />
      <div className="min-h-screen bg-white">
        <section className="py-14">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-green-600 rounded-full" />
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Publications</h2>
              </div>
              <p className="text-gray-500 text-base mb-10 max-w-2xl">
                Research publications, reports, and working papers produced under the LAMA programme on locally led adaptation measurement in Africa.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publications.map((pub, i) => (
                  <a
                    key={i}
                    href={pub.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Cover image */}
                    <div className="relative overflow-hidden">
                      <Image
                        src={pub.image}
                        alt={pub.title}
                        width={600}
                        height={400}
                        className="w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-xl">
                          <ExternalLink className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        View PDF
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-1">
                      {pub.year && (
                        <span className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">
                          {pub.year}
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug group-hover:text-green-700 transition-colors">
                        {pub.title}
                      </h3>
                      {pub.authors && (
                        <p className="text-gray-500 text-sm mb-3">{pub.authors}</p>
                      )}
                      {pub.description && (
                        <p className="text-gray-500 text-sm leading-relaxed flex-1">{pub.description}</p>
                      )}
                      <div className="inline-flex items-center gap-1.5 mt-4 text-green-600 text-sm font-semibold">
                        Open document <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <LamaFooter />
    </>
  );
}
