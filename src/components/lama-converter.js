import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function LAMAConverter() {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isConverted, setIsConverted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setFileName(file.name.replace(".xlsx", "").replace(".xls", ""));
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: "",
        });

        if (json.length === 0) {
          setError("No data found in the Excel file.");
          return;
        }

        const headers = Object.keys(json[0]);

        const thematicSectorCol = headers.find(
          (h) =>
            h.toLowerCase().includes("thematic") ||
            h.toLowerCase().includes("sector")
        );
        const rawIndicatorCol = headers.find((h) =>
          h.toLowerCase().includes("raw")
        );
        const amendedIndicatorCol = headers.find(
          (h) =>
            h.toLowerCase().includes("amend") ||
            h.toLowerCase().includes("improved")
        );
        const measurementUnitCol = headers.find(
          (h) =>
            h.toLowerCase().includes("measurement") ||
            h.toLowerCase().includes("unit") ||
            h.toLowerCase().includes("measure")
        );
        const targetRelevanceCol = headers.find(
          (h) =>
            h.toLowerCase().includes("target") ||
            h.toLowerCase().includes("relevance")
        );

        if (!thematicSectorCol || !rawIndicatorCol || !amendedIndicatorCol) {
          setError(
            "Missing required columns. Please ensure your Excel has: Thematic Sector, Raw Indicator, and Amended Indicator columns."
          );
          return;
        }

        const dataRows = json.filter(
          (row) =>
            (row[rawIndicatorCol]?.trim?.() || "").length > 0 ||
            (row[amendedIndicatorCol]?.trim?.() || "").length > 0
        );

        const sectors = [
          ...new Set(
            dataRows
              .map((row) => row[thematicSectorCol])
              .filter((sector) => sector && sector.trim?.() !== "")
          ),
        ].sort();

        const indicators = dataRows.map((row, index) => ({
          id: index + 1,
          thematicSector: (row[thematicSectorCol] || "").trim?.() || "",
          rawIndicator: (row[rawIndicatorCol] || "").trim?.() || "",
          amendedIndicator: (row[amendedIndicatorCol] || "").trim?.() || "",
          possibleMeasurementUnit:
            (row[measurementUnitCol] || "").trim?.() || "",
          targetRelevance: (row[targetRelevanceCol] || "").trim?.() || "",
        }));

        const lamaData = {
          metadata: {
            title: "LAMA Indicator Matrix",
            description:
              "Local Adaptation Monitoring and Assessment Indicators",
            generatedAt: new Date().toISOString(),
            totalIndicators: indicators.length,
            thematicSectors: sectors,
          },
          indicators: indicators,
        };

        setJsonData(lamaData);
        setIsConverted(true);
      } catch (error) {
        console.error("Error converting file:", error);
        setError(
          "Error converting file. Please make sure it's a valid Excel file."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    if (!jsonData) return;

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName || "lama-indicators"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setJsonData(null);
    setFileName("");
    setIsConverted(false);
    setShowPreview(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl w-16 h-16 flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              LAMA Converter
            </h1>
            <p className="text-gray-600 text-lg">
              Excel to JSON Indicator Matrix Converter
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-700 font-semibold">❌ Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {!isConverted ? (
            <div className="border-2 border-dashed border-emerald-300 rounded-xl p-12 text-center hover:border-emerald-500 transition-all bg-emerald-50/30">
              <div className="text-5xl mb-4">📁</div>
              <label className="cursor-pointer block">
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  Upload Your Excel File
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Supports .xlsx and .xls files
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold shadow-lg">
                  Select File
                </button>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <p className="text-lg font-bold text-green-800">
                  ✅ Conversion Successful!
                </p>
                <p className="text-green-700 mt-2">
                  {jsonData?.metadata.totalIndicators} indicators converted from{" "}
                  {fileName}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {jsonData?.metadata.thematicSectors.length} thematic sectors
                  identified
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Indicators</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {jsonData?.metadata.totalIndicators}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thematic Sectors</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {jsonData?.metadata.thematicSectors.length}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Sectors:</p>
                <div className="flex flex-wrap gap-2">
                  {jsonData?.metadata.thematicSectors.map((sector, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white text-indigo-700 rounded-full text-xs font-medium border border-indigo-200"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors font-semibold border border-gray-300"
              >
                {showPreview ? "🙈 Hide" : "👁️ Show"} JSON Preview
              </button>

              {showPreview && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    JSON Preview (First 5 Indicators)
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(
                        {
                          ...jsonData,
                          indicators: jsonData?.indicators.slice(0, 5),
                        },
                        null,
                        2
                      )}
                      {jsonData?.indicators.length > 5 &&
                        "\n\n... and " +
                          (jsonData.indicators.length - 5) +
                          " more indicators"}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-lg shadow-lg"
                >
                  ⬇️ Download JSON
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-4">
              📋 Expected Excel Column Structure:
            </h3>
            <div className="space-y-3">
              {[
                { name: "Thematic Sector", desc: "Category (e.g., Water)" },
                {
                  name: "Raw Indicator",
                  desc: "Original indicator text",
                },
                {
                  name: "Amended Indicator",
                  desc: "Modified version (can be shared)",
                },
                {
                  name: "Possible Measurement Unit",
                  desc: "Unit of measurement (%, Count, km)",
                },
                { name: "Target Relevance", desc: "Relevance category" },
              ].map((col) => (
                <div
                  key={col.name}
                  className="px-4 py-3 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-200"
                >
                  <p className="font-semibold text-sm">{col.name}</p>
                  <p className="text-xs text-emerald-700 mt-1">{col.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              ℹ️ Column names are matched flexibly - spelling variations are OK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
