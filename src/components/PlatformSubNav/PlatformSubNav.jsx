"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Map, Wrench } from "lucide-react";

const NAV_ITEMS = [
  { label: "Interactive Dashboard", href: "/dashboard/sitedashboard", icon: BarChart2 },
  { label: "LLA Interventions Database", href: "/resources/interventions-database", icon: Map },
  { label: "Tools & Frameworks", href: "/resources/tools-frameworks", icon: Wrench },
];

export default function PlatformSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap gap-2 py-4">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}>
                <span
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap border
                    ${active
                      ? "bg-green-600 text-white border-green-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
