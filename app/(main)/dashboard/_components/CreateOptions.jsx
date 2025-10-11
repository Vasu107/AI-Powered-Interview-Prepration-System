import React from 'react'
import { Video, Phone, FileText } from 'lucide-react'
import Link from 'next/link'

function CreateOptions() {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6'>
            <Link 
                href='/dashboard/create-interview' 
                className='bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group'
            >
                <Video className='p-2 sm:p-3 text-primary bg-blue-50 rounded-lg h-10 w-10 sm:h-12 sm:w-12 group-hover:bg-blue-100 transition-colors'/>
                <h2 className='font-bold text-base sm:text-lg text-gray-800'>Create New Interview</h2>
                <p className='text-gray-500 text-sm sm:text-base leading-relaxed'>Create AI Interviews and schedule them with Candidates</p>
            </Link>
            <Link 
                href='/dashboard/resume-analyzer' 
                className='bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group'
            >
                <FileText className='p-2 sm:p-3 text-primary bg-blue-50 rounded-lg h-10 w-10 sm:h-12 sm:w-12 group-hover:bg-blue-100 transition-colors'/>
                <h2 className='font-bold text-base sm:text-lg text-gray-800'>Resume Analyzer</h2>
                <p className='text-gray-500 text-sm sm:text-base leading-relaxed'>Analyze resumes with AI and get detailed insights</p>
            </Link>
            <div className='bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 flex flex-col gap-3 opacity-75 sm:col-span-2 lg:col-span-1'>
                <Phone className='p-2 sm:p-3 text-primary bg-blue-50 rounded-lg h-10 w-10 sm:h-12 sm:w-12'/>
                <h2 className='font-bold text-base sm:text-lg text-gray-800'>Create Phone Screening Call</h2>
                <p className='text-gray-500 text-sm sm:text-base leading-relaxed'>Schedule phone screening calls with candidates</p>
                <span className='text-xs sm:text-sm text-gray-400 mt-2 font-medium'>Coming Soon</span>
            </div>
        </div>
    );
}

export default CreateOptions;