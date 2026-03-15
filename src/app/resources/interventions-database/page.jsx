'use client';
import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, DollarSign, MapPin, Activity, ChevronDown, ChevronUp, Search, Filter, X, Table as TableIcon, List } from "lucide-react";
import projectsData from "../../../../data/data/projects.json";
import LamaNavbar from "@/components/Navbar/navbar";
import LamaFooter from "@/components/Footer/footer";

// Dynamically import components with no SSR
const ClimateMap = dynamic(() => import("@/components/ClimateMap"), {
    ssr: false,
    loading: () => <MapLoader />
});

// Loading component for the map
const MapLoader = () => (
    <div className="h-[600px] w-full bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center">
        <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading interactive map...</p>
        </div>
    </div>
);

export default function ClimateAdaptationDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [selectedTheme, setSelectedTheme] = useState("all");
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [selectedPeriod, setSelectedPeriod] = useState("all");
    const [isClient, setIsClient] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showFilters, setShowFilters] = useState(true);
    const [hoveredProject, setHoveredProject] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // "list" or "table"

    const projects = projectsData;

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                searchQuery === "" ||
                project["Adaptation Interventions"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                project["Country"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                project["Funders"].toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCountry =
                selectedCountry === "all" || project["Country"] === selectedCountry;

            const matchesTheme =
                selectedTheme === "all" || project["Thematic Area(s)"] === selectedTheme;

            const matchesRegion =
                selectedRegion === "all" || project["Region"] === selectedRegion;

            const matchesPeriod =
                selectedPeriod === "all" || project["Period"] === selectedPeriod;

            return matchesSearch && matchesCountry && matchesTheme && matchesRegion && matchesPeriod;
        });
    }, [projects, searchQuery, selectedCountry, selectedTheme, selectedRegion, selectedPeriod]);

    const projectsByCountry = useMemo(() => {
        const grouped = {};
        projects.forEach(project => {
            if (!grouped[project.Country]) {
                grouped[project.Country] = [];
            }
            grouped[project.Country].push(project);
        });
        return grouped;
    }, [projects]);

    const statistics = useMemo(() => {
        const totalProjects = filteredProjects.length;
        const totalFunding = filteredProjects.reduce(
            (sum, project) => sum + parseFloat(project["Project Amount ($ Million)"] || "0"),
            0
        );

        const uniqueCountries = selectedPeriod === "all"
            ? Object.keys(projectsByCountry).length
            : new Set(filteredProjects.map((project) => project["Country"])).size;

        const activeProjects = filteredProjects.filter(
            (project) => project["Implementation Status"] === "Under Implementation"
        ).length;

        return {
            totalProjects,
            totalFunding,
            uniqueCountries,
            activeProjects,
        };
    }, [filteredProjects, projectsByCountry, selectedPeriod]);

    const countries = useMemo(() => {
        const uniqueCountries = new Set(projects.map((project) => project["Country"]));
        return Array.from(uniqueCountries).sort();
    }, [projects]);

    const themes = useMemo(() => {
        const uniqueThemes = new Set(projects.map((project) => project["Thematic Area(s)"]));
        return Array.from(uniqueThemes).sort();
    }, [projects]);

    const regions = useMemo(() => {
        const uniqueRegions = new Set(projects.map((project) => project["Region"]));
        return Array.from(uniqueRegions).sort();
    }, [projects]);

    const periods = useMemo(() => {
        const uniquePeriods = new Set(projects.map((project) => project["Period"]));
        return Array.from(uniquePeriods).sort((a, b) => {
            const getStartYear = (period) => {
                const year = period.split('-')[0];
                return parseInt(year) || 0;
            };
            return getStartYear(a) - getStartYear(b);
        });
    }, [projects]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCountry("all");
        setSelectedTheme("all");
        setSelectedRegion("all");
        setSelectedPeriod("all");
    };

    const hasActiveFilters = searchQuery || selectedCountry !== "all" || selectedTheme !== "all" ||
        selectedRegion !== "all" || selectedPeriod !== "all";

    const renderListView = () => {
        if (selectedPeriod === "all") {
            const filteredCountries = countries.filter(country =>
                projectsByCountry[country]?.some(project =>
                    filteredProjects.some(filteredProject =>
                        filteredProject["Adaptation Interventions"] === project["Adaptation Interventions"]
                    )
                )
            );

            if (filteredCountries.length === 0) {
                return (
                    <div className="text-center py-16 text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <Activity className="h-16 w-16 text-gray-300" />
                            <p className="text-xl font-semibold text-gray-400">No projects found</p>
                            <p className="text-sm text-gray-500">
                                Try adjusting your search criteria or filters
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="mt-4"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    </div>
                );
            }

            return filteredCountries.map((country) => {
                const countryProjects = projectsByCountry[country].filter(project =>
                    filteredProjects.some(filteredProject =>
                        filteredProject["Adaptation Interventions"] === project["Adaptation Interventions"]
                    )
                );

                if (countryProjects.length === 0) return null;

                return (
                    <div key={country} className="mb-8 last:mb-0 animate-fadeIn">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-xl mb-4 border border-blue-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                        {country}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {countryProjects.length} project{countryProjects.length !== 1 ? 's' : ''} •
                                        <span className="font-semibold ml-1">
                                            ${countryProjects.reduce((sum, p) => sum + parseFloat(p["Project Amount ($ Million)"] || "0"), 0).toLocaleString()}M
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {countryProjects.map((project, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                                    onMouseEnter={() => setHoveredProject(project)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        <div className="lg:col-span-2">
                                            <h4 className="font-bold text-gray-900 text-base mb-2 leading-tight">
                                                {project["Adaptation Interventions"]}
                                            </h4>
                                            <p className="text-sm text-gray-500 italic">
                                                {project.Instruments && project.Instruments !== "none"
                                                    ? project.Instruments
                                                    : "No specific instrument"}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0 text-xs font-medium px-3 py-1">
                                                {project["Thematic Area(s)"]}
                                            </Badge>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Globe className="h-3 w-3" />
                                                {project["Region"]}
                                            </p>
                                            <p className="text-sm text-gray-600">{project["Funders"]}</p>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <p className="font-bold text-gray-900 text-2xl">
                                                ${parseFloat(project["Project Amount ($ Million)"]).toLocaleString()}M
                                            </p>
                                            <p className="text-sm text-gray-500">{project["Period"]}</p>
                                            <Badge className={`
                                                ${project["Implementation Status"] === "Under Implementation"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                } border text-xs font-medium px-3 py-1
                                            `}>
                                                {project["Implementation Status"]}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            });
        } else {
            return renderTableView();
        }
    };

    const renderTableView = () => {
        if (filteredProjects.length === 0) {
            return (
                <div className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Activity className="h-16 w-16 text-gray-300" />
                        <p className="text-xl font-semibold text-gray-400">No projects found</p>
                        <p className="text-sm text-gray-500">
                            Try adjusting your search criteria or filters
                        </p>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="mt-4"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear all filters
                            </Button>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Project</TableHead>
                            <TableHead className="font-semibold">Region</TableHead>
                            <TableHead className="font-semibold">Country</TableHead>
                            <TableHead className="font-semibold">Theme</TableHead>
                            <TableHead className="font-semibold">Funders</TableHead>
                            <TableHead className="text-right font-semibold">Amount</TableHead>
                            <TableHead className="font-semibold">Period</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProjects.map((project, index) => (
                            <TableRow
                                key={index}
                                className="hover:bg-blue-50 transition-colors duration-200"
                                onMouseEnter={() => setHoveredProject(project)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                <TableCell className="font-medium max-w-md py-4">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {project["Adaptation Interventions"]}
                                        </p>
                                        <p className="text-xs text-gray-500 italic">
                                            {project.Instruments && project.Instruments !== "none"
                                                ? project.Instruments
                                                : "No specific instrument"}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="text-sm text-gray-700">{project["Region"]}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="font-medium text-gray-900">{project["Country"]}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 text-xs"
                                    >
                                        {project["Thematic Area(s)"]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="text-sm text-gray-600">{project["Funders"]}</span>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <span className="font-semibold text-gray-900">
                                        ${parseFloat(project["Project Amount ($ Million)"]).toLocaleString()}M
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="text-sm text-gray-700">{project["Period"]}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge className={`
                                        ${project["Implementation Status"] === "Under Implementation"
                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                        } border-0 text-xs font-medium
                                    `}>
                                        {project["Implementation Status"]}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <>
            <LamaNavbar />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <header className="mb-10 text-center animate-fadeIn">
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-3">
                            Climate Adaptation Projects
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Track climate resilience and adaptation initiatives across Africa
                        </p>
                    </header>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fadeIn">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 transform hover:scale-105">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-100">Total Projects</CardTitle>
                                <Activity className="h-5 w-5 text-blue-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{statistics.totalProjects}</div>
                                <p className="text-xs text-blue-100 mt-1">Active initiatives</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 transform hover:scale-105">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-100">Total Funding</CardTitle>
                                <DollarSign className="h-5 w-5 text-green-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    ${statistics.totalFunding.toFixed(1)}M
                                </div>
                                <p className="text-xs text-green-100 mt-1">Investment committed</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 transform hover:scale-105">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-orange-100">
                                    {selectedPeriod === "all" ? "Countries" : "Active Countries"}
                                </CardTitle>
                                <Globe className="h-5 w-5 text-orange-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{statistics.uniqueCountries}</div>
                                <p className="text-xs text-orange-100 mt-1">
                                    {selectedPeriod === "all" ? "Regional coverage" : "Countries in period"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 transform hover:scale-105">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-100">Active Projects</CardTitle>
                                <MapPin className="h-5 w-5 text-purple-100" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{statistics.activeProjects}</div>
                                <p className="text-xs text-purple-100 mt-1">Currently running</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="bg-white shadow-xl mb-8 border-0 overflow-hidden">
                        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-green-50 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-blue-600" />
                                    <CardTitle className="text-xl font-bold text-gray-900">Search & Filter Projects</CardTitle>
                                    {hasActiveFilters && (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                            {[searchQuery ? 1 : 0,
                                            selectedCountry !== "all" ? 1 : 0,
                                            selectedTheme !== "all" ? 1 : 0,
                                            selectedRegion !== "all" ? 1 : 0,
                                            selectedPeriod !== "all" ? 1 : 0].reduce((a, b) => a + b, 0)} active
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {hasActiveFilters && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        {showFilters && (
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                            <Search className="h-4 w-4" />
                                            Search Projects
                                        </label>
                                        <Input
                                            placeholder="Search by title, country, or funder..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Region
                                        </label>
                                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Regions</SelectItem>
                                                {regions.map((region) => (
                                                    <SelectItem key={region} value={region}>
                                                        {region}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Country
                                        </label>
                                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Countries</SelectItem>
                                                {countries.map((country) => (
                                                    <SelectItem key={country} value={country}>
                                                        {country}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Thematic Area
                                        </label>
                                        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                                <SelectValue placeholder="Select theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Themes</SelectItem>
                                                {themes.map((theme) => (
                                                    <SelectItem key={theme} value={theme}>
                                                        {theme}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Period
                                        </label>
                                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                                <SelectValue placeholder="Select period" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Periods</SelectItem>
                                                {periods.map((period) => (
                                                    <SelectItem key={period} value={period}>
                                                        {period}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Interactive Map */}
                    {isClient && (
                        <Card className="bg-white shadow-xl mb-8 border-0 overflow-hidden">
                            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-green-50 border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                            Interactive Project Map
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {filteredProjects.length} project(s) • {statistics.uniqueCountries} countr{statistics.uniqueCountries !== 1 ? 'ies' : 'y'}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ClimateMap projects={filteredProjects} hoveredProject={hoveredProject} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Projects Display with View Toggle */}
                    <Card className="bg-white shadow-xl mb-8 border-0">
                        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-green-50 border-b">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        Projects {viewMode === "table" ? "Table" : "List"}
                                    </CardTitle>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        onClick={() => setViewMode("list")}
                                        className="hover:bg-blue-50"
                                        size="sm"
                                    >
                                        <List className="h-4 w-4 mr-2" />
                                        List
                                    </Button>
                                    <Button
                                        variant={viewMode === "table" ? "default" : "outline"}
                                        onClick={() => setViewMode("table")}
                                        className="hover:bg-blue-50"
                                        size="sm"
                                    >
                                        <TableIcon className="h-4 w-4 mr-2" />
                                        Table
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowTable(!showTable)}
                                        className="hover:bg-blue-50"
                                        size="sm"
                                    >
                                        {showTable ? (
                                            <>
                                                <ChevronUp className="h-4 w-4 mr-2" />
                                                Hide Projects
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-4 w-4 mr-2" />
                                                Show Projects
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        {showTable && (
                            <CardContent className="pt-6">
                                {viewMode === "list" ? renderListView() : renderTableView()}
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
            <LamaFooter />

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </>
    );
}