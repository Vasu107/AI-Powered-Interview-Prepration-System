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
    const [questionTimeLeft, setQuestionTimeLeft] = useState(10);
    const [answerTimeLeft, setAnswerTimeLeft] = useState(120);
    const [totalTimeLeft, setTotalTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isAnswerTimerActive, setIsAnswerTimerActive] = useState(false);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [timerPhase, setTimerPhase] = useState('waiting'); // 'waiting', 'answering', 'timeout'
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
            setQuestionTimeLeft(10);
            setAnswerTimeLeft(120);
            setTimerPhase('waiting');
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
        if (isTimerActive && timerPhase === 'waiting' && questionTimeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setQuestionTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timerPhase === 'waiting' && questionTimeLeft === 0) {
            // Auto move to next question after 10 seconds
            handleAutoNext();
        }
        
        if (isAnswerTimerActive && timerPhase === 'answering' && answerTimeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setAnswerTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timerPhase === 'answering' && answerTimeLeft === 0) {
            handleAnswerTimeUp();
        }
        
        return () => clearTimeout(timerRef.current);
    }, [isTimerActive, isAnswerTimerActive, questionTimeLeft, answerTimeLeft, timerPhase]);

    const handleAnswerChange = (value) => {
        // Limit to 100 words
        const words = value.trim().split(/\s+/);
        if (words.length > 100 && value.trim() !== '') {
            toast.warning("Answer limited to 100 words maximum");
            return;
        }
        
        setCurrentAnswer(value);
        if (!hasStartedTyping && value.trim() && timerPhase === 'waiting') {
            setHasStartedTyping(true);
            startAnswerTimer();
        }
    };
    
    const getWordCount = (text) => {
        return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    };
    
    const startAnswerTimer = () => {
        setTimerPhase('answering');
        setIsTimerActive(false);
        setIsAnswerTimerActive(true);
        setAnswerTimeLeft(120); // 2 minutes for answering
        toast.info("Answer timer started - You have 2 minutes to complete your answer");
    };
    
    const handleAutoNext = () => {
        setIsTimerActive(false);
        const timeoutAnswer = "[NO ANSWER - Question skipped after 10 seconds]";
        saveCurrentAnswer(timeoutAnswer, true);
        toast.warning("No answer provided within 10 seconds. Moving to next question.");
        setTimeout(() => moveToNextQuestion(), 1500);
    };
    
    const handleAnswerTimeUp = () => {
        setIsAnswerTimerActive(false);
        const timeoutAnswer = currentAnswer || "[TIMEOUT - Answer incomplete after 2 minutes]";
        saveCurrentAnswer(timeoutAnswer, true);
        toast.error("Answer time limit reached! Moving to next question.");
        setTimeout(() => moveToNextQuestion(), 1500);
    };

    const calculateAnswerScore = (userAnswer, correctAnswer, timedOut) => {
        // No score for timeout or empty answers
        if (timedOut || !userAnswer || userAnswer.includes('[NO ANSWER') || userAnswer.includes('[TIMEOUT')) {
            return 0;
        }
        
        // Simple scoring based on keyword matching and answer quality
        const userWords = userAnswer.toLowerCase().split(/\s+/);
        const correctWords = correctAnswer.toLowerCase().split(/\s+/);
        
        // Calculate keyword overlap
        let matchCount = 0;
        correctWords.forEach(word => {
            if (word.length > 3 && userWords.some(userWord => userWord.includes(word) || word.includes(userWord))) {
                matchCount++;
            }
        });
        
        // Base score from keyword matching (0-7 points)
        let score = Math.min(7, Math.round((matchCount / correctWords.length) * 7));
        
        // Bonus points for answer length and completeness (0-3 points)
        if (userAnswer.length > 50) score += 1;
        if (userAnswer.length > 100) score += 1;
        if (userWords.length >= 20) score += 1;
        
        return Math.min(10, Math.max(0, score));
    };

    const saveCurrentAnswer = (answer, timedOut = false) => {
        // Safety check to ensure question exists
        if (!interviewData?.questions?.[currentQuestionIndex]) {
            console.error('Question not found at index:', currentQuestionIndex);
            return;
        }
        
        const currentQuestion = interviewData.questions[currentQuestionIndex];
        const timeTaken = timerPhase === 'answering' ? (120 - answerTimeLeft) : (10 - questionTimeLeft);
        const score = calculateAnswerScore(answer, currentQuestion.correctAnswer || '', timedOut);
        
        const answerData = {
            questionId: currentQuestion.id || currentQuestionIndex,
            question: currentQuestion.question || 'Question not available',
            userAnswer: answer,
            correctAnswer: currentQuestion.correctAnswer || 'No correct answer provided',
            timeTaken: timeTaken,
            timedOut: timedOut,
            score: score,
            timestamp: new Date().toISOString()
        };
        
        setAnswers(prev => [...prev, answerData]);
    };

    const moveToNextQuestion = () => {
        // Turn off microphone if it's on
        if (isRecording && mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
            setIsRecording(false);
            toast.info("Microphone turned off for next question");
        }
        
        if (currentQuestionIndex < interviewData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentAnswer(''); // Clear text area
            setHasStartedTyping(false);
            setQuestionTimeLeft(10);
            setAnswerTimeLeft(120);
            setTimerPhase('waiting');
            setAiSpeechComplete(false);
            setIsTimerActive(true);
            setIsAnswerTimerActive(false);
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
        setIsAnswerTimerActive(false);
        
        // Save current answer
        if (currentAnswer.trim()) {
            saveCurrentAnswer(currentAnswer);
        }
        
        // Turn off microphone if it's on
        if (isRecording && mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
            setIsRecording(false);
        }
        
        // Check if this is the last question
        if (currentQuestionIndex === interviewData.questions.length - 1) {
            setTimeout(() => completeInterview(), 100);
        } else {
            setTimeout(() => moveToNextQuestion(), 100);
        }
    };

    const completeInterview = () => {
        // Save current answer if exists
        if (currentAnswer.trim()) {
            saveCurrentAnswer(currentAnswer);
        }
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (motionDetectionRef.current) {
            clearInterval(motionDetectionRef.current);
        }
        setIsCameraOn(false);
        toast.success("Interview completed! Camera has been turned off.");
        
        // Wait for state update then create final results
        setTimeout(() => {
            const finalAnswers = currentAnswer.trim() && interviewData?.questions?.[currentQuestionIndex] ? [...answers, {
                questionId: interviewData.questions[currentQuestionIndex].id || currentQuestionIndex,
                question: interviewData.questions[currentQuestionIndex].question || 'Question not available',
                userAnswer: currentAnswer,
                correctAnswer: interviewData.questions[currentQuestionIndex].correctAnswer || 'No correct answer provided',
                timeTaken: 120 - questionTimeLeft,
                timedOut: false,
                score: calculateAnswerScore(currentAnswer, interviewData.questions[currentQuestionIndex].correctAnswer || '', false),
                timestamp: new Date().toISOString()
            }] : answers;
            
            // Calculate final score based on points earned
            const totalPointsEarned = finalAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0);
            const maxPossiblePoints = interviewData.questions.length * 10;
            const finalScorePercentage = maxPossiblePoints > 0 ? Math.round((totalPointsEarned / maxPossiblePoints) * 100) : 0;
            
            const finalResults = {
                ...interviewData,
                id: Date.now().toString(),
                answers: finalAnswers,
                emotionHistory: emotionHistory,
                finalEmotion: currentEmotion,
                facialMetrics: facialMetrics,
                completedAt: new Date().toISOString(),
                createdAt: interviewData.createdAt || new Date().toISOString(),
                totalQuestions: interviewData.questions.length,
                answeredQuestions: finalAnswers.length,
                totalPointsEarned: totalPointsEarned,
                maxPossiblePoints: maxPossiblePoints,
                finalScore: finalScorePercentage
            };
            
            // Store in interview results
            localStorage.setItem('interviewResults', JSON.stringify(finalResults));
            
            // Store in all interviews list
            const existingInterviews = JSON.parse(localStorage.getItem('allInterviews') || '[]');
            existingInterviews.push(finalResults);
            localStorage.setItem('allInterviews', JSON.stringify(existingInterviews));
            
            localStorage.removeItem('currentInterview');
            router.push('/dashboard/interview-results');
        }, 100);
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
                    for (let i = 0; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    
                    // Check word limit before setting
                    const words = transcript.trim().split(/\s+/);
                    if (words.length > 100 && transcript.trim() !== '') {
                        toast.warning("Voice answer limited to 100 words maximum");
                        return;
                    }
                    
                    setCurrentAnswer(transcript);
                    // Trigger answer timer when user starts speaking
                    if (!hasStartedTyping && transcript.trim() && timerPhase === 'waiting') {
                        setHasStartedTyping(true);
                        startAnswerTimer();
                    }
                };
                
                recognition.onstart = () => {
                    console.log('Speech recognition started');
                    toast.success("Listening... Start speaking your answer");
                };
                
                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    toast.error(`Speech recognition error: ${event.error}`);
                };
                
                recognition.onspeechstart = () => {
                    // Start answer timer when user actually starts speaking
                    if (timerPhase === 'waiting' && !hasStartedTyping) {
                        setHasStartedTyping(true);
                        startAnswerTimer();
                        toast.info("Speech detected - Answer timer started!");
                    }
                };
                
                recognition.onspeechend = () => {
                    console.log('Speech ended');
                };
                
                recognition.onend = () => {
                    console.log('Speech recognition ended');
                    // Don't auto-restart recognition to avoid infinite loop
                    setIsRecording(false);
                    setMediaRecorder(null);
                    toast.info("Voice recording stopped");
                };
                
                recognition.start();
                setMediaRecorder(recognition);
                setIsRecording(true);
                toast.success("Voice recording started - Timer will pause");
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
            <div className='bg-white shadow-lg p-3 sm:p-4 lg:p-5 border-b-2 border-blue-200 flex-shrink-0'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4'>
                        <ArrowLeft 
                            onClick={() => router.back()} 
                            className='cursor-pointer h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-700 hover:text-blue-600 transition-colors'
                        />
                        <div className='flex-1 min-w-0'>
                            <h1 className='text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold text-gray-800 truncate'>AI Interview Session</h1>
                            <p className='text-xs sm:text-sm lg:text-base text-blue-600 font-medium truncate'>
                                Position: {interviewData?.jobPosition || 'Not specified'}
                            </p>
                        </div>
                    </div>
                    
                    <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 flex-1'>
                            <div className='flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg'>
                                <Clock className='h-3 w-3 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0'/>
                                <span className='text-xs sm:text-sm text-gray-600'>Time:</span>
                                <span className={`font-mono text-sm sm:text-base lg:text-lg font-bold ${
                                    timerPhase === 'waiting' ? 
                                        (questionTimeLeft < 5 ? 'text-red-500' : 'text-orange-500') :
                                        (answerTimeLeft < 30 ? 'text-red-500' : 'text-green-600')
                                }`}>
                                    {timerPhase === 'waiting' ? 
                                        `${questionTimeLeft}s` :
                                        `${Math.floor(answerTimeLeft / 60)}:${(answerTimeLeft % 60).toString().padStart(2, '0')}`
                                    }
                                </span>
                                <span className='text-xs text-gray-500 ml-1'>
                                    {timerPhase === 'waiting' ? '(to start)' : '(to answer)'}
                                </span>
                            </div>
                            <div className='text-xs sm:text-sm lg:text-base font-semibold text-gray-700 bg-blue-50 px-3 py-2 rounded-lg'>
                                Question {currentQuestionIndex + 1} of {interviewData.questions.length}
                            </div>
                        </div>
                        
                        <div className='flex gap-2 sm:gap-3 flex-shrink-0'>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleCamera}
                                disabled={cameraLoading}
                                className={`${isCameraOn ? 'bg-green-100 border-green-300 text-green-700' : 'hover:bg-gray-50'} p-2 sm:p-3 h-8 w-8 sm:h-9 sm:w-9`}
                                title={isCameraOn ? 'Camera On' : 'Camera Off'}
                            >
                                {cameraLoading ? (
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-600"></div>
                                ) : isCameraOn ? (
                                    <Camera className='h-3 w-3 sm:h-4 sm:w-4'/>
                                ) : (
                                    <CameraOff className='h-3 w-3 sm:h-4 sm:w-4'/>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleRecording}
                                className={`${isRecording ? 'bg-red-100 border-red-300 text-red-700' : 'hover:bg-gray-50'} p-2 sm:p-3 h-8 w-8 sm:h-9 sm:w-9`}
                                title={isRecording ? 'Recording' : 'Not Recording'}
                            >
                                {isRecording ? <Mic className='h-3 w-3 sm:h-4 sm:w-4'/> : <MicOff className='h-3 w-3 sm:h-4 sm:w-4'/>}
                            </Button>
                        </div>
                    </div>
                    
                    <Progress value={progress} className='mt-2 h-2'/>
                </div>
            </div>

            {/* Main Interview Layout */}
            <div className='flex flex-col lg:flex-row flex-1 bg-white'>
                {/* Left Side - User Camera */}
                <div className='w-full lg:w-1/2 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 p-3 sm:p-4 flex flex-col min-h-[300px] lg:min-h-0'>
                    <h2 className='text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3'>Your Video</h2>
                    
                    <div className='flex items-center justify-center flex-1'>
                        {isCameraOn ? (
                            <div className='relative w-full max-w-sm sm:max-w-lg aspect-video bg-black rounded-xl overflow-hidden shadow-lg'>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className='w-full h-full object-cover'
                                />
                                <canvas ref={canvasRef} className='hidden' />
                                <div className='absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-pulse'></div>
                                
                                <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black bg-opacity-80 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm'>
                                    <div className='flex items-center gap-1 sm:gap-2'>
                                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
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
                            <div className='w-full max-w-sm sm:max-w-lg aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center'>
                                <div className='text-center text-gray-500'>
                                    <CameraOff className='h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-2 sm:mb-3' />
                                    <p className='text-base sm:text-lg font-medium'>Camera is off</p>
                                    <p className='text-xs sm:text-sm'>Enable camera to start monitoring</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - AI Avatar */}
                <div className='w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[300px] lg:min-h-0'>
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
            <div className='bg-gray-50 border-t-4 border-blue-300 p-3 sm:p-4 lg:p-5 min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex flex-col'>
                <div className='max-w-7xl mx-auto flex-1 flex flex-col'>
                    <div className='mb-3 sm:mb-4'>
                        <h3 className='text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 mb-2 leading-tight'>{currentQuestion?.question}</h3>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-600 gap-1 sm:gap-2'>
                            <span className='font-medium bg-white px-2 py-1 rounded'>Progress: {currentQuestionIndex + 1}/{interviewData.questions.length}</span>
                            <span className='text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded'>⏰ 2 minutes per question</span>
                        </div>
                    </div>
                    
                    <div className='flex flex-col xl:flex-row gap-3 sm:gap-4 items-stretch'>
                        <div className='flex-1 relative'>
                            <Textarea
                                placeholder={timerPhase === 'waiting' ? "Start typing to begin 2-minute answer timer... (Max 100 words)" : "Type your detailed answer here... (Max 100 words)"}
                                value={currentAnswer}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                className='h-[100px] w-full text-base border-2 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-lg p-4 resize-none transition-all duration-200 shadow-sm hover:shadow-md'
                                disabled={false}
                                maxLength={800}
                            />
                            <div className='absolute bottom-2 right-2 text-xs bg-white px-2 py-1 rounded border'>
                                <span className={`${getWordCount(currentAnswer) > 90 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                    {getWordCount(currentAnswer)}/100 words
                                </span>
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row xl:flex-col gap-2 xl:w-auto'>
                            <Button 
                                onClick={handleNextQuestion}
                                disabled={false}
                                className='px-4 sm:px-6 lg:px-8 xl:px-6 py-3 sm:py-4 h-12 sm:h-14 lg:h-16 xl:h-12 text-sm sm:text-base lg:text-lg xl:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 w-full xl:w-auto min-w-[120px] sm:min-w-[140px] xl:min-w-[120px] transition-all duration-200 shadow-md hover:shadow-lg'
                            >
                                <span>{currentQuestionIndex === interviewData.questions.length - 1 ? 'Complete Interview' : 'Next Question'}</span>
                                <ChevronRight className='h-4 w-4 sm:h-5 sm:w-5 xl:h-4 xl:w-4'/>
                            </Button>
                            <div className='text-xs sm:text-sm text-gray-500 text-center xl:text-left mt-1 xl:mt-2'>
                                {timerPhase === 'waiting' ? 
                                    (questionTimeLeft > 0 ? `${questionTimeLeft}s to start answering` : 'Auto-moving to next...') :
                                    (answerTimeLeft > 0 ? `${Math.floor(answerTimeLeft / 60)}:${(answerTimeLeft % 60).toString().padStart(2, '0')} remaining` : 'Answer time up!')
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Camera Warning Modal */}
            {showCameraWarning && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg p-4 sm:p-6 max-w-sm sm:max-w-md w-full mx-4 shadow-xl'>
                        <div className='flex items-center gap-3 mb-3 sm:mb-4'>
                            <AlertTriangle className='h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0'/>
                            <h3 className='text-base sm:text-lg font-semibold text-gray-800'>Disable Camera?</h3>
                        </div>
                        <p className='text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed'>
                            Disabling the camera will stop interview monitoring. This may affect your interview evaluation.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end'>
                            <Button 
                                onClick={cancelCameraClose}
                                className='w-full sm:w-auto text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                            >
                                Keep Camera On
                            </Button>
                            <Button 
                                onClick={confirmCameraClose}
                                className='w-full sm:w-auto text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                            >
                                Disable Camera
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Movement Warning */}
            {showMovementWarning && (
                <div className='fixed top-16 sm:top-20 right-2 sm:right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg z-40 max-w-xs sm:max-w-sm'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0'/>
                        <span className='font-medium text-sm sm:text-base'>Movement Detected!</span>
                    </div>
                    <p className='text-xs sm:text-sm mt-1'>Please remain still during the interview.</p>
                </div>
            )}

            {/* Multiple Person Warning */}
            {showMultiplePersonWarning && (
                <div className='fixed top-32 sm:top-36 right-2 sm:right-4 bg-red-100 border border-red-400 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg z-40 max-w-xs sm:max-w-sm'>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0'/>
                        <span className='font-medium text-sm sm:text-base'>Multiple Faces Detected!</span>
                    </div>
                    <p className='text-xs sm:text-sm mt-1'>Only one person should be visible during the interview.</p>
                </div>
            )}

            {/* Tab Switch Warning */}
            {showTabSwitchWarning && (
                <div className='fixed top-0 left-0 right-0 bg-orange-500 text-white px-3 sm:px-4 py-2 sm:py-3 z-50 shadow-lg'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-7xl mx-auto gap-2 sm:gap-3'>
                        <div className='flex items-start sm:items-center gap-2 sm:gap-3 flex-1'>
                            <AlertTriangle className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0'/>
                            <div className='min-w-0'>
                                <span className='font-semibold text-sm sm:text-base block'>Tab Switch Detected!</span>
                                <span className='text-xs sm:text-sm block sm:inline sm:ml-2'>Please stay on this interview tab. Switching tabs is not allowed during the interview.</span>
                            </div>
                        </div>
                        <Button 
                            size="sm" 
                            onClick={() => setShowTabSwitchWarning(false)}
                            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 flex-shrink-0'
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