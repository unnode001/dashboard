// src/app/(dashboard)/dashboard/layout.jsx
import SidebarNav from './components/sidebar-nav'; // 引入新组件

/**
 * 这是仪表盘模块的根布局 (Layout)。
 * 它现在只负责定义宏观的页面结构。
 * 导航逻辑已移至 SidebarNav 客户端组件中。
 */
export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
                {/* 调用客户端组件来处理导航 */}
                <SidebarNav />
            </aside>

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
                <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}