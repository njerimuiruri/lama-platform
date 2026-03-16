'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Leaf, TrendingUp, ShoppingCart, Info } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const byGender = [
    { group: 'Female', Subsistence: 169, Both: 100, Commercial: 12, SubP: 60.1, BothP: 35.6, ComP: 4.3 },
    { group: 'Male', Subsistence: 149, Both: 101, Commercial: 23, SubP: 54.6, BothP: 37.0, ComP: 8.4 },
];

const byAge = [
    { group: 'Adults', Subsistence: 81, Both: 53, Commercial: 11, SubP: 55.9, BothP: 36.6, ComP: 7.6 },
    { group: 'Elderly', Subsistence: 158, Both: 87, Commercial: 12, SubP: 61.5, BothP: 33.9, ComP: 4.7 },
    { group: 'Youth', Subsistence: 79, Both: 61, Commercial: 12, SubP: 52.0, BothP: 40.1, ComP: 7.9 },
];

const COLORS = { Subsistence: '#7c3aed', Both: '#059669', Commercial: '#dc2626' };

const FarmingTooltip = ({ active, payload, label }) => {
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

// ── Type Summary Cards ────────────────────────────────────────────────────────
const typeCards = [
    {
        key: 'Subsistence',
        label: 'Subsistence Farming',
        sublabel: 'Grow food to eat at home',
        count: 318,
        percent: 57.4,
        color: '#7c3aed',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: Leaf,
        rank: '#1 Most Common',
        description: 'People grow food mainly for their own household. Selling is not the goal — feeding the family is.',
    },
    {
        key: 'Both',
        label: 'Both Types',
        sublabel: 'Grow food and sell some',
        count: 201,
        percent: 36.3,
        color: '#059669',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: TrendingUp,
        rank: '#2',
        description: 'These farmers grow food for the family AND sell some produce. They balance both goals.',
    },
    {
        key: 'Commercial',
        label: 'Commercial Farming',
        sublabel: 'Grow food mainly to sell',
        count: 35,
        percent: 6.3,
        color: '#dc2626',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: ShoppingCart,
        rank: 'Least Common',
        description: 'A small number farm primarily to generate income. This is the least common approach in this community.',
    },
];

// ── Main Component ────────────────────────────────────────────────────────────
const FarmingSystems = () => {
    const [breakdownView, setBreakdownView] = useState('gender');

    const chartData = breakdownView === 'gender' ? byGender : byAge;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Insight banner */}
                <div className="bg-gradient-to-r from-[#7c3aed] to-purple-700 rounded-2xl p-7 text-white shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Leaf className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-1">Key Finding</p>
                            <h1 className="text-2xl md:text-3xl font-black mb-2">Most people grow food for themselves — very few farm commercially</h1>
                            <p className="text-white/85 text-base">Over half the community practises subsistence farming. Only 6% farm primarily for commercial income.</p>
                        </div>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Respondents', value: '554', color: '#6b7280', bg: 'bg-gray-50', border: 'border-gray-200' },
                        { label: 'Subsistence Farmers', value: '57.4%', color: '#7c3aed', bg: 'bg-purple-50', border: 'border-purple-200', sub: '318 people' },
                        { label: 'Mixed (Both)', value: '36.3%', color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200', sub: '201 people' },
                        { label: 'Commercial Only', value: '6.3%', color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200', sub: '35 people — least common' },
                    ].map(({ label, value, color, bg, border, sub }) => (
                        <div key={label} className={`${bg} border ${border} rounded-2xl p-5 shadow-sm`}>
                            <p className="text-2xl font-black" style={{ color }}>{value}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
                            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                        </div>
                    ))}
                </div>

                {/* Farming type summary */}
                <div>
                    <h2 className="text-xl font-black text-gray-900 mb-1">What type of farming do people practise?</h2>
                    <p className="text-sm text-gray-500 mb-5">Three types of farming are used in this community. Here is how they compare.</p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {typeCards.map(({ key, label, sublabel, count, percent, color, bg, border, icon: Icon, rank, description }) => (
                            <div key={key} className={`${bg} border-2 ${border} rounded-2xl p-6 shadow-sm`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                                        <Icon className="w-6 h-6" style={{ color }} />
                                    </div>
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{rank}</span>
                                </div>
                                <p className="text-3xl font-black mb-0.5" style={{ color }}>{count}</p>
                                <p className="text-xs text-gray-400 font-medium mb-3">{percent}% of all respondents</p>
                                <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
                                <p className="text-xs text-gray-500 italic mb-3">{sublabel}</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                                <div className="mt-4 h-2 bg-white rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut chart: overall farming split */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">Overall farming type split</h2>
                    <p className="text-sm text-gray-500 mb-4">The donut shows the share of each farming type across all 554 respondents.</p>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <ChartContainer config={{
                            Subsistence: { color: '#7c3aed' }, Both: { color: '#059669' }, Commercial: { color: '#dc2626' }
                        }} className="h-64 w-full md:w-64 flex-shrink-0">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Subsistence', value: 57.4, color: '#7c3aed' },
                                        { name: 'Both Types', value: 36.3, color: '#059669' },
                                        { name: 'Commercial', value: 6.3, color: '#dc2626' },
                                    ]}
                                    cx="50%" cy="50%"
                                    innerRadius="55%" outerRadius="80%"
                                    dataKey="value"
                                    startAngle={90} endAngle={-270}
                                >
                                    {[
                                        { name: 'Subsistence', value: 57.4, color: '#7c3aed' },
                                        { name: 'Both Types', value: 36.3, color: '#059669' },
                                        { name: 'Commercial', value: 6.3, color: '#dc2626' },
                                    ].map((d, i) => <Cell key={i} fill={d.color} stroke="white" strokeWidth={3} />)}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v}%`]} />
                            </PieChart>
                        </ChartContainer>
                        <div className="space-y-4 flex-1">
                            {[
                                { name: 'Subsistence', pct: 57.4, color: '#7c3aed', desc: 'Grow food for home use' },
                                { name: 'Both Types', pct: 36.3, color: '#059669', desc: 'Grow for home + sell some' },
                                { name: 'Commercial', pct: 6.3, color: '#dc2626', desc: 'Grow mainly to sell' },
                            ].map(d => (
                                <div key={d.name} className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-bold text-gray-800">{d.name}</span>
                                            <span className="text-sm font-black" style={{ color: d.color }}>{d.pct}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{d.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Multi-line chart: farming type % trend across age groups */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-1">How does age shift farming type choices?</h2>
                    <p className="text-sm text-gray-500 mb-6">Each line tracks how the % for one farming type changes across age groups. See where the lines cross — that's where priorities shift.</p>
                    <ChartContainer config={{
                        Subsistence: { color: '#7c3aed' }, Both: { color: '#059669' }, Commercial: { color: '#dc2626' }
                    }} className="h-64">
                        <LineChart
                            data={[
                                { group: 'Adults', Subsistence: 55.9, Both: 36.6, Commercial: 7.6 },
                                { group: 'Elderly', Subsistence: 61.5, Both: 33.9, Commercial: 4.7 },
                                { group: 'Youth', Subsistence: 52.0, Both: 40.1, Commercial: 7.9 },
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="group" tick={{ fontSize: 13, fontWeight: 600, fill: '#374151' }} />
                            <YAxis tickFormatter={v => `${v}%`} domain={[0, 70]} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v, name) => [`${v}%`, name]} />
                            <Legend />
                            <Line type="monotone" dataKey="Subsistence" stroke="#7c3aed" strokeWidth={3} dot={{ r: 6, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }} name="Subsistence" />
                            <Line type="monotone" dataKey="Both" stroke="#059669" strokeWidth={3} dot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }} name="Both Types" />
                            <Line type="monotone" dataKey="Commercial" stroke="#dc2626" strokeWidth={3} dot={{ r: 6, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }} name="Commercial" />
                        </LineChart>
                    </ChartContainer>
                    <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-sm text-emerald-800">
                        <strong>The "Both" line rises with youth:</strong> Youth are the most likely to combine subsistence and commercial farming (40.1%), while Elderly rely most heavily on subsistence (61.5%).
                    </div>
                </div>

                {/* Breakdown by group */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-1">Does demographic affect farming choice?</h2>
                            <p className="text-sm text-gray-500">Compare farming types across gender and age groups.</p>
                        </div>
                        <div className="flex gap-2">
                            {['gender', 'age'].map(v => (
                                <button key={v} onClick={() => setBreakdownView(v)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${breakdownView === v ? 'bg-[#0d9c5a] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                    By {v === 'gender' ? 'Gender' : 'Age Group'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ChartContainer config={{
                        Subsistence: { color: '#7c3aed' }, Both: { color: '#059669' }, Commercial: { color: '#dc2626' }
                    }} className="h-72">
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="group" tick={{ fontSize: 13, fontWeight: 600, fill: '#374151' }} />
                            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Number of people', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: '#9ca3af' } }} />
                            <Tooltip content={<FarmingTooltip />} />
                            <Legend />
                            <Bar dataKey="Subsistence" fill={COLORS.Subsistence} radius={[4, 4, 0, 0]} name="Subsistence (for home)" />
                            <Bar dataKey="Both" fill={COLORS.Both} radius={[4, 4, 0, 0]} name="Both types" />
                            <Bar dataKey="Commercial" fill={COLORS.Commercial} radius={[4, 4, 0, 0]} name="Commercial (to sell)" />
                        </BarChart>
                    </ChartContainer>

                    {/* Insight notes per view */}
                    {breakdownView === 'gender' && (
                        <div className="mt-5 grid md:grid-cols-2 gap-4">
                            <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 text-sm text-pink-800">
                                <strong>Women lean more toward subsistence:</strong> 60.1% of female respondents practise subsistence farming vs 54.6% of males.
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                                <strong>Men are more likely to farm commercially:</strong> 8.4% of males farm commercially vs 4.3% of females — nearly double.
                            </div>
                        </div>
                    )}
                    {breakdownView === 'age' && (
                        <div className="mt-5 grid md:grid-cols-2 gap-4">
                            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-sm text-purple-800">
                                <strong>Youth most likely to do both:</strong> 40.1% of youth practise both farming types — the highest across all age groups. This may signal a move toward commercial activity.
                            </div>
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800">
                                <strong>Elderly rely most on subsistence:</strong> 61.5% of elderly respondents grow food for home use — the highest subsistence rate of any age group.
                            </div>
                        </div>
                    )}
                </div>

                {/* Takeaway */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-2 border-purple-200 rounded-2xl p-7">
                    <div className="flex items-start gap-4">
                        <Info className="w-7 h-7 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Key Takeaway</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Subsistence farming — growing food for personal use — is the backbone of this community's food system. Very few people farm commercially. Youth are most likely to combine both types (40.1%), which may indicate a gradual shift toward income-generating agriculture. Supporting this transition with training and market access could have a big impact.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FarmingSystems;
