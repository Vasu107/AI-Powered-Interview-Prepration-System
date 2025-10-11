"use client"
import React from "react"
import { useSession } from "next-auth/react"
import Image from 'next/image';

function WelcomeContainer() {
    const { data: session } = useSession();

    const displayName = session?.user?.name || 'User';
    const displayPicture = session?.user?.image;

    return(
        <div className='bg-gray-100 p-4 sm:p-5 lg:p-6 rounded-xl mb-4 sm:mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0'>
            <div className='flex-1'>
                <h2 className='text-base sm:text-lg lg:text-xl font-bold text-gray-800'>Welcome Back, {displayName}</h2>
                <h2 className='text-sm sm:text-base text-gray-500 mt-1'>AI-Powered Interview Platform</h2>
            </div>
            {displayPicture && (
                <div className='flex-shrink-0'>
                    <Image 
                        src={displayPicture} 
                        alt='User Avatar' 
                        width={40} 
                        height={40}
                        className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white shadow-sm'
                    /> 
                </div>
            )}
        </div>
    )
}

export default WelcomeContainer