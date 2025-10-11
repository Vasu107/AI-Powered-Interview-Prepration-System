import { LayoutDashboard, Calendar, List, WalletCards, Settings, Code, Users, Brain, Briefcase, Database, Shield, Palette, Smartphone, Globe, Target, Zap, BookOpen, MessageSquare, TrendingUp, Cpu } from "lucide-react";

export const SideBarOptions=[
    {
        name:'Dashboard',
        icon:LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'All Interviews',
        icon:List,
        path:'/dashboard/All-Interviews'
    },
    {
        name:'Resume Analyzer',
        icon:WalletCards,
        path:'/dashboard/resume-analyzer'
    },
]

export const interviewType = [
    {
        title: 'Technical Interview',
        icon: Code
    },
    {
        title: 'Behavioral Interview',
        icon: Users
    },
    {
        title: 'System Design',
        icon: Brain
    },
    {
        title: 'HR Interview',
        icon: Briefcase
    },
    {
        title: 'Database Interview',
        icon: Database
    },
    {
        title: 'Security Interview',
        icon: Shield
    },
    {
        title: 'UI/UX Design',
        icon: Palette
    },
    {
        title: 'Mobile Development',
        icon: Smartphone
    },
    {
        title: 'Web Development',
        icon: Globe
    },
    {
        title: 'Product Management',
        icon: Target
    },
    {
        title: 'DevOps Interview',
        icon: Zap
    },
    {
        title: 'Data Science',
        icon: TrendingUp
    },
    {
        title: 'Machine Learning',
        icon: Cpu
    },
    {
        title: 'Communication Skills',
        icon: MessageSquare
    },
    {
        title: 'Leadership Interview',
        icon: BookOpen
    }
]

// Load from admin config or use defaults
const getAdminConfig = () => {
    if (typeof window !== 'undefined') {
        const savedConfig = localStorage.getItem('adminConfig');
        if (savedConfig) {
            return JSON.parse(savedConfig);
        }
    }
    return null;
};

const adminConfig = getAdminConfig();

export const jobPositions = adminConfig?.jobPositions || [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'UI/UX Developer',
    'Machine Learning Developer',
    'Data Scientist',
    'Software Engineer',
    'Software Developer',
    'Web Developer',
    'Junior Developer',
    'Senior Developer'
]

export const programmingLanguages = adminConfig?.programmingLanguages || [
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'C#',
    'Ruby',
    'PHP',
    'Go',
    'Rust',
    'TypeScript'
]