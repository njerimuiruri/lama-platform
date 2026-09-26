'use client';
import React, { useEffect, useState } from 'react';
import { Banknote, BarChart2, CloudSun, Leaf, Megaphone, Sprout, Users } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';
import PlatformSubNav from '@/components/PlatformSubNav/PlatformSubNav';
import DataGate from '@/components/ContentGate/DataGate';
import SurveySwitch from '../components/SurveySwitch';
import data from './beninData.json';
import {
    PeopleTopic, FarmingTopic, ImpactsTopic, InformationTopic, AdaptationTopic, FinanceTopic, IndicatorsTopic, fieldworkDates,
} from './topics';

const TOPICS = [
    { id: 'people', name: 'People', icon: Users, component: PeopleTopic },
    { id: 'farming', name: 'Farming', icon: Leaf, component: FarmingTopic },
    { id: 'impacts', name: 'Climate impacts', icon: CloudSun, component: ImpactsTopic },
    { id: 'information', name: 'Information', icon: Megaphone, component: InformationTopic },
    { id: 'adaptation', name: 'Adaptation', icon: Sprout, component: AdaptationTopic },
    { id: 'finance', name: 'Finance', icon: Banknote, component: FinanceTopic },
    { id: 'indicators', name: 'Measuring success', icon: BarChart2, component: IndicatorsTopic },
];

export default function BeninDashboard() {
    const [activeTopic, setActiveTopic] = useState(TOPICS[0].id);
    const [grouping, setGrouping] = useState('gender');
    const [highlight, setHighlight] = useState(null);

    // Keep the chosen topic in the URL so views can be shared (e.g. #finance)
    useEffect(() => {
        const fromHash = window.location.hash.slice(1);
        if (TOPICS.some(t => t.id === fromHash)) setActiveTopic(fromHash);
    }, []);

    const selectTopic = (id) => {
        setActiveTopic(id);
        setHighlight(null);
        window.history.replaceState(null, '', `#${id}`);
    };
    const selectGrouping = (key) => {
        setGrouping(key);
        setHighlight(null);
    };

    const topic = TOPICS.find(t => t.id === activeTopic) ?? TOPICS[0];
    const TopicView = topic.component;
    const gender = data.groupings.gender.groups;

    return (
        <>
            <LamaNavbar />
            <PlatformSubNav />
            <main className="bg-gray-50/60 min-h-screen">

                {/* Header */}
                <section className="bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">What households in Glazoué told us</h1>
                            <p className="text-gray-500 mt-1.5 max-w-2xl">
                                Household survey in Glazoué commune, Benin — on farming, climate impacts, information, adaptation and
                                finance. Pick a topic, then compare groups.
                            </p>
                            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                                <span className="font-semibold text-gray-900">{data.meta.respondents} people surveyed</span>
                                <span className="text-gray-400">·</span>
                                {gender.map(g => `${g.n} ${g.label.toLowerCase()}`).join(' · ')}
                            </p>
                        </div>
                        <SurveySwitch />
                    </div>
                </section>

                {/* Controls: topic + comparison */}
                <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur border-y border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col lg:flex-row lg:items-center gap-2.5 lg:gap-4">
                        <nav className="flex-1 min-w-0 overflow-x-auto" aria-label="Dashboard topics">
                            <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1">
                                {TOPICS.map(t => {
                                    const Icon = t.icon;
                                    const isActive = t.id === topic.id;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => selectTopic(t.id)}
                                            aria-current={isActive ? 'page' : undefined}
                                            className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : ''}`} />
                                            {t.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500 lg:hidden xl:inline">Compare by</span>
                            <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1" role="group" aria-label="Compare groups by">
                                {Object.entries(data.groupings).map(([key, g]) => (
                                    <button
                                        key={key}
                                        onClick={() => selectGrouping(key)}
                                        aria-pressed={grouping === key}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${grouping === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topic */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
                    <DataGate
                        variant="chart"
                        label="Benin household survey analytics"
                        description="Register for free to explore the full interactive charts from the Glazoué household survey."
                    >
                        <div key={`${topic.id}-${grouping}`} className="animate-in fade-in duration-300">
                            <TopicView grouping={grouping} highlight={highlight} onHighlight={setHighlight} />
                        </div>
                        <p className="mt-4 text-xs text-gray-400">
                            Source: LAMA household survey, {data.meta.place}, {data.meta.respondents} respondents
                            ({fieldworkDates(data.meta.fieldwork)}), translated from French. Ages 51–69 and
                            over 70 are combined as “51 and over”. Hover over a bar for details, click a legend to highlight a
                            group, or switch a chart to a table.
                        </p>
                    </DataGate>
                </section>
            </main>
            <LamaFooter />
        </>
    );
}
