'use client';
import React, { useEffect, useState } from 'react';
import { BarChart2, Clock, CloudRain, Eye, Leaf, Users } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';
import PlatformSubNav from '@/components/PlatformSubNav/PlatformSubNav';
import DataGate from '@/components/ContentGate/DataGate';
import { RESPONDENTS, GROUPINGS } from '../surveyData';
import SurveySwitch from '../components/SurveySwitch';
import {
    LandTopic, FarmingTopic, PriorityTopic, ImpactsTopic, ClimateInfoTopic, ComingSoonTopic,
} from '../components/topics';

const TOPICS = [
    { id: 'land-ownership', name: 'Land', icon: Users, component: LandTopic },
    { id: 'farming-system', name: 'Farming', icon: Leaf, component: FarmingTopic },
    { id: 'priority-sectors', name: 'Priorities', icon: BarChart2, component: PriorityTopic },
    { id: 'observable-impacts', name: 'Climate impacts', icon: Eye, component: ImpactsTopic },
    { id: 'climate-info', name: 'Climate info', icon: CloudRain, component: ClimateInfoTopic },
    {
        id: 'coming-soon', name: 'Coming soon', icon: Clock, soon: true,
        component: () => (
            <div className="space-y-5">
            <ComingSoonTopic
                title="Vulnerability status"
                description="Which groups face the highest climate vulnerability — by gender, age, location and livelihood. Communities are helping to validate these indicators through ongoing field surveys."
                views={[
                    { title: 'Vulnerability by gender', description: 'How climate vulnerability differs between women and men.' },
                    { title: 'Vulnerability by age group', description: 'Whether youth, adults or elderly face the greatest risks.' },
                    { title: 'Where vulnerability is highest', description: 'A map of the areas most exposed to climate shocks.' },
                    { title: 'Livelihood risk', description: 'Which livelihoods — farming, pastoralism, fishing — are most at risk.' },
                ]}
            />
            <ComingSoonTopic
                title="Barriers for marginalized groups"
                description="What stops women, youth, the elderly and other marginalized groups from accessing climate support. Community members are defining these barriers themselves through participatory research."
                views={[
                    { title: 'Access to finance', description: 'Missing loans, insurance or savings for adaptation.' },
                    { title: 'Information gaps', description: 'Who lacks early warnings, climate information or training.' },
                    { title: 'Social and cultural barriers', description: 'How norms and gender roles limit participation in climate decisions.' },
                    { title: 'Policy and institutions', description: 'Gaps in policy, land rights or institutional support.' },
                ]}
            />
            </div>
        ),
    },
];

const LandDashboard = () => {
    const [activeTopic, setActiveTopic] = useState(TOPICS[0].id);
    const [grouping, setGrouping] = useState('age');
    const [highlight, setHighlight] = useState(null);

    // Keep the chosen topic in the URL so views can be shared (e.g. #climate-info)
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

    return (
        <>
            <LamaNavbar />
            <PlatformSubNav />
            <main className="bg-gray-50/60 min-h-screen">

                {/* Header */}
                <section className="bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">What communities told us</h1>
                            <p className="text-gray-500 mt-1.5 max-w-2xl">
                                Community survey results on land, farming, climate impacts and climate information. Pick a topic, then compare groups.
                            </p>
                            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                                <span className="font-semibold text-gray-900">{RESPONDENTS} people surveyed</span>
                                <span className="text-gray-400">·</span>
                                {GROUPINGS.gender.groups.map(g => `${g.n} ${g.label.toLowerCase()}`).join(' · ')}
                            </p>
                        </div>
                        <SurveySwitch />
                    </div>
                </section>

                {/* Controls: topic + comparison — one filter row that scopes every chart below */}
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
                                            className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${isActive
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : t.soon ? 'text-gray-400 hover:text-gray-600' : 'text-gray-600 hover:text-gray-900'}`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : ''}`} />
                                            {t.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>

                        {!topic.soon && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-500 lg:hidden xl:inline">Compare by</span>
                                <div className="inline-flex gap-1 rounded-xl bg-gray-100 p-1" role="group" aria-label="Compare groups by">
                                    {Object.entries(GROUPINGS).map(([key, g]) => (
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
                        )}
                    </div>
                </div>

                {/* Topic */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
                    <DataGate
                        variant="chart"
                        label="Community survey analytics"
                        description="Register for free to explore the full interactive charts on land, farming, climate impacts and climate information."
                    >
                        <div key={`${topic.id}-${grouping}`} className="animate-in fade-in duration-300">
                            <TopicView grouping={grouping} highlight={highlight} onHighlight={setHighlight} />
                        </div>
                        {!topic.soon && (
                            <p className="mt-4 text-xs text-gray-400">
                                Source: LAMA community survey, {RESPONDENTS} respondents. Hover over a bar for details, click a legend to highlight a group, or switch a chart to a table.
                            </p>
                        )}
                    </DataGate>
                </section>
            </main>
            <LamaFooter />
        </>
    );
};

export default LandDashboard;
