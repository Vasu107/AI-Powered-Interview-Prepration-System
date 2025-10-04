"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Mic, MicOff, Camera, CameraOff, AlertTriangle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AIAvatar from '@/components/AIAvatar';

function InterviewSession() {
    const router = useRouter();
    const [interviewData, setInterviewData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [questionTimeLeft, setQuestionTimeLeft] = useState(120);
    const [totalTimeLeft, setTotalTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(false);
    const [aiSpeechComplete, setAiSpeechComplete] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [stream, setStream] = useState(null);
    const [showCameraWarning, setShowCameraWarning] = useState(false);
    const [showMovementWarning, setShowMovementWarning] = useState(false);
    const [showMultiplePersonWarning, setShowMultiplePersonWarning] = useState(false);
    const [multiplePersonWarningTimeout, setMultiplePersonWarningTimeout] = useState(null);
    const [isWarningActive, setIsWarningActive] = useState(false);
    const [lastWarningTime, setLastWarningTime] = useState(0);
    const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);
    const [previousFrame, setPreviousFrame] = useState(null);
    const [currentEmotion, setCurrentEmotion] = useState('Neutral');
    const [emotionHistory, setEmotionHistory] = useState([]);
    const [facialMetrics, setFacialMetrics] = useState({
        mouthOpen: 0,
        eyebrowRaise: 0,
        smileFactor: 0,
        confidence: 0
    });
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const timerRef = useRef(null);
    const motionDetectionRef = useRef(null);

    useEffect(() => {
        const storedInterview = localStorage.getItem('currentInterview');
        if (storedInterview) {
            const data = JSON.parse(storedInterview);
            setInterviewData(data);
            const duration = parseInt(data.Duration.replace(' Min', '')) * 60;
            setTotalTimeLeft(duration);
            setQuestionTimeLeft(120);
            startCameraAutomatically();
            
            setTimeout(() => {
                setIsTimerActive(true);
            }, 3000);
            
            toast.info(`AI Interview started! You have ${data.Duration} total time for ${data.questionCount} questions.`);
        } else {
            router.push('/dashboard/create-interview');
        }
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setShowTabSwitchWarning(true);
                setTimeout(() => setShowTabSwitchWarning(false), 10000);
            }
        };
        
        const cleanup = () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (motionDetectionRef.current) {
                clearInterval(motionDetectionRef.current);
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', cleanup);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', cleanup);
            cleanup();
        };
    }, [router, stream]);

    const startCameraAutomatically = async () => {
        if (cameraLoading || isCameraOn) return;
        setCameraLoading(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: false 
            });
            setStream(mediaStream);
            setIsCameraOn(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    startMotionDetection();
                };
            }
            toast.success("Camera started automatically for interview monitoring");
        } catch (error) {
            toast.error("Camera access required for interview");
            setIsCameraOn(false);
        } finally {
            setCameraLoading(false);
        }
    };

    const startMotionDetection = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        motionDetectionRef.current = setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                analyzeFacialExpression(canvas, ctx);
                detectMultipleFaces(canvas, ctx);
                
                if (previousFrame) {
                    const motionLevel = detectMotion(previousFrame, currentFrame);
                    if (motionLevel > 5000) {
                        setShowMovementWarning(true);
                        setTimeout(() => setShowMovementWarning(false), 15000);
                    }
                }
                setPreviousFrame(currentFrame);
            }
        }, 1000);
    };

    const detectMotion = (frame1, frame2) => {
        let motionLevel = 0;
        for (let i = 0; i < frame1.data.length; i += 4) {
            const diff = Math.abs(frame1.data[i] - frame2.data[i]) +
                        Math.abs(frame1.data[i + 1] - frame2.data[i + 1]) +
                        Math.abs(frame1.data[i + 2] - frame2.data[i + 2]);
            motionLevel += diff;
        }
        return motionLevel;
    };

    const analyzeFacialExpression = async (canvas, ctx) => {
        try {
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                
                const formData = new FormData();
                formData.append('image', blob, 'frame.jpg');
                
                try {
                    const response = await fetch('/api/emotion-detection', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                        const result = await response.json();
                        if (result.success && result.emotion) {
                            setCurrentEmotion(result.emotion);
                            setFacialMetrics({
                                confidence: result.confidence || 0.8,
                                mouthOpen: result.metrics?.mouthOpen || 0,
                                eyebrowRaise: result.metrics?.eyebrowRaise || 0,
                                smileFactor: result.metrics?.smileFactor || 0
                            });
                            
                            const now = Date.now();
                            setEmotionHistory(prev => {
                                const lastEntry = prev[prev.length - 1];
                                if (!lastEntry || now - lastEntry.timestamp > 3000) {
                                    return [...prev.slice(-30), { 
                                        emotion: result.emotion, 
                                        confidence: result.confidence,
                                        timestamp: now 
                                    }];
                                }
                                return prev;
                            });
                        }
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    const simpleEmotion = detectSimpleEmotion(canvas, ctx);
                    setCurrentEmotion(simpleEmotion);
                }
            }, 'image/jpeg', 0.8);
        } catch (error) {
            console.error('Emotion analysis error:', error);
        }
    };
    
    const detectMultipleFaces = (canvas, ctx) => {
        // Simple face detection based on skin tone regions
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let faceRegions = 0;
        let skinPixels = 0;
        
        // Scan for skin-tone regions (simplified detection)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Basic skin tone detection
            if (r > 95 && g > 40 && b > 20 && 
                Math.max(r, g, b) - Math.min(r, g, b) > 15 && 
                Math.abs(r - g) > 15 && r > g && r > b) {
                skinPixels++;
            }
        }
        
        // Simulate multiple face detection (random for demo)
        const multipleFacesDetected = Math.random() < 0.05; // 5% chance for demo
        
        if (multipleFacesDetected && !showMultiplePersonWarning) {
            setShowMultiplePersonWarning(true);
            if (multiplePersonWarningTimeout) {
                clearTimeout(multiplePersonWarningTimeout);
            }
            const timeout = setTimeout(() => {
                setShowMultiplePersonWarning(false);
            }, 8000);
            setMultiplePersonWarningTimeout(timeout);
        }
        
        return skinPixels > 1000; // Return if faces detected
    };
    
    const detectSimpleEmotion = (canvas, ctx) => {
        const emotions = ['Neutral', 'Happy', 'Focused', 'Thinking'];
        return emotions[Math.floor(Math.random() * emotions.length)];
    };

    useEffect(() => {
        if (isTimerActive && questionTimeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setQuestionTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (questionTimeLeft === 0) {
            handleTimeUp();
        }
        return () => clearTimeout(timerRef.current);
    }, [isTimerActive, questionTimeLeft]);

    const handleAnswerChange = (value) => {
        setCurrentAnswer(value);
        if (!hasStartedTyping && value.trim()) {
            setHasStartedTyping(true);
        }
    };

    const handleTimeUp = () => {
        setIsTimerActive(false);
        const timeoutAnswer = currentAnswer || "[TIMEOUT - Answer incomplete]";
        saveCurrentAnswer(timeoutAnswer, true);
        toast.error("Time's up! Moving to next question.");
        setTimeout(() => moveToNextQuestion(), 1500);
    };

    const saveCurrentAnswer = (answer, timedOut = false) => {
        const answerData = {
            questionId: interviewData.questions[currentQuestionIndex].id,
            question: interviewData.questions[currentQuestionIndex].question,
            userAnswer: answer,
            correctAnswer: interviewData.questions[currentQuestionIndex].correctAnswer,
            timeTaken: 120 - questionTimeLeft,
            timedOut: timedOut,
            timestamp: new Date().toISOString()
        };
        
        setAnswers(prev => [...prev, answerData]);
    };

    const moveToNextQuestion = () => {
        if (currentQuestionIndex < interviewData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer('');
            setHasStartedTyping(false);
            setQuestionTimeLeft(120);
            setAiSpeechComplete(false);
            setIsTimerActive(true);
        } else {
            completeInterview();
        }
    };

    const handleNextQuestion = () => {
        if (!currentAnswer.trim() && !hasStartedTyping) {
            toast.error("Please provide an answer before proceeding.");
            return;
        }
        
        setIsTimerActive(false);
        saveCurrentAnswer(currentAnswer);
        setTimeout(() => moveToNextQuestion(), 100);
    };

    const completeInterview = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (motionDetectionRef.current) {
            clearInterval(motionDetectionRef.current);
        }
        setIsCameraOn(false);
        toast.success("Interview completed! Camera has been turned off.");
        
        const finalResults = {
            ...interviewData,
            id: Date.now().toString(),
            answers: answers,
            emotionHistory: emotionHistory,
            finalEmotion: currentEmotion,
            facialMetrics: facialMetrics,
            completedAt: new Date().toISOString(),
            createdAt: interviewData.createdAt || new Date().toISOString(),
            totalQuestions: interviewData.questions.length,
            answeredQuestions: answers.length
        };
        
        // Store in interview results
        localStorage.setItem('interviewResults', JSON.stringify(finalResults));
        
        // Store in all interviews list
        const existingInterviews = JSON.parse(localStorage.getItem('allInterviews') || '[]');
        existingInterviews.push(finalResults);
        localStorage.setItem('allInterviews', JSON.stringify(existingInterviews));
        
        localStorage.removeItem('currentInterview');
        router.push('/dashboard/interview-results');
    };

    const toggleCamera = async () => {
        if (cameraLoading) return;
        
        if (!isCameraOn) {
            setCameraLoading(true);
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: false 
                });
                setStream(mediaStream);
                setIsCameraOn(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        startMotionDetection();
                    };
                }
                toast.success("Camera enabled");
            } catch (error) {
                toast.error("Camera access denied");
                setIsCameraOn(false);
            } finally {
                setCameraLoading(false);
            }
        } else {
            setShowCameraWarning(true);
        }
    };

    const confirmCameraClose = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (motionDetectionRef.current) {
            clearInterval(motionDetectionRef.current);
            motionDetectionRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
        setShowCameraWarning(false);
        toast.warning("Camera disabled - Interview monitoring stopped");
    };

    const cancelCameraClose = () => {
        setShowCameraWarning(false);
    };

    const toggleRecording = async () => {
        if (!isRecording) {
            try {
                const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';
                
                recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    setCurrentAnswer(transcript);
                    if (!hasStartedTyping && transcript.trim()) {
                        setHasStartedTyping(true);
                    }
                };
                
                recognition.start();
                setMediaRecorder(recognition);
                setIsRecording(true);
                toast.success("Voice recording started - Speak your answer");
            } catch (error) {
                toast.error("Speech recognition not supported");
            }
        } else {
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            setIsRecording(false);
            toast.info("Voice recording stopped");
        }
    };

    if (!interviewData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading interview...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = interviewData?.questions?.[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / (interviewData?.questions?.length || 1)) * 100;

    if (!currentQuestion) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading question...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            {/* Header */}
            <div className='bg-white shadow-lg p-4 border-b-2 border-blue-200 flex-shrink-0'>
                <div className='max-w-6xl mx-auto'>
                    <div className='flex items-center gap-4 mb-3'>
                        <ArrowLeft 
                            onClick={() => router.back()} 
                            className='cursor-pointer h-5 w-5 text-gray-700 hover:text-blue-600'
                        />
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800'>AI Interview Session</h1>
                            <p className='text-sm text-blue-600 font-medium'>
                                Position: {interviewData?.jobPosition || 'Not specified'}
                            </p>
                        </div>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-gray-600'/>
                                <span className='text-xs text-gray-600'>Time:</span>
                                <span className={`font-mono text-lg font-bold ${questionTimeLeft < 30 ? 'text-red-500' : 'text-green-600'}`}>
                                    {Math.floor(questionTimeLeft / 60)}:{(questionTimeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                            <div className='text-sm font-semibold text-gray-700'>
                                Question {currentQuestionIndex + 1} of {interviewData.questions.length}
                            </div>
                        </div>
                        
                        <div className='flex gap-3'>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleCamera}
                                disabled={cameraLoading}
                                className={isCameraOn ? 'bg-green-100 border-green-300' : ''}
                            >
                                {cameraLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                ) : isCameraOn ? (
                                    <Camera className='h-4 w-4'/>
                                ) : (
                                    <CameraOff className='h-4 w-4'/>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleRecording}
                                className={isRecording ? 'bg-red-100 border-red-300' : ''}
                            >
                                {isRecording ? <Mic className='h-4 w-4'/> : <MicOff className='h-4 w-4'/>}
                            </Button>
                        </div>
                    </div>
                    
                    <Progress value={progress} className='mt-2 h-2'/>
                </div>
            </div>

            {/* Main Interview Layout */}
            <div className='flex flex-1 bg-white'>
                {/* Left Side - User Camera */}
                <div className='w-1/2 border-r-2 border-gray-200 p-4 flex flex-col'>
                    <h2 className='text-lg font-semibold text-gray-800 mb-3'>Your Video</h2>
                    
                    <div className='flex items-center justify-center flex-1'>
                        {isCameraOn ? (
                            <div className='relative w-full max-w-lg aspect-video bg-black rounded-xl overflow-hidden shadow-lg'>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className='w-full h-full object-cover'
                                />
                                <canvas ref={canvasRef} className='hidden' />
                                <div className='absolute top-3 right-3 bg-red-500 w-4 h-4 rounded-full animate-pulse'></div>
                                
                                <div className='absolute bottom-3 left-3 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm'>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <div className={`w-3 h-3 rounded-full ${
                                            currentEmotion === 'Happy' ? 'bg-green-400' :
                                            currentEmotion === 'Sad' ? 'bg-blue-400' :
                                            currentEmotion === 'Angry' ? 'bg-red-400' :
                                            currentEmotion === 'Surprised' ? 'bg-yellow-400' :
                                            'bg-gray-400'
                                        }`}></div>
                                        <span className='font-medium'>{currentEmotion}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='w-full max-w-lg aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center'>
                                <div className='text-center text-gray-500'>
                                    <CameraOff className='h-16 w-16 mx-auto mb-3' />
                                    <p className='text-lg font-medium'>Camera is off</p>
                                    <p className='text-sm'>Enable camera to start monitoring</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - AI Avatar */}
                <div className='w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100'>
                    <div className='h-full'>
                        <AIAvatar 
                            currentQuestion={currentQuestion?.question}
                            onSpeechComplete={() => setAiSpeechComplete(true)}
                            isListening={isRecording}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Panel - Answer Input */}
            <div className='bg-gray-50 border-t-4 border-blue-300 p-4 min-h-[200px] flex flex-col'>
                <div className='max-w-6xl mx-auto flex-1 flex flex-col'>
                    <div className='mb-3'>
                        <h3 className='text-lg font-bold text-gray-800 mb-1'>{currentQuestion?.question}</h3>
                        <div className='flex justify-between items-center text-xs text-gray-600'>
                            <span className='font-medium'>Progress: {currentQuestionIndex + 1}/{interviewData.questions.length}</span>
                            <span className='text-blue-600 font-medium'>⏰ 2 minutes per question</span>
                        </div>
                    </div>
                    
                    <div className='flex gap-3 items-start'>
                        <Textarea
                            placeholder="Please provide a detailed answer to the interview question."
                            value={currentAnswer}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className='flex-1 h-20 w-3xl text-sm border-2 border-gray-300 focus:border-blue-500 rounded-lg p-3 resize-none'
                            disabled={questionTimeLeft === 0}
                        />
                        <Button 
                            onClick={handleNextQuestion}
                            disabled={questionTimeLeft === 0}
                            className='px-6 py-2 h-20 text-base bg-blue-600 hover:bg-blue-700 font-semibold flex items-center gap-2'
                        >
                            {currentQuestionIndex === interviewData.questions.length - 1 ? 'Complete' : 'Next'}
                            <ChevronRight className='h-4 w-4'/>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Camera Warning Modal */}
            {showCameraWarning && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 max-w-md mx-4'>
                        <div className='flex items-center gap-3 mb-4'>
                            <AlertTriangle className='h-6 w-6 text-red-500'/>
                            <h3 className='text-lg font-semibold'>Disable Camera?</h3>
                        </div>
                        <p className='text-gray-600 mb-6'>
                            Disabling the camera will stop interview monitoring. This may affect your interview evaluation.
                        </p>
                        <div className='flex gap-3 justify-end'>
                            <Button variant="outline" onClick={cancelCameraClose}>
                                Keep Camera On
                            </Button>
                            <Button variant="destructive" onClick={confirmCameraClose}>
                                Disable Camera
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Movement Warning */}
            {showMovementWarning && (
                <div className='fixed top-20 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-40'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-5 w-5'/>
                        <span className='font-medium'>Movement Detected!</span>
                    </div>
                    <p className='text-sm mt-1'>Please remain still during the interview.</p>
                </div>
            )}

            {/* Multiple Person Warning */}
            {showMultiplePersonWarning && (
                <div className='fixed top-36 right-4 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-lg z-40'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-5 w-5'/>
                        <span className='font-medium'>Multiple Faces Detected!</span>
                    </div>
                    <p className='text-sm mt-1'>Only one person should be visible during the interview.</p>
                </div>
            )}

            {/* Tab Switch Warning */}
            {showTabSwitchWarning && (
                <div className='fixed top-0 left-0 right-0 bg-orange-500 text-white px-4 py-3 z-50 shadow-lg'>
                    <div className='flex items-center justify-between max-w-7xl mx-auto'>
                        <div className='flex items-center gap-3'>
                            <AlertTriangle className='h-5 w-5'/>
                            <div>
                                <span className='font-semibold'>Tab Switch Detected!</span>
                                <span className='ml-2 text-sm'>Please stay on this interview tab. Switching tabs is not allowed during the interview.</span>
                            </div>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowTabSwitchWarning(false)}
                            className='bg-white text-orange-500 hover:bg-gray-100'
                        >
                            Understood
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InterviewSession;