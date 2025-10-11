import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const ADMIN_EMAILS = ['askupteam396@gmail.com'];



export async function GET() {
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    
    let config = await db.collection('config').findOne({ type: 'interview' });
    
    if (!config) {
      const defaultConfig = {
        type: 'interview',
        jobPositions: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist'],
        jobExperience: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
        questionCounts: [5, 10, 15, 20, 25],
        durations: ['15 minutes', '30 minutes', '45 minutes', '60 minutes'],
        interviewTypes: ['Technical', 'Behavioral', 'System Design', 'Coding', 'Mixed'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('config').insertOne(defaultConfig);
      return NextResponse.json({ config: defaultConfig });
    }
    
    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    const { config } = await request.json();
    
    await db.collection('config').updateOne(
      { type: 'interview' },
      { 
        $set: { 
          ...config,
          type: 'interview',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}