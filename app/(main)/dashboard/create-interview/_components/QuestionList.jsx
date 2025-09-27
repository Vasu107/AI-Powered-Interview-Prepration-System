import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getRandomQuestions } from '@/data/questionBank';
import { ArrowRight, Clock, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

function QuestionList({ formData }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (formData) {
            GenerateQuestionList();
        }
    }, [formData])

    const GenerateQuestionList = async () => {
        setLoading(true);
        try {
            // Simulate realistic loading time for question generation
            await new Promise(resolve => setTimeout(resolve, 800));

            const questionCount = parseInt(formData.questionCount) || 5;
            const generatedQuestions = getRandomQuestions(formData.language, questionCount);
            
            // Save to Supabase
            await saveToSupabase(generatedQuestions);
            
            setQuestions(generatedQuestions);
        } catch (error) {
            console.error('Error generating questions:', error);
        } finally {
            setLoading(false);
        }
    }

    const saveToSupabase = async (questions) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log('No authenticated user found');
                return;
            }

            // Check if interviews table exists by trying to select from it first
            const { error: checkError } = await supabase
                .from('interviews')
                .select('id')
                .limit(1);

            if (checkError) {
                console.log('Interviews table does not exist, skipping database save');
                return;
            }

            const { data, error } = await supabase
                .from('interviews')
                .insert([
                    { 
                        user_id: user.id,
                        user_email: user.email,
                        job_position: formData.jobPosition || 'Not specified',
                        programming_language: formData.language || 'Not specified',
                        question_count: parseInt(formData.questionCount) || 5,
                        duration: formData.Duration || 'Not specified',
                        questions: JSON.stringify(questions),
                        status: 'generated',
                        created_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) {
                console.log('Database save skipped - table may not be configured yet');
            } else {
                console.log('Interview saved to database successfully');
            }
        } catch (error) {
            console.log('Database save skipped - Supabase not fully configured');
        }
    }

    const startInterview = () => {
        const interviewData = {
            ...formData,
            questions,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('currentInterview', JSON.stringify(interviewData));
        router.push('/dashboard/interview-session');
    }

    if (loading) {
        return (
            <div className='p-5 bg-white rounded-xl'>
                <div className='flex items-center gap-3 mb-6'>
                    <Code className='h-6 w-6 text-primary' />
                    <h2 className='text-xl font-bold'>Generating Questions</h2>
                </div>

                <div className="flex flex-col items-center justify-center p-10">
                    <div className="relative mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Code className="h-5 w-5 text-primary animate-pulse" />
                        </div>
                    </div>

                    <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 text-center">
                        <p className="text-lg font-medium text-gray-700">Generating {formData.questionCount} {formData.language} questions...</p>
                        <p className="text-sm text-gray-500"> Our AI is crafting personalized questions bases on your job posistion</p>
                    </div>

                    <div className="mt-6 w-full max-w-md">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='p-5 bg-white rounded-xl'>
            <div className='flex items-center gap-3 mb-6'>
                <Code className='h-6 w-6 text-primary' />
                <h2 className='text-xl font-bold'>Generated Questions</h2>
            </div>

            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                <h3 className='font-semibold mb-2'>Interview Details:</h3>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div><span className='font-medium'>Language:</span> {formData.language}</div>
                    <div><span className='font-medium'>Questions:</span> {formData.questionCount}</div>
                    <div><span className='font-medium'>Duration:</span> {formData.Duration}</div>
                    <div><span className='font-medium'>Position:</span> {formData.jobPosition}</div>
                </div>
            </div>

            <div className='mb-6 p-4 bg-green-50 rounded-lg border border-green-200'>
                <div className='flex items-center gap-2 mb-2'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-green-700 font-medium'>Questions Generated Successfully</span>
                </div>
                <p className='text-sm text-green-600'>
                    {questions.length} {formData.language} questions have been prepared for your interview.
                </p>
            </div>

            <div className='flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6'>
                <Clock className='h-5 w-5 text-blue-600' />
                <div className='text-sm text-blue-800'>
                    <p className='font-medium'>Interview Instructions:</p>
                    <p>• Each question has a 2-minute time limit</p>
                    <p>• Timer starts when you begin typing your answer</p>
                    <p>• Questions will auto-skip if time expires</p>
                </div>
            </div>

            <div className='flex justify-end'>
                <Button onClick={startInterview} className='flex items-center gap-2'>
                    Start Interview <ArrowRight className='h-4 w-4' />
                </Button>
            </div>
        </div>
    );
}

export default QuestionList;