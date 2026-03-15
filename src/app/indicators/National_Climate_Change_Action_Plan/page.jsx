"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Layers, AlertCircle, Loader, ArrowLeft, X, Grid3x3, List, FileText, TrendingUp, DollarSign, Target } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';

export default function NCCAPExplorer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await fetch('/documents/NCCAP.json');
            if (!response.ok) throw new Error('Failed to load NCCAP data');

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
            if (!item.PrioritySector) return;

            const sector = item.PrioritySector.trim();
            const action = item.PriorityAction?.trim();
            const kpi = item.KeyPerformanceIndicator?.trim();

            if (!sectorsMap[sector]) {
                sectorsMap[sector] = {
                    name: sector,
                    actions: {}
                };
            }

            if (action) {
                if (!sectorsMap[sector].actions[action]) {
                    sectorsMap[sector].actions[action] = {
                        name: action,
                        outcome: item.ExpectedOutcome,
                        indicators: []
                    };
                }

                if (kpi) {
                    sectorsMap[sector].actions[action].indicators.push({
                        text: kpi,
                        targetGroups: item.TargetGroups,
                        sourceOfFund: item.SourceOfFund,
                        budget: item.IndicativeBudgetKES,
                        sector: item.Sector
                    });
                }
            }
        });

        return Object.keys(sectorsMap)
            .filter(key => key !== '')
            .sort()
            .map(key => ({
                name: key,
                actions: Object.values(sectorsMap[key].actions)
                    .sort((a, b) => a.name.localeCompare(b.name))
            }));
    };

    const calculateTotalBudget = (budget) => {
        if (!budget) return 0;
        return Object.values(budget).reduce((sum, val) => {
            const num = parseFloat(val);
            return sum + (isNaN(num) ? 0 : num);
        }, 0);
    };

    const formatCurrency = (amount) => {
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(2)}B`;
        }
        return `${amount.toFixed(2)}M`;
    };

    const filteredData = data?.filter(sector => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return sector.name.toLowerCase().includes(term) ||
            sector.actions.some(action =>
                action.name.toLowerCase().includes(term) ||
                action.indicators.some(ind => ind.text.toLowerCase().includes(term))
            );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eefdf5] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 animate-pulse">
                            <Target className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto">
                            <Loader className="w-20 h-20 text-emerald-600 animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Loading NCCAP Data</h3>
                    <p className="text-gray-600">Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#eefdf5] flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg border-2 border-red-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Error Loading Data</h2>
                    <p className="text-gray-600 text-center text-lg mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
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
                <div className="bg-white/90 backdrop-blur-lg border-b border-emerald-200 shadow-lg  top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-xl">
                                    <Target className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                        National Climate Change Action Plan
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                            2023 - 2027
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                            {data?.length || 0} Priority Sectors
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {selectedSector && !selectedAction && (
                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'grid'
                                            ? 'bg-white text-emerald-600 shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                        <span className="text-sm font-medium">Grid</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'list'
                                            ? 'bg-white text-emerald-600 shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <List className="w-4 h-4" />
                                        <span className="text-sm font-medium">List</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500 group-focus-within:text-emerald-700 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search priority sectors, actions, or indicators..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gradient-to-r from-gray-50 to-emerald-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all border border-emerald-200 shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    {(selectedSector || selectedAction) && (
                        <div className="mb-8 flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-emerald-200">
                            <button
                                onClick={() => {
                                    setSelectedSector(null);
                                    setSelectedAction(null);
                                }}
                                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-2 hover:bg-emerald-50 px-3 py-1 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                All Sectors
                            </button>
                            {selectedSector && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <button
                                        onClick={() => setSelectedAction(null)}
                                        className={`font-semibold px-3 py-1 rounded-lg transition-all ${selectedAction
                                            ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        {selectedSector.name}
                                    </button>
                                </>
                            )}
                            {selectedAction && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg line-clamp-1">
                                        {selectedAction.name.substring(0, 50)}...
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Priority Sectors View */}
                    {!selectedSector && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData?.length === 0 ? (
                                <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border-2 border-dashed border-gray-200">
                                    <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No results found</h3>
                                    <p className="text-gray-500 text-lg">Try different keywords</p>
                                </div>
                            ) : (
                                filteredData?.map((sector) => (
                                    <button
                                        key={sector.name}
                                        onClick={() => setSelectedSector(sector)}
                                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-left border-2 border-emerald-100 hover:border-emerald-400 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                    <Layers className="w-7 h-7 text-white" />
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all duration-300" />
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{sector.name}</h3>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-emerald-100">
                                                <div className="w-2 h-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full"></div>
                                                <span className="font-semibold">
                                                    {sector.actions.length} Priority Action{sector.actions.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* Priority Actions View */}
                    {selectedSector && !selectedAction && (
                        <div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border-2 border-emerald-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-32 -mt-32 opacity-30"></div>

                                <div className="relative z-10 flex items-start gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                                        <Layers className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-bold rounded-full mb-3">
                                            PRIORITY SECTOR
                                        </span>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedSector.name}</h2>
                                        <p className="text-base text-gray-600 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                            {selectedSector.actions.length} priority action{selectedSector.actions.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                                {selectedSector.actions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedAction(action)}
                                        className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 text-left border-2 border-emerald-100 hover:border-emerald-400 group ${viewMode === 'list' ? 'flex items-start gap-6' : ''
                                            }`}
                                    >
                                        {viewMode === 'grid' ? (
                                            <>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-all">
                                                        <TrendingUp className="w-6 h-6 text-white" />
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 mb-3 leading-snug line-clamp-3">{action.name}</h3>
                                                {action.outcome && (
                                                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">{action.outcome}</p>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold pt-3 border-t border-emerald-100">
                                                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                                    <span>{action.indicators.length} KPI{action.indicators.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-all">
                                                    <TrendingUp className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{action.name}</h3>
                                                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">{action.outcome}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {action.indicators.length} indicator{action.indicators.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all flex-shrink-0" />
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* KPIs View with Budget & Funding */}
                    {selectedAction && (
                        <div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border-2 border-emerald-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-32 -mt-32 opacity-30"></div>

                                <div className="relative z-10">
                                    <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-bold rounded-full mb-3">
                                        PRIORITY ACTION
                                    </span>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{selectedAction.name}</h2>
                                    {selectedAction.outcome && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                                            <p className="text-xs font-semibold text-emerald-800 mb-1">EXPECTED OUTCOME</p>
                                            <p className="text-sm text-gray-700 leading-relaxed">{selectedAction.outcome}</p>
                                        </div>
                                    )}
                                    <p className="text-base text-gray-600 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                        {selectedAction.indicators.length} key performance indicator{selectedAction.indicators.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {selectedAction.indicators.map((indicator, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl p-6 border-2 border-emerald-100 hover:border-emerald-400 transition-all"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                                                <span className="text-white text-sm font-bold">{index + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-bold text-gray-900 mb-2 leading-relaxed">{indicator.text}</h3>

                                                <div className="flex flex-wrap gap-3 mb-4">
                                                    {indicator.targetGroups && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200">
                                                            <Target className="w-3 h-3" />
                                                            {indicator.targetGroups}
                                                        </span>
                                                    )}
                                                    {indicator.sourceOfFund && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                                                            <DollarSign className="w-3 h-3" />
                                                            {indicator.sourceOfFund}
                                                        </span>
                                                    )}
                                                </div>

                                                {indicator.budget && Object.keys(indicator.budget).length > 0 && (
                                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="text-xs font-bold text-emerald-800 uppercase">Indicative Budget (KES Millions)</h4>
                                                            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
                                                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                                                <span className="text-sm font-bold text-emerald-700">
                                                                    {formatCurrency(calculateTotalBudget(indicator.budget))}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                                            {Object.entries(indicator.budget).map(([year, amount]) => (
                                                                <div key={year} className="bg-white rounded-lg p-3 shadow-sm border border-emerald-100">
                                                                    <p className="text-xs text-gray-500 font-medium mb-1">{year}</p>
                                                                    <p className="text-base font-bold text-gray-900">{amount}M</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Stats */}
                            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                                <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                                            <span className="text-2xl font-bold text-emerald-700">{selectedAction.indicators.length}</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-600 font-medium">Total</p>
                                            <p className="text-sm font-bold text-gray-900">KPIs</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-emerald-300"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-600 font-medium">Total Budget</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {formatCurrency(selectedAction.indicators.reduce((sum, ind) =>
                                                    sum + calculateTotalBudget(ind.budget), 0))} KES
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <LamaFooter />



        </>

    );
}