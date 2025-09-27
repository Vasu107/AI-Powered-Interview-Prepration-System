"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Trophy, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

function InterviewResults() {
    const router = useRouter();
    const [results, setResults] = useState(null);
    const [stats, setStats] = useState({});

    useEffect(() => {
        const storedResults = localStorage.getItem('interviewResults');
        if (storedResults) {
            const data = JSON.parse(storedResults);
            setResults(data);
            calculateStats(data);
        } else {
            router.push('/dashboard');
        }
    }, [router]);

    const calculateStats = (data) => {
        const answers = data.answers || [];
        const totalQuestions = data.totalQuestions || 0;
        const answeredQuestions = answers.filter(a => a.userAnswer && !a.userAnswer.includes('[TIMEOUT')).length;
        const timedOutQuestions = answers.filter(a => a.timedOut).length;
        const avgTime = answers.length > 0 ? 
            answers.reduce((sum, a) => sum + a.timeTaken, 0) / answers.length : 0;
        const quickResponses = answers.filter(a => a.timeTaken < 30 && !a.timedOut).length;
        const slowResponses = answers.filter(a => a.timeTaken > 96 && !a.timedOut).length;

        setStats({
            totalQuestions,
            answeredQuestions,
            timedOutQuestions,
            avgTime: Math.round(avgTime),
            quickResponses,
            slowResponses,
            completionRate: Math.round((answeredQuestions / totalQuestions) * 100)
        });
    };

    const getPerformanceLevel = () => {
        if (stats.completionRate >= 90 && stats.avgTime < 60) return { level: 'Excellent', color: 'text-green-600', icon: Trophy };
        if (stats.completionRate >= 70 && stats.avgTime < 90) return { level: 'Good', color: 'text-blue-600', icon: Target };
        if (stats.completionRate >= 50) return { level: 'Average', color: 'text-yellow-600', icon: AlertCircle };
        return { level: 'Needs Improvement', color: 'text-red-600', icon: XCircle };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!results) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading results...</p>
                </div>
            </div>
        );
    }

    const performance = getPerformanceLevel();
    const PerformanceIcon = performance.icon;

    return (
        <div className='min-h-screen bg-gray-50 p-4'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex items-center gap-4 mb-6'>
                    <ArrowLeft 
                        onClick={() => router.push('/dashboard')} 
                        className='cursor-pointer h-6 w-6'
                    />
                    <h1 className='text-2xl font-bold'>Interview Results</h1>
                </div>

                {/* Performance Summary */}
                <div className='bg-white rounded-xl p-6 mb-6'>
                    <div className='flex items-center gap-4 mb-4'>
                        <PerformanceIcon className={`h-8 w-8 ${performance.color}`}/>
                        <div>
                            <h2 className='text-xl font-bold'>Overall Performance: {performance.level}</h2>
                            <p className='text-gray-600'>{results.language} Technical Interview</p>
                        </div>
                    </div>
                    
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div className='text-center p-4 bg-blue-50 rounded-lg'>
                            <div className='text-2xl font-bold text-blue-600'>{stats.completionRate}%</div>
                            <div className='text-sm text-gray-600'>Completion Rate</div>
                        </div>
                        <div className='text-center p-4 bg-green-50 rounded-lg'>
                            <div className='text-2xl font-bold text-green-600'>{stats.answeredQuestions}</div>
                            <div className='text-sm text-gray-600'>Questions Answered</div>
                        </div>
                        <div className='text-center p-4 bg-yellow-50 rounded-lg'>
                            <div className='text-2xl font-bold text-yellow-600'>{formatTime(stats.avgTime)}</div>
                            <div className='text-sm text-gray-600'>Avg Response Time</div>
                        </div>
                        <div className='text-center p-4 bg-purple-50 rounded-lg'>
                            <div className='text-2xl font-bold text-purple-600'>{stats.quickResponses}</div>
                            <div className='text-sm text-gray-600'>Quick Responses</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis */}
                <div className='bg-white rounded-xl p-6 mb-6'>
                    <h3 className='text-lg font-semibold mb-4'>Performance Analysis</h3>
                    <div className='space-y-3'>
                        <div className='flex items-center gap-3'>
                            <CheckCircle className='h-5 w-5 text-green-500'/>
                            <span>Quick responses (&lt; 30s): {stats.quickResponses}/{stats.totalQuestions}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <AlertCircle className='h-5 w-5 text-yellow-500'/>
                            <span>Slow responses (&gt; 96s): {stats.slowResponses}/{stats.totalQuestions}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <XCircle className='h-5 w-5 text-red-500'/>
                            <span>Timed out questions: {stats.timedOutQuestions}/{stats.totalQuestions}</span>
                        </div>
                    </div>
                </div>

                {/* Question by Question Results */}
                <div className='bg-white rounded-xl p-6 mb-6'>
                    <h3 className='text-lg font-semibold mb-4'>Question-by-Question Results</h3>
                    <div className='space-y-4'>
                        {results.answers.map((answer, index) => (
                            <div key={index} className='border border-gray-200 rounded-lg p-4'>
                                <div className='flex justify-between items-start mb-3'>
                                    <h4 className='font-medium text-gray-900'>
                                        Question {index + 1}: {answer.question}
                                    </h4>
                                    <div className='flex items-center gap-2'>
                                        <Clock className='h-4 w-4 text-gray-500'/>
                                        <span className='text-sm text-gray-600'>
                                            {formatTime(answer.timeTaken)}
                                        </span>
                                        {answer.timedOut && (
                                            <span className='text-xs bg-red-100 text-red-600 px-2 py-1 rounded'>
                                                TIMEOUT
                                            </span>
                                        )}
                                        {answer.timeTaken < 30 && !answer.timedOut && (
                                            <Zap className='h-4 w-4 text-green-500'/>
                                        )}
                                    </div>
                                </div>
                                
                                <div className='grid md:grid-cols-2 gap-4'>
                                    <div>
                                        <h5 className='font-medium text-sm text-gray-700 mb-2'>Your Answer:</h5>
                                        <p className='text-sm bg-gray-50 p-3 rounded border'>
                                            {answer.userAnswer}
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className='font-medium text-sm text-gray-700 mb-2'>Expected Answer:</h5>
                                        <p className='text-sm bg-blue-50 p-3 rounded border'>
                                            {answer.correctAnswer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className='bg-white rounded-xl p-6 mb-6'>
                    <h3 className='text-lg font-semibold mb-4'>Recommendations</h3>
                    <div className='space-y-3 text-sm'>
                        <p>• Review the concepts where your answers differed significantly from the expected answers.</p>
                        <p>• Practice explaining technical concepts in your own words.</p>
                        {stats.avgTime > 90 && <p>• Work on response time for topics that took longer to answer.</p>}
                        {stats.timedOutQuestions > 0 && <p>• Consider reviewing the topics more thoroughly to improve response speed.</p>}
                        <p>• Try another interview with a different language to broaden your knowledge.</p>
                        {stats.completionRate >= 80 && <p>• Excellent work! You seem well-prepared for technical interviews.</p>}
                    </div>
                </div>

                <div className='flex gap-4'>
                    <Button onClick={() => router.push('/dashboard/create-interview')}>
                        Take Another Interview
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default InterviewResults;