'use client';

import { useState, useRef } from 'react';
import { useContentGate } from '@/components/ContentGate/ContentGateContext';
import Navbar from '@/components/Navbar/navbar';
import Footer from '@/components/Footer/footer';

const DATASETS = [
  { value: 'ndc', label: 'National NDC' },
  { value: 'naps', label: 'National Adaptation Plans (NAPS)' },
  { value: 'nccap', label: 'National Climate Change Action Plan (NCCAP)' },
  { value: 'ccap', label: 'County Climate Change Adaptation Plans (CCAP)' },
  { value: 'cidps', label: 'County Integrated Development Plans (CIDPS)' },
  { value: 'lla', label: 'Locally-Led Adaptation (LLA)' },
  { value: 'gga', label: 'Global Goal on Adaptation (GGA)' },
  { value: 'global', label: 'Global Indicators' },
  { value: 'community', label: 'Community / Other' },
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

// ── Locked state ──────────────────────────────────────────────────────────────
function LockedPrompt() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Required</h2>
      <p className="text-gray-500 max-w-md mb-6">
        You need to register for free access to contribute data to the LAMA platform.
      </p>
      <button
        onClick={() => window.dispatchEvent(new Event('lama:open-gate'))}
        className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors"
      >
        Get Free Access
      </button>
    </div>
  );
}

// ── Form tab ──────────────────────────────────────────────────────────────────
function FormTab({ dataset, onSubmit, loading }) {
  const [rows, setRows] = useState([{ key: '', value: '' }]);

  const addRow = () => setRows((r) => [...r, { key: '', value: '' }]);
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const handleSubmit = () => {
    const filled = rows.filter((r) => r.key.trim());
    if (!filled.length) return;
    const dataRow = Object.fromEntries(filled.map((r) => [r.key.trim(), r.value.trim()]));
    onSubmit({ type: 'form', dataset, data: [dataRow] });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Fill in key–value pairs for a single indicator entry. Add as many fields as needed.
      </p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Field name (e.g. Indicator)"
              value={row.key}
              onChange={(e) => updateRow(i, 'key', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
            <input
              type="text"
              placeholder="Value"
              value={row.value}
              onChange={(e) => updateRow(i, 'value', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
            />
            {rows.length > 1 && (
              <button
                onClick={() => removeRow(i)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove row"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addRow}
        className="text-sm text-green-700 hover:text-green-900 font-semibold flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add field
      </button>
      <button
        disabled={loading || !rows.some((r) => r.key.trim())}
        onClick={handleSubmit}
        className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting…' : 'Submit Entry'}
      </button>
    </div>
  );
}

// ── Rows tab ──────────────────────────────────────────────────────────────────
function RowsTab({ dataset, onSubmit, loading }) {
  const [columns, setColumns] = useState(['Indicator', 'Source', 'Description']);
  const [rows, setRows] = useState([{}]);
  const [newCol, setNewCol] = useState('');

  const addColumn = () => {
    const col = newCol.trim();
    if (!col || columns.includes(col)) return;
    setColumns((c) => [...c, col]);
    setNewCol('');
  };

  const removeColumn = (col) => setColumns((c) => c.filter((x) => x !== col));

  const addRow = () => setRows((r) => [...r, {}]);
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));
  const updateCell = (rowIdx, col, val) =>
    setRows((r) => r.map((row, i) => (i === rowIdx ? { ...row, [col]: val } : row)));

  const handleSubmit = () => {
    const data = rows.map((row) => Object.fromEntries(columns.map((c) => [c, row[c] || ''])));
    onSubmit({ type: 'indicator_rows', dataset, data });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Enter multiple indicator rows into a spreadsheet-like table. Add or remove columns as needed.
      </p>

      {/* Column manager */}
      <div className="flex items-center gap-2 flex-wrap">
        {columns.map((col) => (
          <span key={col} className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {col}
            <button onClick={() => removeColumn(col)} className="text-green-500 hover:text-red-500 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="New column…"
            value={newCol}
            onChange={(e) => setNewCol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addColumn()}
            className="px-2.5 py-1 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 w-32"
          />
          <button onClick={addColumn} className="text-xs text-green-700 font-semibold px-2 py-1 hover:bg-green-50 rounded-full transition-colors">
            + Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{col}</th>
              ))}
              <th className="px-3 py-2 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col} className="px-2 py-1.5">
                    <input
                      type="text"
                      value={row[col] || ''}
                      onChange={(e) => updateCell(i, col, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-transparent hover:border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent focus:bg-white min-w-[100px]"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 text-center">
                  {rows.length > 1 && (
                    <button onClick={() => removeRow(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="text-sm text-green-700 hover:text-green-900 font-semibold flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add row
      </button>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting…' : `Submit ${rows.length} Row${rows.length !== 1 ? 's' : ''}`}
      </button>
    </div>
  );
}

// ── Upload tab ────────────────────────────────────────────────────────────────
function UploadTab({ dataset, onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parseError, setParseError] = useState('');
  const inputRef = useRef(null);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map((line) => {
      const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
    });
  };

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setParseError('');
    setPreview(null);

    try {
      if (f.name.endsWith('.csv')) {
        const text = await f.text();
        const rows = parseCSV(text);
        if (!rows.length) throw new Error('No data rows found.');
        setPreview(rows);
      } else if (f.name.match(/\.xlsx?$/)) {
        // Dynamically import xlsx only when needed
        const XLSX = await import('xlsx');
        const buffer = await f.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        if (!rows.length) throw new Error('No data rows found.');
        setPreview(rows);
      } else {
        throw new Error('Please upload a .csv or .xlsx file.');
      }
    } catch (err) {
      setParseError(err.message || 'Failed to parse file.');
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = () => {
    if (!preview?.length) return;
    onSubmit({ type: 'file_upload', dataset, data: preview, fileName: file?.name || '' });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Upload a <strong>.csv</strong> or <strong>.xlsx</strong> file. The first row must be column headers.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 hover:border-green-400 rounded-2xl p-10 text-center cursor-pointer transition-colors group"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        {file ? (
          <p className="text-sm font-semibold text-green-700">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-700">Drop file here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">CSV or Excel (.xlsx)</p>
          </>
        )}
      </div>

      {parseError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{parseError}</p>
      )}

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Preview — {preview.length} rows detected
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="px-3 py-2 text-left text-gray-500 font-semibold whitespace-nowrap">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {preview.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-3 py-2 text-gray-700 whitespace-nowrap max-w-40 truncate">{String(val ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 5 && (
              <p className="px-3 py-2 text-xs text-gray-400 border-t border-gray-100">+ {preview.length - 5} more rows</p>
            )}
          </div>
        </div>
      )}

      <button
        disabled={loading || !preview?.length}
        onClick={handleSubmit}
        className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading…' : `Upload ${preview?.length ?? 0} Rows`}
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ContributePage() {
  const { isLoading, isLocked } = useContentGate();

  const [activeTab, setActiveTab] = useState('form');
  const [dataset, setDataset] = useState('ndc');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, message }
  const [mySubmissions, setMySubmissions] = useState(null);
  const [showMine, setShowMine] = useState(false);

  const fetchMine = async () => {
    const res = await fetch('/api/contributions');
    const data = await res.json().catch(() => []);
    setMySubmissions(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (payload) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, description }),
      });
      if (res.ok) {
        setResult({ success: true, message: 'Submitted! Your data is under review and will appear on the platform once approved.' });
        setDescription('');
        fetchMine();
      } else {
        const err = await res.json().catch(() => ({}));
        setResult({ success: false, message: err.message || 'Submission failed. Please try again.' });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'form', label: 'Quick Form', icon: '✎' },
    { id: 'rows', label: 'Add Rows', icon: '⊞' },
    { id: 'upload', label: 'Upload File', icon: '↑' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 px-6 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              Community Contribution
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Share Your Data</h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Help make LAMA a living platform. Submit your climate adaptation indicators, field data,
              or research findings. Every submission is reviewed before it appears publicly.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400">
              Checking access…
            </div>
          ) : isLocked ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <LockedPrompt />
            </div>
          ) : (
            <>
              {/* Success / error banner */}
              {result && (
                <div className={`rounded-2xl px-5 py-4 flex items-start gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <span className="text-lg mt-0.5">{result.success ? '✓' : '✗'}</span>
                  <p className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.message}
                  </p>
                </div>
              )}

              {/* Submission form card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">New Submission</h2>
                  <p className="text-xs text-gray-400 mt-0.5">All submissions are reviewed by the LAMA team before appearing on the platform.</p>
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Dataset selector */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Dataset
                    </label>
                    <select
                      value={dataset}
                      onChange={(e) => setDataset(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                    >
                      {DATASETS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Description <span className="text-gray-400 normal-case font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly describe the data you are submitting and its source…"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 resize-none"
                    />
                  </div>

                  {/* Tab switcher */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Submission Method
                    </label>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                      {tabs.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === t.id
                              ? 'bg-white text-green-700 shadow-sm font-semibold'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span className="mr-1.5">{t.icon}</span>{t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab content */}
                  <div>
                    {activeTab === 'form' && (
                      <FormTab dataset={dataset} onSubmit={handleSubmit} loading={loading} />
                    )}
                    {activeTab === 'rows' && (
                      <RowsTab dataset={dataset} onSubmit={handleSubmit} loading={loading} />
                    )}
                    {activeTab === 'upload' && (
                      <UploadTab dataset={dataset} onSubmit={handleSubmit} loading={loading} />
                    )}
                  </div>
                </div>
              </div>

              {/* My submissions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => {
                    setShowMine((v) => !v);
                    if (!showMine && !mySubmissions) fetchMine();
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h2 className="font-semibold text-gray-900 text-left">My Submissions</h2>
                    <p className="text-xs text-gray-400 text-left mt-0.5">Track the status of your contributions</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${showMine ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showMine && (
                  <div className="border-t border-gray-100">
                    {!mySubmissions ? (
                      <div className="py-10 text-center text-gray-400 text-sm">Loading…</div>
                    ) : mySubmissions.length === 0 ? (
                      <div className="py-10 text-center text-gray-400 text-sm">No submissions yet.</div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {mySubmissions.map((s) => (
                          <div key={s._id} className="px-6 py-4 flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded uppercase">{s.dataset}</span>
                                <span className="text-xs text-gray-500 capitalize">{s.type.replace('_', ' ')}</span>
                                <span className="text-xs text-gray-400">·</span>
                                <span className="text-xs text-gray-400">{s.data?.length ?? 0} rows</span>
                              </div>
                              {s.description && (
                                <p className="text-sm text-gray-600 truncate">{s.description}</p>
                              )}
                              {s.adminNotes && (
                                <p className="text-xs text-gray-400 mt-1 italic">Note: {s.adminNotes}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                              {s.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
