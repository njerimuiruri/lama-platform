import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie, Label } from 'recharts';
import { Users, TrendingUp, Calendar, Layers } from 'lucide-react';

const PrioritySectorsInfographic = () => {
    const [activeTab, setActiveTab] = useState('gender');

    // Data by Gender
    const genderData = [
        { sector: 'Agriculture', gender: 'Female', count: 271, percent: 33.9 },
        { sector: 'Agriculture', gender: 'Male', count: 268, percent: 33.4 },
        { sector: 'Climate Governance', gender: 'Female', count: 55, percent: 6.9 },
        { sector: 'Climate Governance', gender: 'Male', count: 65, percent: 8.1 },
        { sector: 'Energy', gender: 'Female', count: 55, percent: 6.9 },
        { sector: 'Energy', gender: 'Male', count: 70, percent: 8.7 },
        { sector: 'Forestry', gender: 'Female', count: 123, percent: 15.4 },
        { sector: 'Forestry', gender: 'Male', count: 127, percent: 15.8 },
        { sector: 'Health', gender: 'Female', count: 124, percent: 15.5 },
        { sector: 'Health', gender: 'Male', count: 97, percent: 12.1 },
        { sector: 'Others Sectors', gender: 'Female', count: 8, percent: 1.0 },
        { sector: 'Others Sectors', gender: 'Male', count: 17, percent: 2.1 },
        { sector: 'Water security', gender: 'Female', count: 164, percent: 20.5 },
        { sector: 'Water security', gender: 'Male', count: 159, percent: 19.8 }
    ];

    // Data by Age Bracket
    const ageData = [
        { sector: 'Agriculture', age_bracket: 'adults', count: 140, percent: 33.6 },
        { sector: 'Agriculture', age_bracket: 'elderly', count: 251, percent: 34.4 },
        { sector: 'Agriculture', age_bracket: 'youth', count: 148, percent: 32.5 },
        { sector: 'Climate Governance', age_bracket: 'adults', count: 34, percent: 8.2 },
        { sector: 'Climate Governance', age_bracket: 'elderly', count: 49, percent: 6.7 },
        { sector: 'Climate Governance', age_bracket: 'youth', count: 37, percent: 8.1 },
        { sector: 'Energy', age_bracket: 'adults', count: 33, percent: 7.9 },
        { sector: 'Energy', age_bracket: 'elderly', count: 56, percent: 7.7 },
        { sector: 'Energy', age_bracket: 'youth', count: 36, percent: 7.9 },
        { sector: 'Forestry', age_bracket: 'adults', count: 60, percent: 14.4 },
        { sector: 'Forestry', age_bracket: 'elderly', count: 114, percent: 15.6 },
        { sector: 'Forestry', age_bracket: 'youth', count: 76, percent: 16.7 },
        { sector: 'Health', age_bracket: 'adults', count: 61, percent: 14.6 },
        { sector: 'Health', age_bracket: 'elderly', count: 100, percent: 13.7 },
        { sector: 'Health', age_bracket: 'youth', count: 60, percent: 13.2 },
        { sector: 'Others Sectors', age_bracket: 'adults', count: 5, percent: 1.2 },
        { sector: 'Others Sectors', age_bracket: 'elderly', count: 13, percent: 1.8 },
        { sector: 'Others Sectors', age_bracket: 'youth', count: 7, percent: 1.5 },
        { sector: 'Water security', age_bracket: 'adults', count: 84, percent: 20.1 },
        { sector: 'Water security', age_bracket: 'elderly', count: 147, percent: 20.1 },
        { sector: 'Water security', age_bracket: 'youth', count: 92, percent: 20.2 }
    ];

    // Transform data for grouped bar charts
    const getGroupedGenderData = () => {
        const sectors = [...new Set(genderData.map(d => d.sector))];
        return sectors.map(sector => {
            const female = genderData.find(d => d.sector === sector && d.gender === 'Female');
            const male = genderData.find(d => d.sector === sector && d.gender === 'Male');
            return {
                sector: sector,
                Female: female?.count || 0,
                Male: male?.count || 0,
                FemalePercent: female?.percent || 0,
                MalePercent: male?.percent || 0
            };
        });
    };

    const getGroupedAgeData = () => {
        const sectors = [...new Set(ageData.map(d => d.sector))];
        return sectors.map(sector => {
            const adults = ageData.find(d => d.sector === sector && d.age_bracket === 'adults');
            const elderly = ageData.find(d => d.sector === sector && d.age_bracket === 'elderly');
            const youth = ageData.find(d => d.sector === sector && d.age_bracket === 'youth');
            return {
                sector: sector,
                Adults: adults?.count || 0,
                Elderly: elderly?.count || 0,
                Youth: youth?.count || 0,
                AdultsPercent: adults?.percent || 0,
                ElderlyPercent: elderly?.percent || 0,
                YouthPercent: youth?.percent || 0
            };
        });
    };

    // Calculate totals for pie charts
    const getSectorTotals = () => {
        const sectors = [...new Set(genderData.map(d => d.sector))];
        return sectors.map(sector => {
            const sectorData = genderData.filter(d => d.sector === sector);
            const total = sectorData.reduce((sum, d) => sum + d.count, 0);
            return { sector, count: total };
        });
    };

    const groupedGenderData = getGroupedGenderData();
    const groupedAgeData = getGroupedAgeData();
    const sectorTotals = getSectorTotals();

    const genderColors = { Female: '#ec4899', Male: '#3b82f6' };
    const ageColors = { Adults: '#10b981', Elderly: '#f59e0b', Youth: '#8b5cf6' };
    const sectorColors = ['#16a34a', '#059669', '#10b981', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

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
    const totalParticipants = sectorTotals.reduce((sum, d) => sum + d.count, 0);
    const topSector = sectorTotals.reduce((max, d) => d.count > max.count ? d : max, sectorTotals[0]);
    const femaleTotal = genderData.filter(d => d.gender === 'Female').reduce((sum, d) => sum + d.count, 0);
    const maleTotal = genderData.filter(d => d.gender === 'Male').reduce((sum, d) => sum + d.count, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Priority Sectors Distribution Analysis</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Comprehensive breakdown of participant distribution across priority sectors by gender and age demographics
                    </p>
                </div>

                {/* Key Statistics Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-8 h-8 text-blue-500" />
                            <h3 className="text-sm font-semibold text-gray-600">TOTAL PARTICIPANTS</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalParticipants.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-8 h-8 text-green-500" />
                            <h3 className="text-sm font-semibold text-gray-600">TOP SECTOR</h3>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{topSector.sector}</p>
                        <p className="text-sm text-gray-600">{topSector.count} participants</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-pink-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">F</div>
                            <h3 className="text-sm font-semibold text-gray-600">FEMALE</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{femaleTotal}</p>
                        <p className="text-sm text-gray-600">{((femaleTotal / totalParticipants) * 100).toFixed(1)}%</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                            <h3 className="text-sm font-semibold text-gray-600">MALE</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{maleTotal}</p>
                        <p className="text-sm text-gray-600">{((maleTotal / totalParticipants) * 100).toFixed(1)}%</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('gender')}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'gender'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Distribution by Gender
                    </button>
                    <button
                        onClick={() => setActiveTab('age')}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'age'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Distribution by Age Bracket
                    </button>
                </div>

                {/* Main Chart Section */}
                <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {activeTab === 'gender' ? 'Sector Distribution by Gender' : 'Sector Distribution by Age Bracket'}
                        </h2>
                        <p className="text-gray-600">
                            Number of participants in each priority sector
                            {activeTab === 'gender' ? ' (comparing Female vs Male)' : ' (comparing Adults, Elderly, Youth)'}
                        </p>
                    </div>

                    <ResponsiveContainer width="100%" height={500}>
                        <BarChart
                            data={activeTab === 'gender' ? groupedGenderData : groupedAgeData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="sector"
                                angle={-45}
                                textAnchor="end"
                                height={120}
                                tick={{ fontSize: 12, fill: '#374151' }}
                                label={{ value: 'Priority Sectors', position: 'insideBottom', offset: -80, style: { fontSize: 14, fontWeight: 'bold', fill: '#111827' } }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#374151' }}
                                label={{ value: 'Number of Participants (Count)', angle: -90, position: 'insideLeft', style: { fontSize: 14, fontWeight: 'bold', fill: '#111827' } }}
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
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Overall Sector Distribution</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={sectorTotals}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ sector, percent }) => `${sector.split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {sectorTotals.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={sectorColors[index % sectorColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} participants`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Detailed Breakdown Table */}
                    <div className="bg-white rounded-xl shadow-xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Sector Breakdown</h3>
                        <div className="space-y-4 max-h-[350px] overflow-y-auto">
                            {sectorTotals.sort((a, b) => b.count - a.count).map((sector, index) => {
                                const percentage = ((sector.count / totalParticipants) * 100).toFixed(1);
                                return (
                                    <div key={index} className="border-b border-gray-200 pb-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: sectorColors[index % sectorColors.length] }}
                                                ></div>
                                                <span className="font-semibold text-gray-800">{sector.sector}</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{sector.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: sectorColors[index % sectorColors.length]
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{percentage}% of total participants</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Data Legend */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Layers className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Understanding the Data</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">What the Count Represents</h4>
                            <p className="text-sm text-gray-600">
                                The count represents the <strong>number of individual participants</strong> engaged in each priority sector,
                                categorized by their demographic group (gender or age bracket).
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">What the Percentage Represents</h4>
                            <p className="text-sm text-gray-600">
                                The percentage shows the <strong>proportion within each demographic group</strong> (e.g., what % of all females
                                are in Agriculture), not the sector&apos;s share of total participants.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">X-Axis (Horizontal)</h4>
                            <p className="text-sm text-gray-600">
                                Shows the <strong>seven priority sectors</strong>: Agriculture, Climate Governance, Energy, Forestry,
                                Health, Others Sectors, and Water Security.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Y-Axis (Vertical)</h4>
                            <p className="text-sm text-gray-600">
                                Displays the <strong>count of participants</strong> (number of people) in each sector,
                                allowing direct comparison of participation levels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrioritySectorsInfographic;