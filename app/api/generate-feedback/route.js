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
    
    // Calculate comprehensive scoring metrics
    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const maxPossibleScore = totalQuestions * 10;
    const scorePercentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
    const avgScorePerQuestion = totalQuestions > 0 ? totalScore / totalQuestions : 0;
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    // Analyze score distribution
    const excellentAnswers = answers.filter(a => (a.score || 0) >= 8).length;
    const goodAnswers = answers.filter(a => (a.score || 0) >= 6 && (a.score || 0) < 8).length;
    const averageAnswers = answers.filter(a => (a.score || 0) >= 4 && (a.score || 0) < 6).length;
    const poorAnswers = answers.filter(a => (a.score || 0) < 4).length;
    
    // Generate comprehensive overall assessment
    let overallAssessment = `Interview Performance Analysis:\n\n`;
    overallAssessment += `You scored ${totalScore} out of ${maxPossibleScore} points (${scorePercentage.toFixed(1)}%) across ${totalQuestions} questions. `;
    overallAssessment += `Your average score per question was ${avgScorePerQuestion.toFixed(1)}/10.\n\n`;
    
    if (scorePercentage >= 80) {
        overallAssessment += `Outstanding performance! You demonstrated excellent ${language} knowledge with strong technical understanding. `;
    } else if (scorePercentage >= 65) {
        overallAssessment += `Good performance overall. You showed solid ${language} fundamentals with room for refinement in some areas. `;
    } else if (scorePercentage >= 50) {
        overallAssessment += `Average performance. You have basic ${language} knowledge but need to strengthen your technical skills. `;
    } else {
        overallAssessment += `Below average performance. Focus on building stronger ${language} fundamentals before your next interview. `;
    }
    
    overallAssessment += `Score breakdown: ${excellentAnswers} excellent (8-10), ${goodAnswers} good (6-7), ${averageAnswers} average (4-5), ${poorAnswers} needs improvement (0-3).`;

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

    // Calculate comprehensive overall score (0-10)
    let score = Math.round(scorePercentage / 10); // Base score from percentage
    
    // Bonus adjustments
    if (avgTime < 45 && timedOutQuestions === 0) score += 0.5; // Time efficiency bonus
    if (excellentAnswers > totalQuestions * 0.5) score += 0.5; // Excellence bonus
    if (completionRate === 100) score += 0.5; // Completion bonus
    
    // Penalty adjustments
    if (timedOutQuestions > totalQuestions * 0.3) score -= 1; // Timeout penalty
    if (poorAnswers > totalQuestions * 0.5) score -= 0.5; // Poor performance penalty
    
    score = Math.min(10, Math.max(0, Math.round(score * 10) / 10));

    return {
        overallAssessment,
        strengths,
        improvements,
        recommendations,
        score,
        completionRate: Math.round(completionRate),
        avgResponseTime: Math.round(avgTime),
        questionsAnswered: answeredQuestions,
        totalQuestions,
        totalScore,
        maxPossibleScore,
        scorePercentage: Math.round(scorePercentage * 10) / 10,
        avgScorePerQuestion: Math.round(avgScorePerQuestion * 10) / 10,
        scoreDistribution: {
            excellent: excellentAnswers,
            good: goodAnswers,
            average: averageAnswers,
            poor: poorAnswers
        }
    };
}