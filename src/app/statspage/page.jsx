'use client';
import React from 'react';
import { TrendingUp, Users, DollarSign, Globe, BarChart3, Target, AlertTriangle, Shield } from 'lucide-react';

const StatsPage = () => {
    const mainStats = [
        {
            icon: Users,
            number: "1.5B",
            label: "Vulnerable People in Africa",
            description: "People across Africa who are directly impacted by climate change and need adaptation support",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: TrendingUp,
            number: "50%",
            label: "Rely on Climate-Sensitive Agriculture",
            description: "Of Africa&apos;s vulnerable population depends on farming for their primary livelihood",
        },
        {
            icon: DollarSign,
            number: "$50B",
            label: "Annual Adaptation Funding Commitment",
            description: "Committed during COP 26 to scale up adaptation for vulnerable communities, including women and marginalized people",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Globe,
            number: "54",
            label: "African Countries",
            description: "Countries across the African continent that can benefit from LAMA platform initiatives",
            color: "from-orange-500 to-orange-600"
        }
    ];

    const platformStats = [
        {
            icon: Target,
            number: "10",
            label: "Expert Advisory Members",
            description: "Experts from diverse backgrounds including the African Group of Negotiators, research, private sector, government, and local communities"
        },
        {
            icon: BarChart3,
            number: "5",
            label: "Platform Components",
            description: "Interconnected components working together: Dashboard, Database, Repository, Engagement Platform, and Expert Group"
        },
        {
            icon: Shield,
            number: "3",
            label: "Core Objectives",
            description: "Capacity Building, Knowledge Sharing, and Framework Development focused on locally led adaptation"
        },
        {
            icon: AlertTriangle,
            number: "Multiple",
            label: "Vulnerability Types",
            description: "Addressing intersectional vulnerabilities across geographical, linguistic, ethnic, sectoral, and disciplinary disparities"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-32 left-20 w-72 h-72 bg-gradient-to-tr from-blue-50 to-sky-50 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 mb-8">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-700 text-sm font-medium">LAMA Statistics</span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                Key <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Statistics</span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
                                Critical numbers that highlight the urgent need for locally led adaptation across Africa and the scale of LAMA&apos;s impact
                            </p>
                        </div>
                    </div>
                </section>

                {/* Climate Impact Stats */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    Climate <span className="text-green-600">Impact Reality</span>
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    African communities face severe climate challenges that demand immediate adaptation action
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {mainStats.map((stat, index) => (
                                    <div key={index} className="group">
                                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                            <div className="flex items-start gap-6">
                                                <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                                                    <stat.icon className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{stat.label}</h3>
                                                    <p className="text-gray-600 leading-relaxed">{stat.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                                Why <span className="text-green-600">Action is Urgent</span>
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8 mt-12">
                                <div className="p-6">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertTriangle className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Resource Misallocation</h3>
                                    <p className="text-gray-600">Without clear understanding of local resilience indicators, resources may be misallocated, hindering progress towards a more resilient future</p>
                                </div>

                                <div className="p-6">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Fragmented Efforts</h3>
                                    <p className="text-gray-600">Adaptation projects operate in isolation, hindered by geographical, linguistic, ethnic, sectoral, and disciplinary disparities</p>
                                </div>

                                <div className="p-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">LAMA Solution</h3>
                                    <p className="text-gray-600">Bridging the gap between adaptation needs and investment through locally led, inclusive frameworks and community-driven metrics</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StatsPage;