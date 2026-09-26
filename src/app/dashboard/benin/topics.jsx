'use client';
import React from 'react';
import { ChartCard, Legend, BarRows, GroupedBarRows, StackedRows, Tip } from '../components/charts';
import { KeyFinding, Takeaway } from '../components/topics';
import data from './beninData.json';

/* ─────────────────────────────────────────────
   Shared settings and helpers
───────────────────────────────────────────── */
// Same validated colours as the Kenya dashboard: gender blue/orange, age pink/violet/yellow
const COLORS = {
    Woman: '#2a78d6', Man: '#eb6834',
    '18–35': '#e87ba4', '36–50': '#4a3aa7', '51+': '#eda100',
};
const BRAND = '#0d9c5a';
const ORDINAL_4 = ['#4fc995', '#16a372', '#0b7a53', '#07523a'];
// Agree / neutral / disagree: two opposite hues with a grey midpoint
const LIKERT = { Agree: '#0b7a53', Neutral: '#d4d4d0', Disagree: '#eb6834' };

const N = data.meta.respondents;
const Q = data.questions;
const share = (count, base) => (base ? (count / base) * 100 : 0);
const pct = (v) => `${Math.round(v)}%`;
const pct1 = (v) => `${v.toFixed(1)}%`;
const fcfa = (v) => `${Math.round(v).toLocaleString()} FCFA`;
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const isOther = (o) => /^Other/.test(o);

// "2026-04-15" + "2026-04-18" → "15–18 April 2026"
export function fieldworkDates({ from, to }) {
    const f = new Date(`${from}T00:00:00`);
    const t = new Date(`${to}T00:00:00`);
    const month = (d) => d.toLocaleString('en-GB', { month: 'long' });
    if (from === to) return `${f.getDate()} ${month(f)} ${f.getFullYear()}`;
    if (f.getMonth() === t.getMonth() && f.getFullYear() === t.getFullYear()) return `${f.getDate()}–${t.getDate()} ${month(t)} ${t.getFullYear()}`;
    return `${f.getDate()} ${month(f)} – ${t.getDate()} ${month(t)} ${t.getFullYear()}`;
}

const groupsOf = (grouping) => data.groupings[grouping].groups.map(g => ({ ...g, color: COLORS[g.key] }));
const overallShare = (key, option) => share(Q[key].overall.counts[option] || 0, Q[key].overall.base);

// Options ordered by how many people chose them ("Other" last)
function rankedOptions(key, { exclude = [] } = {}) {
    return Object.keys(Q[key].overall.counts)
        .filter(o => !exclude.includes(o))
        .sort((a, b) => (isOther(a) - isOther(b)) || (Q[key].overall.counts[b] - Q[key].overall.counts[a]));
}

const legendFor = (grouping, highlight, onHighlight) => (
    <Legend
        items={groupsOf(grouping).map(g => ({ key: g.key, label: g.label, color: g.color, sub: `n=${g.n}` }))}
        highlight={highlight}
        onHighlight={onHighlight}
    />
);

// Everyone: one bar per option, % of people who chose it
function RankedChart({ qKey, title, subtitle, exclude, footnote }) {
    const q = Q[qKey];
    const options = rankedOptions(qKey, { exclude });
    const max = Math.max(...options.map(o => overallShare(qKey, o)));
    return (
        <ChartCard
            title={title}
            subtitle={subtitle ?? `% of the ${q.overall.base} people who answered`}
            footnote={footnote}
            table={{ columns: ['Answer', 'People', 'Share'], rows: options.map(o => [o, q.overall.counts[o], pct1(overallShare(qKey, o))]) }}
        >
            <BarRows
                max={Math.max(max * 1.05, 1)}
                rows={options.map(o => ({
                    key: o,
                    label: o,
                    value: overallShare(qKey, o),
                    color: BRAND,
                    tip: <Tip title={o} lines={[`${q.overall.counts[o]} of ${q.overall.base} people`, pct1(overallShare(qKey, o))]} />,
                }))}
            />
        </ChartCard>
    );
}

// By group: thin bars per group under each option
function GroupedChart({ qKey, grouping, highlight, onHighlight, title, subtitle, exclude, limit }) {
    const q = Q[qKey];
    const groups = groupsOf(grouping);
    const options = rankedOptions(qKey, { exclude }).slice(0, limit ?? 99);
    const shareFor = (o, g) => share(q[grouping][g.key].counts[o] || 0, q[grouping][g.key].base);
    const max = Math.max(...options.flatMap(o => groups.map(g => shareFor(o, g))));
    return (
        <ChartCard
            title={title}
            subtitle={subtitle ?? '% of each group who chose each answer — people could choose several'}
            legend={legendFor(grouping, highlight, onHighlight)}
            table={{ columns: ['Answer', ...groups.map(g => g.label)], rows: options.map(o => [o, ...groups.map(g => pct1(shareFor(o, g)))]) }}
        >
            <GroupedBarRows
                max={Math.max(max * 1.2, 1)}
                categories={options.map(o => ({
                    label: o,
                    bars: groups.map(g => ({
                        key: g.key,
                        label: g.label,
                        value: shareFor(o, g),
                        color: g.color,
                        dimmed: highlight && highlight !== g.key,
                        tip: <Tip title={`${o} · ${g.label}`} lines={[`${q[grouping][g.key].counts[o] || 0} of ${q[grouping][g.key].base} people`, pct1(shareFor(o, g))]} />,
                    })),
                }))}
            />
        </ChartCard>
    );
}

// By group: 100% stacked bars for an ordered answer scale
function StackedChart({ qKey, grouping, highlight, levels, colors, title, subtitle }) {
    const q = Q[qKey];
    const groups = groupsOf(grouping);
    const rows = groups.map(g => {
        const { counts, base } = q[grouping][g.key];
        return {
            key: g.key,
            label: g.label,
            sub: `${base} people`,
            dimmed: highlight && highlight !== g.key,
            segments: levels.map((level, i) => ({
                key: level,
                label: level,
                value: share(counts[level] || 0, base),
                color: colors[i],
                tip: <Tip title={`${g.label} · ${level}`} lines={[`${counts[level] || 0} of ${base} people`, pct1(share(counts[level] || 0, base))]} />,
            })),
        };
    });
    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            legend={<Legend items={levels.map((l, i) => ({ key: l, label: l, color: colors[i] }))} />}
            table={{ columns: ['Group', ...levels], rows: rows.map(r => [r.label, ...r.segments.map(s => pct1(s.value))]) }}
        >
            <StackedRows rows={rows} />
        </ChartCard>
    );
}

// Least vs most likely group, in words
function compareGroups(values, action) {
    const sorted = [...values].sort((a, b) => a.value - b.value);
    const lo = sorted[0];
    const hi = sorted[sorted.length - 1];
    if (hi.value - lo.value < 4) return `Similar across groups (${values.map(v => `${lower(v.label)} ${pct(v.value)}`).join(', ')}).`;
    return `${lo.label} are least likely to ${action} (${pct(lo.value)}), ${lower(hi.label)} most likely (${pct(hi.value)}).`;
}
const yesShare = (key, grouping, g, yes = ['Yes']) => {
    const { counts, base } = Q[key][grouping][g.key];
    return share(yes.reduce((s, y) => s + (counts[y] || 0), 0), base);
};

/* ─────────────────────────────────────────────
   1. People — who we heard from
───────────────────────────────────────────── */
export function PeopleTopic({ grouping, highlight }) {
    const men = overallShare('A3', 'Man');
    const informal = overallShare('A5', 'Informal sector');
    const married = overallShare('A6', 'Married');
    const gender = data.groupings.gender.groups;
    return (
        <div className="space-y-5">
            <KeyFinding
                stat={N}
                statLabel={`people interviewed in ${data.meta.place}`}
                finding={`${gender.find(g => g.key === 'Man').n} men and ${gender.find(g => g.key === 'Woman').n} women — most are married (${pct(married)}) and work in the informal sector (${pct(informal)}).`}
                detail={`${pct(men)} of households are headed by a man. Fieldwork: ${fieldworkDates(data.meta.fieldwork)}.`}
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <ChartCard
                    title="Where respondents live"
                    subtitle={`Arrondissements of Glazoué commune · all ${N} people`}
                    table={{ columns: ['Arrondissement', 'People', 'Share'], rows: rankedOptions('arrondissement_glazoue_commune').map(a => [a, Q.arrondissement_glazoue_commune.overall.counts[a], pct1(overallShare('arrondissement_glazoue_commune', a))]) }}
                >
                    <BarRows
                        max={Q.arrondissement_glazoue_commune.overall.counts.Aklampa * 1.05}
                        format={(v) => `${v}`}
                        rows={rankedOptions('arrondissement_glazoue_commune').map(a => ({
                            key: a,
                            label: a,
                            value: Q.arrondissement_glazoue_commune.overall.counts[a],
                            color: BRAND,
                            tip: <Tip title={a} lines={[`${Q.arrondissement_glazoue_commune.overall.counts[a]} people`, pct1(overallShare('arrondissement_glazoue_commune', a))]} />,
                        }))}
                    />
                </ChartCard>
                <StackedChart
                    qKey="A7"
                    grouping={grouping}
                    highlight={highlight}
                    levels={['No formal education', 'Primary school', 'Technical secondary / vocational training', 'University / college']}
                    colors={ORDINAL_4}
                    title="Highest level of education"
                    subtitle="Share of each group"
                />
            </div>
            <Takeaway>
                Half of the interviews took place in Aklampa, so results lean towards that arrondissement. Men outnumber
                women two to one — keep this in mind when reading totals, and use the gender comparison to see women&apos;s answers on their own.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   2. Land and farming
───────────────────────────────────────────── */
export function FarmingTopic({ grouping, highlight, onHighlight }) {
    const own = overallShare('B1', 'Yes');
    const inherited = overallShare('B1_if_yes_what_is_your_ownership_status', 'Inheritance');
    const groups = groupsOf(grouping);
    const income = groups.map(g => ({ ...g, value: data.income[grouping][g.key] }));
    const incomeSorted = [...income].sort((a, b) => a.value - b.value);
    const lo = incomeSorted[0];
    const hi = incomeSorted[incomeSorted.length - 1];
    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(own)}
                statLabel="own farmland — almost all of it inherited"
                finding={hi.value >= lo.value * 1.3
                    ? `${lo.label} earn much less from farming: a median of ${fcfa(lo.value)} a year, against ${fcfa(hi.value)} for ${lower(hi.label)}.`
                    : `Median farm income is similar across groups (${income.map(g => `${lower(g.label)} ${fcfa(g.value)}`).join(', ')}).`}
                detail={`${pct(inherited)} of landowners inherited their land. Soybean and maize are grown by almost everyone.`}
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <GroupedChart
                    qKey="B3"
                    grouping={grouping}
                    highlight={highlight}
                    onHighlight={onHighlight}
                    title="Which crops do people grow?"
                    exclude={['Other']}
                />
                <div className="space-y-5">
                    <ChartCard
                        title="Median annual farm income"
                        subtitle="FCFA per year — half earn more, half earn less"
                        legend={legendFor(grouping, highlight, onHighlight)}
                        footnote={`Everyone: ${fcfa(data.income.overall)}. Medians are used because a few very large incomes would distort an average.`}
                        table={{ columns: ['Group', 'Median income (FCFA)'], rows: income.map(g => [g.label, Math.round(g.value).toLocaleString()]) }}
                    >
                        <BarRows
                            max={hi.value * 1.1}
                            format={(v) => `${(v / 1000).toFixed(0)}k`}
                            rows={income.map(g => ({
                                key: g.key,
                                label: g.label,
                                sub: `${g.n} people`,
                                value: g.value,
                                color: g.color,
                                dimmed: highlight && highlight !== g.key,
                                tip: <Tip title={g.label} lines={[`Median ${fcfa(g.value)} a year`]} />,
                            }))}
                        />
                    </ChartCard>
                    <StackedChart
                        qKey="B2_bands"
                        grouping={grouping}
                        highlight={highlight}
                        levels={['Up to 5 ha', '6–10 ha', '11–15 ha', 'Over 15 ha']}
                        colors={ORDINAL_4}
                        title="Farm size"
                        subtitle="Share of each group's landowners"
                    />
                </div>
            </div>
            <Takeaway>
                Farming here is a family business built on inherited land. The income gap is the clearest signal in this
                topic: support aimed at raising farm incomes needs to reach women directly, not only through the household.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   3. Climate impacts
───────────────────────────────────────────── */
export function ImpactsTopic({ grouping, highlight, onHighlight }) {
    const top = rankedOptions('D1', { exclude: ['Other'] });
    const livelihoods = overallShare('C2', 'On livelihoods (farming, livestock, fishing)');
    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overallShare('D1', top[0]))}
                statLabel={`have seen ${lower(top[0])}`}
                finding={`${top[0]}, ${lower(top[1])} (${pct(overallShare('D1', top[1]))}) and ${lower(top[2])} (${pct(overallShare('D1', top[2]))}) are what people notice most.`}
                detail={`${pct(livelihoods)} say climate change has hit their livelihoods — mostly through lower crop yields.`}
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <GroupedChart
                    qKey="D1"
                    grouping={grouping}
                    highlight={highlight}
                    onHighlight={onHighlight}
                    title="What climate changes have people noticed?"
                    exclude={['Other']}
                />
                <RankedChart
                    qKey="C2"
                    title="Where has climate change made people more vulnerable?"
                    subtitle={`% of all ${N} people — people could choose several`}
                />
            </div>
            <Takeaway>
                Drought and heat are felt by almost everyone, and they show up first in farming: lower productivity, lower
                yields, then lost income and debt. Water and heat-tolerant farming should sit at the centre of local adaptation.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   4. Information and voice
───────────────────────────────────────────── */
export function InformationTopic({ grouping, highlight, onHighlight }) {
    const groups = groupsOf(grouping);
    const indicators = [
        { label: 'Get climate information', key: 'E1' },
        { label: 'Consulted in adaptation planning', key: 'C3', yes: ['Yes', 'Partially'] },
        { label: 'See women in adaptation leadership', key: 'E5' },
        { label: 'Say communities help design solutions', key: 'E3' },
    ];
    const valueFor = (ind, g) => yesShare(ind.key, grouping, g, ind.yes);
    const access = groups.map(g => ({ label: g.label, value: yesShare('E1', grouping, g) }));
    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overallShare('E1', 'Yes'))}
                statLabel="have access to climate information"
                finding={`Only ${pct(overallShare('C3', 'Yes') + overallShare('C3', 'Partially'))} have ever been consulted on adaptation planning in their community.`}
                detail={compareGroups(access, 'get climate information')}
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <ChartCard
                    title="Information and voice"
                    subtitle="% of each group answering yes"
                    legend={legendFor(grouping, highlight, onHighlight)}
                    table={{ columns: ['Indicator', ...groups.map(g => g.label)], rows: indicators.map(ind => [ind.label, ...groups.map(g => pct1(valueFor(ind, g)))]) }}
                >
                    <GroupedBarRows
                        max={Math.max(...indicators.flatMap(ind => groups.map(g => valueFor(ind, g)))) * 1.25}
                        categories={indicators.map(ind => ({
                            label: ind.label,
                            bars: groups.map(g => ({
                                key: g.key,
                                label: g.label,
                                value: valueFor(ind, g),
                                color: g.color,
                                dimmed: highlight && highlight !== g.key,
                                tip: <Tip title={`${ind.label} · ${g.label}`} lines={[pct1(valueFor(ind, g))]} />,
                            })),
                        }))}
                    />
                </ChartCard>
                <RankedChart
                    qKey="C4"
                    title="What keeps marginalised groups out of adaptation programmes?"
                    subtitle={`% of all ${N} people — people could choose several`}
                    exclude={['Other (specify)']}
                />
            </div>
            <Takeaway>
                People are largely outside the information and planning loop: few receive climate information and almost no
                one has been consulted. Lack of information is also named as the main barrier for marginalised groups — so
                reliable, local climate information is a practical first step.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   5. Adaptation in practice
───────────────────────────────────────────── */
const SUPPORT_ITEMS = ['F10_1', 'F10_2', 'F10_3', 'F10_4', 'F10_5', 'F10_6', 'F10_7'];

export function AdaptationTopic({ grouping, highlight, onHighlight }) {
    const practices = rankedOptions('F1', { exclude: ['Other'] });
    const agreeRows = SUPPORT_ITEMS.map(key => {
        const { counts, base } = Q[key].overall;
        const label = Q[key].question.replace(/^F-10-\d+\.\s*/, '');
        return {
            key,
            label,
            segments: ['Agree', 'Neutral', 'Disagree'].map(level => ({
                key: level,
                label: level,
                value: share(counts[level] || 0, base),
                color: LIKERT[level],
                tip: <Tip title={`${label} · ${level}`} lines={[`${counts[level] || 0} of ${base} people`, pct1(share(counts[level] || 0, base))]} />,
            })),
        };
    }).sort((a, b) => b.segments[0].value - a.segments[0].value);
    const topPriority = rankedOptions('I1')[0];
    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overallShare('I1', topPriority))}
                statLabel={`say ${lower(topPriority)} should be the top priority`}
                finding={`${practices[0]} (${pct(overallShare('F1', practices[0]))}) and ${lower(practices[1])} (${pct(overallShare('F1', practices[1]))}) are the most common adaptation practices today.`}
                detail={`Interventions are mostly run by donor-funded projects (${pct(overallShare('F2', 'Donor-funded projects'))}) or by people and communities themselves (${pct(overallShare('F2', 'Individuals / communities'))}).`}
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <GroupedChart
                    qKey="F1"
                    grouping={grouping}
                    highlight={highlight}
                    onHighlight={onHighlight}
                    title="Which adaptation practices exist in the community?"
                    exclude={['Other']}
                />
                <ChartCard
                    title="Support for proposed measures"
                    subtitle={`Do people agree these would help? · all ${N} people`}
                    legend={<Legend items={Object.entries(LIKERT).map(([k, c]) => ({ key: k, label: k, color: c }))} />}
                    table={{ columns: ['Measure', 'Agree', 'Neutral', 'Disagree'], rows: agreeRows.map(r => [r.label, ...r.segments.map(s => pct1(s.value))]) }}
                >
                    <StackedRows rows={agreeRows} />
                </ChartCard>
            </div>
            <Takeaway>
                Every proposed support measure is backed by at least {pct(Math.min(...agreeRows.map(r => r.segments[0].value)))} of
                people, with {lower(agreeRows[0].label)} the most popular ({pct(agreeRows[0].segments[0].value)}). Communities
                already practise adaptation; they are asking for support to do more of it.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   6. Finance
───────────────────────────────────────────── */
export function FinanceTopic({ grouping, highlight, onHighlight }) {
    const groups = groupsOf(grouping);
    const access = groups.map(g => ({ ...g, value: yesShare('H3_all', grouping, g) }));
    const topSource = rankedOptions('H1')[0];
    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overallShare('H3_all', 'Yes'))}
                statLabel="have access to any financing"
                finding={`${topSource} is the main source of adaptation funding for ${pct(overallShare('H1', topSource))} of people — they pay for adaptation themselves.`}
                detail={compareGroups(access.map(a => ({ label: a.label, value: a.value })), 'have access to financing')}
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <div className="space-y-5">
                    <ChartCard
                        title="Access to financing"
                        subtitle="% of each group with access to any financing"
                        legend={legendFor(grouping, highlight, onHighlight)}
                        footnote={Q.H3_all.note}
                        table={{ columns: ['Group', 'Has access', 'People'], rows: access.map(a => [a.label, pct1(a.value), Q.H3_all[grouping][a.key].base]) }}
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
                                tip: <Tip title={a.label} lines={[`${Q.H3_all[grouping][a.key].counts.Yes || 0} of ${Q.H3_all[grouping][a.key].base} have access`, pct1(a.value)]} />,
                            }))}
                        />
                    </ChartCard>
                    <RankedChart qKey="H1" title="Main source of adaptation funding" />
                </div>
                <RankedChart
                    qKey="H5"
                    title="Why is climate finance hard to reach?"
                    subtitle={`% of all ${N} people — people could choose several`}
                />
            </div>
            <Takeaway>
                Most households fund adaptation from their own pockets. The main obstacle to outside funding is not knowing
                it exists, followed by requirements people cannot meet — clear information and simpler access would open the door.
            </Takeaway>
        </div>
    );
}

/* ─────────────────────────────────────────────
   7. Measuring success
───────────────────────────────────────────── */
export function IndicatorsTopic({ grouping, highlight, onHighlight }) {
    const first = rankedOptions('g_4_ranked_indicators_1st_choice');
    return (
        <div className="space-y-5">
            <KeyFinding
                stat={pct(overallShare('g_4_ranked_indicators_1st_choice', first[0]))}
                statLabel={`rank "${lower(first[0])}" as the best sign of a resilient farm`}
                finding={`To judge whether adaptation works, people look first at ${lower(rankedOptions('G9', { exclude: ['Other'] })[0])} (${pct(overallShare('G9', rankedOptions('G9', { exclude: ['Other'] })[0]))}) and ${lower(rankedOptions('G9', { exclude: ['Other'] })[1])} (${pct(overallShare('G9', rankedOptions('G9', { exclude: ['Other'] })[1]))}).`}
                detail="These are the community's own measures of success — the locally led indicators LAMA sets out to capture."
            />
            <div className="grid lg:grid-cols-2 gap-5">
                <GroupedChart
                    qKey="G9"
                    grouping={grouping}
                    highlight={highlight}
                    onHighlight={onHighlight}
                    title="How would people measure the success of local adaptation?"
                    exclude={['Other']}
                />
                <RankedChart
                    qKey="g_4_ranked_indicators_1st_choice"
                    title="Best sign of a resilient farm — first choice"
                    subtitle={`% of all ${N} people ranking each indicator first`}
                />
            </div>
            <Takeaway>
                Communities measure resilience through the land itself — healthy soil, steady yields and water. Indicators
                built around these will be understood and trusted locally.
            </Takeaway>
        </div>
    );
}
