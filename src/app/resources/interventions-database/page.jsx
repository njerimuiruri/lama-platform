'use client';
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, LayoutList, Search, Table as TableIcon, X } from "lucide-react";
import projectsData from "../../../../data/data/projects.json";
import LamaNavbar from "@/components/Navbar/navbar";
import PlatformSubNav from "@/components/PlatformSubNav/PlatformSubNav";
import LamaFooter from "@/components/Footer/footer";
import DataGate from "@/components/ContentGate/DataGate";
import { formatMoney } from "@/lib/formatMoney";
import { amountOf, cleanValue, normaliseCountry, normaliseRegion, startYear } from "@/lib/projectData";

const InterventionsMap = dynamic(() => import("@/components/InterventionsMap/InterventionsMap"), {
    ssr: false,
    loading: () => <div className="aspect-[600/660] rounded-2xl bg-gray-100 animate-pulse" />,
});

const PAGE_SIZE = 10;
const STATUS_ONGOING = "Under Implementation";

// One clean record per project
const PROJECTS = projectsData.map((p, i) => ({
    id: i,
    title: p["Adaptation Interventions"],
    country: normaliseCountry(p.Country),
    region: normaliseRegion(p.Region),
    theme: cleanValue(p["Thematic Area(s)"]) ?? "Other",
    funder: cleanValue(p.Funders),
    instrument: cleanValue(p.Instruments),
    amount: amountOf(p),
    period: cleanValue(p.Period),
    start: startYear(p),
    status: p["Implementation Status"] === STATUS_ONGOING ? "Ongoing" : "Approved",
    raw: p,
}));

const optionsFor = (key) => {
    const counts = {};
    PROJECTS.forEach(p => { counts[p[key]] = (counts[p[key]] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])).map(([value, count]) => ({ value, count }));
};
const REGIONS = optionsFor("region");
const COUNTRIES = optionsFor("country");
const THEMES = optionsFor("theme");

const SORTS = {
    amount: { label: "Largest first", fn: (a, b) => b.amount - a.amount },
    newest: { label: "Newest first", fn: (a, b) => b.start - a.start },
    title: { label: "A–Z", fn: (a, b) => a.title.localeCompare(b.title) },
};

const EMPTY_FILTERS = { search: "", region: "", country: "", theme: "", status: "" };

function FilterSelect({ label, value, onChange, options, allLabel }) {
    return (
        <label className="block">
            <span className="sr-only">{label}</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full h-10 rounded-lg border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 ${value ? "border-emerald-300 text-gray-900" : "border-gray-200 text-gray-600"}`}
            >
                <option value="">{allLabel}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.value} ({o.count})</option>
                ))}
            </select>
        </label>
    );
}

function StatusPill({ status }) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${status === "Ongoing" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "Ongoing" ? "bg-emerald-500" : "bg-amber-500"}`} />
            {status}
        </span>
    );
}

function ProjectRow({ project, onHover }) {
    const details = [project.region, project.theme, project.funder && `Funded by ${project.funder}`].filter(Boolean);
    return (
        <li
            className="group flex items-start justify-between gap-4 px-4 sm:px-5 py-4 hover:bg-emerald-50/40 transition-colors"
            onMouseEnter={() => onHover(project.country)}
            onMouseLeave={() => onHover(null)}
        >
            <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">{project.title}</h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                    <span className="font-semibold text-gray-700">{project.country}</span>
                    {details.map(d => <span key={d}> · {d}</span>)}
                </p>
            </div>
            <div className="flex-shrink-0 text-right space-y-1">
                <p className="text-sm font-semibold text-gray-900 tabular-nums">{project.amount > 0 ? formatMoney(project.amount) : "—"}</p>
                {project.period && <p className="text-xs text-gray-500 tabular-nums">{project.period}</p>}
                <StatusPill status={project.status} />
            </div>
        </li>
    );
}

export default function InterventionsDatabase() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [sort, setSort] = useState("amount");
    const [view, setView] = useState("cards");
    const [page, setPage] = useState(0);
    const [hoveredCountry, setHoveredCountry] = useState(null);

    // Pre-select a country when linked from elsewhere (?country=Kenya)
    useEffect(() => {
        const param = new URLSearchParams(window.location.search).get("country");
        const country = param && normaliseCountry(param);
        if (country && COUNTRIES.some(c => c.value === country)) setFilters(f => ({ ...f, country }));
    }, []);

    const setFilter = (key, value) => {
        setFilters(f => ({ ...f, [key]: value }));
        setPage(0);
    };
    const clearFilters = () => { setFilters(EMPTY_FILTERS); setPage(0); };

    const filtered = useMemo(() => {
        const q = filters.search.trim().toLowerCase();
        return PROJECTS.filter(p =>
            (!q || [p.title, p.country, p.funder ?? ""].some(v => v.toLowerCase().includes(q))) &&
            (!filters.region || p.region === filters.region) &&
            (!filters.country || p.country === filters.country) &&
            (!filters.theme || p.theme === filters.theme) &&
            (!filters.status || p.status === filters.status)
        ).sort(SORTS[sort].fn);
    }, [filters, sort]);

    const summary = useMemo(() => ({
        countries: new Set(filtered.map(p => p.country)).size,
        amount: filtered.reduce((s, p) => s + p.amount, 0),
        ongoing: filtered.filter(p => p.status === "Ongoing").length,
    }), [filtered]);

    const pageCount = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
    const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    const activeChips = [
        filters.search && { key: "search", label: `“${filters.search}”` },
        filters.region && { key: "region", label: filters.region },
        filters.country && { key: "country", label: filters.country },
        filters.theme && { key: "theme", label: filters.theme },
        filters.status && { key: "status", label: filters.status },
    ].filter(Boolean);

    return (
        <>
            <LamaNavbar />
            <PlatformSubNav />
            <main className="bg-gray-50/60 min-h-screen">

                {/* Header */}
                <section className="bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Adaptation projects across Africa</h1>
                            <p className="text-gray-500 mt-1.5 max-w-2xl">
                                Search and filter {PROJECTS.length} locally led adaptation interventions by place, theme and status. Click a country on the map to filter.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur border-y border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 md:grid-cols-6 gap-2">
                        <label className="relative col-span-2">
                            <span className="sr-only">Search projects</span>
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                value={filters.search}
                                onChange={(e) => setFilter("search", e.target.value)}
                                placeholder="Search title, country or funder"
                                className="w-full h-10 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                            />
                        </label>
                        <FilterSelect label="Region" value={filters.region} onChange={(v) => setFilter("region", v)} options={REGIONS} allLabel="All regions" />
                        <FilterSelect label="Country" value={filters.country} onChange={(v) => setFilter("country", v)} options={COUNTRIES} allLabel="All countries" />
                        <FilterSelect label="Theme" value={filters.theme} onChange={(v) => setFilter("theme", v)} options={THEMES} allLabel="All themes" />
                        <FilterSelect
                            label="Status"
                            value={filters.status}
                            onChange={(v) => setFilter("status", v)}
                            options={["Ongoing", "Approved"].map(s => ({ value: s, count: PROJECTS.filter(p => p.status === s).length }))}
                            allLabel="Any status"
                        />
                    </div>
                </div>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
                    {/* Results bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                            <p><span className="font-bold text-gray-900">{filtered.length}</span> <span className="text-gray-500">projects</span></p>
                            <p><span className="font-bold text-gray-900">{summary.countries}</span> <span className="text-gray-500">{summary.countries === 1 ? "country" : "countries"}</span></p>
                            <p><span className="font-bold text-gray-900">{formatMoney(summary.amount)}</span> <span className="text-gray-500">total</span></p>
                            <p><span className="font-bold text-gray-900">{summary.ongoing}</span> <span className="text-gray-500">ongoing</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 flex items-center gap-2">
                                Sort
                                <select
                                    value={sort}
                                    onChange={(e) => { setSort(e.target.value); setPage(0); }}
                                    className="h-9 rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                >
                                    {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
                                </select>
                            </label>
                            <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1" role="group" aria-label="View">
                                {[{ key: "cards", icon: LayoutList, label: "Cards" }, { key: "table", icon: TableIcon, label: "Table" }].map(({ key, icon: Icon, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setView(key)}
                                        aria-pressed={view === key}
                                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-all ${view === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                                    >
                                        <Icon className="w-4 h-4" />{label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {activeChips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {activeChips.map(chip => (
                                <button
                                    key={chip.key}
                                    onClick={() => setFilter(chip.key, "")}
                                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                                >
                                    {chip.label} <X className="w-3 h-3" />
                                </button>
                            ))}
                            <button onClick={clearFilters} className="text-xs font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2">
                                Clear all
                            </button>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-5 gap-5 items-start">
                        {/* Map */}
                        <div className="lg:col-span-2 lg:sticky lg:top-[9.5rem]">
                            <InterventionsMap
                                projects={filtered.map(p => p.raw)}
                                selectedCountry={filters.country || null}
                                onSelectCountry={(country) => setFilter("country", country ?? "")}
                                highlightCountry={hoveredCountry}
                            />
                        </div>

                        {/* Projects */}
                        <div className="lg:col-span-3">
                            <DataGate variant="table" label="Interventions database" description="Register for free to browse every project in the interventions database.">
                                {filtered.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-gray-200 bg-white py-14 text-center">
                                        <p className="font-semibold text-gray-700">No projects match these filters</p>
                                        <button onClick={clearFilters} className="mt-3 text-sm font-medium text-emerald-700 hover:underline">Clear all filters</button>
                                    </div>
                                ) : view === "cards" ? (
                                    <ul className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
                                        {visible.map(p => <ProjectRow key={p.id} project={p} onHover={setHoveredCountry} />)}
                                    </ul>
                                ) : (
                                    <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                                                    <th className="py-3 px-4 font-semibold">Project</th>
                                                    <th className="py-3 px-4 font-semibold">Country</th>
                                                    <th className="py-3 px-4 font-semibold">Theme</th>
                                                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                                                    <th className="py-3 px-4 font-semibold">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visible.map(p => (
                                                    <tr key={p.id} className="border-b border-gray-50 last:border-0 align-top hover:bg-gray-50/60">
                                                        <td className="py-3 px-4 text-gray-900 min-w-[16rem]">
                                                            {p.title}
                                                            {p.funder && <p className="text-xs text-gray-500 mt-0.5">{p.funder}</p>}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{p.country}</td>
                                                        <td className="py-3 px-4 text-gray-700">{p.theme}</td>
                                                        <td className="py-3 px-4 text-gray-900 font-semibold text-right tabular-nums whitespace-nowrap">{p.amount > 0 ? formatMoney(p.amount) : "—"}</td>
                                                        <td className="py-3 px-4"><StatusPill status={p.status} /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {filtered.length > PAGE_SIZE && (
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <p className="text-gray-500 tabular-nums">
                                            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setPage(p => p - 1)}
                                                disabled={page === 0}
                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                                            >
                                                <ChevronLeft className="w-4 h-4" /> Previous
                                            </button>
                                            <button
                                                onClick={() => setPage(p => p + 1)}
                                                disabled={page >= pageCount - 1}
                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                                            >
                                                Next <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </DataGate>
                        </div>
                    </div>
                </section>
            </main>
            <LamaFooter />
        </>
    );
}
