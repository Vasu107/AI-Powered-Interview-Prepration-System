"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Calendar, Database, Settings, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function AdminDashboard() {
    const [interviews, setInterviews] = useState([]);
    const [results, setResults] = useState([]);
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalInterviews: 0,
        completedInterviews: 0,
        totalQuestions: 0,
        avgScore: 0
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Fetch from database
            const [interviewsRes, configRes] = await Promise.all([
                fetch('/api/admin/interviews'),
                fetch('/api/admin/config')
            ]);
            
            const interviewsData = await interviewsRes.json();
            const configData = await configRes.json();
            
            if (interviewsData.success) {
                setInterviews(interviewsData.interviews);
            }
            
            if (configData.success) {
                setConfig(configData.config);
            }
            
            // Get results from localStorage (fallback)
            const allResults = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('interviewResults')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        allResults.push({ id: key, ...data, completedAt: new Date(data.completedAt || Date.now()) });
                    } catch (e) {}
                }
            }
            
            setResults(allResults);
            
            // Calculate stats
            const totalQuestions = allResults.reduce((sum, result) => sum + (result.answers?.length || 0), 0);
            const avgScore = allResults.length > 0 
                ? Math.round(allResults.reduce((sum, result) => sum + (result.feedback?.score || 0), 0) / allResults.length)
                : 0;
            
            setStats({
                totalInterviews: interviewsData.interviews?.length || 0,
                completedInterviews: allResults.length,
                totalQuestions,
                avgScore
            });
            
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };
    
    const clearAllData = () => {
        if (confirm('Are you sure you want to clear all interview data? This cannot be undone.')) {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('interview_') || key?.startsWith('interviewResults') || key === 'currentInterview') {
                    keys.push(key);
                }
            }
            keys.forEach(key => localStorage.removeItem(key));
            fetchAllData();
            toast.success('All interview data cleared');
        }
    };
    
    const deleteItem = async (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`/api/admin/interviews?id=${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    fetchAllData();
                    toast.success('Item deleted');
                } else {
                    toast.error('Failed to delete item');
                }
            } catch (error) {
                toast.error('Error deleting item');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage all interview system data</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link href="/admin/config">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="flex items-center p-6">
                                <Settings className="h-8 w-8 text-blue-600 mr-4" />
                                <div>
                                    <h3 className="font-semibold">Configuration</h3>
                                    <p className="text-sm text-gray-600">Manage form options</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={fetchAllData}>
                        <CardContent className="flex items-center p-6">
                            <Database className="h-8 w-8 text-green-600 mr-4" />
                            <div>
                                <h3 className="font-semibold">Refresh Data</h3>
                                <p className="text-sm text-gray-600">Reload all data</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={clearAllData}>
                        <CardContent className="flex items-center p-6">
                            <Trash2 className="h-8 w-8 text-red-600 mr-4" />
                            <div>
                                <h3 className="font-semibold">Clear All Data</h3>
                                <p className="text-sm text-gray-600">Delete all interviews</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalInterviews}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.completedInterviews}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.avgScore}%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Tables */}
                <Tabs defaultValue="interviews" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="interviews">Interviews</TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="config">Configuration</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="interviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Interviews ({interviews.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {interviews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No interviews found
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Job Position</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Language</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Questions</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {interviews.map((interview) => (
                                                    <tr key={interview.id}>
                                                        <td className="border border-gray-300 px-4 py-2">{interview.jobPosition || 'N/A'}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{interview.language || 'N/A'}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{interview.Duration || 'N/A'}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{interview.questionCount || 'N/A'}</td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {interview.createdAt ? interview.createdAt.toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <div className="flex gap-2">
                                                                <Button size="sm" variant="outline" onClick={() => {
                                                                    const data = JSON.stringify(interview, null, 2);
                                                                    const blob = new Blob([data], { type: 'application/json' });
                                                                    const url = URL.createObjectURL(blob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = `interview_${interview.id}.json`;
                                                                    a.click();
                                                                }}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => deleteItem(interview.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="results">
                        <Card>
                            <CardHeader>
                                <CardTitle>Interview Results ({results.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {results.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No results found
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Language</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Questions</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Completed</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.map((result) => (
                                                    <tr key={result.id}>
                                                        <td className="border border-gray-300 px-4 py-2">{result.language || 'N/A'}</td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <Badge variant={result.feedback?.score >= 7 ? "default" : "secondary"}>
                                                                {result.feedback?.score || 'N/A'}/10
                                                            </Badge>
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">{result.answers?.length || 0}</td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {result.completedAt ? result.completedAt.toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <div className="flex gap-2">
                                                                <Button size="sm" variant="outline" onClick={() => {
                                                                    const data = JSON.stringify(result, null, 2);
                                                                    const blob = new Blob([data], { type: 'application/json' });
                                                                    const url = URL.createObjectURL(blob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = `result_${result.id}.json`;
                                                                    a.click();
                                                                }}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="destructive" onClick={() => deleteItem(result.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="config">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Configuration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(config).map(([key, values]) => (
                                        <div key={key} className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(values) ? values.map((value, index) => (
                                                    <Badge key={index} variant="outline">{value}</Badge>
                                                )) : <span className="text-gray-500">No data</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <Link href="/admin/config">
                                        <Button>
                                            <Settings className="h-4 w-4 mr-2" />
                                            Edit Configuration
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>


            </div>
        </div>
    );
}

export default AdminDashboard;