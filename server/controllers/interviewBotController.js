import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : null;

// Store conversation history (in production, use Redis or database)
const conversationHistory = new Map();

export const startInterview = async (req, res) => {
  try {
    const { role, level, topics } = req.body;
    const sessionId = Date.now().toString();

    const systemPrompt = `You are an expert technical interviewer for ${role} positions at ${level} level. 
    Focus on: ${topics?.join(', ') || 'general technical skills'}.
    
    Conduct a professional mock interview:
    - Ask one question at a time
    - Provide constructive feedback
    - Adapt difficulty based on responses
    - Cover technical concepts, problem-solving, and behavioral aspects
    
    Start with a welcoming introduction and your first question.`;

    let response;

    if (!model) {
      response = {
        message: `Hello! I'm your AI interview assistant. I'll be conducting a mock interview for the ${role} position. Let's start with: Can you tell me about your experience with the main technologies required for this role?`,
        sessionId,
        questionType: 'experience'
      };
    } else {
      try {
        const result = await model.generateContent(systemPrompt);
        const aiResponse = await result.response;
        
        response = {
          message: aiResponse.text(),
          sessionId,
          questionType: 'introduction'
        };
        
        // Store conversation history
        conversationHistory.set(sessionId, [
          { role: 'system', content: systemPrompt },
          { role: 'assistant', content: aiResponse.text() }
        ]);
      } catch (error) {
        console.error('Interview start error:', error);
        response = {
          message: `Hello! I'm your AI interview assistant for the ${role} position. Let's begin: What interests you most about this role?`,
          sessionId,
          questionType: 'motivation'
        };
      }
    }

    res.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ 
      error: 'Failed to start interview',
      details: error.message 
    });
  }
};

export const continueInterview = async (req, res) => {
  try {
    const { sessionId, userResponse, questionCount = 0 } = req.body;

    if (!sessionId || !userResponse) {
      return res.status(400).json({ error: 'Session ID and user response are required' });
    }

    let response;

    if (!model) {
      // Basic fallback with simple evaluation
      const wordCount = userResponse.split(' ').length;
      const hasExample = /example|project|experience|worked|built|developed/i.test(userResponse);
      
      let feedback = "Good response! ";
      if (wordCount < 10) feedback += "Try to provide more detailed answers.";
      else if (!hasExample) feedback += "Consider adding specific examples.";
      else feedback += "Great use of examples!";
      
      response = {
        message: questionCount >= 4 ? "Thank you for the interview! You provided good responses overall." : "Tell me about a challenging technical problem you solved.",
        feedback: feedback,
        answerScore: Math.min(60 + wordCount * 2 + (hasExample ? 20 : 0), 100),
        isComplete: questionCount >= 4,
        nextQuestionType: questionCount >= 4 ? 'complete' : 'technical'
      };
    } else {
      try {
        const history = conversationHistory.get(sessionId) || [];
        const lastQuestion = history[history.length - 1]?.content || "previous question";
        
        const evaluationPrompt = `You are an expert technical interviewer. Evaluate this candidate's response and provide the next question.

Previous question: "${lastQuestion}"
Candidate's answer: "${userResponse}"
Question number: ${questionCount + 1}

Evaluate the answer and respond in JSON format:
{
  "answerEvaluation": {
    "score": 85,
    "strengths": ["Good technical knowledge", "Clear explanation"],
    "weaknesses": ["Could provide more specific examples"],
    "isCorrect": true
  },
  "feedback": "Good answer! You demonstrated solid understanding. However, try to include more specific examples next time.",
  "nextQuestion": "Can you explain how you would optimize a slow database query?",
  "questionType": "technical",
  "difficulty": "medium",
  "isComplete": false,
  "overallProgress": "The candidate is performing well with good technical knowledge."
}`;

        const result = await model.generateContent(evaluationPrompt);
        const aiResponse = await result.response;
        let text = aiResponse.text();
        
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const evaluation = JSON.parse(text);
        
        response = {
          message: questionCount >= 4 ? `Interview complete! ${evaluation.overallProgress}` : evaluation.nextQuestion,
          feedback: evaluation.feedback,
          answerScore: evaluation.answerEvaluation?.score || 75,
          strengths: evaluation.answerEvaluation?.strengths || [],
          weaknesses: evaluation.answerEvaluation?.weaknesses || [],
          isCorrect: evaluation.answerEvaluation?.isCorrect || true,
          isComplete: questionCount >= 4,
          nextQuestionType: questionCount >= 4 ? 'complete' : evaluation.questionType,
          difficulty: evaluation.difficulty
        };
        
        // Update conversation history
        history.push(
          { role: 'user', content: userResponse, score: evaluation.answerEvaluation?.score },
          { role: 'assistant', content: response.message }
        );
        conversationHistory.set(sessionId, history);
        
      } catch (error) {
        console.error('Continue interview error:', error);
        response = {
          message: "Can you tell me about your experience with debugging?",
          feedback: "Thank you for your response. Let's continue.",
          answerScore: 70,
          isComplete: false,
          nextQuestionType: 'technical'
        };
      }
    }

    res.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Continue interview error:', error);
    res.status(500).json({ 
      error: 'Failed to continue interview',
      details: error.message 
    });
  }
};

export const endInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // Clean up conversation history
    if (sessionId) {
      conversationHistory.delete(sessionId);
    }
    
    res.json({
      success: true,
      message: 'Interview session ended successfully'
    });
    
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({ 
      error: 'Failed to end interview',
      details: error.message 
    });
  }
};