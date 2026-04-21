"use client";
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import LamaNavbar from "@/components/Navbar/navbar";

export default function NotFound() {
  return (
    <>
      <LamaNavbar />
      <div className="min-h-[80vh] bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          {/* 404 number */}
          <div className="relative mb-6">
            <span className="text-[9rem] font-black leading-none bg-gradient-to-br from-green-600 to-emerald-500 bg-clip-text text-transparent select-none">
              404
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl -z-10" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <span className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md">
                <Home className="w-4 h-4" />
                Go Home
              </span>
            </Link>
            <button onClick={() => window.history.back()}>
              <span className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </span>
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Indicators", href: "/indicators" },
                { label: "Components", href: "/ComponentsPage" },
                { label: "Events", href: "/programmes" },
                { label: "About", href: "/AboutPage" },
                { label: "Gallery", href: "/gallery" },
              ].map(({ label, href }) => (
                <Link key={href} href={href}>
                  <span className="text-sm text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
