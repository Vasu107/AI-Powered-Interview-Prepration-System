'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

const AIAvatar = ({ currentQuestion, onSpeechComplete, isListening = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [avatarState, setAvatarState] = useState('idle'); // idle, speaking, listening
  const speechRef = useRef(null);

  useEffect(() => {
    if (currentQuestion && !isMuted) {
      speakQuestion(currentQuestion);
    }
  }, [currentQuestion, isMuted]);

  useEffect(() => {
    setAvatarState(isListening ? 'listening' : isSpeaking ? 'speaking' : 'idle');
  }, [isListening, isSpeaking]);

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to use a professional voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.includes('Google') ||
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeechComplete?.();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMute = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const getAvatarAnimation = () => {
    switch (avatarState) {
      case 'speaking':
        return 'animate-pulse';
      case 'listening':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  const getAvatarColor = () => {
    switch (avatarState) {
      case 'speaking':
        return 'bg-blue-500';
      case 'listening':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* AI Avatar */}
      <div className="relative mb-6">
        <div className={`w-40 h-40 rounded-full ${getAvatarColor()} ${getAvatarAnimation()} flex items-center justify-center shadow-lg transition-all duration-300 p-4`}>
          <div className="w-50 h-50 bg-white rounded-full flex items-center justify-center shadow-inner">
            <div className="text-6xl"><Image
              src="/Avatar.png"
              alt="Avatar"
              width={200}
              height={100}
              className="w-[150px]"
            />
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
          {avatarState === 'speaking' && <Volume2 className="w-4 h-4 text-blue-500" />}
          {avatarState === 'listening' && <Mic className="w-4 h-4 text-green-500" />}
          {avatarState === 'idle' && <div className="w-3 h-3 rounded-full bg-gray-400"></div>}
        </div>
      </div>

      {/* AI Info */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Interviewer</h3>
        <p className="text-sm text-gray-600 mb-4">
          {avatarState === 'speaking' && 'Speaking question...'}
          {avatarState === 'listening' && 'Listening to your answer...'}
          {avatarState === 'idle' && 'Ready for interview'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition-colors ${isMuted
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          title={isMuted ? 'Unmute AI' : 'Mute AI'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Current Question Display */}
      {currentQuestion && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm max-w-md">
          <p className="text-sm text-gray-700 text-center">
            "{currentQuestion}"
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAvatar;