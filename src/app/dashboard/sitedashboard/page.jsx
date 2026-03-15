'use client';
import React, { useState } from 'react';
import { BarChart, Users, Leaf, Shield, Layers, Eye, CloudRain } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LandOwnership from '../LandOwnership';
import FarmingSystems from '../FarmingSystems';
import prioritysector from '../prioritysector';

import observableimpacts from '../observableimpacts';
import climateinfor from '../climateinfor';

import LamaFooter from '@/components/Footer/footer';

const LandDashboard = () => {
    const [activeTab, setActiveTab] = useState('land-ownership');

    const tabs = [
        {
            id: 'land-ownership',
            name: 'Land Ownership',
            icon: Users,
            component: LandOwnership
        },
        {
            id: 'farming-system',
            name: 'Farming System',
            icon: Leaf,
            component: FarmingSystems
        },
        {
            id: 'vulnerability-status',
            name: 'Vulnerability Status',
            icon: Shield,
            component: () => <div className="p-8 text-center text-gray-500">Vulnerability Status component coming soon...</div>
        },
        {
            id: 'barriers-marginalized',
            name: 'Barriers for Marginalized',
            icon: Layers,
            component: () => <div className="p-8 text-center text-gray-500">Barriers for Marginalized component coming soon...</div>
        },
        {
            id: 'priority-sectors',
            name: 'Priority Sectors',
            icon: BarChart,
            component: prioritysector,
        },
        {
            id: 'observable-impacts',
            name: 'Observable CC Impacts',
            icon: Eye,
            component: observableimpacts,
        },
        {
            id: 'climate-info',
            name: 'Access Climate Info',
            icon: CloudRain,
            component: climateinfor,

        }
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || (() => null);

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
                                    <span className="text-green-700 text-sm font-medium">Land Systems Dashboard</span>
                                </div>
                                {/* <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                                    Land <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Analytics</span> Dashboard
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Comprehensive analysis of land systems, ownership patterns, and agricultural insights
                                </p> */}
                            </div>
                        </div>
                    </section>

                    {/* Tab Navigation */}
                    <section className="py-8 bg-gray-50 border-b border-gray-200">
                        <div className="container mx-auto px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${isActive
                                                    ? 'bg-green-600 text-white shadow-lg transform scale-105'
                                                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="whitespace-nowrap">{tab.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tab Content */}
                    <section className="min-h-screen">
                        <ActiveComponent />
                    </section>
                </div>
            </div>
            <LamaFooter />
        </>
    );
};

export default LandDashboard;