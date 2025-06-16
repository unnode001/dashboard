import { cn } from '@/lib/utils';
import { FileText, LayoutDashboard } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
// 假设您有一个 usePathname 的 hook 来确定当前活动的链接
// 在 'use client' 组件中，这会是 import { usePathname } from 'next/navigation';
// 由于 Layout 默认是 Server Component, 我们暂时只做静态展示

/**
 * 这是仪表盘模块的根布局 (Layout)。
 * 它会包裹 /dashboard 路径下的所有页面 (page.jsx) 及其子页面。
 * 在这里定义的导航栏、页头或侧边栏将对整个模块生效。
 */
export default function DashboardLayout({ children }) {
    // 在实际的客户端组件中，您会这样使用：
    // const pathname = usePathname();
    const pathname = headers().get('next-url') || '';

    const navLinks = [
        { href: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
        // { href: '/dashboard/aaa', label: '控制台', icon: FileText },
        { href: '/dashboard/logs', label: '日志', icon: FileText },
        // { href: '/dashboard/bbb', label: '配置', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    {/* ... (Logo and other nav items) ... */}
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                // 使用 startsWith 来高亮父路由
                                pathname.startsWith(link.href) && "bg-muted text-primary"
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
                <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}