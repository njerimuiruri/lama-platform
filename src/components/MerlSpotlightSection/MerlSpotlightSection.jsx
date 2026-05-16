import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const partners = [
  { label: "LAMA / ARIN", full: "Locally Led Adaptation Metrics for Africa — Africa Research & Impact Network", highlight: true },
  { label: "MECCF", full: "Ministry of Environment, Climate Change, Natural Resources & Forestry — Kenya" },
  { label: "SSN", full: "SouthSouthNorth" },
  { label: "CDKN", full: "Climate & Development Knowledge Network" },
  { label: "WRI", full: "World Resources Institute" },
  { label: "AGNES", full: "African Group of Negotiators Expert Support" },
];

const highlights = [
  "Standardised climate indicators handbook",
  "Digital MERL data collection & reporting tool",
  "Strengthened transparency & accountability",
  "Informed decision-making across Kenya\u2019s climate actions",
];

export default function MerlSpotlightSection() {
  return (
    <section className="bg-white border-t border-gray-100" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Top label row */}
        <div className="flex items-center gap-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Partnership Spotlight
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">LAMA in Action · Kenya 2025</span>
        </div>

        {/* Main grid */}
        <div className="grid gap-16" style={{ gridTemplateColumns: "1fr 360px" }}>

          {/* LEFT */}
          <div>
            <h2
              className="font-bold text-gray-900 mb-7 leading-tight"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              LAMA Platform Engaged in Kenya&apos;s National
              Climate Monitoring, Evaluation, Reporting &amp; Learning Initiative
            </h2>

            <p className="text-gray-600 leading-relaxed mb-8" style={{ fontSize: 15.5, lineHeight: 1.9 }}>
              Kenya&apos;s Ministry of Environment, Climate Change, Natural Resources and Forestry (MECCF)
              has formed a landmark multi-partner initiative — co-led with{" "}
              <strong className="text-gray-900 font-semibold">SouthSouthNorth (SSN)</strong>,{" "}
              the <strong className="text-gray-900 font-semibold">Climate and Development Knowledge Network (CDKN)</strong>,
              and the <strong className="text-gray-900 font-semibold">World Resources Institute (WRI)</strong>,
              with technical support from the{" "}
              <strong className="text-gray-900 font-semibold">African Group of Negotiators Expert Support (AGNES)</strong>,
              and with the strategic engagement of the{" "}
              <strong className="text-gray-900 font-semibold">Africa Research and Impact Network (ARIN)</strong>{" "}
              through its{" "}
              <strong className="text-emerald-600 font-semibold">Locally Led Adaptation Metrics for Africa (LAMA) Platform</strong>.
              Together, this coalition is co-developing a standardised indicators handbook and a digital
              Monitoring, Evaluation, Reporting, and Learning (MERL) tool — ultimately promoting
              greater transparency, accountability, and "Informed decision-making across Kenya\u2019s climate actions".
            </p>

            {/* Deliverables */}
            <div className="mb-9">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Key Deliverables
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {/* <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                Explore the LAMA Dashboard <ArrowRight size={15} />
              </Link> */}
              <a
                href="https://cdkn.org/story/measuring-impact-kenyas-innovative-approach-tracking-and-reporting-climate-action-impact/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 hover:border-gray-400 text-gray-800 font-semibold text-sm transition-colors"
              >
                Read Full Story on CDKN <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* RIGHT — partners panel */}
          <div>
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

              {/* Accent bar */}
              <div style={{ height: 4, background: "linear-gradient(90deg, #059669 0%, #0d9488 100%)" }} />

              {/* Card heading */}
              <div className="px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 m-0">
                  Initiative Partners
                </p>
              </div>

              {/* Partners list */}
              <div>
                {partners.map(({ label, full, highlight }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3.5 px-6 py-3 border-b border-gray-50 last:border-0"
                    style={{
                      borderLeft: highlight ? "3px solid #059669" : "3px solid transparent",
                      background: highlight ? "rgba(5,150,105,0.03)" : "transparent",
                    }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-wide pt-0.5 flex-shrink-0"
                      style={{ color: highlight ? "#059669" : "#374151", minWidth: 62 }}
                    >
                      {label}
                    </span>
                    <span className="text-xs text-gray-500 leading-snug">{full}</span>
                  </div>
                ))}
              </div>

              {/* Source footer */}
              <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 m-0 leading-relaxed">
                  Source:{" "}
                  <a
                    href="https://cdkn.org/story/measuring-impact-kenyas-innovative-approach-tracking-and-reporting-climate-action-impact/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 underline hover:text-gray-700"
                  >
                    CDKN — Measuring Impact, Kenya 2025
                  </a>
                </p>
              </div>
            </div>

            {/* Stats strip */}
            {/* <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { value: "6", label: "Partner organisations" },
                { value: "47", label: "Kenya counties" },
                { value: "2025", label: "Initiative year" },
                { value: "1st", label: "National MERL tool" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center"
                >
                  <p
                    className="font-bold text-gray-900 m-0 leading-none"
                    style={{ fontFamily: "'Georgia', serif", fontSize: 26 }}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 m-0 leading-snug">{label}</p>
                </div>
              ))}
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
}
