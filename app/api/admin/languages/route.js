import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    
    let config = await db.collection('config').findOne({ type: 'languages' });
    
    if (!config) {
      const defaultLanguages = [
        "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
        "PHP", "C#", "Go", "Ruby", "Swift", "Kotlin", "TypeScript",
        "HTML/CSS", "Angular", "Vue.js", "Django", "Flask", "Spring Boot"
      ];
      
      config = await db.collection('config').insertOne({
        type: 'languages',
        languages: defaultLanguages,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return NextResponse.json({ languages: defaultLanguages });
    }
    
    return NextResponse.json({ languages: config.languages });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json({ error: "Failed to fetch languages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await client.connect();
    const db = client.db('AskUp_Virtual_Interview');
    const { languages } = await request.json();
    
    await db.collection('config').updateOne(
      { type: 'languages' },
      { 
        $set: { 
          languages,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({ message: "Languages updated successfully" });
  } catch (error) {
    console.error("Error saving languages:", error);
    return NextResponse.json({ error: "Failed to save languages" }, { status: 500 });
  }
}