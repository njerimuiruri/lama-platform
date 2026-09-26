"use client";
import React, { useState } from 'react';
import { ExternalLink, Filter, MousePointerClick, Search } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import PlatformSubNav from '@/components/PlatformSubNav/PlatformSubNav';
import LamaFooter from '@/components/Footer/footer';

const TABLEAU_VIEW = 'https://public.tableau.com/views/AdaptationMeasurementFrameworksandTools/AdaptationMeasurementFrameworksandTools-D';
const EMBED_URL = `${TABLEAU_VIEW}?:embed=y&:display_count=no&:showVizHome=no&:toolbar=no`;

const steps = [
    { icon: Filter, title: 'Filter', text: 'Use the filters and menus inside the catalogue to narrow the list.' },
    { icon: MousePointerClick, title: 'Select', text: 'Click a framework or tool to see its details.' },
    { icon: Search, title: 'Compare', text: 'Compare approaches to choose one that fits your context.' },
];

export default function AdaptationToolsFramework() {
    const [loading, setLoading] = useState(true);

    return (
        <>
            <LamaNavbar />
            <PlatformSubNav />
            <main className="bg-gray-50/60 min-h-screen">

                {/* Header */}
                <section className="bg-white border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Adaptation measurement frameworks and tools</h1>
                            <p className="text-gray-500 mt-1.5 max-w-2xl">
                                A searchable catalogue of frameworks and tools used to measure climate adaptation — to help you find
                                the right approach for tracking locally led adaptation.
                            </p>
                        </div>
                        <a
                            href={TABLEAU_VIEW}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 self-start md:self-auto rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors flex-shrink-0"
                        >
                            Open full screen in Tableau <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-5">
                    {/* How to use */}
                    <ol className="grid sm:grid-cols-3 gap-3">
                        {steps.map(({ icon: Icon, title, text }, i) => (
                            <li key={title} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{i + 1}. {title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    {/* Embedded tool */}
                    <div className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden">
                        {loading && (
                            <div className="absolute inset-0 z-10 p-6 space-y-4 bg-white" aria-hidden="true">
                                <div className="h-6 w-1/3 rounded bg-gray-100 animate-pulse" />
                                <div className="grid grid-cols-4 gap-3">
                                    {[0, 1, 2, 3].map(i => <div key={i} className="h-9 rounded bg-gray-100 animate-pulse" />)}
                                </div>
                                <div className="h-[60%] rounded-xl bg-gray-100 animate-pulse" />
                                <p className="text-sm text-gray-400 text-center">Loading the frameworks catalogue…</p>
                            </div>
                        )}
                        <iframe
                            src={EMBED_URL}
                            title="Adaptation measurement frameworks and tools"
                            className="w-full border-0 block h-[75vh] min-h-[560px] max-h-[900px]"
                            allowFullScreen
                            onLoad={() => setLoading(false)}
                        />
                    </div>
                    <p className="text-xs text-gray-400">
                        The catalogue is hosted on Tableau Public. If it does not load, <a href={TABLEAU_VIEW} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">open it directly</a>.
                    </p>
                </section>
            </main>
            <LamaFooter />
        </>
    );
}
