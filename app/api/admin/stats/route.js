import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    
    const totalUsers = await db.collection('users').countDocuments();
    const totalInterviews = await db.collection('interviews').countDocuments();
    const completedInterviews = await db.collection('interviews').countDocuments({ status: 'completed' });
    const activeUsers = await db.collection('users').countDocuments({ 
      updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });
    
    const stats = {
      totalUsers,
      totalInterviews,
      totalFeedback: completedInterviews,
      activeUsers
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}