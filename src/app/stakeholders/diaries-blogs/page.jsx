"use client";
import LamaNavbar from "@/components/Navbar/navbar";
import LamaFooter from "@/components/Footer/footer";
import { BookOpen, PenLine } from "lucide-react";

const entries = [
  // Add diary/blog entries here: { title, author, role, date, excerpt, image }
];

export default function DiariesBlogsPage() {
  return (
    <>
      <LamaNavbar />
      <div className="min-h-screen bg-white">
        <section className="py-14">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-green-600 rounded-full" />
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">LAMA Diaries &amp; Blogs</h2>
              </div>
              <p className="text-gray-500 text-base mb-10 max-w-2xl">
                Voices of women, youth, communities, and experts sharing lived experiences and insights on locally led climate adaptation across Africa.
              </p>

              {entries.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PenLine className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Diaries &amp; blogs coming soon</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Stories and reflections from LAMA partners and communities will be shared here.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {entries.map((entry, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
                      {entry.image && (
                        <img src={entry.image} alt={entry.title} className="w-full h-44 object-cover" />
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">{entry.role}</span>
                        <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug flex-1">{entry.title}</h3>
                        {entry.excerpt && <p className="text-gray-500 text-sm mb-4 leading-relaxed">{entry.excerpt}</p>}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                          <span className="text-gray-600 text-sm font-medium">{entry.author}</span>
                          {entry.date && <span className="text-gray-400 text-xs">{entry.date}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <LamaFooter />
    </>
  );
}
