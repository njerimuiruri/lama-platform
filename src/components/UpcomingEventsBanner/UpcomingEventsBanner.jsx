"use client";
import { Calendar, MapPin, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function UpcomingEventsBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <>
    <div className="fixed top-14 sm:top-16 inset-x-0 z-40 bg-gradient-to-r from-green-50 via-emerald-50 to-white border-b border-green-200">
      {/* Green left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-500 to-emerald-600" />

      <div className="container mx-auto px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4 ml-3">

          {/* Live pulse badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Upcoming
          </span>

          {/* Thumbnail */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-green-100 shadow-sm hidden md:block">
            <Image
              src="/images/lama-webiner.jpeg"
              alt="LAMA Webinar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm">LAMA Webinar</span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="hidden sm:inline leading-tight">
              <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">The State of Locally Led Adaptation Measurement in Africa (SAMA)</span>
              <span className="text-gray-400 mx-1">·</span>
              <span className="text-gray-500 text-sm">Leveraging on the LAMA digital platform</span>
            </span>
            <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
              <Calendar className="w-3 h-3" /> 30th April 2026 · 2:00–4:00 PM
            </span>
            <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
              <MapPin className="w-3 h-3" /> Online
            </span>
          </div>

          {/* CTA */}
          <Link href="/programmes" className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    {/* Spacer so page content sits below the fixed banner */}
    <div className="h-14 sm:h-16" />
    </>
  );
}
