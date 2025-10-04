import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_KEY?.startsWith('sk-or-') ? 'https://openrouter.ai/api/v1' : undefined,
});

export async function POST(request) {
  try {
    const { answers, jobPosition, language } = await request.json();

    if (!answers || answers.length === 0) {
      return NextResponse.json({ error: 'No answers provided' }, { status: 400 });
    }

    // Generate feedback based on performance metrics
    const totalQuestions = answers.length;
    const answeredQuestions = answers.filter(a => a.userAnswer && !a.userAnswer.includes('[TIMEOUT')).length;
    const timedOutQuestions = answers.filter(a => a.timedOut).length;
    const avgTime = answers.reduce((sum, a) => sum + a.timeTaken, 0) / answers.length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;

    let overallAssessment, strengths, improvements, recommendations, score;

    if (completionRate >= 90 && avgTime < 60) {
      score = 9;
      overallAssessment = "Excellent performance! You demonstrated strong technical knowledge and efficient problem-solving skills.";
      strengths = [
        "Quick response times showing good preparation",
        "High completion rate demonstrates thorough understanding",
        "Consistent performance across all questions"
      ];
      improvements = [
        "Continue practicing advanced concepts",
        "Explore edge cases in your solutions"
      ];
      recommendations = [
        "Consider taking on more complex technical challenges",
        "Share your knowledge through mentoring or technical writing"
      ];
    } else if (completionRate >= 70 && avgTime < 90) {
      score = 7;
      overallAssessment = "Good performance with room for improvement. You show solid understanding of core concepts.";
      strengths = [
        "Completed most questions successfully",
        "Reasonable response times",
        "Shows understanding of fundamental concepts"
      ];
      improvements = [
        "Work on explaining solutions more clearly",
        "Practice time management for complex problems"
      ];
      recommendations = [
        "Review areas where you took longer to respond",
        "Practice more coding problems daily"
      ];
    } else if (completionRate >= 50) {
      score = 5;
      overallAssessment = "Average performance. Focus on strengthening your technical foundation and practice more.";
      strengths = [
        "Attempted all questions",
        "Shows basic understanding"
      ];
      improvements = [
        "Study core concepts more thoroughly",
        "Improve response speed",
        "Practice explaining technical concepts clearly"
      ];
      recommendations = [
        "Dedicate more time to studying fundamentals",
        "Take practice interviews regularly",
        "Join coding practice groups or platforms"
      ];
    } else {
      score = 3;
      overallAssessment = "Needs significant improvement. Focus on building stronger technical foundations.";
      strengths = [
        "Participated in the interview process",
        "Shows willingness to learn"
      ];
      improvements = [
        "Study fundamental concepts extensively",
        "Improve time management skills",
        "Practice basic problem-solving techniques"
      ];
      recommendations = [
        "Start with beginner-level courses and tutorials",
        "Practice daily coding exercises",
        "Seek mentorship or additional training"
      ];
    }

    // Add specific feedback based on timeout issues
    if (timedOutQuestions > 0) {
      improvements.push(`Address time management - ${timedOutQuestions} questions timed out`);
      recommendations.push("Practice solving problems under time pressure");
    }

    return NextResponse.json({
      feedback: {
        overallAssessment,
        strengths,
        improvements,
        recommendations,
        score
      }
    });

  } catch (error) {
    console.error('Feedback generation error:', error);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}