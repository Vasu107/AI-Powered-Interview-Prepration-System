"use client"
import React from "react"
import { useSession } from "next-auth/react"
import Image from 'next/image';

function WelcomeContainer() {
    const { data: session } = useSession();

    const displayName = session?.user?.name || 'User';
    const displayPicture = session?.user?.image;

    return(
        <div className='bg-gray-100 p-5 rounded-xl mb-5 flex items-center justify-between'>
            <div>
                <h2 className='text-lg font-bold'>Welcome Back, {displayName}</h2>
                <h2 className='text-gray-500'>AI-Powered Interview Platform</h2>
            </div>
            {displayPicture && (
                <Image 
                    src={displayPicture} 
                    alt='User Avatar' 
                    width={40} 
                    height={40}
                    className='rounded-full'
                /> 
            )}
        </div>
    )
}

export default WelcomeContainer