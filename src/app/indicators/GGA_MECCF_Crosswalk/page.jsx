'use client';
import React, { useState, useMemo } from 'react';
import {
    Link2,
    Layers,
    CheckCircle2,
    Circle,
    Clock,
    Landmark,
    Globe2,
    Users2,
    Info,
    MinusCircle,
} from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';
import crosswalkData from '../../../../data/data/gga-meccf-crosswalk.json';

const SOURCE_ICONS = {
    meccf: Landmark,
    gga: Globe2,
    fgd_hh: Users2,
};

const CLASSIFICATION_INFO = {
    Input: 'the resources put in (e.g. money, staff, equipment)',
    Output: 'the direct result produced by that work',
    Outcome: 'the change in behaviour or conditions that follows',
    Impact: 'the broader, longer-term effect',
};

const RELATIONSHIP_TEXT = {
    direct: 'Measures essentially the same thing as this GGA indicator.',
    partial: 'Related to this GGA indicator, but not a one-to-one match.',
};

export default function GgaMeccfCrosswalkPage() {
    const { meta, meccfIndicators, ggaIndicators } = crosswalkData;
    const [selectedId, setSelectedId] = useState(meccfIndicators[0]?.id);

    const ggaByCode = useMemo(() => {
        const map = {};
        ggaIndicators.forEach((g) => (map[g.code] = g));
        return map;
    }, [ggaIndicators]);

    // Distinct GGA codes actually referenced by MECCF links, in GGA sequence order
    const linkedCodes = useMemo(() => {
        const set = new Set();
        meccfIndicators.forEach((m) => m.links.forEach((l) => set.add(l.ggaCode)));
        return ggaIndicators.filter((g) => set.has(g.code)).map((g) => g.code);
    }, [meccfIndicators, ggaIndicators]);

    // Distinct GGA target areas touched (e.g. "Impact, Vulnerability & Risk Assessment")
    const targetAreasTouched = useMemo(() => {
        const set = new Set();
        linkedCodes.forEach((code) => set.add(ggaByCode[code].targetName));
        return Array.from(set);
    }, [linkedCodes, ggaByCode]);

    const linkedCount = meccfIndicators.filter((m) => m.links.length > 0).length;
    const totalLinks = meccfIndicators.reduce((sum, m) => sum + m.links.length, 0);
    const directLinks = meccfIndicators.reduce(
        (sum, m) => sum + m.links.filter((l) => l.relationship === 'direct').length,
        0
    );

    const selected = meccfIndicators.find((m) => m.id === selectedId) || meccfIndicators[0];

    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-lg border-b border-emerald-100 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                                <Link2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    {meta.title}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">{meta.subtitle}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-sm">
                            <span className="flex items-center gap-1.5 text-gray-700">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                {meccfIndicators.length} MECCF Priority Indicators
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1.5 text-gray-700">
                                <span className="w-2 h-2 bg-teal-500 rounded-full" />
                                {ggaIndicators.length} GGA Global Indicators
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1.5 text-gray-700">
                                <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                                {linkedCount} of {meccfIndicators.length} Linked to GGA
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1.5 text-amber-700">
                                <Clock className="w-3.5 h-3.5" />
                                FGD &amp; HH Indicators (Coming Soon)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* About / methodology banner */}
                    <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-4 sm:p-5 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Info className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            <strong className="text-gray-900">About this crosswalk:</strong> MECCF&apos;s{' '}
                            {meccfIndicators.length} priority indicators are linked below to the UNFCCC&apos;s{' '}
                            <strong>Global Goal on Adaptation</strong> 59-indicator framework, showing Kenya&apos;s
                            county-level priorities already positioned within it. Every source stays distinct and
                            traceable, and this is the harmonized view sitting on top, not a replacement, so FGD
                            &amp; household indicators can be added the same way later.
                        </p>
                    </div>

                    {/* Infographic stat row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <StatCard
                            icon={Landmark}
                            number={meccfIndicators.length}
                            label="MECCF Priority Indicators"
                            description="National &amp; county-level indicators defined for the 2026 reporting cycle."
                            color="from-emerald-500 to-teal-600"
                        />
                        <StatCard
                            icon={Link2}
                            number={`${linkedCount}/${meccfIndicators.length}`}
                            label="Linked to the GGA Framework"
                            description={`${totalLinks} total links (${directLinks} direct, ${totalLinks - directLinks} partial).`}
                            color="from-teal-500 to-cyan-600"
                        />
                        <StatCard
                            icon={Globe2}
                            number={targetAreasTouched.length}
                            label="GGA Target Areas Touched"
                            description={targetAreasTouched.join(', ')}
                            color="from-cyan-500 to-blue-600"
                        />
                        <StatCard
                            icon={Users2}
                            number="+"
                            label="FGD & Household Indicators"
                            description="Community-level indicators pending, to be added without replacing existing data."
                            color="from-amber-500 to-orange-500"
                            pending
                        />
                    </div>

                    {/* Cross-relation matrix */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                        <div className="p-6 border-b border-emerald-100 flex items-start justify-between flex-wrap gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-emerald-600" />
                                    Cross-Relation Matrix
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Every MECCF indicator (rows) against the GGA indicators it links to (columns).
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direct link
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Circle className="w-4 h-4 text-teal-400" /> Partial link
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MinusCircle className="w-4 h-4 text-gray-300" /> No link
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-emerald-50">
                                        <th className="sticky left-0 bg-emerald-50 px-4 py-3 text-left font-bold text-gray-700 border-r border-emerald-100 min-w-[220px]">
                                            MECCF Indicator
                                        </th>
                                        {linkedCodes.map((code) => (
                                            <th
                                                key={code}
                                                title={ggaByCode[code].text}
                                                className="px-3 py-3 text-center font-bold text-emerald-700 whitespace-nowrap border-l border-emerald-100"
                                            >
                                                {code}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {meccfIndicators.map((m, idx) => (
                                        <tr
                                            key={m.id}
                                            className={`${idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/40'} hover:bg-emerald-100/50 transition-colors`}
                                        >
                                            <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-gray-800 border-r border-emerald-100 min-w-[220px]">
                                                {m.name}
                                                {m.outOfGgaScope && (
                                                    <span className="block text-[11px] text-amber-600 font-normal mt-0.5">
                                                        Mitigation indicator, outside GGA (adaptation-only) scope
                                                    </span>
                                                )}
                                            </td>
                                            {linkedCodes.map((code) => {
                                                const link = m.links.find((l) => l.ggaCode === code);
                                                return (
                                                    <td key={code} className="px-3 py-3 text-center border-l border-emerald-100">
                                                        {link ? (
                                                            link.relationship === 'direct' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 text-teal-400 mx-auto" />
                                                            )
                                                        ) : (
                                                            <MinusCircle className="w-4 h-4 text-gray-200 mx-auto" />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detail selector */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                            <Landmark className="w-5 h-5 text-emerald-600" />
                            MECCF Indicator Details &amp; GGA Alignment
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Pick an indicator on the left to see, in plain language, what it measures and how it
                            connects to the global framework.
                        </p>
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 overflow-hidden grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                            {/* Indicator selector list */}
                            <div className="border-b lg:border-b-0 lg:border-r border-emerald-100 bg-emerald-50/40">
                                {meccfIndicators.map((m) => {
                                    const isActive = m.id === selected.id;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedId(m.id)}
                                            className={`w-full text-left px-4 py-2.5 border-b border-emerald-100/70 last:border-b-0 border-l-4 transition-colors ${
                                                isActive
                                                    ? 'bg-white border-l-emerald-600 shadow-inner'
                                                    : 'border-l-transparent hover:bg-white/70'
                                            }`}
                                        >
                                            <span
                                                className={`text-[10px] font-bold uppercase tracking-wide ${
                                                    m.outOfGgaScope ? 'text-amber-600' : isActive ? 'text-emerald-600' : 'text-gray-400'
                                                }`}
                                            >
                                                {m.outOfGgaScope
                                                    ? 'Mitigation · no GGA link'
                                                    : `${m.links.length} GGA link${m.links.length !== 1 ? 's' : ''}`}
                                            </span>
                                            <p
                                                className={`text-sm leading-snug mt-0.5 ${
                                                    isActive ? 'font-bold text-gray-900' : 'text-gray-700'
                                                }`}
                                            >
                                                {m.name}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Detail panel */}
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center gap-2 flex-wrap mb-3">
                                    {selected.classification.map((c) => (
                                        <span
                                            key={c}
                                            title={CLASSIFICATION_INFO[c] ? `${c} = ${CLASSIFICATION_INFO[c]}` : undefined}
                                            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 cursor-help"
                                        >
                                            {c}
                                        </span>
                                    ))}
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                                        {selected.thematicArea}
                                    </span>
                                    {selected.outOfGgaScope && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                                            Outside GGA scope
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 text-base mb-1">{selected.name}</h3>
                                {selected.classification[0] && CLASSIFICATION_INFO[selected.classification[0]] && (
                                    <p className="text-xs text-gray-400 mb-3">
                                        {selected.classification[0]} indicator: {CLASSIFICATION_INFO[selected.classification[0]]}.
                                    </p>
                                )}

                                {selected.plainSummary && (
                                    <p className="text-sm text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 leading-relaxed">
                                        {selected.plainSummary}
                                    </p>
                                )}

                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    How it&apos;s formally measured
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                    <Field label="What is counted" sublabel="Numerator" value={selected.numerator} />
                                    <Field label="Out of what total" sublabel="Denominator" value={selected.denominator} />
                                    <Field label="Reported as" sublabel="Unit" value={selected.unit} />
                                </div>
                                {selected.rawClassification && (
                                    <p className="text-[11px] text-gray-400 mb-5">
                                        Indicator Classification, as checked in the source document:{' '}
                                        <span className="font-mono">{selected.rawClassification}</span>
                                    </p>
                                )}

                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    How this connects to the global framework
                                </h4>
                                {selected.links.length === 0 ? (
                                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        {selected.scopeNote}
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {selected.links.map((l) => {
                                            const gga = ggaByCode[l.ggaCode];
                                            return (
                                                <div
                                                    key={l.ggaCode}
                                                    className="flex items-start gap-3 bg-teal-50/60 border border-teal-100 rounded-xl p-3"
                                                >
                                                    {l.relationship === 'direct' ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs font-bold text-teal-700 bg-white border border-teal-200 rounded-full px-2 py-0.5">
                                                                GGA {gga.code}
                                                            </span>
                                                            <span className="text-xs text-gray-500">{gga.targetName}</span>
                                                        </div>
                                                        <p className="text-xs font-semibold text-gray-500 mt-1.5">
                                                            {RELATIONSHIP_TEXT[l.relationship]}
                                                        </p>
                                                        <p className="text-sm text-gray-800 mt-1">{gga.text}</p>
                                                        <p className="text-xs text-gray-500 mt-1 italic">Why: {l.note}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Source provenance */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-emerald-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Data Sources</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Each source stays distinct and traceable; nothing here is merged away.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {meta.sources.map((s) => {
                                const Icon = SOURCE_ICONS[s.id] || Info;
                                const isPending = s.status === 'pending';
                                return (
                                    <div
                                        key={s.id}
                                        className={`rounded-xl p-4 border ${isPending ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon className={`w-4 h-4 ${isPending ? 'text-amber-600' : 'text-emerald-600'}`} />
                                            <span className="font-bold text-sm text-gray-900">{s.label}</span>
                                            <span
                                                className={`ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}
                                            >
                                                {isPending ? 'Pending' : `${s.count} indicators`}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed">{s.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <LamaFooter />
        </>
    );
}

function StatCard({ icon: Icon, number, label, description, color, pending }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-md flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                    <div className="text-2xl font-black text-gray-900">{number}</div>
                    <div className="text-sm font-bold text-gray-800 mt-0.5">{label}</div>
                    <p
                        className="text-xs text-gray-500 mt-1 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                    {pending && (
                        <span className="inline-block mt-2 text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Coming soon
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, sublabel, value }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                {label}
                {sublabel && <span className="font-normal normal-case text-gray-400"> ({sublabel})</span>}
            </div>
            <div className="text-sm text-gray-800 leading-relaxed">{value}</div>
        </div>
    );
}
