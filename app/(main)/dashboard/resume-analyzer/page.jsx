"use client"
import React, { useState } from 'react'
import { ArrowLeft, Upload, FileText, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

function ResumeAnalyzer() {
    const router = useRouter()
    const [file, setFile] = useState(null)
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
        if (!file) return
        
        setAnalyzing(true)
        
        try {
            const { ResumeAnalyzer, extractTextFromFile } = await import('@/services/resumeAnalyzer')
            const analyzer = new ResumeAnalyzer()
            
            // Extract text from file
            const resumeText = await extractTextFromFile(file)
            
            // Analyze resume with ML algorithms
            const mlAnalysis = await analyzer.analyzeResume(resumeText)
            
            setAnalysis({
                overallScore: mlAnalysis.overallScore,
                atsScore: mlAnalysis.atsScore,
                skillsMatch: mlAnalysis.skillsMatch,
                experienceLevel: mlAnalysis.experienceLevel,
                educationScore: mlAnalysis.educationScore,
                formatScore: mlAnalysis.formatScore,
                keywordDensity: mlAnalysis.keywordDensity,
                recommendations: mlAnalysis.recommendations,
                fileName: file.name
            })
        } catch (error) {
            console.error('Analysis failed:', error)
            alert('Failed to analyze resume. Please try again.')
        } finally {
            setAnalyzing(false)
        }
    }

    return (
        <div className='mt-6 px-4 md:px-8'>
            <div className='flex gap-5 items-center mb-6'>
                <ArrowLeft onClick={() => router.back()} className='cursor-pointer'/>
                <h2 className='font-bold text-2xl'>Resume Analyzer</h2>
            </div>

            {!analysis ? (
                <div className='max-w-2xl mx-auto'>
                    <div className='bg-white p-8 rounded-xl border'>
                        <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4'/>
                            <h3 className='text-lg font-medium mb-2'>Upload Resume</h3>
                            <p className='text-gray-500 mb-4'>
                                Drag and drop your resume here, or click to browse
                            </p>
                            <p className='text-sm text-gray-400 mb-4'>
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
                            <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                                <div className='flex items-center gap-3'>
                                    <FileText className='h-5 w-5 text-primary'/>
                                    <span className='font-medium'>{file.name}</span>
                                    <span className='text-sm text-gray-500'>
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                
                                <Button 
                                    onClick={analyzeResume}
                                    className='w-full mt-4'
                                    disabled={analyzing}
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                            Analyzing Resume...
                                        </>
                                    ) : (
                                        'Analyze Resume'
                                    )}
                                </Button>
                                
                                {analyzing && (
                                    <div className='mt-4'>
                                        <Progress value={33} className='mb-2'/>
                                        <p className='text-sm text-gray-600 text-center'>
                                            AI is analyzing your resume...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='max-w-6xl mx-auto space-y-6'>
                    <div className='bg-white p-6 rounded-xl border'>
                        <h3 className='text-xl font-bold mb-4'>ML Analysis Results - {analysis.fileName}</h3>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                            <div className='text-center p-4 bg-blue-50 rounded-lg'>
                                <div className='text-2xl font-bold text-primary'>{analysis.overallScore}%</div>
                                <div className='text-sm text-gray-600'>Overall Score</div>
                            </div>
                            <div className='text-center p-4 bg-green-50 rounded-lg'>
                                <div className='text-2xl font-bold text-green-600'>{analysis.atsScore}%</div>
                                <div className='text-sm text-gray-600'>ATS Score</div>
                            </div>
                            <div className='text-center p-4 bg-purple-50 rounded-lg'>
                                <div className='text-lg font-semibold'>{analysis.experienceLevel.level}</div>
                                <div className='text-sm text-gray-600'>{analysis.experienceLevel.years} Years</div>
                            </div>
                            <div className='text-center p-4 bg-orange-50 rounded-lg'>
                                <div className='text-lg font-semibold'>{analysis.skillsMatch.all.length}</div>
                                <div className='text-sm text-gray-600'>Skills Found</div>
                            </div>
                        </div>
                    </div>

                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='bg-white p-6 rounded-xl border'>
                            <h4 className='font-bold text-lg mb-4'>Skills Analysis</h4>
                            <div className='space-y-3'>
                                <div>
                                    <h5 className='font-semibold text-blue-600 mb-1'>Technical Skills</h5>
                                    <div className='flex flex-wrap gap-2'>
                                        {analysis.skillsMatch.technical.map((skill, index) => (
                                            <span key={index} className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm'>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className='font-semibold text-green-600 mb-1'>Tools & Frameworks</h5>
                                    <div className='flex flex-wrap gap-2'>
                                        {[...analysis.skillsMatch.tools, ...analysis.skillsMatch.frameworks].map((skill, index) => (
                                            <span key={index} className='px-2 py-1 bg-green-100 text-green-800 rounded text-sm'>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-6 rounded-xl border'>
                            <h4 className='font-bold text-lg mb-4'>Quality Metrics</h4>
                            <div className='space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <span>Education Score</span>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-20 bg-gray-200 rounded-full h-2'>
                                            <div className='bg-blue-600 h-2 rounded-full' style={{width: `${analysis.educationScore.score}%`}}></div>
                                        </div>
                                        <span className='text-sm font-semibold'>{analysis.educationScore.score}%</span>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span>Format Score</span>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-20 bg-gray-200 rounded-full h-2'>
                                            <div className='bg-green-600 h-2 rounded-full' style={{width: `${analysis.formatScore}%`}}></div>
                                        </div>
                                        <span className='text-sm font-semibold'>{analysis.formatScore}%</span>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span>Keyword Density</span>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-20 bg-gray-200 rounded-full h-2'>
                                            <div className='bg-purple-600 h-2 rounded-full' style={{width: `${analysis.keywordDensity.density}%`}}></div>
                                        </div>
                                        <span className='text-sm font-semibold'>{analysis.keywordDensity.density}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-6 rounded-xl border'>
                        <h4 className='font-bold text-lg mb-4'>AI Recommendations</h4>
                        <div className='grid md:grid-cols-2 gap-4'>
                            {analysis.recommendations.map((rec, index) => (
                                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                                    rec.priority === 'High' ? 'border-red-500 bg-red-50' :
                                    rec.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
                                    'border-blue-500 bg-blue-50'
                                }`}>
                                    <div className='flex justify-between items-start mb-2'>
                                        <h5 className='font-semibold'>{rec.type}</h5>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            rec.priority === 'High' ? 'bg-red-200 text-red-800' :
                                            rec.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-blue-200 text-blue-800'
                                        }`}>
                                            {rec.priority}
                                        </span>
                                    </div>
                                    <p className='text-sm text-gray-700'>{rec.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <Button onClick={() => {setFile(null); setAnalysis(null)}} variant="outline">
                            Analyze Another Resume
                        </Button>
                        <Button onClick={() => router.push('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResumeAnalyzer