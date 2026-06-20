import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, ChevronRight, Check, Loader, AlertCircle, Mic } from 'lucide-react';
import { callAIService } from '../utils/aiService';
import { COURSES_SYLLABUS_DATA } from '../data/coursesSyllabusData';
import VoiceExplainer from './VoiceExplainer';

const STUDY_GUIDE_PHASES = [
  "Overview & Architecture",
  "Installation & Configuration",
  "Administration & Monitoring",
  "Troubleshooting & Diagnostics",
  "Real-World Industry Tasks",
  "Practical Hands-On Lab",
  "Cheat Sheet (Commands & Paths)"
];

export default function CourseRoadmap({ courses, settings, onUpdateCourse, linkCourseId, linkLessonId, onClearLink }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [lessonSubTab, setLessonSubTab] = useState('explainer'); // 'explainer', 'problem', 'solution', 'guide'
  const [generating, setGenerating] = useState(false);
  const [guideGenerating, setGuideGenerating] = useState(false);
  const [guidePhaseIndex, setGuidePhaseIndex] = useState(0);
  const [guideError, setGuideError] = useState(null);
  const [showVoiceExplainer, setShowVoiceExplainer] = useState(false);
  const [dailyHours, setDailyHours] = useState(() => {
    const planSaved = localStorage.getItem('engineeros_study_plan');
    if (planSaved) {
      try {
        const parsed = JSON.parse(planSaved);
        if (parsed.dailyHours) return parseInt(parsed.dailyHours);
      } catch (e) {}
    }
    return 3;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // Handle external link navigation from Study Planner
  useEffect(() => {
    if (linkCourseId !== undefined && linkCourseId !== null) {
      setSelectedCourseId(linkCourseId);
    }
    if (linkLessonId !== undefined && linkLessonId !== null) {
      setActiveLessonId(linkLessonId);
      setLessonSubTab('explainer');
    }
    if ((linkCourseId || linkLessonId) && onClearLink) {
      onClearLink();
    }
  }, [linkCourseId, linkLessonId, onClearLink]);
  // Track last opened lesson for the Dashboard continue card
  useEffect(() => {
    if (activeLessonId && selectedCourseId) {
      const course = courses.find(c => c.id === selectedCourseId);
      if (course) {
        const syllabus = getCourseSyllabus(course);
        const lesson = syllabus.find(l => l.id === activeLessonId);
        if (lesson) {
          localStorage.setItem('engineeros_last_lesson', JSON.stringify({
            courseId: selectedCourseId,
            courseName: course.name,
            lessonId: activeLessonId,
            lessonName: lesson.name
          }));
        }
      }
    }
  }, [activeLessonId, selectedCourseId, courses]);

  // AI Generated / cached study guides (13 phases) in localStorage
  const [cachedGuides, setCachedGuides] = useState(() => {
    const saved = localStorage.getItem('engineeros_cached_guides');
    return saved ? JSON.parse(saved) : {};
  });

  // AI Generated / cached syllabi in localStorage
  const [cachedSyllabi, setCachedSyllabi] = useState(() => {
    const saved = localStorage.getItem('engineeros_cached_syllabi');
    return saved ? JSON.parse(saved) : {};
  });

  // Completed/checked lessons progress saved in localStorage key "engineeros_progress"
  const [checkedLessons, setCheckedLessons] = useState(() => {
    const saved = localStorage.getItem('engineeros_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // On component mount, load from localStorage and restore checked state
  useEffect(() => {
    const saved = localStorage.getItem('engineeros_progress');
    if (saved) {
      setCheckedLessons(JSON.parse(saved));
    }
  }, []);

  // Cache check on open: load cached guides from localStorage instantly when lesson changes
  useEffect(() => {
    const saved = localStorage.getItem('engineeros_cached_guides');
    if (saved) {
      setCachedGuides(JSON.parse(saved));
    }
  }, [activeLessonId]);

  // Save checkedLessons on modification
  useEffect(() => {
    localStorage.setItem('engineeros_progress', JSON.stringify(checkedLessons));
  }, [checkedLessons]);

  // Sync and recalculate completion percentages for all courses immediately
  useEffect(() => {
    courses.forEach(course => {
      const syllabus = getCourseSyllabus(course);
      if (syllabus.length > 0) {
        const completedCount = syllabus.filter(l => checkedLessons[`${course.id}_${l.id}`]).length;
        let status = 'In Progress';
        if (completedCount === 0) status = 'Not Started';
        else if (completedCount === syllabus.length) status = 'Completed';

        if (course.completedModules !== completedCount || course.status !== status) {
          onUpdateCourse(course.id, { completedModules: completedCount, status });
        }
      }
    });
  }, [checkedLessons]);

  const handleGenerateStudyGuide = async (course, lesson) => {
    if (!settings.apiKey) {
      alert("API Key missing! Settings page par model key configure karein.");
      return;
    }
    
    // Clear old cache for this lesson if re-fetching/regenerating
    setCachedGuides(prev => {
      const updated = { ...prev };
      delete updated[`${course.id}_${lesson.id}`];
      localStorage.setItem('engineeros_cached_guides', JSON.stringify(updated));
      return updated;
    });

    setGuideError(null);
    setGuideGenerating(true);
    setGuidePhaseIndex(0);

    // Set up phase simulation timer
    const progressInterval = setInterval(() => {
      setGuidePhaseIndex(prev => {
        if (prev < 6) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const promptText = `Generate a COMPLETE, ENTERPRISE-GRADE study guide and reference manual for the IT topic: "${lesson.name}" (from the course "${course.name}").
      
      You must act as a Senior IT Infrastructure Architect and provide a highly detailed, professional, and click-by-click instruction guide. DO NOT output brief summaries or placeholders. Cover all of the following 7 sections in detail:
      
      1. **Overview & Architecture**: Detailed explanation, purpose, design diagram layout descriptions, and core component workflows.
      2. **Installation & Configuration**: Exact prerequisites, step-by-step install scripts, config parameters, and deployment commands.
      3. **Administration & Monitoring**: Routine sysadmin tasks, system health checks, log paths, and core management interfaces.
      4. **Troubleshooting & Diagnostics**: Structured database table of common issues, error codes, log files to check, diagnostic commands, and recovery procedures.
      5. **Real-World Industry Tasks**: Action items categorized by support levels (L1 Ticket Resolution, L2 Administration, L3 Architecting/Engineering).
      6. **Practical Hands-On Lab**: Fully-detailed walkthrough of a lab exercise including setup instructions, task checklist, and verification steps.
      7. **Cheat Sheet (Commands & Paths)**: Markdown table of critical CLI commands, config file directories, and registry/config keys.

      Use clean markdown formatting, alert blocks, and code tags where appropriate. Do not output introductory text, start directly with the title and content.`;

      const responseText = await callAIService({
        systemPrompt: "You are an expert IT trainer and senior systems architect. You write exhaustive, highly detailed technical guides without placeholders.",
        prompt: promptText
      });

      clearInterval(progressInterval);

      if (!responseText || responseText.trim().length < 100) {
        throw new Error("AI Service returned an empty or malformed guide. Please verify your settings and try again.");
      }

      setCachedGuides(prev => {
        const updated = { ...prev, [`${course.id}_${lesson.id}`]: responseText };
        localStorage.setItem('engineeros_cached_guides', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      setGuideError(err.message || "Failed to generate study guide. Please verify your API settings.");
    } finally {
      setGuideGenerating(false);
    }
  };

  // Sync active lesson selection
  useEffect(() => {
    setLessonSubTab('explainer');
    setGuideError(null);
  }, [activeLessonId]);

  const getCourseSyllabus = (course) => {
    // 1. Check if we have it in AI cached syllabi
    if (cachedSyllabi[course.id]) {
      return cachedSyllabi[course.id];
    }
    
    // 2. Check if we have it in custom COURSES_SYLLABUS_DATA static list
    const customList = COURSES_SYLLABUS_DATA[course.id];
    if (customList) {
      return customList;
    }

    // 3. Return empty array to prompt AI Generation if not found
    return [];
  };

  const handleGenerateSyllabus = async (course) => {
    if (!settings.apiKey) {
      alert("API Key missing! Settings page par model key configure karein.");
      return;
    }
    setGenerating(true);
    try {
      const promptText = `Generate a detailed, professional, and comprehensive IT course syllabus and study guide for the course: "${course.name}".
      Create exactly ${course.totalModules} lessons matching this course topic.
      Each lesson must be structured in the Matt Pocock 'scaffold-exercises' style (numeric code prefix like XX.YY, dash-case titles).
      Each lesson MUST contain:
      1. A detailed 'explainer' study guide explaining the theoretical concepts, commands, configurations, and core guidelines in clear Hinglish/English.
      2. A 'problem' challenge question or real-world troubleshooting exercise scenario.
      3. A 'solution' explaining the exact resolution steps, commands, or answers to check the user's work.
      
      Respond ONLY with a valid JSON array. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON array matching this format:
      [
        {
          "id": "01.01",
          "title": "01.01-topic-name-in-dash-case",
          "name": "Topic Name in Title Case",
          "explainer": "Detailed study guide and theoretical explanation...",
          "problem": "Hands-on troubleshooting scenario or challenge question...",
          "solution": "Step-by-step verification commands or answers..."
        }
      ]`;

      const responseText = await callAIService({
        systemPrompt: "You are a professional IT curriculum designer and subject matter expert. Output raw JSON arrays only.",
        prompt: promptText
      });

      const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      setCachedSyllabi(prev => {
        const updated = { ...prev, [course.id]: parsed };
        localStorage.setItem('engineeros_cached_syllabi', JSON.stringify(updated));
        return updated;
      });
      
      // Auto-set first active lesson
      if (parsed && parsed.length > 0) {
        setActiveLessonId(parsed[0].id);
      }
    } catch (err) {
      console.error(err);
      alert(`Syllabus generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = (courseId, status) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const total = course.totalModules || 10;
    let completed = course.completedModules;
    if (status === 'Completed') {
      completed = total;
      const syllabus = getCourseSyllabus(course);
      const updated = { ...checkedLessons };
      syllabus.forEach(lesson => {
        updated[`${courseId}_${lesson.id}`] = true;
      });
      setCheckedLessons(updated);
    } else if (status === 'Not Started') {
      completed = 0;
      const syllabus = getCourseSyllabus(course);
      const updated = { ...checkedLessons };
      syllabus.forEach(lesson => {
        delete updated[`${courseId}_${lesson.id}`];
      });
      setCheckedLessons(updated);
    }

    onUpdateCourse(courseId, { status, completedModules: completed });
  };

  const handleResetCourseProgress = (course) => {
    if (window.confirm(`Are you sure you want to reset all progress for the course "${course.name}"?`)) {
      const updated = { ...checkedLessons };
      const syllabus = getCourseSyllabus(course);
      syllabus.forEach(lesson => {
        delete updated[`${course.id}_${lesson.id}`];
      });
      setCheckedLessons(updated);
      onUpdateCourse(course.id, { completedModules: 0, status: 'Not Started' });
    }
  };

  const handleHoursChange = (courseId, hours) => {
    const hoursVal = Math.max(0, parseInt(hours) || 0);
    onUpdateCourse(courseId, { hoursRemaining: hoursVal });
  };

  const handleDailyHoursChange = (hours) => {
    const val = parseInt(hours) || 1;
    setDailyHours(val);
    const planSaved = localStorage.getItem('engineeros_study_plan');
    let parsed = {};
    if (planSaved) {
      try {
        parsed = JSON.parse(planSaved);
      } catch (e) {}
    }
    parsed.dailyHours = val;
    localStorage.setItem('engineeros_study_plan', JSON.stringify(parsed));
  };

  const handleResetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset ALL certification progress? This will delete all completed lessons record!")) {
      setCheckedLessons({});
      courses.forEach(course => {
        onUpdateCourse(course.id, { completedModules: 0, status: 'Not Started' });
      });
      localStorage.removeItem('engineeros_last_lesson');
      alert("All progress reset successfully.");
    }
  };

  const toggleLesson = (course, lessonId) => {
    const key = `${course.id}_${lessonId}`;
    const newCompleted = { ...checkedLessons, [key]: !checkedLessons[key] };
    setCheckedLessons(newCompleted);

    const syllabus = getCourseSyllabus(course);
    const completedCount = syllabus.filter(l => newCompleted[`${course.id}_${l.id}`]).length;

    let status = 'In Progress';
    if (completedCount === 0) status = 'Not Started';
    else if (completedCount === syllabus.length) status = 'Completed';

    onUpdateCourse(course.id, { completedModules: completedCount, status });

    // Log to recent activities if the lesson was completed (checked)
    if (newCompleted[key]) {
      const activities = JSON.parse(localStorage.getItem('engineeros_activities') || '[]');
      const lessonName = syllabus.find(l => l.id === lessonId)?.name || lessonId;
      activities.unshift({
        id: Date.now().toString(),
        action: "Lesson Completed",
        details: `${course.name}: ${lessonName}`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('engineeros_activities', JSON.stringify(activities.slice(0, 5)));
    }
  };

  // Grouping courses by Role Level with query and status filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const roles = {
    "L1 Support / Helpdesk": filteredCourses.filter(c => c.role === 'L1'),
    "L2 Systems Administrator": filteredCourses.filter(c => c.role === 'L2' || c.role === 'L2-L3'),
    "L3 Multi-Cloud Systems Engineer": filteredCourses.filter(c => c.role === 'L3')
  };

  const totalHoursRemaining = courses.reduce((sum, c) => {
    if (c.status === 'Completed') return sum;
    const hours = c.hoursRemaining !== undefined ? c.hoursRemaining : 10;
    return sum + hours;
  }, 0);

  const totalLessons = courses.reduce((sum, c) => sum + (c.totalModules || 10), 0);
  const completedLessonsCount = courses.reduce((sum, c) => sum + (c.completedModules || 0), 0);
  const overallPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const estimatedDaysToComplete = dailyHours > 0 ? Math.ceil(totalHoursRemaining / dailyHours) : 0;

  const getEstimatedCompletionDate = () => {
    if (estimatedDaysToComplete === 0) return "Completed!";
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + estimatedDaysToComplete);
    return targetDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getActiveLesson = (courseId) => {
    if (!activeLessonId) return null;
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;
    const syllabus = getCourseSyllabus(course);
    return syllabus.find(l => l.id === activeLessonId) || null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            📖 ICNT Academy Course Roadmap
          </h1>
          <p className="text-textMuted mt-1">Track your syllabus progress across all 16 certification modules and estimate completion timelines.</p>
        </div>
      </div>

      {/* Timeline & Estimation Banner */}
      <div className="bg-cardBg border border-gray-800 rounded-2xl p-6 mb-8 space-y-6 shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primaryAccent/5 rounded-full blur-3xl -z-10" />

        <div className="flex items-center justify-between border-b border-gray-850 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primaryAccent" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary">📈 Completion Timeline Estimator</h2>
          </div>
          <button
            onClick={handleResetAllProgress}
            className="text-[9px] bg-red-950/20 border border-red-900/40 hover:bg-red-900/40 text-red-400 font-bold px-2.5 py-1 rounded transition-all"
          >
            ⚠️ Reset All Progress
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Hours Remaining */}
          <div className="bg-darkBg/50 border border-gray-850 p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Total Hours Left</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-bold text-textPrimary">{totalHoursRemaining}</span>
              <span className="text-xs text-textMuted font-medium">Hours</span>
            </div>
            <span className="text-[9px] text-textMuted mt-1 block">Sum of all non-completed courses</span>
          </div>

          {/* Daily Study Hours Slider */}
          <div className="bg-darkBg/50 border border-gray-850 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Study Rate / Day</span>
              <span className="text-xs font-mono font-bold text-primaryAccent bg-primaryAccent/10 px-1.5 py-0.5 rounded">{dailyHours}h</span>
            </div>
            <div className="mt-3">
              <input
                type="range"
                min="1"
                max="8"
                value={dailyHours}
                onChange={(e) => handleDailyHoursChange(e.target.value)}
                className="w-full h-1.5 bg-sidebarBg rounded-lg appearance-none cursor-pointer accent-primaryAccent"
              />
            </div>
            <div className="flex justify-between text-[8px] text-textMuted font-bold uppercase font-mono mt-1">
              <span>1h</span>
              <span>4h</span>
              <span>8h</span>
            </div>
          </div>

          {/* Estimated Completion Date */}
          <div className="bg-darkBg/50 border border-gray-850 p-4 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">Estimated Target</span>
            <div className="mt-2 text-sm font-bold text-successGreen truncate">
              {getEstimatedCompletionDate()}
            </div>
            <span className="text-[9px] text-textMuted mt-1 block">
              {estimatedDaysToComplete > 0 ? `~${estimatedDaysToComplete} days of daily study` : 'All done!'}
            </span>
          </div>

          {/* Overall Lessons Progress */}
          <div className="bg-darkBg/50 border border-gray-850 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] font-bold text-textMuted uppercase tracking-wider">
              <span>Overall Progress</span>
              <span className="font-mono text-textPrimary">{overallPercent}%</span>
            </div>
            <div className="w-full bg-sidebarBg h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-successGreen h-full transition-all duration-500 rounded-full"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <span className="text-[9px] text-textMuted mt-1 block">
              {completedLessonsCount} / {totalLessons} Lessons Done
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-cardBg border border-gray-800 p-4 rounded-xl mb-6">
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search certification courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-darkBg border border-gray-850 text-xs text-textPrimary px-3 py-2 rounded-lg focus:outline-none focus:border-primaryAccent pl-8"
          />
          <span className="absolute left-2.5 top-2.5 text-textMuted text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-textMuted shrink-0">Filter:</span>
          {['All', 'Not Started', 'In Progress', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all shrink-0 ${
                statusFilter === status
                  ? 'bg-primaryAccent text-white border-primaryAccent'
                  : 'bg-sidebarBg text-textMuted border-gray-800 hover:text-textPrimary hover:bg-gray-800/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Role Tracks */}
      <div className="space-y-10">
        {Object.entries(roles).map(([roleTitle, roleCourses]) => (
          <div key={roleTitle} className="space-y-4">
            <h2 className="text-lg font-bold text-primaryAccent flex items-center gap-2 uppercase tracking-wider pl-1">
              <Award size={18} />
              {roleTitle}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {roleCourses.map(course => {
                const percent = Math.round(((course.completedModules || 0) / course.totalModules) * 100);
                const isExpanded = selectedCourseId === course.id;
                const syllabus = getCourseSyllabus(course);
                const activeLesson = getActiveLesson(course.id);

                return (
                  <div key={course.id} className="bg-cardBg border border-gray-800 rounded-xl p-5 hover:border-gray-750 transition-all flex flex-col justify-between">
                    <div>
                      {/* Top Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" role="img" aria-label={course.name}>
                            {course.icon}
                          </span>
                          <span className="text-xs text-textMuted font-mono uppercase font-bold tracking-wider">
                            ID: {course.id < 10 ? `0${course.id}` : course.id}
                          </span>
                        </div>
                        <select
                          value={course.status || 'Not Started'}
                          onChange={(e) => handleStatusChange(course.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded border focus:outline-none ${
                            course.status === 'Completed'
                              ? 'bg-successGreen/15 border-successGreen/30 text-successGreen'
                              : course.status === 'In Progress'
                              ? 'bg-primaryAccent/15 border-primaryAccent/30 text-primaryAccent'
                              : 'bg-sidebarBg border-gray-800 text-textMuted'
                          }`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <h3 className="text-base font-bold text-textPrimary leading-tight mb-2">{course.name}</h3>
                      
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="text-xs font-mono font-bold text-textSecondary">
                          {course.completedModules || 0}/{course.totalModules} Lessons Completed
                        </span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResetCourseProgress(course)}
                            className="text-[10px] bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 px-3 py-1 rounded text-red-400 font-bold transition-all"
                          >
                            Reset Progress
                          </button>
                          <button
                            onClick={() => {
                              if (isExpanded) {
                                setSelectedCourseId(null);
                                setActiveLessonId(null);
                              } else {
                                setSelectedCourseId(course.id);
                                const courseSyllabus = getCourseSyllabus(course);
                                setActiveLessonId(courseSyllabus[0]?.id || null);
                                setLessonSubTab('explainer');
                              }
                            }}
                            className="text-[10px] bg-sidebarBg border border-gray-800 hover:bg-gray-800 px-3 py-1 rounded text-primaryAccent font-bold transition-all"
                          >
                            {isExpanded ? 'Close Syllabus' : 'Open Syllabus'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Details */}
                    <div className="border-t border-gray-850 pt-3 flex flex-col gap-3">
                      <div className="w-full bg-sidebarBg h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primaryAccent h-full transition-all duration-300 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-textMuted">
                        <span className="font-semibold">{percent}% Completed</span>
                        
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>Hours left:</span>
                          <input
                            type="number"
                            min="0"
                            value={course.hoursRemaining !== undefined ? course.hoursRemaining : 10}
                            onChange={(e) => handleHoursChange(course.id, e.target.value)}
                            className="w-10 bg-sidebarBg border border-gray-800 text-center rounded text-textPrimary py-0.5 text-xs font-bold font-mono focus:outline-none focus:border-primaryAccent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Syllabus Panel */}
                    {isExpanded && (
                      <div className="border-t border-gray-850 pt-5 mt-4 space-y-4 animate-fadeIn">
                        
                        {syllabus.length > 0 ? (
                           <div className="space-y-4">
                            <h4 className="text-xs font-bold text-textMuted flex items-center gap-1.5 uppercase tracking-wide">
                              📚 Syllabus Exercises (Matt Pocock Skills Style)
                            </h4>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                              {/* Left: Lessons List */}
                              <div className="lg:col-span-2 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {syllabus.map(lesson => {
                                  const isFinished = !!checkedLessons[`${course.id}_${lesson.id}`];
                                  const isCurrent = activeLessonId === lesson.id;
                                  
                                  return (
                                    <div
                                      key={lesson.id}
                                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                                        isCurrent
                                          ? 'border-primaryAccent bg-primaryAccent/5'
                                          : 'border-gray-850 bg-sidebarBg/20 hover:border-gray-800'
                                      }`}
                                    >
                                      <div 
                                        onClick={() => {
                                          setActiveLessonId(lesson.id);
                                        }}
                                        className="flex-1 cursor-pointer text-left text-xs font-mono font-bold text-textPrimary truncate mr-2"
                                      >
                                        {lesson.title}
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={isFinished}
                                        onChange={() => toggleLesson(course, lesson.id)}
                                        className="accent-successGreen cursor-pointer shrink-0"
                                      />
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Right: Active Lesson Variant Viewer */}
                              <div className="lg:col-span-3 bg-darkBg/60 border border-gray-850 rounded-xl p-4 flex flex-col justify-between min-h-[240px] animate-slideRight">
                                {activeLesson ? (
                                  <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                      {/* Tabs Header with Explain It voice trigger */}
                                      <div className="flex items-center justify-between border-b border-gray-850 pb-1.5 mb-3 overflow-x-auto">
                                        <div className="flex gap-3">
                                          {[
                                            { id: 'explainer', label: '📖 Explainer' },
                                            { id: 'problem', label: '📝 Problem' },
                                            { id: 'solution', label: '✔️ Solution' },
                                            { id: 'guide', label: '⚡ Enterprise Guide (7-Phases)' }
                                          ].map(tab => (
                                            <button
                                              key={tab.id}
                                              onClick={() => setLessonSubTab(tab.id)}
                                              className={`text-[10px] font-bold pb-1 border-b-2 transition-all px-1 shrink-0 ${
                                                lessonSubTab === tab.id
                                                  ? 'border-primaryAccent text-primaryAccent'
                                                  : 'border-transparent text-textMuted hover:text-textPrimary'
                                              }`}
                                            >
                                              {tab.label}
                                            </button>
                                          ))}
                                        </div>
                                        <button
                                          onClick={() => setShowVoiceExplainer(true)}
                                          className="flex items-center gap-1 bg-primaryAccent/10 border border-primaryAccent/20 hover:bg-primaryAccent/25 text-primaryAccent text-[9px] font-bold py-1 px-2.5 rounded transition-colors"
                                        >
                                          <Mic size={10} />
                                          Explain It
                                        </button>
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="text-xs leading-relaxed text-textSecondary font-medium">
                                        {lessonSubTab === 'explainer' && (
                                          <p className="whitespace-pre-wrap leading-relaxed">{activeLesson.explainer}</p>
                                        )}
                                        {lessonSubTab === 'problem' && (
                                          <div className="space-y-2">
                                            <span className="text-amber-400 font-bold block">Exercise Task:</span>
                                            <p className="whitespace-pre-wrap leading-relaxed">{activeLesson.problem}</p>
                                          </div>
                                        )}
                                        {lessonSubTab === 'solution' && (
                                          <div className="space-y-2">
                                            <span className="text-successGreen font-bold block">Reference Solution:</span>
                                            <p className="whitespace-pre-wrap leading-relaxed">{activeLesson.solution}</p>
                                          </div>
                                        )}
                                        {lessonSubTab === 'guide' && (
                                          <div className="space-y-3">
                                            {guideGenerating ? (
                                              <div className="text-center py-6 space-y-3 bg-black/25 rounded-lg border border-gray-850 p-4">
                                                <Loader size={24} className="animate-spin text-primaryAccent mx-auto" />
                                                <p className="text-xs font-semibold text-textPrimary">
                                                  Generating Phase {guidePhaseIndex + 1}/13: {STUDY_GUIDE_PHASES[guidePhaseIndex]}...
                                                </p>
                                                <p className="text-[10px] text-textMuted">
                                                  Structuring enterprise architecture, lab setups, and troubleshooting checklists.
                                                </p>
                                              </div>
                                            ) : guideError ? (
                                              <div className="bg-red-950/20 border border-red-900 rounded-lg p-4 space-y-3">
                                                <div className="flex items-start gap-2 text-red-400">
                                                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                                  <div className="text-xs">
                                                    <span className="font-bold block mb-1">Failed to generate study guide:</span>
                                                    <span className="font-mono">{guideError}</span>
                                                  </div>
                                                </div>
                                                <div className="flex justify-end">
                                                  <button
                                                    onClick={() => handleGenerateStudyGuide(course, activeLesson)}
                                                    className="bg-red-900/60 hover:bg-red-800 border border-red-700 text-red-200 text-xs font-bold py-1.5 px-4 rounded transition-all"
                                                  >
                                                    Retry Generation
                                                  </button>
                                                </div>
                                              </div>
                                            ) : cachedGuides[`${course.id}_${activeLesson.id}`] ? (
                                              <div className="space-y-3">
                                                <div className="flex justify-between items-center border-b border-gray-850 pb-2">
                                                  <span className="text-primaryAccent font-bold text-[10px]">7-Phase Study Guide Cached</span>
                                                  <button
                                                    onClick={() => handleGenerateStudyGuide(course, activeLesson)}
                                                    className="text-[9px] bg-sidebarBg hover:bg-gray-800 border border-gray-800 text-textMuted px-2 py-0.5 rounded transition-all animate-pulse"
                                                  >
                                                    🔄 Regenerate
                                                  </button>
                                                </div>
                                                <div className="whitespace-pre-wrap leading-relaxed select-text bg-black/25 p-3 rounded-lg border border-gray-850 overflow-y-auto max-h-[220px] font-mono text-[10px]">
                                                  {cachedGuides[`${course.id}_${activeLesson.id}`]}
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="text-center py-4 space-y-2">
                                                <p className="text-[10px] text-textMuted leading-relaxed">
                                                  Full 7-Phase Enterprise Study Guide is not yet generated for this topic.
                                                </p>
                                                <button
                                                  onClick={() => handleGenerateStudyGuide(course, activeLesson)}
                                                  className="bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-1.5 px-4 rounded shadow-lg hover:shadow-indigo-500/20 transition-all text-xs flex items-center justify-center gap-1.5 mx-auto"
                                                >
                                                  ⚡ Generate 7-Phase Guide
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Voice Explainer Modal */}
                                    {showVoiceExplainer && (
                                      <VoiceExplainer
                                        lesson={activeLesson}
                                        course={course}
                                        onClose={() => setShowVoiceExplainer(false)}
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-textMuted">
                                    <BookOpen size={24} className="opacity-30 mb-2" />
                                    <span className="text-[10px]">Select a lesson from the syllabus list to view exercise material.</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center max-w-sm mx-auto space-y-3 py-6 animate-fadeIn">
                             <BookOpen className="mx-auto text-textMuted opacity-45" size={32} />
                            <h4 className="text-xs font-bold text-textPrimary">No Study Material Cached</h4>
                            <p className="text-[11px] text-textMuted leading-relaxed">
                              Syllabus study guides and exercises for **{course.name}** are offline. Generate detailed lessons, problems, and solutions using the AI Engine.
                            </p>
                            <button
                              onClick={() => handleGenerateSyllabus(course)}
                              disabled={generating}
                              className="bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-1.5 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-xs flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50"
                            >
                              {generating ? <Loader size={12} className="animate-spin" /> : "⚡ Generate Detailed Syllabus"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
