// app/api/interviews/create/route.js
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, jobRole, programmingLanguage, interviewType, feedback } = await req.json();

    const interview = await Interview.create({
      userId,
      jobRole,
      programmingLanguage,
      interviewType,
      feedback,
    });

    return new Response(JSON.stringify({ message: "Interview created", interview }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
