"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

function AdminConfig() {
    const [config, setConfig] = useState({
        jobPositions: [],
        programmingLanguages: [],
        questionCounts: [],
        durations: [],
        interviewTypes: []
    });
    const [newItems, setNewItems] = useState({
        jobPositions: '',
        programmingLanguages: '',
        questionCounts: '',
        durations: '',
        interviewTypes: ''
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const response = await fetch('/api/admin/config');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setConfig(data.config);
            } else {
                throw new Error(data.error || 'Failed to load config');
            }
        } catch (error) {
            console.error('Failed to load config:', error);
            toast.error('Using default configuration');
            // Fallback to default config
            setConfig({
                jobPositions: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UI/UX Designer'],
                programmingLanguages: ['JavaScript', 'Python', 'Java', 'C++', 'React'],
                questionCounts: ['3', '5', '7', '10'],
                durations: ['5 Min', '15 Min', '30 Min', '45 Min', '60 Min'],
                interviewTypes: ['Technical', 'Behavioral', 'System Design', 'Coding']
            });
        }
    };

    const saveConfig = async (newConfig) => {
        try {
            const response = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig)
            });
            
            if (!response.ok) {
                if (response.status === 403) {
                    toast.error('Access denied - Admin privileges required');
                    return;
                }
                throw new Error(`HTTP ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setConfig(data.config);
                toast.success('Configuration saved successfully!');
            } else {
                toast.error(data.error || 'Failed to save configuration');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Error saving configuration');
        }
    };

    const addItem = (category) => {
        const newItem = newItems[category].trim();
        if (!newItem) {
            toast.error('Please enter a value');
            return;
        }
        
        if (config[category].includes(newItem)) {
            toast.error('Item already exists');
            return;
        }

        const newConfig = {
            ...config,
            [category]: [...config[category], newItem]
        };
        saveConfig(newConfig);
        setNewItems({ ...newItems, [category]: '' });
    };

    const removeItem = (category, item) => {
        const newConfig = {
            ...config,
            [category]: config[category].filter(i => i !== item)
        };
        saveConfig(newConfig);
    };

    const configSections = [
        { key: 'jobPositions', label: 'Job Positions', placeholder: 'e.g., Frontend Developer' },
        { key: 'programmingLanguages', label: 'Programming Languages', placeholder: 'e.g., TypeScript' },
        { key: 'questionCounts', label: 'Question Counts', placeholder: 'e.g., 15' },
        { key: 'durations', label: 'Durations', placeholder: 'e.g., 90 Min' },
        { key: 'interviewTypes', label: 'Interview Types', placeholder: 'e.g., Problem Solving' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Admin Configuration</h1>
                    </div>
                    <p className="text-gray-600">Manage form options and interview settings</p>
                </div>

                <Tabs defaultValue="jobPositions" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-5">
                        {configSections.map(section => (
                            <TabsTrigger key={section.key} value={section.key}>
                                {section.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {configSections.map(section => (
                        <TabsContent key={section.key} value={section.key}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Manage {section.label}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-3 mb-6">
                                        <Input
                                            placeholder={section.placeholder}
                                            value={newItems[section.key]}
                                            onChange={(e) => setNewItems({
                                                ...newItems,
                                                [section.key]: e.target.value
                                            })}
                                            onKeyPress={(e) => e.key === 'Enter' && addItem(section.key)}
                                        />
                                        <Button onClick={() => addItem(section.key)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {config[section.key].map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="text-sm font-medium">{item}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(section.key, item)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {config[section.key].length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No {section.label.toLowerCase()} configured yet
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Configuration Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {configSections.map(section => (
                                <div key={section.key} className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {config[section.key].length}
                                    </div>
                                    <div className="text-sm text-blue-800">
                                        {section.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminConfig;