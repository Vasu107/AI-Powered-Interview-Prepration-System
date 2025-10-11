"use client"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";

function CreateInterview() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    
    useEffect(() => {
        // Check for language from URL params or localStorage
        const urlLanguage = searchParams.get('language');
        const storedLanguage = localStorage.getItem('selectedLanguage');
        
        if (urlLanguage) {
            setFormData(prev => ({ ...prev, language: urlLanguage }));
        } else if (storedLanguage) {
            setFormData(prev => ({ ...prev, language: storedLanguage }));
            localStorage.removeItem('selectedLanguage');
        }
    }, [searchParams]);
    
    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        console.log("FormData", formData)
    }

    const onGoToNext = () => {
        if (!formData?.jobPosition || !formData?.jobExperience || !formData?.jobDescription || !formData?.Duration || !formData?.type || !formData?.language || !formData?.questionCount) {
            toast.error("Please fill all the fields");
            return;
        }
        setStep(step + 1);
    }

    return (
        <div className='mt-6 sm:mt-8 lg:mt-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto'>
            <div className='flex gap-3 sm:gap-4 lg:gap-5 items-center mb-4 sm:mb-6'>
                <ArrowLeft 
                    onClick={() => router.back()} 
                    className='cursor-pointer h-5 w-5 sm:h-6 sm:w-6 text-gray-600 hover:text-blue-600 transition-colors'
                />
                <h2 className='font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800'>Create New Interview</h2>
            </div>
            <Progress value={step * 33.33} className='my-4 sm:my-5 lg:my-6 h-2 sm:h-3'/>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                {step === 1 ? (
                    <FormContainer 
                        onHandleInputChange={onHandleInputChange}
                        GoToNext={() => onGoToNext()}
                        initialData={formData}
                    />
                ) : step === 2 ? (
                    <QuestionList formData={formData}/>
                ) : null}
            </div>
        </div>
    );
}

export default CreateInterview