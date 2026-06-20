import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, ChevronRight, Check, Loader } from 'lucide-react';
import { callAIService } from '../utils/aiService';
import { COURSES_SYLLABUS_DATA } from '../data/coursesSyllabusData';

export default function CourseRoadmap({ courses, settings, onUpdateCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [lessonSubTab, setLessonSubTab] = useState('explainer'); // 'explainer', 'problem', 'solution', 'guide'
  const [generating, setGenerating] = useState(false);
  const [guideGenerating, setGuideGenerating] = useState(false);

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

  // Completed lessons progress saved in localStorage
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('engineeros_completed_lessons');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('engineeros_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const handleGenerateStudyGuide = async (course, lesson) => {
    if (!settings.apiKey) {
      alert("API Key missing! Settings page par model key configure karein.");
      return;
    }
    setGuideGenerating(true);
    try {
      const promptText = `Generate a COMPLETE, ENTERPRISE-GRADE study guide and reference manual for the IT topic: "${lesson.name}" (from the course "${course.name}").
      
      You must act as a Senior IT Infrastructure Architect and provide a highly detailed, professional, and click-by-click instruction guide. DO NOT output brief summaries or placeholders. Cover all of the following 13 sections in detail:
      
      1. **Overview**: Detailed explanation, purpose, definition, and business benefits.
      2. **Architecture**: Core design, components, and data flows.
      3. **Installation**: Prerequisites, system requirements, and step-by-step installation instructions.
      4. **Configuration**: Exact navigation paths, configuration parameters, and initial setup steps.
      5. **Administration**: Daily management tasks, monitoring metrics, and routine maintenance logs.
      6. **Troubleshooting**: A structured database table of 3-5 common issues, possible causes, diagnostic steps, and resolutions.
      7. **Real Industry Tasks**: Specific action items categorized by L1, L2, and L3 support tiers.
      8. **KB Article**: A complete, copyable Knowledge Base article in the format (Title, Objective, Environment, Steps, Verification, Rollback, Notes).
      9. **Practical Lab**: A step-by-step hands-on training lab exercise (Beginner, Intermediate, or Advanced level).
      10. **Interview Questions**: 3-5 technical interview questions (categorized by difficulty) with detailed answers.
      11. **Cheat Sheet**: A markdown table of important commands, configurations, or paths.
      12. **Exam Notes**: Critical facts, mind-map notes, and 2 sample MCQs with explanations.
      13. **Best Practices**: A checklist of industry-standard security hardening and optimization best practices.

      Use clean markdown formatting, alert blocks, and code tags where appropriate. Do not output introductory text, start directly with the title and content.`;

      const responseText = await callAIService({
        systemPrompt: "You are an expert IT trainer and senior systems architect. You write exhaustive, highly detailed technical guides without placeholders.",
        prompt: promptText
      });

      setCachedGuides(prev => {
        const updated = { ...prev, [`${course.id}_${lesson.id}`]: responseText };
        localStorage.setItem('engineeros_cached_guides', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert(`Study Guide generation failed: ${err.message}`);
    } finally {
      setGuideGenerating(false);
    }
  };

  // Sync active lesson selection
  useEffect(() => {
    setLessonSubTab('explainer');
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
      const updated = { ...completedLessons };
      syllabus.forEach(lesson => {
        updated[`${courseId}_${lesson.id}`] = true;
      });
      setCompletedLessons(updated);
    } else if (status === 'Not Started') {
      completed = 0;
      const syllabus = getCourseSyllabus(course);
      const updated = { ...completedLessons };
      syllabus.forEach(lesson => {
        delete updated[`${courseId}_${lesson.id}`];
      });
      setCompletedLessons(updated);
    }

    onUpdateCourse(courseId, { status, completedModules: completed });
  };

  const handleHoursChange = (courseId, hours) => {
    const hoursVal = Math.max(0, parseInt(hours) || 0);
    onUpdateCourse(courseId, { hoursRemaining: hoursVal });
  };

  const toggleLesson = (course, lessonId) => {
    const key = `${course.id}_${lessonId}`;
    const newCompleted = { ...completedLessons, [key]: !completedLessons[key] };
    setCompletedLessons(newCompleted);

    // Recalculate progress modules
    const syllabus = getCourseSyllabus(course);
    const completedCount = syllabus.filter(l => newCompleted[`${course.id}_${l.id}`]).length;

    let status = 'In Progress';
    if (completedCount === 0) status = 'Not Started';
    else if (completedCount === syllabus.length) status = 'Completed';

    onUpdateCourse(course.id, { completedModules: completedCount, status });
  };

  // Grouping courses by Role Level
  const roles = {
    "L1 Support / Helpdesk": courses.filter(c => c.role === 'L1'),
    "L2 Systems Administrator": courses.filter(c => c.role === 'L2' || c.role === 'L2-L3'),
    "L3 Multi-Cloud Systems Engineer": courses.filter(c => c.role === 'L3')
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
      <div className="border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
          📖 ICNT Academy Course Roadmap
        </h1>
        <p className="text-textMuted mt-1">Track your syllabus progress across all 16 certification modules and estimate completion timelines.</p>
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
                                  const isFinished = !!completedLessons[`${course.id}_${lesson.id}`];
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
                                      {/* Tabs: explainer, problem, solution, guide */}
                                      <div className="flex border-b border-gray-850 gap-3 pb-1.5 mb-3 overflow-x-auto">
                                        {[
                                          { id: 'explainer', label: '📖 Explainer' },
                                          { id: 'problem', label: '📝 Problem' },
                                          { id: 'solution', label: '✔️ Solution' },
                                          { id: 'guide', label: '⚡ Enterprise Guide (13-Phases)' }
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
                                            {cachedGuides[`${course.id}_${activeLesson.id}`] ? (
                                              <div className="space-y-3">
                                                <div className="flex justify-between items-center border-b border-gray-850 pb-2">
                                                  <span className="text-primaryAccent font-bold text-[10px]">13-Phase Study Guide Cached</span>
                                                  <button
                                                    onClick={() => handleGenerateStudyGuide(course, activeLesson)}
                                                    disabled={guideGenerating}
                                                    className="text-[9px] bg-sidebarBg hover:bg-gray-800 border border-gray-800 text-textMuted px-2 py-0.5 rounded transition-all"
                                                  >
                                                    {guideGenerating ? "Regenerating..." : "🔄 Regenerate"}
                                                  </button>
                                                </div>
                                                <div className="whitespace-pre-wrap leading-relaxed select-text bg-black/25 p-3 rounded-lg border border-gray-850 overflow-y-auto max-h-[220px] font-mono text-[10px]">
                                                  {cachedGuides[`${course.id}_${activeLesson.id}`]}
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="text-center py-4 space-y-2">
                                                <p className="text-[10px] text-textMuted leading-relaxed">
                                                  Full 13-Phase Enterprise Study Guide is not yet generated for this topic.
                                                </p>
                                                <button
                                                  onClick={() => handleGenerateStudyGuide(course, activeLesson)}
                                                  disabled={guideGenerating}
                                                  className="bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded shadow-lg hover:shadow-indigo-500/20 transition-all text-[10px] flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50"
                                                >
                                                  {guideGenerating ? <Loader size={10} className="animate-spin" /> : "⚡ Generate 13-Phase Guide"}
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
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
