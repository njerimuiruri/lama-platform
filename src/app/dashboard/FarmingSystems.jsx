'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, ComposedChart, Cell } from 'recharts';
import { Filter, TrendingUp, Users, PieChart } from 'lucide-react';

const FarmingSystems = () => {
    const genderFarmingSystems = [
        { category: 'Female', type: 'Both', count: 100, percent: 35.6 },
        { category: 'Female', type: 'Commercial', count: 12, percent: 4.3 },
        { category: 'Female', type: 'Subsistence', count: 169, percent: 60.1 },
        { category: 'Male', type: 'Both', count: 101, percent: 37.0 },
        { category: 'Male', type: 'Commercial', count: 23, percent: 8.4 },
        { category: 'Male', type: 'Subsistence', count: 149, percent: 54.6 }
    ];

    const ageBracketFarmingSystems = [
        { category: 'adults', type: 'Both', count: 53, percent: 36.6 },
        { category: 'adults', type: 'Commercial', count: 11, percent: 7.6 },
        { category: 'adults', type: 'Subsistence', count: 81, percent: 55.9 },
        { category: 'elderly', type: 'Both', count: 87, percent: 33.9 },
        { category: 'elderly', type: 'Commercial', count: 12, percent: 4.7 },
        { category: 'elderly', type: 'Subsistence', count: 158, percent: 61.5 },
        { category: 'youth', type: 'Both', count: 61, percent: 40.1 },
        { category: 'youth', type: 'Commercial', count: 12, percent: 7.9 },
        { category: 'youth', type: 'Subsistence', count: 79, percent: 52.0 }
    ];

    // Filter states
    const [activeView, setActiveView] = useState('farming-gender');
    const [chartType, setChartType] = useState('grouped');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [showDataTable, setShowDataTable] = useState(false);

    const getColor = (category, type) => {
        const colorMap = {
            'Female': '#ec4899', 'Male': '#3b82f6',
            'adults': '#10b981', 'elderly': '#f59e0b', 'youth': '#8b5cf6',
            'Both': '#059669', 'Commercial': '#dc2626', 'Subsistence': '#7c3aed'
        };
        return colorMap[category] || colorMap[type] || '#6b7280';
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl max-w-xs">
                    <p className="font-semibold text-gray-800 mb-3 text-center border-b pb-2">{label}</p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => {
                            // Find the original data point
                            const originalData = getCurrentDataset().find(item =>
                                (chartType === 'grouped' && item.category === label && item.type === entry.dataKey) ||
                                (chartType === 'stacked' && item.type === label && item.category === entry.dataKey) ||
                                (chartType === 'relationship' && item.category === entry.payload.category)
                            );

                            return (
                                <div key={index} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {entry.dataKey === 'count' ? 'Count' :
                                                entry.dataKey === 'percent' ? 'Percentage' :
                                                    entry.dataKey}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900">
                                            {entry.dataKey === 'percent' ? `${entry.value}%` : entry.value}
                                        </div>
                                        {originalData && entry.dataKey !== 'percent' && entry.dataKey !== 'count' && (
                                            <div className="text-xs text-gray-600">
                                                ({originalData.percent}%)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {chartType === 'relationship' && payload[0]?.payload && (
                            <div className="mt-3 pt-2 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-center">
                                        <div className="text-gray-600">Type</div>
                                        <div className="font-medium">{payload[0].payload.type}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-600">Category</div>
                                        <div className="font-medium">{payload[0].payload.category}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomBarLabel = ({ x, y, width, height, value, payload, dataKey }) => {
        if (!value || value < 10) return null; // Only show labels for larger values

        const originalData = getCurrentDataset().find(item =>
            (chartType === 'grouped' && item.category === payload.category && item.type === dataKey) ||
            (chartType === 'stacked' && item.type === payload.type && item.category === dataKey)
        );

        const displayText = originalData ? `${value} (${originalData.percent}%)` : value;

        return (
            <text
                x={x + width / 2}
                y={y + height / 2}
                fill="#fff"
                textAnchor="middle"
                dy={0}
                fontSize="11"
                fontWeight="bold"
                className="drop-shadow-sm"
            >
                {displayText}
            </text>
        );
    };

    const getGroupedData = (dataset) => {
        const categories = [...new Set(dataset.map(item => item.category))];
        return categories.map(cat => {
            const items = dataset.filter(item => item.category === cat);
            const result = { category: cat };
            items.forEach(item => {
                result[item.type] = item.count;
                result[`${item.type}_percent`] = item.percent;
            });
            return result;
        });
    };

    const getStackedData = (dataset) => {
        const types = [...new Set(dataset.map(item => item.type))];
        return types.map(type => {
            const items = dataset.filter(item => item.type === type);
            const result = { type };
            items.forEach(item => {
                result[item.category] = item.count;
            });
            return result;
        });
    };

    const getCurrentDataset = () => {
        let dataset;
        switch (activeView) {
            case 'farming-gender': dataset = genderFarmingSystems; break;
            case 'farming-age': dataset = ageBracketFarmingSystems; break;
            default: dataset = genderFarmingSystems;
        }

        return dataset.filter(item => {
            const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
            const typeMatch = selectedType === 'all' || item.type === selectedType;
            return categoryMatch && typeMatch;
        });
    };

    const currentData = getCurrentDataset();
    const groupedData = getGroupedData(currentData);
    const stackedData = getStackedData(currentData);

    const getOriginalDataset = () => {
        switch (activeView) {
            case 'farming-gender': return genderFarmingSystems;
            case 'farming-age': return ageBracketFarmingSystems;
            default: return genderFarmingSystems;
        }
    };

    const originalData = getOriginalDataset();
    const categories = [...new Set(originalData.map(item => item.category))];
    const types = [...new Set(originalData.map(item => item.type))];

    return (
        <div className="py-8">
            {/* Controls Section */}
            <section className="bg-gray-50 py-8">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="grid md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data View</label>
                                    <select
                                        value={activeView}
                                        onChange={(e) => {
                                            setActiveView(e.target.value);
                                            setSelectedCategory('all');
                                            setSelectedType('all');
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="farming-gender">Farming Systems by Gender</option>
                                        <option value="farming-age">Farming Systems by Age Bracket</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                                    <select
                                        value={chartType}
                                        onChange={(e) => setChartType(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="grouped">Grouped Comparison</option>
                                        <option value="stacked">Stacked Distribution</option>
                                        <option value="relationship">Relationship View</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Filter Type</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Types</option>
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {(selectedCategory !== 'all' || selectedType !== 'all') && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Filter className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategory !== 'all' && (
                                            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                                                {selectedCategory}
                                            </span>
                                        )}
                                        {selectedType !== 'all' && (
                                            <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                                                {selectedType}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setSelectedType('all');
                                            }}
                                            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-full transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <p className="text-sm text-blue-700 mt-2">
                                        Showing {currentData.length} records
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                <button
                                    onClick={() => setShowDataTable(!showDataTable)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <PieChart className="w-4 h-4" />
                                    {showDataTable ? 'Hide' : 'Show'} Data Table
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {activeView.replace('-', ' by ').replace(/\b\w/g, l => l.toUpperCase())}
                                </h2>
                                {(selectedCategory !== 'all' || selectedType !== 'all') && (
                                    <span className="text-sm text-blue-600 font-medium">
                                        (Filtered View)
                                    </span>
                                )}
                            </div>

                            {currentData.length === 0 && (
                                <div className="text-center py-12">
                                    <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No data matches your filters</h3>
                                    <p className="text-gray-600">Try adjusting your filter criteria to see results.</p>
                                </div>
                            )}

                            {currentData.length > 0 && (
                                <>
                                    {chartType === 'grouped' && (
                                        <ResponsiveContainer width="100%" height={500}>
                                            <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="category"
                                                    tick={{ fontSize: 12 }}
                                                    height={60}
                                                />
                                                <YAxis domain={[0, 200]} />
                                                <Tooltip content={<CustomTooltip />} />
                                                {types.filter(type => currentData.some(item => item.type === type)).map((type, index) => (
                                                    <Bar
                                                        key={type}
                                                        dataKey={type}
                                                        fill={getColor(null, type)}
                                                        radius={[2, 2, 0, 0]}
                                                        name={type}
                                                    >
                                                        <Cell />
                                                    </Bar>
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}

                                    {chartType === 'stacked' && (
                                        <ResponsiveContainer width="100%" height={500}>
                                            <BarChart data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="type"
                                                    tick={{ fontSize: 11 }}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={100}
                                                />
                                                <YAxis domain={[0, 300]} />
                                                <Tooltip content={<CustomTooltip />} />
                                                {categories.filter(cat => currentData.some(item => item.category === cat)).map((category, index) => (
                                                    <Bar
                                                        key={category}
                                                        dataKey={category}
                                                        stackId="a"
                                                        fill={getColor(category, null)}
                                                        name={category}
                                                    >
                                                        <Cell />
                                                    </Bar>
                                                ))}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}

                                    {chartType === 'relationship' && (
                                        <ResponsiveContainer width="100%" height={500}>
                                            <ComposedChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="category"
                                                    tick={{ fontSize: 11 }}
                                                    height={60}
                                                />
                                                <YAxis yAxisId="left" domain={[0, 200]} />
                                                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar
                                                    yAxisId="left"
                                                    dataKey="count"
                                                    fill="#16a34a"
                                                    fillOpacity={0.6}
                                                    radius={[2, 2, 0, 0]}
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="percent"
                                                    stroke="#dc2626"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    )}

                                    {/* Legend */}
                                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                                        {(chartType === 'grouped' ?
                                            types.filter(type => currentData.some(item => item.type === type)) :
                                            categories.filter(cat => currentData.some(item => item.category === cat))
                                        ).map((item, index) => (
                                            <div key={item} className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: chartType === 'grouped' ? getColor(null, item) : getColor(item, null) }}
                                                ></div>
                                                <span className="text-sm text-gray-600 font-medium">{item}</span>
                                            </div>
                                        ))}
                                        {chartType === 'relationship' && (
                                            <>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                                                    <span className="text-sm text-gray-600 font-medium">Count</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-1 bg-red-600 rounded"></div>
                                                    <span className="text-sm text-gray-600 font-medium">Percentage</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Summary Cards */}
                        {currentData.length > 0 && (
                            <div className="grid md:grid-cols-4 gap-6 mt-8">
                                {currentData.slice(0, 4).map((item, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-800 text-sm">{item.category}</h3>
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(item.category, item.type) }}></div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                                            <p className="text-sm text-gray-600">{item.type}</p>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${item.percent}%`,
                                                        backgroundColor: getColor(item.category, item.type)
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">{item.percent}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Data Table */}
                        {showDataTable && currentData.length > 0 && (
                            <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-gray-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Data Table</h3>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Farming System
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Count
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Percentage
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentData.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: getColor(item.category, null) }}
                                                            ></div>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm text-gray-700">
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {item.count}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="h-2 rounded-full"
                                                                    style={{
                                                                        width: `${item.percent}%`,
                                                                        backgroundColor: getColor(item.category, item.type)
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {item.percent}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FarmingSystems;