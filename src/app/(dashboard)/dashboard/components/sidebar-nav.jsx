// src/app/(dashboard)/dashboard/components/sidebar-nav.jsx
'use client';

import { cn } from '@/lib/utils';
import { Cpu, FileText, LayoutDashboard, Settings, Terminal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const navLinks = [
    { href: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
    { href: '/dashboard/console', label: '控制台', icon: Terminal },
    { href: '/dashboard/logs', label: '日志', icon: FileText },
    { href: '/dashboard/settings', label: '设置', icon: Settings },
];

export default function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
                href="/dashboard"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base mb-4"
            >
                <Cpu className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">AI Platform</span>
            </Link>

            {navLinks.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname.startsWith(link.href) && 'bg-muted text-primary'
                    )}
                >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}