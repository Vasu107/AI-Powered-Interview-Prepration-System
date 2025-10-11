"use client"
import React, { useState } from 'react'
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

function ResumeAnalyzer() {
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [jobDescription, setJobDescription] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState(null)
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = (selectedFile) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        
        if (!allowedTypes.includes(selectedFile.type)) {
            alert('Please upload a PDF, DOC, DOCX, or TXT file')
            return
        }
        
        setFile(selectedFile)
    }

    const analyzeResume = async () => {
        if (!file || !jobDescription.trim()) {
            alert('Please upload a resume and provide job description')
            return
        }
        
        setAnalyzing(true)
        
        try {
            // Simulate Python-based analysis
            await new Promise(resolve => setTimeout(resolve, 3000))
            
            // Mock analysis results based on the Python analyzer structure
            const mockAnalysis = {
                resume_path: file.name,
                skill_list_from_job: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
                semantic_skill_matches: [
                    { skill: 'JavaScript', similarity: 0.85, matched: true },
                    { skill: 'React', similarity: 0.78, matched: true },
                    { skill: 'Node.js', similarity: 0.65, matched: true },
                    { skill: 'Python', similarity: 0.45, matched: false },
                    { skill: 'SQL', similarity: 0.72, matched: true },
                    { skill: 'Git', similarity: 0.88, matched: true }
                ],
                skill_match_ratio: 0.833,
                keyword_coverage: 0.67,
                outcome: {
                    metric_sentences: [
                        "Increased user engagement by 40% through responsive design implementation.",
                        "Reduced page load time by 60% using optimization techniques.",
                        "Led a team of 5 developers to deliver project 2 weeks ahead of schedule."
                    ],
                    score: 0.85,
                    count: 3
                },
                grammar: {
                    available: true,
                    issues: [
                        { message: "Consider using active voice", context: "was developed by me", ruleId: "PASSIVE_VOICE" },
                        { message: "Missing comma", context: "skills include HTML CSS", ruleId: "COMMA_MISSING" }
                    ],
                    count: 2,
                    score: 0.92
                },
                experience_relevancy: {
                    similarity: 0.74,
                    experience_excerpt: "Software Developer with 3+ years experience in full-stack development..."
                },
                ats_friendliness: {
                    issues: [
                        "Resume may contain tables or vertical separators; tables can confuse some ATS."
                    ],
                    score: 0.85
                }
            }
            
            setAnalysis(mockAnalysis)
        } catch (error) {
            console.error('Analysis failed:', error)
            alert('Failed to analyze resume. Please try again.')
        } finally {
            setAnalyzing(false)
        }
    }

    const downloadReport = () => {
        if (!analysis) return
        
        const reportData = {
            ...analysis,
            generated_at: new Date().toISOString(),
            job_description: jobDescription
        }
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'resume_analysis_report.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className='mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
            <div className='flex gap-3 sm:gap-4 lg:gap-5 items-center mb-4 sm:mb-6 lg:mb-8'>
                <ArrowLeft 
                    onClick={() => router.back()} 
                    className='cursor-pointer h-5 w-5 sm:h-6 sm:w-6 text-gray-600 hover:text-blue-600 transition-colors'
                />
                <h2 className='font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800'>AI Resume Analyzer</h2>
            </div>

            {!analysis ? (
                <div className='max-w-4xl mx-auto space-y-6'>
                    {/* Job Description Input */}
                    <div className='bg-white p-4 sm:p-6 lg:p-8 rounded-xl border shadow-sm'>
                        <h3 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800'>Job Description</h3>
                        <Textarea
                            placeholder="Paste the job description here to match skills and requirements..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='h-32 sm:h-40 resize-none'
                        />
                    </div>

                    {/* Resume Upload */}
                    <div className='bg-white p-4 sm:p-6 lg:p-8 rounded-xl border shadow-sm'>
                        <h3 className='text-lg sm:text-xl font-semibold mb-4 text-gray-800'>Upload Resume</h3>
                        <div 
                            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 lg:p-10 text-center transition-colors ${
                                dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Upload className='mx-auto h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-gray-400 mb-3 sm:mb-4'/>
                            <h4 className='text-base sm:text-lg lg:text-xl font-medium mb-2 text-gray-800'>Upload Resume</h4>
                            <p className='text-sm sm:text-base text-gray-500 mb-3 sm:mb-4'>
                                Drag and drop your resume here, or click to browse
                            </p>
                            <p className='text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4'>
                                Supports PDF, DOC, DOCX, TXT files
                            </p>
                            
                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileInput}
                            />
                            <Button 
                                onClick={() => document.getElementById('resume-upload').click()}
                                variant="outline"
                            >
                                Choose File
                            </Button>
                        </div>

                        {file && (
                            <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border'>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3'>
                                    <FileText className='h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0'/>
                                    <div className='flex-1 min-w-0'>
                                        <span className='font-medium text-sm sm:text-base text-gray-800 block truncate'>{file.name}</span>
                                        <span className='text-xs sm:text-sm text-gray-500'>
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                </div>
                                
                                <Button 
                                    onClick={analyzeResume}
                                    className='w-full mt-3 sm:mt-4 h-10 sm:h-11 text-sm sm:text-base'
                                    disabled={analyzing || !jobDescription.trim()}
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className='mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin'/>
                                            Analyzing Resume...
                                        </>
                                    ) : (
                                        'Analyze Resume'
                                    )}
                                </Button>
                                
                                {analyzing && (
                                    <div className='mt-3 sm:mt-4'>
                                        <Progress value={33} className='mb-2 h-2'/>
                                        <p className='text-xs sm:text-sm text-gray-600 text-center'>
                                            AI is analyzing your resume against job requirements...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='max-w-6xl mx-auto space-y-4 sm:space-y-6'>
                    {/* Header with Download */}
                    <div className='bg-white p-4 sm:p-6 lg:p-8 rounded-xl border shadow-sm'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                            <div>
                                <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-800'>Analysis Results</h3>
                                <p className='text-sm sm:text-base text-gray-600 truncate'>{analysis.resume_path}</p>
                            </div>
                            <Button onClick={downloadReport} variant="outline" className='flex items-center gap-2'>
                                <Download className='h-4 w-4'/>
                                Download Report
                            </Button>
                        </div>
                    </div>

                    {/* Score Overview */}
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
                        <div className='text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200'>
                            <div className='text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600'>
                                {Math.round(analysis.skill_match_ratio * 100)}%
                            </div>
                            <div className='text-xs sm:text-sm text-gray-600 mt-1'>Skill Match</div>
                        </div>
                        <div className='text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200'>
                            <div className='text-xl sm:text-2xl lg:text-3xl font-bold text-green-600'>
                                {Math.round(analysis.keyword_coverage * 100)}%
                            </div>
                            <div className='text-xs sm:text-sm text-gray-600 mt-1'>Keyword Match</div>
                        </div>
                        <div className='text-center p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200'>
                            <div className='text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600'>
                                {Math.round(analysis.outcome.score * 100)}%
                            </div>
                            <div className='text-xs sm:text-sm text-gray-600 mt-1'>Impact Score</div>
                        </div>
                        <div className='text-center p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200'>
                            <div className='text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600'>
                                {Math.round(analysis.ats_friendliness.score * 100)}%
                            </div>
                            <div className='text-xs sm:text-sm text-gray-600 mt-1'>ATS Score</div>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                        {/* Skills Analysis */}
                        <div className='bg-white p-4 sm:p-6 rounded-xl border shadow-sm'>
                            <h4 className='font-bold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 text-gray-800'>Skills Analysis</h4>
                            <div className='space-y-2'>
                                {analysis.semantic_skill_matches.map((skill, index) => (
                                    <div key={index} className='flex items-center justify-between p-2 rounded-lg bg-gray-50'>
                                        <span className='text-sm font-medium'>{skill.skill}</span>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-xs text-gray-500'>{Math.round(skill.similarity * 100)}%</span>
                                            {skill.matched ? (
                                                <CheckCircle className='h-4 w-4 text-green-500'/>
                                            ) : (
                                                <AlertCircle className='h-4 w-4 text-red-500'/>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Impact & Outcomes */}
                        <div className='bg-white p-4 sm:p-6 rounded-xl border shadow-sm'>
                            <h4 className='font-bold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 text-gray-800'>Impact Statements</h4>
                            <div className='space-y-2'>
                                {analysis.outcome.metric_sentences.map((sentence, index) => (
                                    <div key={index} className='p-3 bg-green-50 rounded-lg border-l-4 border-green-400'>
                                        <p className='text-sm text-gray-700'>{sentence}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grammar Check */}
                        <div className='bg-white p-4 sm:p-6 rounded-xl border shadow-sm'>
                            <h4 className='font-bold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 text-gray-800'>Grammar & Language</h4>
                            <div className='mb-3'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium'>Grammar Score</span>
                                    <span className='text-lg font-bold text-blue-600'>{Math.round(analysis.grammar.score * 100)}%</span>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                {analysis.grammar.issues.slice(0, 3).map((issue, index) => (
                                    <div key={index} className='p-2 bg-yellow-50 rounded-lg text-sm'>
                                        <p className='font-medium text-yellow-800'>{issue.message}</p>
                                        <p className='text-yellow-600 text-xs'>"{issue.context}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ATS Friendliness */}
                        <div className='bg-white p-4 sm:p-6 rounded-xl border shadow-sm'>
                            <h4 className='font-bold text-base sm:text-lg lg:text-xl mb-3 sm:mb-4 text-gray-800'>ATS Compatibility</h4>
                            <div className='space-y-2'>
                                {analysis.ats_friendliness.issues.length > 0 ? (
                                    analysis.ats_friendliness.issues.map((issue, index) => (
                                        <div key={index} className='p-3 bg-red-50 rounded-lg border-l-4 border-red-400'>
                                            <p className='text-sm text-red-700'>{issue}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className='p-3 bg-green-50 rounded-lg border-l-4 border-green-400'>
                                        <p className='text-sm text-green-700'>No ATS compatibility issues found!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6'>
                        <Button 
                            onClick={() => {setFile(null); setAnalysis(null); setJobDescription('');}} 
                            variant="outline"
                            className='w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base'
                        >
                            Analyze Another Resume
                        </Button>
                        <Button 
                            onClick={() => router.push('/dashboard')}
                            className='w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base'
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResumeAnalyzer