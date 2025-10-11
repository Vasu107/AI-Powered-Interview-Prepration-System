"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Code } from "lucide-react";

export default function LanguageManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [languages, setLanguages] = useState([
    "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
    "PHP", "C#", "Go", "Ruby", "Swift", "Kotlin", "TypeScript"
  ]);
  const [newLanguage, setNewLanguage] = useState("");

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/dashboard');
      return;
    }
    
    const adminEmails = ['askupteam396@gmail.com'];
    const isAdmin = adminEmails.includes(session?.user?.email);
    
    if (!isAdmin) {
      router.push('/dashboard');
    } else {
      fetchLanguages();
    }
  }, [session, status, router]);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/admin/languages');
      if (response.ok) {
        const data = await response.json();
        setLanguages(data.languages || languages);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const saveLanguages = async () => {
    try {
      const response = await fetch('/api/admin/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languages })
      });
      if (response.ok) {
        alert('Languages updated successfully!');
      }
    } catch (error) {
      console.error('Error saving languages:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Programming Languages
          </h1>
          <p className="text-gray-600 mt-2">Manage available programming languages for interviews</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add new language"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
            />
            <button
              onClick={addLanguage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{language}</span>
                </div>
                <button
                  onClick={() => removeLanguage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveLanguages}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:opacity-90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Total Languages: {languages.length}</h3>
          <p className="text-blue-600 text-sm">These languages will be available for interview creation and filtering.</p>
        </div>
      </div>
    </div>
  );
}