import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import Content from "@/models/Content";

export async function GET() {
  try {
    await connectToDB();
    
    let content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      // Create default content if none exists
      content = await Content.create({
        heroTitle: "AI-Powered Interview Preparation System",
        heroDescription: "Prepare smarter, not harder! Get personalized feedback with AI-driven mock interviews, resume analysis, and real-time performance evaluation.",
        teamMembers: [
          { name: "Vasudev Yadav", designation: "BackEnd Developer", image: "vasudev.jpeg" },
          { name: "Shweta Kannojiya", designation: "Machine Learning", image: "shweta.jpeg" },
          { name: "Anmol Chirag", designation: "UI/UX Designer", image: "Anmol.jpeg" },
          { name: "Shrinkhala", designation: "Research Analyst", image: "Shrinkhala.jpeg" }
        ]
      });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const contentData = await request.json();
    
    // Update existing content or create new one
    const content = await Content.findOneAndUpdate(
      {},
      contentData,
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ message: "Content updated successfully", content });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}