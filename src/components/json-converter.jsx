"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';

export default function ExcelToJsonConverter() {
    const [jsonData, setJsonData] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isConverted, setIsConverted] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name.replace('.xlsx', '').replace('.xls', ''));
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get the first sheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON with header row
                const json = XLSX.utils.sheet_to_json(worksheet, {
                    raw: false,
                    defval: '',
                    header: 1 // Get all rows as arrays first
                });

                // Get headers from first row
                const headers = json[0];
                const dataRows = json.slice(1);

                // Find column indices
                const sourceIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('source'));
                const priorityIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('priority'));
                const kpiIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('key performance'));
                const sectorIdx = headers.findIndex(h => h && h.toString().toLowerCase().includes('sector') && !h.toString().toLowerCase().includes('priority'));

                // Map the data to match your column structure
                const formattedData = dataRows.map(row => ({
                    Source: row[sourceIdx] || '',
                    PrioritySector: row[priorityIdx] || '',
                    KeyPerformanceIndicators: row[kpiIdx] || '',
                    Sector: row[sectorIdx] || ''
                }));

                setJsonData(formattedData);
                setIsConverted(true);
            } catch (error) {
                console.error('Error converting file:', error);
                alert('Error converting file. Please make sure it\'s a valid Excel file.');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleDownload = () => {
        if (!jsonData) return;

        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName || 'converted'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        setJsonData(null);
        setFileName('');
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
                                        {jsonData?.length > 3 && '\n... and more'}
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
                            {['Source', 'Priority Sector', 'Key performance Indicators', 'Sector'].map((col) => (
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