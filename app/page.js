"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, ClipboardList, FileBadge2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/(main)/dashboard');
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
    <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-8 sm:py-12 bg-gray-50">
      {/* Hero Section */}
      <motion.div
        className="text-center max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
          AI-Powered <span className="text-blue-600">Interview Preparation System</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
          Prepare smarter, not harder!
          Get personalized feedback with AI-driven mock interviews,
          resume analysis, and real-time performance evaluation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link href="/auth">
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700">
              Start Practicing
            </button>
          </Link>
          <Link href="/about">
            <button className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-900 rounded-2xl shadow hover:bg-gray-300">
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
      <div className="mt-6 sm:mt-8 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Meet Our Team</h2>
        <TeamPreview />
      </div>

      {/* Guide Section */}
      <div className="mt-6 sm:mt-8 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Guide</h2>
        <GuidePreview />
      </div>

      {/* Footer Section */}
      <footer id="contact" className="w-full mt-12 sm:mt-20 bg-gray-800 text-white py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">AskUp</h3>
              <p className="text-sm sm:text-base text-gray-300">AI-powered interview preparation platform helping candidates succeed.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Features</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li><Link href="/auth" className="hover:text-white">Mock Interviews</Link></li>
                <li><Link href="/auth" className="hover:text-white">Resume Analysis</Link></li>
                <li><Link href="/auth" className="hover:text-white">Personalized Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Company</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Contact Us</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li>Email: askupteam396@gmail.com</li>
                <li>Phone: +91 8957273107</li>
                <li>Address: Buddha Institute Of Technology, GIDA, Gorakhpur</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 AskUp Virtual Interview. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
const guide = [
  {
    id: 1,
    name: "Prof.(Dr.) Roop Ranjan",
    designation: "Professor",
    image: "Roop.jpeg",
  }
];

const teamMembers = [
  {
    id: 2,
    name: "Vasudev Yadav",
    designation: "BackEnd Developer",
    image: "vasudev.jpeg",
  },
  {
    id: 3,
    name: "Shweta Kannojiya",
    designation: "Machine Learning",
    image: "shweta.jpeg",
  },
  {
    id: 4,
    name: "Anmol Chirag",
    designation: "UI/UX Designer",
    image: "Anmol.jpeg",
  },
  // {
  //   id: 5,
  //   name: "Shrinkhala",
  //   designation: "Research Analyst",
  //   image: "Shrinkhala.jpeg",
  // },
];

function Features() {
  return (
    <section className="w-full bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">Features Include</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <BookOpen className="mx-auto text-blue-600 w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">AI Virtual Interview</h3>
            <p className="text-sm sm:text-base text-gray-600"><span className="text-green-500 mr-3">✓</span>Study at your own pace with engaging video content</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <ClipboardList className="mx-auto text-blue-600 w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Resume Analyser</h3>
            <p className="text-sm sm:text-base text-gray-600"><span className="text-green-500 mr-3">✓</span>Test your readiness with end-of-course assessment</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition sm:col-span-2 lg:col-span-1">
            <FileBadge2 className="mx-auto text-blue-600 w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Feedback</h3>
            <p className="text-sm sm:text-base text-gray-600"><span className="text-green-500 mr-3">✓</span>Get participation Feedback on completing the course</p>
          </div>
        </div>
      </div>

      <div className="bg-black text-white mt-12 sm:mt-16 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">What are Interview Skills?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-base sm:text-lg">
            <p className="border-l-4 border-blue-500 pl-3 sm:pl-4">
              Interview Skills are the abilities to communicate better with the interviewer
            </p>
            <p className="border-l-4 border-blue-500 pl-3 sm:pl-4">
              With apt skills you can showcase yourself as the best-fit candidate for the job role
            </p>
            <p className="border-l-4 border-blue-500 pl-3 sm:pl-4">
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
    <section className="py-8 sm:py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900">
          Is the programme for you?
        </h2>
        
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
          <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="Programmer.png" 
              alt="Professional person" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed text-center lg:text-left">
              Impress with Your Interview Skills Course is a smart way to achieve 
              the best results in your career. Learn essential interview techniques 
              and boost your confidence.
            </p>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Professional interview preparation
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Personalized feedback and analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                Real-time performance evaluation
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                AI-powered question generation
              </li>
            </ul>
            
            <div className="mt-6 sm:mt-8 text-center lg:text-left">
              <Link href="/auth">
                <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Get Started Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function GuidePreview() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8">
      {guide.map((person) => (
        <div key={person.id} className="flex flex-col items-center group">
          <div className="relative">
            <img
              src={person.image}
              alt={person.name}
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-blue-200 shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ 
                imageRendering: 'high-quality',
                filter: 'none',
                objectFit: 'cover',
                objectPosition: 'center',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            />
          </div>
          <div className="mt-2 sm:mt-3 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{person.name}</h3>
            <p className="text-sm sm:text-base text-blue-600 font-medium">{person.designation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamPreview() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8">
      {teamMembers.map((person) => (
        <div key={person.id} className="flex flex-col items-center group">
          <div className="relative">
            <img
              src={person.image}
              alt={person.name}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ 
                imageRendering: 'high-quality',
                filter: 'none',
                objectFit: 'cover',
                objectPosition: 'center',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            />
          </div>
          <div className="mt-2 sm:mt-3 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">{person.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{person.designation}</p>
          </div>
        </div>
      ))}
    </div>
  );
}