"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Code, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function AllInterviews() {
    const router = useRouter();
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        loadInterviews();
    }, []);

    const loadInterviews = () => {
        const storedInterviews = localStorage.getItem('allInterviews');
        if (storedInterviews) {
            setInterviews(JSON.parse(storedInterviews));
        }
    };

    const deleteInterview = (id) => {
        const updatedInterviews = interviews.filter(interview => interview.id !== id);
        setInterviews(updatedInterviews);
        localStorage.setItem('allInterviews', JSON.stringify(updatedInterviews));
    };

    const viewResults = (interview) => {
        localStorage.setItem('interviewResults', JSON.stringify(interview));
        router.push('/dashboard/interview-results');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (interview) => {
        if (!interview.completedAt) return 'bg-yellow-100 text-yellow-800';
        const completionRate = (interview.answeredQuestions / interview.totalQuestions) * 100;
        if (completionRate >= 80) return 'bg-green-100 text-green-800';
        if (completionRate >= 60) return 'bg-blue-100 text-blue-800';
        return 'bg-red-100 text-red-800';
    };

    const getStatusText = (interview) => {
        if (!interview.completedAt) return 'In Progress';
        const completionRate = (interview.answeredQuestions / interview.totalQuestions) * 100;
        if (completionRate >= 80) return 'Excellent';
        if (completionRate >= 60) return 'Good';
        return 'Needs Improvement';
    };

    return (
        <div className='min-h-screen bg-gray-50 p-4'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex items-center gap-4 mb-6'>
                    <ArrowLeft 
                        onClick={() => router.back()} 
                        className='cursor-pointer h-6 w-6'
                    />
                    <h1 className='text-2xl font-bold'>All Interviews</h1>
                </div>

                {interviews.length === 0 ? (
                    <div className='bg-white rounded-xl p-8 text-center'>
                        <Code className='h-12 w-12 text-gray-400 mx-auto mb-4'/>
                        <h3 className='text-lg font-semibold text-gray-600 mb-2'>No Interviews Yet</h3>
                        <p className='text-gray-500 mb-4'>Start your first technical interview to see it here.</p>
                        <Button onClick={() => router.push('/dashboard/create-interview')}>
                            Create Interview
                        </Button>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {interviews.map((interview) => (
                            <div key={interview.id} className='bg-white rounded-xl p-6 shadow-sm border'>
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <Code className='h-5 w-5 text-primary'/>
                                            <h3 className='text-lg font-semibold'>
                                                {interview.language} Interview - {interview.jobPosition}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview)}`}>
                                                {getStatusText(interview)}
                                            </span>
                                        </div>
                                        
                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600'>
                                            <div className='flex items-center gap-2'>
                                                <Calendar className='h-4 w-4'/>
                                                <span>{formatDate(interview.createdAt)}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Clock className='h-4 w-4'/>
                                                <span>{interview.Duration}</span>
                                            </div>
                                            <div>
                                                <span className='font-medium'>Questions:</span> {interview.totalQuestions}
                                            </div>
                                            <div>
                                                <span className='font-medium'>Answered:</span> {interview.answeredQuestions || 0}
                                            </div>
                                        </div>

                                        {interview.type && (
                                            <div className='mt-3'>
                                                <div className='flex flex-wrap gap-2'>
                                                    {interview.type.map((type, index) => (
                                                        <span key={index} className='px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs'>
                                                            {type}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex gap-2 ml-4'>
                                        {interview.completedAt && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => viewResults(interview)}
                                                className='flex items-center gap-2'
                                            >
                                                <Eye className='h-4 w-4'/>
                                                View Results
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => deleteInterview(interview.id)}
                                            className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                        >
                                            <Trash2 className='h-4 w-4'/>
                                        </Button>
                                    </div>
                                </div>

                                {interview.completedAt && interview.answers && (
                                    <div className='mt-4 pt-4 border-t'>
                                        <div className='grid grid-cols-3 gap-4 text-sm'>
                                            <div className='text-center'>
                                                <div className='text-lg font-semibold text-blue-600'>
                                                    {Math.round((interview.answeredQuestions / interview.totalQuestions) * 100)}%
                                                </div>
                                                <div className='text-gray-600'>Completion</div>
                                            </div>
                                            <div className='text-center'>
                                                <div className='text-lg font-semibold text-green-600'>
                                                    {interview.answers.filter(a => a.timeTaken < 60).length}
                                                </div>
                                                <div className='text-gray-600'>Quick Responses</div>
                                            </div>
                                            <div className='text-center'>
                                                <div className='text-lg font-semibold text-red-600'>
                                                    {interview.answers.filter(a => a.timedOut).length}
                                                </div>
                                                <div className='text-gray-600'>Timeouts</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllInterviews;