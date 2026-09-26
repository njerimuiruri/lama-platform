"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Calendar, Users, X } from 'lucide-react';
import { formatMoney } from '@/lib/formatMoney';

const PAGE_SIZE = 4;

const amountOf = (p) => parseFloat(p['Project Amount ($ Million)'] || 0) || 0;
const clean = (v) => {
    const value = v?.trim();
    if (!value || value.toLowerCase() === 'none') return null;
    return value.charAt(0).toUpperCase() + value.slice(1);
};

// Count values of a field across projects, most common first
function tally(projects, field, limit) {
    const counts = {};
    projects.forEach(p => {
        const value = clean(p[field]);
        if (value) counts[value] = (counts[value] || 0) + 1;
    });
    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}

/* Country summary shown when a country is clicked on the resilience map */
export default function CountrySnapshotModal({ country, projects, theme, onClose }) {
    const [page, setPage] = useState(0);

    // Close on Escape and stop the page behind from scrolling
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    const summary = useMemo(() => {
        const active = projects.filter(p => p['Implementation Status'] === 'Under Implementation').length;
        return {
            active,
            region: tally(projects, 'Region', 1)[0]?.name,
            themes: tally(projects, 'Thematic Area(s)', 5),
            funders: tally(projects, 'Funders', 3),
        };
    }, [projects]);

    // Largest projects first
    const sorted = useMemo(() => [...projects].sort((a, b) => amountOf(b) - amountOf(a)), [projects]);
    const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
    const visible = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
    const databaseHref = `/resources/interventions-database?country=${encodeURIComponent(projects[0]?.Country ?? country)}`;

    return (
        <div
            className="fixed inset-0 z-[1100] bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`${country} projects`}
        >
            <div
                className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-5 sm:px-7 pt-5 sm:pt-6">
                    <div>
                        {summary.region && (
                            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">{summary.region}</p>
                        )}
                        <h3 className="text-2xl font-bold text-gray-900">{country}</h3>
                        {theme && (
                            <p className="text-xs text-gray-500 mt-1">
                                Showing <span className="font-semibold text-gray-700">{theme}</span> projects only
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Key numbers */}
                <div className="grid grid-cols-2 gap-3 px-5 sm:px-7 mt-4">
                    {[
                        { value: projects.length, label: projects.length === 1 ? 'Project' : 'Projects' },
                        { value: `${summary.active} of ${projects.length}`, label: 'Under implementation' },
                    ].map(({ value, label }) => (
                        <div key={label} className="rounded-xl bg-gray-50 px-3 py-3">
                            <p className="text-lg sm:text-xl font-bold text-gray-900 tabular-nums">{value}</p>
                            <p className="text-xs text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-5 gap-6 px-5 sm:px-7 py-6">

                    {/* Focus areas + funders */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Focus areas</p>
                            <ul className="space-y-2.5">
                                {summary.themes.map(({ name, count }) => (
                                    <li key={name}>
                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <span className="text-gray-700">{name}</span>
                                            <span className="font-semibold text-gray-900 tabular-nums">{count}</span>
                                        </div>
                                        <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                            <div className="h-full bg-[#0d9c5a] rounded-full" style={{ width: `${(count / projects.length) * 100}%` }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {summary.funders.length > 0 && (
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Main funders</p>
                                <ul className="space-y-2">
                                    {summary.funders.map(({ name, count }) => (
                                        <li key={name} className="flex items-start justify-between gap-3 text-sm">
                                            <span className="text-gray-700 leading-snug">{name}</span>
                                            <span className="flex-shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                                                {count}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Projects, a page at a time */}
                    <div className="md:col-span-3 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Projects</p>
                            {pageCount > 1 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500 mr-1 tabular-nums">
                                        {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => p - 1)}
                                        disabled={page === 0}
                                        className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                                        aria-label="Previous projects"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page >= pageCount - 1}
                                        className="p-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                                        aria-label="Next projects"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <ul className="grid sm:grid-cols-2 gap-3">
                            {visible.map((proj, i) => {
                                const status = proj['Implementation Status'];
                                const funder = clean(proj.Funders);
                                return (
                                    <li key={`${page}-${i}`} className="rounded-xl border border-gray-100 p-4 flex flex-col">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-[11px] font-semibold text-emerald-700 truncate">
                                                {clean(proj['Thematic Area(s)']) ?? 'Adaptation'}
                                            </span>
                                            {amountOf(proj) > 0 && (
                                                <span className="text-xs font-bold text-gray-900 tabular-nums flex-shrink-0">{formatMoney(amountOf(proj))}</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-3 mb-3">
                                            {proj['Adaptation Interventions']}
                                        </p>
                                        <div className="mt-auto space-y-1 text-xs text-gray-500">
                                            {funder && (
                                                <p className="flex items-center gap-1.5 truncate"><Users className="w-3 h-3 flex-shrink-0" />{funder}</p>
                                            )}
                                            <div className="flex items-center justify-between gap-2">
                                                {proj.Period && (
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{proj.Period}</span>
                                                )}
                                                {status && (
                                                    <span className={`px-2 py-0.5 rounded-full font-medium ${status === 'Under Implementation' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                                        {status === 'Under Implementation' ? 'Ongoing' : 'Approved'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
                    <p className="text-xs text-gray-500 hidden sm:block">Largest projects shown first</p>
                    <a
                        href={databaseHref}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-[#0d9c5a] hover:text-emerald-800 ml-auto"
                    >
                        Open {country} in the project database
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
}
