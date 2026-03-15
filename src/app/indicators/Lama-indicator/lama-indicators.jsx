"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Home, Search, Target, FileText, Layers, AlertCircle, CheckCircle2, Grid3x3, BarChart3, TrendingUp } from 'lucide-react';

export default function LAMAIndicatorViewer() {
    const [data, setData] = useState(null);
    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load data from JSON file
    useEffect(() => {
        fetch('/documents/lla.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load data');
                return response.json();
            })
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading data:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Get unique thematic sectors
    const thematicSectors = useMemo(() => {
        if (!data) return [];
        const sectors = [...new Set(data.map(item => item.thematicSector))];
        return sectors.filter(s => s);
    }, [data]);

    // Get unique raw indicators for selected sector
    const rawIndicatorsForSector = useMemo(() => {
        if (!data || !selectedSector) return [];

        const sectorData = data.filter(item => item.thematicSector === selectedSector);
        const rawIndicatorsMap = new Map();

        sectorData.forEach(item => {
            if (item.indicators && item.indicators.length > 0) {
                item.indicators.forEach(indicator => {
                    if (indicator.rawIndicators && indicator.rawIndicators.length > 0) {
                        indicator.rawIndicators.forEach(rawInd => {
                            if (!rawIndicatorsMap.has(rawInd)) {
                                rawIndicatorsMap.set(rawInd, {
                                    rawIndicator: rawInd,
                                    count: 0,
                                    hasAmended: false
                                });
                            }
                            const current = rawIndicatorsMap.get(rawInd);
                            current.count += 1;
                            if (indicator.amendedIndicator) {
                                current.hasAmended = true;
                            }
                        });
                    }
                });
            }
        });

        return Array.from(rawIndicatorsMap.values());
    }, [data, selectedSector]);

    // Get all details for selected raw indicator
    const indicatorDetails = useMemo(() => {
        if (!data || !selectedSector || !selectedIndicator) return [];

        const details = [];
        const sectorData = data.filter(item => item.thematicSector === selectedSector);

        sectorData.forEach((item, index) => {
            if (item.indicators && item.indicators.length > 0) {
                item.indicators.forEach(indicator => {
                    if (indicator.rawIndicators && indicator.rawIndicators.includes(selectedIndicator)) {
                        details.push({
                            ...indicator,
                            id: `${selectedSector}-${index}`
                        });
                    }
                });
            }
        });

        return details;
    }, [data, selectedSector, selectedIndicator]);

    // Filter raw indicators by search
    const filteredRawIndicators = useMemo(() => {
        if (!searchTerm) return rawIndicatorsForSector;
        return rawIndicatorsForSector.filter(item =>
            item.rawIndicator.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [rawIndicatorsForSector, searchTerm]);

    // Sector statistics
    const sectorStats = useMemo(() => {
        if (!data) return {};

        return thematicSectors.reduce((acc, sector) => {
            const sectorData = data.filter(item => item.thematicSector === sector);
            let totalIndicators = 0;
            let withAmended = 0;

            sectorData.forEach(item => {
                if (item.indicators && item.indicators.length > 0) {
                    totalIndicators += item.indicators.length;
                    withAmended += item.indicators.filter(ind => ind.amendedIndicator).length;
                }
            });

            acc[sector] = {
                total: totalIndicators,
                withAmended,
                completeness: totalIndicators > 0 ? Math.round((withAmended / totalIndicators) * 100) : 0
            };
            return acc;
        }, {});
    }, [data, thematicSectors]);

    // Sector colors
    const sectorColors = {
        "Water": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", hover: "hover:bg-blue-100", gradient: "from-blue-400 to-blue-600" },
        "Agriculture & Food Security": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", hover: "hover:bg-green-100", gradient: "from-green-400 to-green-600" },
        "Poverty & Livelihood": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", hover: "hover:bg-purple-100", gradient: "from-purple-400 to-purple-600" },
        "Cultural Heritage & Social Inclusion": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", hover: "hover:bg-pink-100", gradient: "from-pink-400 to-pink-600" },
        "Health": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", hover: "hover:bg-red-100", gradient: "from-red-400 to-red-600" },
        "Infrastructure & Human Settlements": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", hover: "hover:bg-orange-100", gradient: "from-orange-400 to-orange-600" },
        "Ecosystem & Biodiversity": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", hover: "hover:bg-emerald-100", gradient: "from-emerald-400 to-emerald-600" },
        "Governance and Policy": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", hover: "hover:bg-indigo-100", gradient: "from-indigo-400 to-indigo-600" }
    };

    const getColorForSector = (sector) => {
        return sectorColors[sector] || {
            bg: "bg-gray-50",
            text: "text-gray-700",
            border: "border-gray-200",
            hover: "hover:bg-gray-100",
            gradient: "from-gray-400 to-gray-600"
        };
    };

    const handleBackToSectors = () => {
        setSelectedSector(null);
        setSelectedIndicator(null);
        setSearchTerm('');
    };

    const handleBackToRawIndicators = () => {
        setSelectedIndicator(null);
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-lg font-medium">Loading LLA Indicators...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Please ensure /lla.json file exists and is accessible.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Header */}
            <div className="bg-white border-b-2 border-emerald-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">LLA Indicator Matrix</h1>
                                <p className="text-gray-600 text-xs sm:text-sm mt-1">Locally Led Adaptation Framework</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{thematicSectors.length}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Thematic Sectors</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {(selectedSector || selectedIndicator) && (
                <div className="bg-white border-b border-emerald-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                        <nav className="flex items-center space-x-2 text-xs sm:text-sm overflow-x-auto">
                            <button
                                onClick={handleBackToSectors}
                                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 hover:underline font-medium transition-colors whitespace-nowrap"
                            >
                                <Home className="w-4 h-4" />
                                <span>Thematic Sectors</span>
                            </button>
                            {selectedSector && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <button
                                        onClick={handleBackToRawIndicators}
                                        className={`font-semibold whitespace-nowrap truncate max-w-xs ${selectedIndicator ? 'text-emerald-600 hover:text-emerald-800 hover:underline' : 'text-gray-700'}`}
                                    >
                                        {selectedSector}
                                    </button>
                                </>
                            )}
                            {selectedIndicator && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-700 truncate max-w-xs">{selectedIndicator}</span>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* View 1: Thematic Sectors */}
                {!selectedSector && (
                    <div>
                        <div className="mb-6 text-center">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Select a Thematic Sector</h2>
                            <p className="text-gray-600 text-sm sm:text-base">Explore indicators organized by adaptation themes</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {thematicSectors.map(sector => {
                                const colors = getColorForSector(sector);
                                const stats = sectorStats[sector] || { total: 0, withAmended: 0, completeness: 0 };

                                return (
                                    <button
                                        key={sector}
                                        onClick={() => setSelectedSector(sector)}
                                        className={`group relative bg-white border-2 ${colors.border} rounded-2xl p-5 sm:p-6 ${colors.hover} transition-all duration-300 text-left overflow-hidden hover:shadow-xl hover:scale-105`}
                                    >
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-full -mr-12 -mt-12 opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                                        <div className="relative">
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                                                <Target className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 line-clamp-2 min-h-[3rem]">{sector}</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-600">Total Indicators:</span>
                                                    <span className={`font-bold ${colors.text}`}>{stats.total}</span>
                                                </div>
                                                {/* <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-gray-600">Completed:</span>
                                                    <span className="font-bold text-green-600">{stats.completeness}%</span>
                                                </div> */}
                                                <div className={`flex items-center gap-2 text-xs font-semibold ${colors.text} pt-2 border-t ${colors.border}`}>
                                                    <span>Click to explore</span>
                                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* View 2: Raw Indicators */}
                {selectedSector && !selectedIndicator && (
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border-2 border-emerald-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getColorForSector(selectedSector).gradient} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedSector}</h2>
                                        <p className={`text-xs sm:text-sm font-semibold ${getColorForSector(selectedSector).text}`}>
                                            {rawIndicatorsForSector.length} unique raw indicators
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleBackToSectors}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-semibold text-emerald-700 text-sm transition-all w-full sm:w-auto"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-emerald-600" />
                                <input
                                    type="text"
                                    placeholder="Search raw indicators..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-emerald-50 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Raw Indicators Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredRawIndicators.length > 0 ? (
                                filteredRawIndicators.map((item, index) => {
                                    const colors = getColorForSector(selectedSector);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedIndicator(item.rawIndicator)}
                                            className={`bg-white border-2 ${colors.border} rounded-xl p-5 hover:shadow-lg hover:scale-105 transition-all text-left group relative overflow-hidden`}
                                        >
                                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors.gradient} rounded-full -mr-10 -mt-10 opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                                            <div className="relative">
                                                {/* Status Badge */}
                                                {/* <div className="flex items-center justify-between mb-3">
                                                    {item.hasAmended ? (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Complete
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Pending
                                                        </span>
                                                    )}
                                                    <ChevronRight className={`w-5 h-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                                </div> */}

                                                {/* Indicator Text */}
                                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 line-clamp-3 min-h-[3.5rem] group-hover:text-emerald-600 transition-colors">
                                                    {item.rawIndicator}
                                                </h3>

                                                {/* Stats */}
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-600">Total entries:</span>
                                                    <span className={`font-bold ${colors.text}`}>{item.count}</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="col-span-full bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-emerald-200">
                                    <Search className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
                                    <p className="text-gray-600 mb-4 text-sm sm:text-base">No indicators match your search</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* View 3: Indicator Details */}
                {selectedSector && selectedIndicator && (
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border-2 border-emerald-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getColorForSector(selectedSector).bg} ${getColorForSector(selectedSector).text}`}>
                                            {selectedSector}
                                        </span>
                                    </div>
                                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{selectedIndicator}</h2>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        {indicatorDetails.length} {indicatorDetails.length === 1 ? 'detail' : 'details'} found
                                    </p>
                                </div>
                                <button
                                    onClick={handleBackToRawIndicators}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-semibold text-emerald-700 text-sm transition-all w-full sm:w-auto justify-center"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back to Indicators
                                </button>
                            </div>
                        </div>

                        {/* Details Cards */}
                        <div className="space-y-4">
                            {indicatorDetails.map((detail, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-emerald-200">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-xs font-bold text-emerald-600">Entry #{index + 1}</span>
                                                {detail.amendedIndicator && (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">Indicator Details</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Raw Indicator */}
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                                                <h4 className="font-bold text-gray-900 text-sm">Raw Indicator</h4>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{selectedIndicator}</p>
                                        </div>

                                        {/* Amended Indicator */}
                                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                <h4 className="font-bold text-gray-900 text-sm">Amended Indicator</h4>
                                            </div>
                                            {detail.amendedIndicator ? (
                                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{detail.amendedIndicator}</p>
                                            ) : (
                                                <p className="text-gray-400 italic text-sm">Not specified</p>
                                            )}
                                        </div>

                                        {/* Two Column Grid for Unit and Relevance */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Measurement Unit */}
                                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Grid3x3 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                    <h4 className="font-bold text-gray-900 text-sm">Measurement Unit</h4>
                                                </div>
                                                {detail.possibleMeasurementUnit ? (
                                                    <p className="text-gray-700 font-medium text-sm sm:text-base">{detail.possibleMeasurementUnit}</p>
                                                ) : (
                                                    <p className="text-gray-400 italic text-sm">Not specified</p>
                                                )}
                                            </div>

                                            {/* Target Relevance */}
                                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Target className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                                    <h4 className="font-bold text-gray-900 text-sm">Target Relevance</h4>
                                                </div>
                                                {detail.targetRelevance ? (
                                                    <p className="text-gray-700 font-medium text-sm sm:text-base">{detail.targetRelevance}</p>
                                                ) : (
                                                    <p className="text-gray-400 italic text-sm">Not specified</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}