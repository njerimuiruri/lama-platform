'use client';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { BarChart3, Table2 } from 'lucide-react';

/* ─────────────────────────────────────────────
   Tooltip — one per chart card; bars report hover/focus
───────────────────────────────────────────── */
const TipContext = createContext({ show: () => {}, hide: () => {} });

export function useTip() {
    return useContext(TipContext);
}

// Props for any hoverable/focusable mark
export function useMarkProps(tip, ariaLabel) {
    const { show, hide } = useTip();
    return {
        tabIndex: 0,
        'aria-label': ariaLabel,
        onMouseMove: (e) => show(tip, e),
        onMouseLeave: hide,
        onFocus: (e) => show(tip, e),
        onBlur: hide,
    };
}

/* ─────────────────────────────────────────────
   Chart card — title, legend, chart/table toggle, tooltip layer
───────────────────────────────────────────── */
export function ChartCard({ title, subtitle, legend, table, footnote, children, className = '' }) {
    const [view, setView] = useState('chart');
    const [tip, setTip] = useState(null);
    const cardRef = useRef(null);

    const show = useCallback((content, e) => {
        const card = cardRef.current?.getBoundingClientRect();
        if (!card) return;
        let x, y;
        if (e.type === 'focus') {
            const r = e.currentTarget.getBoundingClientRect();
            x = r.left + r.width / 2 - card.left;
            y = r.top - card.top;
        } else {
            x = e.clientX - card.left;
            y = e.clientY - card.top;
        }
        setTip({ content, x: Math.min(Math.max(x, 110), card.width - 110), y });
    }, []);
    const hide = useCallback(() => setTip(null), []);

    return (
        <section ref={cardRef} className={`relative rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 ${className}`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
                {table && (
                    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 text-xs flex-shrink-0" role="group" aria-label="Chart or table view">
                        {[{ key: 'chart', icon: BarChart3, label: 'Chart' }, { key: 'table', icon: Table2, label: 'Table' }].map(({ key, icon: Icon, label }) => (
                            <button
                                key={key}
                                onClick={() => setView(key)}
                                aria-pressed={view === key}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${view === key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                <Icon className="w-3.5 h-3.5" />{label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {legend && view === 'chart' && <div className="mb-4">{legend}</div>}

            <TipContext.Provider value={{ show, hide }}>
                {view === 'chart' ? children : <DataTable {...table} />}
            </TipContext.Provider>

            {footnote && <p className="mt-4 text-xs text-gray-400">{footnote}</p>}

            {tip && view === 'chart' && (
                <div
                    className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full -mt-3 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg max-w-[220px]"
                    style={{ left: tip.x, top: tip.y }}
                    role="status"
                >
                    {tip.content}
                </div>
            )}
        </section>
    );
}

function DataTable({ columns, rows }) {
    return (
        <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        {columns.map((c, i) => (
                            <th key={c} className={`py-2 px-1 font-semibold text-gray-500 text-xs uppercase tracking-wide ${i === 0 ? 'text-left' : 'text-right'}`}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, r) => (
                        <tr key={r} className="border-b border-gray-50 last:border-0">
                            {row.map((cell, i) => (
                                <td key={i} className={`py-2 px-1 ${i === 0 ? 'text-left text-gray-800' : 'text-right text-gray-600 tabular-nums'}`}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Legend — doubles as a highlight control
───────────────────────────────────────────── */
export function Legend({ items, highlight, onHighlight }) {
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {items.map(item => {
                const dimmed = highlight && highlight !== item.key;
                const Tag = onHighlight ? 'button' : 'span';
                return (
                    <Tag
                        key={item.key}
                        {...(onHighlight ? {
                            onClick: () => onHighlight(highlight === item.key ? null : item.key),
                            'aria-pressed': highlight === item.key,
                            title: highlight === item.key ? 'Show all groups' : `Highlight ${item.label}`,
                        } : {})}
                        className={`inline-flex items-center gap-1.5 text-xs text-gray-600 transition-opacity ${dimmed ? 'opacity-40' : ''} ${onHighlight ? 'hover:text-gray-900' : ''}`}
                    >
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                        {item.label}
                        {item.sub && <span className="text-gray-400">{item.sub}</span>}
                    </Tag>
                );
            })}
            {onHighlight && highlight && (
                <button onClick={() => onHighlight(null)} className="text-xs font-medium text-emerald-700 hover:underline">
                    Show all
                </button>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Horizontal bars — one bar per row, value at the tip
───────────────────────────────────────────── */
function Bar({ value, max, color, tip, ariaLabel, height = 16, dimmed }) {
    const markProps = useMarkProps(tip, ariaLabel);
    const width = Math.max((value / max) * 100, value > 0 ? 0.8 : 0);
    return (
        <div
            {...markProps}
            className={`relative rounded-r outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 transition-all duration-500 ease-out ${dimmed ? 'opacity-25' : ''}`}
            style={{ width: `${width}%`, height, backgroundColor: color }}
        />
    );
}

export function BarRows({ rows, max = 100, format = (v) => `${Math.round(v)}%`, reference }) {
    return (
        <div className="relative">
            {reference && (
                <div className="absolute inset-y-0 left-0 right-0 pointer-events-none grid grid-cols-[7.5rem_1fr_3rem] sm:grid-cols-[10.5rem_1fr_3rem] gap-3">
                    <span />
                    <span className="relative">
                        <span className="absolute inset-y-0 w-px bg-gray-300" style={{ left: `${(reference.value / max) * 100}%` }} />
                        <span className="absolute -top-5 -translate-x-1/2 text-[11px] text-gray-400 whitespace-nowrap" style={{ left: `${(reference.value / max) * 100}%` }}>
                            {reference.label}
                        </span>
                    </span>
                </div>
            )}
            <ul className={`space-y-3 ${reference ? 'pt-5' : ''}`}>
                {rows.map(row => (
                    <li key={row.key} className="grid grid-cols-[7.5rem_1fr_3rem] sm:grid-cols-[10.5rem_1fr_3rem] items-center gap-3">
                        <div className="min-w-0">
                            <p className={`text-sm text-gray-800 leading-snug ${row.dimmed ? 'opacity-40' : ''}`}>{row.label}</p>
                            {row.sub && <p className="text-[11px] text-gray-400">{row.sub}</p>}
                        </div>
                        <div className="h-4 flex items-center">
                            <Bar value={row.value} max={max} color={row.color} tip={row.tip} ariaLabel={`${row.label}: ${format(row.value)}`} dimmed={row.dimmed} />
                        </div>
                        <span className={`text-sm font-semibold text-gray-900 tabular-nums text-right ${row.dimmed ? 'opacity-40' : ''}`}>{format(row.value)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Grouped bars — one thin bar per group under each category
───────────────────────────────────────────── */
export function GroupedBarRows({ categories, max, format = (v) => `${Math.round(v)}%` }) {
    return (
        <ul className="space-y-4">
            {categories.map(cat => (
                <li key={cat.label} className="grid grid-cols-[7rem_1fr] sm:grid-cols-[10rem_1fr] gap-3 items-center">
                    <p className="text-sm text-gray-800 leading-snug">{cat.label}</p>
                    <div className="space-y-[2px]">
                        {cat.bars.map(bar => (
                            <div key={bar.key} className="flex items-center gap-2 h-3">
                                <Bar value={bar.value} max={max} color={bar.color} tip={bar.tip} height={10} dimmed={bar.dimmed} ariaLabel={`${cat.label}, ${bar.label}: ${format(bar.value)}`} />
                                <span className={`text-[11px] text-gray-500 tabular-nums whitespace-nowrap ${bar.dimmed ? 'opacity-40' : ''}`}>{format(bar.value)}</span>
                            </div>
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    );
}

/* ─────────────────────────────────────────────
   100% stacked bars — one row per group
───────────────────────────────────────────── */
function isDark(hex) {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}

function Segment({ segment, rowLabel }) {
    const markProps = useMarkProps(segment.tip, `${rowLabel}, ${segment.label}: ${Math.round(segment.value)}%`);
    const showLabel = segment.value >= 12;
    return (
        <div
            {...markProps}
            className="h-full flex items-center justify-center first:rounded-l last:rounded-r outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 transition-all duration-500 ease-out hover:brightness-110"
            style={{ flexGrow: segment.value, flexBasis: 0, backgroundColor: segment.color }}
        >
            {showLabel && (
                <span className={`text-[11px] font-semibold tabular-nums ${isDark(segment.color) ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(segment.value)}%
                </span>
            )}
        </div>
    );
}

export function StackedRows({ rows }) {
    return (
        <ul className="space-y-3">
            {rows.map(row => (
                <li key={row.key} className={`grid grid-cols-[7.5rem_1fr] sm:grid-cols-[10.5rem_1fr] items-center gap-3 transition-opacity ${row.dimmed ? 'opacity-30' : ''}`}>
                    <div className="min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">{row.label}</p>
                        {row.sub && <p className="text-[11px] text-gray-400">{row.sub}</p>}
                    </div>
                    <div className="flex h-7 gap-[2px]">
                        {row.segments.filter(s => s.value > 0).map(segment => (
                            <Segment key={segment.key} segment={segment} rowLabel={row.label} />
                        ))}
                    </div>
                </li>
            ))}
        </ul>
    );
}

/* ─────────────────────────────────────────────
   Tooltip content helper
───────────────────────────────────────────── */
export function Tip({ title, lines }) {
    return (
        <div>
            <p className="font-semibold">{title}</p>
            {lines.map((line, i) => <p key={i} className="text-white/80 mt-0.5">{line}</p>)}
        </div>
    );
}
