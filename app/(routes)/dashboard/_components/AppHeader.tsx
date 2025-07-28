'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';

const menuOptions = [
    {
        id: 1,
        name: 'Dashboard',
        path: '/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    {
        id: 2,
        name: 'Analysis History',
        path: '/history',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: 3,
        name: 'Pricing',
        path: '/dashboard/billing',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        )
    },
    {
        id: 4,
        name: 'Profile',
        path: '/profile',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )
    },
]

function AppHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const { user, isLoaded } = useUser()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-md'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-white-600 to-pink-600 rounded-xl blur-lg opacity-10 group-hover:opacity-70 transition-opacity"></div>
                            <div className="relative rounded-xl p-2.5 w-15 h-15">
                                <Image
                                    src={'/icon.png'}
                                    alt='logo'
                                    fill
                                    className='object-contain'
                                    sizes='(max-width: 768px) 100px, 120px'
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Ril
                            </h1>
                            <p className="text-xs text-gray-500 -mt-0.5">Advanced Cancer Analysis</p>
                        </div>
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {menuOptions.map((option) => {
                            const isActive = pathname === option.path
                            return (
                                <Link
                                    key={option.id}
                                    href={option.path}
                                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-light-blue-50 to-pink-50 text-blue-700 font-medium shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`transition-colors ${isActive ? 'text-blue-600' : ''}`}>
                                        {option.icon}
                                    </span>
                                    <span>{option.name}</span>
                                    {/* {isActive && (
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                    )} */}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {/* Update Alert */}
                            {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span> */}
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{isLoaded && user ? `Dr. ${user.lastName || user.username || 'User'}` : 'Loading...'}
                                </p>
                                <p className="text-xs text-gray-500">Oncologist</p>
                            </div>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10 ring-2 ring-blue-100 ring-offset-2"
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Progress Bar (can be used for loading states) */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
                <div className="h-full w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"></div>
            </div>
        </header>
    )
}

export default AppHeader