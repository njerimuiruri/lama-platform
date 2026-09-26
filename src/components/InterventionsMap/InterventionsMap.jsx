"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { X, DollarSign, Calendar, Tag, Users, Plus, Minus, RotateCcw } from "lucide-react";
import { normaliseCountry } from "@/lib/projectData";

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

// Light country shading so the dark project dots stay easy to see
const SHADES = ["#f0fdf4", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399"];
const MARKER = "#065f46";
const SELECTED = "#F59E0B";

function countryFill(count, isAfrican) {
  if (!isAfrican) return "#eef0f2";
  if (count === 0) return SHADES[0];
  if (count <= 3) return SHADES[1];
  if (count <= 8) return SHADES[2];
  if (count <= 15) return SHADES[3];
  return SHADES[4];
}

function markerRadius(count, max) {
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.7) return 8;
  if (ratio > 0.4) return 6.5;
  if (ratio > 0.2) return 5;
  return 4;
}

// Map frame sized around Africa (portrait), so the continent fills the card
const WIDTH = 600;
const HEIGHT = 660;
const DEFAULT_VIEW = { coordinates: [18, -3], zoom: 1 };

// onSelectCountry(name | null) lets the page filter by country; without it the map shows its own panel
export default function InterventionsMap({ projects = [], selectedCountry = null, onSelectCountry, highlightCountry = null }) {
  const [tooltip, setTooltip] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState(DEFAULT_VIEW);

  const countryData = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      const c = normaliseCountry(p.Country);
      if (!map[c]) map[c] = { count: 0, projects: [] };
      map[c].count++;
      map[c].projects.push(p);
    });
    return map;
  }, [projects]);

  const locationGroups = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      const lat = parseFloat(p.Latitude);
      const lng = parseFloat(p.Longitude);
      if (!p.Latitude || !p.Longitude || isNaN(lat) || isNaN(lng) || lat === 0) return;
      const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
      if (!map[key]) map[key] = { key, lat, lng, country: normaliseCountry(p.Country), projects: [] };
      map[key].projects.push(p);
    });
    return Object.values(map);
  }, [projects]);

  const maxMarkers = useMemo(
    () => Math.max(...locationGroups.map((g) => g.projects.length), 1),
    [locationGroups]
  );

  // Zoom to the selected country, and back out when the filter is cleared
  useEffect(() => {
    if (!selectedCountry) { setView(DEFAULT_VIEW); return; }
    const spots = locationGroups.filter((g) => g.country === selectedCountry);
    if (!spots.length) return;
    const lngs = spots.map((g) => g.lng);
    const lats = spots.map((g) => g.lat);
    const span = Math.max(Math.max(...lngs) - Math.min(...lngs), Math.max(...lats) - Math.min(...lats), 4);
    setView({
      coordinates: [(Math.max(...lngs) + Math.min(...lngs)) / 2, (Math.max(...lats) + Math.min(...lats)) / 2],
      zoom: Math.min(Math.max(40 / span, 1.5), 6),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  const zoomBy = (factor) => setView((v) => ({ ...v, zoom: Math.min(Math.max(v.zoom * factor, 1), 8) }));
  const pick = (country, groupProjects) => {
    if (onSelectCountry) onSelectCountry(selectedCountry === country ? null : country);
    else setSelected({ country, count: groupProjects.length, projects: groupProjects });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-[#f7fafc]">
      <ComposableMap
        width={WIDTH}
        height={HEIGHT}
        projection="geoMercator"
        projectionConfig={{ center: DEFAULT_VIEW.coordinates, scale: 395 }}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <ZoomableGroup
          center={view.coordinates}
          zoom={view.zoom}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={({ coordinates, zoom }) => setView({ coordinates, zoom })}
          filterZoomEvent={(e) => e.type !== "wheel"}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const isAfrican = AFRICA_COUNTRIES.has(name);
                const data = countryData[name];
                const isSelected = selectedCountry === name;
                const fill = isSelected ? SELECTED : highlightCountry === name ? "#fcd34d" : countryFill(data?.count ?? 0, isAfrican);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isAfrican ? "#94a3b8" : "#ffffff"}
                    strokeWidth={0.4 / view.zoom}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: data ? (isSelected ? SELECTED : "#fcd34d") : fill,
                        cursor: data ? "pointer" : "default",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => { if (isAfrican) setTooltip({ label: name, count: data?.count ?? 0 }); }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => { if (isAfrican && data) pick(name, data.projects); }}
                  />
                );
              })
            }
          </Geographies>

          {locationGroups.map((group) => {
            const r = markerRadius(group.projects.length, maxMarkers) / Math.sqrt(view.zoom);
            const focus = selectedCountry || highlightCountry;
            const dimmed = focus && group.country !== focus;
            return (
              <Marker
                key={group.key}
                coordinates={[group.lng, group.lat]}
                onClick={() => pick(group.country, group.projects)}
                onMouseEnter={() => setTooltip({ label: group.country, count: group.projects.length, spot: true })}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle
                  r={r}
                  fill={MARKER}
                  fillOpacity={dimmed ? 0.25 : 0.9}
                  stroke="#fff"
                  strokeWidth={1.25 / Math.sqrt(view.zoom)}
                  style={{ cursor: "pointer" }}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button onClick={() => zoomBy(1.6)} className="p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900" aria-label="Zoom in">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={() => zoomBy(1 / 1.6)} className="p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-100" aria-label="Zoom out">
          <Minus className="w-4 h-4" />
        </button>
        <button onClick={() => setView(DEFAULT_VIEW)} className="p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t border-gray-100" aria-label="Reset map view">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Selected country / hover label */}
      {selectedCountry && onSelectCountry ? (
        <button
          onClick={() => onSelectCountry(null)}
          className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-gray-900 text-white text-xs font-medium pl-3 pr-2 py-1.5 shadow"
        >
          Filtered: {selectedCountry} <X className="w-3.5 h-3.5" />
        </button>
      ) : null}
      {tooltip && (
        <div className={`absolute left-3 z-30 bg-white text-gray-800 text-xs px-3 py-1.5 rounded-lg shadow border border-gray-100 pointer-events-none whitespace-nowrap ${selectedCountry && onSelectCountry ? "top-12" : "top-3"}`}>
          <b>{tooltip.label}</b> · {tooltip.count} project{tooltip.count !== 1 ? "s" : ""}{tooltip.spot ? " here" : ""}
          {onSelectCountry && tooltip.count > 0 && <span className="text-gray-400"> · click to filter</span>}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] text-gray-600 shadow-sm border border-gray-100">
        <span className="flex items-center gap-1.5">
          Fewer
          <span className="flex">
            {SHADES.map((c) => (
              <span key={c} className="w-4 h-2.5 border-y border-gray-200 first:border-l last:border-r first:rounded-l last:rounded-r" style={{ background: c }} />
            ))}
          </span>
          More projects
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow" style={{ background: MARKER }} />
          Project location
        </span>
      </div>

      {/* Click detail panel (only when the page doesn't handle selection) */}
      {selected && (
        <div className="absolute inset-y-0 right-0 z-30 w-80 max-w-full bg-white/95 backdrop-blur-sm shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-emerald-700">
            <div>
              <p className="text-white font-bold text-sm">{selected.country}</p>
              <p className="text-emerald-100 text-xs">{selected.count} project{selected.count !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {selected.projects.map((p, i) => (
              <div key={i} className="p-4 text-xs space-y-2">
                <p className="font-semibold text-gray-900 text-sm leading-snug">{p["Adaptation Interventions"]}</p>
                {p["Thematic Area(s)"] && (
                  <p className="flex items-start gap-1.5 text-gray-500"><Tag className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-600" />{p["Thematic Area(s)"]}</p>
                )}
                {p.Funders && (
                  <p className="flex items-start gap-1.5 text-gray-500"><Users className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-600" />{p.Funders}</p>
                )}
                {p.Period && (
                  <p className="flex items-center gap-1.5 text-gray-500"><Calendar className="w-3 h-3 flex-shrink-0 text-emerald-600" />{p.Period}</p>
                )}
                {p["Project Amount ($ Million)"] && (
                  <p className="flex items-center gap-1.5 text-gray-500"><DollarSign className="w-3 h-3 flex-shrink-0 text-emerald-600" />${p["Project Amount ($ Million)"]}M</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
