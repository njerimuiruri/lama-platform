"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Search, Layers, AlertCircle, Loader, ArrowLeft, X, Filter, Grid3x3, List } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';

export default function ClimateIndicatorsExplorer() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const loadData = useCallback(async () => {
        try {
            const response = await fetch('/documents/indicators.json');
            if (!response.ok) throw new Error('Failed to load indicators.json');

            const jsonData = await response.json();
            const grouped = groupBySectors(jsonData);
            setData(grouped);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const groupBySectors = (rawData) => {
        const sectorsMap = {};

        rawData.forEach((row) => {
            if (row.type === 'data') {
                const indicatorId = String(row['Indicator ID'] || '').trim();
                const match = indicatorId.match(/^(\d+)\(([a-z])\)/i);

                if (match) {
                    const sectorNum = match[1];
                    const sectorLetter = match[2];
                    const sectorKey = `${sectorNum}${sectorLetter}`;

                    sectorsMap[sectorKey] = {
                        id: sectorKey,
                        label: `${sectorNum}(${sectorLetter})`,
                        fullId: indicatorId,
                        name: indicatorId,
                        indicators: []
                    };
                }
            } else if (row.type === 'indicator' && row.sectorLabel) {
                const sectorLabel = row.sectorLabel.split(' - ')[0];

                if (sectorsMap[sectorLabel]) {
                    sectorsMap[sectorLabel].indicators.push({
                        id: row.indicatorId || row['Indicator ID'],
                        name: row['Indicator name'],
                        data: row
                    });

                    if (!sectorsMap[sectorLabel].description && row.sectorLabel.includes(' - ')) {
                        sectorsMap[sectorLabel].shortName = row.sectorLabel.split(' - ')[1];
                    }
                }
            }
        });

        return Object.values(sectorsMap);
    };

    const selectSector = (sector) => {
        setSelectedSector(sector);
        setSelectedIndicator(null);
    };

    const selectIndicator = (indicator) => {
        setSelectedIndicator(indicator);
    };

    const goBackToSectors = () => {
        setSelectedSector(null);
        setSelectedIndicator(null);
    };

    const goBackToIndicators = () => {
        setSelectedIndicator(null);
    };

    const filteredData = data?.filter(sector => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return sector.name.toLowerCase().includes(term) ||
            (sector.shortName && sector.shortName.toLowerCase().includes(term)) ||
            sector.indicators.some(ind =>
                ind.name.toLowerCase().includes(term) ||
                ind.id.toLowerCase().includes(term)
            );
    });

    const getFieldLabel = (key) => {
        const labels = {
            'Indicator ID': 'Indicator ID',
            'Indicator name': 'Indicator Name',
            'Disaggregation levels \n(as relevant & feasible)': 'Disaggregation Levels',
            'Disaggregation levels \n(additional information)': 'Additional Information',
            'Corresponding sub-target / component': 'Sub-target / Component',
            'Description of the indicator \n(with definition, qualitative information) \n': 'Description',
            'Rationale of the indicator\n(with adaptation and global relevance) ': 'Rationale',
            'Other target(s) \nit is relevant for': 'Other Relevant Targets',
            'Metadata availability \n(Status)': 'Metadata Status',
            'Metadata availability\n(Source & Description)': 'Metadata Source',
            'Data availability\n(Status)': 'Data Availability Status',
            'Data availability\n(Description)': 'Data Availability Description',
            'Units': 'Units',
            'MOI \nIf this indicator is relevant to Means of Implementation, please select which aspect it is relevant to': 'Means of Implementation',
            'MOI: \nto measure (1) access, (2) quality and (3) adaptation finance, including provision': 'MOI Measures',
            'Other enabling factors\n(for which the indicator is relevant)': 'Enabling Factors',
            'Operationalisation \nof the indicator': 'Operationalisation',
            'Remarks': 'Remarks'
        };
        return labels[key] || key;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 animate-pulse">
                            <Layers className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto">
                            <Loader className="w-20 h-20 text-emerald-600 animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Climate Indicators</h3>
                    <p className="text-gray-600">Please wait while we fetch the data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-8">
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

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg border-2 border-yellow-200">
                    <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">No Data Found</h2>
                    <p className="text-gray-600 text-center">No indicators are available at this time.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                {/* Enhanced Header */}
                <div className="bg-white/80 backdrop-blur-lg border-b border-emerald-100 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                                    <Layers className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        Global Goal on Adaptation
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                            {data.length} Sectors
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                            {data.reduce((sum, s) => sum + s.indicators.length, 0)} Indicators
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* View Toggle */}
                            {selectedSector && !selectedIndicator && (
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

                        {/* Enhanced Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search sectors or indicators..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gradient-to-r from-gray-50 to-emerald-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all border border-emerald-100 shadow-sm"
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
                    {/* Enhanced Breadcrumb */}
                    {(selectedSector || selectedIndicator) && (
                        <div className="mb-8 flex items-center gap-2 text-sm bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-emerald-100">
                            <button
                                onClick={goBackToSectors}
                                className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2 hover:bg-emerald-50 px-3 py-1 rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                All Sectors
                            </button>
                            {selectedSector && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <button
                                        onClick={goBackToIndicators}
                                        className={`font-semibold px-3 py-1 rounded-lg transition-all ${selectedIndicator
                                            ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                                            : 'text-gray-700'
                                            }`}
                                    >
                                        Sector {selectedSector.label}
                                    </button>
                                </>
                            )}
                            {selectedIndicator && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg">{selectedIndicator.id}</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Enhanced Sectors Grid View */}
                    {!selectedSector && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData && filteredData.length === 0 ? (
                                <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-16 text-center border-2 border-dashed border-gray-200">
                                    <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No results found</h3>
                                    <p className="text-gray-500 text-lg">Try searching for <strong className="text-emerald-600">&ldquo;{searchTerm}&rdquo;</strong> with different keywords</p>
                                </div>
                            ) : (
                                filteredData?.map((sector) => (
                                    <button
                                        key={sector.id}
                                        onClick={() => selectSector(sector)}
                                        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-7 text-left border border-emerald-100 hover:border-emerald-300 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                    <span className="text-white text-xl font-bold">{sector.label.match(/\d+/)?.[0]}</span>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all duration-300" />
                                            </div>

                                            <div className="mb-4">
                                                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full mb-3 shadow-sm">
                                                    SECTOR {sector.label}
                                                </span>
                                                {sector.shortName && (
                                                    <div className="text-emerald-600 font-bold text-base mt-2">
                                                        {sector.shortName}
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-gray-700 text-sm leading-relaxed mb-5 line-clamp-3 font-medium">
                                                {sector.name}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-emerald-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-sm"></div>
                                                    <span className="font-semibold">{sector.indicators.length} Indicator{sector.indicators.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* Enhanced Indicators Grid/List View */}
                    {selectedSector && !selectedIndicator && (
                        <div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-emerald-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -mr-32 -mt-32 opacity-30"></div>

                                <div className="relative z-10 flex items-start gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                                        <span className="text-white text-2xl font-bold">{selectedSector.label.match(/\d+/)?.[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold rounded-full mb-3 shadow-sm">
                                            SECTOR {selectedSector.label}
                                        </span>
                                        {selectedSector.shortName && (
                                            <div className="text-emerald-600 font-bold text-xl mb-2">
                                                {selectedSector.shortName}
                                            </div>
                                        )}
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedSector.name}</h2>
                                        <p className="text-base text-gray-600 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                            {selectedSector.indicators.length} indicator{selectedSector.indicators.length !== 1 ? 's' : ''} available
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                                {selectedSector.indicators.map((indicator) => (
                                    <button
                                        key={indicator.id}
                                        onClick={() => selectIndicator(indicator)}
                                        className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 text-left border border-emerald-100 hover:border-emerald-300 group ${viewMode === 'list' ? 'flex items-center gap-6' : 'h-full'}`}
                                    >
                                        {viewMode === 'grid' ? (
                                            <div className="flex flex-col h-full">
                                                <div className="flex items-center justify-between mb-5">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                                        <span className="text-white text-xs font-bold text-center px-1">{indicator.id}</span>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-900 font-semibold text-sm mb-4 leading-relaxed line-clamp-4">{indicator.name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold pt-4 border-t border-emerald-100">
                                                    <span>View details</span>
                                                    <ChevronRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                                    <span className="text-white text-xs font-bold text-center px-1">{indicator.id}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-gray-900 font-semibold text-base leading-relaxed">{indicator.name}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all flex-shrink-0" />
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Indicator Details View - Table Format */}
                    {selectedIndicator && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden">
                            <div className="p-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b-2 border-emerald-200">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                                        <span className="text-white text-sm font-bold text-center px-1">{selectedIndicator.id}</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="inline-block px-4 py-1.5 bg-white text-emerald-700 text-xs font-bold rounded-full mb-3 border-2 border-emerald-500 shadow-sm">
                                            {selectedIndicator.id}
                                        </span>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedIndicator.name}</h2>
                                        <p className="text-base text-gray-600 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                            Sector {selectedSector.label} - {selectedSector.shortName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                                            <th className="px-8 py-5 text-left text-sm font-bold text-white uppercase tracking-wider w-1/3 border-r border-emerald-400">
                                                Field
                                            </th>
                                            <th className="px-8 py-5 text-left text-sm font-bold text-white uppercase tracking-wider w-2/3">
                                                Information
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-emerald-100">
                                        {Object.entries(selectedIndicator.data).map(([key, value], index) => {
                                            if (!value || String(value).trim() === '' || key === 'Indicator ID' || key === 'Indicator name' || key === 'type' || key === 'indicatorId' || key === 'sectorLabel') return null;

                                            const label = getFieldLabel(key);
                                            const isEven = index % 2 === 0;

                                            return (
                                                <tr key={key} className={`${isEven ? 'bg-emerald-50/50' : 'bg-white'} hover:bg-emerald-100/50 transition-colors`}>
                                                    <td className="px-8 py-5 text-sm font-bold text-gray-900 align-top border-r border-emerald-100">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mt-2 flex-shrink-0 shadow-sm"></div>
                                                            <span>{label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed align-top">
                                                        {value}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
            </div>
            <LamaFooter />
        </>
    );
}