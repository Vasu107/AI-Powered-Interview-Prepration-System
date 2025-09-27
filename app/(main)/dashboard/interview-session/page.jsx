"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Mic, MicOff, Camera, CameraOff, AlertTriangle, RotateCcw, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
            setIsTimerActive(true);
            toast.info(`Interview started! You have ${data.Duration} total time for ${data.questionCount} questions.`);
        } else {
            router.push('/dashboard/create-interview');
        }
        
        // Tab switch detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setShowTabSwitchWarning(true);
                setTimeout(() => setShowTabSwitchWarning(false), 10000);
            }
        };
        
        // Cleanup function to turn off camera
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
                
                // detectMultiplePersons(canvas, ctx); // Disabled multiple person detection
                analyzeFacialExpression(canvas, ctx);
                
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

    const detectMultiplePersons = (canvas, ctx) => {
        // Simple detection based on movement and face-like regions
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let faceRegions = 0;
        const blockSize = 20;
        
        // Check for face-like regions in blocks
        for (let y = 0; y < canvas.height; y += blockSize) {
            for (let x = 0; x < canvas.width; x += blockSize) {
                let skinPixels = 0;
                let totalPixels = 0;
                
                for (let dy = 0; dy < blockSize && y + dy < canvas.height; dy++) {
                    for (let dx = 0; dx < blockSize && x + dx < canvas.width; dx++) {
                        const i = ((y + dy) * canvas.width + (x + dx)) * 4;
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        
                        if (r > 95 && g > 40 && b > 20 && r > g && r > b) {
                            skinPixels++;
                        }
                        totalPixels++;
                    }
                }
                
                if (skinPixels / totalPixels > 0.3) {
                    faceRegions++;
                }
            }
        }
        
        const currentTime = Date.now();
        
        // Only show warning if significantly more face regions detected (indicating multiple people)
        if (faceRegions > 12 && !showMultiplePersonWarning && (currentTime - lastWarningTime) > 60000) {
            setShowMultiplePersonWarning(true);
            setLastWarningTime(currentTime);
        }
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

    const analyzeFacialExpression = (canvas, ctx) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Detect face bounding box using simple face detection
        const faceBox = detectFace(imageData, canvas.width, canvas.height);
        if (!faceBox) return;
        
        // Extract facial landmarks (simplified 68-point model)
        const landmarks = extractFacialLandmarks(imageData, faceBox, canvas.width, canvas.height);
        if (!landmarks) return;
        
        // Calculate facial expression metrics using mathematical formulas
        const metrics = calculateFacialMetrics(landmarks, faceBox);
        setFacialMetrics(metrics);
        
        // Classify emotion based on extracted features
        const emotion = classifyEmotion(metrics);
        setCurrentEmotion(emotion);
        
        // Store emotion history every 3 seconds
        const now = Date.now();
        setEmotionHistory(prev => {
            const lastEntry = prev[prev.length - 1];
            if (!lastEntry || now - lastEntry.timestamp > 3000) {
                return [...prev.slice(-30), { 
                    emotion, 
                    metrics, 
                    timestamp: now 
                }]; // Keep last 30 entries
            }
            return prev;
        });
    };
    
    const detectFace = (imageData, width, height) => {
        // Simplified face detection using skin color and edge detection
        const data = imageData.data;
        let minX = width, minY = height, maxX = 0, maxY = 0;
        let facePixels = 0;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i], g = data[i + 1], b = data[i + 2];
                
                // Skin color detection
                if (r > 95 && g > 40 && b > 20 && 
                    Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                    Math.abs(r - g) > 15 && r > g && r > b) {
                    facePixels++;
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }
        
        if (facePixels < 1000) return null; // Not enough face pixels
        
        return {
            x: minX,
            y: minY,
            w: maxX - minX,
            h: maxY - minY
        };
    };
    
    const extractFacialLandmarks = (imageData, faceBox, width, height) => {
        // Simplified landmark extraction based on face regions
        const { x, y, w, h } = faceBox;
        
        // Approximate landmark positions (simplified 68-point model)
        const landmarks = {
            // Mouth landmarks (P48-P67)
            P48: { x: x + w * 0.3, y: y + h * 0.7 }, // Left mouth corner
            P54: { x: x + w * 0.7, y: y + h * 0.7 }, // Right mouth corner
            P62: { x: x + w * 0.4, y: y + h * 0.75 }, // Bottom lip
            P66: { x: x + w * 0.6, y: y + h * 0.65 }, // Top lip
            
            // Eyebrow landmarks (P17-P26)
            P19: { x: x + w * 0.25, y: y + h * 0.3 }, // Left eyebrow
            P24: { x: x + w * 0.75, y: y + h * 0.3 }, // Right eyebrow
            
            // Eye landmarks
            P36: { x: x + w * 0.3, y: y + h * 0.4 }, // Left eye
            P45: { x: x + w * 0.7, y: y + h * 0.4 }, // Right eye
        };
        
        return landmarks;
    };
    
    const calculateFacialMetrics = (landmarks, faceBox) => {
        // Calculate distances between landmarks
        const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        
        // Mouth openness: Mouth_Open = ||P54-P48|| / ||P66-P62||
        const mouthWidth = distance(landmarks.P54, landmarks.P48);
        const mouthHeight = distance(landmarks.P66, landmarks.P62);
        const mouthOpen = mouthHeight > 0 ? mouthWidth / mouthHeight : 0;
        
        // Eyebrow raise: Eyebrow_Raise = ||P24-P19||
        const eyebrowRaise = distance(landmarks.P24, landmarks.P19) / faceBox.w;
        
        // Smile intensity: Smile_Factor = ||P54-P48|| / Face_Width
        const smileFactor = mouthWidth / faceBox.w;
        
        // Confidence score based on facial symmetry and expression stability
        const confidence = Math.min(1, (smileFactor + eyebrowRaise) * 0.5);
        
        return {
            mouthOpen: Math.round(mouthOpen * 100) / 100,
            eyebrowRaise: Math.round(eyebrowRaise * 100) / 100,
            smileFactor: Math.round(smileFactor * 100) / 100,
            confidence: Math.round(confidence * 100) / 100
        };
    };
    
    const classifyEmotion = (metrics) => {
        const { mouthOpen, eyebrowRaise, smileFactor } = metrics;
        
        // Emotion classification using mathematical thresholds
        if (smileFactor > 0.15 && mouthOpen > 1.2) {
            return 'Happy';
        } else if (smileFactor < 0.08 && eyebrowRaise < 0.1) {
            return 'Sad';
        } else if (eyebrowRaise > 0.2 && mouthOpen < 0.8) {
            return 'Angry';
        } else if (mouthOpen > 2.0) {
            return 'Surprised';
        } else {
            return 'Neutral';
        }
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
            setIsTimerActive(true); // Restart timer for next question
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
        setTimeout(() => moveToNextQuestion(), 100); // Small delay to ensure timer stops
    };

    const completeInterview = () => {
        // Stop camera and motion detection
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
            answers: answers,
            emotionHistory: emotionHistory,
            finalEmotion: currentEmotion,
            facialMetrics: facialMetrics,
            completedAt: new Date().toISOString(),
            totalQuestions: interviewData.questions.length,
            answeredQuestions: answers.length
        };
        
        localStorage.setItem('interviewResults', JSON.stringify(finalResults));
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
        <div className='min-h-screen bg-gray-50 p-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-center gap-4 mb-6'>
                    <ArrowLeft 
                        onClick={() => router.back()} 
                        className='cursor-pointer h-6 w-6'
                    />
                    <h1 className='text-2xl font-bold'>Interview Session</h1>
                </div>

                {/* Job Description Section */}
                {interviewData.jobDescription && (
                    <div className='bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6'>
                        <div className='flex items-center gap-2 mb-3'>
                            <FileText className='h-5 w-5 text-blue-600' />
                            <h3 className='text-lg font-semibold text-blue-800'>Job Description</h3>
                            <span className='text-sm text-blue-600'>({interviewData.jobPosition})</span>
                        </div>
                        <div className='text-sm text-blue-700 bg-white p-3 rounded-lg max-h-32 overflow-y-auto'>
                            {interviewData.jobDescription.split('\n').map((line, index) => (
                                <p key={index} className='mb-1'>{line}</p>
                            ))}
                        </div>
                    </div>
                )}

                <div className='bg-white rounded-xl p-6 mb-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <div>
                            <h2 className='text-lg font-semibold'>
                                Question {currentQuestionIndex + 1} of {interviewData.questions.length}
                            </h2>
                            <p className='text-sm text-gray-600'>{interviewData.language} Interview</p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <Clock className='h-4 w-4 text-gray-500'/>
                                <span className='text-sm text-gray-600'>Time Left:</span>
                                <span className={`font-mono text-lg ${questionTimeLeft < 30 ? 'text-red-500' : 'text-gray-700'}`}>
                                    {Math.floor(questionTimeLeft / 60)}:{(questionTimeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleCamera}
                                disabled={cameraLoading}
                                className={isCameraOn ? 'bg-green-100' : ''}
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
                                className={isRecording ? 'bg-red-100' : ''}
                            >
                                {isRecording ? <Mic className='h-4 w-4'/> : <MicOff className='h-4 w-4'/>}
                            </Button>
                        </div>
                    </div>
                    
                    <Progress value={progress} className='mb-6'/>
                    
                    <div className='mb-6'>
                        <h3 className='text-xl font-medium mb-4'>{currentQuestion.question}</h3>
                        
                        {isCameraOn && (
                            <div className='mb-4 relative'>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className='w-48 h-36 bg-gray-200 rounded-lg object-cover'
                                />
                                <canvas
                                    ref={canvasRef}
                                    className='hidden'
                                />
                                <div className='absolute top-2 right-2 bg-red-500 w-3 h-3 rounded-full animate-pulse'></div>
                                
                                {/* Emotion Display */}
                                <div className='absolute bottom-2 left-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs'>
                                    <div className='flex items-center gap-1 mb-1'>
                                        <div className={`w-2 h-2 rounded-full ${
                                            currentEmotion === 'Happy' ? 'bg-green-400' :
                                            currentEmotion === 'Sad' ? 'bg-blue-400' :
                                            currentEmotion === 'Angry' ? 'bg-red-400' :
                                            currentEmotion === 'Surprised' ? 'bg-yellow-400' :
                                            'bg-gray-400'
                                        }`}></div>
                                        <span className='font-medium'>{currentEmotion}</span>
                                    </div>
                                    <div className='text-xs opacity-80'>
                                        <div>Smile: {facialMetrics.smileFactor}</div>
                                        <div>Confidence: {Math.round(facialMetrics.confidence * 100)}%</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <Textarea
                            placeholder="Type your answer here or use voice recording..."
                            value={currentAnswer}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className='min-h-[200px] text-base'
                            disabled={questionTimeLeft === 0}
                        />
                        
                        <p className='text-sm text-blue-600 mt-2'>
                            ⏰ You have exactly 2 minutes to answer this question.
                        </p>
                    </div>
                    
                    <div className='flex justify-between'>
                        <div className='text-sm text-gray-500'>
                            Progress: {currentQuestionIndex + 1}/{interviewData.questions.length}
                        </div>
                        <Button 
                            onClick={handleNextQuestion}
                            disabled={questionTimeLeft === 0}
                        >
                            {currentQuestionIndex === interviewData.questions.length - 1 ? 'Complete Interview' : 'Next Question'}
                        </Button>
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
                    <div className='fixed top-16 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-40'>
                        <div className='flex items-center gap-2'>
                            <AlertTriangle className='h-5 w-5'/>
                            <span className='font-medium'>Movement Detected!</span>
                        </div>
                        <p className='text-sm mt-1'>Please remain still during the interview.</p>
                    </div>
                )}



                {/* Tab Switch Warning */}
                {showTabSwitchWarning && (
                    <div className='fixed top-0 left-0 right-0 bg-orange-500 text-white px-4 py-3 z-50 shadow-lg'>
                        <div className='flex items-center justify-between max-w-6xl mx-auto'>
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
        </div>
    );
}

export default InterviewSession;