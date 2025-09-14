import React, { useState } from 'react';
import axios from 'axios';

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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        alert('Please upload a PDF file only.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/resumes/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });

      clearInterval(progressInterval);
      
      if (response.data.success) {
        setProgress(100);
        setAnalysisStep('Analysis Complete! 🎉');
        setTimeout(() => {
          onAnalysisComplete(response.data.analysis);
          setFile(null);
          setProgress(0);
          setAnalysisStep('');
        }, 1000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload failed:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
        <p className="text-gray-600">
          Upload your resume in PDF format to get comprehensive analysis and feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : file
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
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
                <div className="text-4xl mb-2">✅</div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
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
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Analysis Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-800">{analysisStep}</span>
              <span className="text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            !file || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
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
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for Better Analysis</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure your resume is in PDF format for best results</li>
          <li>• Include clear section headers (Experience, Education, Skills, etc.)</li>
          <li>• Use standard fonts and avoid complex formatting</li>
          <li>• Include relevant keywords for your target industry</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;