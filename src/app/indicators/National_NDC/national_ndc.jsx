"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Globe, Filter, FileText, ChevronRight, Home, ChevronLeft, BarChart3, PieChart, Target, Activity, BookOpen, Calendar } from 'lucide-react';

export default function NDCDataViewer() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedThematic, setSelectedThematic] = useState('All');
    const [selectedIndicatorType, setSelectedIndicatorType] = useState('All');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showVisualization, setShowVisualization] = useState(false);
    const [showAllThematics, setShowAllThematics] = useState(false);

    useEffect(() => {
        fetch('/documents/ndc.json')
            .then(response => response.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading data:', error);
                setLoading(false);
            });
    }, []);

    const sources = [...new Set(data.map(item => item['Indicator source']))].filter(Boolean).sort();

    const sourceThematics = selectedSource
        ? ['All', ...new Set(data.filter(item => item['Indicator source'] === selectedSource && item['Thematic Target']).map(item => item['Thematic Target']))]
        : ['All'];

    const indicatorTypes = ['All', ...new Set(data.map(item => item['Indicator Type']).filter(Boolean))].sort();

    useEffect(() => {
        let filtered = data;

        if (selectedSource) {
            filtered = filtered.filter(item => item['Indicator source'] === selectedSource);
        }

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.Indicator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item['Indicator source']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item['Thematic Target']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.Sector?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedThematic !== 'All') {
            filtered = filtered.filter(item => item['Thematic Target'] === selectedThematic);
        }

        if (selectedIndicatorType !== 'All') {
            filtered = filtered.filter(item => item['Indicator Type'] === selectedIndicatorType);
        }

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [selectedSource, searchTerm, selectedThematic, selectedIndicatorType, data]);

    // Calculate statistics for visualization
    const statistics = useMemo(() => {
        const totalIndicators = data.length;

        // Source breakdown
        const sourceCounts = {};
        data.forEach(item => {
            if (item['Indicator source']) {
                sourceCounts[item['Indicator source']] = (sourceCounts[item['Indicator source']] || 0) + 1;
            }
        });

        // Thematic breakdown
        const thematicCounts = {};
        data.forEach(item => {
            if (item['Thematic Target']) {
                thematicCounts[item['Thematic Target']] = (thematicCounts[item['Thematic Target']] || 0) + 1;
            }
        });

        // Indicator Type breakdown
        const typeCounts = {};
        data.forEach(item => {
            if (item['Indicator Type']) {
                typeCounts[item['Indicator Type']] = (typeCounts[item['Indicator Type']] || 0) + 1;
            }
        });

        // Publication year breakdown
        const yearCounts = {};
        data.forEach(item => {
            if (item['Document  publication  year']) {
                yearCounts[item['Document  publication  year']] = (yearCounts[item['Document  publication  year']] || 0) + 1;
            }
        });

        return {
            totalIndicators,
            sourceCounts,
            thematicCounts,
            typeCounts,
            yearCounts,
            totalSources: Object.keys(sourceCounts).length,
            totalThematics: Object.keys(thematicCounts).length
        };
    }, [data]);

    const handleBackToSources = () => {
        setSelectedSource(null);
        setSearchTerm('');
        setSelectedThematic('All');
        setSelectedIndicatorType('All');
        setCurrentPage(1);
        setShowVisualization(false);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm sm:text-lg">Loading NDC data...</p>
                </div>
            </div>
        );
    }

    // Visualization View
    if (showVisualization) {
        const maxSource = Math.max(...Object.values(statistics.sourceCounts));
        const maxThematic = Math.max(...Object.values(statistics.thematicCounts));
        const maxType = Math.max(...Object.values(statistics.typeCounts));
        const maxYear = Math.max(...Object.values(statistics.yearCounts));

        const thematicColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'];
        const typeColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
        const yearColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'];

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-8">
                        <button
                            onClick={() => setShowVisualization(false)}
                            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-colors font-semibold shadow-md text-sm sm:text-base"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                            <span className="hidden xs:inline">{selectedSource ? `Back to ${selectedSource}` : 'Back to Sources'}</span>
                            <span className="xs:hidden">Back</span>
                        </button>
                        <div className="text-left sm:text-right">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">NDC Analytics Dashboard</h1>
                            <p className="text-sm sm:text-base text-gray-600">National Determined Contributions</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-blue-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <BarChart3 className="w-6 h-6 sm:w-10 sm:h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1">{statistics.totalIndicators}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Indicators</p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                                <Globe className="w-6 h-6 sm:w-10 sm:h-10 text-purple-600" />
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-bold text-purple-600 mb-1">{statistics.totalSources}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">NDC Sources</p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-amber-200">
                            <div className="flex items-center justify-between mb-2">
                                <Target className="w-6 h-6 sm:w-10 sm:h-10 text-amber-600" />
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-bold text-amber-600 mb-1">{statistics.totalThematics}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">Thematic Areas</p>
                        </div>

                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-emerald-200">
                            <div className="flex items-center justify-between mb-2">
                                <Activity className="w-6 h-6 sm:w-10 sm:h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-bold text-emerald-600 mb-1">{Object.keys(statistics.typeCounts).length}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">Indicator Types</p>
                        </div>
                    </div>

                    {/* Source Distribution */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg mb-4 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Indicators by Source</h2>
                                <p className="text-xs sm:text-sm text-gray-600">Distribution across NDC documents</p>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                This chart shows the number of climate adaptation indicators per NDC source, helping identify
                                which national plans have the most comprehensive monitoring frameworks.
                            </p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {Object.entries(statistics.sourceCounts)
                                .sort((a, b) => b[1] - a[1])
                                .map(([source, count], index) => {
                                    const percentage = (count / maxSource) * 100;
                                    return (
                                        <div key={source}>
                                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                                <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate pr-2">{source}</span>
                                                <span className="text-xs sm:text-sm font-bold text-blue-600 flex-shrink-0">{count} indicators</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-500 to-blue-600"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
                        {/* Thematic Areas */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Thematic Targets</h2>
                                    <p className="text-xs sm:text-sm text-gray-600">Focus area distribution</p>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                    Thematic targets represent key areas of climate adaptation focus across different sectors
                                    and priorities in national adaptation planning.
                                </p>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {Object.entries(statistics.thematicCounts)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, showAllThematics ? undefined : 5)
                                    .map(([thematic, count], index) => {
                                        const percentage = (count / maxThematic) * 100;
                                        return (
                                            <div key={thematic}>
                                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate pr-2">{thematic}</span>
                                                    <span className="text-xs sm:text-sm font-bold text-amber-600 flex-shrink-0">{count}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: thematicColors[index % thematicColors.length]
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {Object.entries(statistics.thematicCounts).length > 5 && (
                                <div className="mt-4 sm:mt-6 text-center">
                                    <button
                                        onClick={() => setShowAllThematics(!showAllThematics)}
                                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-medium text-sm"
                                    >
                                        {showAllThematics ? (
                                            <>
                                                <span>Show Less</span>
                                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" />
                                            </>
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">View All {Object.entries(statistics.thematicCounts).length} Thematics</span>
                                                <span className="sm:hidden">View All</span>
                                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 -rotate-90" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Indicator Types */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Indicator Types</h2>
                                    <p className="text-xs sm:text-sm text-gray-600">Classification breakdown</p>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                    Indicator types classify monitoring metrics by their nature: input, output, outcome,
                                    process, or impact indicators for comprehensive M&E frameworks.
                                </p>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {Object.entries(statistics.typeCounts)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([type, count], index) => {
                                        const percentage = (count / maxType) * 100;
                                        return (
                                            <div key={type}>
                                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize truncate pr-2">{type}</span>
                                                    <span className="text-xs sm:text-sm font-bold text-emerald-600 flex-shrink-0">{count}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: typeColors[index % typeColors.length]
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>

                    {/* Publication Years */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Publication Timeline</h2>
                                <p className="text-xs sm:text-sm text-gray-600">Document publication years</p>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                Timeline showing when NDC documents were published, indicating the evolution of
                                national adaptation planning efforts over time.
                            </p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {Object.entries(statistics.yearCounts)
                                .sort((a, b) => a[0] - b[0])
                                .map(([year, count], index) => {
                                    const percentage = (count / maxYear) * 100;
                                    return (
                                        <div key={year}>
                                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                                <span className="text-xs sm:text-sm font-semibold text-gray-800">{year}</span>
                                                <span className="text-xs sm:text-sm font-bold text-purple-600">{count} indicators</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 sm:h-3 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-purple-500 to-purple-600"
                                                    style={{ width: `${percentage}%` }}
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Page Title Header */}
            <div className="bg-white border-b-2 border-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">National Determined Contributions</h1>
                                <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">Explore climate adaptation indicators from NDCs</p>
                            </div>
                        </div>

                        {!selectedSource && (
                            <button
                                onClick={() => setShowVisualization(true)}
                                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-medium text-sm self-start sm:self-auto"
                            >
                                <PieChart className="w-4 h-4" />
                                <span className="hidden xs:inline">View Analytics</span>
                                <span className="xs:hidden">Analytics</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {selectedSource && (
                <div className="bg-white border-b border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
                        <nav className="flex items-center space-x-2 text-xs sm:text-sm overflow-x-auto">
                            <button
                                onClick={handleBackToSources}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors whitespace-nowrap flex-shrink-0"
                            >
                                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">All Sources</span>
                                <span className="xs:hidden">Home</span>
                            </button>
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 font-semibold truncate">{selectedSource}</span>
                            {selectedThematic !== 'All' && (
                                <>
                                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600 truncate">{selectedThematic}</span>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Source Selection */}
                {!selectedSource ? (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100">
                        <div className="mb-4 sm:mb-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full mb-2 sm:mb-3">
                                <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Select NDC Source</h2>
                            <p className="text-sm sm:text-base text-gray-600">Choose a source to explore indicators</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {sources.map(source => {
                                const count = data.filter(item => item['Indicator source'] === source).length;
                                return (
                                    <button
                                        key={source}
                                        onClick={() => setSelectedSource(source)}
                                        className="group relative bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-lg hover:scale-105 transition-all duration-300 text-left overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-200 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                                                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
                                            </div>
                                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">{source}</h3>
                                            <p className="text-xs text-blue-600 font-semibold">{count} indicators</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {/* Source Header */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 border border-blue-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{selectedSource}</h2>
                                        <p className="text-blue-600 font-semibold text-xs sm:text-sm">{filteredData.length} indicators</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowVisualization(true)}
                                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg font-semibold text-purple-700 text-xs sm:text-sm transition-all flex-1 sm:flex-initial"
                                    >
                                        <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden xs:inline">Analytics</span>
                                    </button>
                                    <button
                                        onClick={handleBackToSources}
                                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg font-semibold text-blue-700 text-xs sm:text-sm transition-all flex-1 sm:flex-initial"
                                    >
                                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="hidden xs:inline">Change Source</span>
                                        <span className="xs:hidden">Change</span>
                                    </button>
                                </div>
                            </div>

                            {/* Filters Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                    <input
                                        type="text"
                                        placeholder="Search indicators..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-blue-50 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <Filter className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 pointer-events-none" />
                                    <select
                                        value={selectedThematic}
                                        onChange={(e) => setSelectedThematic(e.target.value)}
                                        className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-blue-50 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white cursor-pointer transition-all appearance-none"
                                    >
                                        {sourceThematics.map(thematic => (
                                            <option key={thematic} value={thematic}>
                                                {thematic === 'All' ? 'All Thematic Targets' : thematic}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative">
                                    <Target className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 pointer-events-none" />
                                    <select
                                        value={selectedIndicatorType}
                                        onChange={(e) => setSelectedIndicatorType(e.target.value)}
                                        className="w-full pl-8 sm:pl-10 pr-2.5 sm:pr-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-blue-50 border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 focus:bg-white cursor-pointer transition-all appearance-none"
                                    >
                                        {indicatorTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type === 'All' ? 'All Indicator Types' : type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Results Info & Items Per Page */}
                        {filteredData.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 px-1">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to{' '}
                                    <span className="font-semibold text-gray-900">{Math.min(indexOfLastItem, filteredData.length)}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{filteredData.length}</span> results
                                </p>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs sm:text-sm text-gray-600">Show:</label>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-white border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-400 cursor-pointer"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="text-xs sm:text-sm text-gray-600">per page</span>
                                </div>
                            </div>
                        )}

                        {/* Data Table */}
                        {filteredData.length > 0 ? (
                            <>
                                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-blue-100">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-blue-100 to-blue-50">
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                                                        Indicator
                                                    </th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider hidden md:table-cell">
                                                        Thematic Target
                                                    </th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider hidden lg:table-cell">
                                                        Type
                                                    </th>
                                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider hidden lg:table-cell">
                                                        Year
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-blue-50 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                                                            <div className="flex items-start gap-1.5 sm:gap-2">
                                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 sm:mt-1.5"></div>
                                                                <div className="min-w-0">
                                                                    <span className="text-gray-900 text-xs sm:text-sm leading-snug block">
                                                                        {item.Indicator || 'N/A'}
                                                                    </span>
                                                                    {/* Mobile-only badges */}
                                                                    <div className="flex flex-wrap gap-1.5 mt-2 md:hidden">
                                                                        {item['Thematic Target'] && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-semibold">
                                                                                {item['Thematic Target']}
                                                                            </span>
                                                                        )}
                                                                        {item['Indicator Type'] && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold capitalize lg:hidden">
                                                                                {item['Indicator Type']}
                                                                            </span>
                                                                        )}
                                                                        {item['Document  publication  year'] && (
                                                                            <span className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-semibold lg:hidden">
                                                                                {item['Document  publication  year']}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden md:table-cell">
                                                            {item['Thematic Target'] ? (
                                                                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold">
                                                                    {item['Thematic Target']}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden lg:table-cell">
                                                            {item['Indicator Type'] ? (
                                                                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold capitalize">
                                                                    {item['Indicator Type']}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden lg:table-cell">
                                                            {item['Document  publication  year'] ? (
                                                                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-semibold">
                                                                    {item['Document  publication  year']}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 border border-blue-100">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all w-full sm:w-auto justify-center ${currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                    }`}
                                            >
                                                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Previous
                                            </button>

                                            <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
                                                {getPageNumbers().map((pageNum, index) => (
                                                    pageNum === '...' ? (
                                                        <span key={`ellipsis-${index}`} className="px-1.5 sm:px-2 text-gray-400 text-sm">
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => paginate(pageNum)}
                                                            className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm transition-all ${currentPage === pageNum
                                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    )
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all w-full sm:w-auto justify-center ${currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                    }`}
                                            >
                                                Next
                                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center border border-blue-100">
                                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
                                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
                                <p className="text-gray-600 mb-3 sm:mb-4 text-sm">Try adjusting your search or filters</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedThematic('All');
                                        setSelectedIndicatorType('All');
                                    }}
                                    className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}