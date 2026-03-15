import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Layers } from 'lucide-react';

const ClimateImpactsInfographic = () => {
    const [activeTab, setActiveTab] = useState('gender');

    // Data by Gender and Age Bracket
    const impactData = [
        { impact: 'Change in rainfall patterns', gender: 'Female', age_bracket: 'adults', count: 62, percent: 16.0 },
        { impact: 'Change in rainfall patterns', gender: 'Female', age_bracket: 'elderly', count: 102, percent: 14.7 },
        { impact: 'Change in rainfall patterns', gender: 'Female', age_bracket: 'youth', count: 45, percent: 13.8 },
        { impact: 'Change in rainfall patterns', gender: 'Male', age_bracket: 'adults', count: 48, percent: 12.7 },
        { impact: 'Change in rainfall patterns', gender: 'Male', age_bracket: 'elderly', count: 87, percent: 14.9 },
        { impact: 'Change in rainfall patterns', gender: 'Male', age_bracket: 'youth', count: 48, percent: 12.8 },
        { impact: 'Damaged infrastructure', gender: 'Female', age_bracket: 'adults', count: 27, percent: 7.0 },
        { impact: 'Damaged infrastructure', gender: 'Female', age_bracket: 'elderly', count: 42, percent: 6.0 },
        { impact: 'Damaged infrastructure', gender: 'Female', age_bracket: 'youth', count: 23, percent: 7.1 },
        { impact: 'Damaged infrastructure', gender: 'Male', age_bracket: 'adults', count: 31, percent: 8.2 },
        { impact: 'Damaged infrastructure', gender: 'Male', age_bracket: 'elderly', count: 38, percent: 6.5 },
        { impact: 'Damaged infrastructure', gender: 'Male', age_bracket: 'youth', count: 25, percent: 6.7 },
        { impact: 'Flooding', gender: 'Female', age_bracket: 'adults', count: 37, percent: 9.6 },
        { impact: 'Flooding', gender: 'Female', age_bracket: 'elderly', count: 63, percent: 9.1 },
        { impact: 'Flooding', gender: 'Female', age_bracket: 'youth', count: 27, percent: 8.3 },
        { impact: 'Flooding', gender: 'Male', age_bracket: 'adults', count: 38, percent: 10.0 },
        { impact: 'Flooding', gender: 'Male', age_bracket: 'elderly', count: 49, percent: 8.4 },
        { impact: 'Flooding', gender: 'Male', age_bracket: 'youth', count: 46, percent: 12.3 },
        { impact: 'Higher food prices', gender: 'Female', age_bracket: 'adults', count: 40, percent: 10.3 },
        { impact: 'Higher food prices', gender: 'Female', age_bracket: 'elderly', count: 70, percent: 10.1 },
        { impact: 'Higher food prices', gender: 'Female', age_bracket: 'youth', count: 37, percent: 11.3 },
        { impact: 'Higher food prices', gender: 'Male', age_bracket: 'adults', count: 42, percent: 11.1 },
        { impact: 'Higher food prices', gender: 'Male', age_bracket: 'elderly', count: 64, percent: 11.0 },
        { impact: 'Higher food prices', gender: 'Male', age_bracket: 'youth', count: 34, percent: 9.1 },
        { impact: 'Increased heatwaves', gender: 'Female', age_bracket: 'adults', count: 27, percent: 7.0 },
        { impact: 'Increased heatwaves', gender: 'Female', age_bracket: 'elderly', count: 49, percent: 7.1 },
        { impact: 'Increased heatwaves', gender: 'Female', age_bracket: 'youth', count: 16, percent: 4.9 },
        { impact: 'Increased heatwaves', gender: 'Male', age_bracket: 'adults', count: 25, percent: 6.6 },
        { impact: 'Increased heatwaves', gender: 'Male', age_bracket: 'elderly', count: 43, percent: 7.4 },
        { impact: 'Increased heatwaves', gender: 'Male', age_bracket: 'youth', count: 20, percent: 5.3 },
        { impact: 'Livestock death', gender: 'Female', age_bracket: 'adults', count: 17, percent: 4.4 },
        { impact: 'Livestock death', gender: 'Female', age_bracket: 'elderly', count: 23, percent: 3.3 },
        { impact: 'Livestock death', gender: 'Female', age_bracket: 'youth', count: 11, percent: 3.4 },
        { impact: 'Livestock death', gender: 'Male', age_bracket: 'adults', count: 18, percent: 4.7 },
        { impact: 'Livestock death', gender: 'Male', age_bracket: 'elderly', count: 22, percent: 3.8 },
        { impact: 'Livestock death', gender: 'Male', age_bracket: 'youth', count: 15, percent: 4.0 },
        { impact: 'Mass displacement', gender: 'Female', age_bracket: 'adults', count: 8, percent: 2.1 },
        { impact: 'Mass displacement', gender: 'Female', age_bracket: 'elderly', count: 19, percent: 2.7 },
        { impact: 'Mass displacement', gender: 'Female', age_bracket: 'youth', count: 11, percent: 3.4 },
        { impact: 'Mass displacement', gender: 'Male', age_bracket: 'adults', count: 14, percent: 3.7 },
        { impact: 'Mass displacement', gender: 'Male', age_bracket: 'elderly', count: 9, percent: 1.5 },
        { impact: 'Mass displacement', gender: 'Male', age_bracket: 'youth', count: 9, percent: 2.4 },
        { impact: 'Others Impacts', gender: 'Female', age_bracket: 'adults', count: 2, percent: 0.5 },
        { impact: 'Others Impacts', gender: 'Female', age_bracket: 'elderly', count: 2, percent: 0.3 },
        { impact: 'Others Impacts', gender: 'Female', age_bracket: 'youth', count: 2, percent: 0.6 },
        { impact: 'Others Impacts', gender: 'Male', age_bracket: 'adults', count: 3, percent: 0.8 },
        { impact: 'Others Impacts', gender: 'Male', age_bracket: 'elderly', count: 3, percent: 0.5 },
        { impact: 'Others Impacts', gender: 'Male', age_bracket: 'youth', count: 4, percent: 1.1 },
        { impact: 'Prolonged drought', gender: 'Female', age_bracket: 'adults', count: 50, percent: 12.9 },
        { impact: 'Prolonged drought', gender: 'Female', age_bracket: 'elderly', count: 112, percent: 16.1 },
        { impact: 'Prolonged drought', gender: 'Female', age_bracket: 'youth', count: 52, percent: 16.0 },
        { impact: 'Prolonged drought', gender: 'Male', age_bracket: 'adults', count: 46, percent: 12.1 },
        { impact: 'Prolonged drought', gender: 'Male', age_bracket: 'elderly', count: 91, percent: 15.6 },
        { impact: 'Prolonged drought', gender: 'Male', age_bracket: 'youth', count: 53, percent: 14.2 },
        { impact: 'Reduced crop yields', gender: 'Female', age_bracket: 'adults', count: 57, percent: 14.7 },
        { impact: 'Reduced crop yields', gender: 'Female', age_bracket: 'elderly', count: 114, percent: 16.4 },
        { impact: 'Reduced crop yields', gender: 'Female', age_bracket: 'youth', count: 54, percent: 16.6 },
        { impact: 'Reduced crop yields', gender: 'Male', age_bracket: 'adults', count: 54, percent: 14.2 },
        { impact: 'Reduced crop yields', gender: 'Male', age_bracket: 'elderly', count: 92, percent: 15.8 },
        { impact: 'Reduced crop yields', gender: 'Male', age_bracket: 'youth', count: 65, percent: 17.4 },
        { impact: 'Reduced productivity', gender: 'Female', age_bracket: 'adults', count: 42, percent: 10.9 },
        { impact: 'Reduced productivity', gender: 'Female', age_bracket: 'elderly', count: 63, percent: 9.1 },
        { impact: 'Reduced productivity', gender: 'Female', age_bracket: 'youth', count: 31, percent: 9.5 },
        { impact: 'Reduced productivity', gender: 'Male', age_bracket: 'adults', count: 44, percent: 11.6 },
        { impact: 'Reduced productivity', gender: 'Male', age_bracket: 'elderly', count: 53, percent: 9.1 },
        { impact: 'Reduced productivity', gender: 'Male', age_bracket: 'youth', count: 41, percent: 11.0 },
        { impact: 'Rivers drying up', gender: 'Female', age_bracket: 'adults', count: 18, percent: 4.7 },
        { impact: 'Rivers drying up', gender: 'Female', age_bracket: 'elderly', count: 36, percent: 5.2 },
        { impact: 'Rivers drying up', gender: 'Female', age_bracket: 'youth', count: 17, percent: 5.2 },
        { impact: 'Rivers drying up', gender: 'Male', age_bracket: 'adults', count: 16, percent: 4.2 },
        { impact: 'Rivers drying up', gender: 'Male', age_bracket: 'elderly', count: 32, percent: 5.5 },
        { impact: 'Rivers drying up', gender: 'Male', age_bracket: 'youth', count: 14, percent: 3.7 }
    ];

    // Transform data for grouped bar charts by Gender
    const getGroupedGenderData = () => {
        const impacts = [...new Set(impactData.map(d => d.impact))];
        return impacts.map(impact => {
            const femaleTotal = impactData.filter(d => d.impact === impact && d.gender === 'Female').reduce((sum, d) => sum + d.count, 0);
            const maleTotal = impactData.filter(d => d.impact === impact && d.gender === 'Male').reduce((sum, d) => sum + d.count, 0);
            const femalePercent = impactData.filter(d => d.impact === impact && d.gender === 'Female').reduce((sum, d) => sum + d.percent, 0) / 3;
            const malePercent = impactData.filter(d => d.impact === impact && d.gender === 'Male').reduce((sum, d) => sum + d.percent, 0) / 3;
            return {
                impact: impact,
                Female: femaleTotal,
                Male: maleTotal,
                FemalePercent: femalePercent.toFixed(1),
                MalePercent: malePercent.toFixed(1)
            };
        });
    };

    // Transform data for grouped bar charts by Age
    const getGroupedAgeData = () => {
        const impacts = [...new Set(impactData.map(d => d.impact))];
        return impacts.map(impact => {
            const adultsTotal = impactData.filter(d => d.impact === impact && d.age_bracket === 'adults').reduce((sum, d) => sum + d.count, 0);
            const elderlyTotal = impactData.filter(d => d.impact === impact && d.age_bracket === 'elderly').reduce((sum, d) => sum + d.count, 0);
            const youthTotal = impactData.filter(d => d.impact === impact && d.age_bracket === 'youth').reduce((sum, d) => sum + d.count, 0);
            const adultsPercent = impactData.filter(d => d.impact === impact && d.age_bracket === 'adults').reduce((sum, d) => sum + d.percent, 0) / 2;
            const elderlyPercent = impactData.filter(d => d.impact === impact && d.age_bracket === 'elderly').reduce((sum, d) => sum + d.percent, 0) / 2;
            const youthPercent = impactData.filter(d => d.impact === impact && d.age_bracket === 'youth').reduce((sum, d) => sum + d.percent, 0) / 2;
            return {
                impact: impact,
                Adults: adultsTotal,
                Elderly: elderlyTotal,
                Youth: youthTotal,
                AdultsPercent: adultsPercent.toFixed(1),
                ElderlyPercent: elderlyPercent.toFixed(1),
                YouthPercent: youthPercent.toFixed(1)
            };
        });
    };

    // Calculate totals for pie charts
    const getImpactTotals = () => {
        const impacts = [...new Set(impactData.map(d => d.impact))];
        return impacts.map(impact => {
            const total = impactData.filter(d => d.impact === impact).reduce((sum, d) => sum + d.count, 0);
            return { impact, count: total };
        });
    };

    const groupedGenderData = getGroupedGenderData();
    const groupedAgeData = getGroupedAgeData();
    const impactTotals = getImpactTotals();

    const genderColors = { Female: '#ec4899', Male: '#3b82f6' };
    const ageColors = { Adults: '#10b981', Elderly: '#f59e0b', Youth: '#8b5cf6' };
    const impactColors = ['#dc2626', '#ea580c', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-xl">
                    <p className="font-bold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry, index) => {
                        const percentKey = `${entry.dataKey}Percent`;
                        const percent = entry.payload[percentKey];
                        return (
                            <div key={index} className="flex items-center justify-between gap-4 mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                                    <span className="text-sm font-medium">{entry.name}:</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold">{entry.value}</span>
                                    {percent && <span className="text-xs text-gray-600 ml-1">({percent}%)</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    // Calculate key statistics
    const totalResponses = impactTotals.reduce((sum, d) => sum + d.count, 0);
    const topImpact = impactTotals.reduce((max, d) => d.count > max.count ? d : max, impactTotals[0]);
    const femaleTotal = impactData.filter(d => d.gender === 'Female').reduce((sum, d) => sum + d.count, 0);
    const maleTotal = impactData.filter(d => d.gender === 'Male').reduce((sum, d) => sum + d.count, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="w-16 h-16 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Climate Change Impacts Analysis</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Understanding how climate change affects communities across different demographics and impact categories
                    </p>
                </div>

                {/* Key Statistics Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-red-500" />
                            <h3 className="text-sm font-semibold text-gray-600">TOTAL RESPONSES</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalResponses.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-8 h-8 text-orange-500" />
                            <h3 className="text-sm font-semibold text-gray-600">TOP IMPACT</h3>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{topImpact.impact}</p>
                        <p className="text-sm text-gray-600">{topImpact.count} responses</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-pink-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">F</div>
                            <h3 className="text-sm font-semibold text-gray-600">FEMALE</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{femaleTotal}</p>
                        <p className="text-sm text-gray-600">{((femaleTotal / totalResponses) * 100).toFixed(1)}%</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                            <h3 className="text-sm font-semibold text-gray-600">MALE</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{maleTotal}</p>
                        <p className="text-sm text-gray-600">{((maleTotal / totalResponses) * 100).toFixed(1)}%</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('gender')}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'gender'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Impacts by Gender
                    </button>
                    <button
                        onClick={() => setActiveTab('age')}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'age'
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Impacts by Age Bracket
                    </button>
                </div>

                {/* Main Chart Section */}
                <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {activeTab === 'gender' ? 'Climate Impacts by Gender' : 'Climate Impacts by Age Bracket'}
                        </h2>
                        <p className="text-gray-600">
                            Number of responses reporting each climate impact
                            {activeTab === 'gender' ? ' (comparing Female vs Male)' : ' (comparing Adults, Elderly, Youth)'}
                        </p>
                    </div>

                    <ResponsiveContainer width="100%" height={550}>
                        <BarChart
                            data={activeTab === 'gender' ? groupedGenderData : groupedAgeData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 140 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="impact"
                                angle={-45}
                                textAnchor="end"
                                height={140}
                                tick={{ fontSize: 11, fill: '#374151' }}
                                interval={0}
                                label={{ value: 'Climate Change Impacts', position: 'insideBottom', offset: -100, style: { fontSize: 14, fontWeight: 'bold', fill: '#111827' } }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#374151' }}
                                label={{ value: 'Number of Responses', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold', fill: '#111827' } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="circle"
                            />

                            {activeTab === 'gender' ? (
                                <>
                                    <Bar dataKey="Female" fill={genderColors.Female} radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="Male" fill={genderColors.Male} radius={[8, 8, 0, 0]} />
                                </>
                            ) : (
                                <>
                                    <Bar dataKey="Adults" fill={ageColors.Adults} radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="Elderly" fill={ageColors.Elderly} radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="Youth" fill={ageColors.Youth} radius={[8, 8, 0, 0]} />
                                </>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart and Breakdown */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow-xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Overall Impact Distribution</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={impactTotals}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ impact, count }) => {
                                        const percent = ((count / totalResponses) * 100).toFixed(0);
                                        const shortName = impact.split(' ').slice(0, 2).join(' ');
                                        return `${shortName} ${percent}%`;
                                    }}
                                    outerRadius={130}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {impactTotals.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={impactColors[index % impactColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} responses`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Detailed Breakdown Table */}
                    <div className="bg-white rounded-xl shadow-xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Impact Breakdown</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {impactTotals.sort((a, b) => b.count - a.count).map((impact, index) => {
                                const percentage = ((impact.count / totalResponses) * 100).toFixed(1);
                                const originalIndex = impactTotals.findIndex(i => i.impact === impact.impact);
                                return (
                                    <div key={index} className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: impactColors[originalIndex % impactColors.length] }}
                                                ></div>
                                                <span className="font-semibold text-gray-800 text-sm">{impact.impact}</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{impact.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: impactColors[originalIndex % impactColors.length]
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{percentage}% of total responses</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Data Legend */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Layers className="w-6 h-6 text-red-600" />
                        <h3 className="text-xl font-bold text-gray-900">Understanding the Data</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">What the Count Represents</h4>
                            <p className="text-sm text-gray-600">
                                The count represents the <strong>number of individual responses</strong> reporting each specific climate change impact,
                                categorized by their demographic group (gender or age bracket).
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">What the Percentage Represents</h4>
                            <p className="text-sm text-gray-600">
                                The percentage shows the <strong>proportion within each demographic group</strong> (e.g., what % of all female responses
                                reported this impact), not the impact&apos;s share of all responses.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Climate Impact Categories</h4>
                            <p className="text-sm text-gray-600">
                                Includes <strong>12 distinct impact types</strong> ranging from environmental changes (drought, flooding) to
                                socioeconomic effects (food prices, displacement, infrastructure damage).
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Key Insights</h4>
                            <p className="text-sm text-gray-600">
                                The data reveals how different demographic groups experience and report climate impacts,
                                helping identify <strong>vulnerable populations</strong> and priority areas for climate adaptation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClimateImpactsInfographic;