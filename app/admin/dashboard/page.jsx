"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Calendar, Database } from 'lucide-react';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInterviews: 0,
        completedInterviews: 0,
        pendingInterviews: 0
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Fetch users
            const { data: usersData } = await supabase.auth.admin.listUsers();
            setUsers(usersData?.users || []);
            
            // Fetch interviews (assuming you have an interviews table)
            const { data: interviewsData } = await supabase
                .from('interviews')
                .select('*')
                .order('created_at', { ascending: false });
            setInterviews(interviewsData || []);
            
            // Fetch results (assuming you have a results table)
            const { data: resultsData } = await supabase
                .from('interview_results')
                .select('*')
                .order('created_at', { ascending: false });
            setResults(resultsData || []);
            
            // Calculate stats
            setStats({
                totalUsers: usersData?.users?.length || 0,
                totalInterviews: interviewsData?.length || 0,
                completedInterviews: resultsData?.length || 0,
                pendingInterviews: (interviewsData?.length || 0) - (resultsData?.length || 0)
            });
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
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

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        </CardContent>
                    </Card>
                    
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
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.pendingInterviews}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Tables */}
                <Tabs defaultValue="users" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="interviews">Interviews</TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                                                            {user.email_confirmed_at ? "Verified" : "Pending"}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="interviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Interviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Language</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Questions</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {interviews.map((interview) => (
                                                <tr key={interview.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{interview.id}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{interview.language}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{interview.duration}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{interview.question_count}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {new Date(interview.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="results">
                        <Card>
                            <CardHeader>
                                <CardTitle>Interview Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Completed</th>
                                                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result) => (
                                                <tr key={result.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{result.user_email}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <Badge variant="outline">{result.score}%</Badge>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {new Date(result.completed_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">{result.total_time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-8 flex justify-end">
                    <Button onClick={fetchAllData}>
                        Refresh Data
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;