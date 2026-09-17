"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
    ChevronRight, ChevronLeft, Home, Search, Target, FileText,
    AlertCircle, Users2, MapPin,
} from 'lucide-react';
import DataGate from '@/components/ContentGate/DataGate';

const PERIOD_META = {
    last10Years: { label: 'Last 10 Years', hint: '10 years ago', dot: 'bg-gray-400', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
    currentSituation: { label: 'Currently', hint: 'today', dot: 'bg-blue-500', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    futureResilience: { label: 'Future Resilience', hint: "what's proposed next", dot: 'bg-emerald-500', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

const sectorColors = {
    "Water": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", ring: "hover:border-blue-300" },
    "Agriculture & Food Security": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", ring: "hover:border-green-300" },
    "Poverty & Livelihood": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", ring: "hover:border-purple-300" },
    "Cultural Heritage & Social Inclusion": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", ring: "hover:border-pink-300" },
    "Health": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", ring: "hover:border-red-300" },
    "Infrastructure & Human Settlements": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", ring: "hover:border-orange-300" },
    "Ecosystem & Biodiversity": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", ring: "hover:border-emerald-300" },
    "Governance and Policy": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", ring: "hover:border-indigo-300" },
    "Cross-Cutting": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", ring: "hover:border-amber-300" },
    "Unclassified": { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300", ring: "hover:border-gray-400" },
};

const getColorForSector = (sector) => sectorColors[sector] || {
    bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", ring: "hover:border-gray-300",
};

const countyColors = {
    Kisumu: 'bg-cyan-100 text-cyan-800',
    Nandi: 'bg-lime-100 text-lime-800',
    Vihiga: 'bg-fuchsia-100 text-fuchsia-800',
};

function previewIndicator(entry) {
    return (
        entry.currentSituation?.indicator ||
        entry.last10Years?.indicator ||
        entry.futureResilience?.indicator ||
        entry.currentSituation?.impact ||
        entry.last10Years?.impact ||
        'No indicator text recorded'
    );
}

function periodsPresent(entry) {
    return ['last10Years', 'currentSituation', 'futureResilience'].filter((k) => entry[k]);
}

export default function FGDIndicatorViewer() {
    const [data, setData] = useState(null);
    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedCounty, setSelectedCounty] = useState(null);
    const [selectedEntryId, setSelectedEntryId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/indicators/fgd')
            .then((response) => {
                if (!response.ok) throw new Error('Failed to load data');
                return response.json();
            })
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading FGD data:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const sectors = useMemo(() => {
        if (!data) return [];
        return data.map((item) => item.thematicSector).filter(Boolean);
    }, [data]);

    const counties = useMemo(() => {
        if (!data) return [];
        const set = new Set();
        data.forEach((g) => g.indicators.forEach((e) => e.county && set.add(e.county)));
        return [...set].sort();
    }, [data]);

    const sectorStats = useMemo(() => {
        if (!data) return {};
        return sectors.reduce((acc, sector) => {
            const group = data.find((g) => g.thematicSector === sector);
            const entries = group?.indicators || [];
            const byCounty = {};
            entries.forEach((e) => {
                if (e.county) byCounty[e.county] = (byCounty[e.county] || 0) + 1;
            });
            acc[sector] = { total: entries.length, byCounty };
            return acc;
        }, {});
    }, [data, sectors]);

    const entriesForSector = useMemo(() => {
        if (!data || !selectedSector) return [];
        const group = data.find((g) => g.thematicSector === selectedSector);
        let entries = (group?.indicators || []).map((e, i) => ({ ...e, _id: `${selectedSector}-${i}` }));
        if (selectedCounty) entries = entries.filter((e) => e.county === selectedCounty);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            entries = entries.filter((e) => {
                const haystack = [
                    e.ward, e.climateHazard,
                    e.last10Years?.indicator, e.currentSituation?.indicator, e.futureResilience?.indicator,
                    e.last10Years?.impact, e.currentSituation?.impact,
                ].filter(Boolean).join(' ').toLowerCase();
                return haystack.includes(term);
            });
        }
        return entries;
    }, [data, selectedSector, selectedCounty, searchTerm]);

    const selectedEntry = useMemo(() => {
        if (!selectedEntryId) return null;
        return entriesForSector.find((e) => e._id === selectedEntryId) || null;
    }, [entriesForSector, selectedEntryId]);

    const handleBackToSectors = () => {
        setSelectedSector(null);
        setSelectedEntryId(null);
        setSelectedCounty(null);
        setSearchTerm('');
    };

    const handleBackToEntries = () => {
        setSelectedEntryId(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600 mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Loading FGD Indicators...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full border border-gray-200">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Couldn&apos;t load data</h2>
                    <p className="text-gray-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Users2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">FGD Indicators</h1>
                                <p className="text-gray-500 text-xs">Focus Group Discussion data — Kisumu, Nandi, Vihiga</p>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">{sectors.length}</div>
                            <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">sectors</div>
                        </div>
                    </div>

                    {/* Breadcrumb, inline */}
                    {(selectedSector || selectedEntry) && (
                        <nav className="flex items-center gap-2 text-xs mt-3 overflow-x-auto">
                            <button onClick={handleBackToSectors} className="flex items-center gap-1 text-cyan-600 hover:text-cyan-800 font-medium whitespace-nowrap transition-colors">
                                <Home className="w-3.5 h-3.5" /> Sectors
                            </button>
                            {selectedSector && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                                    <button
                                        onClick={handleBackToEntries}
                                        className={`font-medium whitespace-nowrap truncate max-w-xs transition-colors ${selectedEntry ? 'text-cyan-600 hover:text-cyan-800' : 'text-gray-700'}`}
                                    >
                                        {selectedSector}
                                    </button>
                                </>
                            )}
                            {selectedEntry && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                                    <span className="text-gray-700 truncate max-w-xs">{selectedEntry.climateHazard} — {selectedEntry.ward}</span>
                                </>
                            )}
                        </nav>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* View 1: Sectors */}
                {!selectedSector && (
                    <>
                        <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap text-xs bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5">
                            <span className="font-semibold text-gray-800">How this works</span>
                            <span className="text-gray-300">·</span>
                            <span className="flex items-center gap-1.5 text-gray-500">
                                <span className="w-4 h-4 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                                Pick a sector
                            </span>
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                            <span className="flex items-center gap-1.5 text-gray-500">
                                <span className="w-4 h-4 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                                Filter by county or search
                            </span>
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                            <span className="flex items-center gap-1.5 text-gray-500">
                                <span className="w-4 h-4 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                                Compare Last 10 Years, Currently &amp; Future Resilience side by side
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {sectors.map((sector) => {
                                const colors = getColorForSector(sector);
                                const stats = sectorStats[sector] || { total: 0, byCounty: {} };
                                const isUnclassified = sector === 'Unclassified';

                                return (
                                    <button
                                        key={sector}
                                        onClick={() => setSelectedSector(sector)}
                                        className={`bg-white border ${colors.border} ${colors.ring} rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-9 h-9 ${colors.bg} rounded-xl flex items-center justify-center`}>
                                                {isUnclassified ? (
                                                    <AlertCircle className={`w-4.5 h-4.5 ${colors.text}`} />
                                                ) : (
                                                    <Target className={`w-4.5 h-4.5 ${colors.text}`} />
                                                )}
                                            </div>
                                            <span className={`text-sm font-bold ${colors.text} ${colors.bg} px-2 py-0.5 rounded-full`}>{stats.total}</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">{sector}</h3>
                                        {isUnclassified ? (
                                            <p className="text-[11px] text-gray-400 italic">No sector recorded in source</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(stats.byCounty).map(([county, count]) => (
                                                    <span key={county} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${countyColors[county] || 'bg-gray-100 text-gray-700'}`}>
                                                        {county} {count}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* View 2: Entries for a sector */}
                {selectedSector && !selectedEntry && (
                    <div>
                        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-5 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                        onClick={() => setSelectedCounty(null)}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${!selectedCounty ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-300'}`}
                                    >
                                        All
                                    </button>
                                    {counties.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedCounty(c)}
                                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${selectedCounty === c ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-300'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search ward, hazard, indicator..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:bg-white transition-colors text-sm"
                                    />
                                </div>

                                <span className="text-xs text-gray-500 whitespace-nowrap font-medium">{entriesForSector.length} entries</span>
                            </div>
                        </div>

                        <DataGate variant="table" label="FGD Indicator Matrix" description="Register for free to explore all Focus Group Discussion indicators by sector and county.">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {entriesForSector.length > 0 ? (
                                    entriesForSector.map((entry) => {
                                        const colors = getColorForSector(selectedSector);
                                        const periods = periodsPresent(entry);
                                        return (
                                            <button
                                                key={entry._id}
                                                onClick={() => setSelectedEntryId(entry._id)}
                                                className={`bg-white border ${colors.border} ${colors.ring} rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left`}
                                            >
                                                <div className="flex items-center justify-between mb-2.5 gap-1">
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${countyColors[entry.county] || 'bg-gray-100 text-gray-700'}`}>
                                                        {entry.county}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-400 truncate">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" /> {entry.ward}
                                                    </span>
                                                </div>

                                                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                                                    {entry.climateHazard}
                                                </h3>
                                                <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem] leading-relaxed">
                                                    {previewIndicator(entry)}
                                                </p>

                                                <div className="flex items-center justify-between text-[11px] pt-2.5 mt-2.5 border-t border-gray-100">
                                                    <span className="text-gray-400">{periods.length}/3 periods</span>
                                                    <span className={`font-semibold ${colors.text} flex items-center gap-0.5`}>
                                                        Details <ChevronRight className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full bg-white rounded-xl p-10 text-center border border-gray-200 shadow-sm">
                                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm mb-3">No FGD indicators match your filters</p>
                                        <button
                                            onClick={() => { setSearchTerm(''); setSelectedCounty(null); }}
                                            className="text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </DataGate>
                    </div>
                )}

                {/* View 3: Entry detail */}
                {selectedSector && selectedEntry && (
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getColorForSector(selectedSector).bg} ${getColorForSector(selectedSector).text}`}>
                                        {selectedSector}
                                    </span>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${countyColors[selectedEntry.county] || 'bg-gray-100 text-gray-700'}`}>
                                        {selectedEntry.county}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" /> {selectedEntry.ward}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{selectedEntry.climateHazard}</h2>
                            </div>
                            <button
                                onClick={handleBackToEntries}
                                className="flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition-colors flex-shrink-0"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            {['last10Years', 'currentSituation', 'futureResilience'].map((key) => {
                                const period = selectedEntry[key];
                                const meta = PERIOD_META[key];

                                return (
                                    <div key={key} className={`bg-white rounded-2xl border ${meta.border} shadow-sm`}>
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-3.5">
                                                <span className={`w-2 h-2 rounded-full ${meta.dot} flex-shrink-0`}></span>
                                                <h3 className={`text-sm font-bold ${meta.color}`}>{meta.label}</h3>
                                                <span className="text-[11px] text-gray-400">({meta.hint})</span>
                                                {period?.typology && (
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} ml-auto flex-shrink-0`}>
                                                        {period.typology}
                                                    </span>
                                                )}
                                            </div>

                                            {period ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {(period.impact || period.projectedHazardImpact) && (
                                                        <div>
                                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                                                {key === 'futureResilience' ? 'Projected Hazard / Impact' : 'Impact'}
                                                            </p>
                                                            <p className="text-gray-800 text-sm leading-relaxed">
                                                                {period.impact || period.projectedHazardImpact}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {(period.responseStrategy || period.proposedResponse) && (
                                                        <div>
                                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                                                {key === 'futureResilience' ? 'Proposed Response' : 'Response / Coping Strategy'}
                                                            </p>
                                                            <p className="text-gray-800 text-sm leading-relaxed">
                                                                {period.responseStrategy || period.proposedResponse}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {period.indicator && (
                                                        <div className="rounded-xl p-3 bg-indigo-50 border border-indigo-100">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <FileText className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                                                                <p className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide">Indicator</p>
                                                            </div>
                                                            <p className="text-gray-800 text-sm leading-relaxed">{period.indicator}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 italic text-sm">Not captured for this time period.</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
