import React from 'react';
import { Award, BookOpen, Clock, CheckCircle } from 'lucide-react';

export default function CourseRoadmap({ courses, onUpdateCourse }) {
  
  const handleProgressChange = (courseId, completedVal) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const total = course.totalModules || 10;
    const completed = Math.max(0, Math.min(total, parseInt(completedVal) || 0));
    
    let status = 'In Progress';
    if (completed === 0) status = 'Not Started';
    else if (completed === total) status = 'Completed';

    onUpdateCourse(courseId, { completedModules: completed, status });
  };

  const handleStatusChange = (courseId, status) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const total = course.totalModules || 10;
    let completed = course.completedModules;
    if (status === 'Completed') completed = total;
    else if (status === 'Not Started') completed = 0;

    onUpdateCourse(courseId, { status, completedModules: completed });
  };

  const handleHoursChange = (courseId, hours) => {
    const hoursVal = Math.max(0, parseInt(hours) || 0);
    onUpdateCourse(courseId, { hoursRemaining: hoursVal });
  };

  // Grouping courses by Role Level
  const roles = {
    "L1 Support / Helpdesk": courses.filter(c => c.role === 'L1'),
    "L2 Systems Administrator": courses.filter(c => c.role === 'L2' || c.role === 'L2-L3'),
    "L3 Multi-Cloud Systems Engineer": courses.filter(c => c.role === 'L3')
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleCourses.map(course => {
                const percent = Math.round(((course.completedModules || 0) / course.totalModules) * 100);
                
                return (
                  <div key={course.id} className="bg-cardBg border border-gray-800 rounded-xl p-5 hover:border-gray-750 transition-all flex flex-col justify-between">
                    <div>
                      {/* Top Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl" role="img" aria-label={course.name}>
                          {course.icon}
                        </span>
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
                      
                      {/* Module Counter Slider */}
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="range"
                          min="0"
                          max={course.totalModules}
                          value={course.completedModules || 0}
                          onChange={(e) => handleProgressChange(course.id, e.target.value)}
                          className="flex-1 accent-primaryAccent h-1.5 bg-sidebarBg rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-textPrimary shrink-0">
                          {course.completedModules || 0}/{course.totalModules} Modules
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Details */}
                    <div className="border-t border-gray-850 pt-4 mt-2 flex flex-col gap-3">
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
