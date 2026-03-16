'use client';
import React from 'react';
import { Layers, Clock, DollarSign, Megaphone, Users, Building2, Loader2, ChevronRight, AlertCircle } from 'lucide-react';

const previewCards = [
    {
        icon: DollarSign,
        title: 'Access to Finance Barriers',
        description: 'What financial obstacles prevent marginalized groups from investing in climate adaptation — such as lack of loans, insurance, or savings?',
        color: 'from-green-500 to-emerald-600',
        border: 'border-green-200',
    },
    {
        icon: Megaphone,
        title: 'Information & Awareness Gaps',
        description: 'Which groups lack access to climate information, early warning systems, or training on adaptation methods?',
        color: 'from-blue-500 to-cyan-600',
        border: 'border-blue-200',
    },
    {
        icon: Users,
        title: 'Social & Cultural Barriers',
        description: 'How do social norms, gender roles, and cultural practices limit certain groups from participating in climate decisions?',
        color: 'from-purple-500 to-violet-600',
        border: 'border-purple-200',
    },
    {
        icon: Building2,
        title: 'Policy & Institutional Barriers',
        description: 'What gaps in government policy, land rights, or institutional support create obstacles for marginalized communities?',
        color: 'from-orange-500 to-red-600',
        border: 'border-orange-200',
    },
];

const BarriersMarginalized = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-xl mb-6">
                        <Layers className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-3">Barriers for Marginalized Groups</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        This section will highlight the <strong>specific barriers preventing women, youth, elderly, and other marginalized groups</strong> from accessing climate resources and support. Understanding these barriers is the first step to removing them.
                    </p>
                </div>

                {/* Why it matters callout */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-amber-900 mb-1">Why this matters</h3>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            Marginalized groups are often the most affected by climate change, yet the least supported. This tab will help decision-makers see exactly what stands in the way of <strong>inclusive climate adaptation</strong> — so support can be targeted where it is needed most.
                        </p>
                    </div>
                </div>

                {/* Status banner */}
                <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 mb-10 flex items-center gap-5 shadow-sm">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-900">Data Collection In Progress</h3>
                            <span className="px-3 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">Coming Soon</span>
                        </div>
                        <p className="text-sm text-gray-600">Field surveys with marginalized community members are underway. This tab will be populated with validated barrier data once collection is complete.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg flex-shrink-0">
                        <Clock className="w-4 h-4" />
                        <span>Est. Q3 2025</span>
                    </div>
                </div>

                {/* Preview cards */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">What this section will show</h2>
                    <p className="text-gray-500 text-sm mb-6">Four barrier categories will be explored once data is available.</p>
                    <div className="grid md:grid-cols-2 gap-5">
                        {previewCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div key={i} className={`relative bg-white rounded-2xl p-6 border-2 ${card.border} shadow-sm opacity-75`}>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">Coming Soon</span>
                                    </div>
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                                    <div className="mt-4 h-8 bg-gray-100 rounded-lg animate-pulse" />
                                    <div className="mt-2 h-2 bg-gray-100 rounded-full animate-pulse w-2/3" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA box */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white text-center shadow-xl">
                    <Layers className="w-10 h-10 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-black mb-3">Removing Barriers Starts With Understanding Them</h3>
                    <p className="text-white/90 max-w-2xl mx-auto leading-relaxed">
                        This data is being collected through participatory research — meaning community members help define the barriers themselves. This ensures the data reflects lived realities, not outside assumptions.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/20 rounded-full px-5 py-2 text-sm font-semibold border border-white/30">
                        <Clock className="w-4 h-4" />
                        Community surveys in progress — check back soon
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BarriersMarginalized;
