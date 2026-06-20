import React, { useState, useEffect } from 'react';
import { Award, Flame, Play, Clock, BookOpen, Terminal, ClipboardList, ArrowRight, ShieldAlert, Cpu, Sparkles, Check } from 'lucide-react';

export default function Dashboard({ settings, courses, streak, onNavigateTab, onLinkToLesson }) {
  const [stats, setStats] = useState({
    streak: 0,
    lessonsDone: 0,
    examsAttempted: 0,
    kbCards: 0
  });

  const [lastLesson, setLastLesson] = useState(null);
  const [weakTopic, setWeakTopic] = useState(null);
  const [activities, setActivities] = useState([]);
  const [challengeStatus, setChallengeStatus] = useState('Pending');

  useEffect(() => {
    // 1. Streak
    const savedStreak = streak || 0;

    // 2. Completed Lessons
    const savedProgress = JSON.parse(localStorage.getItem('engineeros_progress') || '{}');
    const lessonsCount = Object.keys(savedProgress).filter(k => savedProgress[k]).length;

    // 3. Exams Attempted
    const savedExams = parseInt(localStorage.getItem('engineeros_exams_attempted') || '0');

    // 4. KB Cards
    const savedKB = JSON.parse(localStorage.getItem('engineeros_knowledge') || '[]');
    const kbCount = savedKB.length;

    setStats({
      streak: savedStreak,
      lessonsDone: lessonsCount,
      examsAttempted: savedExams,
      kbCards: kbCount
    });

    // Continue Lesson
    const savedLast = localStorage.getItem('engineeros_last_lesson');
    if (savedLast) {
      setLastLesson(JSON.parse(savedLast));
    }

    // Weak Topic
    const savedMistakes = JSON.parse(localStorage.getItem('engineeros_mistakes') || '[]');
    if (savedMistakes.length > 0) {
      const counts = {};
      savedMistakes.forEach(m => {
        const t = m.topic || "General";
        counts[t] = (counts[t] || 0) + 1;
      });
      const topWeak = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (topWeak) {
        setWeakTopic({ topic: topWeak[0], count: topWeak[1] });
      }
    }

    // Activities
    const savedActivities = JSON.parse(localStorage.getItem('engineeros_activities') || '[]');
    setActivities(savedActivities);

    // Challenge Status
    const today = new Date().toDateString();
    const challengeDate = localStorage.getItem('engineeros_challenge_date');
    const challengeEval = localStorage.getItem('engineeros_challenge_eval');
    if (challengeDate === today && challengeEval) {
      setChallengeStatus('Completed');
    } else {
      setChallengeStatus('Pending');
    }
  }, [streak]);

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
          🏠 Welcome back, Engineer!
        </h1>
        <p className="text-textMuted mt-1">
          Here is your systems engineering study dashboard. Keep practicing lab guides and building streaks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Daily Streak", value: `${stats.streak} Days`, icon: Flame, color: "text-amber-500 bg-amber-500/10 border-amber-500/25" },
          { label: "Lessons Completed", value: stats.lessonsDone, icon: BookOpen, color: "text-primaryAccent bg-primaryAccent/10 border-primaryAccent/25" },
          { label: "Exams Attempted", value: stats.examsAttempted, icon: ClipboardList, color: "text-successGreen bg-successGreen/10 border-successGreen/25" },
          { label: "Knowledge Cards", value: stats.kbCards, icon: Terminal, color: "text-pink-500 bg-pink-500/10 border-pink-500/25" }
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className={`border rounded-xl p-5 bg-cardBg flex items-center justify-between hover:border-gray-700 transition-colors`}>
              <div className="space-y-1">
                <span className="text-[10px] text-textMuted uppercase font-bold tracking-wider block">{s.label}</span>
                <span className="text-xl font-bold text-textPrimary font-mono block">{s.value}</span>
              </div>
              <div className={`p-3 rounded-lg border ${s.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Continue, Weakness, Focus */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Card */}
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 hover:border-gray-750 transition-colors">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-3">Continue Study</h3>
            {lastLesson ? (
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-primaryAccent font-bold uppercase tracking-wider font-mono">
                    {lastLesson.courseName}
                  </span>
                  <h4 className="text-base font-bold text-textPrimary leading-tight">{lastLesson.lessonName}</h4>
                  <p className="text-[11px] text-textMuted">Pick up exactly where you paused in the syllabus exercises.</p>
                </div>
                <button
                  onClick={() => onLinkToLesson(lastLesson.courseId, lastLesson.lessonId)}
                  className="bg-primaryAccent hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  Continue Lesson <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="text-center py-4 text-textMuted text-xs">
                No history found. Click **Syllabus Roadmap** from the sidebar to open your first lesson.
              </div>
            )}
          </div>

          {/* Today's Focus */}
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider border-b border-gray-850 pb-2">
              🎯 Today's Focus Areas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Challenge Status */}
              <div className="border border-gray-850 rounded-lg p-4 bg-sidebarBg/25 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-textMuted uppercase block">Daily Tech Challenge</span>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className={`w-2 h-2 rounded-full ${challengeStatus === 'Completed' ? 'bg-successGreen' : 'bg-amber-400'}`} />
                    <span className="text-xs font-bold text-textPrimary">{challengeStatus}</span>
                  </div>
                  <p className="text-[11px] text-textMuted leading-relaxed">
                    Resolve today's random administrative scenario to update your daily consistency streak.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('challenge')}
                  className="text-left text-xs font-bold text-primaryAccent hover:underline mt-4 flex items-center gap-0.5"
                >
                  Start Challenge <ArrowRight size={12} />
                </button>
              </div>

              {/* Weak Topic revision */}
              <div className="border border-gray-850 rounded-lg p-4 bg-sidebarBg/25 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-textMuted uppercase block">Target Revision Area</span>
                  <div className="flex items-center gap-1.5 mt-1 mb-2">
                    <ShieldAlert size={14} className="text-red-400" />
                    <span className="text-xs font-bold text-textPrimary truncate max-w-[160px]">
                      {weakTopic ? weakTopic.topic : "No weak topics yet"}
                    </span>
                  </div>
                  <p className="text-[11px] text-textMuted leading-relaxed">
                    {weakTopic 
                      ? `You made ${weakTopic.count} errors in this subtopic. Practice custom MCQs to audit concept gaps.`
                      : "Excellent record! Practice mock tests to verify technical configuration understanding."}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('quizzes')}
                  className="text-left text-xs font-bold text-primaryAccent hover:underline mt-4 flex items-center gap-0.5"
                >
                  Practice Weak Topics <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Course Progress Bars */}
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider border-b border-gray-850 pb-2">
              📊 Course Syllabus Progress
            </h3>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {courses.map(course => {
                const percent = Math.round(((course.completedModules || 0) / course.totalModules) * 100);
                return (
                  <div key={course.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-textPrimary truncate max-w-[280px]">
                        {course.icon} {course.name}
                      </span>
                      <span className="font-mono font-bold text-textMuted">{percent}%</span>
                    </div>
                    <div className="w-full bg-sidebarBg h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primaryAccent h-full transition-all duration-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Activities, Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Quick Navigation</h3>
            <button
              onClick={() => onNavigateTab('challenge')}
              className="w-full flex items-center justify-between bg-primaryAccent hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-colors"
            >
              <span>Start Daily Challenge</span>
              <Play size={12} />
            </button>
            <button
              onClick={() => onNavigateTab('quizzes')}
              className="w-full flex items-center justify-between bg-sidebarBg hover:bg-gray-900 border border-gray-800 text-textPrimary font-bold py-2.5 px-4 rounded-lg text-xs transition-colors"
            >
              <span>Practice Exams</span>
              <ClipboardList size={12} />
            </button>
            <button
              onClick={() => onNavigateTab('chat')}
              className="w-full flex items-center justify-between bg-sidebarBg hover:bg-gray-900 border border-gray-800 text-textPrimary font-bold py-2.5 px-4 rounded-lg text-xs transition-colors"
            >
              <span>Consult AI Copilot</span>
              <Terminal size={12} />
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider border-b border-gray-850 pb-2">
              🕒 Recent Activities
            </h3>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-2.5 items-start text-xs border-b border-gray-850/30 pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5 shrink-0 text-primaryAccent">
                      {act.action === "Lesson Completed" && <Check size={14} className="text-successGreen" />}
                      {act.action === "Exam Attempted" && <ClipboardList size={14} className="text-indigo-400" />}
                      {act.action === "Ticket Solved" && <Award size={14} className="text-amber-500" />}
                    </div>
                    <div className="space-y-1">
                      <strong className="text-textPrimary block font-bold">{act.action}</strong>
                      <p className="text-[10px] text-textSecondary leading-normal">{act.details}</p>
                      <span className="text-[9px] text-textMuted block font-mono font-medium">{formatDate(act.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-textMuted text-xs leading-normal">
                No recent activity logged yet. Solve tickets, practice quizzes, and complete lessons to populate logs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
