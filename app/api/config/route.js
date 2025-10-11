import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    
    const config = await db.collection('config').findOne({ type: 'interview' });
    
    const defaultConfig = {
      jobPositions: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist'],
      jobExperience: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
      questionCounts: [5, 10, 15, 20, 25],
      durations: ['15 minutes', '30 minutes', '45 minutes', '60 minutes'],
      interviewTypes: ['Technical', 'Behavioral', 'System Design', 'Coding', 'Mixed']
    };
    
    return NextResponse.json({ 
      config: config || defaultConfig 
    });
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}