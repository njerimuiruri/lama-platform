'use client';
import React from 'react';
import { FileText, ExternalLink, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import Image from 'next/image';

// ── Add upcoming events here ─────────────────────────────────────────────────
const UPCOMING_EVENTS = [
  {
    id: 1,
    name: "LAMA Webinar",
    date: "30th April 2026 · 2:00 – 4:00 PM",
    location: "Online",
    description: "The State of Locally Led Adaptation Measurement in Africa (SAMA) — Leveraging on the LAMA digital platform.",
    image: "/images/lama-webiner.jpeg",
  },
];
// ────────────────────────────────────────────────────────────────────────────

const ProgramPage = () => {
    const programPdfUrl = "/documents/LREB-Climate Summit Final Program.pdf";
    const handleOpenPDF = () => window.open(programPdfUrl, '_blank');

    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-white">

                {/* Upcoming Events */}
                <section className="py-14">
                    <div className="container mx-auto px-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-8 bg-green-600 rounded-full"></div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Upcoming Events</h2>
                            </div>

                            {UPCOMING_EVENTS.length === 0 ? (
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No upcoming events at this time</h3>
                                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                                        Check back soon — we regularly host climate adaptation forums, workshops, and webinars across Africa.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {UPCOMING_EVENTS.map(ev => (
                                        <div key={ev.id} className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row">
                                            {/* Image — tall on mobile, fixed-width column on desktop */}
                                            <div className="relative lg:w-80 xl:w-96 flex-shrink-0 overflow-hidden">
                                                {ev.image ? (
                                                    <img
                                                        src={ev.image}
                                                        alt={ev.name}
                                                        className="w-full h-60 lg:h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-60 lg:h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                                        <Calendar className="w-16 h-16 text-green-400" />
                                                    </div>
                                                )}
                                                {/* Upcoming badge */}
                                                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                    Upcoming
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className="p-7 flex flex-col justify-center flex-1">
                                                <span className="text-green-600 text-xs font-bold uppercase tracking-widest mb-3">LAMA Event</span>
                                                <h3 className="font-black text-gray-900 text-2xl lg:text-3xl mb-3 leading-snug">{ev.name}</h3>
                                                {ev.description && (
                                                    <p className="text-gray-500 text-base mb-6 leading-relaxed max-w-lg">{ev.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-4 mb-6">
                                                    {ev.date && (
                                                        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-xl">
                                                            <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                            <span>{ev.date}</span>
                                                        </div>
                                                    )}
                                                    {ev.location && (
                                                        <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-xl">
                                                            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                            <span>{ev.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Past Events */}
                <section className="py-14 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Past Events</h2>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* LREB Climate Summit 2025 */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                    <div
                                        className="relative group cursor-pointer overflow-hidden"
                                        onClick={handleOpenPDF}
                                    >
                                        <img
                                            src="/images/lrebprogram.png"
                                            alt="LREB Climate Summit 2025 Programme"
                                            className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-xl">
                                                <ExternalLink className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                            View Programme
                                        </span>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <span className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">
                                            LREB Climate Summit 2025
                                        </span>
                                        <h3 className="font-bold text-gray-900 text-base mb-1 leading-snug">
                                            Climate Summit Program
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4 leading-relaxed flex-1">
                                            Investing in Climate Solutions — Finance, Innovation, and Action
                                        </p>
                                        <div className="space-y-1.5 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                14th–16th October 2025
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                Masinde Muliro University
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleOpenPDF}
                                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View Full Programme
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                {/* Add more past events here */}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProgramPage;
