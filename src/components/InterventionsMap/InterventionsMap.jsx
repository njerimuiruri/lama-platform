"use client";
import React, { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { X, MapPin, DollarSign, Calendar, Tag, Users, Activity } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const AFRICA_COUNTRIES = new Set([
  "Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi",
  "Cabo Verde","Cameroon","Central African Republic","Chad","Comoros",
  "Dem. Rep. Congo","Congo","Djibouti","Egypt","Equatorial Guinea",
  "Eritrea","Eswatini","Ethiopia","Gabon","Gambia","Ghana","Guinea",
  "Guinea-Bissau","Ivory Coast","Kenya","Lesotho","Liberia","Libya",
  "Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco",
  "Mozambique","Namibia","Niger","Nigeria","Rwanda",
  "São Tomé and Príncipe","Senegal","Seychelles","Sierra Leone",
  "Somalia","South Africa","South Sudan","Sudan","Tanzania","Togo",
  "Tunisia","Uganda","W. Sahara","Zambia","Zimbabwe",
]);

const COUNTRY_NAME_MAP = {
  "Angola ": "Angola", "Cameroon ": "Cameroon",
  "Central African Republic": "Central African Republic",
  " Central African Republic": "Central African Republic",
  "Côte d'Ivoire": "Ivory Coast",
  "Democratic Republic of the Congo": "Dem. Rep. Congo",
  "Eritrea ": "Eritrea", "Gabon ": "Gabon", "Guinea ": "Guinea",
  "Guinea-Bissau ": "Guinea-Bissau", "Mauritius ": "Mauritius",
  "Sierra Leone ": "Sierra Leone", "Somalia ": "Somalia",
  "Swaziland": "Eswatini", "Togo ": "Togo", "Chad ": "Chad",
  "United Republic of Tanzania": "Tanzania", "Mauritania ": "Mauritania",
};

function normalise(name) {
  return COUNTRY_NAME_MAP[name] ?? name?.trim() ?? "";
}

function countryFill(count, isAfrican) {
  if (!isAfrican) return "#e5e7eb";
  if (count === 0) return "#d1fae5";
  if (count <= 3) return "#6ee7b7";
  if (count <= 8) return "#34d399";
  if (count <= 15) return "#10b981";
  return "#0d9c5a";
}

function markerSize(count, max) {
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.7) return { r: 9, fill: "#0d9c5a" };
  if (ratio > 0.5) return { r: 7, fill: "#10b981" };
  if (ratio > 0.3) return { r: 6, fill: "#34d399" };
  return { r: 5, fill: "#6ee7b7" };
}

export default function InterventionsMap({ projects = [] }) {
  const [tooltip, setTooltip] = useState(null);   // { x, y, label, count }
  const [selected, setSelected] = useState(null); // location group clicked

  // Group by country for choropleth
  const countryData = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      const c = normalise(p.Country);
      if (!map[c]) map[c] = { count: 0, projects: [] };
      map[c].count++;
      map[c].projects.push(p);
    });
    return map;
  }, [projects]);

  // Group by exact coordinate for markers
  const locationGroups = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      const lat = parseFloat(p.Latitude);
      const lng = parseFloat(p.Longitude);
      if (!p.Latitude || !p.Longitude || isNaN(lat) || isNaN(lng) || lat === 0) return;
      const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
      if (!map[key]) map[key] = { lat, lng, country: p.Country, projects: [] };
      map[key].projects.push(p);
    });
    return Object.values(map);
  }, [projects]);

  const maxMarkers = useMemo(
    () => Math.max(...locationGroups.map((g) => g.projects.length), 1),
    [locationGroups]
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-slate-50 to-emerald-50 shadow-lg">
      {/* Legend */}
      <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow border border-gray-100 text-xs">
        <p className="font-semibold text-gray-700 mb-1.5">Projects per country</p>
        <div className="flex flex-col gap-1">
          {[
            { color: "#d1fae5", label: "0" },
            { color: "#6ee7b7", label: "1–3" },
            { color: "#34d399", label: "4–8" },
            { color: "#10b981", label: "9–15" },
            { color: "#0d9c5a", label: "16+" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats pill */}
      <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow border border-gray-100 text-xs text-gray-700 space-y-1">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-green-600" />
          <span><b>{projects.length}</b> projects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-green-600" />
          <span><b>{Object.keys(countryData).length}</b> countries</span>
        </div>
      </div>

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [20, 2], scale: 380 }}
        style={{ width: "100%", height: "600px" }}
      >
        <ZoomableGroup center={[20, 2]} zoom={1} minZoom={0.8} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const isAfrican = AFRICA_COUNTRIES.has(name);
                const data = countryData[name];
                const fill = countryFill(data?.count ?? 0, isAfrican);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", cursor: isAfrican ? "pointer" : "default" },
                      hover: { outline: "none", fill: isAfrican ? "#059669" : "#d1d5db", cursor: isAfrican ? "pointer" : "default" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => {
                      if (isAfrican) setTooltip({ label: name, count: data?.count ?? 0 });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (isAfrican && data) setSelected({ country: name, ...data });
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Project markers */}
          {locationGroups.map((group, i) => {
            const { r, fill } = markerSize(group.projects.length, maxMarkers);
            return (
              <Marker
                key={i}
                coordinates={[group.lng, group.lat]}
                onClick={() => setSelected({ country: group.country, count: group.projects.length, projects: group.projects })}
                onMouseEnter={() => setTooltip({ label: group.country, count: group.projects.length })}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle
                  r={r}
                  fill={fill}
                  stroke="#fff"
                  strokeWidth={1.5}
                  style={{ cursor: "pointer", opacity: 0.92 }}
                />
                {group.projects.length > 1 && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontSize: r * 1.1, fill: "#fff", fontWeight: 700, pointerEvents: "none" }}
                  >
                    {group.projects.length}
                  </text>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Hover tooltip */}
      {tooltip && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap">
          <b>{tooltip.label}</b> · {tooltip.count} project{tooltip.count !== 1 ? "s" : ""}
        </div>
      )}

      {/* Click detail panel */}
      {selected && (
        <div className="absolute inset-y-0 right-0 z-30 w-80 bg-white/95 backdrop-blur-sm shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-green-600">
            <div>
              <p className="text-white font-bold text-sm">{selected.country}</p>
              <p className="text-green-100 text-xs">{selected.count} project{selected.count !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {selected.projects.map((p, i) => (
              <div key={i} className="p-4 text-xs space-y-2 hover:bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm leading-snug">
                  {p["Adaptation Interventions"]}
                </p>
                {p["Thematic Area(s)"] && (
                  <div className="flex items-start gap-1.5 text-gray-500">
                    <Tag className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                    {p["Thematic Area(s)"]}
                  </div>
                )}
                {p.Funders && (
                  <div className="flex items-start gap-1.5 text-gray-500">
                    <Users className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                    {p.Funders}
                  </div>
                )}
                {p.Period && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Calendar className="w-3 h-3 flex-shrink-0 text-green-600" />
                    {p.Period}
                  </div>
                )}
                {p["Project Amount ($ Million)"] && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <DollarSign className="w-3 h-3 flex-shrink-0 text-green-600" />
                    ${p["Project Amount ($ Million)"]}M
                  </div>
                )}
                {p["Implementation Status"] && (
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p["Implementation Status"] === "Under Implementation"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {p["Implementation Status"]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
