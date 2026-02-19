"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Trophy, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

function InterviewResults() {
    const router = useRouter();
    const [results, setResults] = useState(null);
    const [stats, setStats] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [feedbackError, setFeedbackError] = useState(null);

    useEffect(() => {
        // Turn off camera when feedback page loads
        const turnOffCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (stream) {
                    stream.getTracks().forEach(track => {
                        track.stop();
                    });
                }
            } catch (error) {
                // Camera already off or not accessible
                console.log('Camera already off or not accessible');
            }
        };
        
        turnOffCamera();
        
        const storedResults = localStorage.getItem('interviewResults');
        if (storedResults) {
            const data = JSON.parse(storedResults);
            setResults(data);
            calculateStats(data);
            generateFeedback(data);
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
        
        // Calculate scoring statistics
        const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
        const maxPossibleScore = totalQuestions * 10;
        const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
        const avgScore = answers.length > 0 ? (totalScore / answers.length).toFixed(1) : 0;

        setStats({
            totalQuestions,
            answeredQuestions,
            timedOutQuestions,
            avgTime: Math.round(avgTime),
            quickResponses,
            slowResponses,
            completionRate: Math.round((answeredQuestions / totalQuestions) * 100),
            totalScore,
            maxPossibleScore,
            scorePercentage,
            avgScore
        });
    };

    const getPerformanceLevel = () => {
        const scorePercentage = stats.scorePercentage || 0;
        if (scorePercentage >= 80) return { level: 'Excellent', color: 'text-green-600', icon: Trophy };
        if (scorePercentage >= 60) return { level: 'Good', color: 'text-blue-600', icon: Target };
        if (scorePercentage >= 40) return { level: 'Average', color: 'text-yellow-600', icon: AlertCircle };
        return { level: 'Needs Improvement', color: 'text-red-600', icon: XCircle };
    };

    const generateFeedback = async (data) => {
        setLoadingFeedback(true);
        try {
            const response = await fetch('/api/generate-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: data.answers,
                    jobPosition: data.jobPosition,
                    language: data.language
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                setFeedback(result.feedback);
            } else {
                const error = await response.json();
                setFeedbackError(error.error || 'Failed to generate feedback');
            }
        } catch (error) {
            console.error('Failed to generate feedback:', error);
            setFeedbackError('Network error occurred');
        } finally {
            setLoadingFeedback(false);
        }
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
                    
                    <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                        <div className='text-center p-4 bg-green-50 rounded-lg'>
                            <div className='text-2xl font-bold text-green-600'>{stats.scorePercentage}%</div>
                            <div className='text-sm text-gray-600'>Overall Score</div>
                        </div>
                        <div className='text-center p-4 bg-blue-50 rounded-lg'>
                            <div className='text-2xl font-bold text-blue-600'>{stats.totalScore}/{stats.maxPossibleScore}</div>
                            <div className='text-sm text-gray-600'>Points Earned</div>
                        </div>
                        <div className='text-center p-4 bg-purple-50 rounded-lg'>
                            <div className='text-2xl font-bold text-purple-600'>{stats.avgScore}</div>
                            <div className='text-sm text-gray-600'>Avg Score/Question</div>
                        </div>
                        <div className='text-center p-4 bg-yellow-50 rounded-lg'>
                            <div className='text-2xl font-bold text-yellow-600'>{formatTime(stats.avgTime)}</div>
                            <div className='text-sm text-gray-600'>Avg Response Time</div>
                        </div>
                        <div className='text-center p-4 bg-orange-50 rounded-lg'>
                            <div className='text-2xl font-bold text-orange-600'>{stats.answeredQuestions}/{stats.totalQuestions}</div>
                            <div className='text-sm text-gray-600'>Questions Answered</div>
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
                                        <div className={`text-lg font-bold px-3 py-1 rounded ${
                                            (answer.score || 0) >= 8 ? 'bg-green-100 text-green-700' :
                                            (answer.score || 0) >= 6 ? 'bg-blue-100 text-blue-700' :
                                            (answer.score || 0) >= 4 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {answer.score || 0}/10
                                        </div>
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

                {/* AI Feedback */}
                {loadingFeedback ? (
                    <div className='bg-white rounded-xl p-6 mb-6'>
                        <h3 className='text-lg font-semibold mb-4'>AI Feedback</h3>
                        <div className='flex items-center gap-3'>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span>Generating personalized feedback...</span>
                        </div>
                    </div>
                ) : feedbackError ? (
                    <div className='bg-white rounded-xl p-6 mb-6'>
                        <h3 className='text-lg font-semibold mb-4'>AI Feedback</h3>
                        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                            <div className='flex items-center gap-2'>
                                <XCircle className='h-5 w-5 text-red-500'/>
                                <span className='text-red-700'>Error: {feedbackError}</span>
                            </div>
                        </div>
                    </div>
                ) : feedback ? (
                    <div className='bg-white rounded-xl p-6 mb-6'>
                        <h3 className='text-lg font-semibold mb-4'>AI Feedback</h3>
                        <div className='space-y-4'>
                            <div>
                                <h4 className='font-medium text-gray-800 mb-2'>Overall Assessment</h4>
                                <div className='text-gray-700 whitespace-pre-line'>{feedback.overallAssessment}</div>
                            </div>
                            
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div>
                                    <h4 className='font-medium text-green-700 mb-2'>Strengths</h4>
                                    <ul className='space-y-1 text-sm'>
                                        {feedback.strengths?.map((strength, index) => (
                                            <li key={index} className='flex items-start gap-2'>
                                                <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0'/>
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h4 className='font-medium text-orange-700 mb-2'>Areas for Improvement</h4>
                                    <ul className='space-y-1 text-sm'>
                                        {feedback.improvements?.map((improvement, index) => (
                                            <li key={index} className='flex items-start gap-2'>
                                                <AlertCircle className='h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0'/>
                                                <span>{improvement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className='font-medium text-blue-700 mb-2'>Recommendations</h4>
                                <ul className='space-y-1 text-sm'>
                                    {feedback.recommendations?.map((recommendation, index) => (
                                        <li key={index} className='flex items-start gap-2'>
                                            <Target className='h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0'/>
                                            <span>{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {feedback.score && (
                                <div className='bg-gray-50 p-4 rounded-lg'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <Trophy className='h-5 w-5 text-yellow-500'/>
                                        <span className='font-medium'>Overall Score: {feedback.score}/10</span>
                                    </div>
                                    
                                    {feedback.scoreDistribution && (
                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-3'>
                                            <div className='text-center p-2 bg-green-100 rounded'>
                                                <div className='text-lg font-bold text-green-700'>{feedback.scoreDistribution.excellent}</div>
                                                <div className='text-xs text-green-600'>Excellent (8-10)</div>
                                            </div>
                                            <div className='text-center p-2 bg-blue-100 rounded'>
                                                <div className='text-lg font-bold text-blue-700'>{feedback.scoreDistribution.good}</div>
                                                <div className='text-xs text-blue-600'>Good (6-7)</div>
                                            </div>
                                            <div className='text-center p-2 bg-yellow-100 rounded'>
                                                <div className='text-lg font-bold text-yellow-700'>{feedback.scoreDistribution.average}</div>
                                                <div className='text-xs text-yellow-600'>Average (4-5)</div>
                                            </div>
                                            <div className='text-center p-2 bg-red-100 rounded'>
                                                <div className='text-lg font-bold text-red-700'>{feedback.scoreDistribution.poor}</div>
                                                <div className='text-xs text-red-600'>Poor (0-3)</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {feedback.scorePercentage && (
                                        <div className='mt-3 text-sm text-gray-600'>
                                            Score Percentage: {feedback.scorePercentage}% | Average per Question: {feedback.avgScorePerQuestion}/10
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

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