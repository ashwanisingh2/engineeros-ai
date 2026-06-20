import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Award, Loader, AlertTriangle, CheckCircle } from 'lucide-react';
import { callAIService } from '../utils/aiService';

export default function VoiceExplainer({ lesson, course, onClose }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { score, gaps, correction }
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US'; // Default to English, though it works with Hinglish

      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        if (currentTranscript) {
          setTranscript(prev => prev + ' ' + currentTranscript);
        }
      };

      rec.onerror = (e) => {
        console.error(e);
        setError(`Speech recognition error: ${e.error}`);
      };

      recognitionRef.current = rec;
    } else {
      setError("Web Speech API is not supported in this browser. Please use Chrome or Edge.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript('');
    setResult(null);
    setRecording(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      setError(`Failed to start recording: ${e.message}`);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current || !recording) return;
    setRecording(false);
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEvaluateExplanation = async () => {
    if (!transcript.trim()) {
      setError("Please record your explanation first!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const promptText = `Evaluate the student's voice explanation of the technical IT topic.
      Topic: "${lesson.name}" (from course "${course.name}")
      Student's voice explanation transcript: "${transcript}"

      Instructions:
      1. Score the explanation out of 10 for technical accuracy, clarity, and completeness.
      2. Identify critical gaps or mistakes in their understanding (list them as brief bullet points).
      3. Provide a clear, concise 2-sentence correction or master summary of the topic.
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "score": 7,
        "gaps": [
          "Did not mention that GPO updates require gpupdate /force on the client side",
          "Confused local policy with domain policies"
        ],
        "correction": "Corrected summary sentence 1. Corrected summary sentence 2."
      }`;

      const aiResponse = await callAIService({
        systemPrompt: "You are an expert systems engineering examiner. Output raw JSON objects only.",
        prompt: promptText
      });

      const cleaned = aiResponse.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsedResult = JSON.parse(cleaned);

      setResult(parsedResult);

      // Save session to localStorage
      const sessions = JSON.parse(localStorage.getItem('engineeros_voice_sessions') || '[]');
      const newSession = {
        id: Date.now().toString(),
        topicId: `${course.id}_${lesson.id}`,
        topicName: lesson.name,
        courseName: course.name,
        transcript: transcript,
        score: parsedResult.score,
        gaps: parsedResult.gaps,
        correction: parsedResult.correction,
        timestamp: new Date().toISOString()
      };
      sessions.push(newSession);
      localStorage.setItem('engineeros_voice_sessions', JSON.stringify(sessions));

    } catch (err) {
      console.error(err);
      setError(`Evaluation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-cardBg border border-gray-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-850 bg-sidebarBg/50">
          <div className="flex items-center gap-2">
            <Mic size={18} className="text-primaryAccent animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-textPrimary">Explain It: {lesson.name}</h3>
              <p className="text-[10px] text-textMuted mt-0.5">Record yourself explaining this topic to check your understanding.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-textMuted hover:text-textPrimary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-red-950/20 border border-red-900 text-red-400 text-xs px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Record Controls */}
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4 border border-dashed border-gray-800 rounded-xl bg-sidebarBg/25">
              <div className="relative">
                <button
                  type="button"
                  onClick={recording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    recording 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse text-white scale-110 shadow-red-500/20' 
                      : 'bg-primaryAccent hover:bg-indigo-700 text-white shadow-indigo-500/20'
                  }`}
                >
                  {recording ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs font-bold text-textPrimary">
                  {recording ? "Listening... Speak now!" : "Click to start speaking"}
                </p>
                <p className="text-[10px] text-textMuted mt-1">
                  Explain the topic in English or Hinglish like you are in an interview.
                </p>
              </div>
            </div>
          )}

          {/* Live Transcript Display */}
          {transcript && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-primaryAccent uppercase tracking-wider block">
                Recorded Transcript:
              </span>
              <div className="bg-sidebarBg/50 border border-gray-850 p-4 rounded-xl text-xs text-textSecondary leading-relaxed whitespace-pre-wrap max-h-[120px] overflow-y-auto font-medium">
                {transcript}
              </div>
            </div>
          )}

          {/* Trigger Button after recording stops */}
          {!recording && transcript && !result && !loading && (
            <button
              onClick={handleEvaluateExplanation}
              className="w-full bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all text-xs"
            >
              Analyze My Explanation
            </button>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-8 space-y-3">
              <Loader size={28} className="animate-spin text-primaryAccent mx-auto" />
              <p className="text-xs font-bold text-textPrimary">AI is scoring your explanation...</p>
              <p className="text-[10px] text-textMuted">Checking accuracy, finding concept gaps, and writing feedback.</p>
            </div>
          )}

          {/* Evaluation Results */}
          {result && (
            <div className="space-y-5 animate-fadeIn">
              {/* Score card */}
              <div className="bg-sidebarBg/40 border border-gray-850 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award size={36} className={result.score >= 7 ? "text-successGreen" : result.score >= 5 ? "text-amber-500" : "text-red-500"} />
                  <div>
                    <span className="text-[10px] text-textMuted uppercase tracking-wider block font-bold">Accuracy Score</span>
                    <span className="text-sm font-bold text-textPrimary">
                      {result.score >= 7 ? "Excellent Explanation!" : result.score >= 5 ? "Good Attempt" : "Needs Revision"}
                    </span>
                  </div>
                </div>
                <div className={`text-xl font-bold font-mono px-3 py-1.5 rounded-lg ${
                  result.score >= 7 ? 'text-successGreen bg-successGreen/10 border border-successGreen/20' : result.score >= 5 ? 'text-amber-400 bg-amber-400/10' : 'text-red-400 bg-red-400/10'
                }`}>
                  {result.score}/10
                </div>
              </div>

              {/* Gaps */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Identified Gaps:
                </span>
                {result.gaps && result.gaps.length > 0 ? (
                  <ul className="list-disc pl-4 text-xs text-textSecondary space-y-1 bg-black/15 border border-gray-850 p-3.5 rounded-xl font-medium">
                    {result.gaps.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-successGreen bg-successGreen/15 border border-successGreen/30 p-3 rounded-lg flex items-center gap-1.5 font-bold">
                    <CheckCircle size={14} />
                    Zero concept gaps found! Perfect.
                  </div>
                )}
              </div>

              {/* Correction */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-successGreen uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle size={12} />
                  Ideal Explanation (Quick Summary):
                </span>
                <p className="bg-black/15 border border-gray-850 p-3.5 rounded-xl text-xs text-textSecondary leading-relaxed whitespace-pre-wrap font-medium">
                  {result.correction}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {result && (
          <div className="px-6 py-4 border-t border-gray-850 bg-sidebarBg/50 flex justify-end">
            <button
              onClick={onClose}
              className="bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg text-xs transition-colors"
            >
              Done & Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
