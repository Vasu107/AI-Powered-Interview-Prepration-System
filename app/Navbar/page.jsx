"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { programmingLanguages } from "@/services/Constants";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showMobileInterviewDropdown, setShowMobileInterviewDropdown] = useState(false);
  const [showMobileServicesDropdown, setShowMobileServicesDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  const services = [
    { name: 'Virtual Interview', path: '/dashboard/create-interview' },
    { name: 'Resume Analyser', path: '/dashboard/resume-analyzer' }
    // { name: 'Coding Round', path: '/dashboard/coding-round' },
    // { name: 'HR Interview', path: '/dashboard/hr-interview' },
    // { name: 'Aptitude Test', path: '/dashboard/aptitude-test' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowInterviewDropdown(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setShowServicesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleServiceClick = (service) => {
    if (session) {
      router.push(service.path);
    } else {
      router.push('/auth');
    }
    setShowServicesDropdown(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleMobileLanguageSelect = (language) => {
    handleLanguageSelect(language);
    setShowMobileInterviewDropdown(false);
    setIsOpen(false);
  };

  const handleMobileServiceClick = (service) => {
    handleServiceClick(service);
    setShowMobileServicesDropdown(false);
    setIsOpen(false);
  };

  const handleLanguageSelect = (language) => {
    if (session) {
      router.push(`/dashboard/create-interview?language=${encodeURIComponent(language)}`);
    } else {
      localStorage.setItem('selectedLanguage', language);
      router.push('/auth');
    }
    setShowInterviewDropdown(false);
  };

  return (
    <nav className="w-full bg-gray-200 shadow-md px-4 sm:px-6 py-3">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="AskUp Logo"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className="text-xl sm:text-2xl font-bold text-blue-600">AskUp</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 lg:gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-600 text-sm lg:text-base">
            Home
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowInterviewDropdown(!showInterviewDropdown)}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 text-sm lg:text-base transition-colors"
            >
              Interview
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showInterviewDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showInterviewDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[200px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {programmingLanguages.map((language, index) => (
                    <button
                      key={language}
                      onClick={() => handleLanguageSelect(language)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200"></span>
                      <span className="font-medium">{language}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={servicesDropdownRef}>
            <button
              onClick={() => setShowServicesDropdown(!showServicesDropdown)}
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600 text-sm lg:text-base transition-colors"
            >
              Services
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showServicesDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showServicesDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[220px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  {services.map((service, index) => (
                    <button
                      key={service.name}
                      onClick={() => handleServiceClick(service)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">{service.icon}</span>
                      <span className="font-medium">{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={scrollToContact}
            className="text-gray-700 hover:text-blue-600 text-sm lg:text-base transition-colors"
          >
            Contact
          </button>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 text-sm lg:text-base">
                Dashboard
              </Link>
              {['admin@askup.com', 'vasux@admin.com'].includes(session.user?.email) && (
                <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600 text-sm lg:text-base">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 lg:px-4 lg:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm lg:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm lg:text-base"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-gray-300 bg-white shadow-lg">
          <div className="flex flex-col px-4 py-4 space-y-1">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {/* Mobile Interview Dropdown */}
            <div className="py-1">
              <button
                onClick={() => setShowMobileInterviewDropdown(!showMobileInterviewDropdown)}
                className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg transition-all duration-200"
              >
                <span>Interview</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                  showMobileInterviewDropdown ? 'rotate-180' : ''
                }`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                showMobileInterviewDropdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="ml-4 mt-2 space-y-1">
                  {programmingLanguages.map((language) => (
                    <button
                      key={language}
                      onClick={() => handleMobileLanguageSelect(language)}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm"
                    >
                      <span className="text-base"></span>
                      <span>{language}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Services Dropdown */}
            <div className="py-1">
              <button
                onClick={() => setShowMobileServicesDropdown(!showMobileServicesDropdown)}
                className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg transition-all duration-200"
              >
                <span>Services</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                  showMobileServicesDropdown ? 'rotate-180' : ''
                }`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                showMobileServicesDropdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="ml-4 mt-2 space-y-1">
                  {services.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => handleMobileServiceClick(service)}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm"
                    >
                      <span className="text-base">{service.icon}</span>
                      <span>{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={scrollToContact}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg transition-all duration-200 text-left w-full"
            >
              Contact
            </button>
            
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {['admin@askup.com', 'vasux@admin.com'].includes(session.user?.email) && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {signOut(); setIsOpen(false);}}
                  className="mx-3 mt-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-center font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="mx-3 mt-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center font-medium block"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
