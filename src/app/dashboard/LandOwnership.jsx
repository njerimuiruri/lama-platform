'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Home, Users, AlertTriangle, TrendingUp } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const ownershipByGender = [
    { group: 'Female', owns: 91.1, doesnt: 8.9, ownsCount: 256, doesntCount: 25, total: 281 },
    { group: 'Male', owns: 91.6, doesnt: 8.4, ownsCount: 250, doesntCount: 23, total: 273 },
];

const ownershipByAge = [
    { group: 'Adults', owns: 92.4, doesnt: 7.6, ownsCount: 134, doesntCount: 11, total: 145 },
    { group: 'Elderly', owns: 96.9, doesnt: 3.1, ownsCount: 249, doesntCount: 8, total: 257 },
    { group: 'Youth', owns: 80.9, doesnt: 19.1, ownsCount: 123, doesntCount: 29, total: 152 },
];

const landSizeByGender = [
    { size: 'Below 1 acre\n(very small)', Female: 113, Male: 93, FemaleP: 40.2, MaleP: 34.1 },
    { size: '1–5 acres\n(small–medium)', Female: 125, Male: 133, FemaleP: 44.5, MaleP: 48.7 },
    { size: '6–10 acres\n(medium–large)', Female: 13, Male: 22, FemaleP: 4.6, MaleP: 8.1 },
    { size: '11–15 acres\n(large)', Female: 5, Male: 2, FemaleP: 1.8, MaleP: 0.7 },
];

const landSizeByAge = [
    { size: 'Below 1 acre\n(very small)', Adults: 51, Elderly: 96, Youth: 59, AP: 35.2, EP: 37.4, YP: 38.8 },
    { size: '1–5 acres\n(small–medium)', Adults: 74, Elderly: 126, Youth: 58, AP: 51.0, EP: 49.0, YP: 38.2 },
    { size: '6–10 acres\n(medium–large)', Adults: 6, Elderly: 24, Youth: 5, AP: 4.1, EP: 9.3, YP: 3.3 },
    { size: '11–15 acres\n(large)', Adults: 3, Elderly: 3, Youth: 1, AP: 2.1, EP: 1.2, YP: 0.7 },
];

// ── Tooltip ───────────────────────────────────────────────────────────────────
const SizeTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl text-sm min-w-[180px]">
            <p className="font-bold text-gray-800 mb-2 border-b pb-1">{label?.replace('\n', ' ')}</p>
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

// ── Ownership row ─────────────────────────────────────────────────────────────
const OwnershipBar = ({ group, owns, doesnt, color, warning }) => (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    <span className="text-lg font-black" style={{ color }}>{group[0]}</span>
                </div>
                <span className="font-bold text-gray-900">{group}</span>
                {warning && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3" /> Most at risk
                    </span>
                )}
            </div>
            <div className="text-right">
                <span className="text-2xl font-black" style={{ color }}>{owns}%</span>
                <p className="text-xs text-gray-400 font-medium">own land</p>
            </div>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${owns}%`, backgroundColor: color }} />
        </div>
        <div className="flex justify-between text-xs mt-2 text-gray-500">
            <span className="text-green-700 font-semibold">{owns}% own land</span>
            <span className="text-red-600 font-semibold">{doesnt}% don&apos;t own land</span>
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const LandOwnership = () => {
    const [sizeView, setSizeView] = useState('gender');

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Insight banner */}
                <div className="bg-gradient-to-r from-[#0d9c5a] to-emerald-600 rounded-2xl p-7 text-white shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Home className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-1">Key Finding</p>
                            <h1 className="text-2xl md:text-3xl font-black mb-2">9 out of 10 people own land — but young farmers face a gap</h1>
                            <p className="text-white/85 text-base">Overall land ownership is high at 91.3%, but youth are significantly behind — 1 in 5 young people has no land at all.</p>
                        </div>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Respondents', value: '554', icon: Users, color: '#6b7280', bg: 'bg-gray-50', border: 'border-gray-200' },
                        { label: 'Own Land', value: '91.3%', icon: Home, color: '#16a34a', bg: 'bg-green-50', border: 'border-green-200', sub: '506 people' },
                        { label: "Don't Own Land", value: '8.7%', icon: AlertTriangle, color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200', sub: '48 people' },
                        { label: 'Youth Ownership', value: '80.9%', icon: TrendingUp, color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200', sub: 'Lowest of all groups' },
                    ].map(({ label, value, icon: Icon, color, bg, border, sub }) => (
                        <div key={label} className={`${bg} border ${border} rounded-2xl p-5 shadow-sm`}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20` }}>
                                <Icon className="w-5 h-5" style={{ color }} />
                            </div>
                            <p className="text-2xl font-black" style={{ color }}>{value}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
                            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                        </div>
                    ))}
                </div>

                {/* Who owns land */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Who owns land?</h2>
                    <p className="text-sm text-gray-500 mb-7">Hover over each bar to see the exact numbers. Green = owns land.</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* By Gender */}
                        <div>
                            <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-5 bg-pink-500 rounded-full" />
                                By Gender
                            </h3>
                            <div className="space-y-4">
                                {ownershipByGender.map(d => (
                                    <OwnershipBar key={d.group} group={d.group} owns={d.owns} doesnt={d.doesnt} color={d.group === 'Female' ? '#ec4899' : '#3b82f6'} />
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800">
                                <strong>Gender gap is tiny:</strong> Female (91.1%) and Male (91.6%) ownership rates are nearly identical.
                            </div>
                        </div>

                        {/* By Age */}
                        <div>
                            <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-5 bg-purple-500 rounded-full" />
                                By Age Group
                            </h3>
                            <div className="space-y-4">
                                {ownershipByAge.map(d => (
                                    <OwnershipBar
                                        key={d.group}
                                        group={d.group}
                                        owns={d.owns}
                                        doesnt={d.doesnt}
                                        color={d.group === 'Adults' ? '#10b981' : d.group === 'Elderly' ? '#f59e0b' : '#8b5cf6'}
                                        warning={d.group === 'Youth'}
                                    />
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
                                <strong>Youth are most at risk:</strong> 19.1% of young people own no land — more than double the adult rate (7.6%).
                            </div>
                        </div>
                    </div>
                </div>

                {/* How much land */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-1">How much land do people own?</h2>
                            <p className="text-sm text-gray-500">The size of land people own, broken down by group.</p>
                        </div>
                        <div className="flex gap-2">
                            {['gender', 'age'].map(v => (
                                <button key={v} onClick={() => setSizeView(v)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${sizeView === v ? 'bg-[#0d9c5a] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                    By {v === 'gender' ? 'Gender' : 'Age Group'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ChartContainer config={{
                        Female: { color: '#ec4899' }, Male: { color: '#3b82f6' },
                        Adults: { color: '#10b981' }, Elderly: { color: '#f59e0b' }, Youth: { color: '#8b5cf6' },
                    }} className="h-72">
                        <BarChart
                            data={sizeView === 'gender' ? landSizeByGender : landSizeByAge}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tickFormatter={v => `${v}`} tick={{ fontSize: 11 }} />
                            <YAxis dataKey="size" type="category" width={120} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={v => v.replace('\n', ' ')} />
                            <Tooltip content={<SizeTooltip />} />
                            <Legend />
                            {sizeView === 'gender' ? (
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

                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                        <strong>Most common land size:</strong> 1–5 acres. Small plots (below 1 acre) are the second most common, affecting roughly 37% of landowners.
                    </div>
                </div>

                {/* Line chart: ownership rates across all groups */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Ownership rate at a glance — all groups compared</h2>
                    <p className="text-sm text-gray-500 mb-6">Each point is a demographic group. The line shows how ownership % changes — the dip at Youth stands out clearly.</p>
                    <ChartContainer config={{
                        rate: { color: '#16a34a' },
                    }} className="h-64">
                        <LineChart
                            data={[
                                { group: 'Female', rate: 91.1 },
                                { group: 'Male', rate: 91.6 },
                                { group: 'Adults', rate: 92.4 },
                                { group: 'Elderly', rate: 96.9 },
                                { group: 'Youth', rate: 80.9 },
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="group" tick={{ fontSize: 12, fontWeight: 600, fill: '#374151' }} />
                            <YAxis domain={[75, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v) => [`${v}%`, 'Own land']} />
                            <Line type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={3} dot={{ r: 6, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} name="Ownership %" />
                        </LineChart>
                    </ChartContainer>
                </div>

                {/* Radar chart: land size distribution by age */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Land size profile — how do age groups compare?</h2>
                    <p className="text-sm text-gray-500 mb-6">Each axis is a land size category. The bigger the shaded area, the more people in that group fall in that size range.</p>
                    <ChartContainer config={{
                        Adults: { color: '#10b981' }, Elderly: { color: '#f59e0b' }, Youth: { color: '#8b5cf6' },
                    }} className="h-80">
                        <RadarChart
                            data={[
                                { category: 'Below 1 acre', Adults: 35.2, Elderly: 37.4, Youth: 38.8 },
                                { category: '1–5 acres', Adults: 51.0, Elderly: 49.0, Youth: 38.2 },
                                { category: '6–10 acres', Adults: 4.1, Elderly: 9.3, Youth: 3.3 },
                                { category: '11–15 acres', Adults: 2.1, Elderly: 1.2, Youth: 0.7 },
                            ]}
                            cx="50%" cy="50%" outerRadius="70%"
                        >
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 60]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} />
                            <Radar name="Adults" dataKey="Adults" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                            <Radar name="Elderly" dataKey="Elderly" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} strokeWidth={2} />
                            <Radar name="Youth" dataKey="Youth" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                            <Legend />
                            <Tooltip formatter={(v) => [`${v}%`]} />
                        </RadarChart>
                    </ChartContainer>
                    <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-800">
                        <strong>Youth cluster in smaller plots:</strong> Youth have the lowest share of 1–5 acre plots (38.2%) and the highest share of below-1-acre plots (38.8%), indicating less access to mid-size land.
                    </div>
                </div>

                {/* Takeaway */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-7">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-7 h-7 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Key Takeaway</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Most people in this community own land, which is a positive sign. However, <strong>young people are significantly less likely to own land</strong> — 1 in 5 youth (19.1%) owns no land at all, compared to just 1 in 13 elderly people (3.1%). Land ownership among youth deserves focused policy attention.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LandOwnership;
