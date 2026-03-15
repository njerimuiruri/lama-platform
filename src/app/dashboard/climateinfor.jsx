import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';
import { Users, TrendingUp, Info, Layers } from 'lucide-react';

const ClimateInfoAccessInfographic = () => {
    const [activeTab, setActiveTab] = useState('access');

    // Climate Info Access by Age and Gender
    const accessByAge = [
        { category: 'Adults', no: 45.5, yes: 54.5 },
        { category: 'Elderly', no: 50.2, yes: 49.8 },
        { category: 'Youth', no: 56.6, yes: 43.4 }
    ];

    const accessByGender = [
        { category: 'Female', no: 52, yes: 48 },
        { category: 'Male', no: 49.5, yes: 50.5 }
    ];

    // Frequency data by Gender
    const frequencyByGender = [
        { category: 'Female', Always: 26.7, Never: 1.5, Rarely: 20.7, Sometimes: 51.1 },
        { category: 'Male', Always: 21, Never: 0.7, Rarely: 16.7, Sometimes: 61.6 }
    ];

    // Frequency data by Age
    const frequencyByAge = [
        { category: 'Adults', Always: 19, Never: 2.5, Rarely: 20.3, Sometimes: 58.2 },
        { category: 'Elderly', Always: 25.8, Never: 0.8, Rarely: 17.2, Sometimes: 56.3 },
        { category: 'Youth', Always: 25.8, Never: 0, Rarely: 19.7, Sometimes: 54.5 }
    ];

    const categoryColors = { Adults: '#10b981', Elderly: '#f59e0b', Youth: '#8b5cf6', Female: '#ec4899', Male: '#3b82f6' };
    const accessColors = { Yes: '#22c55e', No: '#ef4444' };
    const frequencyColors = { Always: '#059669', Sometimes: '#3b82f6', Rarely: '#f59e0b', Never: '#dc2626' };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-xl">
                    <p className="font-bold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 mb-1">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-sm font-medium">{entry.name}:</span>
                            </div>
                            <span className="font-bold">{entry.value}%</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Calculate statistics
    const avgAccess = {
        age: (accessByAge.reduce((sum, d) => sum + d.yes, 0) / accessByAge.length).toFixed(1),
        gender: (accessByGender.reduce((sum, d) => sum + d.yes, 0) / accessByGender.length).toFixed(1)
    };

    const highestAccess = [...accessByAge, ...accessByGender].reduce((max, d) =>
        d.yes > max.yes ? d : max
    );

    const lowestAccess = [...accessByAge, ...accessByGender].reduce((min, d) =>
        d.yes < min.yes ? d : min
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Climate Information Access Analysis</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Comprehensive analysis of climate information access and frequency patterns across demographics
                    </p>
                </div>

                {/* Key Statistics Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-3 mb-2">
                            <Info className="w-8 h-8 text-blue-500" />
                            <h3 className="text-sm font-semibold text-gray-600">AVG ACCESS</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{avgAccess.age}%</p>
                        <p className="text-sm text-gray-600">Across all groups</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-8 h-8 text-green-500" />
                            <h3 className="text-sm font-semibold text-gray-600">HIGHEST ACCESS</h3>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{highestAccess.category}</p>
                        <p className="text-sm text-gray-600">{highestAccess.yes}% access rate</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-red-500" />
                            <h3 className="text-sm font-semibold text-gray-600">LOWEST ACCESS</h3>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{lowestAccess.category}</p>
                        <p className="text-sm text-gray-600">{lowestAccess.yes}% access rate</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">i</div>
                            <h3 className="text-sm font-semibold text-gray-600">TOP FREQUENCY</h3>
                        </div>
                        <p className="text-xl font-bold text-gray-900">Sometimes</p>
                        <p className="text-sm text-gray-600">Most common response</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('access')}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'access'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Access Distribution
                    </button>
                    <button
                        onClick={() => setActiveTab('frequency')}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'frequency'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Access Frequency
                    </button>
                </div>

                {activeTab === 'access' && (
                    <>
                        {/* Access Charts */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* By Age */}
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access by Age Bracket</h2>
                                <p className="text-gray-600 mb-6">Percentage with access to climate information</p>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={accessByAge} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="category"
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Age Bracket', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="yes" name="Yes" fill={accessColors.Yes} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="no" name="No" fill={accessColors.No} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* By Gender */}
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access by Gender</h2>
                                <p className="text-gray-600 mb-6">Percentage with access to climate information</p>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={accessByGender} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="category"
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Gender', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="yes" name="Yes" fill={accessColors.Yes} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="no" name="No" fill={accessColors.No} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Charts */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Age Bracket Access Overview</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={accessByAge}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ category, yes }) => `${category}: ${yes}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="yes"
                                        >
                                            {accessByAge.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={Object.values(categoryColors)[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value}%`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Gender Access Comparison</h3>
                                <div className="space-y-6 pt-8">
                                    {accessByGender.map((item, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold text-gray-800">{item.category}</span>
                                                <span className="font-bold text-gray-900">{item.yes}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-4">
                                                <div
                                                    className="h-4 rounded-full transition-all"
                                                    style={{
                                                        width: `${item.yes}%`,
                                                        backgroundColor: item.category === 'Female' ? categoryColors.Female : categoryColors.Male
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'frequency' && (
                    <>
                        {/* Frequency Charts */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* By Gender */}
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequency by Gender</h2>
                                <p className="text-gray-600 mb-6">How often people access climate information</p>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={frequencyByGender} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="category"
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Gender', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="Always" fill={frequencyColors.Always} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Sometimes" fill={frequencyColors.Sometimes} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Rarely" fill={frequencyColors.Rarely} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Never" fill={frequencyColors.Never} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* By Age */}
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequency by Age Bracket</h2>
                                <p className="text-gray-600 mb-6">How often people access climate information</p>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={frequencyByAge} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="category"
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Age Bracket', position: 'insideBottom', offset: -10, style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#374151' }}
                                            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold' } }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="Always" fill={frequencyColors.Always} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Sometimes" fill={frequencyColors.Sometimes} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Rarely" fill={frequencyColors.Rarely} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Never" fill={frequencyColors.Never} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Frequency Breakdown Tables */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Gender Frequency Breakdown</h3>
                                <div className="space-y-4">
                                    {frequencyByGender.map((item, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">{item.category}</h4>
                                            {Object.entries(item).filter(([key]) => key !== 'category').map(([freq, val]) => (
                                                <div key={freq} className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: frequencyColors[freq] }}></div>
                                                        <span className="text-sm">{freq}</span>
                                                    </div>
                                                    <span className="font-bold">{val}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Age Frequency Breakdown</h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {frequencyByAge.map((item, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">{item.category}</h4>
                                            {Object.entries(item).filter(([key]) => key !== 'category').map(([freq, val]) => (
                                                <div key={freq} className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: frequencyColors[freq] }}></div>
                                                        <span className="text-sm">{freq}</span>
                                                    </div>
                                                    <span className="font-bold">{val}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Data Legend */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Layers className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Understanding the Data</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Climate Information Access</h4>
                            <p className="text-sm text-gray-600">
                                Measures whether individuals have <strong>any access</strong> to climate-related information through various channels (media, community programs, digital platforms, etc.).
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Access Frequency</h4>
                            <p className="text-sm text-gray-600">
                                Among those with access, this shows <strong>how often</strong> they engage with climate information: Always (regular basis), Sometimes (occasional), Rarely (infrequent), or Never.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Demographic Categories</h4>
                            <p className="text-sm text-gray-600">
                                Data is segmented by <strong>age brackets</strong> (Adults, Elderly, Youth) and <strong>gender</strong> (Female, Male) to identify access disparities across different population groups.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Key Insights</h4>
                            <p className="text-sm text-gray-600">
                                Youth show the <strong>lowest overall access</strong> (43.4%), while &quot;Sometimes&quot; is the most common frequency across all demographics, suggesting opportunities for more consistent engagement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClimateInfoAccessInfographic;