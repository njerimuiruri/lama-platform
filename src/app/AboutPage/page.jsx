'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Shield, TrendingUp, Eye, Layers, Building, Book, Globe,
    ArrowRight, BarChart3, Database, X, Users, Target, ArrowUpRight, HelpCircle,
} from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';
import MerlSpotlightSection from '@/components/MerlSpotlightSection/MerlSpotlightSection';
import projectsData from '../../../data/data/projects.json';

const sections = [
    { id: 'why', label: 'Why LAMA' },
    { id: 'what', label: 'What it does' },
    { id: 'objectives', label: 'Objectives' },
    { id: 'research', label: 'Research' },
    { id: 'partnerships', label: 'Partnerships' },
    { id: 'advisory', label: 'Advisory group' },
];

const advisors = [
    {
        name: "Ms. Omari Kulthoum",
        role: "Coordinator for the African Group of Negotiations (AGN)",
        background: "Climate Adaptation & Drought Governance",
        bio: "Coordinator for the African Group of Negotiations (AGN) on the Africa Adaptation Initiative. She’s also a PhD candidate at the University of Cape Town with the African Climate Development Initiative studying adaptation governance, with a particular focus on drought governance in Botswana. She has extensive experience in climate adaptation, and in 2018, she joined the Adaptation Committee (AC).",
        image: "/images/omar.png",
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
        bio: "Rosemary Gumba is a multifaceted professional with two decades of experience in school administration and psychology. As a seasoned psychologist, she offers valuable insights, while her experience in school management translates to effective leadership. Her passion extends beyond her core roles, as she actively champions environmental innovation. Rosemary’s positive energy and motivational spirit are infectious, uplifting colleagues and inspiring success.",
        image: "/images/rosemary.png",
    },
];

const whySteps = [
    {
        label: 'The problem',
        text: 'Africa has hundreds of local climate adaptation projects, but they work in isolation. There is no shared way to measure what works, who it works for, or how much it costs.',
    },
    {
        label: 'The challenge',
        text: 'Funding decisions are made without community voices. Bottom-up indicators — those that reflect what vulnerable people actually need — are missing from frameworks like NAPs, NDCs and the GGA.',
    },
    {
        label: 'The solution',
        text: 'LAMA consolidates locally led adaptation data into one accessible platform, connecting community-level evidence to national and global policy so it is easier to track, fund and scale what works.',
    },
];

const relevancePoints = [
    {
        icon: Shield,
        title: "Equity and inclusivity",
        description: "A space for dialogue and co-creation to map granular indicators as presented by vulnerable groups — metrics that are co-produced and strategic for measuring the distributional impact of climate change.",
        stat: "50% of 1.5B vulnerable people rely on farming",
    },
    {
        icon: TrendingUp,
        title: "Demonstrate effectiveness",
        description: "Captures already assessed adaptation solutions, while giving actors room to shape their initiatives to meet the principles for adaptation and LLA.",
        stat: "$50B annual adaptation funding target",
    },
    {
        icon: Eye,
        title: "Tracking and reporting",
        description: "Tracks expenditures, reviews and integration with policy processes, with easy-to-access links between budget allocation and spending for the most vulnerable.",
        stat: "Budget tracking",
    },
    {
        icon: Layers,
        title: "Sharing and learning",
        description: "A simple view of how indicators, sectors and budgets connect — bringing key adaptation information to local communities, women and young people across Africa.",
        stat: "One-stop shop for LLA resources",
    },
];

const objectives = [
    {
        icon: Building,
        title: "Capacity building",
        highlight: "Expert support",
        description: "Support African countries and researchers to develop adaptation indicators that capture local priorities in an inclusive way.",
    },
    {
        icon: Book,
        title: "Knowledge sharing",
        highlight: "Best practices",
        description: "Share experiences and best practices in adaptation measurement among projects and initiatives working at the local level.",
    },
    {
        icon: Globe,
        title: "Framework development",
        highlight: "Global alignment",
        description: "Consolidate knowledge on adaptation metrics in Africa and align it with national and global frameworks such as NAPs, NDCs, the GGA and the GST.",
    },
];

const researchQuestions = [
    { icon: Users, text: "What are the priority adaptation needs and aspirations of small-scale farmers (SSFs) and their vulnerable groups at the local level?" },
    { icon: TrendingUp, text: "What progress has been made in capturing the needs of SSFs in adaptation assessment, and what approaches can be used to capture these needs?" },
    { icon: Target, text: "What metrics capture the aspirations of SSFs, including various gender groups, and how can these aspirations be enabled in adaptation interventions?" },
    { icon: ArrowUpRight, text: "How can LLA metrics be aligned to national processes and gain traction in national adaptation planning and global adaptation assessment, rather than remaining project-level numbers?" },
];

const SectionHeader = ({ eyebrow, title, description }) => (
    <div className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">{eyebrow}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-gray-500 mt-2 leading-relaxed">{description}</p>}
    </div>
);

const AdvisorPhoto = ({ advisor, className }) => {
    const [failed, setFailed] = useState(false);
    const initials = advisor.name.replace(/^(Ms\.|Mr\.|Professor|Dr\.)\s+/, '').split(' ').map(w => w[0]).slice(0, 2).join('');
    if (failed) {
        return (
            <div className={`${className} bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold`}>
                {initials}
            </div>
        );
    }
    return <img src={advisor.image} alt={advisor.name} className={`${className} object-cover`} onError={() => setFailed(true)} />;
};

const AboutPage = () => {
    const [openAdvisor, setOpenAdvisor] = useState(null);
    const [indicatorTotal, setIndicatorTotal] = useState(null);

    useEffect(() => {
        fetch('/api/public/stats')
            .then(r => r.json())
            .then(data => setIndicatorTotal(Object.values(data).reduce((sum, v) => sum + (Number(v) || 0), 0)))
            .catch(() => setIndicatorTotal(null));
    }, []);

    // Close the advisor bio with Escape
    useEffect(() => {
        if (!openAdvisor) return;
        const onKey = (e) => { if (e.key === 'Escape') setOpenAdvisor(null); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [openAdvisor]);

    const facts = useMemo(() => {
        const countries = new Set(projectsData.map(p => p.Country.trim())).size;
        return [
            { value: indicatorTotal ? indicatorTotal.toLocaleString() : '—', label: 'Indicator records' },
            { value: projectsData.length, label: 'Adaptation projects' },
            { value: countries, label: 'African countries' },
            { value: '10', label: 'Expert advisors' },
        ];
    }, [indicatorTotal]);

    return (
        <>
            <LamaNavbar />
            <main className="bg-white">

                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-b from-[#eefdf5] to-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 lg:pt-12 lg:pb-12">
                        <div className="grid lg:grid-cols-12 gap-10 items-center">
                            <div className="lg:col-span-7">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    About LAMA · IDRC-funded
                                </div>
                                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
                                    Bridging the gap between{' '}
                                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                        adaptation needs and investment
                                    </span>
                                </h1>
                                <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-xl">
                                    LAMA is an IDRC-funded programme building a shared platform for measuring, learning from
                                    and scaling locally led climate adaptation across Africa.
                                </p>

                                <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {facts.map(fact => (
                                        <div key={fact.label}>
                                            <dt className="sr-only">{fact.label}</dt>
                                            <dd className="text-2xl font-bold text-gray-900 tabular-nums">{fact.value}</dd>
                                            <dd className="text-xs text-gray-500 mt-0.5">{fact.label}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="relative">
                                    <img
                                        src="/images/lamapic.jpeg"
                                        alt="Community collaboration in climate adaptation"
                                        className="w-full h-56 sm:h-72 lg:h-[320px] object-cover rounded-2xl shadow-xl"
                                    />
                                    <div className="absolute -bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64 rounded-xl bg-white/95 backdrop-blur border border-gray-100 shadow-lg px-4 py-3">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Our aim</p>
                                        <p className="text-sm text-gray-700 mt-0.5 leading-snug">
                                            Co-develop indicators that capture how effective and inclusive adaptation is at community level.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* In-page navigation */}
                <nav className="sticky top-14 sm:top-16 z-30 bg-white/90 backdrop-blur border-y border-gray-100" aria-label="About page sections">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
                        {sections.map(s => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="flex-shrink-0 px-3 py-3 text-sm font-medium text-gray-500 hover:text-emerald-700 border-b-2 border-transparent hover:border-emerald-500 transition-colors"
                            >
                                {s.label}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* Why LAMA exists */}
                <section id="why" className="scroll-mt-28 py-10 lg:py-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <SectionHeader eyebrow="Why LAMA exists" title="From scattered projects to shared evidence" />
                        <ol className="grid md:grid-cols-3 gap-4 md:gap-0 md:rounded-2xl md:border md:border-gray-100 md:divide-x md:divide-gray-100 md:overflow-hidden">
                            {whySteps.map((step, i) => {
                                const isSolution = i === whySteps.length - 1;
                                return (
                                    <li
                                        key={step.label}
                                        className={`relative p-6 lg:p-8 rounded-2xl md:rounded-none border md:border-0 ${isSolution ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-gray-100'}`}
                                    >
                                        <span className={`text-xs font-bold tabular-nums ${isSolution ? 'text-emerald-100' : 'text-gray-400'}`}>0{i + 1}</span>
                                        <h3 className={`mt-2 text-lg font-bold ${isSolution ? 'text-white' : 'text-gray-900'}`}>{step.label}</h3>
                                        <p className={`mt-2 text-sm leading-relaxed ${isSolution ? 'text-emerald-50' : 'text-gray-600'}`}>{step.text}</p>
                                        {!isSolution && (
                                            <span className="hidden md:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 items-center justify-center">
                                                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </section>

                {/* What the dashboard does */}
                <section id="what" className="scroll-mt-28 py-10 lg:py-12 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <SectionHeader
                            eyebrow="What the dashboard does"
                            title="Four ways LAMA makes adaptation count"
                        />
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                            {relevancePoints.map(point => {
                                const Icon = point.icon;
                                return (
                                    <div key={point.title} className="group rounded-2xl bg-white border border-gray-100 p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{point.title}</h3>
                                                <p className="text-sm text-gray-600 leading-relaxed mt-1.5">{point.description}</p>
                                                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {point.stat}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Objectives */}
                <section id="objectives" className="scroll-mt-28 py-10 lg:py-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <SectionHeader
                            eyebrow="Our objectives"
                            title="What we set out to do"
                            description="Three objectives drive our work to advance locally led adaptation across Africa."
                        />
                        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
                            {objectives.map((objective, i) => {
                                const Icon = objective.icon;
                                return (
                                    <div key={objective.title} className="rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-3xl font-black text-gray-100 tabular-nums">0{i + 1}</span>
                                        </div>
                                        <h3 className="mt-4 font-bold text-gray-900">{objective.title}</h3>
                                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{objective.highlight}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed mt-3">{objective.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Research questions */}
                <section id="research" className="scroll-mt-28 py-10 lg:py-12 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <SectionHeader
                            eyebrow="Guiding our research"
                            title="Key research questions"
                            description="The questions behind LAMA’s work with small-scale farmers and vulnerable communities."
                        />
                        <ol className="grid md:grid-cols-2 gap-4 sm:gap-5">
                            {researchQuestions.map((q, i) => {
                                const Icon = q.icon;
                                return (
                                    <li key={i} className="flex gap-4 rounded-2xl bg-white border border-gray-100 p-6">
                                        <div className="flex-shrink-0">
                                            <span className="w-9 h-9 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                                        </div>
                                        <div>
                                            <Icon className="w-4 h-4 text-emerald-600 mb-2" />
                                            <p className="text-gray-700 leading-relaxed">{q.text}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                        <p className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                            <HelpCircle className="w-3.5 h-3.5" />
                            SSFs = small-scale farmers · LLA = locally led adaptation
                        </p>
                    </div>
                </section>

                {/* Partnerships (id="partnerships" is set inside the component) */}
                <MerlSpotlightSection />

                {/* Advisory group */}
                <section id="advisory" className="scroll-mt-28 py-10 lg:py-12 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <SectionHeader
                            eyebrow="LAMA advisory group"
                            title="Guided by African adaptation experts"
                            description="Ten experts from the African Group of Negotiators, research, the private sector, government and local communities. They consolidate best practices and indicators, link local metrics to national and international frameworks, support the AGN’s contributions to the Global Goal on Adaptation, and inform IPCC assessments."
                        />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            {advisors.map(advisor => (
                                <button
                                    key={advisor.name}
                                    onClick={() => setOpenAdvisor(advisor)}
                                    className="group text-left rounded-2xl bg-white border border-gray-100 overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <AdvisorPhoto advisor={advisor} className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 leading-snug">{advisor.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1 leading-snug">{advisor.role}</p>
                                        <p className="text-xs text-emerald-700 font-semibold mt-3 inline-flex items-center gap-1">
                                            Read bio <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Closing call to action */}
                <section className="py-10 lg:py-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="rounded-2xl bg-gray-900 px-6 py-8 sm:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">See the data behind LAMA</h2>
                                <p className="text-gray-400 mt-2 max-w-lg">
                                    Explore adaptation indicators from global frameworks down to Kenyan counties, and the projects on the ground.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                                <Link
                                    href="/dashboard/sitedashboard"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-900 px-5 py-3 font-semibold transition-colors"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Explore the dashboard
                                </Link>
                                <Link
                                    href="/indicators"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:bg-white/10 text-white px-5 py-3 font-semibold transition-colors"
                                >
                                    <Database className="w-4 h-4" />
                                    Browse indicators
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Advisor bio */}
            {openAdvisor && (
                <div
                    className="fixed inset-0 z-[1100] bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-4"
                    onClick={() => setOpenAdvisor(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={openAdvisor.name}
                >
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="grid sm:grid-cols-5">
                            <AdvisorPhoto advisor={openAdvisor} className="w-full h-56 sm:h-full sm:col-span-2 sm:rounded-l-2xl" />
                            <div className="sm:col-span-3 p-6 relative">
                                <button
                                    onClick={() => setOpenAdvisor(null)}
                                    className="absolute top-3 right-3 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 pr-10">{openAdvisor.background}</p>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">{openAdvisor.name}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{openAdvisor.role}</p>
                                <p className="text-sm text-gray-700 leading-relaxed mt-4">{openAdvisor.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <LamaFooter />
        </>
    );
};

export default AboutPage;
