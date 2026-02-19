"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Download, Trash2, Search, Calendar, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

function InterviewsPage() {
    const [interviews, setInterviews] = useState([]);
    const [filteredInterviews, setFilteredInterviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        avgScore: 0,
        totalQuestions: 0
    });

    useEffect(() => {
        fetchInterviews();
    }, []);

    useEffect(() => {
        filterInterviews();
    }, [searchTerm, interviews]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            
            const allInterviews = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.includes('interview') || key?.includes('Interview')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data && (data.answers || data.questions)) {
                            allInterviews.push({
                                id: key,
                                ...data,
                                completedAt: new Date(data.completedAt || data.createdAt || Date.now()),
                                status: data.answers ? 'Completed' : 'Created'
                            });
                        }
                    } catch (e) {}
                }
            }

            allInterviews.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
            
            setInterviews(allInterviews);
            
            const completed = allInterviews.filter(i => i.status === 'Completed');
            const totalQuestions = completed.reduce((sum, i) => sum + (i.answers?.length || 0), 0);
            const avgScore = completed.length > 0 
                ? Math.round(completed.reduce((sum, i) => sum + (i.finalScore || 0), 0) / completed.length)
                : 0;
            
            setStats({
                total: allInterviews.length,
                completed: completed.length,
                avgScore,
                totalQuestions
            });
            
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Failed to fetch interviews');
        } finally {
            setLoading(false);
        }
    };

    const filterInterviews = () => {
        if (!searchTerm) {
            setFilteredInterviews(interviews);
            return;
        }
        
        const filtered = interviews.filter(interview => 
            interview.jobPosition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.language?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.jobExperience?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setFilteredInterviews(filtered);
    };

    const downloadInterview = (interview) => {
        const data = JSON.stringify(interview, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview_${interview.jobPosition}_${new Date(interview.completedAt).toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const deleteInterview = (interviewId) => {
        if (confirm('Are you sure you want to delete this interview? This cannot be undone.')) {
            localStorage.removeItem(interviewId);
            fetchInterviews();
            toast.success('Interview deleted successfully');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading interviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Interviews</h1>
                    <p className="text-gray-600 mt-2">View and manage all conducted interviews</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.avgScore}%</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by job position, language, or experience..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button onClick={fetchInterviews} variant="outline">
                                Refresh
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Interviews ({filteredInterviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredInterviews.length === 0 ? (
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
                                            <th className="border border-gray-300 px-4 py-2 text-left">Experience</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Questions</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInterviews.map((interview) => (
                                            <tr key={interview.id}>
                                                <td className="border border-gray-300 px-4 py-2 font-medium">
                                                    {interview.jobPosition || 'N/A'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {interview.language || 'N/A'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {interview.jobExperience || 'N/A'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {interview.Duration || 'N/A'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {interview.answers?.length || interview.questionCount || 'N/A'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {interview.finalScore ? (
                                                        <Badge variant={interview.finalScore >= 70 ? "default" : "secondary"}>
                                                            {interview.finalScore}%
                                                        </Badge>
                                                    ) : 'N/A'}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <Badge variant={interview.status === 'Completed' ? "default" : "outline"}>
                                                        {interview.status}
                                                    </Badge>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {interview.completedAt.toLocaleDateString()}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => downloadInterview(interview)}
                                                            title="Download"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="destructive"
                                                            onClick={() => deleteInterview(interview.id)}
                                                            title="Delete"
                                                        >
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
            </div>
        </div>
    );
}

export default InterviewsPage;