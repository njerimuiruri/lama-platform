"use client";
import React, { useState, useMemo } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';
import Image from 'next/image';
import {
    Globe, DollarSign, MapPin, TrendingUp, ArrowRight, Info,
    Shield, Eye, Layers, Award, Users, BookOpen,
    Sparkles, CheckCircle2, X, Calendar, Tag, Activity
} from 'lucide-react';

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

function getCountryFill(count, isAfrican) {
    if (!isAfrican) return '#e5e7eb';
    if (count === 0) return '#d1fae5';
    if (count <= 5) return '#6ee7b7';
    if (count <= 10) return '#34d399';
    if (count <= 20) return '#10b981';
    return '#0d9c5a';
}

function getMarkerStyle(count, maxCount) {
    const intensity = count / Math.max(maxCount, 1);
    let color, radius;
    if (intensity > 0.7) { color = '#0d9c5a'; radius = 10; }
    else if (intensity > 0.5) { color = '#10b981'; radius = 8; }
    else if (intensity > 0.3) { color = '#34d399'; radius = 6; }
    else { color = '#6ee7b7'; radius = 5; }
    return { color, radius };
}

const AfricaMapSection = ({ projects = [], mode = 'full' }) => {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [activeFeature, setActiveFeature] = useState(0);

    const stats = useMemo(() => {
        if (!projects.length) return { totalProjects: 0, totalCountries: 0, totalFunding: '0' };
        const uniqueCountries = new Set(projects.map(p => p.Country)).size;
        const totalFunding = projects.reduce((sum, p) =>
            sum + parseFloat(p['Project Amount ($ Million)'] || 0), 0);
        return { totalProjects: projects.length, totalCountries: uniqueCountries, totalFunding: totalFunding.toFixed(1) };
    }, [projects]);

    const countryData = useMemo(() => {
        const grouped = {};
        projects.forEach(project => {
            const raw = project.Country;
            const country = normaliseCountry(raw);
            if (!grouped[country]) {
                grouped[country] = { count: 0, funding: 0, region: project.Region || 'Other', projects: [] };
            }
            grouped[country].count++;
            grouped[country].funding += parseFloat(project['Project Amount ($ Million)'] || 0);
            grouped[country].projects.push(project);
        });
        return grouped;
    }, [projects]);

    // Also keep raw-name keyed data for sidebar lists (original names)
    const countryDataRaw = useMemo(() => {
        const grouped = {};
        projects.forEach(project => {
            const country = project.Country;
            if (!grouped[country]) {
                grouped[country] = { count: 0, funding: 0, region: project.Region || 'Other', projects: [] };
            }
            grouped[country].count++;
            grouped[country].funding += parseFloat(project['Project Amount ($ Million)'] || 0);
            grouped[country].projects.push(project);
        });
        return grouped;
    }, [projects]);

    const regionData = useMemo(() => {
        const grouped = {};
        projects.forEach(project => {
            const region = project.Region || 'Other';
            if (!grouped[region]) grouped[region] = { count: 0, funding: 0, countries: new Set() };
            grouped[region].count++;
            grouped[region].funding += parseFloat(project['Project Amount ($ Million)'] || 0);
            grouped[region].countries.add(project.Country);
        });
        return Object.entries(grouped)
            .map(([name, data]) => ({ name, count: data.count, funding: data.funding.toFixed(1), countries: data.countries.size }))
            .sort((a, b) => b.count - a.count);
    }, [projects]);

    const topCountries = useMemo(() => {
        return Object.entries(countryDataRaw)
            .map(([country, data]) => ({ country, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [countryDataRaw]);

    const locationGroups = useMemo(() => {
        const groups = {};
        projects.forEach(project => {
            if (project.Latitude && project.Longitude) {
                const key = `${project.Latitude},${project.Longitude}`;
                if (!groups[key]) {
                    groups[key] = {
                        lat: parseFloat(project.Latitude),
                        lng: parseFloat(project.Longitude),
                        country: project.Country,
                        normalisedCountry: normaliseCountry(project.Country),
                        projects: [],
                    };
                }
                groups[key].projects.push(project);
            }
        });
        return Object.values(groups);
    }, [projects]);

    const maxMarkerCount = useMemo(() =>
        Math.max(...locationGroups.map(g => g.projects.length), 1),
        [locationGroups]);

    const features = [
        { icon: Shield, title: 'Equity & Inclusivity', description: 'Co-creating metrics with vulnerable communities to ensure their voices shape adaptation strategies', stat: '50% of 1.5B', statLabel: 'vulnerable farmers', color: 'from-emerald-500 to-green-600' },
        { icon: Eye, title: 'Real-time Tracking & Reporting', description: 'Monitor expenditures, budget allocation, and policy integration with transparent, accessible dashboards', stat: 'Live Data', statLabel: 'tracking system', color: 'from-blue-500 to-cyan-600' },
        { icon: Layers, title: 'Knowledge Sharing and Learning', description: 'Simplified presentation of indicators, sectors, and budgets — your one-stop shop for LLA resources', stat: 'All-in-One', statLabel: 'platform hub', color: 'from-purple-500 to-pink-600' },
        { icon: Award, title: 'Expert Network', description: 'Guided by 10+ African adaptation experts linking local metrics to global frameworks', stat: '10+ Experts', statLabel: 'advisory group', color: 'from-orange-500 to-red-600' },
    ];

    const showIntro = mode === 'full' || mode === 'intro-only';
    const showMap = mode === 'full' || mode === 'map-only';

    // For choropleth: build a lookup keyed on topojson name
    const geoFillMap = countryData;

    return (
        <div className={`bg-gradient-to-br from-[#eefdf5] via-white to-emerald-50 ${showMap ? 'min-h-screen' : ''}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-[#0d9c5a]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 py-16">
                <div className="container mx-auto px-4 max-w-7xl">

                    {showIntro && (<>
                        {/* Hero — About LAMA */}
                        <section className="mb-20">
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 bg-white border border-[#0d9c5a] rounded-full px-6 py-3 shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
                                    <Sparkles className="w-5 h-5 text-[#0d9c5a] animate-pulse" />
                                    <span className="text-[#0d9c5a] text-sm font-bold tracking-wide uppercase">Introducing LAMA</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                                    Bridging the Gap in
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9c5a] via-emerald-500 to-green-600 block mt-2">
                                        Locally Led Adaptation
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                                    Empowering African communities through data-driven climate adaptation insights and collaborative frameworks
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                                <div className="grid lg:grid-cols-2">
                                    <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0d9c5a]/20 via-emerald-600/10 to-transparent z-10"></div>
                                        <Image
                                            src="/images/fgd1.jpg"
                                            alt="LAMA Community Engagement"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            priority
                                        />
                                        <div className="absolute inset-0 z-20 flex items-end justify-center p-8 md:p-12">
                                            <button
                                                onClick={() => window.location.href = '/about'}
                                                className="group bg-white hover:bg-[#0d9c5a] text-[#0d9c5a] hover:text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 border-2 border-[#0d9c5a]"
                                            >
                                                Learn More About LAMA
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-[#eefdf5]">
                                        <div className="space-y-6">
                                            <div className="inline-flex items-center gap-2 bg-[#0d9c5a]/10 border border-[#0d9c5a]/30 rounded-full px-4 py-2">
                                                <BookOpen className="w-4 h-4 text-[#0d9c5a]" />
                                                <span className="text-[#0d9c5a] text-sm font-bold">Our Mission</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">What is LAMA?</h2>
                                            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                                                <p>
                                                    Despite growing interest in accelerating <span className="font-bold text-[#0d9c5a]">locally led adaptation (LLA)</span>, evidence on effective interventions, vulnerability-specific approaches, and investment opportunities remains scarce.
                                                </p>
                                                <p>
                                                    This gap exists primarily due to the <span className="font-bold text-gray-900">absence of dedicated bottom-up indicators</span> or community-led frameworks and metrics.
                                                </p>
                                                <p>
                                                    Africa hosts numerous adaptation interventions operating in isolation, hindered by geographical, linguistic, and sectoral disparities. <span className="font-bold text-[#0d9c5a]">LAMA changes this.</span>
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#0d9c5a]/20">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-[#0d9c5a] rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Our Solution</h3>
                                                        <p className="text-gray-700">
                                                            LAMA fosters learning and consolidates locally led adaptation indicators across Africa, linking local metrics to national and international frameworks like NAPs, NDCs, and the Global Goal on Adaptation.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Why LAMA Matters */}
                        <section className="mb-20">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                    Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9c5a] to-emerald-600">LAMA  Matters </span>
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Four transformative pillars creating real impact for climate adaptation
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    const isActive = activeFeature === index;
                                    return (
                                        <div
                                            key={index}
                                            onMouseEnter={() => setActiveFeature(index)}
                                            className={`group relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer ${isActive ? 'border-[#0d9c5a] shadow-2xl scale-105 -translate-y-2' : 'border-gray-100 hover:border-[#0d9c5a]/50 hover:shadow-xl'}`}
                                        >
                                            <div className={`inline-flex p-4 rounded-2xl mb-4 bg-gradient-to-br ${feature.color} transform transition-transform duration-300 ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-105'}`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0d9c5a] transition-colors duration-300">{feature.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
                                            <div className={`inline-flex flex-col items-start bg-gradient-to-br ${feature.color} text-white px-4 py-2 rounded-lg`}>
                                                <span className="text-lg font-black">{feature.stat}</span>
                                                <span className="text-xs opacity-90">{feature.statLabel}</span>
                                            </div>
                                            <div className={`absolute bottom-4 right-4 transform transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
                                                <ArrowRight className="w-5 h-5 text-[#0d9c5a]" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </>)}

                    {showMap && (
                        <section>
                            {/* Section header */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#eefdf5] to-green-100 border border-[#0d9c5a]/30 rounded-full px-6 py-3 mb-6">
                                    <MapPin className="w-5 h-5 text-[#0d9c5a]" />
                                    <span className="text-[#0d9c5a] text-sm font-semibold">Where the work is happening</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                    Africa&apos;s Climate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9c5a] to-emerald-600">Resilience Map</span>
                                </h2>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    This map shows every climate adaptation project we track across Africa — who is doing the work, where, and how much has been invested.
                                </p>
                            </div>

                            {/* At-a-glance stats banner */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { value: stats.totalProjects, label: 'Climate projects tracked', icon: Globe, color: 'from-emerald-500 to-teal-600' },
                                    { value: stats.totalCountries, label: 'African countries covered', icon: MapPin, color: 'from-green-500 to-emerald-600' },
                                    { value: `$${stats.totalFunding}M`, label: 'Total funding recorded', icon: DollarSign, color: 'from-teal-500 to-cyan-600' },
                                ].map(({ value, label, icon: Icon, color }) => (
                                    <div key={label} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-3xl font-black text-gray-900">{value}</p>
                                        <p className="text-sm text-gray-500 mt-1">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Map Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Project Map</h3>
                                        <p className="text-sm text-gray-500 mt-1">Each dot marks a project location. Countries are shaded by how many projects they have.</p>
                                    </div>
                                </div>

                                {/* How to read this map */}
                                <div className="bg-[#eefdf5] border border-[#0d9c5a]/20 rounded-xl p-4 mb-5 flex flex-wrap gap-6 items-start">
                                    <div className="flex items-start gap-3 min-w-[200px]">
                                        <div className="w-8 h-8 rounded bg-[#0d9c5a] flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700"><strong className="text-gray-900">Darker green country</strong> = more climate projects happening there</p>
                                    </div>
                                    <div className="flex items-start gap-3 min-w-[200px]">
                                        <div className="w-8 h-8 rounded-full bg-[#0d9c5a] flex-shrink-0 mt-0.5" style={{ opacity: 0.8 }} />
                                        <p className="text-sm text-gray-700"><strong className="text-gray-900">Each circle</strong> marks the exact location of a project — bigger circle = more activity at that spot</p>
                                    </div>
                                    <div className="flex items-start gap-3 min-w-[200px]">
                                        <Info className="w-8 h-8 text-[#0d9c5a] flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700"><strong className="text-gray-900">Click</strong> any country or circle to see all projects there — a full list expands below the map</p>
                                    </div>
                                </div>

                                <div className="relative bg-gradient-to-br from-[#eefdf5] to-emerald-50 rounded-xl overflow-hidden border border-gray-200" style={{ height: '600px' }}>
                                    <ComposableMap
                                        projection="geoMercator"
                                        projectionConfig={{ rotate: [-22, 0, 0], center: [0, -3], scale: 390 }}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <ZoomableGroup center={[0, 0]} zoom={1} minZoom={0.9} maxZoom={6}>
                                            <Geographies geography={GEO_URL}>
                                                {({ geographies }) =>
                                                    geographies.map(geo => {
                                                        const name = geo.properties.name;
                                                        const isAfrican = AFRICA_COUNTRIES.has(name);
                                                        const data = geoFillMap[name];
                                                        const count = data?.count ?? 0;
                                                        const fill = getCountryFill(count, isAfrican);
                                                        const isHovered = hoveredCountry && normaliseCountry(hoveredCountry) === name;

                                                        return (
                                                            <Geography
                                                                key={geo.rsmKey}
                                                                geography={geo}
                                                                fill={isHovered ? '#F59E0B' : fill}
                                                                stroke="#fff"
                                                                strokeWidth={0.5}
                                                                style={{
                                                                    default: { outline: 'none' },
                                                                    hover: { outline: 'none', fill: isAfrican ? '#fbbf24' : '#d1d5db', cursor: isAfrican ? 'pointer' : 'default' },
                                                                    pressed: { outline: 'none' },
                                                                }}
                                                                onMouseEnter={() => { if (isAfrican && count > 0) setHoveredCountry(name); }}
                                                                onMouseLeave={() => setHoveredCountry(null)}
                                                                onClick={() => { if (isAfrican && count > 0) setSelectedCountry(name); }}
                                                            />
                                                        );
                                                    })
                                                }
                                            </Geographies>

                                            {locationGroups.map((group, idx) => {
                                                const data = countryData[group.normalisedCountry];
                                                const { color, radius } = getMarkerStyle(data?.count || 1, maxMarkerCount);
                                                const isHovered = hoveredCountry === group.normalisedCountry || hoveredCountry === group.country;
                                                return (
                                                    <Marker key={idx} coordinates={[group.lng, group.lat]}>
                                                        <circle
                                                            r={isHovered ? radius + 3 : radius}
                                                            fill={isHovered ? '#F59E0B' : color}
                                                            stroke="#fff"
                                                            strokeWidth={isHovered ? 2.5 : 1.5}
                                                            fillOpacity={isHovered ? 0.95 : 0.75}
                                                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                            onMouseEnter={() => setHoveredCountry(group.normalisedCountry)}
                                                            onMouseLeave={() => setHoveredCountry(null)}
                                                            onClick={() => setSelectedCountry(group.normalisedCountry)}
                                                        />
                                                    </Marker>
                                                );
                                            })}
                                        </ZoomableGroup>
                                    </ComposableMap>

                                    {/* Hover card — plain-English sentences */}
                                    {hoveredCountry && (() => {
                                        const d = countryData[hoveredCountry] || countryData[normaliseCountry(hoveredCountry)];
                                        if (!d) return null;
                                        return (
                                            <div className="absolute top-4 right-4 z-[1000] bg-white rounded-2xl shadow-2xl border-2 border-[#0d9c5a] p-5 w-72 animate-fadeIn pointer-events-none">
                                                {/* Country name */}
                                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                                                    <div className="w-10 h-10 bg-[#0d9c5a] rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <MapPin className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{d.region}</p>
                                                        <h3 className="text-xl font-black text-gray-900 leading-tight">{hoveredCountry}</h3>
                                                    </div>
                                                </div>

                                                {/* Human-readable summary sentence */}
                                                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                                    <strong className="text-[#0d9c5a]">{hoveredCountry}</strong> has{' '}
                                                    <strong>{d.count} climate adaptation {d.count === 1 ? 'project' : 'projects'}</strong>{' '}
                                                    with a total recorded investment of{' '}
                                                    <strong>${d.funding.toFixed(1)} million</strong>.
                                                </p>

                                                {/* Key numbers */}
                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                    <div className="bg-[#eefdf5] rounded-xl p-3 text-center">
                                                        <p className="text-2xl font-black text-[#0d9c5a]">{d.count}</p>
                                                        <p className="text-xs text-gray-500 font-medium">Projects</p>
                                                    </div>
                                                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                                        <p className="text-2xl font-black text-emerald-700">${d.funding.toFixed(1)}M</p>
                                                        <p className="text-xs text-gray-500 font-medium">Invested</p>
                                                    </div>
                                                </div>

                                                {/* Sample project titles */}
                                                {d.projects.slice(0, 2).length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Example projects in this country</p>
                                                        {d.projects.slice(0, 2).map((proj, i) => (
                                                            <div key={i} className="flex items-start gap-2 mb-2">
                                                                <span className="w-4 h-4 bg-[#0d9c5a] rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                                                                    <span className="text-white text-[8px] font-bold">{i + 1}</span>
                                                                </span>
                                                                <p className="text-xs text-gray-600 leading-snug">
                                                                    {proj['Adaptation Interventions']?.substring(0, 70)}…
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Legend — plain words */}
                                <div className="mt-6 bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 text-center">How to read the colours</p>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {[
                                            { color: '#e5e7eb', label: 'Outside Africa' },
                                            { color: '#d1fae5', label: 'In Africa, no projects yet' },
                                            { color: '#6ee7b7', label: 'A few projects (1–5)' },
                                            { color: '#34d399', label: 'Some projects (6–10)' },
                                            { color: '#10b981', label: 'Many projects (11–20)' },
                                            { color: '#0d9c5a', label: 'Most active (20+)' },
                                        ].map(({ color, label }) => (
                                            <div key={label} className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded flex-shrink-0" style={{ backgroundColor: color, border: '1px solid #d1d5db' }} />
                                                <span className="text-xs text-gray-600">{label}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: '#0d9c5a', border: '2px solid #fff', boxShadow: '0 0 0 1.5px #0d9c5a' }} />
                                            <span className="text-xs text-gray-600">Exact project location</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Country Projects Panel ─────────────────────────────────── */}
                            {selectedCountry && (() => {
                                const d = countryData[selectedCountry];
                                if (!d) return null;
                                return (
                                    <div className="mb-8 bg-white rounded-2xl shadow-xl border-2 border-[#0d9c5a] overflow-hidden animate-fadeIn">
                                        {/* Panel header */}
                                        <div className="flex items-center justify-between bg-gradient-to-r from-[#0d9c5a] to-emerald-600 px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-black text-lg leading-tight">{selectedCountry}</h3>
                                                    <p className="text-green-100 text-sm">
                                                        {d.count} project{d.count !== 1 ? 's' : ''} · ${d.funding.toFixed(1)}M invested · {d.region}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedCountry(null)}
                                                className="text-white/70 hover:text-white transition-colors p-1"
                                                aria-label="Close"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {/* Stats row */}
                                        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                                            {[
                                                { icon: Activity, label: 'Projects', value: d.count },
                                                { icon: DollarSign, label: 'Total invested', value: `$${d.funding.toFixed(1)}M` },
                                                { icon: Globe, label: 'Region', value: d.region },
                                            ].map(({ icon: Icon, label, value }) => (
                                                <div key={label} className="flex items-center gap-3 px-6 py-4">
                                                    <div className="w-8 h-8 bg-[#eefdf5] rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Icon className="w-4 h-4 text-[#0d9c5a]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400">{label}</p>
                                                        <p className="font-bold text-gray-900 text-sm">{value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Project list */}
                                        <div className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                                            {d.projects.map((proj, i) => (
                                                <div key={i} className="px-6 py-5 hover:bg-[#eefdf5] transition-colors">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <span className="w-6 h-6 bg-[#0d9c5a] rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            {i + 1}
                                                        </span>
                                                        <h4 className="font-bold text-gray-900 text-sm leading-snug">
                                                            {proj['Adaptation Interventions']}
                                                        </h4>
                                                    </div>
                                                    <div className="ml-9 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-gray-500">
                                                        {proj['Thematic Area(s)'] && (
                                                            <span className="flex items-center gap-1">
                                                                <Tag className="w-3 h-3 text-[#0d9c5a]" />
                                                                {proj['Thematic Area(s)']}
                                                            </span>
                                                        )}
                                                        {proj.Funders && (
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-3 h-3 text-[#0d9c5a]" />
                                                                {proj.Funders}
                                                            </span>
                                                        )}
                                                        {proj.Period && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3 text-[#0d9c5a]" />
                                                                {proj.Period}
                                                            </span>
                                                        )}
                                                        {proj['Project Amount ($ Million)'] && (
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="w-3 h-3 text-[#0d9c5a]" />
                                                                ${proj['Project Amount ($ Million)']}M
                                                            </span>
                                                        )}
                                                        {proj['Implementation Status'] && (
                                                            <span className={`px-2 py-0.5 rounded-full font-semibold ${proj['Implementation Status'] === 'Under Implementation' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {proj['Implementation Status']}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Where is the work happening + Which countries lead */}
                            <div className="grid lg:grid-cols-2 gap-8 mb-12">

                                {/* Regions panel */}
                                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Where in Africa?</h3>
                                            <p className="text-sm text-gray-500 mt-1">Africa is split into regions — here is how the work is spread out across them.</p>
                                        </div>
                                        <TrendingUp className="w-6 h-6 text-[#0d9c5a] flex-shrink-0 mt-1" />
                                    </div>
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mt-5">
                                        {regionData.length > 0 ? regionData.map((region, index) => (
                                            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-[#eefdf5] rounded-xl border border-gray-200 hover:border-[#0d9c5a] hover:shadow-md transition-all duration-300">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-gray-900">{region.name}</h4>
                                                    <span className="px-3 py-1 bg-[#eefdf5] text-[#0d9c5a] rounded-full text-sm font-semibold">{region.count} projects</span>
                                                </div>
                                                {/* Progress bar showing share of total */}
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#0d9c5a] to-emerald-500 rounded-full"
                                                        style={{ width: `${(region.count / stats.totalProjects) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex gap-6 text-sm">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Countries involved</p>
                                                        <p className="text-gray-900 font-bold">{region.countries}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Total investment</p>
                                                        <p className="text-gray-900 font-bold">${region.funding}M</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-xs">Share of all projects</p>
                                                        <p className="text-gray-900 font-bold">{Math.round((region.count / stats.totalProjects) * 100)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : <p className="text-center text-gray-500">No regional data available</p>}
                                    </div>
                                </div>

                                {/* Top countries panel */}
                                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Most Active Countries</h3>
                                            <p className="text-sm text-gray-500 mt-1">These are the countries with the most climate adaptation work happening right now. Hover to highlight them on the map.</p>
                                        </div>
                                        <MapPin className="w-6 h-6 text-[#0d9c5a] flex-shrink-0 mt-1" />
                                    </div>
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mt-5">
                                        {topCountries.length > 0 ? topCountries.map((country, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${hoveredCountry === normaliseCountry(country.country) || selectedCountry === normaliseCountry(country.country) ? 'border-[#0d9c5a] bg-[#eefdf5] shadow-lg' : 'border-gray-200 bg-gray-50 hover:border-[#0d9c5a] hover:bg-[#eefdf5] hover:shadow-md'}`}
                                                onMouseEnter={() => setHoveredCountry(normaliseCountry(country.country))}
                                                onMouseLeave={() => setHoveredCountry(null)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center justify-center w-7 h-7 bg-[#0d9c5a] text-white rounded-full text-xs font-black flex-shrink-0">
                                                            {index + 1}
                                                        </span>
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight">{country.country.trim()}</p>
                                                            <p className="text-xs text-gray-400">{country.region}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-[#0d9c5a] text-lg">{country.count}</p>
                                                        <p className="text-xs text-gray-400">projects</p>
                                                    </div>
                                                </div>
                                                {/* How much of the top country's count */}
                                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#0d9c5a] to-emerald-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${(country.count / topCountries[0].count) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">${country.funding.toFixed(1)}M invested</p>
                                            </div>
                                        )) : <p className="text-center text-gray-500">No country data available</p>}
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-[#0d9c5a] to-emerald-600 rounded-3xl p-8 md:p-12 shadow-2xl text-center text-white">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
                                        <Sparkles className="w-4 h-4 text-white" />
                                        <span className="text-white text-sm font-semibold">Want to explore the full picture?</span>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black mb-4">Browse All {stats.totalProjects} Projects</h3>
                                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                        Filter projects by country, region, or topic. Every entry includes who is funding it, what they are doing, and how much has been invested — all in plain, easy-to-understand language.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = '/resources/interventions-database'}
                                        className="group bg-white text-[#0d9c5a] px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
                                    >
                                        Open the Project Database
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
};

export default AfricaMapSection;
