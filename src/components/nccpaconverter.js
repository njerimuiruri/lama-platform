"use client";
"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Download, Upload, FileSpreadsheet, CheckCircle } from "lucide-react";

export default function ExcelToJsonConverter() {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isConverted, setIsConverted] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name.replace(".xlsx", "").replace(".xls", ""));
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON with header row
        const json = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: "",
          header: 1, // Get all rows as arrays first
        });

        // Handle merged cells - fill in empty cells with the value from above
        const filledJson = json.map((row, rowIdx) => {
          if (rowIdx === 0 || rowIdx === 1) return row; // Skip header rows
          return row.map((cell, colIdx) => {
            if (cell === "" || cell === null || cell === undefined) {
              // Look up to find the last non-empty value in this column
              for (let i = rowIdx - 1; i >= 2; i--) {
                if (json[i] && json[i][colIdx] && json[i][colIdx] !== "") {
                  return json[i][colIdx];
                }
              }
            }
            return cell || "";
          });
        });

        // Get headers from first two rows (for merged headers)
        const headerRow1 = filledJson[0] || [];
        const headerRow2 = filledJson[1] || [];
        const dataRows = filledJson.slice(2);

        // Build complete headers - prioritize row 1, then row 2, then combine
        const headers = headerRow1.map((h1, idx) => {
          const h2 = headerRow2[idx];
          // If row 1 has content, use it (possibly with row 2)
          if (h1 && h1.toString().trim() !== "") {
            // If row 2 also has content and looks like a sub-header (year, etc)
            if (h2 && h2.toString().trim() !== "" && h2 !== h1) {
              return `${h1} - ${h2}`;
            }
            return h1;
          }
          // If only row 2 has content
          return h2 || "";
        });

        console.log("Headers detected:", headers); // Debug

        // Find column indices - using more flexible matching
        const prioritySectorIdx = headers.findIndex(
          (h) =>
            h &&
            h
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes("prioritysector")
        );
        const priorityActionIdx = headers.findIndex(
          (h) =>
            h &&
            (h
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes("priorityaction") ||
              h
                .toString()
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes("priotiyaction"))
        );
        const expectedOutcomeIdx = headers.findIndex(
          (h) =>
            h &&
            (h.toString().toLowerCase().includes("expected outcome") ||
              (h.toString().toLowerCase().includes("expected") &&
                h.toString().toLowerCase().includes("output")))
        );
        const kpiIdx = headers.findIndex(
          (h) =>
            h &&
            (h.toString().toLowerCase().includes("key performance") ||
              h.toString().toLowerCase().includes("indicator"))
        );
        const sectorIdx = headers.findIndex(
          (h) => h && h.toString().toLowerCase().includes("sector:")
        );
        const targetGroupsIdx = headers.findIndex(
          (h) =>
            h &&
            h
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes("targetgroup")
        );
        const sourceFundIdx = headers.findIndex(
          (h) =>
            h &&
            h
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes("sourceoffund")
        );
        const levelIdx = headers.findIndex(
          (h) => h && h.toString().toLowerCase().trim() === "level"
        );
        const processVsOutputIdx = headers.findIndex(
          (h) =>
            h &&
            h.toString().toLowerCase().includes("process") &&
            h.toString().toLowerCase().includes("output")
        );
        const specificVsGeneralIdx = headers.findIndex(
          (h) =>
            h &&
            h.toString().toLowerCase().includes("specific") &&
            h.toString().toLowerCase().includes("general")
        );
        const strengtheningIdx = headers.findIndex(
          (h) => h && h.toString().toLowerCase().includes("strengthening")
        );

        console.log("Column indices:", {
          prioritySectorIdx,
          priorityActionIdx,
          expectedOutcomeIdx,
          kpiIdx,
          sectorIdx,
        }); // Debug

        // Find budget year columns
        const budgetColumns = [];
        headers.forEach((h, idx) => {
          const match = h.match(/202[3-9]\/[0-9]{2}/);
          if (match) {
            budgetColumns.push({ index: idx, year: match[0] });
          }
        });

        // Map the data to match your column structure and filter out empty rows
        const formattedData = dataRows
          .map((row) => {
            const record = {
              PrioritySector: row[prioritySectorIdx] || "",
              PriorityAction: row[priorityActionIdx] || "",
              ExpectedOutcome: row[expectedOutcomeIdx] || "",
              KeyPerformanceIndicator: row[kpiIdx] || "",
              Sector: row[sectorIdx] || "",
              TargetGroups: row[targetGroupsIdx] || "",
              SourceOfFund: row[sourceFundIdx] || "",
              IndicativeBudgetKES: {},
              Level: row[levelIdx] || "",
              ProcessVsOutput: row[processVsOutputIdx] || "",
              SpecificVsGeneral: row[specificVsGeneralIdx] || "",
              StrengtheningInstitutions: row[strengtheningIdx] || "",
            };

            // Add budget years
            budgetColumns.forEach(({ index, year }) => {
              record.IndicativeBudgetKES[year] = row[index] || "";
            });

            return record;
          })
          .filter((record) => {
            // Filter out rows where all key fields are empty
            return (
              record.PrioritySector ||
              record.PriorityAction ||
              record.ExpectedOutcome ||
              record.KeyPerformanceIndicator
            );
          });

        setJsonData(formattedData);
        setIsConverted(true);
      } catch (error) {
        console.error("Error converting file:", error);
        alert(
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
    link.download = `${fileName || "converted"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setJsonData(null);
    setFileName("");
    setIsConverted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FileSpreadsheet className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Excel to JSON Converter
            </h1>
            <p className="text-gray-600">
              Upload your Excel file and convert it to JSON format
            </p>
          </div>

          {/* Upload Section */}
          {!isConverted ? (
            <div className="border-2 border-dashed border-indigo-300 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors">
              <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <label className="cursor-pointer">
                <span className="text-lg text-gray-700 mb-2 block">
                  Click to upload or drag and drop
                </span>
                <span className="text-sm text-gray-500 block mb-4">
                  Excel files (.xlsx, .xls)
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  Select File
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Conversion Successful!
                  </h3>
                  <p className="text-green-700">
                    {jsonData?.length} rows converted from {fileName}
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  JSON Preview
                </h3>
                <div className="bg-white rounded-lg p-4 max-h-64 overflow-auto border border-gray-200">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(jsonData?.slice(0, 3), null, 2)}
                    {jsonData?.length > 3 && "\n... and more"}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download JSON
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}

          {/* Column Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Expected Columns:
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Priority Sector",
                "Priority Action",
                "Expected Outcome/Output",
                "Key Performance Indicator",
                "Sector",
                "Target Groups",
                "Source of Fund",
                "Indicative Budget KES (with years)",
                "Level",
                "Process vs Output",
                "Specific vs General",
                "Strengthening Institutions",
              ].map((col) => (
                <span
                  key={col}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
