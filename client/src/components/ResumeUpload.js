import React, { useState } from 'react';
import api from '../utils/api.js';

const ResumeUpload = ({ user, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // File type validation
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed for security reasons.');
      return false;
    }
    
    // File size validation (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return false;
    }
    
    // File name validation
    const validNameRegex = /^[a-zA-Z0-9._-]+\.pdf$/i;
    if (!validNameRegex.test(file.name)) {
      alert('Invalid file name. Use only letters, numbers, dots, hyphens, and underscores.');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        e.target.value = ''; // Clear the input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a PDF file to upload.');
      return;
    }

    setLoading(true);
    setProgress(0);
    
    // Simulate progress steps
    const steps = [
      { step: 'Uploading file...', progress: 20 },
      { step: 'Extracting text...', progress: 40 },
      { step: 'AI Analysis...', progress: 70 },
      { step: 'Generating insights...', progress: 90 },
      { step: 'Complete!', progress: 100 }
    ];
    
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setAnalysisStep(steps[currentStep].step);
        setProgress(steps[currentStep].progress);
        currentStep++;
      }
    }, 800);
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/api/resumes/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      clearInterval(progressInterval);
      
      if (response.data.success) {
        setProgress(100);
        setAnalysisStep('✓ Analysis Complete! Your resume insights are ready!');
        setTimeout(() => {
          onAnalysisComplete(response.data.analysis);
          setFile(null);
          setProgress(0);
          setAnalysisStep('');
        }, 1500);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload failed:', error);
      
      let errorMessage = 'Failed to analyze resume. Please try again.';
      
      if (error.response?.status === 413) {
        errorMessage = 'File too large. Please upload a smaller PDF (max 5MB).';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.error || 'Invalid file format or content.';
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      }
      
      setAnalysisStep(`❌ ${errorMessage}`);
      setProgress(0);
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setAnalysisStep('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📄</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Upload Your Resume</h2>
            <p className="text-gray-600 mt-1">
              Upload your resume in PDF format to get comprehensive AI analysis and feedback.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 backdrop-blur-md ${
            dragActive
              ? 'border-blue-400 bg-blue-100/50 shadow-lg scale-105'
              : file
              ? 'border-green-400 bg-green-100/50 shadow-lg'
              : 'border-gray-300 hover:border-purple-400 hover:bg-white/50 hover:shadow-md'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />
          
          <div className="space-y-4">
            {file ? (
              <div className="text-green-600">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl">✓</span>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-lg font-semibold text-green-800">{file.name}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-lg font-medium">
                  Drag and drop your resume here, or click to browse
                </p>
                <p className="text-sm">PDF files only, max 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Options */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Analysis Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              ATS Compatibility Score
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Section-wise Analysis
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Keyword Optimization
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Industry Matching
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Improvement Suggestions
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Skills Gap Analysis
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-blue-800 font-medium">{analysisStep}</span>
              <span className="text-purple-600 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 shadow-lg ${
            !file || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {analysisStep || 'Analyzing Resume...'}
            </div>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </form>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50 shadow-lg">
        <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Tips for Better Analysis
        </h3>
        <ul className="text-sm text-amber-800 space-y-2">
          <li className="flex items-start">
            <span className="text-amber-500 mr-2 mt-0.5">•</span>
            Ensure your resume is in PDF format for best results
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2 mt-0.5">•</span>
            Include clear section headers (Experience, Education, Skills, etc.)
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2 mt-0.5">•</span>
            Use standard fonts and avoid complex formatting
          </li>
          <li className="flex items-start">
            <span className="text-amber-500 mr-2 mt-0.5">•</span>
            Include relevant keywords for your target industry
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;