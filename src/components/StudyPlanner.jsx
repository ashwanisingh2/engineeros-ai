import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, BookOpen, Check, Loader, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { callAIService } from '../utils/aiService';
import { COURSES_SYLLABUS_DATA } from '../data/coursesSyllabusData';

const EXAMS = [
  "CCNA 200-301",
  "AZ-900 Azure Fundamentals",
  "AZ-104 Azure Administrator",
  "RHCSA Linux",
  "MS-102 Microsoft 365 Admin"
];

const EXAM_COURSE_MAP = {
  "CCNA 200-301": 2,
  "AZ-900 Azure Fundamentals": 8,
  "AZ-104 Azure Administrator": 9,
  "RHCSA Linux": 4,
  "MS-102 Microsoft 365 Admin": 7
};

export default function StudyPlanner({ settings, onLinkToLesson }) {
  const [targetExam, setTargetExam] = useState("CCNA 200-301");
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState(3);
  const [loading, setLoading] = useState(false);
  
  // Study plan state
  const [plan, setPlan] = useState(null);
  const [completedDays, setCompletedDays] = useState({}); // { globalDayNumber: boolean }

  // Load plan from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('engineeros_study_plan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlan(parsed.plan || null);
        setCompletedDays(parsed.completedDays || {});
        if (parsed.targetExam) setTargetExam(parsed.targetExam);
        if (parsed.examDate) setExamDate(parsed.examDate);
        if (parsed.dailyHours) setDailyHours(parsed.dailyHours);
      } catch (e) {
        console.error("Failed to parse cached study plan", e);
      }
    }
  }, []);

  // Save plan to localStorage on changes
  const savePlanToStorage = (newPlan, newCompleted) => {
    const data = {
      plan: newPlan,
      completedDays: newCompleted,
      targetExam,
      examDate,
      dailyHours
    };
    localStorage.setItem('engineeros_study_plan', JSON.stringify(data));
  };

  const getDaysUntilExam = () => {
    if (!examDate) return null;
    const target = new Date(examDate);
    const today = new Date();
    target.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!examDate) {
      alert("Please select your target exam date.");
      return;
    }

    const daysLeft = getDaysUntilExam();
    if (daysLeft <= 0) {
      alert("Exam date must be in the future!");
      return;
    }

    if (!settings?.apiKey) {
      alert("API Key missing! Settings page par model key set karein.");
      return;
    }

    setLoading(true);
    try {
      const courseId = EXAM_COURSE_MAP[targetExam];
      const syllabus = COURSES_SYLLABUS_DATA[courseId] || [];
      const lessonList = syllabus.map(l => ({ id: l.id, name: l.name }));

      const promptText = `Create a highly structured week-by-week study plan for the certification exam: "${targetExam}".
      There are exactly ${daysLeft} days until the exam. The student can commit ${dailyHours} hours daily.
      
      We have a list of technical lessons that MUST be covered:
      ${JSON.stringify(lessonList)}

      Group the study plan into consecutive weeks. For each day, map the study topic to one of the lesson IDs from the list above.
      - If there are more days remaining than lessons, add dedicated "Revision & Practice" or "Lab Simulation" days (use lessonId: null).
      - If there are fewer days, pack multiple topics or prioritize key lessons.
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "weeks": [
          {
            "weekNumber": 1,
            "focus": "General focus area (e.g. Subnetting & IP Routing)",
            "days": [
              { "dayNumber": 1, "topicName": "Topic Name", "lessonId": "02.01" }
            ]
          }
        ]
      }`;

      const aiResponse = await callAIService({
        systemPrompt: "You are an expert technical study planner and curriculum architect. Output raw JSON objects only.",
        prompt: promptText
      });

      const cleaned = aiResponse.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsedPlan = JSON.parse(cleaned);

      setPlan(parsedPlan);
      const initialCompleted = {};
      setCompletedDays(initialCompleted);
      savePlanToStorage(parsedPlan, initialCompleted);
    } catch (err) {
      console.error(err);
      alert(`Study plan generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleDayCompleted = (globalDayNum) => {
    const updated = { ...completedDays, [globalDayNum]: !completedDays[globalDayNum] };
    setCompletedDays(updated);
    savePlanToStorage(plan, updated);
  };

  const handleClearPlan = () => {
    if (window.confirm("Are you sure you want to clear your current study plan?")) {
      setPlan(null);
      setCompletedDays({});
      localStorage.removeItem('engineeros_study_plan');
    }
  };

  // Process today's day highlight
  let todayDayNumber = 1;
  let foundToday = false;
  let globalDayCounter = 1;
  if (plan && plan.weeks) {
    plan.weeks.forEach(w => {
      w.days.forEach(d => {
        d.globalDayNumber = globalDayCounter;
        if (!completedDays[globalDayCounter] && !foundToday) {
          todayDayNumber = globalDayCounter;
          foundToday = true;
        }
        globalDayCounter++;
      });
    });
  }

  const daysUntil = getDaysUntilExam();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header with Countdown */}
      <div className="border-b border-gray-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            📅 AI Study Planner
          </h1>
          <p className="text-textMuted mt-1">Generate a custom timeline-based syllabus study guide to ace your certification targets.</p>
        </div>

        {examDate && daysUntil !== null && (
          <div className="bg-primaryAccent/10 border border-primaryAccent/20 px-4 py-2.5 rounded-xl shrink-0">
            <span className="text-[10px] text-textMuted uppercase font-bold tracking-wider block">Target Timeline</span>
            <span className="text-sm font-bold text-primaryAccent font-mono mt-0.5 block">
              {daysUntil > 0 
                ? `⏳ ${daysUntil} Days until exam!` 
                : daysUntil === 0 
                ? "🔥 Exam is TODAY! Good luck!" 
                : `🏁 Exam was ${Math.abs(daysUntil)} days ago.`}
            </span>
          </div>
        )}
      </div>

      {!plan ? (
        /* Form landing state */
        <div className="bg-cardBg border border-gray-800 rounded-xl p-8 max-w-xl mx-auto">
          <h3 className="text-base font-bold text-textPrimary mb-4">Set Your Study Goals</h3>
          <form onSubmit={handleGeneratePlan} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                Target Certification Exam
              </label>
              <select
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-xs font-semibold text-textPrimary focus:outline-none focus:border-primaryAccent"
              >
                {EXAMS.map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                  Target Exam Date
                </label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-4 text-xs font-semibold text-textPrimary focus:outline-none focus:border-primaryAccent font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 flex justify-between">
                  <span>Daily Study Hours</span>
                  <span className="text-primaryAccent font-mono">{dailyHours} hrs</span>
                </label>
                <div className="flex items-center gap-3 py-2">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseInt(e.target.value))}
                    className="flex-1 accent-primaryAccent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Generating Week-by-Week Calendar...
                </>
              ) : (
                <>
                  <CalendarIcon size={14} />
                  Generate AI Study Plan
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Planner Grid View */
        <div className="space-y-8 animate-fadeIn">
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-cardBg border border-gray-800 rounded-xl p-4">
            <div className="text-xs">
              <span className="text-textMuted">Certification Exam:</span>
              <strong className="text-textPrimary ml-1.5">{targetExam}</strong>
            </div>
            <button
              onClick={handleClearPlan}
              className="text-[10px] bg-red-950/40 border border-red-900 text-red-400 font-bold px-3 py-1.5 rounded transition-all hover:bg-red-900/60"
            >
              Clear Current Plan
            </button>
          </div>

          {/* Week-by-Week layout */}
          <div className="space-y-8">
            {plan.weeks.map(week => (
              <div key={week.weekNumber} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-850 pb-2">
                  <h3 className="text-xs font-bold text-primaryAccent uppercase tracking-widest font-mono">
                    Week {week.weekNumber}
                  </h3>
                  <span className="text-xs text-textMuted">—</span>
                  <span className="text-xs font-medium text-textSecondary">{week.focus}</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {week.days.map(day => {
                    const isCompleted = !!completedDays[day.globalDayNumber];
                    const isToday = day.globalDayNumber === todayDayNumber;
                    const isFuture = day.globalDayNumber > todayDayNumber;

                    let cellStyle = "bg-sidebarBg/30 border-gray-850 text-textMuted opacity-60 hover:opacity-85";
                    if (isCompleted) {
                      cellStyle = "bg-successGreen/10 border-successGreen/30 text-successGreen hover:border-successGreen/50";
                    } else if (isToday) {
                      cellStyle = "border-primaryAccent bg-primaryAccent/10 text-primaryAccent ring-2 ring-primaryAccent/20 font-bold";
                    }

                    return (
                      <div
                        key={day.dayNumber}
                        className={`border rounded-xl p-3.5 flex flex-col justify-between min-h-[120px] transition-all select-none relative ${cellStyle}`}
                      >
                        {/* Day indicator & checkbox */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-wider font-mono font-bold">
                            Day {day.dayNumber}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => toggleDayCompleted(day.globalDayNumber)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isCompleted 
                                ? 'bg-successGreen border-successGreen text-white' 
                                : 'border-gray-700 hover:border-gray-500 bg-black/20'
                            }`}
                          >
                            {isCompleted && <Check size={10} />}
                          </button>
                        </div>

                        {/* Lesson Topic */}
                        <div className="text-[11px] leading-relaxed font-semibold mb-3">
                          {day.topicName}
                        </div>

                        {/* Link to Course Roadmap */}
                        {day.lessonId ? (
                          <button
                            onClick={() => onLinkToLesson(EXAM_COURSE_MAP[targetExam], day.lessonId)}
                            className="text-[9px] font-bold text-primaryAccent hover:underline text-left mt-auto flex items-center gap-0.5"
                          >
                            Study Lesson ({day.lessonId}) <ArrowRight size={8} />
                          </button>
                        ) : (
                          <span className="text-[9px] italic text-textMuted mt-auto">Self study</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
