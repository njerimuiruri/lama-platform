'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SURVEYS = [
    { href: '/dashboard/sitedashboard', label: 'Kenya', sub: 'Community survey' },
    { href: '/dashboard/benin', label: 'Benin', sub: 'Household survey' },
];

// Switch between the country survey dashboards
export default function SurveySwitch() {
    const pathname = usePathname();
    return (
        <nav className="inline-flex gap-1 rounded-xl bg-gray-100 p-1" aria-label="Choose a survey">
            {SURVEYS.map(s => {
                const active = pathname === s.href;
                return (
                    <Link
                        key={s.href}
                        href={s.href}
                        aria-current={active ? 'page' : undefined}
                        className={`rounded-lg px-3 py-1.5 text-left transition-all ${active ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}
                    >
                        <span className={`block text-sm font-semibold ${active ? 'text-gray-900' : 'text-gray-600'}`}>{s.label}</span>
                        <span className="block text-[11px] text-gray-500">{s.sub}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
