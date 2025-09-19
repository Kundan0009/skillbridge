import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : null;

// Static course dataset (in production, integrate with Coursera/edX APIs)
const courseDatabase = {
  'javascript': [
    { title: 'JavaScript Fundamentals', provider: 'Coursera', duration: '4 weeks', level: 'Beginner' },
    { title: 'Advanced JavaScript Concepts', provider: 'edX', duration: '6 weeks', level: 'Advanced' }
  ],
  'react': [
    { title: 'React Complete Guide', provider: 'Coursera', duration: '8 weeks', level: 'Intermediate' },
    { title: 'React Native Development', provider: 'edX', duration: '10 weeks', level: 'Advanced' }
  ],
  'python': [
    { title: 'Python for Data Science', provider: 'Coursera', duration: '12 weeks', level: 'Beginner' },
    { title: 'Advanced Python Programming', provider: 'edX', duration: '8 weeks', level: 'Advanced' }
  ],
  'machine-learning': [
    { title: 'Machine Learning Specialization', provider: 'Coursera', duration: '16 weeks', level: 'Intermediate' },
    { title: 'Deep Learning Fundamentals', provider: 'edX', duration: '12 weeks', level: 'Advanced' }
  ],
  'data-structures': [
    { title: 'Data Structures and Algorithms', provider: 'Coursera', duration: '10 weeks', level: 'Intermediate' },
    { title: 'Advanced Algorithms', provider: 'edX', duration: '8 weeks', level: 'Advanced' }
  ]
};

export const generateLearningPath = async (req, res) => {
  try {
    const { resumeText, targetRole, currentLevel, timeframe } = req.body;

    if (!resumeText || !targetRole) {
      return res.status(400).json({ error: 'Resume text and target role are required' });
    }

    const learningPrompt = `You are an expert career counselor and learning path designer. Based on the resume and career goals, create a personalized learning path in VALID JSON format only.

Analyze the resume and create a learning path for: ${targetRole}
Current level: ${currentLevel || 'Intermediate'}
Timeframe: ${timeframe || '6 months'}

Provide analysis in this exact JSON structure:
{
  "skillGapAnalysis": {
    "currentSkills": ["JavaScript", "HTML", "CSS"],
    "requiredSkills": ["React", "Node.js", "MongoDB", "AWS"],
    "skillGaps": ["React", "Node.js", "MongoDB", "AWS"],
    "strengthAreas": ["Frontend development", "Problem-solving"]
  },
  "learningPath": {
    "phase1": {
      "title": "Foundation Building (Weeks 1-4)",
      "skills": ["React Basics", "Component Architecture"],
      "estimatedTime": "4 weeks",
      "priority": "High"
    },
    "phase2": {
      "title": "Backend Development (Weeks 5-8)",
      "skills": ["Node.js", "Express.js", "API Development"],
      "estimatedTime": "4 weeks", 
      "priority": "High"
    },
    "phase3": {
      "title": "Database & Deployment (Weeks 9-12)",
      "skills": ["MongoDB", "AWS Basics", "CI/CD"],
      "estimatedTime": "4 weeks",
      "priority": "Medium"
    }
  },
  "recommendedCourses": [
    {"skill": "React", "courses": ["React Complete Guide", "Advanced React Patterns"]},
    {"skill": "Node.js", "courses": ["Node.js Fundamentals", "Building APIs with Node"]}
  ],
  "practiceProjects": [
    "Build a personal portfolio website",
    "Create a full-stack web application",
    "Deploy application to cloud platform"
  ],
  "timeline": "12 weeks",
  "successMetrics": [
    "Complete 3 full-stack projects",
    "Deploy 2 applications to production",
    "Contribute to 1 open-source project"
  ]
}

Resume text:
${resumeText}`;

    let learningPath;

    if (!model) {
      // Fallback learning path
      const skillKeywords = ['javascript', 'react', 'node', 'python', 'java'];
      const resumeLower = resumeText.toLowerCase();
      const currentSkills = skillKeywords.filter(skill => resumeLower.includes(skill));
      
      learningPath = {
        skillGapAnalysis: {
          currentSkills: currentSkills,
          requiredSkills: ['React', 'Node.js', 'MongoDB', 'AWS'],
          skillGaps: ['React', 'Node.js', 'MongoDB'].filter(skill => !currentSkills.includes(skill.toLowerCase())),
          strengthAreas: ['Programming fundamentals', 'Problem-solving']
        },
        learningPath: {
          phase1: {
            title: 'Foundation Building (Weeks 1-4)',
            skills: ['JavaScript ES6+', 'React Basics'],
            estimatedTime: '4 weeks',
            priority: 'High'
          },
          phase2: {
            title: 'Backend Development (Weeks 5-8)', 
            skills: ['Node.js', 'Express.js', 'REST APIs'],
            estimatedTime: '4 weeks',
            priority: 'High'
          },
          phase3: {
            title: 'Database & Cloud (Weeks 9-12)',
            skills: ['MongoDB', 'AWS Basics', 'Deployment'],
            estimatedTime: '4 weeks',
            priority: 'Medium'
          }
        },
        recommendedCourses: [
          { skill: 'JavaScript', courses: courseDatabase.javascript || [] },
          { skill: 'React', courses: courseDatabase.react || [] }
        ],
        practiceProjects: [
          'Build a personal portfolio',
          'Create a todo application with React',
          'Develop a full-stack web app'
        ],
        timeline: '12 weeks',
        successMetrics: [
          'Complete 3 projects',
          'Deploy 1 application',
          'Build a portfolio website'
        ]
      };
    } else {
      try {
        console.log('Using Gemini AI for learning path generation...');
        const result = await model.generateContent(learningPrompt);
        const response = await result.response;
        let text = response.text();
        
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        learningPath = JSON.parse(text);
        
        // Enhance with course recommendations from our database
        if (learningPath.recommendedCourses) {
          learningPath.recommendedCourses = learningPath.recommendedCourses.map(item => ({
            ...item,
            courses: courseDatabase[item.skill.toLowerCase()] || item.courses
          }));
        }
        
        console.log('Gemini AI learning path generated successfully');
      } catch (parseError) {
        console.error('Gemini AI learning path error:', parseError);
        learningPath = {
          error: 'AI analysis failed, using basic learning path',
          skillGapAnalysis: {
            currentSkills: ['Basic programming'],
            skillGaps: ['Advanced frameworks', 'Cloud technologies']
          },
          learningPath: {
            phase1: {
              title: 'Skill Assessment & Planning',
              skills: ['Identify learning priorities'],
              estimatedTime: '2 weeks',
              priority: 'High'
            }
          }
        };
      }
    }

    res.json({
      success: true,
      learningPath: learningPath
    });

  } catch (error) {
    console.error('Learning path generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate learning path',
      details: error.message 
    });
  }
};

export const getCourseRecommendations = async (req, res) => {
  try {
    const { skills, level = 'intermediate' } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills array is required' });
    }

    const recommendations = skills.map(skill => {
      const skillKey = skill.toLowerCase().replace(/\s+/g, '-');
      const courses = courseDatabase[skillKey] || [];
      
      return {
        skill: skill,
        courses: courses.filter(course => 
          course.level.toLowerCase() === level.toLowerCase() || 
          course.level.toLowerCase() === 'beginner'
        ),
        alternativeCourses: courses.filter(course => 
          course.level.toLowerCase() !== level.toLowerCase()
        )
      };
    });

    res.json({
      success: true,
      recommendations: recommendations
    });

  } catch (error) {
    console.error('Course recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to get course recommendations',
      details: error.message 
    });
  }
};