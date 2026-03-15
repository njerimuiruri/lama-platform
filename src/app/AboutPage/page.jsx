'use client';
import React, { useState, useEffect } from 'react';
import {
    Shield, TrendingUp, Eye, Layers, Building, Book, Globe,
    CheckCircle, ArrowRight, Award, ChevronLeft, ChevronRight, Quote
} from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';

const AboutPage = () => {
    const [currentAdvisor, setCurrentAdvisor] = useState(0);

    const advisors = [
        {
            name: "Ms. Omari Kulthoum",
            role: "Coordinator for the African Group of Negotiations (AGN)",
            background: "Climate Adaptation & Drought Governance",
            bio: "Coordinator for the African Group of Negotiations (AGN) on the Africa Adaptation Initiative. She&rsquo;s also a PhD candidate at the University of Cape Town with the African Climate Development Initiative studying adaptation governance, with a particular focus on drought governance in Botswana. She has extensive experience in climate adaptation, and in 2018, she joined the Adaptation Committee (AC).",
            image: "/images/omari.png",
        },
        {
            name: "Professor Anthony Nyong",
            role: "Director of Climate Change and Green Growth",
            background: "Climate Change & Green Growth at AfDB",
            bio: "Director of Climate Change and Green Growth at the African Development Bank (AfDB). Mr. Nyong has about 30 years of experience in environmental and natural resources management, renewable energy and green growth. He was a Coordinating Lead Author for the IPCC Fourth Assessment Report and is named among the top 20 of the 100 most Influential People in Climate Policy by 2019 by Apolitical",
            image: "/images/antony.png",
        },
        {
            name: "Charles Mwangi",
            role: "Head of Programs at PACJA",
            background: "Climate Change & Community Development",
            bio: "Charles Mwangi is a seasoned Climate Change Specialist with over 17 years of experience working across local, national, and international levels. Currently, as the Head of Programs at the Pan African Climate Justice Alliance (PACJA), he plays a pivotal role in designing and executing climate change and community-based development initiatives across Africa. He oversees the implementation of 11 such initiatives across all 51 African countries.",
            image: "/images/charlesmwangi.png",
        },
        {
            name: "Rosemary A. Gumba",
            role: "Environmental Innovation Champion",
            background: "School Administration & Psychology",
            bio: "Rosemary Gumba is a multifaceted professional with two decades of experience in school administration and psychology. As a seasoned psychologist, she offers valuable insights, while her experience in school management translates to effective leadership. Her passion extends beyond her core roles, as she actively champions environmental innovation. Rosemary&rsquo;s positive energy and motivational spirit are infectious, uplifting colleagues and inspiring success.",
            image: "/images/rosemary.png",
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAdvisor((prev) => (prev + 1) % advisors.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [advisors.length]);

    const nextAdvisor = () => {
        setCurrentAdvisor((prev) => (prev + 1) % advisors.length);
    };

    const prevAdvisor = () => {
        setCurrentAdvisor((prev) => (prev - 1 + advisors.length) % advisors.length);
    };

    const objectives = [
        {
            icon: Building,
            title: "Capacity Building",
            description:
                "Provide expert support to African countries and researchers to enhance their capacity to develop adaptation indicators that effectively capture local priorities in an inclusive manner.",
            highlight: "Expert Support",
        },
        {
            icon: Book,
            title: "Knowledge Sharing",
            description:
                "Facilitate the sharing of experiences and best practices in adaptation measurement among various projects and initiatives operating at the local level.",
            highlight: "Best Practices",
        },
        {
            icon: Globe,
            title: "Framework Development",
            description:
                "Consolidate knowledge and priorities regarding adaptation metrics in Africa, aligning them with national and global frameworks such as NAPs, NDCs, the GGA, and the GST.",
            highlight: "Global Alignment",
        },
    ];

    const relevancePoints = [
        {
            icon: Shield,
            title: "Equity and Inclusivity",
            description:
                "The LAMA dashboard provides space for dialogue and co-creation processes to map adequate granular indicators as presented by vulnerable groups. It captures metrics that are co-produced and strategic for measuring the distributional impact of climate change.",
            stats: "50% of 1.5B vulnerable people rely on farming",
        },
        {
            icon: TrendingUp,
            title: "Demonstrate Effectiveness",
            description:
                "The dashboard provides an interactive space for capturing already assessed adaptation solutions while providing room for actors to shape their initiatives to meet all the principles for adaptation and LLA.",
            stats: "$50B annual adaptation funding target",
        },
        {
            icon: Eye,
            title: "Tracking and Reporting",
            description:
                "Enables tracking and reporting on expenditures, reviews and integration with policy processes. It provides equitable LLA investment opportunities for the most vulnerable through easy-to-access linkages between budget allocation and expenses.",
            stats: "Real-time budget tracking capabilities",
        },
        {
            icon: Layers,
            title: "Sharing and Learning",
            description:
                "The dashboard provides a simplified format for presentation of the interplay between indicators, sectors, and budgets. It aims to provide key adaptation information to local communities, women, and young people across Africa.",
            stats: "One-stop shop for LLA resources",
        },
    ];

    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-16 sm:top-32 right-4 sm:right-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-2xl sm:blur-3xl opacity-40"></div>
                    <div className="absolute bottom-16 sm:bottom-32 left-4 sm:left-20 w-36 h-36 sm:w-72 sm:h-72 bg-gradient-to-tr from-blue-50 to-sky-50 rounded-full blur-2xl sm:blur-3xl opacity-30"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-emerald-50 to-green-50 rounded-full blur-2xl sm:blur-3xl opacity-20"></div>
                </div>

                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-emerald-50">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                    {/* Content Section */}
                                    <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                                        <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-3 sm:px-4 py-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-green-700 text-xs sm:text-sm font-medium">
                                                About LAMA Platform
                                            </span>
                                        </div>

                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
                                            Bridging the Gap Between
                                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block">
                                                Adaptation Needs & Investment
                                            </span>
                                        </h1>

                                        <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                                            <p>
                                                Despite growing interest in accelerating locally led adaptation (LLA), evidence on effective interventions, vulnerability-specific approaches, and investment opportunities remains scarce. This gap is primarily due to the absence of dedicated bottom-up indicators or community-led frameworks and metrics.
                                            </p>
                                            <p className="hidden sm:block">
                                                Africa currently hosts numerous adaptation interventions and projects, each operating in isolation, hindered by geographical, linguistic, ethnic, sectoral, and disciplinary disparities. The LAMA Platform addresses this challenge by fostering learning and consolidation of locally led adaptation indicators across Africa.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image Section */}
                                    <div className="relative order-1 lg:order-2">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl sm:rounded-3xl transform rotate-2 sm:rotate-3"></div>
                                        <div className="relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl">
                                            <img
                                                src="/images/fgd1.jpg"
                                                alt="Community collaboration in climate adaptation"
                                                className="rounded-xl sm:rounded-2xl w-full h-64 sm:h-80 object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* The Challenge Section */}
                    <section className="py-12 sm:py-16 lg:py-20">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-12 sm:mb-16">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        The <span className="text-green-600">Challenge</span> We Address
                                    </h2>
                                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                                        Understanding the critical gaps in locally led adaptation measurement and reporting
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-red-100">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                            Current Reality
                                        </h3>
                                        <ul className="space-y-3 text-gray-700">
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Absence of dedicated bottom-up indicators or community-led frameworks</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Projects operate in isolation with limited scope assessment frameworks</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Evaluations confined to project periods, rarely shared or integrated</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Geographical, linguistic, and sectoral disparities hinder collaboration</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                            LAMA Solution
                                        </h3>
                                        <ul className="space-y-3 text-gray-700">
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Establish a comprehensive platform for learning and consolidation of LLA indicators</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Convene stakeholders to facilitate sharing of experiences, tools, and indicators</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Develop locally led frameworks to inform Global Goal on Adaptation (GGA)</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span>Bridge the gap between adaptation needs and investment opportunities</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why LAMA Matters Section */}
                    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="text-center mb-12 sm:mb-16">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        Relevance of the <span className="text-green-600">LAMA Dashboard</span>
                                    </h2>
                                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                                        Four key areas where LAMA dashboard creates transformative impact for climate adaptation
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                                    {relevancePoints.map((point, index) => {
                                        const Icon = point.icon;
                                        return (
                                            <div key={index} className="group">
                                                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                                                {point.title}
                                                            </h3>
                                                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <span className="hidden sm:inline">
                                                                    {point.stats}
                                                                </span>
                                                                <span className="sm:hidden">Key Metric</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                                        {point.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Objectives Section */}
                    <section className="py-12 sm:py-16 lg:py-20">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="text-center mb-12 sm:mb-16">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        Our <span className="text-green-600">Objectives</span>
                                    </h2>
                                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                                        Three core objectives driving our mission to advance locally led adaptation across Africa
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                                    {objectives.map((objective, index) => {
                                        const Icon = objective.icon;
                                        return (
                                            <div key={index} className="group">
                                                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full hover:border-green-200">
                                                    <div className="text-center">
                                                        <div className="inline-flex p-3 sm:p-4 bg-green-100 rounded-2xl mb-4 sm:mb-6">
                                                            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                                                        </div>
                                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-green-600 transition-colors duration-300">
                                                            {objective.title}
                                                        </h3>
                                                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4">
                                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span>{objective.highlight}</span>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                                            {objective.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Advisory Group Section */}
                    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-12 sm:mb-16">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                        LAMA <span className="text-green-600">Advisory Group</span>
                                    </h2>
                                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
                                        Composed of ten experts from diverse backgrounds (including the African Group of Negotiators, research, private sector, government, and local communities), this group will consolidate best practices and indicators. The expert group will also play a crucial role in linking local metrics to national and international frameworks, supporting the African Group of Negotiators&rsquo; contributions to the Global Goal on Adaptation, and informing IPCC assessments.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-3 sm:px-4 py-2">
                                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                            <span className="text-green-700 text-xs sm:text-sm font-medium">
                                                Expert Network
                                            </span>
                                        </div>
                                        <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300">
                                            View All Members
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
                                        <div className="relative h-auto">
                                            {advisors.map((advisor, index) => (
                                                <div
                                                    key={index}
                                                    className={`transition-all duration-500 ease-in-out ${index === currentAdvisor
                                                        ? "opacity-100 transform translate-x-0 relative"
                                                        : "opacity-0 transform translate-x-full absolute inset-0"
                                                        }`}
                                                >
                                                    <div className="flex flex-col md:grid md:grid-cols-2">
                                                        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 sm:p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                                                            <div className="relative">
                                                                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                                                    <img
                                                                        src={advisor.image}
                                                                        alt={advisor.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                                    <Quote className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="p-6 sm:p-8 flex flex-col justify-center min-h-[300px] md:min-h-[400px]">
                                                            <div className="mb-4 sm:mb-6">
                                                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                                    {advisor.name}
                                                                </h3>
                                                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2">
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                    <span className="hidden sm:inline">
                                                                        {advisor.role}
                                                                    </span>
                                                                    <span className="sm:hidden">Expert</span>
                                                                </div>
                                                                <p className="text-gray-600 font-medium text-sm sm:text-base">
                                                                    {advisor.background}
                                                                </p>
                                                            </div>
                                                            <p className="text-gray-700 leading-relaxed italic text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: `&ldquo;${advisor.bio}&rdquo;` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="absolute top-1/2 transform -translate-y-1/2 left-2 sm:left-4 z-10">
                                            <button
                                                onClick={prevAdvisor}
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl"
                                            >
                                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                            </button>
                                        </div>
                                        <div className="absolute top-1/2 transform -translate-y-1/2 right-2 sm:right-4 z-10">
                                            <button
                                                onClick={nextAdvisor}
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl"
                                            >
                                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                                            {advisors.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentAdvisor(index)}
                                                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentAdvisor
                                                        ? "bg-white shadow-lg"
                                                        : "bg-white/50 hover:bg-white/70"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
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

export default AboutPage;