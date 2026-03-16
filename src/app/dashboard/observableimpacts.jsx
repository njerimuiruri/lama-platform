'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { AlertTriangle, CloudRain, Wheat, ThermometerSun, Droplets, TrendingDown, Info } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const impactTotals = [
    { impact: 'Reduced crop yields',        short: 'Crop Yields ↓',    total: 436, Female: 225, Male: 211, Adults: 111, Elderly: 206, Youth: 119, color: '#b91c1c' },
    { impact: 'Prolonged drought',           short: 'Drought',          total: 404, Female: 214, Male: 190, Adults: 96,  Elderly: 203, Youth: 105, color: '#dc2626' },
    { impact: 'Change in rainfall patterns', short: 'Rainfall Changes', total: 392, Female: 209, Male: 183, Adults: 110, Elderly: 189, Youth: 93,  color: '#ea580c' },
    { impact: 'Higher food prices',          short: 'Food Prices ↑',    total: 287, Female: 147, Male: 140, Adults: 82,  Elderly: 134, Youth: 71,  color: '#f59e0b' },
    { impact: 'Reduced productivity',        short: 'Productivity ↓',   total: 274, Female: 136, Male: 138, Adults: 86,  Elderly: 116, Youth: 72,  color: '#ca8a04' },
    { impact: 'Flooding',                    short: 'Flooding',         total: 260, Female: 127, Male: 133, Adults: 75,  Elderly: 112, Youth: 73,  color: '#2563eb' },
    { impact: 'Damaged infrastructure',      short: 'Infrastructure',   total: 186, Female: 92,  Male: 94,  Adults: 58,  Elderly: 80,  Youth: 48,  color: '#7c3aed' },
    { impact: 'Increased heatwaves',         short: 'Heatwaves',        total: 180, Female: 92,  Male: 88,  Adults: 52,  Elderly: 92,  Youth: 36,  color: '#d97706' },
    { impact: 'Rivers drying up',            short: 'Rivers Drying',    total: 133, Female: 71,  Male: 62,  Adults: 34,  Elderly: 68,  Youth: 31,  color: '#0891b2' },
    { impact: 'Livestock death',             short: 'Livestock Death',  total: 106, Female: 51,  Male: 55,  Adults: 35,  Elderly: 45,  Youth: 26,  color: '#059669' },
    { impact: 'Mass displacement',           short: 'Displacement',     total: 70,  Female: 38,  Male: 32,  Adults: 22,  Elderly: 28,  Youth: 20,  color: '#6b7280' },
    { impact: 'Others',                      short: 'Other',            total: 16,  Female: 6,   Male: 10,  Adults: 5,   Elderly: 5,   Youth: 6,   color: '#9ca3af' },
];

const TOTAL = impactTotals.reduce((s, d) => s + d.total, 0);
const TOP6 = impactTotals.slice(0, 6);

const ImpactTooltip = ({ active, payload, label }) => {
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
                    <span className="font-bold text-gray-900">{e.value} responses</span>
                </div>
            ))}
        </div>
    );
};

const impactMeanings = [
    { icon: Wheat, label: 'Reduced crop yields', desc: 'Farms are producing less food than before.', color: '#b91c1c' },
    { icon: CloudRain, label: 'Prolonged drought', desc: 'Rainfall has stopped for unusually long periods.', color: '#dc2626' },
    { icon: CloudRain, label: 'Rainfall changes', desc: 'Rain now comes at unexpected times — too early, too late, or not at all.', color: '#ea580c' },
    { icon: TrendingDown, label: 'Higher food prices', desc: 'Food costs more because supply has dropped.', color: '#f59e0b' },
    { icon: ThermometerSun, label: 'Heatwaves', desc: 'Temperatures are rising to dangerous levels more often.', color: '#d97706' },
    { icon: Droplets, label: 'Rivers drying up', desc: 'Water sources that communities rely on are disappearing.', color: '#0891b2' },
];

const ClimateImpactsInfographic = () => {
    const [breakdownView, setBreakdownView] = useState('gender');

    const genderData = TOP6.map(d => ({ name: d.short, Female: d.Female, Male: d.Male }));
    const ageData = TOP6.map(d => ({ name: d.short, Adults: d.Adults, Elderly: d.Elderly, Youth: d.Youth }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Insight banner */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-7 text-white shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-1">Key Finding</p>
                            <h1 className="text-2xl md:text-3xl font-black mb-2">Reduced crop yields and prolonged drought are the most feared climate impacts</h1>
                            <p className="text-white/85 text-base">Together, these two impacts account for nearly 30% of all responses — directly threatening food security for the community.</p>
                        </div>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Responses', value: TOTAL.toLocaleString(), color: '#6b7280', bg: 'bg-gray-50', border: 'border-gray-200' },
                        { label: '#1 — Reduced Crop Yields', value: '436', color: '#b91c1c', bg: 'bg-red-50', border: 'border-red-200', sub: '15.9% of all responses' },
                        { label: '#2 — Prolonged Drought', value: '404', color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200', sub: '14.7% of all responses' },
                        { label: '#3 — Rainfall Changes', value: '392', color: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-200', sub: '14.3% of all responses' },
                    ].map(({ label, value, color, bg, border, sub }) => (
                        <div key={label} className={`${bg} border ${border} rounded-2xl p-5 shadow-sm`}>
                            <p className="text-2xl font-black" style={{ color }}>{value}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
                            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                        </div>
                    ))}
                </div>

                {/* Ranked horizontal bars — all 12 */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">What climate impacts worry people most?</h2>
                    <p className="text-sm text-gray-500 mb-6">All 12 climate impacts ranked by number of people who reported them. Longer bar = more people affected.</p>

                    <div className="space-y-3">
                        {impactTotals.map((d, i) => {
                            const pct = ((d.total / TOTAL) * 100).toFixed(1);
                            return (
                                <div key={d.impact} className="flex items-center gap-3">
                                    <div className="w-5 text-right text-xs font-bold text-gray-400 flex-shrink-0">#{i + 1}</div>
                                    <div className="w-36 flex-shrink-0">
                                        <p className="text-xs font-semibold text-gray-700 leading-tight">{d.short}</p>
                                    </div>
                                    <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden">
                                        <div
                                            className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                                            style={{ width: `${(d.total / impactTotals[0].total) * 100}%`, backgroundColor: d.color }}
                                        >
                                            <span className="text-white text-xs font-bold">{d.total}</span>
                                        </div>
                                    </div>
                                    <div className="w-10 text-right text-xs font-bold text-gray-500 flex-shrink-0">{pct}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Breakdown by group — top 6 only */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-1">Do different groups feel impacts differently?</h2>
                            <p className="text-sm text-gray-500">Top 6 impacts compared by gender and age group.</p>
                        </div>
                        <div className="flex gap-2">
                            {['gender', 'age'].map(v => (
                                <button key={v} onClick={() => setBreakdownView(v)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${breakdownView === v ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
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
                            data={breakdownView === 'gender' ? genderData : ageData}
                            layout="vertical"
                            margin={{ top: 5, right: 20, left: 70, bottom: 5 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 11 }} label={{ value: 'Number of people', position: 'insideBottom', offset: -3, style: { fontSize: 11, fill: '#9ca3af' } }} />
                            <YAxis dataKey="name" type="category" width={95} tick={{ fontSize: 11, fill: '#6b7280' }} />
                            <Tooltip content={<ImpactTooltip />} />
                            <Legend />
                            {breakdownView === 'gender' ? (
                                <>
                                    <Bar dataKey="Female" fill="#ec4899" radius={[0, 4, 4, 0]} name="Female" />
                                    <Bar dataKey="Male" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Male" />
                                </>
                            ) : (
                                <>
                                    <Bar dataKey="Adults" fill="#10b981" radius={[0, 4, 4, 0]} name="Adults" />
                                    <Bar dataKey="Elderly" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Elderly" />
                                    <Bar dataKey="Youth" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Youth" />
                                </>
                            )}
                        </BarChart>
                    </ChartContainer>

                    {breakdownView === 'age' && (
                        <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
                            <strong>Elderly report the most impacts:</strong> Across almost every category, elderly respondents report higher numbers — likely due to longer exposure to climate change over their lifetimes.
                        </div>
                    )}
                    {breakdownView === 'gender' && (
                        <div className="mt-5 p-3 bg-pink-50 rounded-xl border border-pink-100 text-sm text-pink-800">
                            <strong>Women report slightly more impacts:</strong> Female respondents consistently report higher numbers across top impacts, suggesting greater exposure or vulnerability.
                        </div>
                    )}
                </div>

                {/* Multi-line chart: top 6 impacts by gender */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Top impacts — Female vs Male, side by side</h2>
                    <p className="text-sm text-gray-500 mb-6">Each point on a line is one climate impact. The gap between the two lines shows where gender differences are largest.</p>
                    <ChartContainer config={{
                        Female: { color: '#ec4899' }, Male: { color: '#3b82f6' }
                    }} className="h-72">
                        <LineChart
                            data={TOP6.map(d => ({ name: d.short, Female: d.Female, Male: d.Male }))}
                            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} angle={-25} textAnchor="end" height={60} interval={0} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Responses', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#9ca3af' } }} />
                            <Tooltip formatter={(v, name) => [`${v} people`, name]} />
                            <Legend verticalAlign="top" />
                            <Line type="monotone" dataKey="Female" stroke="#ec4899" strokeWidth={3} dot={{ r: 6, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Male" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ChartContainer>
                </div>

                {/* Radar chart: all demographics across top 6 impacts */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Who feels which impact most? — Radar view</h2>
                    <p className="text-sm text-gray-500 mb-6">Each axis is a climate impact. The larger the shaded shape, the more that group reported that impact. Overlapping shapes show shared concerns.</p>
                    <ChartContainer config={{
                        Adults: { color: '#10b981' }, Elderly: { color: '#f59e0b' }, Youth: { color: '#8b5cf6' }
                    }} className="h-80">
                        <RadarChart
                            data={TOP6.map(d => ({ impact: d.short, Adults: d.Adults, Elderly: d.Elderly, Youth: d.Youth }))}
                            cx="50%" cy="50%" outerRadius="70%"
                        >
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="impact" tick={{ fontSize: 11, fill: '#6b7280' }} />
                            <PolarRadiusAxis tick={{ fontSize: 9 }} />
                            <Radar name="Adults" dataKey="Adults" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                            <Radar name="Elderly" dataKey="Elderly" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                            <Radar name="Youth" dataKey="Youth" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                            <Legend />
                            <Tooltip />
                        </RadarChart>
                    </ChartContainer>
                    <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
                        <strong>Elderly have the largest radar footprint:</strong> The elderly shape is consistently wider, meaning they report more of every impact — reflecting longer life exposure to climate change.
                    </div>
                </div>

                {/* Plain-English glossary */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">What do these impacts mean in plain language?</h2>
                    <p className="text-sm text-gray-500 mb-5">A simple explanation of the most common climate impacts reported.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {impactMeanings.map(({ icon: Icon, label, desc, color }) => (
                            <div key={label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                                    <Icon className="w-5 h-5" style={{ color }} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 mb-0.5">{label}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Takeaway */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-7">
                    <div className="flex items-start gap-4">
                        <Info className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Key Takeaway</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Food security is the central climate concern — reduced crop yields, drought, and rainfall changes together make up over 44% of all reported impacts. These are not abstract threats: they translate directly into less food on the table and rising prices. Adaptation efforts that protect agriculture and water access will have the greatest impact on this community.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClimateImpactsInfographic;
