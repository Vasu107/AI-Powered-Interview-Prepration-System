import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { interviewType } from '@/services/Constants';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

function FormContainer({onHandleInputChange, GoToNext}) {

    const [selectedTypes, setSelectedTypes] = useState([]);
    const [formData, setFormData] = useState({
        jobPosition: '',
        jobExperience: '',
        jobDescription: '',
        language: '',
        questionCount: '',
        Duration: ''
    });
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [adminConfig, setAdminConfig] = useState({
        jobPositions: [],
        programmingLanguages: [],
        questionCounts: [],
        durations: []
    });

    useEffect(() => {
        // Load admin configuration from database
        const loadAdminConfig = async () => {
            try {
                const response = await fetch('/api/admin/config');
                
                // Check if response is JSON before parsing
                if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                    const data = await response.json();
                    
                    if (data.success) {
                        setAdminConfig(data.config);
                        return;
                    }
                }
                
                // Use fallback if API fails or returns non-JSON
                throw new Error('API returned non-JSON response');
                
            } catch (error) {
                console.log('Using fallback admin config');
                // Default fallback values
                setAdminConfig({
                    jobPositions: [
                        'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                        'Software Engineer', 'Mobile App Developer', 'DevOps Engineer', 'Data Scientist', 'Data Analyst',
                        'Machine Learning Engineer', 'AI Engineer', 'Product Manager', 'Project Manager',
                        'UI/UX Designer', 'Graphic Designer', 'Web Designer', 'Quality Assurance Engineer',
                        'Software Tester', 'Database Administrator', 'System Administrator', 'Network Engineer',
                        'Cybersecurity Specialist', 'Cloud Architect', 'Solutions Architect', 'Technical Lead',
                        'Engineering Manager', 'Scrum Master', 'Business Analyst', 'Technical Writer'
                    ],
                    programmingLanguages: ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Angular', 'Vue.js', 'PHP', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin'],
                    questionCounts: ['3', '5', '7', '10'],
                    durations: ['5 Min', '15 Min', '30 Min', '45 Min', '60 Min']
                });
            }
        };
        
        loadAdminConfig();
    }, []);

    const formFields = [
        {
            id: 'jobPosition',
            label: 'Job Position',
            type: 'select',
            placeholder: 'Select Job Position',
            options: adminConfig.jobPositions,
            required: true
        },
        {
            id: 'jobExperience',
            label: 'Job Experience',
            type: 'select',
            placeholder: 'Select Experience Level',
            options: [
                { value: '0-1 years', label: '0-1 years (Entry Level)' },
                { value: '1-3 years', label: '1-3 years (Junior)' },
                { value: '3-5 years', label: '3-5 years (Mid Level)' },
                { value: '5-8 years', label: '5-8 years (Senior)' },
                { value: '8+ years', label: '8+ years (Expert/Lead)' }
            ],
            required: true
        },
        {
            id: 'jobDescription',
            label: 'Job Description',
            type: 'textarea',
            placeholder: 'Enter job description here or generate with AI...',
            hasAI: true,
            height: 'h-[200px]'
        },
        {
            id: 'language',
            label: 'Programming Language',
            type: 'select',
            placeholder: 'Select Programming Language',
            options: adminConfig.programmingLanguages,
            required: true
        },
        {
            id: 'questionCount',
            label: 'Number of Questions',
            type: 'select',
            placeholder: 'Select Number of Questions',
            options: adminConfig.questionCounts.map(count => ({ value: count, label: `${count} Questions` })),
            required: true
        },
        {
            id: 'Duration',
            label: 'Duration',
            type: 'select',
            placeholder: 'Select Duration',
            options: adminConfig.durations.map(duration => ({ value: duration, label: duration })),
            required: true
        }
    ];

    useEffect(() => {
        if (selectedTypes.length > 0) {
            onHandleInputChange('type', selectedTypes)
        }
    }, [selectedTypes])

    const handleFieldChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
        onHandleInputChange(fieldId, value);
    };

    const AddInterviewType = (type) => {
        const isSelected = selectedTypes.includes(type);
        if (!isSelected) {
            setSelectedTypes(prev => [...prev, type])
        } else {
            setSelectedTypes(prev => prev.filter(item => item !== type));
        }
    }

    const generateAIJobDescription = async () => {
        if (!formData.jobPosition) {
            toast.error('Please select a job position first');
            return;
        }
        if (!formData.jobExperience) {
            toast.error('Please select experience level first');
            return;
        }

        setIsGeneratingAI(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const experienceLevel = formData.jobExperience.includes('0-1') ? 'entry-level' : 
                                   formData.jobExperience.includes('1-3') ? 'junior' :
                                   formData.jobExperience.includes('3-5') ? 'mid-level' :
                                   formData.jobExperience.includes('5-8') ? 'senior' : 'expert-level';
            
            const aiDescription = `Hello! I'm a ${experienceLevel} ${formData.jobPosition} with ${formData.jobExperience} of hands-on experience in delivering high-quality solutions. I have strong expertise in ${formData.jobPosition.toLowerCase()} best practices and enjoy solving complex technical challenges. I'm a collaborative team player with excellent communication skills and always eager to learn new technologies. I'm seeking an opportunity to contribute my skills while continuing to grow professionally in an innovative environment.`;
            
            handleFieldChange('jobDescription', aiDescription);
            toast.success('Brief candidate description generated!');
        } catch (error) {
            toast.error('Failed to generate job description');
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleGenerateQuestions = async () => {
        // Validate required fields
        const requiredFields = formFields.filter(field => field.required);
        const missingFields = requiredFields.filter(field => !formData[field.id]);
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
            return;
        }
        
        if (selectedTypes.length === 0) {
            toast.error('Please select at least one interview type');
            return;
        }
        
        // Save to MongoDB (with fallback)
        try {
            console.log('Sending data to API:', { ...formData, interviewTypes: selectedTypes });
            
            const response = await fetch('/api/interviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    interviewTypes: selectedTypes
                })
            });
            
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);
            
            if (result.success) {
                toast.success('Interview data saved successfully!');
                GoToNext();
            } else {
                // If database fails, continue anyway
                console.log('Database save failed, continuing without save:', result.error);
                toast.success('Proceeding to next step (database save skipped)');
                GoToNext();
            }
        } catch (error) {
            // If network fails, continue anyway
            console.log('Network error, continuing without save:', error);
            toast.success('Proceeding to next step (database save skipped)');
            GoToNext();
        }
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'select':
                return (
                    <Select onValueChange={(value) => handleFieldChange(field.id, value)}>
                        <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {(Array.isArray(field.options) ? field.options : field.options.map(opt => ({ value: opt, label: opt }))).map((option, index) => (
                                <SelectItem key={index} value={option.value || option}>
                                    {option.label || option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'textarea':
                return (
                    <Textarea 
                        placeholder={field.placeholder}
                        className={`${field.height || 'h-[100px]'} mt-2`}
                        value={formData[field.id]}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        placeholder={field.placeholder}
                        className="mt-2"
                        value={formData[field.id]}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                );
        }
    };


    return (
        <div className='p-5 bg-white rounded-xl'>
            {formFields.map((field, index) => (
                <div key={field.id} className={index === 0 ? '' : 'mt-5'}>
                    <div className={field.hasAI ? 'flex justify-between items-center mb-2' : ''}>
                        <h2 className='text-sm font-medium'>{field.label}</h2>
                        {field.hasAI && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={generateAIJobDescription}
                                disabled={!formData.jobPosition || !formData.jobExperience || isGeneratingAI}
                                className='text-xs'
                            >
                                {isGeneratingAI ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className='h-3 w-3 mr-1' />
                                        Generate with AI
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    {renderField(field)}
                </div>
            ))}

            <div className='mt-5'>
                <h2 className='text-sm font-medium'>Interview Type</h2>
                <div className='flex gap-3 flex-wrap mt-2'>
                    {interviewType.map((type, index) => (
                        <div key={index} 
                        className={`flex items-center cursor-pointer 
                        gap-2 p-1 px-2 bg-white border border-gray-300 rounded-2xl
                        hover:bg-secondary transition-colors
                        ${selectedTypes.includes(type.title) && 'bg-blue-100 text-primary border-primary'}`}
                        onClick={() => AddInterviewType(type.title)}>
                            <type.icon className='h-4 w-4'/>
                            <span>{type.title}</span>
                        </div>
                    ))}
                </div>                
            </div>
            <div className='mt-7 flex justify-end'>
                <Button onClick={handleGenerateQuestions}>
                    Generate Question <ArrowRight />
                </Button>
            </div>
        </div>
        
    );
}

export default FormContainer;