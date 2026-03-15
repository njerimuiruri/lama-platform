'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, Legend } from 'recharts';
import { Filter, TrendingUp, Users, PieChart as PieChartIcon, Layers, MapPin, Home, CheckCircle, XCircle } from 'lucide-react';

const LandOwnership = () => {
    const genderLandOwnership = [
        { category: 'Female', type: 'No', count: 25, percent: 8.9 },
        { category: 'Female', type: 'Yes', count: 256, percent: 91.1 },
        { category: 'Male', type: 'No', count: 23, percent: 8.4 },
        { category: 'Male', type: 'Yes', count: 250, percent: 91.6 }
    ];

    const ageBracketLandOwnership = [
        { category: 'adults', type: 'No', count: 11, percent: 7.6 },
        { category: 'adults', type: 'Yes', count: 134, percent: 92.4 },
        { category: 'elderly', type: 'No', count: 8, percent: 3.1 },
        { category: 'elderly', type: 'Yes', count: 249, percent: 96.9 },
        { category: 'youth', type: 'No', count: 29, percent: 19.1 },
        { category: 'youth', type: 'Yes', count: 123, percent: 80.9 }
    ];

    const genderLandSize = [
        { category: 'Female', type: '1 to 5acres', count: 125, percent: 44.5 },
        { category: 'Female', type: '11 to 15acres', count: 5, percent: 1.8 },
        { category: 'Female', type: '6 to 10acres', count: 13, percent: 4.6 },
        { category: 'Female', type: 'Below 1acre', count: 113, percent: 40.2 },
        { category: 'Female', type: 'nan', count: 25, percent: 8.9 },
        { category: 'Male', type: '1 to 5acres', count: 133, percent: 48.7 },
        { category: 'Male', type: '11 to 15acres', count: 2, percent: 0.7 },
        { category: 'Male', type: '6 to 10acres', count: 22, percent: 8.1 },
        { category: 'Male', type: 'Below 1acre', count: 93, percent: 34.1 },
        { category: 'Male', type: 'nan', count: 23, percent: 8.4 }
    ];

    const ageBracketLandSize = [
        { category: 'adults', type: '1 to 5acres', count: 74, percent: 51.0 },
        { category: 'adults', type: '11 to 15acres', count: 3, percent: 2.1 },
        { category: 'adults', type: '6 to 10acres', count: 6, percent: 4.1 },
        { category: 'adults', type: 'Below 1acre', count: 51, percent: 35.2 },
        { category: 'adults', type: 'nan', count: 11, percent: 7.6 },
        { category: 'elderly', type: '1 to 5acres', count: 126, percent: 49.0 },
        { category: 'elderly', type: '11 to 15acres', count: 3, percent: 1.2 },
        { category: 'elderly', type: '6 to 10acres', count: 24, percent: 9.3 },
        { category: 'elderly', type: 'Below 1acre', count: 96, percent: 37.4 },
        { category: 'elderly', type: 'nan', count: 8, percent: 3.1 },
        { category: 'youth', type: '1 to 5acres', count: 58, percent: 38.2 },
        { category: 'youth', type: '11 to 15acres', count: 1, percent: 0.7 },
        { category: 'youth', type: '6 to 10acres', count: 5, percent: 3.3 },
        { category: 'youth', type: 'Below 1acre', count: 59, percent: 38.8 },
        { category: 'youth', type: 'nan', count: 29, percent: 19.1 }
    ];

    const [activeView, setActiveView] = useState('ownership-gender');
    const [chartType, setChartType] = useState('overview');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [showDataTable, setShowDataTable] = useState(false);

    const getColor = (category, type) => {
        const colorMap = {
            'Female': '#ec4899', 'Male': '#3b82f6',
            'adults': '#10b981', 'elderly': '#f59e0b', 'youth': '#8b5cf6',
            'Yes': '#059669', 'No': '#dc2626',
            '1 to 5acres': '#16a34a', '6 to 10acres': '#ca8a04',
            '11 to 15acres': '#dc2626', 'Below 1acre': '#7c3aed', 'nan': '#6b7280'
        };
        return colorMap[category] || colorMap[type] || '#6b7280';
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-xl min-w-[200px]">
                    <p className="font-semibold text-gray-800 mb-3 text-center border-b border-gray-100 pb-2">
                        {label || payload[0].name}
                    </p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">{entry.value}</div>
                                    {entry.payload.percent && <div className="text-xs text-gray-600">({entry.payload.percent}%)</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const getCurrentDataset = () => {
        let dataset;
        switch (activeView) {
            case 'ownership-gender': dataset = genderLandOwnership; break;
            case 'ownership-age': dataset = ageBracketLandOwnership; break;
            case 'landsize-gender': dataset = genderLandSize; break;
            case 'landsize-age': dataset = ageBracketLandSize; break;
            default: dataset = genderLandOwnership;
        }
        return dataset.filter(item => {
            const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
            const typeMatch = selectedType === 'all' || item.type === selectedType;
            return categoryMatch && typeMatch;
        });
    };

    const currentData = getCurrentDataset();

    const getOriginalDataset = () => {
        switch (activeView) {
            case 'ownership-gender': return genderLandOwnership;
            case 'ownership-age': return ageBracketLandOwnership;
            case 'landsize-gender': return genderLandSize;
            case 'landsize-age': return ageBracketLandSize;
            default: return genderLandOwnership;
        }
    };

    const originalData = getOriginalDataset();
    const categories = [...new Set(originalData.map(item => item.category))];
    const types = [...new Set(originalData.map(item => item.type))];

    // Prepare pie chart data
    const getPieData = () => {
        const aggregated = {};
        currentData.forEach(item => {
            const key = item.category;
            if (!aggregated[key]) aggregated[key] = 0;
            aggregated[key] += item.count;
        });
        return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
    };

    // Prepare radar chart data
    const getRadarData = () => {
        const grouped = {};
        currentData.forEach(item => {
            if (!grouped[item.type]) grouped[item.type] = {};
            grouped[item.type][item.category] = item.percent;
        });
        return Object.entries(grouped).map(([type, values]) => ({
            type: type === 'nan' ? 'No Land' : type,
            ...values
        }));
    };

    // Comparison data for ownership views
    const getComparisonData = () => {
        return categories.map(cat => {
            const items = currentData.filter(item => item.category === cat);
            const result = { category: cat };
            items.forEach(item => {
                result[item.type] = item.count;
            });
            return result;
        });
    };

    const pieData = getPieData();
    const radarData = getRadarData();
    const comparisonData = getComparisonData();

    const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
            {/* Hero Header */}
            <section className="py-12 mb-8">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                                <Home className="w-16 h-16 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Land Ownership Analysis Dashboard
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Comprehensive insights into land ownership patterns across gender and age demographics
                        </p>

                        {/* Visual Stats Banner */}
                        <div className="grid md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-t-4 border-pink-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="bg-pink-100 p-3 rounded-xl">
                                        <Users className="w-8 h-8 text-pink-600" />
                                    </div>
                                    <div className="text-3xl">♀️</div>
                                </div>
                                <div className="text-3xl font-bold text-pink-600 mb-2">281</div>
                                <div className="text-sm font-medium text-gray-600">Female Respondents</div>
                                <div className="mt-2 w-full bg-pink-100 rounded-full h-2">
                                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '50.7%' }}></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-t-4 border-blue-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <Users className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="text-3xl">♂️</div>
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">273</div>
                                <div className="text-sm font-medium text-gray-600">Male Respondents</div>
                                <div className="mt-2 w-full bg-blue-100 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '49.3%' }}></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-t-4 border-green-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="bg-green-100 p-3 rounded-xl">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div className="text-3xl">✓</div>
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-2">91.3%</div>
                                <div className="text-sm font-medium text-gray-600">Land Ownership Rate</div>
                                <div className="mt-2 w-full bg-green-100 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '91.3%' }}></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-t-4 border-purple-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="bg-purple-100 p-3 rounded-xl">
                                        <Layers className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <div className="text-3xl">📊</div>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">554</div>
                                <div className="text-sm font-medium text-gray-600">Total Records</div>
                                <div className="mt-2 w-full bg-purple-100 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Controls Section */}
            <section className="bg-white py-8 shadow-md mb-8">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200">
                            <div className="grid md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        Data View
                                    </label>
                                    <select
                                        value={activeView}
                                        onChange={(e) => {
                                            setActiveView(e.target.value);
                                            setSelectedCategory('all');
                                            setSelectedType('all');
                                        }}
                                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    >
                                        <option value="ownership-gender">📊 Land Ownership by Gender</option>
                                        <option value="ownership-age">👥 Land Ownership by Age</option>
                                        <option value="landsize-gender">📏 Land Size by Gender</option>
                                        <option value="landsize-age">📐 Land Size by Age</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        Visualization Type
                                    </label>
                                    <select
                                        value={chartType}
                                        onChange={(e) => setChartType(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        <option value="overview">🎯 Overview Dashboard</option>
                                        <option value="bars">📊 Bar Comparison</option>
                                        <option value="pie">🥧 Pie Distribution</option>
                                        <option value="radar">📡 Radar Analysis</option>
                                        <option value="area">📈 Area Trends</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-indigo-600" />
                                        Category Filter
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-purple-600" />
                                        Type Filter
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    >
                                        <option value="all">All Types</option>
                                        {types.map(type => (
                                            <option key={type} value={type}>{type === 'nan' ? 'No Land' : type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {(selectedCategory !== 'all' || selectedType !== 'all') && (
                                <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Filter className="w-5 h-5 text-blue-600" />
                                        <span className="text-base font-semibold text-blue-800">Active Filters</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedCategory !== 'all' && (
                                            <span className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-md">
                                                Category: {selectedCategory}
                                            </span>
                                        )}
                                        {selectedType !== 'all' && (
                                            <span className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full shadow-md">
                                                Type: {selectedType === 'nan' ? 'No Land' : selectedType}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setSelectedType('all');
                                            }}
                                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-full transition-colors shadow-md"
                                        >
                                            ✕ Clear All
                                        </button>
                                    </div>
                                    <div className="bg-white rounded-lg p-3">
                                        <p className="text-sm text-blue-800 font-medium">
                                            📊 Showing <span className="text-lg font-bold">{currentData.length}</span> filtered records
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex items-center gap-4">
                                <button
                                    onClick={() => setShowDataTable(!showDataTable)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                                >
                                    <PieChartIcon className="w-5 h-5" />
                                    {showDataTable ? 'Hide' : 'Show'} Data Table
                                </button>
                                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                                    💡 Tip: Switch between different visualizations to explore patterns
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="py-4">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        {currentData.length === 0 ? (
                            <div className="bg-white rounded-xl p-16 shadow-xl text-center">
                                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Data Found</h3>
                                <p className="text-gray-600 mb-4">No records match your current filter criteria</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedType('all');
                                    }}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Overview Dashboard */}
                                {chartType === 'overview' && (
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        {/* Bar Chart */}
                                        <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                                Category Comparison
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={comparisonData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    {types.filter(type => currentData.some(item => item.type === type)).map((type) => (
                                                        <Bar key={type} dataKey={type} fill={getColor(null, type)} radius={[4, 4, 0, 0]} />
                                                    ))}
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Pie Chart */}
                                        <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <PieChartIcon className="w-5 h-5 text-green-600" />
                                                Distribution by Category
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Area Chart */}
                                        <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 md:col-span-2">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Layers className="w-5 h-5 text-purple-600" />
                                                Detailed Distribution Trends
                                            </h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <AreaChart data={currentData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                                                    <YAxis />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                                    <Area type="monotone" dataKey="percent" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}

                                {/* Bar Chart View */}
                                {chartType === 'bars' && (
                                    <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-6 h-6 text-blue-600" />
                                            Bar Chart Comparison
                                        </h3>
                                        <ResponsiveContainer width="100%" height={500}>
                                            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                {types.filter(type => currentData.some(item => item.type === type)).map((type) => (
                                                    <Bar key={type} dataKey={type} fill={getColor(null, type)} radius={[4, 4, 0, 0]} name={type === 'nan' ? 'No Land' : type} />
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Pie Chart View */}
                                {chartType === 'pie' && (
                                    <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <PieChartIcon className="w-6 h-6 text-green-600" />
                                            Pie Chart Distribution
                                        </h3>
                                        <ResponsiveContainer width="100%" height={500}>
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                                                    outerRadius={180}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Radar Chart View */}
                                {chartType === 'radar' && (
                                    <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <Layers className="w-6 h-6 text-purple-600" />
                                            Radar Chart Analysis
                                        </h3>
                                        <ResponsiveContainer width="100%" height={500}>
                                            <RadarChart data={radarData}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="type" tick={{ fontSize: 12 }} />
                                                <PolarRadiusAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                {categories.map((cat, index) => (
                                                    <Radar key={cat} name={cat} dataKey={cat} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
                                                ))}
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Area Chart View */}
                                {chartType === 'area' && (
                                    <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                                            Area Chart Trends
                                        </h3>
                                        <ResponsiveContainer width="100%" height={500}>
                                            <AreaChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Count" />
                                                <Area type="monotone" dataKey="percent" stroke="#10b981" fill="#10b981" fillOpacity={0.4} name="Percentage" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Data Table */}
                                {showDataTable && (
                                    <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <PieChartIcon className="w-6 h-6 text-gray-600" />
                                            Data Table
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Count</th>
                                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Percentage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentData.map((item, index) => (
                                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${getColor(item.category, null)}20`, color: getColor(item.category, null) }}>
                                                                    {item.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                                {item.type === 'nan' ? 'No Land' : item.type}
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{item.count}</td>
                                                            <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{item.percent}%</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandOwnership;