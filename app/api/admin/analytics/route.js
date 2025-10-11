import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import User from "@/app/Models/User";
import Interview from "@/models/Interview";

export async function GET() {
  try {
    await connectToDB();
    
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ status: 'completed' });
    
    // Calculate average score
    const completedWithScores = await Interview.find({ 
      status: 'completed', 
      score: { $exists: true, $ne: null } 
    });
    
    const averageScore = completedWithScores.length > 0 
      ? Math.round(completedWithScores.reduce((sum, interview) => sum + interview.score, 0) / completedWithScores.length)
      : 0;
    
    const analytics = {
      totalUsers,
      totalInterviews,
      completedInterviews,
      averageScore
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}