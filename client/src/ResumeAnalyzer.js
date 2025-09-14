import { useState } from "react";

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch("http://localhost:5000/api/resumes/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();
      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        setFeedback("No feedback received.");
      }
    } catch (err) {
      setFeedback("Error analyzing resume.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-gray-700">AI Resume Analyzer</h2>
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={10}
        placeholder="Paste your resume text here..."
        className="w-full p-3 border border-gray-300 rounded-md"
      />
      <button
        onClick={analyzeResume}
        disabled={loading || !resumeText.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {feedback && (
        <div className="bg-gray-100 p-4 mt-4 rounded-md whitespace-pre-wrap text-sm">
          {feedback}
        </div>
      )}
    </div>
  );
}
