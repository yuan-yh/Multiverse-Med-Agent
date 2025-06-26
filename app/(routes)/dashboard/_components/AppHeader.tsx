import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

const menuOptions = [
    {
        id: 1,
        name: 'Home',
        path: '/home'
    },
    {
        id: 2,
        name: 'History',
        path: '/history'
    },
    {
        id: 3,
        name: 'Pricing',
        path: '/pricing'
    },
    {
        id: 4,
        name: 'Profile',
        path: '/profile'
    },
]

function AppHeader() {
    return (
        <div className='flex items-center justify-between p-2 shadow px-10 md:px-20 lg:px-40'>
            {/* <Image src={'/Seagull-by-Rones.svg'} alt='logo' width={120} height={60} /> */}
            <div className='relative w-[120px] h-[60px]'>
                <Image
                    src={'/cute_plague_doctor.png'}
                    alt='logo'
                    fill
                    className='object-contain'
                    sizes='(max-width: 768px) 100px, 120px'
                />
            </div>
            <div className='hidden md:flex gap-12 items-center'>
                {menuOptions.map((option, index) => (
                    <div key={index}>
                        <h2 className='hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
                    </div>
                ))}
            </div>
            <UserButton />
        </div>
    )
}

export default AppHeader