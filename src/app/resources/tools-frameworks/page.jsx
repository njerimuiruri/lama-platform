"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Layers, TrendingUp, Target, Sparkles, BarChart3, Globe, Zap } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';

export default function AdaptationToolsFramework() {
    const [loading, setLoading] = useState(true);
    const [activeCard, setActiveCard] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: Layers,
            title: "Comprehensive Frameworks",
            description: "Access detailed measurement frameworks for adaptation initiatives",
            color: "from-emerald-400 to-teal-400"
        },
        {
            icon: TrendingUp,
            title: "Impact Analysis",
            description: "Evaluate and track the effectiveness of adaptation measures",
            color: "from-blue-400 to-cyan-400"
        },
        {
            icon: Target,
            title: "Strategic Tools",
            description: "Utilize proven tools for measuring adaptation outcomes",
            color: "from-purple-400 to-pink-400"
        }
    ];

    const stats = [
        { icon: BarChart3, label: "Frameworks", value: "20+" },
        { icon: Globe, label: "Countries", value: "50+" },
        { icon: Zap, label: "Tools", value: "30+" }
    ];

    return (


        <>
            <LamaNavbar />
            <div className="min-h-screen bg-gradient-to-br from-[#eefdf5] via-white to-emerald-50 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#eefdf5] rounded-full blur-3xl opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-20 animate-pulse delay-500"></div>
                </div>

                {/* Header Section with Enhanced Design */}

                {/* Main Content */}
                <div className="container mx-auto px-6 pb-16 relative">
                    <div className="max-w-7xl mx-auto">
                        {/* Enhanced Tableau Card */}
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>

                            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                                {/* Enhanced Header */}
                                <div className="bg-gradient-to-r from-[#eefdf5] via-white to-emerald-50 px-8 py-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                                                <Layers className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-black">Interactive Dashboard</h2>
                                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                                    <Globe className="w-4 h-4" />
                                                    Africa Research and Impact Networks
                                                </p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-emerald-700">Live Data</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tableau Visualization */}
                                <div className="relative bg-gradient-to-br from-gray-50 to-white">
                                    {loading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                                            <div className="text-center">
                                                <div className="relative">
                                                    <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mx-auto mb-4" />
                                                    <Sparkles className="w-6 h-6 text-teal-500 absolute top-0 right-0 animate-pulse" />
                                                </div>
                                                <p className="text-gray-700 font-semibold text-lg mb-2">Loading your data...</p>
                                                <p className="text-gray-500 text-sm">Preparing interactive visualizations</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-full" style={{ height: '900px' }}>
                                        <iframe
                                            src="https://public.tableau.com/views/AdaptationMeasurementFrameworksandTools/AdaptationMeasurementFrameworksandTools-D?:embed=y&:display_count=no&:showVizHome=no&:toolbar=no"
                                            className="w-full h-full border-0"
                                            allowFullScreen
                                            onLoad={() => setLoading(false)}
                                        />
                                    </div>
                                </div>

                                {/* Enhanced Footer */}
                                <div className="bg-gradient-to-r from-emerald-50 via-[#eefdf5] to-white px-8 py-5 border-t border-gray-100">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-emerald-600" />
                                            Use the interactive controls to explore different frameworks and tools
                                        </p>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
                                                Interactive
                                            </div>
                                            <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
                                                Real-time
                                            </div>
                                            <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
                                                Filterable
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Feature Cards */}
                        <div className="grid md:grid-cols-3 gap-8 mt-16">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => setActiveCard(index)}
                                    onMouseLeave={() => setActiveCard(null)}
                                    className="group relative"
                                >
                                    {/* Card glow effect */}
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>

                                    <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2">
                                        <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl w-fit mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                            <feature.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="font-bold text-xl mb-3 text-black group-hover:text-emerald-700 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>

                                        {/* Animated indicator */}
                                        <div className={`mt-6 flex items-center gap-2 text-emerald-600 font-medium text-sm transition-all duration-300 ${activeCard === index ? 'translate-x-2' : ''}`}>
                                            <span>Learn more</span>
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

                <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
            </div>

            <LamaFooter />

        </>

    );
}