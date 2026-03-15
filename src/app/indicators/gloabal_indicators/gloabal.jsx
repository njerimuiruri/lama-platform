"use client";
import React, { useState, useMemo } from 'react';
import { ChevronRight, Search, X, FileText, Target, Layers, CheckCircle2, Building2, Sparkles, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import indicatorsData from '../../../../public/documents/MergedIndicatorDatabase_NR.json';

export default function IndicatorDashboard() {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showInfographic, setShowInfographic] = useState(false);
    const [showAllOrganizations, setShowAllOrganizations] = useState(false);

    // Get unique submissions
    const submissions = useMemo(() => {
        const subs = [...new Set(indicatorsData.map(item => item.Submission))].filter(Boolean);
        return subs.sort();
    }, []);

    // Get categories for selected submission
    const categories = useMemo(() => {
        if (!selectedSubmission) return [];
        const cats = [...new Set(
            indicatorsData
                .filter(item => item.Submission === selectedSubmission)
                .map(item => item.Category)
        )].filter(Boolean);
        return cats.sort();
    }, [selectedSubmission]);

    // Get indicators for selected submission and category
    const indicators = useMemo(() => {
        if (!selectedSubmission) return [];

        let filtered = indicatorsData.filter(item => item.Submission === selectedSubmission);

        if (selectedCategory) {
            filtered = filtered.filter(item => item.Category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.Indicator?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [selectedSubmission, selectedCategory, searchTerm]);

    // Calculate statistics for infographic
    const statistics = useMemo(() => {
        const totalIndicators = indicatorsData.length;

        // Submission breakdown
        const submissionCounts = {};
        indicatorsData.forEach(item => {
            if (item.Submission) {
                submissionCounts[item.Submission] = (submissionCounts[item.Submission] || 0) + 1;
            }
        });

        // Thematic targets breakdown
        const thematicTargets = {
            'Water scarcity': 0,
            'Food & agriculture': 0,
            'Health services': 0,
            'Ecosystems': 0,
            'Infrastructure': 0,
            'Poverty eradication': 0,
            'Cultural heritage': 0
        };

        indicatorsData.forEach(item => {
            if (item['Thematic targets - 9a. Water scarcity, sanition, water supply'] === 'X') thematicTargets['Water scarcity']++;
            if (item['Thematic targets - 9b. Food & agriculture production and supply'] === 'X') thematicTargets['Food & agriculture']++;
            if (item['Thematic targets - 9c. Health, health services morbidity & mortality'] === 'X') thematicTargets['Health services']++;
            if (item['Thematic targets - 9d. Ecosystems & biodiversity'] === 'X') thematicTargets['Ecosystems']++;
            if (item['Thematic targets - 9e. Infrastructure & human settlement'] === 'X') thematicTargets['Infrastructure']++;
            if (item['Thematic targets - 9f. Poverty eradication & livelihoods'] === 'X') thematicTargets['Poverty eradication']++;
            if (item['Thematic targets - 9g. Cultural heritage'] === 'X') thematicTargets['Cultural heritage']++;
        });

        // Target 9b breakdown
        const target9b = {
            'Food production': 0,
            'Food supply': 0,
            'Food access': 0,
            'Nutrition': 0
        };

        indicatorsData.forEach(item => {
            if (item['Target 9b relevance - Food production'] === 'X') target9b['Food production']++;
            if (item['Target 9b relevance - Food supply and distribution'] === 'X') target9b['Food supply']++;
            if (item['Target 9b relevance - Food access'] === 'X') target9b['Food access']++;
            if (item['Target 9b relevance - Nutrition'] === 'X') target9b['Nutrition']++;
        });

        // Adaptation relevance breakdown
        const adaptationRelevance = {
            'Climate risks': 0,
            'Vulnerability reduction': 0,
            'Adaptive capacity': 0,
            'Resilience': 0
        };

        indicatorsData.forEach(item => {
            if (item['Adaptation relevance/GGA relevance - Climate risks'] === 'X') adaptationRelevance['Climate risks']++;
            if (item['Adaptation relevance/GGA relevance - Vulnerability reduction'] === 'X') adaptationRelevance['Vulnerability reduction']++;
            if (item['Adaptation relevance/GGA relevance - Adaptive capacity/adaptation actions'] === 'X') adaptationRelevance['Adaptive capacity']++;
            if (item['Adaptation relevance/GGA relevance - Resilience/development impacts'] === 'X') adaptationRelevance['Resilience']++;
        });

        return {
            totalIndicators,
            submissionCounts,
            thematicTargets,
            target9b,
            adaptationRelevance
        };
    }, []);

    // Helper to check if a field has a value
    const hasValue = (value) => value && value !== '' && value !== 'NA';

    // Get Target 9b relevance data (only items marked with 'X')
    const getTarget9bData = (item) => {
        const data = {
            'Food production': item['Target 9b relevance - Food production'],
            'Food supply and distribution': item['Target 9b relevance - Food supply and distribution'],
            'Food access': item['Target 9b relevance - Food access'],
            'Nutrition': item['Target 9b relevance - Nutrition']
        };
        return Object.entries(data).filter(([_, value]) => value === 'X');
    };

    // Get Adaptation relevance data
    const getAdaptationData = (item) => {
        return {
            'Climate risks': item['Adaptation relevance/GGA relevance - Climate risks'],
            'Vulnerability reduction': item['Adaptation relevance/GGA relevance - Vulnerability reduction'],
            'Adaptive capacity/adaptation actions': item['Adaptation relevance/GGA relevance - Adaptive capacity/adaptation actions'],
            'Resilience/development impacts': item['Adaptation relevance/GGA relevance - Resilience/development impacts'],
            'Indicator Function': item['Adaptation relevance/GGA relevance - Indicator Function'],
            'General observations/comments': item['Adaptation relevance/GGA relevance - General observations/comments']
        };
    };

    // Get thematic targets (only items marked with 'X')
    const getThematicTargets = (item) => {
        const targets = {
            'Water scarcity, sanitation, water supply': item['Thematic targets - 9a. Water scarcity, sanition, water supply'],
            'Food & agriculture production and supply': item['Thematic targets - 9b. Food & agriculture production and supply'],
            'Health, health services morbidity & mortality': item['Thematic targets - 9c. Health, health services morbidity & mortality'],
            'Ecosystems & biodiversity': item['Thematic targets - 9d. Ecosystems & biodiversity'],
            'Infrastructure & human settlement': item['Thematic targets - 9e. Infrastructure & human settlement'],
            'Poverty eradication & livelihoods': item['Thematic targets - 9f. Poverty eradication & livelihoods'],
            'Cultural heritage': item['Thematic targets - 9g. Cultural heritage']
        };
        return Object.entries(targets).filter(([_, value]) => value === 'X');
    };

    const handleReset = () => {
        setSelectedSubmission(null);
        setSelectedCategory(null);
        setSearchTerm('');
        setSelectedIndicator(null);
        setIsModalOpen(false);
        setShowInfographic(false);
        setShowAllOrganizations(false);
    };

    const openIndicatorModal = (indicator) => {
        setSelectedIndicator(indicator);
        setIsModalOpen(true);
    };

    // Infographic View
    if (showInfographic) {
        const maxThematic = Math.max(...Object.values(statistics.thematicTargets));
        const maxTarget9b = Math.max(...Object.values(statistics.target9b));
        const maxAdaptation = Math.max(...Object.values(statistics.adaptationRelevance));

        const thematicColors = ['#0d9c5a', '#10b66d', '#13d080', '#7ee3b3', '#a8edc9', '#c5f4dc', '#d9f9e8'];
        const target9bColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'];
        const adaptationColors = ['#0d9c5a', '#34b679', '#5bc99a', '#82dcbb'];

        return (
            <div className="min-h-screen bg-gradient-to-br from-[#eefdf5] via-[#f0fdf4] to-[#dcfce7] p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setShowInfographic(false)}
                            className="flex items-center gap-2 px-5 py-3 bg-white text-[#0d9c5a] hover:bg-[#eefdf5] rounded-xl transition-colors font-semibold shadow-md"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                            Back to Dashboard
                        </button>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-gray-900">Data Visualization</h1>
                            <p className="text-gray-600">Comprehensive indicator analysis</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d9c5a]/20">
                            <div className="flex items-center justify-between mb-2">
                                <BarChart3 className="w-10 h-10 text-[#0d9c5a]" />
                            </div>
                            <h3 className="text-4xl font-bold text-[#0d9c5a] mb-1">{statistics.totalIndicators}</h3>
                            <p className="text-sm text-gray-600 font-medium">Total Indicators</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <Building2 className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-4xl font-bold text-blue-600 mb-1">{Object.keys(statistics.submissionCounts).length}</h3>
                            <p className="text-sm text-gray-600 font-medium">Submissions</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200">
                            <div className="flex items-center justify-between mb-2">
                                <Target className="w-10 h-10 text-amber-600" />
                            </div>
                            <h3 className="text-4xl font-bold text-amber-600 mb-1">{Object.values(statistics.thematicTargets).reduce((a, b) => a + b, 0)}</h3>
                            <p className="text-sm text-gray-600 font-medium">Thematic Targets</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-200">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-4xl font-bold text-emerald-600 mb-1">{Object.values(statistics.target9b).reduce((a, b) => a + b, 0)}</h3>
                            <p className="text-sm text-gray-600 font-medium">Target 9b References</p>
                        </div>
                    </div>

                    {/* Submission Organization Breakdown */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0d9c5a] to-[#10b66d] rounded-xl flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">Indicators by Submission Organization</h2>
                                <p className="text-sm text-gray-600">Distribution across organizations</p>
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                This chart shows how indicators are distributed across different submitting organizations.
                                Each bar represents the number and percentage of indicators contributed by an organization,
                                helping identify major contributors and understand the collaborative nature of the indicator database.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(statistics.submissionCounts)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, showAllOrganizations ? undefined : 5)
                                .map(([org, count], index) => {
                                    const percentage = (count / statistics.totalIndicators) * 100;
                                    return (
                                        <div key={org}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-800">{org}</span>
                                                <span className="text-sm font-bold text-[#0d9c5a]">{count} ({percentage.toFixed(1)}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        background: `linear-gradient(90deg, #0d9c5a, #10b66d)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* See More/Less Button */}
                        {Object.entries(statistics.submissionCounts).length > 5 && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowAllOrganizations(!showAllOrganizations)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0d9c5a] to-[#10b66d] text-white rounded-xl hover:shadow-lg transition-all font-medium"
                                >
                                    {showAllOrganizations ? (
                                        <>
                                            <span>Show Less</span>
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Show All {Object.entries(statistics.submissionCounts).length} Organizations</span>
                                            <ChevronRight className="w-4 h-4 -rotate-90" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Thematic Targets Chart */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#0d9c5a] to-[#13d080] rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Thematic Targets</h2>
                                    <p className="text-sm text-gray-600">Coverage analysis</p>
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-[#0d9c5a] rounded-r-lg">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Thematic targets represent key focus areas for climate adaptation. This visualization shows
                                    how many indicators address each target area, from water scarcity to cultural heritage protection.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(statistics.thematicTargets).map(([target, count], index) => {
                                    const percentage = maxThematic > 0 ? (count / maxThematic) * 100 : 0;
                                    return (
                                        <div key={target}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{target}</span>
                                                <span className="text-sm font-bold text-[#0d9c5a]">{count}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: thematicColors[index]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Target 9b Chart */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Target 9b Relevance</h2>
                                    <p className="text-sm text-gray-600">Food security dimensions</p>
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Target 9b focuses on food and agriculture. This chart breaks down indicator coverage across
                                    the food security chain: production, supply/distribution, access, and nutrition outcomes.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(statistics.target9b).map(([target, count], index) => {
                                    const percentage = maxTarget9b > 0 ? (count / maxTarget9b) * 100 : 0;
                                    return (
                                        <div key={target}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">{target}</span>
                                                <span className="text-sm font-bold text-amber-600">{count}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: target9bColors[index]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Adaptation Relevance */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0d9c5a] to-emerald-600 rounded-xl flex items-center justify-center">
                                <Layers className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Adaptation Relevance / GGA</h2>
                                <p className="text-sm text-gray-600">Climate adaptation dimensions</p>
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                This section maps indicators to the Global Goal on Adaptation (GGA) framework. It shows how indicators
                                contribute to understanding climate risks, reducing vulnerability, building adaptive capacity, and
                                enhancing resilience across different sectors and communities.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(statistics.adaptationRelevance).map(([target, count], index) => {
                                const percentage = maxAdaptation > 0 ? (count / maxAdaptation) * 100 : 0;
                                return (
                                    <div key={target}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-700">{target}</span>
                                            <span className="text-sm font-bold text-[#0d9c5a]">{count}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: adaptationColors[index]
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 1: Select Submission
    if (!selectedSubmission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#eefdf5] via-[#f0fdf4] to-[#dcfce7] p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
                            <BarChart3 className="w-10 h-10 text-[#0d9c5a]" />
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Indicator Dashboard
                        </h1>
                        <p className="text-xl text-gray-600 mb-2">
                            Explore {indicatorsData.length.toLocaleString()} global indicators
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[#0d9c5a]">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-medium">Select a submission to begin</span>
                        </div>

                        {/* Visualization Button */}
                        <button
                            onClick={() => setShowInfographic(true)}
                            className="mt-6 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0d9c5a] to-[#10b66d] text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-semibold"
                        >
                            <PieChart className="w-6 h-6" />
                            <span>See Data Visualization</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Submission Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {submissions.map((submission) => {
                            const count = indicatorsData.filter(item => item.Submission === submission).length;
                            return (
                                <button
                                    key={submission}
                                    onClick={() => setSelectedSubmission(submission)}
                                    className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#0d9c5a] overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#eefdf5] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#0d9c5a] to-[#10b66d] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0d9c5a] transition-colors">
                                            {submission}
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-bold text-[#0d9c5a]">
                                                {count.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500">indicators</span>
                                        </div>

                                        <div className="mt-4 flex items-center text-[#0d9c5a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-sm font-medium">Explore</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: View Indicators
    return (




        <div className="min-h-screen bg-gradient-to-br from-[#eefdf5] via-[#f0fdf4] to-[#dcfce7]">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-[#0d9c5a]/20  top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-4 py-2 text-[#0d9c5a] hover:bg-[#eefdf5] rounded-xl transition-colors font-medium"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                                Back
                            </button>
                            <div className="h-8 w-px bg-[#0d9c5a]/20" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#0d9c5a] to-[#10b66d] rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedSubmission}</h2>
                                    <p className="text-sm text-gray-600">{indicators.length.toLocaleString()} indicators available</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInfographic(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0d9c5a] to-[#10b66d] text-white rounded-xl hover:shadow-lg transition-all font-medium"
                        >
                            <Activity className="w-4 h-4" />
                            View Analytics
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                            className="px-5 py-3 border-2 border-[#0d9c5a]/20 rounded-xl focus:ring-2 focus:ring-[#0d9c5a] focus:border-[#0d9c5a] bg-white font-medium text-gray-700 hover:border-[#0d9c5a]/40 transition-colors"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search indicators..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 border-2 border-[#0d9c5a]/20 rounded-xl focus:ring-2 focus:ring-[#0d9c5a] focus:border-[#0d9c5a] bg-white"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicators Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {indicators.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                        <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No indicators found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {indicators.map((indicator, index) => (
                            <button
                                key={index}
                                onClick={() => openIndicatorModal(indicator)}
                                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#0d9c5a] text-left"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#0d9c5a] to-[#10b66d] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0d9c5a] transition-colors">
                                            {indicator.Indicator || 'Unnamed Indicator'}
                                        </h3>
                                        {indicator.Category && (
                                            <span className="inline-block px-3 py-1 bg-[#eefdf5] text-[#0d9c5a] text-xs font-semibold rounded-full">
                                                {indicator.Category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    {indicator['Indicator ID'] && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-700">ID:</span>
                                            <span>{indicator['Indicator ID']}</span>
                                        </div>
                                    )}

                                    {getThematicTargets(indicator).length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <Target className="w-4 h-4 text-[#0d9c5a] mt-0.5 flex-shrink-0" />
                                            <span className="text-xs">
                                                {getThematicTargets(indicator).length} thematic target{getThematicTargets(indicator).length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center text-[#0d9c5a] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>View details</span>
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedIndicator && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#0d9c5a] to-[#10b66d] p-6 text-white">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 pr-4">
                                    <h2 className="text-2xl font-bold mb-2">
                                        {selectedIndicator.Indicator || 'Indicator Details'}
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIndicator.Category && (
                                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                                {selectedIndicator.Category}
                                            </span>
                                        )}
                                        {selectedIndicator['Indicator ID'] && (
                                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                                ID: {selectedIndicator['Indicator ID']}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Basic Information */}
                            {hasValue(selectedIndicator.Definition) && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#eefdf5] rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-[#0d9c5a]" />
                                        </div>
                                        Definition
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">{selectedIndicator.Definition}</p>
                                </div>
                            )}

                            {/* Thematic Targets */}
                            {getThematicTargets(selectedIndicator).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#eefdf5] rounded-lg flex items-center justify-center">
                                            <Target className="w-4 h-4 text-[#0d9c5a]" />
                                        </div>
                                        Thematic Targets
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {getThematicTargets(selectedIndicator).map(([target, _]) => (
                                            <div key={target} className="flex items-center gap-2 p-3 bg-[#eefdf5] rounded-lg">
                                                <CheckCircle2 className="w-5 h-5 text-[#0d9c5a] flex-shrink-0" />
                                                <span className="text-sm font-medium text-gray-800">{target}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Target 9b Relevance */}
                            {getTarget9bData(selectedIndicator).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-amber-600" />
                                        </div>
                                        Target 9b Relevance
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {getTarget9bData(selectedIndicator).map(([aspect, _]) => (
                                            <div key={aspect} className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                                                <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                                <span className="text-sm font-medium text-gray-800">{aspect}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Adaptation Relevance */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                        <Layers className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    Adaptation Relevance / GGA
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(getAdaptationData(selectedIndicator)).map(([key, value]) => {
                                        if (!hasValue(value)) return null;
                                        return (
                                            <div key={key} className="p-4 bg-emerald-50 rounded-lg">
                                                <h4 className="font-semibold text-gray-800 mb-2">{key}</h4>
                                                <p className="text-gray-700 text-sm">{value}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Additional Fields */}
                            {hasValue(selectedIndicator.Unit) && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-1">Unit</h4>
                                    <p className="text-gray-700">{selectedIndicator.Unit}</p>
                                </div>
                            )}

                            {hasValue(selectedIndicator['Data source']) && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-1">Data Source</h4>
                                    <p className="text-gray-700">{selectedIndicator['Data source']}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}