import React, { useState } from 'react';
import clsx from 'clsx';
import { LayoutDashboard, Phone, Users, FileText, Settings, Bot } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Campaigns', path: '/campaigns', icon: Phone },
        { label: 'Lead Lists', path: '/leads', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className={clsx(
                "bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col",
                isSidebarOpen ? "w-64" : "w-20"
            )}>
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        <Bot size={20} />
                    </div>
                    {isSidebarOpen && (
                        <span className="font-bold text-lg text-slate-800 tracking-tight">AI Agent</span>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />
                                {isSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-between">
                    <h1 className="text-xl font-semibold text-slate-800">
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
