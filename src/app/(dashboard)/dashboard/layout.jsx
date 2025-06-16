import SidebarNav from './components/sidebar-nav';

/**
 * 这是仪表盘模块的根布局 (Layout)。
 * 它会包裹 /dashboard 路径下的所有页面 (page.jsx) 及其子页面。
 *
 * 这个布局文件本身是一个服务器组件(Server Component)，它负责定义宏观的页面结构，
 * 例如侧边栏区域和主内容区域。
 *
 * 具体的导航链接、状态高亮等交互逻辑则被封装在 <SidebarNav /> 这个
 * 客户端组件(Client Component)中，以实现最佳实践。
 */
export default function DashboardLayout({ children }) {
    return (
        // 主容器，为整个仪表盘模块提供统一的背景色和Flexbox结构
        <div className="flex min-h-screen w-full flex-col bg-muted/40">

            {/* 固定的左侧导航栏容器 */}
            {/* `sm:flex` 确保它在小屏幕上 (sm 以下) 隐藏，提供更好的移动端体验 */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-background sm:flex">
                <SidebarNav />
            </aside>

            {/* 页面主内容区 */}
            {/* `sm:pl-64` 这个class为左侧导航栏留出了空间，防止内容被遮挡 */}
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
                <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {/* `{children}` 是 Next.js App Router 的一个关键部分。
              它会根据当前的URL，自动将匹配的 page.jsx 文件内容渲染到此处。
              例如，当用户访问 /dashboard/logs 时, 
              src/app/(dashboard)/dashboard/logs/page.jsx 的内容会在这里显示。
            */}
                    {children}
                </main>
            </div>
        </div>
    );
}
