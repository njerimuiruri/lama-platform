"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { name: "Dashboard", href: "/dashboard/sitedashboard" },
      { name: "Indicators", href: "/indicators" },
      { name: "Project database", href: "/resources/interventions-database" },
      { name: "Share your data", href: "/contribute" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Publications", href: "/resources/publications" },
      { name: "Tools & frameworks", href: "/resources/tools-frameworks" },
      { name: "Advisory outputs", href: "/resources/advisory_outputs" },
      { name: "Diaries & blogs", href: "/stakeholders/diaries-blogs" },
    ],
  },
  {
    title: "LAMA",
    links: [
      { name: "About", href: "/AboutPage" },
      { name: "Impact stories", href: "/impact-stories" },
      { name: "Gallery", href: "/gallery" },
    ],
  },
];

const LamaFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">

          {/* Brand + contact */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/LAMA-logo.png"
                alt="LAMA logo"
                width={36}
                height={36}
                className="rounded-lg object-contain"
              />
              <span className="font-bold text-lg text-gray-900">LAMA</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Locally Led Adaptation Metrics for Africa — measuring what works in community climate adaptation.
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>
                <a href="mailto:info@lama-platform.org" className="inline-flex items-center gap-2 hover:text-emerald-700 transition-colors">
                  <Mail className="w-4 h-4 text-gray-400" /> info@lama-platform.org
                </a>
              </li>
              <li>
                <a href="tel:+254746130873" className="inline-flex items-center gap-2 hover:text-emerald-700 transition-colors">
                  <Phone className="w-4 h-4 text-gray-400" /> +254 746 130 873
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Bishop Road, 1st Ngong Ave, Upperhill, Nairobi · P.O Box 53358-00200</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.title} className="md:col-span-2 md:first-of-type:col-start-7" aria-label={column.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-emerald-700 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {currentYear} LAMA Platform. All rights reserved.</p>
          <p>An IDRC-funded programme</p>
        </div>
      </div>
    </footer>
  );
};

export default LamaFooter;
