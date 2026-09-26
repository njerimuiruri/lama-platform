'use client';
import React from 'react';
import { Lightbulb, Clock } from 'lucide-react';
import { ChartCard, Legend, BarRows, GroupedBarRows, StackedRows, Tip } from './charts';
import {
    RESPONDENTS, GROUPINGS, BRAND, ORDINAL_3, ORDINAL_4, overall,
    landOwnership, landSize, landSizeBands, farming, farmingTypes,
    prioritySectors, climateImpacts, mentionShares, climateInfoAccess, infoFrequency, infoFrequencyLevels,
} from '../surveyData';

const pct = (v) => `${Math.round(v)}%`;
const pct1 = (v) => `${v.toFixed(1)}%`;
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// "Youth are least likely to …" style comparison between the highest and lowest group
function compareSentence(values, action) {
    const sorted = [...values].sort((a, b) => a.value - b.value);
    const lo = sorted[0];
    const hi = sorted[sorted.length - 1];
    if (hi.value - lo.value < 3) {
        const names = values.map((v, i) => (i === 0 ? v.label : lower(v.label))).join(' and ');
        return `${names} ${action} at almost the same rate (${values.map(v => pct(v.value)).join(' vs ')}).`;
    }
    return `${lo.label} are least likely to ${action} — ${pct(lo.value)}, compared with ${pct(hi.value)} of ${lower(hi.label)}.`;
}

/* ─────────────────────────────────────────────
   Shared layout pieces
───────────────────────────────────────────── */
export function KeyFinding({ stat, statLabel, finding, detail }) {
    return (
        <div className="rounded-2xl bg-gray-900 text-white px-5 py-4 sm:px-6 sm:py-5 grid sm:grid-cols-[auto_1fr] gap-3 sm:gap-6 items-center">
            <div>
                <p className="text-4xl font-bold leading-none">{stat}</p>
                <p className="text-xs text-gray-400 mt-1.5 max-w-[11rem]">{statLabel}</p>
            </div>
            <div className="sm:border-l sm:border-white/10 sm:pl-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Key finding</p>
                <p className="text-base sm:text-lg font-semibold leading-snug">{finding}</p>
                {detail && <p className="text-sm text-gray-400 mt-1">{detail}</p>}
            </div>
        </div>
    );
}

export function Takeaway({ children }) {
    return (
        <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-semibold text-gray-900">What this means</p>
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{children}</p>
            </div>
        </div>
    );
}

function groupLegend(groups, highlight, onHighlight) {
    return (
        <Legend
            items={groups.map(g => ({ key: g.key, label: g.label, color: g.color, sub: `n=${g.n}` }))}
            highlight={highlight}
            onHighlight={onHighlight}
        />
    );
}

/* ─────────────────────────────────────────────
   Land ownership
───────────────────────────────────────────── */
export function LandTopic({ grouping, highlight, onHighlight }) {
    const groups = GROUPINGS[grouping].groups;
    const rates = groups.map(g => {
        const { owns, total } = landOwnership[g.key];
        return { ...g, owns, total, value: (owns / total) * 100 };
    });

    const sizeRows = groups.map(g => {
        const counts = landSize[g.key];
        const owners = counts.reduce((a, b) => a + b, 0);
        return {
            key: g.key,
            label: g.label,
            sub: `${owners} landowners`,
            dimmed: highlight && highlight !== g.key,
            segments: landSizeBands.map((band, i) => ({
                key: band,
                label: band,
                value: (counts[i] / owners) * 100,
                color: ORDINAL_4[i],
                tip: <Tip title={`${g.label} · ${band}`} lines={[`${counts[i]} of ${owners} landowners`, pct1((counts[i] / owners) * 100)]} />,
            })),
        };
    });

    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overall.landOwnersPct)}
                statLabel={`of the ${RESPONDENTS} people surveyed own land`}
                finding={compareSentence(rates, 'own land')}
                detail="Most landowners hold small plots — under 5 acres."
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <ChartCard
                    title="Who owns land?"
                    subtitle={`Share of each ${lower(GROUPINGS[grouping].label)} that owns land`}
                    legend={groupLegend(groups, highlight, onHighlight)}
                    table={{
                        columns: ['Group', 'Own land', 'Surveyed', 'Share'],
                        rows: rates.map(r => [r.label, r.owns, r.total, pct1(r.value)]),
                    }}
                >
                    <BarRows
                        rows={rates.map(r => ({
                            key: r.key,
                            label: r.label,
                            sub: `${r.total} people`,
                            value: r.value,
                            color: r.color,
                            dimmed: highlight && highlight !== r.key,
                            tip: <Tip title={r.label} lines={[`${r.owns} of ${r.total} own land`, pct1(r.value)]} />,
                        }))}
                    />
                </ChartCard>

                <ChartCard
                    title="How much land do owners have?"
                    subtitle="Farm size among landowners"
                    legend={<Legend items={landSizeBands.map((b, i) => ({ key: b, label: b, color: ORDINAL_4[i] }))} />}
                    table={{
                        columns: ['Group', ...landSizeBands],
                        rows: sizeRows.map(r => [r.label, ...r.segments.map(s => pct1(s.value))]),
                    }}
                >
                    <StackedRows rows={sizeRows} />
                </ChartCard>
            </div>
            <Takeaway>
                Land ownership is high across the community, but young people are the most likely to be left out — and most
                farms are small. Adaptation support that assumes large or secure landholdings may miss youth and smallholders.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Farming systems
───────────────────────────────────────────── */
export function FarmingTopic({ grouping, highlight, onHighlight }) {
    const groups = GROUPINGS[grouping].groups;
    const rows = groups.map(g => {
        const counts = farming[g.key];
        const total = farmingTypes.reduce((s, t) => s + counts[t.key], 0);
        return {
            key: g.key,
            label: g.label,
            sub: `${total} people`,
            total,
            dimmed: highlight && highlight !== g.key,
            segments: farmingTypes.map((t, i) => ({
                key: t.key,
                label: t.label,
                value: (counts[t.key] / total) * 100,
                color: ORDINAL_3[i],
                tip: <Tip title={`${g.label} · ${t.label}`} lines={[`${counts[t.key]} of ${total} people`, pct1((counts[t.key] / total) * 100)]} />,
            })),
        };
    });

    const commercial = rows.map(r => ({ label: r.label, value: r.segments[2].value }));
    const sorted = [...commercial].sort((a, b) => a.value - b.value);
    const lo = sorted[0];
    const hi = sorted[sorted.length - 1];
    const finding = hi.value / lo.value >= 1.8
        ? `${hi.label} are about twice as likely as ${lower(lo.label)} to farm mainly for sale (${pct(hi.value)} vs ${pct(lo.value)}).`
        : `${hi.label} are the most likely to farm mainly for sale (${pct(hi.value)}), ${lower(lo.label)} the least (${pct(lo.value)}).`;

    const totals = farmingTypes.map(t => farming.Female[t.key] + farming.Male[t.key]);

    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overall.subsistencePct)}
                statLabel="farm mainly to feed their own household"
                finding={finding}
                detail="Very few people farm mainly to sell."
            />
            <div className="grid lg:grid-cols-5 gap-5">
                <ChartCard
                    className="lg:col-span-2"
                    title="Why people farm"
                    subtitle={`All ${RESPONDENTS} people surveyed`}
                    table={{
                        columns: ['Farming type', 'People', 'Share'],
                        rows: farmingTypes.map((t, i) => [t.label, totals[i], pct1((totals[i] / RESPONDENTS) * 100)]),
                    }}
                >
                    <BarRows
                        rows={farmingTypes.map((t, i) => ({
                            key: t.key,
                            label: t.label,
                            value: (totals[i] / RESPONDENTS) * 100,
                            color: BRAND,
                            tip: <Tip title={t.label} lines={[`${totals[i]} of ${RESPONDENTS} people`, pct1((totals[i] / RESPONDENTS) * 100)]} />,
                        }))}
                    />
                </ChartCard>

                <ChartCard
                    className="lg:col-span-3"
                    title={`Farming type by ${lower(GROUPINGS[grouping].label)}`}
                    subtitle="Share of each group"
                    legend={<Legend items={farmingTypes.map((t, i) => ({ key: t.key, label: t.label, color: ORDINAL_3[i] }))} />}
                    table={{
                        columns: ['Group', ...farmingTypes.map(t => t.label)],
                        rows: rows.map(r => [r.label, ...r.segments.map(s => pct1(s.value))]),
                    }}
                >
                    <StackedRows rows={rows} />
                </ChartCard>
            </div>
            <Takeaway>
                Farming here is mostly about feeding the family. When harvests fail, households lose food first, not just
                income — so adaptation that protects household food production reaches the most people.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Multi-select questions: priority sectors, climate impacts
───────────────────────────────────────────── */
function MentionsTopic({ items, grouping, highlight, onHighlight, statLabel, rankingTitle, compareTitle, noun, takeaway }) {
    const groups = GROUPINGS[grouping].groups;
    const keys = groups.map(g => g.key);
    const data = mentionShares(items, keys);
    const ranked = [...data.rows].sort((a, b) => b.share - a.share);
    const top = ranked[0];

    // Largest gap between groups (ignoring "Other")
    const gap = ranked
        .filter(r => r.label !== 'Other')
        .map(r => {
            const vals = groups.map(g => ({ label: g.label, value: r.byGroup[g.key].share }));
            const s = [...vals].sort((a, b) => a.value - b.value);
            return { row: r, lo: s[0], hi: s[s.length - 1], diff: s[s.length - 1].value - s[0].value };
        })
        .sort((a, b) => b.diff - a.diff)[0];

    const maxShare = Math.max(...ranked.flatMap(r => groups.map(g => r.byGroup[g.key].share)));

    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(top.share)}
                statLabel={statLabel(top.label)}
                finding={`${top.label} comes first, followed by ${lower(ranked[1].label)} and ${lower(ranked[2].label)}.`}
                detail={gap && `Biggest difference between groups: ${lower(gap.row.label)} — ${pct(gap.hi.value)} of ${noun} from ${lower(gap.hi.label)} vs ${pct(gap.lo.value)} from ${lower(gap.lo.label)}.`}
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <ChartCard
                    title={rankingTitle}
                    subtitle={`Share of all ${data.grandTotal.toLocaleString()} ${noun}`}
                    footnote={`People could name more than one, so figures are shares of all ${noun}.`}
                    table={{
                        columns: ['Item', 'Mentions', 'Share'],
                        rows: ranked.map(r => [r.label, r.count, pct1(r.share)]),
                    }}
                >
                    <BarRows
                        max={top.share * 1.05}
                        rows={ranked.map(r => ({
                            key: r.label,
                            label: r.label,
                            value: r.share,
                            color: BRAND,
                            tip: <Tip title={r.label} lines={[`${r.count} ${noun}`, `${pct1(r.share)} of all ${noun}`]} />,
                        }))}
                    />
                </ChartCard>

                <ChartCard
                    title={compareTitle}
                    subtitle={`Share of each group's ${noun}`}
                    legend={groupLegend(groups, highlight, onHighlight)}
                    table={{
                        columns: ['Item', ...groups.map(g => g.label)],
                        rows: ranked.map(r => [r.label, ...groups.map(g => pct1(r.byGroup[g.key].share))]),
                    }}
                >
                    <GroupedBarRows
                        max={maxShare * 1.2}
                        categories={ranked.map(r => ({
                            label: r.label,
                            bars: groups.map(g => ({
                                key: g.key,
                                label: g.label,
                                value: r.byGroup[g.key].share,
                                color: g.color,
                                dimmed: highlight && highlight !== g.key,
                                tip: <Tip title={`${r.label} · ${g.label}`} lines={[`${r.byGroup[g.key].count} of ${data.totals[g.key]} ${noun}`, pct1(r.byGroup[g.key].share)]} />,
                            })),
                        }))}
                    />
                </ChartCard>
            </div>
            <Takeaway>{takeaway}</Takeaway>
        </div>
    );
}

export function PriorityTopic(props) {
    return (
        <MentionsTopic
            {...props}
            items={prioritySectors}
            noun="mentions"
            statLabel={(label) => `of all priority mentions go to ${lower(label)}`}
            rankingTitle="Which sectors matter most?"
            compareTitle="Do groups prioritise differently?"
            takeaway="Communities consistently put food and water first. Adaptation plans and budgets that lead with agriculture and water security match what people say matters most to them."
        />
    );
}

export function ImpactsTopic(props) {
    return (
        <MentionsTopic
            {...props}
            items={climateImpacts}
            noun="mentions"
            statLabel={(label) => `of all impact mentions are ${lower(label)}`}
            rankingTitle="Which climate impacts do people see?"
            compareTitle="Do groups experience impacts differently?"
            takeaway="The most common impacts all hit food: lower yields, drought and unreliable rain. People experience climate change mainly through their harvests and the price of food."
        />
    );
}

/* ─────────────────────────────────────────────
   Access to climate information
───────────────────────────────────────────── */
export function ClimateInfoTopic({ grouping, highlight, onHighlight }) {
    const groups = GROUPINGS[grouping].groups;
    const access = groups.map(g => ({ ...g, value: climateInfoAccess[g.key] }));
    const freqOrder = [...infoFrequencyLevels].reverse(); // Always → Never
    const freqRows = groups.map(g => ({
        key: g.key,
        label: g.label,
        dimmed: highlight && highlight !== g.key,
        segments: freqOrder.map(level => ({
            key: level,
            label: level,
            value: infoFrequency[g.key][level],
            color: ORDINAL_4[infoFrequencyLevels.indexOf(level)],
            tip: <Tip title={`${g.label} · ${level}`} lines={[pct1(infoFrequency[g.key][level])]} />,
        })),
    }));

    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overall.climateInfoPct)}
                statLabel="of people can access climate information"
                finding={compareSentence(access, 'get climate information')}
                detail="Among those with access, most receive it only sometimes."
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <ChartCard
                    title="Who can access climate information?"
                    subtitle={`Share of each ${lower(GROUPINGS[grouping].label)} with access`}
                    legend={groupLegend(groups, highlight, onHighlight)}
                    table={{
                        columns: ['Group', 'Has access', 'No access'],
                        rows: access.map(a => [a.label, pct1(a.value), pct1(100 - a.value)]),
                    }}
                >
                    <BarRows
                        reference={{ value: 50, label: 'Half' }}
                        rows={access.map(a => ({
                            key: a.key,
                            label: a.label,
                            sub: `${a.n} people`,
                            value: a.value,
                            color: a.color,
                            dimmed: highlight && highlight !== a.key,
                            tip: <Tip title={a.label} lines={[`${pct1(a.value)} have access`, `${pct1(100 - a.value)} do not`]} />,
                        }))}
                    />
                </ChartCard>

                <ChartCard
                    title="How often do they get it?"
                    subtitle="Among people who have access"
                    legend={<Legend items={freqOrder.map(level => ({ key: level, label: level, color: ORDINAL_4[infoFrequencyLevels.indexOf(level)] }))} />}
                    table={{
                        columns: ['Group', ...freqOrder],
                        rows: freqRows.map(r => [r.label, ...r.segments.map(s => pct1(s.value))]),
                    }}
                >
                    <StackedRows rows={freqRows} />
                </ChartCard>
            </div>
            <Takeaway>
                Half the community is missing climate information — the early warnings and forecasts that help people plan
                planting and protect their harvests. Closing this gap, especially for youth, is one of the most direct ways to
                support adaptation.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Topics still being collected
───────────────────────────────────────────── */
export function ComingSoonTopic({ title, description, views }) {
    return (
        <div className="rounded-2xl border border-dashed border-gray-200 p-6 sm:p-10">
            <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <Clock className="w-3.5 h-3.5" /> Data collection in progress
                </span>
                <h3 className="mt-4 text-2xl font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>
            </div>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">What this section will show</p>
            <ul className="mt-3 grid sm:grid-cols-2 gap-3">
                {views.map(view => (
                    <li key={view.title} className="rounded-xl bg-gray-50 p-4">
                        <p className="font-semibold text-gray-900 text-sm">{view.title}</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{view.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
