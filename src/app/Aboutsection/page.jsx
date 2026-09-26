// src/app/Aboutsection/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe, Landmark, MapPin, Loader, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import projectsData from '../../../data/data/projects.json';

// Dynamically import AfricaMapSection with no SSR
const AfricaMapSection = dynamic(() => import('@/components/AfricaMapSection'), {
    ssr: false,
    loading: () => (
        <div className="min-h-[50vh] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
            <div className="text-center">
                <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading map...</p>
            </div>
        </div>
    )
});

const DataPlatformsSection = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/public/stats')
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // Counts come live from the backend; each row links to its indicator page
    const groups = [
        {
            icon: Globe,
            title: "Global",
            description: "International adaptation frameworks",
            items: [
                { label: "Global Goal on Adaptation", key: "gga", route: "/indicators/Global_Goal_on_Adaptation" },
                { label: "Global Indicators", key: "global", route: "/indicators/gloabal_indicators" },
            ],
        },
        {
            icon: Landmark,
            title: "National",
            description: "Kenya's national climate plans",
            items: [
                { label: "Nationally Determined Contributions", short: "NDCs", key: "ndc", route: "/indicators/National_NDC" },
                { label: "National Adaptation Plans", short: "NAPs", key: "naps", route: "/indicators/National_Adaptation_Plans" },
                { label: "Climate Change Action Plan", short: "NCCAP", key: "nccap", route: "/indicators/National_Climate_Change_Action_Plan" },
            ],
        },
        {
            icon: MapPin,
            title: "County & Local",
            description: "Counties and communities",
            items: [
                { label: "County Adaptation Plans", short: "CCAPs", key: "ccap", route: "/indicators/County_Climate_Change_Adaptation" },
                { label: "County Development Plans", short: "CIDPs", key: "cidps", route: "/indicators/County_Intergrated_Development_Plans" },
                { label: "Locally Led Adaptation", short: "LLA", key: "lla", route: "/indicators/Lama-indicator" },
            ],
        },
    ];

    const count = (key) => {
        const value = Number(stats?.[key]);
        return Number.isFinite(value) ? value : 0;
    };
    const show = (value) => (loading ? '…' : value > 0 ? value.toLocaleString() : '—');

    const total = groups.flatMap(g => g.items).reduce((sum, item) => sum + count(item.key), 0);

    return (
        <section className="py-10 lg:py-14 bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
                            Data Platforms
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Explore our climate data
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-xl">
                            Adaptation indicators from global frameworks down to Kenyan counties — updated as new data is added.
                        </p>
                    </div>
                    <div className="self-start sm:self-auto text-left sm:text-right">
                        <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none">{show(total)}</p>
                        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5 sm:justify-end">
                            <span className="relative flex w-2 h-2">
                                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                            </span>
                            live indicator records
                        </p>
                    </div>
                </div>

                {/* Groups */}
                <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
                    {groups.map((group) => {
                        const Icon = group.icon;
                        const groupTotal = group.items.reduce((sum, item) => sum + count(item.key), 0);
                        return (
                            <div
                                key={group.title}
                                className="group/card rounded-2xl border border-gray-200/80 bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Card header */}
                                <div className="p-5 pb-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/card:bg-emerald-600 group-hover/card:text-white transition-colors duration-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{show(groupTotal)}</p>
                                            <p className="text-[11px] text-gray-400 mt-1">records</p>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mt-4">{group.title}</h3>
                                    <p className="text-sm text-gray-500">{group.description}</p>
                                </div>

                                {/* Datasets */}
                                <ul className="border-t border-gray-100 divide-y divide-gray-100 mt-auto">
                                    {group.items.map((item) => (
                                        <li key={item.key}>
                                            <a
                                                href={item.route}
                                                className="group flex items-center justify-between gap-3 px-5 py-3 hover:bg-emerald-50/50 transition-colors"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-medium text-gray-800 group-hover:text-emerald-700 transition-colors truncate">
                                                        {item.label}
                                                    </span>
                                                    {item.short && (
                                                        <span className="block text-[11px] text-gray-400">{item.short}</span>
                                                    )}
                                                </span>
                                                <span className="flex items-center gap-1 flex-shrink-0">
                                                    <span className="text-sm font-semibold text-gray-900 tabular-nums">
                                                        {show(count(item.key))}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-center">
                    <a
                        href="/indicators"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        Browse all indicators
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
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