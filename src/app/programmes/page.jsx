'use client';
import React from 'react';
import { FileText, ExternalLink, Calendar, MapPin, GraduationCap } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';

const ProgramPage = () => {
    const programPdfUrl = "/documents/LREB-Climate Summit Final Program.pdf";
    const handleOpenPDF = () => {
        window.open(programPdfUrl, '_blank');
    };

    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute bottom-32 left-20 w-72 h-72 bg-gradient-to-tr from-blue-50 to-sky-50 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="relative z-10">
                    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
                        <div className="container mx-auto px-6">
                            <div className="max-w-6xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 mb-6">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700 text-sm font-medium">LREB Climate Summit 2025</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                                    Climate Summit <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Program</span>
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                                    Investing in Climate Solutions - Finance, Innovation, and Action
                                </p>

                                {/* Event Details */}
                                <div className="flex flex-wrap justify-center gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <span className="font-medium">14th-16th October 2025</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                        <span className="font-medium">Masinde Muliro University</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Program Preview Section */}
                    <section className="py-16">
                        <div className="container mx-auto px-6">
                            <div className="max-w-5xl mx-auto">

                                {/* Program Preview Card */}
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                                        <div className="flex items-center justify-between text-white">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-6 h-6" />
                                                <h2 className="text-2xl font-bold">Event Program</h2>
                                            </div>
                                            <button
                                                onClick={handleOpenPDF}
                                                className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
                                            >
                                                <span>Open Full PDF</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Program Screenshot Preview */}
                                    <div className="p-8">
                                        <p className="text-gray-600 mb-6 text-center">
                                            Click on the image below to view the complete program
                                        </p>

                                        <div
                                            className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-2xl"
                                            onClick={handleOpenPDF}
                                        >
                                            {/* Replace the src with your actual screenshot path */}
                                            <img
                                                src="/images/lrebprogram.png"
                                                alt="Climate Summit Program Preview - Click to view full PDF"
                                                className="w-full h-auto"
                                            />

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                                                    <div className="bg-white rounded-full p-6 shadow-2xl">
                                                        <ExternalLink className="w-8 h-8 text-green-600" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Click to View Badge */}
                                            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Click to View PDF
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleOpenPDF}
                                        className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <FileText className="w-6 h-6" />
                                        <span>View Complete Program</span>
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <footer />


        </>
    );
};

export default ProgramPage;