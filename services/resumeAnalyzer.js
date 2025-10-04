// ML-based Resume Analyzer with ATS Rating
export class ResumeAnalyzer {
  constructor() {
    this.skillsDatabase = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes',
      'machine learning', 'data science', 'tensorflow', 'pytorch', 'html', 'css', 'angular', 'vue.js',
      'c++', 'c#', '.net', 'spring', 'django', 'flask', 'git', 'jenkins', 'ci/cd', 'agile', 'scrum'
    ];
    
    this.atsKeywords = [
      'experience', 'education', 'skills', 'projects', 'achievements', 'certifications',
      'responsibilities', 'accomplishments', 'results', 'metrics', 'quantified'
    ];
  }

  async analyzeResume(resumeText, jobDescription = '') {
    const analysis = {
      atsScore: this.calculateATSScore(resumeText, jobDescription),
      skillsMatch: this.extractSkills(resumeText),
      experienceLevel: this.determineExperienceLevel(resumeText),
      educationScore: this.analyzeEducation(resumeText),
      formatScore: this.analyzeFormat(resumeText),
      keywordDensity: this.calculateKeywordDensity(resumeText, jobDescription),
      recommendations: []
    };

    analysis.overallScore = this.calculateOverallScore(analysis);
    analysis.recommendations = this.generateRecommendations(analysis, resumeText);
    
    return analysis;
  }

  calculateATSScore(resumeText, jobDescription) {
    let score = 0;
    const text = resumeText.toLowerCase();
    
    // Check for ATS-friendly formatting indicators
    if (text.includes('experience') || text.includes('work history')) score += 15;
    if (text.includes('education') || text.includes('degree')) score += 15;
    if (text.includes('skills') || text.includes('technical skills')) score += 15;
    if (text.includes('email') && text.includes('phone')) score += 10;
    
    // Check for quantified achievements
    const numberPattern = /\d+[%$k+]/g;
    const numbers = text.match(numberPattern);
    if (numbers && numbers.length > 0) score += Math.min(numbers.length * 5, 20);
    
    // Job description matching
    if (jobDescription) {
      const jobKeywords = jobDescription.toLowerCase().split(/\s+/);
      const matchedKeywords = jobKeywords.filter(keyword => 
        keyword.length > 3 && text.includes(keyword)
      );
      score += Math.min(matchedKeywords.length * 2, 25);
    }
    
    return Math.min(score, 100);
  }

  extractSkills(resumeText) {
    const text = resumeText.toLowerCase();
    const foundSkills = this.skillsDatabase.filter(skill => 
      text.includes(skill.toLowerCase())
    );
    
    return {
      technical: foundSkills.filter(skill => 
        ['javascript', 'python', 'java', 'react', 'node.js', 'sql'].includes(skill)
      ),
      tools: foundSkills.filter(skill => 
        ['git', 'docker', 'aws', 'jenkins'].includes(skill)
      ),
      frameworks: foundSkills.filter(skill => 
        ['react', 'angular', 'vue.js', 'django', 'flask'].includes(skill)
      ),
      all: foundSkills
    };
  }

  determineExperienceLevel(resumeText) {
    const text = resumeText.toLowerCase();
    const experiencePatterns = [
      /(\d+)\s*years?\s*of\s*experience/g,
      /(\d+)\s*years?\s*experience/g,
      /experience:\s*(\d+)\s*years?/g
    ];
    
    let maxYears = 0;
    experiencePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const years = parseInt(match.match(/\d+/)[0]);
          maxYears = Math.max(maxYears, years);
        });
      }
    });

    if (maxYears === 0) {
      // Estimate based on job positions
      const jobCount = (text.match(/\b(developer|engineer|analyst|manager|lead|senior)\b/g) || []).length;
      maxYears = jobCount * 1.5;
    }

    if (maxYears < 2) return { level: 'Entry Level', years: maxYears, score: 60 };
    if (maxYears < 5) return { level: 'Mid Level', years: maxYears, score: 75 };
    if (maxYears < 10) return { level: 'Senior Level', years: maxYears, score: 90 };
    return { level: 'Expert Level', years: maxYears, score: 95 };
  }

  analyzeEducation(resumeText) {
    const text = resumeText.toLowerCase();
    let score = 0;
    
    if (text.includes('phd') || text.includes('doctorate')) score = 100;
    else if (text.includes('master') || text.includes('mba') || text.includes('ms ') || text.includes('m.s')) score = 85;
    else if (text.includes('bachelor') || text.includes('bs ') || text.includes('b.s') || text.includes('degree')) score = 70;
    else if (text.includes('associate') || text.includes('diploma')) score = 55;
    else if (text.includes('certificate') || text.includes('certification')) score = 40;
    else score = 30;

    return { score, hasRelevantEducation: score >= 55 };
  }

  analyzeFormat(resumeText) {
    let score = 100;
    const text = resumeText;
    
    // Check for common formatting issues
    if (text.length < 500) score -= 20; // Too short
    if (text.length > 5000) score -= 10; // Too long
    if (!text.includes('@')) score -= 15; // No email
    if (!/\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text)) score -= 10; // No phone
    
    // Check for structure
    const sections = ['experience', 'education', 'skills'].filter(section => 
      text.toLowerCase().includes(section)
    );
    score += sections.length * 10;
    
    return Math.max(score, 0);
  }

  calculateKeywordDensity(resumeText, jobDescription) {
    if (!jobDescription) return { density: 0, matchedKeywords: [] };
    
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const jobWords = jobDescription.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3);
    
    const matchedKeywords = jobWords.filter(word => 
      resumeWords.includes(word)
    );
    
    const density = (matchedKeywords.length / jobWords.length) * 100;
    
    return {
      density: Math.round(density),
      matchedKeywords: [...new Set(matchedKeywords)],
      totalJobKeywords: jobWords.length
    };
  }

  calculateOverallScore(analysis) {
    const weights = {
      atsScore: 0.3,
      experienceScore: 0.25,
      educationScore: 0.2,
      formatScore: 0.15,
      skillsScore: 0.1
    };
    
    const skillsScore = Math.min(analysis.skillsMatch.all.length * 10, 100);
    
    return Math.round(
      analysis.atsScore * weights.atsScore +
      analysis.experienceLevel.score * weights.experienceScore +
      analysis.educationScore.score * weights.educationScore +
      analysis.formatScore * weights.formatScore +
      skillsScore * weights.skillsScore
    );
  }

  generateRecommendations(analysis, resumeText) {
    const recommendations = [];
    
    if (analysis.atsScore < 70) {
      recommendations.push({
        type: 'ATS Optimization',
        priority: 'High',
        suggestion: 'Add more relevant keywords and quantified achievements'
      });
    }
    
    if (analysis.skillsMatch.all.length < 5) {
      recommendations.push({
        type: 'Skills Enhancement',
        priority: 'Medium',
        suggestion: 'Include more technical skills relevant to your field'
      });
    }
    
    if (analysis.formatScore < 80) {
      recommendations.push({
        type: 'Formatting',
        priority: 'Medium',
        suggestion: 'Improve resume structure and ensure contact information is clear'
      });
    }
    
    if (!resumeText.toLowerCase().includes('achievement') && !resumeText.toLowerCase().includes('result')) {
      recommendations.push({
        type: 'Content Enhancement',
        priority: 'High',
        suggestion: 'Add quantifiable achievements and results from your work'
      });
    }
    
    return recommendations;
  }
}

// Text extraction utility for different file types
export const extractTextFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      
      if (file.type === 'text/plain') {
        resolve(text);
      } else if (file.type === 'application/pdf') {
        // For PDF, we'll use a simple text extraction
        // In production, you'd use a proper PDF parser like pdf-parse
        resolve(text);
      } else {
        // For DOC/DOCX files, basic text extraction
        resolve(text);
      }
    };
    
    reader.onerror = reject;
    
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsText(file); // Simplified for demo
    }
  });
};