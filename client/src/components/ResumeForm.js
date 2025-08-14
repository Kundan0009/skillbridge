// src/components/ResumeForm.js
import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function ResumeForm() {
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert('Please upload your resume!');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await axios.post('http://localhost:5000/api/generate-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data.result);
    } catch (error) {
      console.error('Upload failed:', error);
      setResult('❌ Failed to process the resume.');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = result.split('\n');

    let y = 10;
    lines.forEach((line) => {
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save('resume_analysis.pdf');
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Upload Your Resume</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Analyze
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-sm whitespace-pre-line">
          {result}

          <button
            onClick={downloadPDF}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            📄 Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default ResumeForm;
