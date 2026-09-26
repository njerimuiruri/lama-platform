"use client";
import React, { useState, useMemo, useCallback } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';
import Image from 'next/image';
import CountrySnapshotModal from './CountrySnapshotModal';
import { ArrowRight, Minus, Plus, RotateCcw } from 'lucide-react';
import { formatMoney } from '@/lib/formatMoney';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// African country names as they appear in the world-atlas topojson
const AFRICA_COUNTRIES = new Set([
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros',
    'Dem. Rep. Congo', 'Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea',
    'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
    'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
    'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco',
    'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
    'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone',
    'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo',
    'Tunisia', 'Uganda', 'W. Sahara', 'Zambia', 'Zimbabwe',
]);

// Normalise project data country names → topojson names
const COUNTRY_NAME_MAP = {
    'Angola ': 'Angola',
    'Cameroon ': 'Cameroon',
    'Central African Republic': 'Central African Republic',
    ' Central African Republic': 'Central African Republic',
    'Côte d\'Ivoire': 'Ivory Coast',
    'Democratic Republic of the Congo': 'Dem. Rep. Congo',
    'Eritrea ': 'Eritrea',
    'Gabon ': 'Gabon',
    'Guinea ': 'Guinea',
    'Guinea-Bissau ': 'Guinea-Bissau',
    'Mauritius ': 'Mauritius',
    'Sierra Leone ': 'Sierra Leone',
    'Somalia ': 'Somalia',
    'Swaziland': 'Eswatini',
    'Togo ': 'Togo',
    'Chad ': 'Chad',
    'United Republic of Tanzania': 'Tanzania',
    'Mauritania ': 'Mauritania',
};

function normaliseCountry(name) {
    return COUNTRY_NAME_MAP[name] ?? name.trim();
}

function normaliseRegion(region) {
    const value = (region || '').trim();
    if (!value || value.toLowerCase() === 'none') return 'Other';
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const amountOf = (project) => parseFloat(project['Project Amount ($ Million)'] || 0) || 0;

// Short labels for the theme filter chips
const THEME_LABELS = {
    'Multi Sector': 'Multi-sector',
    'Infrastructure and Human Settlement': 'Infrastructure',
    'Agriculture and Food Security': 'Agriculture',
    'Ecosystems and Biodiversity': 'Ecosystems',
    'Water': 'Water',
    'Poverty and Livelihoods': 'Livelihoods',
    'Health': 'Health',
};

const SHADES = ['#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#0d9c5a'];

// Shade a country by its share of the largest value on the map
function getCountryFill(value, max, isAfrican) {
    if (!isAfrican) return '#e5e7eb';
    if (!value) return SHADES[0];
    const ratio = value / Math.max(max, 1);
    if (ratio > 0.6) return SHADES[5];
    if (ratio > 0.35) return SHADES[4];
    if (ratio > 0.15) return SHADES[3];
    if (ratio > 0.05) return SHADES[2];
    return SHADES[1];
}

function getMarkerStyle(count, maxCount) {
    const intensity = count / Math.max(maxCount, 1);
    if (intensity > 0.7) return { color: '#0d9c5a', radius: 9 };
    if (intensity > 0.5) return { color: '#10b981', radius: 7.5 };
    if (intensity > 0.3) return { color: '#34d399', radius: 6 };
    return { color: '#6ee7b7', radius: 5 };
}

const DEFAULT_VIEW = { coordinates: [0, 0], zoom: 1 };

const AfricaMapSection = ({ projects = [], mode = 'full' }) => {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [activeTheme, setActiveTheme] = useState('all');
    const [metric, setMetric] = useState('count'); // 'count' | 'funding'
    const [view, setView] = useState(DEFAULT_VIEW);
    const closeSnapshot = useCallback(() => setSelectedCountry(null), []);

    const themes = useMemo(() => {
        const counts = {};
        projects.forEach(p => {
            const theme = (p['Thematic Area(s)'] || '').trim();
            if (theme && theme.toLowerCase() !== 'none') counts[theme] = (counts[theme] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, label: THEME_LABELS[name] ?? name, count }))
            .sort((a, b) => b.count - a.count);
    }, [projects]);

    const filtered = useMemo(() => (
        activeTheme === 'all' ? projects : projects.filter(p => (p['Thematic Area(s)'] || '').trim() === activeTheme)
    ), [projects, activeTheme]);

    // One entry per country (topojson names), used by the map, lists and snapshot
    const countryData = useMemo(() => {
        const grouped = {};
        filtered.forEach(project => {
            const country = normaliseCountry(project.Country);
            if (!grouped[country]) grouped[country] = { count: 0, funding: 0, regions: {}, projects: [] };
            const g = grouped[country];
            g.count++;
            g.funding += amountOf(project);
            const region = normaliseRegion(project.Region);
            if (region !== 'Other') g.regions[region] = (g.regions[region] || 0) + 1;
            g.projects.push(project);
        });
        Object.values(grouped).forEach(g => {
            g.region = Object.entries(g.regions).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Africa';
        });
        return grouped;
    }, [filtered]);

    const valueOf = useCallback((d) => (metric === 'funding' ? d?.funding : d?.count) || 0, [metric]);

    const stats = useMemo(() => ({
        totalProjects: filtered.length,
        totalCountries: Object.keys(countryData).length,
        totalFunding: filtered.reduce((sum, p) => sum + amountOf(p), 0),
    }), [filtered, countryData]);

    const maxCountryValue = useMemo(
        () => Math.max(...Object.values(countryData).map(valueOf), 1),
        [countryData, valueOf]);

    const regionData = useMemo(() => {
        const grouped = {};
        filtered.forEach(project => {
            const region = normaliseRegion(project.Region);
            grouped[region] = (grouped[region] || 0) + 1;
        });
        return Object.entries(grouped)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => (a.name === 'Other') - (b.name === 'Other') || b.count - a.count);
    }, [filtered]);

    const topCountries = useMemo(() => (
        Object.entries(countryData)
            .map(([country, data]) => ({ country, ...data, value: valueOf(data) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8)
    ), [countryData, valueOf]);

    const locationGroups = useMemo(() => {
        const groups = {};
        filtered.forEach(project => {
            if (project.Latitude && project.Longitude) {
                const key = `${project.Latitude},${project.Longitude}`;
                if (!groups[key]) {
                    groups[key] = {
                        lat: parseFloat(project.Latitude),
                        lng: parseFloat(project.Longitude),
                        country: normaliseCountry(project.Country),
                        projects: [],
                    };
                }
                groups[key].projects.push(project);
            }
        });
        return Object.values(groups);
    }, [filtered]);

    const maxMarkerCount = useMemo(() =>
        Math.max(...locationGroups.map(g => g.projects.length), 1),
        [locationGroups]);

    const zoomBy = (factor) => setView(v => ({ ...v, zoom: Math.min(Math.max(v.zoom * factor, 1), 6) }));
    const formatMetric = (d) => (metric === 'funding' ? formatMoney(d.funding) : d.count);

    const showIntro = mode === 'full' || mode === 'intro-only';
    const showMap = mode === 'full' || mode === 'map-only';

    return (
        <div className="relative bg-gradient-to-b from-[#eefdf5] to-white">

            <div className="relative z-10 py-10 lg:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {showIntro && (
                        /* What is LAMA? — short mission summary */
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid lg:grid-cols-12">
                            <div className="relative h-52 sm:h-64 lg:h-auto lg:col-span-4">
                                <Image
                                    src="/images/fgd1.jpg"
                                    alt="Community members at a LAMA focus group discussion"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                    priority
                                />
                            </div>

                            <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
                                    Our mission
                                </p>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is LAMA?</h2>
                                <p className="text-gray-600 leading-relaxed mt-3 max-w-2xl">
                                    LAMA brings locally led adaptation indicators from across Africa into one place, so
                                    that community priorities shape how adaptation is measured, reported and funded.
                                </p>

                                <ol className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-6 pt-6 border-t border-gray-100">
                                    {[
                                        { title: 'The gap', text: 'Evidence on what works in locally led adaptation is still scarce.' },
                                        { title: 'The cause', text: 'No bottom-up, community-led indicators, and projects working in isolation.' },
                                        { title: 'What LAMA does', text: 'Consolidates local indicators and links them to NAPs, NDCs and the Global Goal on Adaptation.' },
                                    ].map((point, i) => (
                                        <li key={point.title}>
                                            <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                                                {i + 1}
                                            </span>
                                            <h3 className="text-sm font-semibold text-gray-900">{point.title}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed mt-1">{point.text}</p>
                                        </li>
                                    ))}
                                </ol>

                                <a
                                    href="/AboutPage"
                                    className="group inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#0d9c5a] hover:text-emerald-800"
                                >
                                    Learn more about LAMA
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </section>
                    )}

                    {showMap && (
                        <section>
                            {/* Header row — database link lives here so it is always one click away */}
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
                                        Where the work is happening
                                    </p>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        Africa&apos;s climate resilience map
                                    </h2>
                                    <p className="text-gray-500 mt-2 max-w-xl">
                                        Explore adaptation projects by theme, country and investment.
                                    </p>
                                </div>
                                <a
                                    href="/resources/interventions-database"
                                    className="group inline-flex items-center gap-2 self-start sm:self-auto bg-[#0d9c5a] hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Open project database
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>

                            {/* Controls: theme filter + colour metric */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                                <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                                    {[{ name: 'all', label: 'All themes', count: projects.length }, ...themes].map(theme => {
                                        const isActive = activeTheme === theme.name;
                                        return (
                                            <button
                                                key={theme.name}
                                                onClick={() => setActiveTheme(theme.name)}
                                                className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${isActive
                                                    ? 'bg-gray-900 border-gray-900 text-white'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700'}`}
                                            >
                                                {theme.label}
                                                <span className={`tabular-nums ${isActive ? 'text-white/60' : 'text-gray-400'}`}>{theme.count}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2 text-xs flex-shrink-0">
                                    <span className="text-gray-500">Colour by</span>
                                    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                                        {[{ key: 'count', label: 'Projects' }, { key: 'funding', label: 'Investment' }].map(option => (
                                            <button
                                                key={option.key}
                                                onClick={() => setMetric(option.key)}
                                                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${metric === option.key ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

                                {/* Map card */}
                                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 flex flex-col lg:h-[500px]">
                                    <div className="relative rounded-xl overflow-hidden bg-[#f3fbf7] h-[320px] sm:h-[400px] lg:h-auto lg:flex-1">
                                        <ComposableMap
                                            projection="geoMercator"
                                            projectionConfig={{ rotate: [-22, 0, 0], center: [0, -3], scale: 390 }}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            <ZoomableGroup
                                                center={view.coordinates}
                                                zoom={view.zoom}
                                                minZoom={1}
                                                maxZoom={6}
                                                onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}
                                            >
                                                <Geographies geography={GEO_URL}>
                                                    {({ geographies }) =>
                                                        geographies.map(geo => {
                                                            const name = geo.properties.name;
                                                            const isAfrican = AFRICA_COUNTRIES.has(name);
                                                            const data = countryData[name];
                                                            const fill = getCountryFill(valueOf(data), maxCountryValue, isAfrican);
                                                            const isClickable = isAfrican && !!data;
                                                            const isActive = hoveredCountry === name || selectedCountry === name;

                                                            return (
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}
                                                                    fill={isActive ? '#F59E0B' : fill}
                                                                    stroke="#fff"
                                                                    strokeWidth={0.5}
                                                                    style={{
                                                                        default: { outline: 'none', transition: 'fill 0.3s ease' },
                                                                        hover: { outline: 'none', fill: isClickable ? '#fbbf24' : fill, cursor: isClickable ? 'pointer' : 'default' },
                                                                        pressed: { outline: 'none' },
                                                                    }}
                                                                    onMouseEnter={() => { if (isClickable) setHoveredCountry(name); }}
                                                                    onMouseLeave={() => setHoveredCountry(null)}
                                                                    onClick={() => { if (isClickable) setSelectedCountry(name); }}
                                                                />
                                                            );
                                                        })
                                                    }
                                                </Geographies>

                                                {locationGroups.map((group) => {
                                                    const { color, radius } = getMarkerStyle(group.projects.length, maxMarkerCount);
                                                    const isHovered = hoveredCountry === group.country;
                                                    const r = (isHovered ? radius + 2 : radius) / Math.sqrt(view.zoom);
                                                    return (
                                                        <Marker key={`${group.lat},${group.lng}`} coordinates={[group.lng, group.lat]}>
                                                            <circle
                                                                r={r}
                                                                fill={isHovered ? '#F59E0B' : color}
                                                                stroke="#fff"
                                                                strokeWidth={1.5 / Math.sqrt(view.zoom)}
                                                                fillOpacity={isHovered ? 0.95 : 0.8}
                                                                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
                                                                onMouseEnter={() => setHoveredCountry(group.country)}
                                                                onMouseLeave={() => setHoveredCountry(null)}
                                                                onClick={() => setSelectedCountry(group.country)}
                                                            />
                                                        </Marker>
                                                    );
                                                })}
                                            </ZoomableGroup>
                                        </ComposableMap>

                                        {/* Zoom controls */}
                                        <div className="absolute top-3 left-3 flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                                            <button onClick={() => zoomBy(1.5)} className="p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900" aria-label="Zoom in">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => zoomBy(1 / 1.5)} className="p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-100" aria-label="Zoom out">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setView(DEFAULT_VIEW)} className="p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-100" aria-label="Reset map view">
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Hover card */}
                                        {hoveredCountry && countryData[hoveredCountry] && (() => {
                                            const d = countryData[hoveredCountry];
                                            return (
                                                <div className="hidden sm:block absolute top-3 right-3 z-[1000] w-60 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 pointer-events-none">
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{d.region}</p>
                                                    <h3 className="text-base font-bold text-gray-900">{hoveredCountry}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <strong className="text-[#0d9c5a]">{d.count}</strong> {d.count === 1 ? 'project' : 'projects'} · <strong className="text-gray-900">{formatMoney(d.funding)}</strong>
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">Click for a country snapshot</p>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Compact legend */}
                                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1 pt-3 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <span>Less</span>
                                            <div className="flex">
                                                {SHADES.map(c => (
                                                    <span key={c} className="w-5 h-2.5 first:rounded-l last:rounded-r" style={{ backgroundColor: c }} />
                                                ))}
                                            </div>
                                            <span>More {metric === 'funding' ? 'investment' : 'projects'}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#0d9c5a] ring-2 ring-white shadow" />
                                                Project location
                                            </span>
                                            <span className="hidden sm:inline">Scroll or use + / − to zoom</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Side panel */}
                                <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden h-[460px] lg:h-[500px]">
                                    {/* Key numbers for the current filter */}
                                    <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                                        {[
                                            { value: stats.totalProjects, label: 'Projects' },
                                            { value: stats.totalCountries, label: 'Countries' },
                                        ].map(({ value, label }) => (
                                            <div key={label} className="px-3 py-4 text-center">
                                                <p className="text-lg font-bold text-gray-900 tabular-nums">{value}</p>
                                                <p className="text-xs text-gray-500">{label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                                        {/* Top countries by the chosen metric */}
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                                                Top countries · by {metric === 'funding' ? 'investment' : 'projects'}
                                            </p>
                                            <ul className="space-y-0.5 -mx-2.5">
                                                {topCountries.map((country) => (
                                                    <li key={country.country}>
                                                        <button
                                                            onClick={() => setSelectedCountry(country.country)}
                                                            onMouseEnter={() => setHoveredCountry(country.country)}
                                                            onMouseLeave={() => setHoveredCountry(null)}
                                                            className={`w-full text-left rounded-lg px-2.5 py-2 transition-colors ${hoveredCountry === country.country ? 'bg-[#eefdf5]' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="font-medium text-gray-800">{country.country}</span>
                                                                <span className="font-semibold text-gray-900 tabular-nums">{formatMetric(country)}</span>
                                                            </div>
                                                            <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                                <div
                                                                    className="h-full bg-[#0d9c5a] rounded-full transition-all duration-500"
                                                                    style={{ width: `${(country.value / (topCountries[0]?.value || 1)) * 100}%` }}
                                                                />
                                                            </div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Regions */}
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">By region</p>
                                            <ul className="space-y-2.5">
                                                {regionData.map((region) => {
                                                    const share = stats.totalProjects ? Math.round((region.count / stats.totalProjects) * 100) : 0;
                                                    return (
                                                        <li key={region.name}>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-700">{region.name}</span>
                                                                <span className="text-gray-500 tabular-nums"><strong className="text-gray-900 font-semibold">{region.count}</strong> · {share}%</span>
                                                            </div>
                                                            <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                                <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${share}%` }} />
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>

                                    <a
                                        href="/resources/interventions-database"
                                        className="group flex items-center justify-between px-5 py-3.5 border-t border-gray-100 text-sm font-semibold text-[#0d9c5a] hover:bg-[#eefdf5] transition-colors"
                                    >
                                        Browse all {projects.length} projects
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </aside>
                            </div>

                            {selectedCountry && countryData[selectedCountry] && (
                                <CountrySnapshotModal
                                    country={selectedCountry}
                                    projects={countryData[selectedCountry].projects}
                                    theme={activeTheme === 'all' ? null : (THEME_LABELS[activeTheme] ?? activeTheme)}
                                    onClose={closeSnapshot}
                                />
                            )}
                        </section>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AfricaMapSection;
