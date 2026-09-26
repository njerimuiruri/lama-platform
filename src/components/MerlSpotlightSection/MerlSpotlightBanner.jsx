import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";

const partners = [
  { label: "MECCF", full: "Ministry of Environment, Climate Change & Forestry — Kenya" },
  { label: "SSN", full: "SouthSouthNorth" },
  { label: "CDKN", full: "Climate & Development Knowledge Network" },
  { label: "WRI", full: "World Resources Institute" },
  { label: "AGNES", full: "African Group of Negotiators Expert Support" },
];

const deliverables = [
  "Standardised climate indicators handbook",
  "Digital MERL data collection & reporting tool",
  "Stronger transparency & accountability",
];

/* Home-page summary of the MERL partnership; full story lives on the About page */
export default function MerlSpotlightBanner() {
  return (
    <section className="py-12 sm:py-14 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden grid lg:grid-cols-5">

          {/* Story */}
          <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">
              Partnership Spotlight · Kenya
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
              Shaping how Kenya tracks its climate action
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              LAMA is part of a national Monitoring, Evaluation, Reporting &amp; Learning (MERL) initiative
              led by Kenya&apos;s Ministry of Environment, bringing locally led adaptation metrics into
              how the country measures and reports climate results.
            </p>

            <ul className="space-y-2.5 mb-8">
              {deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/AboutPage#partnerships"
                className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Read the full story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://cdkn.org/story/measuring-impact-kenyas-innovative-approach-tracking-and-reporting-climate-action-impact/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Source: CDKN <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Partners */}
          <div className="lg:col-span-2 bg-emerald-50/60 border-t lg:border-t-0 lg:border-l border-gray-100 p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
              Working together
            </p>
            <ul className="space-y-3">
              {partners.map(({ label, full }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="w-16 flex-shrink-0 text-center text-xs font-bold text-gray-800 bg-white border border-gray-200 rounded-md py-1.5">
                    {label}
                  </span>
                  <span className="text-sm text-gray-600 leading-snug">{full}</span>
                </li>
              ))}
              <li className="flex items-center gap-3 pt-3 mt-1 border-t border-emerald-100">
                <span className="w-16 flex-shrink-0 text-center text-xs font-bold text-white bg-emerald-600 rounded-md py-1.5">
                  LAMA
                </span>
                <span className="text-sm text-gray-700 font-medium leading-snug">
                  Locally led adaptation metrics, via ARIN
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
