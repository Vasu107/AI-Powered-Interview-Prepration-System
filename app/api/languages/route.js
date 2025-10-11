import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    
    const config = await db.collection('config').findOne({ type: 'languages' });
    
    const defaultLanguages = [
      "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
      "PHP", "C#", "Go", "Ruby", "Swift", "Kotlin", "TypeScript",
      "HTML/CSS", "Angular", "Vue.js", "Django", "Flask", "Spring Boot"
    ];
    
    return NextResponse.json({ 
      languages: config?.languages || defaultLanguages 
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json({ error: "Failed to fetch languages" }, { status: 500 });
  }
}