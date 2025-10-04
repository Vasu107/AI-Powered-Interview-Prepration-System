import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Interview from '@/app/Models/Interview';
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
    const interviews = await Interview.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, interviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await Interview.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}