'use client'

import React from 'react'
import AppHeader from './_components/AppHeader'

function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Background Pattern - Using CSS instead of SVG */}
            <div className="fixed inset-0 opacity-[0.03]" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(156, 146, 172, 0.1) 35px, rgba(156, 146, 172, 0.1) 70px)`,
                backgroundSize: '100px 100px'
            }}></div>

            {/* Header */}
            <AppHeader />

            {/* Main Content Area */}
            <main className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Optional: Add breadcrumbs or page title here */}
                    {/* <div className="mb-8">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>/</span>
                            <span>Dashboard</span>
                        </div>
                    </div> */}

                    {/* Children Content */}
                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </div>
            </main>

            {/* Optional: Floating Action Button for Quick Actions */}
            {/* <button className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    New Analysis
                </span>
            </button> */}

            {/* Add custom styles for animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    )
}

export default DashboardLayout