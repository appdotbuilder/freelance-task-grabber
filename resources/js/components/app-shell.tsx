import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const { auth, sidebarOpen } = usePage<SharedData>().props;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col bg-gray-50">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-4">
                                <Link href="/" className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold">🎯</span>
                                    </div>
                                    <h1 className="text-xl font-bold text-gray-900">Task Grabber</h1>
                                </Link>

                                {auth?.user && (
                                    <nav className="hidden md:flex items-center space-x-6 ml-8">
                                        <Link 
                                            href="/" 
                                            className="text-gray-600 hover:text-indigo-600 font-medium"
                                        >
                                            🏠 Browse Tasks
                                        </Link>
                                        <Link 
                                            href="/wallet" 
                                            className="text-gray-600 hover:text-indigo-600 font-medium"
                                        >
                                            💰 Wallet
                                        </Link>
                                    </nav>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600">
                                            👤 {auth.user.name}
                                        </span>
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                            {auth.user.role === 'user' && '🏅 User'}
                                            {auth.user.role === 'admin' && '👔 Admin'}
                                            {auth.user.role === 'superadmin' && '👑 Super Admin'}
                                        </span>
                                        <Link href="/logout" method="post">
                                            <Button variant="outline" size="sm">
                                                Logout
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Link href="/login">
                                            <Button variant="outline">Login</Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button>Register</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    return <SidebarProvider defaultOpen={sidebarOpen}>{children}</SidebarProvider>;
}
