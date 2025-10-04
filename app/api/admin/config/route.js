import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminConfig from '@/app/Models/AdminConfig';
import { getServerSession } from 'next-auth';

const ADMIN_EMAILS = ['admin@askup.com', 'vasux@admin.com'];

async function checkAdminAccess() {
  const session = await getServerSession();
  return session && ADMIN_EMAILS.includes(session.user?.email);
}

export async function GET() {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    
    let config = await AdminConfig.findOne();
    
    if (!config) {
      config = new AdminConfig({
        jobPositions: ['Software Engineer', 'Product Manager', 'Data Scientist', 'UI/UX Designer'],
        programmingLanguages: ['JavaScript', 'Python', 'Java', 'C++', 'React'],
        questionCounts: ['3', '5', '7', '10'],
        durations: ['5 Min', '15 Min', '30 Min', '45 Min', '60 Min'],
        interviewTypes: ['Technical', 'Behavioral', 'System Design', 'Coding']
      });
      await config.save();
    }
    
    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    const data = await request.json();
    
    let config = await AdminConfig.findOne();
    
    if (config) {
      Object.assign(config, data);
      config.updatedAt = new Date();
    } else {
      config = new AdminConfig(data);
    }
    
    await config.save();
    
    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}