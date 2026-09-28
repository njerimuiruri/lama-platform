'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Database, Globe, Landmark, MapPin } from 'lucide-react';
import projectsData from '../../../data/data/projects.json';

// Display names for the "top countries" list
const COUNTRY_LABELS = { 'United Republic of Tanzania': 'Tanzania', 'Democratic Republic of the Congo': 'DR Congo' };

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Counts from 0 up to `target` once it is known
function useCountUp(target, duration = 1400) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!target) { setValue(0); return; }
        if (prefersReducedMotion()) { setValue(target); return; }
        let frame;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            setValue(target * (1 - Math.pow(1 - t, 3))); // ease-out
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);
    return value;
}

// Inline number that counts up to `value`
const CountUp = ({ value, duration }) => {
    const current = useCountUp(value, duration);
    return <>{value ? Math.round(current).toLocaleString() : '—'}</>;
};

const StatCounter =({ value, format, label, icon: Icon, delay }) => {
    const current = useCountUp(value);
    return (
        <div className="hero-rise" style={{ animationDelay: delay }}>
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
                {value ? format(current) : '—'}
            </p>
        </div>
    );
};

const LAMAHeroSection = () => {
    const [indicatorStats, setIndicatorStats] = useState(null);

    useEffect(() => {
        fetch('/api/public/stats')
            .then(r => r.json())
            .then(setIndicatorStats)
            .catch(() => setIndicatorStats(null));
    }, []);

    // Project figures from the interventions dataset
    const projects = useMemo(() => {
        const byCountry = {};
        projectsData.forEach(p => {
            const name = p.Country.trim();
            byCountry[name] = (byCountry[name] || 0) + 1;
        });
        const top = Object.entries(byCountry)
            .map(([name, count]) => ({ name: COUNTRY_LABELS[name] ?? name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
        return { total: projectsData.length, countries: Object.keys(byCountry).length, top };
    }, []);

    // Live indicator records, grouped like the Indicators menu
    const levels = useMemo(() => {
        const n = (key) => Number(indicatorStats?.[key]) || 0;
        const rows = [
            { label: 'Global', icon: Globe, value: n('gga') + n('global') },
            { label: 'National', icon: Landmark, value: n('ndc') + n('naps') + n('nccap') },
            { label: 'County & Local', icon: MapPin, value: n('ccap') + n('cidps') + n('lla') },
        ];
        const total = rows.reduce((sum, r) => sum + r.value, 0);
        const max = Math.max(...rows.map(r => r.value), 1);
        return { rows, total, max };
    }, [indicatorStats]);

    const liveTotal = useCountUp(levels.total);
    const fmtInt = (v) => Math.round(v).toLocaleString();

    return (
        <section className="relative overflow-hidden bg-white">
            {/* Backdrop: faint data grid + slow drifting glow */}
            <div className="hero-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
            <div className="hero-glow absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="hero-glow-slow absolute -bottom-48 -left-40 w-[460px] h-[460px] rounded-full bg-teal-100/60 blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-14 lg:pt-16 lg:pb-20">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

                    {/* Left: message */}
                    <div className="lg:col-span-7">
                        <div className="hero-rise inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 backdrop-blur px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <span className="relative flex w-2 h-2">
                                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                            </span>
                            Live data platform · IDRC-funded
                        </div>

                        <h1 className="hero-rise mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-gray-900 leading-[1.08]" style={{ animationDelay: '80ms' }}>
                            <span className="hero-shimmer bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                                Locally Led Adaptation
                            </span>{' '}
                            Metrics for Africa{' '}
                            <span className="text-gray-400 font-bold">(LAMA)</span>
                        </h1>

                        <p className="hero-rise mt-5 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl" style={{ animationDelay: '160ms' }}>
                            LAMA aims to co-develop indicators that capture the effectiveness and inclusiveness of
                            adaptation strategies at the community level.
                        </p>

                        <div className="hero-rise mt-8 flex flex-col sm:flex-row gap-3" style={{ animationDelay: '240ms' }}>
                            <Link
                                href="/dashboard/sitedashboard"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d9c5a] hover:bg-emerald-700 text-white px-6 py-3.5 font-semibold shadow-lg shadow-emerald-600/20 transition-colors"
                            >
                                <BarChart3 className="w-5 h-5" />
                                Explore the dashboard
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/indicators"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-800 px-6 py-3.5 font-semibold transition-colors"
                            >
                                <Database className="w-5 h-5 text-emerald-600" />
                                Browse indicators
                            </Link>
                        </div>

                        {/* Headline numbers */}
                        <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-3 gap-6">
                            <StatCounter value={levels.total} format={fmtInt} label="Indicators" icon={Database} delay="320ms" />
                            <StatCounter value={projects.total} format={fmtInt} label="Projects" icon={BarChart3} delay="380ms" />
                            <StatCounter value={projects.countries} format={fmtInt} label="Countries" icon={Globe} delay="440ms" />
                        </div>
                    </div>

                    {/* Right: live data snapshot */}
                    <div className="lg:col-span-5 relative hero-rise" style={{ animationDelay: '200ms' }}>
                        <div className="relative rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-xl shadow-emerald-900/5 p-5 sm:p-6 sm:pt-12">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Indicator records</p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums mt-1">
                                        {levels.total ? fmtInt(liveTotal) : '—'}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live
                                </span>
                            </div>

                            {/* Records by level */}
                            <ul className="mt-5 space-y-4">
                                {levels.rows.map(({ label, icon: Icon, value }, i) => (
                                    <li key={label}>
                                        <div className="flex items-center justify-between text-sm mb-1.5">
                                            <span className="flex items-center gap-2 text-gray-700">
                                                <Icon className="w-4 h-4 text-emerald-600" />{label}
                                            </span>
                                            <span className="font-semibold text-gray-900 tabular-nums"><CountUp value={value} /></span>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="hero-bar h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                                style={{ width: `${Math.max((value / levels.max) * 100, value ? 4 : 0)}%`, animationDelay: `${500 + i * 150}ms` }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Most active countries */}
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Most active countries</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {projects.top.map(({ name, count }) => (
                                        <div key={name} className="rounded-xl bg-gray-50 px-3 py-2.5">
                                            <p className="text-lg font-bold text-gray-900 tabular-nums leading-none"><CountUp value={count} /></p>
                                            <p className="text-xs text-gray-500 mt-1 truncate">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href="/dashboard/sitedashboard"
                                className="group mt-5 flex items-center justify-between rounded-xl bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 text-sm font-semibold transition-colors"
                            >
                                Open the full dashboard
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Countries chip */}
                        <div className="hidden sm:flex absolute -top-4 -left-4 items-center gap-2 rounded-xl bg-white border border-gray-100 shadow-lg px-3 py-2">
                            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                                <MapPin className="w-4 h-4" />
                            </span>
                            <span className="text-xs leading-tight">
                                <span className="block font-bold text-gray-900 tabular-nums"><CountUp value={projects.countries} /> countries</span>
                                <span className="text-gray-500">across Africa</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hero-grid {
                    background-image:
                        linear-gradient(to right, rgba(13, 156, 90, 0.06) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(13, 156, 90, 0.06) 1px, transparent 1px);
                    background-size: 44px 44px;
                    mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 75%);
                    -webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 75%);
                }
                .hero-rise { opacity: 0; animation: heroRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                .hero-bar { transform-origin: left; transform: scaleX(0); animation: heroBar 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                .hero-glow { animation: heroDrift 14s ease-in-out infinite alternate; }
                .hero-glow-slow { animation: heroDrift 18s ease-in-out infinite alternate-reverse; }
                .hero-shimmer { background-size: 200% auto; animation: heroShimmer 6s linear infinite; }

                @keyframes heroRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes heroBar { to { transform: scaleX(1); } }
                @keyframes heroDrift { from { transform: translate(0, 0) scale(1); } to { transform: translate(-40px, 30px) scale(1.08); } }
                @keyframes heroShimmer { to { background-position: 200% center; } }

                @media (prefers-reduced-motion: reduce) {
                    .hero-rise, .hero-bar, .hero-glow, .hero-glow-slow, .hero-shimmer { animation: none; opacity: 1; transform: none; }
                }
            `}</style>
        </section>
    );
};

export default LAMAHeroSection;
