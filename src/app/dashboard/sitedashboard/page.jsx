'use client';
import React, { useState } from 'react';
import { BarChart2, Users, Leaf, Shield, Layers, Eye, CloudRain, Database, Map, Wrench, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LamaNavbar from '@/components/Navbar/navbar';
import LandOwnership from '../LandOwnership';
import FarmingSystems from '../FarmingSystems';
import VulnerabilityStatus from '../VulnerabilityStatus';
import BarriersMarginalized from '../BarriersMarginalized';
import PrioritySectors from '../prioritysector';
import ObservableImpacts from '../observableimpacts';
import ClimateInfo from '../climateinfor';
import LamaFooter from '@/components/Footer/footer';
import PlatformSubNav from '@/components/PlatformSubNav/PlatformSubNav';

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
            component: VulnerabilityStatus,
        },
        {
            id: 'barriers-marginalized',
            name: 'Barriers for Marginalized',
            icon: Layers,
            component: BarriersMarginalized,
        },
        {
            id: 'priority-sectors',
            name: 'Priority Sectors',
            icon: BarChart2,
            component: PrioritySectors,
        },
        {
            id: 'observable-impacts',
            name: 'Observable CC Impacts',
            icon: Eye,
            component: ObservableImpacts,
        },
        {
            id: 'climate-info',
            name: 'Access Climate Info',
            icon: CloudRain,
            component: ClimateInfo,
        }
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || (() => null);

    return (
        <>
            <LamaNavbar />
            <PlatformSubNav />
            <div className="min-h-screen bg-white overflow-x-hidden">
                <div className="relative z-10">
                    {/* Tab Navigation */}
                    <section className="py-4 bg-gray-50 border-b border-gray-200">
                        <div className="container mx-auto px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-3 py-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-700 text-xs font-medium">Land Systems Dashboard</span>
                                    </div>
                                </div>
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

                    {/* Components Navigation */}
                    <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50 border-t border-green-100">
                        <div className="container mx-auto px-6">
                            <div className="max-w-5xl mx-auto">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
                                    Explore More Platform Components
                                </h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <Link href="/resources/interventions-database">
                                        <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Map className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors">LLA Interventions Database</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Projects across Africa</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/resources/tools-frameworks">
                                        <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Wrench className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors">Tools & Frameworks</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Guides, toolkits & methods</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href="/indicators/Lama-indicator">
                                        <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <Database className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors">LLA Indicators</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Locally led metrics</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <LamaFooter />
        </>
    );
};

export default LandDashboard;