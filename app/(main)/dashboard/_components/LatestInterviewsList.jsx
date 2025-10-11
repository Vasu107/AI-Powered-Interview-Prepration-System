"use client"
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

function LatestInterviewsList() {
    const [interviewList, setInterviewList] = useState([]);
    
    return (
        <div className='my-4 sm:my-5 lg:my-6'>
            <h2 className='font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800 mb-4 sm:mb-6'>Previously Created Interviews</h2>

            {interviewList?.length === 0 && (
                <div className='bg-white border border-gray-200 rounded-xl p-6 sm:p-8 lg:p-10 flex flex-col gap-4 sm:gap-5 items-center mt-4 sm:mt-6 text-center'>
                    <div className='bg-blue-50 p-4 sm:p-5 rounded-full'>
                        <Camera className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary'/>
                    </div>
                    <div className='space-y-2'>
                        <h3 className='text-lg sm:text-xl font-semibold text-gray-800'>No Interviews Yet</h3>
                        <p className='text-sm sm:text-base text-gray-500 max-w-md'>You haven't created any interviews yet. Start by creating your first AI-powered interview session.</p>
                    </div>
                    <Button asChild className='mt-2 px-6 py-3 text-sm sm:text-base'>
                        <Link href='/dashboard/create-interview'>
                            + Create New Interview
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

export default LatestInterviewsList