"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Layers, AlertCircle, Loader, ArrowLeft, X, Grid3x3, List, FileText } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import DataGate from '@/components/ContentGate/DataGate';

export default function CIDPExplorer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await fetch('/api/indicators/cidps');
            if (!response.ok) throw new Error('Failed to load data');

            const jsonData = await response.json();
            const organized = organizeData(jsonData);
            setData(organized);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const organizeData = (rawData) => {
        const sectorsMap = {};

        rawData.forEach((item) => {
            if (!item.Sector && !item.PrioritySector) return;

            const sector = item.Sector?.trim() || 'Other';
            const prioritySector = item.PrioritySector?.trim();
            const kpi = item.KeyPerformanceIndicators?.trim();

            if (!sectorsMap[sector]) {
                sectorsMap[sector] = {
                    name: sector,
                    prioritySectors: {}
                };
            }

            if (prioritySector) {
                if (!sectorsMap[sector].prioritySectors[prioritySector]) {
                    sectorsMap[sector].prioritySectors[prioritySector] = {
                        name: prioritySector,
                        indicators: []
                    };
                }

                if (kpi) {
                    sectorsMap[sector].prioritySectors[prioritySector].indicators.push({
                        text: kpi,
                        source: item.Source
                    });
                }
            }
        });

        // Convert to arrays and sort
        return Object.keys(sectorsMap)
            .filter(key => key !== 'Other' && key !== '')
            .sort()
            .map(key => ({
                name: key,
                prioritySectors: Object.values(sectorsMap[key].prioritySectors)
                    .sort((a, b) => a.name.localeCompare(b.name))
            }));
    };

    const filteredData = data?.filter(sector => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return sector.name.toLowerCase().includes(term) ||
            sector.prioritySectors.some(ps =>
                ps.name.toLowerCase().includes(term) ||
                ps.indicators.some(ind => ind.text.toLowerCase().includes(term))
            );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eefdf5] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4 sm:mb-6 animate-pulse">
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                            <Loader className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-600 animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Loading CIDP Data</h3>
                    <p className="text-sm sm:text-base text-gray-600">Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#eefdf5] flex items-center justify-center p-4 sm:p-8">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 max-w-lg w-full border-2 border-red-200">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4 sm:mb-6">
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">Error Loading Data</h2>
                    <p className="text-sm sm:text-lg text-gray-600 text-center mb-4 sm:mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-[#eefdf5]">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-lg border-b border-emerald-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-3">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent leading-tight">
                                        County Integrated Development Plans
                                    </h1>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                                        <span className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                            2023 - 2027
                                        </span>
                                        <span className="text-gray-400 hidden sm:inline">•</span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                            {data?.length || 0} Sectors
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {selectedSector && !selectedPriority && (
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg sm:rounded-xl p-1 self-start sm:self-auto">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-all text-xs sm:text-sm ${viewMode === 'grid'
                                            ? 'bg-white text-emerald-600 shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="font-medium hidden sm:inline">Grid</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-all text-xs sm:text-sm ${viewMode === 'list'
                                            ? 'bg-white text-emerald-600 shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="font-medium hidden sm:inline">List</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 group-focus-within:text-emerald-700 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search sectors, priority areas, or indicators..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-50 to-emerald-50 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all border border-emerald-200 shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-all"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                    {/* Breadcrumb */}
                    {(selectedSector || selectedPriority) && (
                        <div className="mb-4 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-emerald-200 overflow-x-auto">
                            <button
                                onClick={() => {
                                    setSelectedSector(null);
                                    setSelectedPriority(null);
                                }}
                                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5 sm:gap-2 hover:bg-emerald-50 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg transition-all whitespace-nowrap flex-shrink-0"
                            >
                                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">All Sectors</span>
                                <span className="xs:hidden">Back</span>
                            </button>
                            {selectedSector && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                    <button
                                        onClick={() => setSelectedPriority(null)}
                                        className={`font-semibold px-2 sm:px-3 py-1 rounded-md sm:rounded-lg transition-all whitespace-nowrap ${selectedPriority
                                            ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        {selectedSector.name}
                                    </button>
                                </>
                            )}
                            {selectedPriority && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-700 font-semibold bg-emerald-50 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg whitespace-nowrap">
                                        {selectedPriority.name}
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Sectors View */}
                    {!selectedSector && (
                        <div>
                            {/* ── About & How-to Banner ── */}
                            <div className="mb-6 bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 sm:px-6 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-base sm:text-lg">About County Integrated Development Plans (CIDPs)</h2>
                                        <p className="text-emerald-100 text-xs">What this page shows and how to use it</p>
                                    </div>
                                </div>
                                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2 text-sm">What are CIDPs?</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            <strong>County Integrated Development Plans (CIDPs)</strong> are official 5-year development blueprints that every county government in Kenya is required to produce. The current plans cover <strong>2023–2027</strong>.
                                        </p>
                                        <p className="text-gray-600 text-sm leading-relaxed mt-2">
                                            Each CIDP sets out what a county plans to achieve across all sectors — from health and education to agriculture and water — and includes <strong>Key Performance Indicators (KPIs)</strong> so progress can be measured and reported publicly.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2 text-sm">How to navigate this page</h3>
                                        <ol className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                                <span><strong>Choose a Sector</strong> from the grid below (e.g. Agriculture, Health, Water &amp; Sanitation).</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                                <span><strong>Select a Priority Area</strong> — a specific focus within that sector (e.g. &quot;Irrigation Development&quot; under Agriculture).</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                                <span><strong>View the KPIs</strong> — the exact measurable targets counties have committed to for that priority area.</span>
                                            </li>
                                        </ol>
                                        <p className="text-xs text-gray-500 mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                            <strong>Tip:</strong> Use the search bar above to jump directly to any sector, priority area, or indicator keyword.
                                        </p>
                                    </div>
                                </div>
                                <div className="border-t border-emerald-100 px-5 sm:px-6 py-3 bg-emerald-50">
                                    <p className="text-xs text-emerald-800 font-semibold">
                                        <span className="font-black">KPI (Key Performance Indicator)</span> — A specific, measurable result a county has committed to deliver by 2027, used to hold the county government accountable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!selectedSector && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredData?.length === 0 ? (
                                <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-16 text-center border-2 border-dashed border-gray-200">
                                    <Search className="w-12 h-12 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-3 sm:mb-6" />
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No results found</h3>
                                    <p className="text-sm sm:text-lg text-gray-500">Try different keywords</p>
                                </div>
                            ) : (
                                filteredData?.map((sector) => (
                                    <button
                                        key={sector.name}
                                        onClick={() => setSelectedSector(sector)}
                                        className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 text-left border-2 border-emerald-100 hover:border-emerald-400 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                                                    <Layers className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                                </div>
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all duration-300" />
                                            </div>

                                            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-snug">{sector.name}</h3>

                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 pt-2 sm:pt-3 border-t border-emerald-100">
                                                <div className="w-2 h-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex-shrink-0"></div>
                                                <span className="font-semibold">
                                                    {sector.prioritySectors.length} Priority Area{sector.prioritySectors.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* Priority Sectors View */}
                    {selectedSector && !selectedPriority && (
                        <div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-8 border-2 border-emerald-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32 opacity-30"></div>

                                <div className="relative z-10 flex items-start gap-3 sm:gap-6">
                                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                                        <Layers className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-bold rounded-full mb-2 sm:mb-3">
                                            SECTOR
                                        </span>
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">{selectedSector.name}</h2>
                                        <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0"></div>
                                            {selectedSector.prioritySectors.length} priority area{selectedSector.prioritySectors.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
                                {selectedSector.prioritySectors.map((priority) => (
                                    <button
                                        key={priority.name}
                                        onClick={() => setSelectedPriority(priority)}
                                        className={`bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all p-4 sm:p-6 text-left border-2 border-emerald-100 hover:border-emerald-400 group ${viewMode === 'list' ? 'flex items-center gap-3 sm:gap-6' : ''
                                            }`}
                                    >
                                        {viewMode === 'grid' ? (
                                            <>
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-all">
                                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                                                </div>
                                                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3 leading-snug">{priority.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold pt-2 sm:pt-3 border-t border-emerald-100">
                                                    <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0"></div>
                                                    <span>{priority.indicators.length} Indicator{priority.indicators.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-all">
                                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 break-words">{priority.name}</h3>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        {priority.indicators.length} indicator{priority.indicators.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all flex-shrink-0" />
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Indicators View */}
                    {selectedPriority && (
                        <DataGate variant="table" label="CIDP Indicators" description="Register for free to explore county-level development plan indicators and KPIs.">
                            <div>
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 mb-4 sm:mb-8 border-2 border-emerald-200 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32 opacity-30"></div>

                                    <div className="relative z-10">
                                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-bold rounded-full mb-2 sm:mb-3">
                                            PRIORITY AREA
                                        </span>
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">{selectedPriority.name}</h2>
                                        <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0"></div>
                                            {selectedPriority.indicators.length} key performance indicator{selectedPriority.indicators.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Multi-column grid for better space usage */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                                    {selectedPriority.indicators.map((indicator, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md hover:shadow-xl p-3.5 sm:p-5 border-2 border-emerald-100 hover:border-emerald-400 transition-all group"
                                        >
                                            {/* KPI label */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                    KPI #{index + 1}
                                                </span>
                                                <span className="text-xs text-gray-400 italic">Key Performance Indicator</span>
                                            </div>

                                            <div className="flex items-start gap-2.5 sm:gap-3">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-md sm:rounded-lg flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <span className="text-white text-xs font-bold">{index + 1}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {/* What this KPI measures */}
                                                    <p className="text-xs text-gray-400 italic mb-1">What the county commits to measure and deliver by 2027:</p>
                                                    <p className="text-gray-900 font-semibold text-xs sm:text-sm leading-relaxed break-words">{indicator.text}</p>
                                                    {indicator.source && (
                                                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                                                            <span className="text-xs text-gray-400">From:</span>
                                                            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate max-w-full">{indicator.source}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats Summary */}
                                <div className="mt-4 sm:mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
                                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 text-center">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-md flex items-center justify-center">
                                                <span className="text-xl sm:text-2xl font-bold text-emerald-700">{selectedPriority.indicators.length}</span>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-gray-600 font-medium">Total</p>
                                                <p className="text-xs sm:text-sm font-bold text-gray-900">Indicators</p>
                                            </div>
                                        </div>
                                        <div className="w-px h-8 bg-emerald-300 hidden sm:block"></div>
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-md flex items-center justify-center">
                                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-gray-600 font-medium">Priority Area</p>
                                                <p className="text-xs sm:text-sm font-bold text-gray-900 max-w-[150px] sm:max-w-[200px] truncate">{selectedPriority.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DataGate>
                    )}
                </div>
            </div>
        </>
    );
}