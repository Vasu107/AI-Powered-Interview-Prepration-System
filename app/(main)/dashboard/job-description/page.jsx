"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wand2, Copy, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function JobDescriptionGenerator() {
    const router = useRouter();
    const [jobPosition, setJobPosition] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [experience, setExperience] = useState('');
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const generateJobDescription = async () => {
        if (!jobPosition.trim()) {
            toast.error('Please enter a job position');
            return;
        }

        setLoading(true);
        try {
            const description = await generateAIDescription(jobPosition, companyName, experience);
            setGeneratedDescription(description);
            toast.success('Job description generated successfully!');
        } catch (error) {
            toast.error('Failed to generate job description');
        } finally {
            setLoading(false);
        }
    };

    const generateAIDescription = async (position, company, exp) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const companyText = company ? `at ${company}` : '';
        const experienceText = exp ? `with ${exp} years of experience` : '';
        
        return `Job Title: ${position}

Company: ${company || 'Our Company'}

Job Summary:
We are seeking a talented ${position} ${companyText} to join our dynamic team. The ideal candidate ${experienceText} will be responsible for driving innovation and excellence in their role.

Key Responsibilities:
• Lead and execute ${position.toLowerCase()} initiatives and projects
• Collaborate with cross-functional teams to deliver high-quality solutions
• Analyze requirements and implement best practices
• Mentor junior team members and contribute to team growth
• Stay updated with industry trends and emerging technologies
• Participate in code reviews and maintain coding standards
• Contribute to architectural decisions and technical documentation

Required Qualifications:
• Bachelor's degree in relevant field or equivalent experience
• ${exp || '2-5'} years of professional experience in ${position.toLowerCase()} role
• Strong problem-solving and analytical skills
• Excellent communication and teamwork abilities
• Proficiency in relevant technologies and tools
• Experience with agile development methodologies

Preferred Qualifications:
• Advanced degree in related field
• Industry certifications relevant to the role
• Experience with cloud platforms and modern development practices
• Leadership experience and mentoring skills

What We Offer:
• Competitive salary and benefits package
• Professional development opportunities
• Flexible work arrangements
• Collaborative and innovative work environment
• Career growth and advancement opportunities

Join our team and make a significant impact in the ${position.toLowerCase()} domain while working with cutting-edge technologies and talented professionals.`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedDescription);
        toast.success('Job description copied to clipboard!');
    };

    const downloadDescription = () => {
        const element = document.createElement('a');
        const file = new Blob([generatedDescription], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${jobPosition.replace(/\s+/g, '_')}_job_description.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success('Job description downloaded!');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <ArrowLeft 
                        onClick={() => router.back()} 
                        className="cursor-pointer h-6 w-6"
                    />
                    <h1 className="text-2xl font-bold">AI Job Description Generator</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5" />
                                Generate Job Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Job Position *
                                </label>
                                <Input
                                    placeholder="e.g., Senior Software Engineer, Product Manager"
                                    value={jobPosition}
                                    onChange={(e) => setJobPosition(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Company Name (Optional)
                                </label>
                                <Input
                                    placeholder="e.g., Tech Solutions Inc."
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Required Experience (Optional)
                                </label>
                                <Input
                                    placeholder="e.g., 3-5"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                />
                            </div>

                            <Button 
                                onClick={generateJobDescription}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="h-4 w-4 mr-2" />
                                        Generate with AI
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Job Description</CardTitle>
                            {generatedDescription && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyToClipboard}
                                    >
                                        <Copy className="h-4 w-4 mr-1" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={downloadDescription}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {generatedDescription ? (
                                <Textarea
                                    value={generatedDescription}
                                    onChange={(e) => setGeneratedDescription(e.target.value)}
                                    className="min-h-[500px] text-sm"
                                    placeholder="Generated job description will appear here..."
                                />
                            ) : (
                                <div className="flex items-center justify-center h-[500px] text-gray-500">
                                    <div className="text-center">
                                        <Wand2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                        <p>Enter job details and click "Generate with AI" to create a professional job description</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default JobDescriptionGenerator;