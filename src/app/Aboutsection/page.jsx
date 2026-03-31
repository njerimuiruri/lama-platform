// src/app/Aboutsection/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, MapPin, Layers, TrendingUp, Database, Loader, ChevronRight, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import projectsData from '../../../data/data/projects.json';

// Dynamically import AfricaMapSection with no SSR
const AfricaMapSection = dynamic(() => import('@/components/AfricaMapSection'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
            <div className="text-center">
                <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading map...</p>
            </div>
        </div>
    )
});

const DataPlatformsSection = () => {
    const [stats, setStats] = useState({ ndc: 0, naps: 0, nccap: 0, cidps: 0, ccap: 0, lla: 0, gga: 0, global: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/public/stats')
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const platforms = [
        {
            icon: Layers,
            title: "Global Goal on Adaptation",
            description: "Explore comprehensive climate indicators organized by sectors. Navigate through detailed frameworks linking local metrics to global adaptation goals.",
            stats: [
                { label: "GGA Records", value: loading ? '…' : stats.gga, color: "from-emerald-500 to-teal-600" },
                { label: "NDC Records", value: loading ? '…' : stats.ndc, color: "from-blue-500 to-cyan-600" },
                { label: "NAP Records", value: loading ? '…' : stats.naps, color: "from-purple-500 to-pink-600" }
            ],
            route: "/indicators/Global_Goal_on_Adaptation",
            gradient: "from-emerald-50 to-teal-50",
            borderColor: "border-emerald-200",
            hoverColor: "hover:border-emerald-400",
            buttonColor: "from-emerald-500 to-teal-600",
            features: [
                "Sector-by-sector breakdown",
                "Linked to NAPs, NDCs & NCCAP",
                "Downloadable CSV with watermark"
            ]
        },
        {
            icon: MapPin,
            title: "County Climate Adaptation",
            description: "Discover climate initiatives across all Kenyan counties. Filter by strategic sectors, track indicators, and explore adaptation activities at the local level.",
            stats: [
                { label: "CCAP Records", value: loading ? '…' : stats.ccap, color: "from-green-500 to-emerald-600" },
                { label: "CIDP Records", value: loading ? '…' : stats.cidps, color: "from-teal-500 to-cyan-600" },
                { label: "LLA Records", value: loading ? '…' : stats.lla, color: "from-lime-500 to-green-600" }
            ],
            route: "/indicators/County_Climate_Change_Adaptation",
            gradient: "from-green-50 to-emerald-50",
            borderColor: "border-green-200",
            hoverColor: "hover:border-green-400",
            buttonColor: "from-green-500 to-emerald-600",
            features: [
                "All 47 Kenyan counties",
                "Strategic sector filters",
                "County-level KPI tracking"
            ]
        }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-16">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-white border-2 border-emerald-500 rounded-full px-6 py-3 shadow-lg mb-6">
                        <Database className="w-5 h-5 text-emerald-600 animate-pulse" />
                        <span className="text-emerald-600 text-sm font-bold tracking-wide uppercase">Data Platforms</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
                        Explore Our
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 block mt-2">
                            Climate Data Resources
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Access comprehensive climate adaptation data through specialized platforms designed for impact
                    </p>
                </div>
            </div>

            {/* Data Platforms Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    {platforms.map((platform, index) => {
                        const Icon = platform.icon;
                        return (
                            <div
                                key={index}
                                className={`group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${platform.borderColor} ${platform.hoverColor}`}
                            >
                                {/* Header */}
                                <div className={`bg-gradient-to-br ${platform.gradient} p-8 border-b-2 ${platform.borderColor}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${platform.stats[0].color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-600 group-hover:text-emerald-700 group-hover:translate-x-2 transition-all duration-300">
                                            <span className="text-sm font-bold">Explore</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3">{platform.title}</h3>
                                    <p className="text-gray-700 leading-relaxed">{platform.description}</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="p-6 bg-white grid grid-cols-3 gap-4">
                                    {platform.stats.map((stat, idx) => (
                                        <div key={idx} className="text-center">
                                            <div className={`inline-flex flex-col items-center justify-center w-full h-20 bg-gradient-to-br ${stat.color} rounded-xl shadow-md mb-2 group-hover:scale-105 transition-transform duration-300`}>
                                                <span className="text-2xl font-black text-white">{stat.value}</span>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Features */}
                                <div className="p-6 bg-gray-50 border-t-2 border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="w-4 h-4 text-emerald-600" />
                                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">What's inside</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {platform.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                                <div className={`w-2 h-2 bg-gradient-to-br ${platform.stats[0].color} rounded-full flex-shrink-0`} />
                                                <p className="text-sm font-medium text-gray-700">{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="p-6 bg-white border-t-2 border-gray-100">
                                    <a
                                        href={platform.route}
                                        className={`group/btn w-full bg-gradient-to-r ${platform.buttonColor} text-white py-4 rounded-xl font-bold text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3`}
                                    >
                                        View Full Platform
                                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info Section */}
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
                            <Database className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">Live Data</span>
                        </div>

                        <h3 className="text-3xl md:text-4xl font-black mb-4">Real-Time Climate Insights</h3>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                            Our platforms are continuously updated with the latest climate adaptation data, ensuring you have access to the most current information for informed decision-making.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <TrendingUp className="w-12 h-12 text-white mx-auto mb-3" />
                                <h4 className="text-xl font-bold mb-2">Dynamic Updates</h4>
                                <p className="text-white/80 text-sm">Data refreshed regularly to reflect latest interventions</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <Database className="w-12 h-12 text-white mx-auto mb-3" />
                                <h4 className="text-xl font-bold mb-2">Comprehensive Coverage</h4>
                                <p className="text-white/80 text-sm">Pan-African scope with county-level granularity</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <Globe className="w-12 h-12 text-white mx-auto mb-3" />
                                <h4 className="text-xl font-bold mb-2">Global Standards</h4>
                                <p className="text-white/80 text-sm">Aligned with international frameworks and best practices</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AboutPage({ mode = 'full' }) {
    return (
        <>
            <AfricaMapSection projects={projectsData} mode={mode} />
            {mode !== 'intro-only' && <DataPlatformsSection />}
        </>
    );
}