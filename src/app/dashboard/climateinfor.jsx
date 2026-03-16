'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { CloudRain, Info } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const accessGroups = [
    { group: 'Adults',   yes: 54.5, no: 45.5, color: '#10b981', above50: true },
    { group: 'Elderly',  yes: 49.8, no: 50.2, color: '#f59e0b', above50: false },
    { group: 'Youth',    yes: 43.4, no: 56.6, color: '#8b5cf6', above50: false },
    { group: 'Female',   yes: 48.0, no: 52.0, color: '#ec4899', above50: false },
    { group: 'Male',     yes: 50.5, no: 49.5, color: '#3b82f6', above50: true },
];

const freqByGender = [
    { group: 'Female', Always: 26.7, Sometimes: 51.1, Rarely: 20.7, Never: 1.5 },
    { group: 'Male',   Always: 21.0, Sometimes: 61.6, Rarely: 16.7, Never: 0.7 },
];

const freqByAge = [
    { group: 'Adults',  Always: 19.0, Sometimes: 58.2, Rarely: 20.3, Never: 2.5 },
    { group: 'Elderly', Always: 25.8, Sometimes: 56.3, Rarely: 17.2, Never: 0.8 },
    { group: 'Youth',   Always: 25.8, Sometimes: 54.5, Rarely: 19.7, Never: 0.0 },
];

const FREQ_COLORS = { Always: '#059669', Sometimes: '#3b82f6', Rarely: '#f59e0b', Never: '#dc2626' };

const FreqTooltip = ({ active, payload, label }) => {
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
                    <span className="font-bold text-gray-900">{e.value}%</span>
                </div>
            ))}
        </div>
    );
};

const ClimateInfoAccessInfographic = () => {
    const [freqView, setFreqView] = useState('gender');

    const avgAccess = (accessGroups.reduce((s, d) => s + d.yes, 0) / accessGroups.length).toFixed(1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Insight banner */}
                <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl p-7 text-white shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <CloudRain className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-1">Key Finding</p>
                            <h1 className="text-2xl md:text-3xl font-black mb-2">Only 1 in 2 people can access climate information — youth are most left behind</h1>
                            <p className="text-white/85 text-base">Average access across all groups is {avgAccess}%. Youth have the lowest rate at 43.4% — more than half have no access at all.</p>
                        </div>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Avg Access Rate', value: `${avgAccess}%`, color: '#0284c7', bg: 'bg-blue-50', border: 'border-blue-200', sub: 'Across all 5 groups' },
                        { label: 'Highest — Adults', value: '54.5%', color: '#10b981', bg: 'bg-green-50', border: 'border-green-200', sub: 'Only group above 50%' },
                        { label: 'Lowest — Youth', value: '43.4%', color: '#8b5cf6', bg: 'bg-purple-50', border: 'border-purple-200', sub: '⚠ Most at risk' },
                        { label: 'Top Frequency', value: 'Sometimes', color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-200', sub: 'Most common across all groups' },
                    ].map(({ label, value, color, bg, border, sub }) => (
                        <div key={label} className={`${bg} border ${border} rounded-2xl p-5 shadow-sm`}>
                            <p className="text-2xl font-black leading-tight" style={{ color }}>{value}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
                            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                        </div>
                    ))}
                </div>

                {/* Access progress bars */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Do people have access to climate information?</h2>
                    <p className="text-sm text-gray-500 mb-6">Each bar shows the percentage of that group who answered "Yes, I have access." Green = above 50%, amber = below 50%.</p>

                    <div className="space-y-5">
                        {accessGroups.map(({ group, yes, no, color, above50 }) => (
                            <div key={group}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base" style={{ backgroundColor: color }}>
                                            {group[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{group}</p>
                                            <p className="text-xs text-gray-400">{above50 ? '✓ More than half have access' : '⚠ Less than half have access'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-black" style={{ color }}>{yes}%</span>
                                        <p className="text-xs text-gray-400">have access</p>
                                    </div>
                                </div>
                                <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 flex items-center"
                                        style={{ width: `${yes}%`, backgroundColor: color }}
                                    />
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="border-r-2 border-dashed border-gray-300 h-full" style={{ marginLeft: '50%' }} />
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs mt-1 text-gray-400">
                                    <span className="font-semibold" style={{ color }}>{yes}% — have access</span>
                                    <span className="text-gray-400 font-medium">50% line</span>
                                    <span className="font-semibold text-red-500">{no}% — no access</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-800">
                        <strong>Youth gap is significant:</strong> Youth access (43.4%) is 11 percentage points below adults (54.5%). Targeted outreach — through mobile, community radio, or schools — could close this gap.
                    </div>
                </div>

                {/* Line chart: access rate across groups */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Access rate across groups — line view</h2>
                    <p className="text-sm text-gray-500 mb-6">The 50% dashed line is the threshold. Groups above it have majority access; those below do not. The gap between Youth and Adults is the clearest story.</p>
                    <ChartContainer config={{ Access: { color: '#0284c7' }, Threshold: { color: '#dc2626' } }} className="h-64">
                        <LineChart
                            data={accessGroups.map(d => ({ group: d.group, 'Has Access': d.yes, 'No Access': d.no }))}
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="group" tick={{ fontSize: 12, fontWeight: 600, fill: '#374151' }} />
                            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v, name) => [`${v}%`, name]} />
                            <Legend verticalAlign="top" />
                            <Line type="monotone" dataKey="Has Access" stroke="#0284c7" strokeWidth={3} dot={{ r: 7, fill: '#0284c7', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 9 }} />
                            <Line type="monotone" dataKey="No Access" stroke="#dc2626" strokeWidth={3} strokeDasharray="5 3" dot={{ r: 7, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 9 }} />
                        </LineChart>
                    </ChartContainer>
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                        <strong>The two lines cross at Youth:</strong> Youth is the group where "No Access" overtakes "Has Access" by the largest margin — 56.6% vs 43.4%.
                    </div>
                </div>

                {/* Area chart: frequency breakdown stacked */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">How often do women vs men access climate info?</h2>
                    <p className="text-sm text-gray-500 mb-6">Stacked area chart — the total always adds to 100%. Compare how each frequency band (Always / Sometimes / Rarely / Never) stacks up between genders.</p>
                    <ChartContainer config={{
                        Always: { color: '#059669' }, Sometimes: { color: '#3b82f6' }, Rarely: { color: '#f59e0b' }, Never: { color: '#dc2626' }
                    }} className="h-64">
                        <AreaChart
                            data={[
                                { group: 'Female', Always: 26.7, Sometimes: 51.1, Rarely: 20.7, Never: 1.5 },
                                { group: 'Male', Always: 21.0, Sometimes: 61.6, Rarely: 16.7, Never: 0.7 },
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="group" tick={{ fontSize: 13, fontWeight: 600, fill: '#374151' }} />
                            <YAxis tickFormatter={v => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v, name) => [`${v}%`, name]} />
                            <Legend />
                            <Area type="monotone" dataKey="Always" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.8} name="Always" />
                            <Area type="monotone" dataKey="Sometimes" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} name="Sometimes" />
                            <Area type="monotone" dataKey="Rarely" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} name="Rarely" />
                            <Area type="monotone" dataKey="Never" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.8} name="Never" />
                        </AreaChart>
                    </ChartContainer>
                    <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800">
                        <strong>Women access more regularly:</strong> 26.7% of women say "Always" vs 21.0% of men. Men lean more toward "Sometimes" (61.6%).
                    </div>
                </div>

                {/* Frequency section */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-1">Among those with access — how often do they use it?</h2>
                            <p className="text-sm text-gray-500">Each bar adds up to 100%. The bigger the coloured section, the more people chose that answer.</p>
                        </div>
                        <div className="flex gap-2">
                            {['gender', 'age'].map(v => (
                                <button key={v} onClick={() => setFreqView(v)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${freqView === v ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                    By {v === 'gender' ? 'Gender' : 'Age Group'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Frequency legend */}
                    <div className="flex flex-wrap gap-4 mb-5 mt-3">
                        {Object.entries(FREQ_COLORS).map(([label, color]) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                                <span className="text-sm font-medium text-gray-600">
                                    {label === 'Always' ? '✓ Always (regular)' :
                                        label === 'Sometimes' ? '↻ Sometimes (occasional)' :
                                            label === 'Rarely' ? '↓ Rarely (infrequent)' : '✗ Never'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <ChartContainer config={{
                        Always: { color: '#059669' }, Sometimes: { color: '#3b82f6' },
                        Rarely: { color: '#f59e0b' }, Never: { color: '#dc2626' },
                    }} className="h-56">
                        <BarChart
                            data={freqView === 'gender' ? freqByGender : freqByAge}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                            <YAxis dataKey="group" type="category" width={55} tick={{ fontSize: 12, fontWeight: 600, fill: '#374151' }} />
                            <Tooltip content={<FreqTooltip />} />
                            <Bar dataKey="Always" stackId="a" fill={FREQ_COLORS.Always} name="Always" />
                            <Bar dataKey="Sometimes" stackId="a" fill={FREQ_COLORS.Sometimes} name="Sometimes" />
                            <Bar dataKey="Rarely" stackId="a" fill={FREQ_COLORS.Rarely} name="Rarely" />
                            <Bar dataKey="Never" stackId="a" fill={FREQ_COLORS.Never} name="Never" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>

                    <div className="mt-5 grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                            <strong>"Sometimes" dominates everywhere:</strong> More than half of every group accesses climate info only occasionally. Consistency is the biggest gap.
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800">
                            <strong>Youth never say "Never":</strong> 0% of youth say they never access climate info — the most hopeful signal in the data. They just need more frequent access.
                        </div>
                    </div>
                </div>

                {/* Takeaway */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-7">
                    <div className="flex items-start gap-4">
                        <Info className="w-7 h-7 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Key Takeaway</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Access to climate information is a challenge across all groups — only adults cross the 50% threshold. The good news: among those with access, the vast majority use it at least sometimes. The priority should be widening access, especially for youth, women, and the elderly, and then helping people move from "sometimes" to "regularly" engaging with climate information.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClimateInfoAccessInfographic;
