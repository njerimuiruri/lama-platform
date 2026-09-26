"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Map, Wrench } from "lucide-react";

const NAV_ITEMS = [
  { label: "Interactive dashboard", href: "/dashboard/sitedashboard", icon: BarChart2 },
  { label: "Interventions database", href: "/resources/interventions-database", icon: Map },
  { label: "Tools & frameworks", href: "/resources/tools-frameworks", icon: Wrench },
];

export default function PlatformSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-6 overflow-x-auto" aria-label="Platform components">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          // Both survey dashboards (Kenya, Benin) belong to the Interactive dashboard tab
          const active = pathname === href || (href.startsWith("/dashboard") && pathname?.startsWith("/dashboard"));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex-shrink-0 inline-flex items-center gap-2 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${active
                ? "border-emerald-600 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-emerald-600" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
