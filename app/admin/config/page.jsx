"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, Settings } from "lucide-react";

export default function ConfigManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [config, setConfig] = useState({
    jobPositions: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist"],
    jobExperience: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
    questionCounts: [5, 10, 15, 20, 25],
    durations: ["15 minutes", "30 minutes", "45 minutes", "60 minutes"],
    interviewTypes: ["Technical", "Behavioral", "System Design", "Coding", "Mixed"]
  });

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
      fetchConfig();
    }
  }, [session, status, router]);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config || config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const addItem = (field, value) => {
    if (value.trim() && !config[field].includes(value.trim())) {
      setConfig({
        ...config,
        [field]: [...config[field], value.trim()]
      });
    }
  };

  const removeItem = (field, index) => {
    setConfig({
      ...config,
      [field]: config[field].filter((_, i) => i !== index)
    });
  };

  const saveConfig = async () => {
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      if (response.ok) {
        alert('Configuration updated successfully!');
      }
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const ConfigSection = ({ title, field, placeholder }) => {
    const [newItem, setNewItem] = useState("");

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          {title}
        </h2>
        
        <div className="flex gap-4 mb-4">
          <input
            type={field === 'questionCounts' ? 'number' : 'text'}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addItem(field, newItem) && setNewItem("")}
          />
          <button
            onClick={() => {
              addItem(field, newItem);
              setNewItem("");
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {config[field].map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <span className="text-sm font-medium">{item}</span>
              <button
                onClick={() => removeItem(field, index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interview Configuration
          </h1>
          <p className="text-gray-600 mt-2">Manage job positions, experience levels, and interview settings</p>
        </div>

        <ConfigSection 
          title="Job Positions" 
          field="jobPositions" 
          placeholder="Add job position" 
        />
        
        <ConfigSection 
          title="Experience Levels" 
          field="jobExperience" 
          placeholder="Add experience level" 
        />
        
        <ConfigSection 
          title="Question Counts" 
          field="questionCounts" 
          placeholder="Add question count" 
        />
        
        <ConfigSection 
          title="Interview Durations" 
          field="durations" 
          placeholder="Add duration" 
        />
        
        <ConfigSection 
          title="Interview Types" 
          field="interviewTypes" 
          placeholder="Add interview type" 
        />

        <div className="flex justify-end mb-6">
          <button
            onClick={saveConfig}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:opacity-90 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save All Changes
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Configuration Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-blue-600">
            <div>Positions: {config.jobPositions.length}</div>
            <div>Experience: {config.jobExperience.length}</div>
            <div>Questions: {config.questionCounts.length}</div>
            <div>Durations: {config.durations.length}</div>
            <div>Types: {config.interviewTypes.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}