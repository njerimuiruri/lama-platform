'use client';
import Link from 'next/link';
import { ArrowRight, Database, FileText, Globe, Map, Layers, Target, BarChart2, TrendingUp } from 'lucide-react';
import LamaNavbar from '@/components/Navbar/navbar';
import LamaFooter from '@/components/Footer/footer';

const INDICATOR_GROUPS = [
  {
    group: "LLA",
    label: "Locally Led Adaptation",
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    border: "border-green-200",
    items: [
      {
        name: "LLA Indicators",
        description: "Locally-led adaptation metrics and frameworks for tracking climate action across Africa.",
        href: "/indicators/Lama-indicator",
        icon: Database,
      },
    ],
  },
  {
    group: "Sub-national",
    label: "Sub-national Indicators",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    items: [
      {
        name: "County Integrated Development Plans (CIDPs)",
        description: "County-level development frameworks covering priority sectors, 2023–2027.",
        href: "/indicators/County_Intergrated_Development_Plans",
        icon: FileText,
      },
      {
        name: "County Climate Change Adaptation Plans (CCAPs)",
        description: "County-level strategies for adapting to climate change across Kenya.",
        href: "/indicators/County_Climate_Change_Adaptation",
        icon: Map,
      },
    ],
  },
  {
    group: "National",
    label: "National Indicators",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    items: [
      {
        name: "Nationally Determined Contributions (NDCs)",
        description: "National climate commitments under the Paris Agreement.",
        href: "/indicators/National_NDC",
        icon: Target,
      },
      {
        name: "National Climate Change Action Plan (NCCAP)",
        description: "Kenya's national strategy for climate action and mitigation.",
        href: "/indicators/National_Climate_Change_Action_Plan",
        icon: BarChart2,
      },
      {
        name: "National Adaptation Plans (NAPs)",
        description: "Long-term national frameworks for climate change adaptation.",
        href: "/indicators/National_Adaptation_Plans",
        icon: Layers,
      },
    ],
  },
  {
    group: "Global",
    label: "Global Indicators",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    items: [
      {
        name: "Global Goal on Adaptation (GGA)",
        description: "International targets for climate adaptation under the UNFCCC framework.",
        href: "/indicators/Global_Goal_on_Adaptation",
        icon: Globe,
      },
      {
        name: "Global Indicators",
        description: "International climate metrics and benchmarks for tracking global adaptation progress.",
        href: "/indicators/gloabal_indicators",
        icon: TrendingUp,
      },
    ],
  },
];

export default function IndicatorsPage() {
  return (
    <>
      <LamaNavbar />

      {/* Page Header */}
      <section className="py-10 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-1.5 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 text-sm font-medium">LAMA Indicators</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
              Indicators <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Database</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
              Browse all indicator frameworks — from locally led adaptation metrics to national and global climate benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* Indicator Groups */}
      <div className="bg-white">
        {INDICATOR_GROUPS.map((group) => (
          <section key={group.group} className="py-10 border-b border-gray-100 last:border-0">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto">
                {/* Group label */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-1 h-7 rounded-full bg-gradient-to-b ${group.color}`} />
                  <h2 className="text-lg font-bold text-gray-900">{group.label}</h2>
                </div>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href}>
                        <div className={`group h-full bg-white border ${group.border} rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer`}>
                          <div className={`inline-flex p-2.5 bg-gradient-to-br ${group.color} rounded-xl mb-4`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug group-hover:text-green-700 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed mb-4">
                            {item.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 group-hover:gap-2 transition-all">
                            Explore <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <LamaFooter />
    </>
  );
}
