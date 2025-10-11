"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2 } from "lucide-react";

export default function ContentManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState({
    heroTitle: "AI-Powered Interview Preparation System",
    heroDescription: "Prepare smarter, not harder! Get personalized feedback with AI-driven mock interviews, resume analysis, and real-time performance evaluation.",
    teamMembers: [
      { name: "Vasudev Yadav", designation: "BackEnd Developer", image: "vasudev.jpeg" },
      { name: "Shweta Kannojiya", designation: "Machine Learning", image: "shweta.jpeg" },
      { name: "Anmol Chirag", designation: "UI/UX Designer", image: "Anmol.jpeg" },
      { name: "Shrinkhala", designation: "Research Analyst", image: "Shrinkhala.jpeg" }
    ]
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
    }
  }, [session, status, router]);

  const saveContent = async () => {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (response.ok) {
        alert('Content updated successfully!');
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const addTeamMember = () => {
    setContent({
      ...content,
      teamMembers: [...content.teamMembers, { name: '', designation: '', image: '' }]
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updated = [...content.teamMembers];
    updated[index][field] = value;
    setContent({ ...content, teamMembers: updated });
  };

  const removeTeamMember = (index) => {
    const updated = content.teamMembers.filter((_, i) => i !== index);
    setContent({ ...content, teamMembers: updated });
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Content Management
          </h1>
          <p className="text-gray-600 mt-2">Update homepage content and team information</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={content.heroDescription}
                  onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <button
                onClick={addTeamMember}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>
            <div className="space-y-4">
              {content.teamMembers.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Designation"
                      value={member.designation}
                      onChange={(e) => updateTeamMember(index, 'designation', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Image filename"
                        value={member.image}
                        onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeTeamMember(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveContent}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:opacity-90 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}