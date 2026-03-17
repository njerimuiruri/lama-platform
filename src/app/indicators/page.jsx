"use client";
import React from 'react';
import Link from 'next/link';
import {
    Database, Globe, MapPin, Flag, Leaf,
    Building2, BarChart3, FileText, Target, ChevronRight
} from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';

const groups = [
    {
        level: 'LLA',
        label: 'Locally Led Adaptation',
        color: 'emerald',
        icon: Leaf,
        items: [
            {
                title: 'LLA Indicator Matrix',
                short: 'Community-level adaptation indicators by thematic sector',
                href: '/indicators/Lama-indicator',
                icon: Target,
            },
        ],
    },
    {
        level: 'Sub-National',
        label: 'County Level',
        color: 'blue',
        icon: MapPin,
        items: [
            {
                title: 'County Integrated Development Plans',
                short: 'CIDPs 2023–2027 — KPIs by sector and priority area',
                href: '/indicators/County_Intergrated_Development_Plans',
                icon: Building2,
            },
            {
                title: 'County Climate Change Adaptation Plans',
                short: 'CCAPs — Adaptation activities and monitoring indicators per county',
                href: '/indicators/County_Climate_Change_Adaptation',
                icon: Leaf,
            },
        ],
    },
    {
        level: 'National',
        label: 'Kenya National Frameworks',
        color: 'purple',
        icon: Flag,
        items: [
            {
                title: 'Nationally Determined Contributions',
                short: 'NDCs — Kenya\'s Paris Agreement climate commitments',
                href: '/indicators/National_NDC',
                icon: Globe,
            },
            {
                title: 'National Climate Change Action Plan',
                short: 'NCCAP — Priority sectors, actions, and KPIs',
                href: '/indicators/National_Climate_Change_Action_Plan',
                icon: BarChart3,
            },
            {
                title: 'National Adaptation Plans',
                short: 'NAPs — Long-term strategic adaptation indicators',
                href: '/indicators/National_Adaptation_Plans',
                icon: FileText,
            },
        ],
    },
    {
        level: 'Global',
        label: 'International Frameworks',
        color: 'orange',
        icon: Globe,
        items: [
            {
                title: 'Global Goal on Adaptation',
                short: 'GGA — UAE Framework for Global Climate Resilience (COP28)',
                href: '/indicators/Global_Goal_on_Adaptation',
                icon: Target,
            },
            {
                title: 'Global Indicators Database',
                short: 'Multi-organisation global climate indicator submissions',
                href: '/indicators/gloabal_indicators',
                icon: Database,
            },
        ],
    },
];

const palette = {
    emerald: {
        badge: 'bg-emerald-100 text-emerald-700',
        border: 'border-emerald-200',
        hover: 'hover:border-emerald-400 hover:bg-emerald-50',
        icon: 'bg-emerald-100 text-emerald-600',
        arrow: 'text-emerald-500',
        left: 'border-l-4 border-emerald-500',
    },
    blue: {
        badge: 'bg-blue-100 text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:border-blue-400 hover:bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        arrow: 'text-blue-500',
        left: 'border-l-4 border-blue-500',
    },
    purple: {
        badge: 'bg-purple-100 text-purple-700',
        border: 'border-purple-200',
        hover: 'hover:border-purple-400 hover:bg-purple-50',
        icon: 'bg-purple-100 text-purple-600',
        arrow: 'text-purple-500',
        left: 'border-l-4 border-purple-500',
    },
    orange: {
        badge: 'bg-orange-100 text-orange-700',
        border: 'border-orange-200',
        hover: 'hover:border-orange-400 hover:bg-orange-50',
        icon: 'bg-orange-100 text-orange-600',
        arrow: 'text-orange-500',
        left: 'border-l-4 border-orange-500',
    },
};

export default function IndicatorsLandingPage() {
    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-gray-50 overflow-x-hidden">

                {/* Compact header */}
                <div className="bg-white border-b border-gray-200 px-6 py-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <Database className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Indicators</h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-11">Select a framework below to explore climate change indicators</p>
                    </div>
                </div>

                {/* All groups */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                    {groups.map(group => {
                        const p = palette[group.color];
                        const GroupIcon = group.icon;
                        return (
                            <div key={group.level}>
                                {/* Group label */}
                                <div className={`flex items-center gap-2 mb-3 pl-3 ${p.left}`}>
                                    <GroupIcon className={`w-4 h-4 ${p.arrow}`} />
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.badge}`}>{group.level}</span>
                                    <span className="text-sm font-semibold text-gray-700">{group.label}</span>
                                </div>

                                {/* Cards */}
                                <div className="space-y-2">
                                    {group.items.map(item => {
                                        const ItemIcon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-4 bg-white border ${p.border} ${p.hover} rounded-xl px-4 py-3.5 transition-all duration-150 group`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${p.icon}`}>
                                                    <ItemIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.short}</p>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${p.arrow} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <LamaFooter />
        </>
    );
}
