'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Leaf, Droplets, Heart, TreePine, Zap, Globe, MoreHorizontal, Info } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const sectorTotals = [
    { sector: 'Agriculture', short: 'Agriculture', total: 539, Female: 271, Male: 268, Adults: 140, Elderly: 251, Youth: 148, color: '#16a34a', icon: Leaf },
    { sector: 'Water Security', short: 'Water Security', total: 323, Female: 164, Male: 159, Adults: 84, Elderly: 147, Youth: 92, color: '#0284c7', icon: Droplets },
    { sector: 'Health', short: 'Health', total: 221, Female: 124, Male: 97, Adults: 61, Elderly: 100, Youth: 60, color: '#ef4444', icon: Heart },
    { sector: 'Forestry', short: 'Forestry', total: 250, Female: 123, Male: 127, Adults: 60, Elderly: 114, Youth: 76, color: '#065f46', icon: TreePine },
    { sector: 'Energy', short: 'Energy', total: 125, Female: 55, Male: 70, Adults: 33, Elderly: 56, Youth: 36, color: '#f59e0b', icon: Zap },
    { sector: 'Climate Governance', short: 'Climate Gov.', total: 120, Female: 55, Male: 65, Adults: 34, Elderly: 49, Youth: 37, color: '#0ea5e9', icon: Globe },
    { sector: 'Others', short: 'Others', total: 25, Female: 8, Male: 17, Adults: 5, Elderly: 13, Youth: 7, color: '#6b7280', icon: MoreHorizontal },
];

const TOTAL = 1603;

const SectorTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl text-sm min-w-[200px]">
            <p className="font-bold text-gray-800 mb-2 border-b pb-1">{label}</p>
            {payload.map((e, i) => (
                <div key={i} className="flex justify-between gap-6 mb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: e.color }} />
                        <span className="text-gray-600">{e.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{e.value} people</span>
                </div>
            ))}
        </div>
    );
};

const PrioritySectorsInfographic = () => {
    const [breakdownView, setBreakdownView] = useState('gender');

    const rankedData = [...sectorTotals].sort((a, b) => b.total - a.total);

    const genderChartData = sectorTotals.map(s => ({ name: s.short, Female: s.Female, Male: s.Male }));
    const ageChartData = sectorTotals.map(s => ({ name: s.short, Adults: s.Adults, Elderly: s.Elderly, Youth: s.Youth }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Insight banner */}
                <div className="bg-gradient-to-r from-[#16a34a] to-emerald-700 rounded-2xl p-7 text-white shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Leaf className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-1">Key Finding</p>
                            <h1 className="text-2xl md:text-3xl font-black mb-2">Agriculture is the #1 priority — nearly 1 in 3 participants focus on it</h1>
                            <p className="text-white/85 text-base">Agriculture dominates across all groups. Water Security is #2, followed by Forestry and Health.</p>
                        </div>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Participants', value: '1,603', color: '#6b7280', bg: 'bg-gray-50', border: 'border-gray-200' },
                        { label: '#1 — Agriculture', value: '539', color: '#16a34a', bg: 'bg-green-50', border: 'border-green-200', sub: '33.6% of all participants' },
                        { label: '#2 — Water Security', value: '323', color: '#0284c7', bg: 'bg-blue-50', border: 'border-blue-200', sub: '20.1% of all participants' },
                        { label: '#3 — Forestry', value: '250', color: '#065f46', bg: 'bg-emerald-50', border: 'border-emerald-200', sub: '15.6% of all participants' },
                    ].map(({ label, value, color, bg, border, sub }) => (
                        <div key={label} className={`${bg} border ${border} rounded-2xl p-5 shadow-sm`}>
                            <p className="text-2xl font-black" style={{ color }}>{value}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
                            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                        </div>
                    ))}
                </div>

                {/* Ranked horizontal bar chart */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Which sectors matter most overall?</h2>
                    <p className="text-sm text-gray-500 mb-6">Sectors ranked from most to least popular — based on total number of participants. Longer bar = more people.</p>

                    <div className="space-y-3">
                        {rankedData.map((s, i) => {
                            const Icon = s.icon;
                            const pct = ((s.total / TOTAL) * 100).toFixed(1);
                            return (
                                <div key={s.sector} className="flex items-center gap-4">
                                    <div className="w-6 text-right text-sm font-bold text-gray-400 flex-shrink-0">#{i + 1}</div>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                                        <Icon className="w-5 h-5" style={{ color: s.color }} />
                                    </div>
                                    <div className="w-32 flex-shrink-0">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight">{s.sector}</p>
                                    </div>
                                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                                        <div
                                            className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                                            style={{ width: `${(s.total / rankedData[0].total) * 100}%`, backgroundColor: s.color }}
                                        >
                                            <span className="text-white text-xs font-bold">{s.total}</span>
                                        </div>
                                    </div>
                                    <div className="w-12 text-right text-sm font-bold text-gray-500 flex-shrink-0">{pct}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pie chart: overall sector distribution */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Sector share of all participants</h2>
                    <p className="text-sm text-gray-500 mb-4">The donut shows each sector's share of all 1,603 responses.</p>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <ChartContainer config={Object.fromEntries(sectorTotals.map(s => [s.short, { color: s.color }]))} className="h-64 w-full md:w-64 flex-shrink-0">
                            <PieChart>
                                <Pie
                                    data={sectorTotals.map(s => ({ name: s.short, value: s.total, color: s.color }))}
                                    cx="50%" cy="50%"
                                    innerRadius="50%" outerRadius="80%"
                                    dataKey="value" startAngle={90} endAngle={-270}
                                >
                                    {sectorTotals.map((s, i) => <Cell key={i} fill={s.color} stroke="white" strokeWidth={2} />)}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v} people`]} />
                            </PieChart>
                        </ChartContainer>
                        <div className="space-y-3 flex-1">
                            {sectorTotals.map(s => {
                                const Icon = s.icon;
                                const pct = ((s.total / TOTAL) * 100).toFixed(1);
                                return (
                                    <div key={s.sector} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                                            <Icon className="w-4 h-4" style={{ color: s.color }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-0.5">
                                                <span className="text-sm font-semibold text-gray-800">{s.sector}</span>
                                                <span className="text-sm font-black" style={{ color: s.color }}>{pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${(s.total / sectorTotals[0].total) * 100}%`, backgroundColor: s.color }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Radar chart: Female vs Male across all sectors */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Gender sector profile — radar view</h2>
                    <p className="text-sm text-gray-500 mb-6">Each axis is a sector. The overlapping shapes show that male and female priorities are very similar — with a few notable differences in Health and Energy.</p>
                    <ChartContainer config={{ Female: { color: '#ec4899' }, Male: { color: '#3b82f6' } }} className="h-80">
                        <RadarChart
                            data={sectorTotals.map(s => ({ sector: s.short, Female: s.Female, Male: s.Male }))}
                            cx="50%" cy="50%" outerRadius="70%"
                        >
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="sector" tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }} />
                            <PolarRadiusAxis tick={{ fontSize: 9 }} />
                            <Radar name="Female" dataKey="Female" stroke="#ec4899" fill="#ec4899" fillOpacity={0.25} strokeWidth={2} />
                            <Radar name="Male" dataKey="Male" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} />
                            <Legend />
                            <Tooltip />
                        </RadarChart>
                    </ChartContainer>
                    <div className="mt-4 p-3 bg-pink-50 rounded-xl border border-pink-100 text-sm text-pink-800">
                        <strong>Health is the key gender gap:</strong> Women score noticeably higher on Health (124 vs 97). In all other sectors, the shapes overlap almost perfectly.
                    </div>
                </div>

                {/* Breakdown by group */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-1">Does gender or age change sector priorities?</h2>
                            <p className="text-sm text-gray-500">Compare which sectors different groups prioritise.</p>
                        </div>
                        <div className="flex gap-2">
                            {['gender', 'age'].map(v => (
                                <button key={v} onClick={() => setBreakdownView(v)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${breakdownView === v ? 'bg-[#16a34a] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                    By {v === 'gender' ? 'Gender' : 'Age Group'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ChartContainer config={{
                        Female: { color: '#ec4899' }, Male: { color: '#3b82f6' },
                        Adults: { color: '#10b981' }, Elderly: { color: '#f59e0b' }, Youth: { color: '#8b5cf6' },
                    }} className="h-80">
                        <BarChart
                            data={breakdownView === 'gender' ? genderChartData : ageChartData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} angle={-30} textAnchor="end" height={60} interval={0} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Number of people', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: '#9ca3af' } }} />
                            <Tooltip content={<SectorTooltip />} />
                            <Legend />
                            {breakdownView === 'gender' ? (
                                <>
                                    <Bar dataKey="Female" fill="#ec4899" radius={[4, 4, 0, 0]} name="Female" />
                                    <Bar dataKey="Male" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Male" />
                                </>
                            ) : (
                                <>
                                    <Bar dataKey="Adults" fill="#10b981" radius={[4, 4, 0, 0]} name="Adults" />
                                    <Bar dataKey="Elderly" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Elderly" />
                                    <Bar dataKey="Youth" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Youth" />
                                </>
                            )}
                        </BarChart>
                    </ChartContainer>

                    {breakdownView === 'gender' && (
                        <div className="mt-5 grid md:grid-cols-2 gap-4">
                            <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 text-sm text-pink-800">
                                <strong>Health matters more to women:</strong> 124 females vs 97 males prioritise Health — a 28% gap.
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                                <strong>Agriculture is equal:</strong> Both genders prioritise Agriculture almost identically (271 Female, 268 Male).
                            </div>
                        </div>
                    )}
                    {breakdownView === 'age' && (
                        <div className="mt-5 grid md:grid-cols-2 gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
                                <strong>Elderly dominate agriculture:</strong> 251 elderly respondents prioritise agriculture — the highest of any group in any sector.
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-800">
                                <strong>Youth favour forestry:</strong> Youth have the highest forestry participation rate (16.7%) of any age group.
                            </div>
                        </div>
                    )}
                </div>

                {/* Takeaway */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-7">
                    <div className="flex items-start gap-4">
                        <Info className="w-7 h-7 text-green-700 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">What does this mean?</h3>
                            <p className="text-gray-700 leading-relaxed">
                                The percentages show what share of each group (female, male, adults, etc.) is engaged in that sector — not the sector's share of all participants. Agriculture is consistently the top priority across every demographic. Water Security and Forestry are close seconds, reflecting the community's dependence on natural resources for livelihoods.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PrioritySectorsInfographic;
