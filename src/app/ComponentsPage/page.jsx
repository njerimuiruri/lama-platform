'use client';
import React from 'react';
import { Database, Network, BarChart3, Lightbulb, ArrowRight, Users, Globe, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

const ComponentsPage = () => {
    const mainComponents = [
        {
            icon: <Database className="w-12 h-12" />,
            title: "Indicators Database",
            description: "Comprehensive repository of locally led adaptation indicators from across Africa",
            features: [
                "Community-validated metrics and indicators",
                "Sectoral categorization (agriculture, water, health, etc.)",
                "Regional and national comparisons",
                "Historical trend analysis",
                "Success story documentation"
            ],
            color: "from-green-500 to-emerald-600",
            bgColor: "from-green-50 to-emerald-50"
        },
        {
            icon: <Network className="w-12 h-12" />,
            title: "Knowledge Platform",
            description: "Interactive platform connecting researchers, practitioners, and communities",
            features: [
                "Peer learning networks and communities of practice",
                "Best practice sharing mechanisms",
                "Collaborative research tools",
                "Multi-language content support",
                "Virtual and in-person event coordination"
            ],
            color: "from-blue-500 to-cyan-600",
            bgColor: "from-blue-50 to-cyan-50"
        },
        {
            icon: <BarChart3 className="w-12 h-12" />,
            title: "Assessment Framework",
            description: "Standardized yet flexible framework for measuring adaptation effectiveness",
            features: [
                "Bottom-up indicators development process",
                "Inclusivity and equity metrics",
                "Impact assessment methodologies",
                "Vulnerability mapping tools",
                "Progress tracking dashboards"
            ],
            color: "from-purple-500 to-indigo-600",
            bgColor: "from-purple-50 to-indigo-50"
        },
        {
            icon: <Lightbulb className="w-12 h-12" />,
            title: "Capacity Building",
            description: "Training and resources to strengthen local adaptation leadership",
            features: [
                "Community-based training workshops",
                "Technical skill development programs",
                "Resource development and dissemination",
                "Mentorship and coaching support",
                "Certification programs for local practitioners"
            ],
            color: "from-orange-500 to-red-600",
            bgColor: "from-orange-50 to-red-50"
        }
    ];

    const additionalFeatures = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Community Engagement",
            description: "Tools and processes for meaningful community participation in all platform activities"
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Policy Integration",
            description: "Mechanisms to feed local insights into national and international policy frameworks"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Innovation Hub",
            description: "Space for testing and scaling innovative adaptation approaches and technologies"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-white py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Platform <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Components</span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light">
                            Interconnected tools and systems supporting locally led adaptation across Africa
                        </p>
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-2xl mb-16">
                            <h2 className="text-2xl font-bold mb-4">Integrated Platform Approach</h2>
                            <p className="text-xl leading-relaxed">
                                The LAMA platform consists of four interconnected components designed to work together,
                                creating a comprehensive ecosystem for locally led adaptation measurement, learning, and action across Africa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Components */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Core Components</h2>

                        <div className="space-y-16">
                            {mainComponents.map((component, index) => (
                                <div key={index} className={`${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-12 items-center`}>
                                    <div className="lg:w-1/2">
                                        <div className={`bg-gradient-to-br ${component.bgColor} p-8 rounded-2xl border border-gray-200`}>
                                            <div className={`inline-flex p-4 bg-gradient-to-r ${component.color} rounded-xl text-white mb-6`}>
                                                {component.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{component.title}</h3>
                                            <p className="text-gray-700 text-lg mb-6">{component.description}</p>

                                            <div className="space-y-3">
                                                {component.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:w-1/2">
                                        <div className={`h-64 bg-gradient-to-br ${component.color} rounded-2xl flex items-center justify-center`}>
                                            <div className="text-white text-center">
                                                {component.icon}
                                                <p className="mt-4 text-lg font-semibold opacity-90">
                                                    {component.title} Visualization
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Additional Features</h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {additionalFeatures.map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-700">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How Components Work Together</h2>

                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                                {mainComponents.map((component, index) => (
                                    <div key={index} className="text-center">
                                        <div className={`inline-flex p-3 bg-gradient-to-r ${component.color} rounded-xl text-white mb-4`}>
                                            {React.cloneElement(component.icon, { className: "w-8 h-8" })}
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">{component.title}</h4>
                                        <p className="text-sm text-gray-600">{component.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center space-x-4 text-gray-400">
                                <ArrowRight className="w-6 h-6" />
                                <ArrowRight className="w-6 h-6" />
                                <ArrowRight className="w-6 h-6" />
                            </div>

                            <div className="mt-8 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Integrated Impact</h3>
                                <p className="text-gray-700 max-w-3xl mx-auto">
                                    Data flows seamlessly between components, enabling communities to measure their progress,
                                    share knowledge, build capacity, and influence policy through evidence-based insights.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Explore the Platform?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Discover how these components can support your locally led adaptation initiatives
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/demo" className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                            View Demo
                        </Link>
                        <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ComponentsPage;