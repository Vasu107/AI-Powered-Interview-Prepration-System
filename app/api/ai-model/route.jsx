import { OpenAI } from "openai";

export async function GET(req) {

    const {jobPosistion, jobExperience, jobDescription, Duration, type, language, questionCount} = await req.json();
    return Response.json({ message: "AI model endpoint" });
}