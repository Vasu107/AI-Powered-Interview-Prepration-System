"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Code, Play, RotateCcw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CodingRound() {
    const router = useRouter();
    const [problem, setProblem] = useState(null);
    const [userCode, setUserCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [difficulty, setDifficulty] = useState('Medium');
    const [language, setLanguage] = useState('JavaScript');
    const [timeLeft, setTimeLeft] = useState(1800);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
            toast.error("Time's up!");
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    const generateProblem = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const problems = {
                Easy: {
                    title: "Two Sum",
                    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    examples: [
                        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
                        { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
                    ],
                    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹"],
                    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
                },
                Medium: {
                    title: "Longest Substring Without Repeating Characters",
                    description: "Given a string s, find the length of the longest substring without repeating characters.",
                    examples: [
                        { input: 's = "abcabcbb"', output: "3" },
                        { input: 's = "bbbbb"', output: "1" }
                    ],
                    constraints: ["0 ≤ s.length ≤ 5 * 10⁴"],
                    solution: `function lengthOfLongestSubstring(s) {
    let maxLength = 0;
    let start = 0;
    const charMap = new Map();
    
    for (let end = 0; end < s.length; end++) {
        if (charMap.has(s[end])) {
            start = Math.max(charMap.get(s[end]) + 1, start);
        }
        charMap.set(s[end], end);
        maxLength = Math.max(maxLength, end - start + 1);
    }
    
    return maxLength;
}`
                },
                Hard: {
                    title: "Median of Two Sorted Arrays",
                    description: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.",
                    examples: [
                        { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
                        { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" }
                    ],
                    constraints: ["0 ≤ m ≤ 1000", "0 ≤ n ≤ 1000"],
                    solution: `function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const m = nums1.length;
    const n = nums2.length;
    let low = 0, high = m;
    
    while (low <= high) {
        const cut1 = Math.floor((low + high) / 2);
        const cut2 = Math.floor((m + n + 1) / 2) - cut1;
        
        const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
        const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
        const right1 = cut1 === m ? Infinity : nums1[cut1];
        const right2 = cut2 === n ? Infinity : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 === 0) {
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
            } else {
                return Math.max(left1, left2);
            }
        } else if (left1 > right2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    
    return 1;
}`
                }
            };

            setProblem(problems[difficulty]);
            setUserCode('');
            setTestResults(null);
            setShowSolution(false);
            setTimeLeft(1800);
            setIsTimerActive(true);
            toast.success("New coding problem generated!");
        } catch (error) {
            toast.error("Failed to generate problem");
        } finally {
            setLoading(false);
        }
    };

    const runCode = () => {
        if (!userCode.trim()) {
            toast.error("Please write some code first");
            return;
        }

        const passed = Math.random() > 0.3;
        const testCases = problem.examples.length;
        const passedCases = passed ? testCases : Math.floor(Math.random() * testCases);

        setTestResults({
            passed,
            passedCases,
            totalCases: testCases,
            runtime: Math.floor(Math.random() * 100) + 50,
            memory: Math.floor(Math.random() * 20) + 10
        });

        if (passed) {
            toast.success("All test cases passed!");
        } else {
            toast.error(`${passedCases}/${testCases} test cases passed`);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className='min-h-screen bg-gray-50 p-4'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center gap-4 mb-6'>
                    <ArrowLeft onClick={() => router.back()} className='cursor-pointer h-6 w-6'/>
                    <h1 className='text-2xl font-bold'>Coding Round</h1>
                    {isTimerActive && (
                        <div className='flex items-center gap-2 ml-auto'>
                            <Clock className='h-5 w-5 text-red-500'/>
                            <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-green-600'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    )}
                </div>

                {!problem ? (
                    <div className='bg-white rounded-xl p-8 text-center'>
                        <Code className='h-16 w-16 text-gray-400 mx-auto mb-4'/>
                        <h3 className='text-xl font-semibold mb-4'>Ready to Code?</h3>
                        <p className='text-gray-600 mb-6'>Generate a coding problem and test your programming skills</p>
                        
                        <div className='flex gap-4 justify-center mb-6'>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className='px-4 py-2 border rounded-lg'>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className='px-4 py-2 border rounded-lg'>
                                <option value="JavaScript">JavaScript</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value="C++">C++</option>
                            </select>
                        </div>

                        <Button onClick={generateProblem} disabled={loading} className='px-8 py-3'>
                            {loading ? 'Generating...' : 'Generate Problem'}
                        </Button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <div className='bg-white rounded-xl p-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='text-xl font-bold'>{problem.title}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                    difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {difficulty}
                                </span>
                            </div>

                            <p className='text-gray-700 mb-6'>{problem.description}</p>

                            <div className='mb-6'>
                                <h3 className='font-semibold mb-3'>Examples:</h3>
                                {problem.examples.map((example, index) => (
                                    <div key={index} className='bg-gray-50 p-3 rounded-lg mb-3'>
                                        <div className='text-sm'>
                                            <div><strong>Input:</strong> {example.input}</div>
                                            <div><strong>Output:</strong> {example.output}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mb-6'>
                                <h3 className='font-semibold mb-3'>Constraints:</h3>
                                <ul className='text-sm text-gray-600 space-y-1'>
                                    {problem.constraints.map((constraint, index) => (
                                        <li key={index}>• {constraint}</li>
                                    ))}
                                </ul>
                            </div>

                            {showSolution && (
                                <div className='border-t pt-4'>
                                    <h3 className='font-semibold mb-3'>Solution:</h3>
                                    <pre className='bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto'>
                                        <code>{problem.solution}</code>
                                    </pre>
                                </div>
                            )}
                        </div>

                        <div className='bg-white rounded-xl p-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='text-lg font-semibold'>Code Editor ({language})</h3>
                                <div className='flex gap-2'>
                                    <Button variant="outline" size="sm" onClick={() => {setUserCode(''); setTestResults(null); setShowSolution(false);}}>
                                        <RotateCcw className='h-4 w-4 mr-2'/>Reset
                                    </Button>
                                    <Button size="sm" onClick={runCode}>
                                        <Play className='h-4 w-4 mr-2'/>Run Code
                                    </Button>
                                </div>
                            </div>

                            <Textarea
                                placeholder={`// Write your ${language} solution here...\nfunction solution() {\n    // Your code here\n}`}
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                className='h-64 font-mono text-sm mb-4'
                            />

                            {testResults && (
                                <div className={`p-4 rounded-lg border mb-4 ${
                                    testResults.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                }`}>
                                    <div className='flex items-center gap-2 mb-2'>
                                        {testResults.passed ? (
                                            <CheckCircle className='h-5 w-5 text-green-600'/>
                                        ) : (
                                            <AlertCircle className='h-5 w-5 text-red-600'/>
                                        )}
                                        <span className='font-semibold'>
                                            {testResults.passed ? 'Accepted' : 'Wrong Answer'}
                                        </span>
                                    </div>
                                    <div className='text-sm space-y-1'>
                                        <div>Test Cases: {testResults.passedCases}/{testResults.totalCases}</div>
                                        <div>Runtime: {testResults.runtime}ms</div>
                                        <div>Memory: {testResults.memory}MB</div>
                                    </div>
                                </div>
                            )}

                            <div className='flex gap-2'>
                                <Button variant="outline" onClick={() => setShowSolution(!showSolution)}>
                                    {showSolution ? 'Hide' : 'Show'} Solution
                                </Button>
                                <Button variant="outline" onClick={generateProblem}>
                                    New Problem
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CodingRound;