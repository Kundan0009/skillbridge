// Infrastructure - External AI service
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiAIProvider {
  constructor(apiKey) {
    this.model = null;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch (error) {
        console.error('Gemini AI initialization failed:', error);
      }
    }
  }

  async analyze(resumeText, prompt) {
    if (!this.model) {
      throw new Error('AI service not available');
    }

    const fullPrompt = `${prompt}\n\nResume text to analyze:\n${resumeText}`;
    
    const result = await this.model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up JSON response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  }

  isAvailable() {
    return this.model !== null;
  }
}