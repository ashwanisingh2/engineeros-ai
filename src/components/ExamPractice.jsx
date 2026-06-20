import React, { useState, useEffect } from 'react';
import { Play, Check, X, ArrowRight, Loader, Clipboard, Award, RotateCcw, CheckCircle } from 'lucide-react';
import { callAIService } from '../utils/aiService';

const EXAMS = ["CCNA 200-301", "AZ-900 Azure Fundamentals", "AZ-104 Azure Administrator", "RHCSA Linux", "MS-102 Microsoft 365 Admin"];

export default function ExamPractice() {
  const [selectedExam, setSelectedExam] = useState("CCNA 200-301");
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerVerified, setIsAnswerVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activePracticeTab, setActivePracticeTab] = useState('quiz'); // 'quiz', 'weakness'
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    setMistakes(JSON.parse(localStorage.getItem('engineeros_mistakes') || '[]'));
  }, []);

  const activeQuestion = questions[activeIndex];

  const handleStartQuiz = async (overrideTopic = null) => {
    setLoading(true);
    setQuestions([]);
    setActiveIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnswerVerified(false);

    try {
      const topicScope = overrideTopic ? `focusing specifically on the subtopic: "${overrideTopic}"` : ``;
      const promptText = `Generate exactly 5 realistic, multiple choice questions (MCQ) for the certification exam: "${selectedExam}" ${topicScope}.
      The questions must match the format, difficulty, and complexity of the real exam.
      Each question must have exactly 4 choices.
      Explanations should be written in Hinglish (Hindi + English mix) and explain why the correct option is right and others are incorrect.
      
      Respond ONLY with a valid JSON array. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON array matching this format:
      [
        {
          "q": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answerIndex": 0,
          "explanation": "Detailed explanation of correct answer in Hinglish",
          "topic": "specific subtopic name (e.g. Subnetting)"
        }
      ]`;

      const responseText = await callAIService({
        systemPrompt: "You are a certification exam simulation generator. Output raw JSON only.",
        prompt: promptText
      });

      const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
      } else {
        throw new Error("Invalid response format received from model");
      }
    } catch (e) {
      console.error(e);
      alert(`Failed to load quiz: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null || isAnswerVerified) return;
    setIsAnswerVerified(true);
    
    if (selectedOption === activeQuestion.answerIndex) {
      setScore(prev => prev + 1);
    } else {
      // Log wrong answer
      const savedMistakes = JSON.parse(localStorage.getItem('engineeros_mistakes') || '[]');
      const newMistake = {
        topic: activeQuestion.topic || "General Concepts",
        question: activeQuestion.q,
        wrongAnswer: activeQuestion.options[selectedOption],
        correctAnswer: activeQuestion.options[activeQuestion.answerIndex],
        timestamp: new Date().toISOString(),
        certName: selectedExam
      };
      const updated = [...savedMistakes, newMistake];
      localStorage.setItem('engineeros_mistakes', JSON.stringify(updated));
      setMistakes(updated);
    }
  };

  const handleNextQuestion = () => {
    if (activeIndex < questions.length - 1) {
      setActiveIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerVerified(false);
    } else {
      setQuizFinished(true);
      // Increment exams attempted count in localStorage
      const attempted = parseInt(localStorage.getItem('engineeros_exams_attempted') || '0');
      localStorage.setItem('engineeros_exams_attempted', (attempted + 1).toString());

      // Log activity to recent activity feed
      const activities = JSON.parse(localStorage.getItem('engineeros_activities') || '[]');
      activities.unshift({
        id: Date.now().toString(),
        action: "Exam Attempted",
        details: `${selectedExam} Mock Quiz (${score}/${questions.length} Correct)`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('engineeros_activities', JSON.stringify(activities.slice(0, 5)));
    }
  };

  const renderWeakTopics = () => {
    const savedMistakes = mistakes;
    
    // Group by topic
    const counts = {};
    savedMistakes.forEach(m => {
      const key = m.topic || "General Concepts";
      counts[key] = (counts[key] || 0) + 1;
    });

    const sortedTopics = Object.entries(counts)
      .map(([topic, count]) => ({ 
        topic, 
        count, 
        certName: savedMistakes.find(m => (m.topic || "General Concepts") === topic)?.certName || selectedExam 
      }))
      .sort((a, b) => b.count - a.count);

    const maxCount = sortedTopics.length > 0 ? sortedTopics[0].count : 1;

    const handleResetMistakes = () => {
      if (window.confirm("Are you sure you want to reset and archive your mistake history?")) {
        const archive = JSON.parse(localStorage.getItem('engineeros_mistakes_archive') || '[]');
        archive.push({
          archivedAt: new Date().toISOString(),
          mistakes: savedMistakes
        });
        localStorage.setItem('engineeros_mistakes_archive', JSON.stringify(archive));
        localStorage.removeItem('engineeros_mistakes');
        setMistakes([]);
        alert("Mistake history archived successfully!");
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">
              📊 Weak Topics Analysis
            </h2>
            <p className="text-[10px] text-textMuted mt-0.5">Identified from previous mock test wrong answers.</p>
          </div>
          {savedMistakes.length > 0 && (
            <button
              onClick={handleResetMistakes}
              className="text-[10px] bg-red-950/40 border border-red-900 text-red-400 font-bold px-3 py-1.5 rounded transition-colors hover:bg-red-900/60"
            >
              Reset & Archive History
            </button>
          )}
        </div>

        {sortedTopics.length === 0 ? (
          <div className="text-center py-10 bg-cardBg border border-gray-800 rounded-xl max-w-md mx-auto">
            <CheckCircle size={32} className="text-successGreen mx-auto mb-2" />
            <p className="text-xs font-bold text-textPrimary">No Mistakes Logged Yet!</p>
            <p className="text-[10px] text-textMuted mt-1">
              Start practicing quizzes. Incorrect answers will automatically log here to compile your weak subtopics.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-textMuted">
              Red bars highlight your top 5 weakest subtopics. Click **"Practice This Topic"** to launch 5 custom questions targeting that area.
            </p>

            <div className="bg-cardBg border border-gray-800 rounded-xl p-4 space-y-4">
              {sortedTopics.map(({ topic, count, certName }, idx) => {
                const isWeak = idx < 5;
                const widthPercent = Math.max(8, (count / maxCount) * 100);

                return (
                  <div key={topic} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-850/45 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${isWeak ? 'text-red-400 font-bold' : 'text-textPrimary'}`}>
                          {topic} <span className="text-[10px] text-textMuted font-normal">({certName})</span>
                        </span>
                        <span className="font-mono font-bold text-textMuted">{count} mistakes</span>
                      </div>
                      
                      {/* CSS-Only Bar Chart */}
                      <div className="w-full bg-sidebarBg h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${isWeak ? 'bg-red-500' : 'bg-primaryAccent'}`}
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedExam(certName);
                        setActivePracticeTab('quiz');
                        handleStartQuiz(topic);
                      }}
                      className="shrink-0 text-[10px] bg-primaryAccent hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-md transition-colors"
                    >
                      Practice This Topic
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            📝 Exam Practice Portal
          </h1>
          <p className="text-textMuted mt-1">Simulate real certification exam multiple-choice questions with dynamic Hinglish reviews.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            disabled={loading || (questions.length > 0 && !quizFinished)}
            className="bg-cardBg border border-gray-800 text-textPrimary text-xs font-semibold py-2.5 px-3 rounded-lg focus:outline-none focus:border-primaryAccent"
          >
            {EXAMS.map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
          <button
            onClick={() => handleStartQuiz()}
            disabled={loading}
            className="bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-xs flex items-center gap-1.5"
          >
            {loading ? <Loader size={12} className="animate-spin" /> : <Play size={12} />}
            Start Mock Test
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6 gap-4 pb-0.5">
        <button
          onClick={() => setActivePracticeTab('quiz')}
          className={`pb-2 border-b-2 text-xs font-bold transition-all px-2 ${
            activePracticeTab === 'quiz'
              ? 'border-primaryAccent text-primaryAccent'
              : 'border-transparent text-textMuted hover:text-textPrimary'
          }`}
        >
          📝 Certification Quiz
        </button>
        <button
          onClick={() => {
            setActivePracticeTab('weakness');
            // Refresh mistakes list
            setMistakes(JSON.parse(localStorage.getItem('engineeros_mistakes') || '[]'));
          }}
          className={`pb-2 border-b-2 text-xs font-bold transition-all px-2 flex items-center gap-1.5 ${
            activePracticeTab === 'weakness'
              ? 'border-primaryAccent text-primaryAccent'
              : 'border-transparent text-textMuted hover:text-textPrimary'
          }`}
        >
          📊 Weak Topics
          {mistakes.length > 0 && (
            <span className="bg-red-500/10 text-red-400 text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-red-500/25">
              {mistakes.length}
            </span>
          )}
        </button>
      </div>

      {/* Quiz Tab */}
      {activePracticeTab === 'quiz' && (
        <>
          {loading && (
            <div className="bg-cardBg border border-gray-800 rounded-xl p-16 text-center space-y-4 max-w-lg mx-auto">
              <Loader size={32} className="animate-spin text-primaryAccent mx-auto" />
              <h3 className="text-base font-bold text-textPrimary">Generating Exam Questions</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                AI is creating 5 dynamic multiple-choice questions matching real-world certification standards for **{selectedExam}**. Please wait...
              </p>
            </div>
          )}

          {/* Quiz Body */}
          {!loading && activeQuestion && !quizFinished && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-cardBg border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                {/* Top Indicator */}
                <div className="flex items-center justify-between border-b border-gray-850 pb-3 mb-4">
                  <span className="text-xs font-semibold text-primaryAccent uppercase font-mono">
                    Question {activeIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs font-mono text-textMuted">
                    Score: {score}/{questions.length}
                  </span>
                </div>

                {/* Question */}
                <h2 className="text-base font-bold text-textPrimary leading-relaxed mb-6">
                  {activeQuestion.q}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {activeQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = activeQuestion.answerIndex === idx;

                    let cardStyle = "border-gray-800 hover:border-gray-700 bg-sidebarBg/40";
                    let checkIcon = null;

                    if (isAnswerVerified) {
                      if (isCorrect) {
                        cardStyle = "border-successGreen/40 bg-successGreen/10 text-successGreen";
                        checkIcon = <Check size={14} className="text-successGreen" />;
                      } else if (isSelected) {
                        cardStyle = "border-red-500/40 bg-red-500/10 text-red-400";
                        checkIcon = <X size={14} className="text-red-400" />;
                      }
                    } else if (isSelected) {
                      cardStyle = "border-primaryAccent bg-primaryAccent/10 text-primaryAccent";
                    }

                    return (
                      <label
                        key={idx}
                        className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors text-xs font-semibold ${cardStyle}`}
                        onClick={() => {
                          if (!isAnswerVerified) {
                            setSelectedOption(idx);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="mcq"
                            checked={isSelected}
                            disabled={isAnswerVerified}
                            onChange={() => {}}
                            className="accent-primaryAccent cursor-pointer"
                          />
                          <span>{opt}</span>
                        </div>
                        {checkIcon}
                      </label>
                    );
                  })}
                </div>

                {/* Verification Block / Explanation */}
                {isAnswerVerified && (
                  <div className="border-t border-gray-850 pt-4 mt-6 animate-fadeIn">
                    <span className="block text-[10px] font-bold text-primaryAccent uppercase tracking-widest mb-1.5">
                      Explanation & Review:
                    </span>
                    <p className="text-xs leading-relaxed text-textSecondary whitespace-pre-line">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-end pt-4 border-t border-gray-850 mt-6">
                  {!isAnswerVerified ? (
                    <button
                      onClick={handleVerifyAnswer}
                      disabled={selectedOption === null}
                      className="bg-primaryAccent hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                    >
                      Verify Option
                      <Check size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                    >
                      {activeIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quiz Complete Score Card */}
          {quizFinished && (
            <div className="bg-cardBg border border-gray-800 rounded-xl p-8 max-w-md mx-auto text-center space-y-6 shadow-2xl animate-fadeIn">
              <Award size={48} className="text-successGreen mx-auto animate-bounce" />
              
              <div>
                <h2 className="text-lg font-bold text-textPrimary">Practice Quiz Complete!</h2>
                <p className="text-xs text-textMuted mt-1">Certification target: **{selectedExam}**</p>
              </div>

              <div className="bg-darkBg/60 border border-gray-850 rounded-xl p-5 inline-block">
                <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Your Score</span>
                <span className="text-2xl font-bold font-mono text-successGreen mt-1 block">
                  {score} / {questions.length} Correct
                </span>
              </div>

              <p className="text-xs leading-relaxed text-textSecondary">
                {score === questions.length 
                  ? "Amazing! Perfect score. Aapki prep ekdum standard sysadmin track par hai. Keep it up!"
                  : score >= 3
                  ? "Good effort! Practice test clear hai but explanation check karke gaps cover karein."
                  : "Dobara try karein. Kuch core concepts (subnet routing/group policies) par revision zaroori hai."}
              </p>

              <button
                onClick={() => handleStartQuiz()}
                className="flex items-center gap-1.5 bg-sidebarBg hover:bg-gray-900 border border-gray-850 text-textPrimary text-xs font-bold py-2.5 px-6 rounded-lg transition-colors mx-auto"
              >
                <RotateCcw size={14} /> Re-Take Test
              </button>
            </div>
          )}

          {/* Landing State when empty */}
          {!loading && questions.length === 0 && (
            <div className="bg-cardBg border border-gray-800 rounded-xl p-16 text-center max-w-lg mx-auto">
              <Clipboard className="mx-auto text-textMuted mb-4 opacity-40" size={44} />
              <h3 className="text-lg font-bold text-textPrimary">No Active Quiz Session</h3>
              <p className="text-textMuted text-xs mt-1.5 leading-relaxed">
                Select a target certification from the top dropdown (e.g. CCNA for networking, AZ-104 for Azure) and click **"Start Mock Test"** to generate 5 real exam practice questions.
              </p>
            </div>
          )}
        </>
      )}

      {/* Weak Topics Tab */}
      {activePracticeTab === 'weakness' && renderWeakTopics()}
    </div>
  );
}
