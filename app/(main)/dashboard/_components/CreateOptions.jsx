import React from 'react'
import { Video, Phone, FileText } from 'lucide-react'
import Link from 'next/link'

function CreateOptions() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            <Link 
                href='/dashboard/create-interview' 
                className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow'
            >
                <Video className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12'/>
                <h2 className='font-bold'>Create New Interview</h2>
                <p className='text-gray-500'>Create AI Interviews and schedule them with Candidates</p>
            </Link>
            <Link 
                href='/dashboard/resume-analyzer' 
                className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow'
            >
                <FileText className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12'/>
                <h2 className='font-bold'>Resume Analyzer</h2>
                <p className='text-gray-500'>Analyze resumes with AI and get detailed insights</p>
            </Link>
            <div className='bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-2 opacity-75'>
                <Phone className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12'/>
                <h2 className='font-bold'>Create Phone Screening Call</h2>
                <p className='text-gray-500'>Schedule phone screening calls with candidates</p>
                <span className='text-xs text-gray-400 mt-2'>Coming Soon</span>
            </div>
        </div>
    );
}

export default CreateOptions;