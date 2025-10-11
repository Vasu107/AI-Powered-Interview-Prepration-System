import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { answers, jobPosition, language } = await request.json();

        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json({ error: 'Invalid answers data' }, { status: 400 });
        }

        // Generate AI feedback based on answers
        const feedback = generateFeedback(answers, jobPosition, language);

        return NextResponse.json({ 
            success: true, 
            feedback 
        });

    } catch (error) {
        console.error('Feedback generation error:', error);
        return NextResponse.json({ 
            error: 'Failed to generate feedback' 
        }, { status: 500 });
    }
}

function generateFeedback(answers, jobPosition, language) {
    const totalQuestions = answers.length;
    const answeredQuestions = answers.filter(a => a.userAnswer && !a.userAnswer.includes('[TIMEOUT')).length;
    const timedOutQuestions = answers.filter(a => a.timedOut).length;
    const avgTime = answers.length > 0 ? 
        answers.reduce((sum, a) => sum + a.timeTaken, 0) / answers.length : 0;
    const quickResponses = answers.filter(a => a.timeTaken < 30 && !a.timedOut).length;
    
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    // Generate overall assessment
    let overallAssessment = '';
    if (completionRate >= 90) {
        overallAssessment = `Excellent performance! You demonstrated strong ${language} knowledge and completed ${completionRate.toFixed(0)}% of the interview questions. Your responses show good understanding of the concepts.`;
    } else if (completionRate >= 70) {
        overallAssessment = `Good performance overall. You completed ${completionRate.toFixed(0)}% of the questions with reasonable accuracy. There's room for improvement in some areas.`;
    } else if (completionRate >= 50) {
        overallAssessment = `Average performance. You completed ${completionRate.toFixed(0)}% of the questions. Focus on improving your ${language} fundamentals and practice more technical concepts.`;
    } else {
        overallAssessment = `Your performance indicates significant room for improvement. Consider reviewing ${language} basics and practicing more before your next interview.`;
    }

    // Generate strengths
    const strengths = [];
    if (quickResponses > totalQuestions * 0.3) {
        strengths.push('Quick thinking and fast response times');
    }
    if (completionRate >= 80) {
        strengths.push('High completion rate shows good preparation');
    }
    if (avgTime < 60) {
        strengths.push('Efficient time management during responses');
    }
    if (timedOutQuestions === 0) {
        strengths.push('No timeouts - good time awareness');
    }
    if (strengths.length === 0) {
        strengths.push('Attempted all questions despite challenges');
    }

    // Generate improvements
    const improvements = [];
    if (timedOutQuestions > 0) {
        improvements.push(`${timedOutQuestions} questions timed out - work on time management`);
    }
    if (avgTime > 90) {
        improvements.push('Response time could be improved - practice explaining concepts concisely');
    }
    if (completionRate < 70) {
        improvements.push(`Study ${language} fundamentals more thoroughly`);
    }
    if (quickResponses < totalQuestions * 0.2) {
        improvements.push('Practice solving problems faster to build confidence');
    }

    // Generate recommendations
    const recommendations = [];
    recommendations.push(`Practice more ${language} coding problems daily`);
    recommendations.push('Review fundamental concepts and data structures');
    recommendations.push('Practice explaining solutions clearly and concisely');
    
    if (jobPosition) {
        recommendations.push(`Study ${jobPosition}-specific ${language} patterns and best practices`);
    }
    
    if (avgTime > 60) {
        recommendations.push('Practice timed coding sessions to improve speed');
    }

    // Calculate score
    let score = Math.round((completionRate / 100) * 10);
    if (avgTime < 45) score += 1;
    if (timedOutQuestions === 0) score += 1;
    score = Math.min(10, Math.max(1, score));

    return {
        overallAssessment,
        strengths,
        improvements,
        recommendations,
        score,
        completionRate: Math.round(completionRate),
        avgResponseTime: Math.round(avgTime),
        questionsAnswered: answeredQuestions,
        totalQuestions
    };
}