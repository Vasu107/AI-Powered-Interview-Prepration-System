"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { BookOpen, ClipboardList, FileBadge2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gray-50">
      {/* Hero Section */}
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI-Powered <span className="text-blue-600">Interview Preparation System</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Prepare smarter, not harder!
          Get personalized feedback with AI-driven mock interviews,
          resume analysis, and real-time performance evaluation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700">
              Start Practicing
            </button>
          </Link>
          <Link href="/about">
            <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-2xl shadow hover:bg-gray-300">
              Learn More
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <Features />

      {/* Program For You Section */}
      <ProgramForYou />

      {/* Team Section */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <AnimatedTooltipPreview />
      </div>

      {/* Footer Section */}
      <footer className="w-full mt-20 bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AskUp</h3>
              <p className="text-gray-300">AI-powered interview preparation platform helping candidates succeed.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Mock Interviews</li>
                <li>Resume Analysis</li>
                <li>Expression Analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: support@askup.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Tech Street</li>
                <li>Silicon Valley, CA 94000</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 AskUp Virtual Interview. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const people = [
  {
    id: 1,
    name: "Prof.(Dr.) Roop Ranjan",
    designation: "Assistance Professor",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Vasudev Yadav",
    designation: "BackEnd Developer",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Shweta Kannojiya",
    designation: "Machine Learning",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Anmol Chirag",
    designation: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Shrinkhala",
    designation: "Research Analyst",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
];

function Features() {
  return (
    <section className="w-full bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Features Include</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <BookOpen className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Virtual Interview</h3>
            <p className="text-gray-600">Study at your own pace with engaging video content</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <ClipboardList className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Resume Analyser</h3>
            <p className="text-gray-600">Test your readiness with end-of-course assessment</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <FileBadge2 className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Digital certification</h3>
            <p className="text-gray-600">Get participation certificate on completing the course</p>
          </div>
        </div>
      </div>

      <div className="bg-black text-white mt-16 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">What are Interview Skills?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-lg">
            <p className="border-l-4 border-blue-500 pl-4">
              Interview Skills are the abilities to communicate better with the interviewer
            </p>
            <p className="border-l-4 border-blue-500 pl-4">
              With apt skills you can showcase yourself as the best-fit candidate for the job role
            </p>
            <p className="border-l-4 border-blue-500 pl-4">
              These skills help an employer in determining if your credentials, experience, 
              and personality match their criteria
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const ProgramForYou = () => {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Is the programme for you?
        </h2>
        
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-80 h-80 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
              alt="Professional person" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Impress with Your Interview Skills Course is a smart way to achieve 
              the best results in your career. Learn essential interview techniques 
              and boost your confidence.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Professional interview preparation
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                AI-powered feedback system
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Real-time performance analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Industry-specific questions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}