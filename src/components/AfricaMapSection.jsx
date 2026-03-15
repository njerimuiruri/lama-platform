"use client";
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import Image from 'next/image';
import { Globe, DollarSign, MapPin, TrendingUp, ArrowRight, Info, Shield, Eye, Layers, Award, Target, Users, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Component to fit bounds when data changes
function MapBounds({ projects }) {
    const map = useMap();

    React.useEffect(() => {
        if (projects && projects.length > 0) {
            const bounds = projects
                .filter(p => p.Latitude && p.Longitude)
                .map(p => [parseFloat(p.Latitude), parseFloat(p.Longitude)]);

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [projects, map]);

    return null;
}

const AfricaMapSection = ({ projects = [], mode = 'full' }) => {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [activeFeature, setActiveFeature] = useState(0);

    // Calculate statistics
    const stats = useMemo(() => {
        if (!projects || projects.length === 0) {
            return { totalProjects: 0, totalCountries: 0, totalFunding: '0' };
        }

        const uniqueCountries = new Set(projects.map(p => p.Country)).size;
        const totalFunding = projects.reduce((sum, p) =>
            sum + parseFloat(p["Project Amount ($ Million)"] || 0), 0
        );

        return {
            totalProjects: projects.length,
            totalCountries: uniqueCountries,
            totalFunding: totalFunding.toFixed(1)
        };
    }, [projects]);

    // Group projects by country
    const countryData = useMemo(() => {
        if (!projects || projects.length === 0) return {};

        const grouped = {};
        projects.forEach(project => {
            const country = project.Country;
            if (!grouped[country]) {
                grouped[country] = {
                    count: 0,
                    funding: 0,
                    region: project.Region || 'Other',
                    projects: []
                };
            }
            grouped[country].count++;
            grouped[country].funding += parseFloat(project["Project Amount ($ Million)"] || 0);
            grouped[country].projects.push(project);
        });
        return grouped;
    }, [projects]);

    // Group by region
    const regionData = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        const grouped = {};
        projects.forEach(project => {
            const region = project.Region || 'Other';
            if (!grouped[region]) {
                grouped[region] = {
                    count: 0,
                    funding: 0,
                    countries: new Set()
                };
            }
            grouped[region].count++;
            grouped[region].funding += parseFloat(project["Project Amount ($ Million)"] || 0);
            grouped[region].countries.add(project.Country);
        });

        return Object.entries(grouped).map(([name, data]) => ({
            name,
            count: data.count,
            funding: data.funding.toFixed(1),
            countries: data.countries.size
        })).sort((a, b) => b.count - a.count);
    }, [projects]);

    // Top 10 countries by project count
    const topCountries = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        return Object.entries(countryData)
            .map(([country, data]) => ({
                country,
                ...data
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [countryData, projects]);

    // Get marker color and size based on project count
    const getMarkerStyle = (count) => {
        const maxCount = Math.max(...Object.values(countryData).map(d => d.count), 1);
        const intensity = count / maxCount;

        let color, radius;
        if (intensity > 0.7) {
            color = '#0d9c5a';
            radius = 12;
        } else if (intensity > 0.5) {
            color = '#10b981';
            radius = 10;
        } else if (intensity > 0.3) {
            color = '#34d399';
            radius = 8;
        } else {
            color = '#6ee7b7';
            radius = 6;
        }

        return { color, radius };
    };

    // Group projects by location to avoid overlapping markers
    const locationGroups = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        const groups = {};
        projects.forEach(project => {
            if (project.Latitude && project.Longitude) {
                const key = `${project.Latitude},${project.Longitude}`;
                if (!groups[key]) {
                    groups[key] = {
                        lat: parseFloat(project.Latitude),
                        lng: parseFloat(project.Longitude),
                        country: project.Country,
                        projects: []
                    };
                }
                groups[key].projects.push(project);
            }
        });

        return Object.values(groups);
    }, [projects]);

    const handleViewDashboard = () => {
        window.location.href = '/resources/interventions-database';
    };

    const features = [
        {
            icon: Shield,
            title: "Equity & Inclusivity",
            description: "Co-creating metrics with vulnerable communities to ensure their voices shape adaptation strategies",
            stat: "50% of 1.5B",
            statLabel: "vulnerable farmers",
            color: "from-emerald-500 to-green-600"
        },
        {
            icon: Eye,
            title: "Real-time Tracking",
            description: "Monitor expenditures, budget allocation, and policy integration with transparent, accessible dashboards",
            stat: "Live Data",
            statLabel: "tracking system",
            color: "from-blue-500 to-cyan-600"
        },
        {
            icon: Layers,
            title: "Knowledge Sharing",
            description: "Simplified presentation of indicators, sectors, and budgets - your one-stop shop for LLA resources",
            stat: "All-in-One",
            statLabel: "platform hub",
            color: "from-purple-500 to-pink-600"
        },
        {
            icon: Award,
            title: "Expert Network",
            description: "Guided by 10+ African adaptation experts linking local metrics to global frameworks",
            stat: "10+ Experts",
            statLabel: "advisory group",
            color: "from-orange-500 to-red-600"
        }
    ];

    const showIntro = mode === 'full' || mode === 'intro-only';
    const showMap = mode === 'full' || mode === 'map-only';

    return (
        <div className={`bg-gradient-to-br from-[#eefdf5] via-white to-emerald-50 ${showMap ? 'min-h-screen' : ''}`}>
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-[#0d9c5a]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    {showIntro && (<>
                    {/* Hero Section - About LAMA */}
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

                        {/* Main Content Card */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                            <div className="grid lg:grid-cols-2">
                                {/* Image Section with Overlay */}
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

                                    {/* Learn More Button Overlay */}
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

                                {/* Content Section */}
                                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-[#eefdf5]">
                                    <div className="space-y-6">
                                        <div className="inline-flex items-center gap-2 bg-[#0d9c5a]/10 border border-[#0d9c5a]/30 rounded-full px-4 py-2">
                                            <BookOpen className="w-4 h-4 text-[#0d9c5a]" />
                                            <span className="text-[#0d9c5a] text-sm font-bold">Our Mission</span>
                                        </div>

                                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                            What is LAMA?
                                        </h2>

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

                    {/* Interactive Features Section */}
                    <section className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9c5a] to-emerald-600">LAMA Matters</span>
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
                                        className={`group relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer ${isActive
                                            ? 'border-[#0d9c5a] shadow-2xl scale-105 -translate-y-2'
                                            : 'border-gray-100 hover:border-[#0d9c5a]/50 hover:shadow-xl'
                                            }`}
                                    >
                                        {/* Icon with gradient background */}
                                        <div className={`inline-flex p-4 rounded-2xl mb-4 bg-gradient-to-br ${feature.color} transform transition-transform duration-300 ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                                            }`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0d9c5a] transition-colors duration-300">
                                            {feature.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                            {feature.description}
                                        </p>

                                        {/* Stat Badge */}
                                        <div className={`inline-flex flex-col items-start bg-gradient-to-br ${feature.color} text-white px-4 py-2 rounded-lg`}>
                                            <span className="text-lg font-black">{feature.stat}</span>
                                            <span className="text-xs opacity-90">{feature.statLabel}</span>
                                        </div>

                                        {/* Hover Arrow */}
                                        <div className={`absolute bottom-4 right-4 transform transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                                            }`}>
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
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#eefdf5] to-green-100 border border-[#0d9c5a]/30 rounded-full px-6 py-3 mb-6">
                                <MapPin className="w-5 h-5 text-[#0d9c5a]" />
                                <span className="text-[#0d9c5a] text-sm font-semibold">Interactive Visualization</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                                Africa&apos;s Climate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9c5a] to-emerald-600">Resilience Map</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Explore adaptation projects across the continent. Hover over markers for detailed country insights.
                            </p>
                        </div>

                        {/* Interactive Map */}
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Project Distribution</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-[#eefdf5] px-4 py-2 rounded-full">
                                    <Info className="w-4 h-4 text-[#0d9c5a]" />
                                    <span>Hover over markers for details</span>
                                </div>
                            </div>

                            <div className="relative bg-gradient-to-br from-[#eefdf5] to-emerald-50 rounded-xl overflow-hidden border border-gray-200" style={{ height: '600px' }}>
                                <MapContainer
                                    center={[2, 20]}
                                    zoom={4}
                                    minZoom={3}
                                    maxZoom={10}
                                    maxBounds={[
                                        [-40, -25],
                                        [40, 55]
                                    ]}
                                    maxBoundsViscosity={1.0}
                                    style={{ height: '100%', width: '100%' }}
                                    className="rounded-xl"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapBounds projects={projects} />

                                    {locationGroups.map((group, idx) => {
                                        const data = countryData[group.country];
                                        const { color, radius } = getMarkerStyle(data?.count || 1);
                                        const isHovered = hoveredCountry === group.country;

                                        return (
                                            <CircleMarker
                                                key={idx}
                                                center={[group.lat, group.lng]}
                                                radius={isHovered ? radius + 3 : radius}
                                                fillColor={isHovered ? '#F59E0B' : color}
                                                color="#fff"
                                                weight={isHovered ? 3 : 2}
                                                opacity={1}
                                                fillOpacity={isHovered ? 0.9 : 0.7}
                                                eventHandlers={{
                                                    mouseover: () => setHoveredCountry(group.country),
                                                    mouseout: () => setHoveredCountry(null),
                                                    click: () => setSelectedCountry(group.country)
                                                }}
                                            >
                                                <Popup>
                                                    <div className="p-2">
                                                        <h4 className="font-bold text-lg mb-2">{group.country}</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <p><strong>Projects:</strong> {data?.count || 0}</p>
                                                            <p><strong>Funding:</strong> ${data?.funding.toFixed(1) || 0}M</p>
                                                            <p><strong>Region:</strong> {data?.region || 'N/A'}</p>
                                                        </div>
                                                        <div className="mt-3 max-h-40 overflow-y-auto">
                                                            <p className="font-semibold text-xs mb-1">Recent Projects:</p>
                                                            {group.projects.slice(0, 3).map((proj, i) => (
                                                                <p key={i} className="text-xs text-gray-600 mb-1">
                                                                    • {proj["Adaptation Interventions"].substring(0, 50)}...
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </CircleMarker>
                                        );
                                    })}
                                </MapContainer>

                                {/* Country Info Tooltip */}
                                {hoveredCountry && countryData[hoveredCountry] && (
                                    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-2xl border-2 border-[#0d9c5a] p-6 min-w-[280px] animate-fadeIn">
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 border-b-2 border-[#0d9c5a] pb-2">
                                            {hoveredCountry}
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="bg-[#0d9c5a] text-white rounded-lg px-4 py-3">
                                                <p className="text-sm font-semibold uppercase tracking-wide">Country Projects</p>
                                                <p className="text-3xl font-black">{countryData[hoveredCountry].count}</p>
                                            </div>
                                            <div className="bg-emerald-600 text-white rounded-lg px-4 py-3">
                                                <p className="text-sm font-semibold uppercase tracking-wide">Project Amount</p>
                                                <p className="text-3xl font-black">${countryData[hoveredCountry].funding.toFixed(1)}M</p>
                                            </div>
                                            <div className="bg-green-700 text-white rounded-lg px-4 py-3">
                                                <p className="text-sm font-semibold uppercase tracking-wide">Active Interventions</p>
                                                <p className="text-3xl font-black">{countryData[hoveredCountry].projects.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                                <span className="text-sm font-medium text-gray-700">Project Intensity:</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#6ee7b7' }}></div>
                                    <span className="text-xs text-gray-600">Low (1-5)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#34d399' }}></div>
                                    <span className="text-xs text-gray-600">Medium (6-10)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                                    <span className="text-xs text-gray-600">High (11-20)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#0d9c5a' }}></div>
                                    <span className="text-xs text-gray-600">Very High (20+)</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid lg:grid-cols-2 gap-8 mb-12">
                            {/* Regional Breakdown */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Regional Breakdown</h3>
                                    <TrendingUp className="w-6 h-6 text-[#0d9c5a]" />
                                </div>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {regionData.length > 0 ? regionData.map((region, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gradient-to-r from-gray-50 to-[#eefdf5] rounded-xl border border-gray-200 hover:border-[#0d9c5a] hover:shadow-md transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-gray-900 text-lg">{region.name}</h4>
                                                <span className="px-3 py-1 bg-[#eefdf5] text-[#0d9c5a] rounded-full text-sm font-semibold">
                                                    {region.count} projects
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 font-medium">Countries</p>
                                                    <p className="text-gray-900 font-bold">{region.countries}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium">Funding</p>
                                                    <p className="text-gray-900 font-bold">${region.funding}M</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-500">No regional data available</p>
                                    )}
                                </div>
                            </div>

                            {/* Top Countries */}
                            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Top 10 Countries</h3>
                                    <MapPin className="w-6 h-6 text-[#0d9c5a]" />
                                </div>
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {topCountries.length > 0 ? topCountries.map((country, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 bg-gradient-to-r from-gray-50 to-[#eefdf5] rounded-xl border transition-all duration-300 cursor-pointer ${hoveredCountry === country.country || selectedCountry === country.country
                                                ? 'border-[#0d9c5a] shadow-lg scale-105'
                                                : 'border-gray-200 hover:border-[#0d9c5a] hover:shadow-md'
                                                }`}
                                            onMouseEnter={() => setHoveredCountry(country.country)}
                                            onMouseLeave={() => setHoveredCountry(null)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="flex items-center justify-center w-6 h-6 bg-[#0d9c5a] text-white rounded-full text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <h4 className="font-bold text-gray-900">{country.country}</h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <p className="text-gray-500">Projects</p>
                                                            <p className="text-gray-900 font-bold">{country.count}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Funding</p>
                                                            <p className="text-gray-900 font-bold">${country.funding.toFixed(1)}M</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-2 px-2 py-1 bg-[#eefdf5] text-[#0d9c5a] rounded text-xs font-semibold">
                                                    {country.region}
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#0d9c5a] to-emerald-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${topCountries.length > 0 ? (country.count / topCountries[0].count) * 100 : 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-500">No country data available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-[#0d9c5a] to-emerald-600 rounded-3xl p-8 md:p-12 shadow-2xl text-center text-white">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6">
                                    <Sparkles className="w-4 h-4 text-white" />
                                    <span className="text-white text-sm font-semibold">Ready to Explore?</span>
                                </div>

                                <h3 className="text-3xl md:text-5xl font-black mb-4">
                                    Dive Deeper Into The Data
                                </h3>
                                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                    Explore detailed climate adaptation interventions across Africa. Filter by region, country, and thematic area.
                                </p>
                                <button
                                    onClick={handleViewDashboard}
                                    className="group bg-white text-[#0d9c5a] px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
                                >
                                    View Full Dashboard
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
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AfricaMapSection;