import React, { useState } from 'react';
import api from '../utils/api';

const InterviewBot = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewSettings, setInterviewSettings] = useState({
    role: 'Software Developer',
    level: 'Mid-level',
    topics: ['JavaScript', 'React', 'Problem Solving']
  });

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/interview-bot/start', interviewSettings);
      setSessionId(response.data.sessionId);
      setMessages([{
        type: 'bot',
        content: response.data.message,
        timestamp: new Date()
      }]);
      setInterviewStarted(true);
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || loading) return;

    const userMessage = {
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    try {
      const response = await api.post('/api/interview-bot/continue', {
        sessionId,
        userResponse: currentMessage,
        questionCount: messages.filter(m => m.type === 'bot').length
      });

      const botMessage = {
        type: 'bot',
        content: response.data.message,
        feedback: response.data.feedback,
        answerScore: response.data.answerScore,
        strengths: response.data.strengths,
        weaknesses: response.data.weaknesses,
        isCorrect: response.data.isCorrect,
        difficulty: response.data.difficulty,
        isComplete: response.data.isComplete,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (response.data.isComplete) {
        setInterviewStarted(false);
      }
    } catch (error) {
      console.error('Failed to continue interview:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    try {
      await api.post('/api/interview-bot/end', { sessionId });
      setInterviewStarted(false);
      setSessionId(null);
      setMessages([]);
    } catch (error) {
      console.error('Failed to end interview:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🤖 AI Interview Bot</h2>

        {!interviewStarted ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={interviewSettings.role}
                  onChange={(e) => setInterviewSettings(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Software Developer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Data Scientist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={interviewSettings.level}
                  onChange={(e) => setInterviewSettings(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Entry-level</option>
                  <option>Mid-level</option>
                  <option>Senior-level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Focus Areas</label>
                <input
                  type="text"
                  value={interviewSettings.topics.join(', ')}
                  onChange={(e) => setInterviewSettings(prev => ({ 
                    ...prev, 
                    topics: e.target.value.split(',').map(t => t.trim()) 
                  }))}
                  placeholder="JavaScript, React, Node.js"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Starting Interview...' : 'Start Mock Interview'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Interview Session: {interviewSettings.role} - {interviewSettings.level}
              </div>
              <button
                onClick={endInterview}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                End Interview
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <div className="text-sm">{message.content}</div>
                    
                    {/* Answer Score */}
                    {message.type === 'bot' && message.answerScore && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Answer Score:</span>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          message.answerScore >= 80 ? 'bg-green-100 text-green-800' :
                          message.answerScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {message.answerScore}%
                        </div>
                        {message.isCorrect !== undefined && (
                          <span className={`text-xs ${
                            message.isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {message.isCorrect ? '✓ Correct' : '✗ Needs Improvement'}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Detailed Feedback */}
                    {message.feedback && (
                      <div className="mt-2 text-xs bg-blue-50 text-blue-800 p-2 rounded">
                        💡 <strong>Feedback:</strong> {message.feedback}
                      </div>
                    )}
                    
                    {/* Strengths and Weaknesses */}
                    {(message.strengths?.length > 0 || message.weaknesses?.length > 0) && (
                      <div className="mt-2 space-y-1">
                        {message.strengths?.length > 0 && (
                          <div className="text-xs bg-green-50 text-green-800 p-2 rounded">
                            <strong>✓ Strengths:</strong> {message.strengths.join(', ')}
                          </div>
                        )}
                        {message.weaknesses?.length > 0 && (
                          <div className="text-xs bg-orange-50 text-orange-800 p-2 rounded">
                            <strong>⚠ Areas to improve:</strong> {message.weaknesses.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-1 flex justify-between">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.difficulty && (
                        <span className="capitalize">Difficulty: {message.difficulty}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your answer here..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !currentMessage.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewBot;