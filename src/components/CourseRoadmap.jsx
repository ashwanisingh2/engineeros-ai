import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, ChevronRight, Check } from 'lucide-react';

const COURSE_SYLLABUS = {
  // Course ID 1: Computer Hardware & Troubleshooting (9 modules)
  1: [
    {
      id: "01.01",
      title: "01.01-cpu-architecture-basics",
      name: "CPU Architecture Basics",
      explainer: "Central Processing Unit (CPU) executes instruction cycles (Fetch-Decode-Execute). Modern CPUs use x86-64 or ARM architectures. Cache levels (L1, L2, L3) speed up access times by storing frequently used memory data close to core processing units.",
      problem: "Detail the primary differences between L1 Cache and L3 Cache in processor architectures.",
      solution: "L1 Cache is extremely fast, operates at core speed, has a tiny storage size (typically 32KB-64KB per core), and is built directly inside each CPU core boundary. L3 Cache is larger (typically 12MB-64MB), runs slightly slower, and is shared among all processor cores on the silicon die."
    },
    {
      id: "01.02",
      title: "01.02-ram-slots-and-troubleshooting",
      name: "RAM Slots and Troubleshooting",
      explainer: "RAM (Random Access Memory) acts as volatile primary storage. Troubleshoot modules by verifying seating contacts, using MemTest86 diagnostic scans, and understanding dual-channel slot configurations (slots 1 & 3 vs 2 & 4).",
      problem: "List three common symptoms of a loose, unseated, or failing RAM memory module.",
      solution: "1. The system failing to POST (Power-On Self-Test) accompanied by continuous system beeps.\n2. Random BSOD (Blue Screen of Death) memory dump logs.\n3. The system booting up but displaying a blank/black monitor with active cooling fans."
    },
    {
      id: "01.03",
      title: "01.03-motherboard-form-factors",
      name: "Motherboard Form Factors",
      explainer: "Standard motherboard form factors (ATX, Micro-ATX, and Mini-ITX) define mount layout specs, expansion port locations, and power connector constraints.",
      problem: "Which motherboard form factor is best suited for small form-factor Home Theater PCs, and why?",
      solution: "Mini-ITX, because it specifies an ultra-compact standard size of 17x17 cm, fitting easily inside low-profile client chassis while still providing standard PCIe and SATA headers."
    }
  ],
  // Course ID 2: CCNA 200-301 (Networking) (11 modules)
  2: [
    {
      id: "02.01",
      title: "02.01-osi-model-layers",
      name: "OSI Model Layers",
      explainer: "The OSI model separates network communications into seven layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. PDUs vary by layer (bits, frames, packets, segments, data).",
      problem: "Determine the OSI layer responsible for packet routing path decisions and specify its PDU.",
      solution: "OSI Layer 3 (Network Layer) handles logical IP routing. Its Protocol Data Unit (PDU) is the Packet."
    },
    {
      id: "02.02",
      title: "02.02-ipv4-subnetting-basics",
      name: "IPv4 Subnetting Basics",
      explainer: "Subnetting divides Classful IPs into smaller logical networks. Use Variable Length Subnet Masking (VLSM) to allocate network host boundaries correctly.",
      problem: "Determine the subnet mask and total usable client host addresses for a /26 CIDR range.",
      solution: "A /26 subnet corresponds to a mask of 255.255.255.192. It contains 64 total addresses, leaving 62 usable client host addresses (subtracting the network address and directed broadcast address)."
    },
    {
      id: "02.03",
      title: "02.03-vlans-and-routing",
      name: "VLANs & Inter-VLAN Routing",
      explainer: "Virtual LANs segment switch ports into separate logical broadcast domains. Connect multiple VLANs across single router trunks using subinterfaces (Router-on-a-Stick).",
      problem: "What port configuration is required on switch-to-router links to carry traffic for multiple VLANs?",
      solution: "The link must be configured in Trunk Mode, utilizing IEEE 802.1Q frame encapsulation to tag packet frames with their respective VLAN IDs."
    }
  ],
  // Course ID 3: MCSA Windows Server 2022
  3: [
    {
      id: "03.01",
      title: "03.01-active-directory-forests",
      name: "Active Directory Forests & Domains",
      explainer: "Active Directory DS is structured by Forests, Trees, Domains, and OUs. The Forest acts as the ultimate security boundary. Domains segment logical admin regions.",
      problem: "Explain if cross-domain authentication is possible between domains under the same Active Directory Forest.",
      solution: "Yes. By default, two-way transitive Kerberos trust relationships are automatically generated between parent and child domains in the same Forest, allowing users to authenticate across domain zones."
    },
    {
      id: "03.02",
      title: "03.02-dns-zone-replication",
      name: "DNS Zone Replication",
      explainer: "AD-Integrated zones store DNS data partitions inside active directory databases (`ntds.dit`), causing DNS data to replicate securely alongside AD DS replication schedules.",
      problem: "List the main security benefit of setting up Active Directory-Integrated DNS zones.",
      solution: "AD-Integrated zones support Secure Dynamic Updates. This restricts DNS modification updates only to authenticated domain members, preventing rogue devices from hijacking domain records."
    }
  ],
  // Course ID 4: RHCSA Linux
  4: [
    {
      id: "04.01",
      title: "04.01-linux-permissions-chmod",
      name: "Linux Permissions & chmod",
      explainer: "Linux permissions use Read (4), Write (2), and Execute (1) bits across User, Group, and Others (UGO). Configured using the `chmod` command.",
      problem: "Convert permission flags 'rwxr-xr--' to octal numeric representation.",
      solution: "754 (Owner rwx = 4+2+1 = 7; Group r-x = 4+1 = 5; Others r-- = 4)."
    },
    {
      id: "04.02",
      title: "04.02-logical-volume-manager",
      name: "LVM Volume Provisioning",
      explainer: "LVM abstracts raw storage blocks into flexible pools. Initialize Physical Volumes (PV), group them into Volume Groups (VG), and carve out Logical Volumes (LV).",
      problem: "Write the sequence of command steps to configure a 5GB Logical Volume named 'datalv' on raw disk /dev/sdb.",
      solution: "1. pvcreate /dev/sdb (Initialize PV)\n2. vgcreate datavg /dev/sdb (Create VG)\n3. lvcreate -n datalv -L 5G datavg (Carve 5GB LV)"
    }
  ],
  // Course ID 6: PowerShell Scripting
  6: [
    {
      id: "06.01",
      title: "06.01-powershell-cmdlets",
      name: "PowerShell Cmdlet Basics",
      explainer: "PowerShell scripts use structured Verb-Noun cmdlets. Objects are piped (`|`) to downstream commands to filter and format outputs.",
      problem: "Write a PowerShell pipeline command to retrieve active services, filter for stopped ones, and sort them by service name.",
      solution: "Get-Service | Where-Object Status -eq 'Stopped' | Sort-Object Name"
    }
  ]
};

function getCourseSyllabus(course) {
  const customList = COURSE_SYLLABUS[course.id];
  if (customList) {
    if (customList.length < course.totalModules) {
      const list = [...customList];
      for (let i = customList.length + 1; i <= course.totalModules; i++) {
        const subNum = i < 10 ? `0${i}` : `${i}`;
        const coursePrefix = course.id < 10 ? `0${course.id}` : `${course.id}`;
        const idx = `${coursePrefix}.${subNum}`;
        list.push({
          id: idx,
          title: `${idx}-lesson-module-${i}`,
          name: `Lesson Module ${i} for ${course.name}`,
          explainer: `This lesson covers advanced theoretical concepts, system configurations, and troubleshooting guidelines for ${course.name}.`,
          problem: `Detail the standard troubleshooting steps and configuration guidelines for this topic within ${course.name}.`,
          solution: `Solution verification: Verify system services are running, configurations match staging, and diagnostic tests pass without error flags.`
        });
      }
      return list;
    }
    return customList;
  }

  // Dynamic generator matching the mattpocock/skills structure prefix XX.YY
  const total = course.totalModules || 5;
  const list = [];
  for (let i = 1; i <= total; i++) {
    const subNum = i < 10 ? `0${i}` : `${i}`;
    const coursePrefix = course.id < 10 ? `0${course.id}` : `${course.id}`;
    const idx = `${coursePrefix}.${subNum}`;

    list.push({
      id: idx,
      title: `${idx}-lesson-module-${i}`,
      name: `Lesson Module ${i} for ${course.name}`,
      explainer: `This lesson covers key components, installation steps, and troubleshooting guidelines for ${course.name}.`,
      problem: `Practice exercise for lesson ${i}: Detail the standard configuration parameters and common troubleshooting commands for this module.`,
      solution: `Solution guide: Check the active logs using journalctl or Event Viewer, review interface settings, and check that standard ports are open.`
    });
  }
  return list;
}

export default function CourseRoadmap({ courses, onUpdateCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [lessonSubTab, setLessonSubTab] = useState('explainer'); // 'explainer', 'problem', 'solution'

  // Completed lessons progress saved in localStorage
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('engineeros_completed_lessons');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('engineeros_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const handleStatusChange = (courseId, status) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const total = course.totalModules || 10;
    let completed = course.completedModules;
    if (status === 'Completed') {
      completed = total;
      // Mark all lessons as completed in local storage
      const syllabus = getCourseSyllabus(course);
      const updated = { ...completedLessons };
      syllabus.forEach(lesson => {
        updated[`${courseId}_${lesson.id}`] = true;
      });
      setCompletedLessons(updated);
    } else if (status === 'Not Started') {
      completed = 0;
      // Clear all lessons for this course in local storage
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

    // Recalculate modules count
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
                              const syllabus = getCourseSyllabus(course);
                              setActiveLessonId(syllabus[0]?.id || null);
                              setLessonSubTab('explainer');
                            }
                          }}
                          className="text-[10px] bg-sidebarBg border border-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-primaryAccent font-bold transition-all"
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
                        <h4 className="text-xs font-bold text-textMuted flex items-center gap-1.5 uppercase tracking-wide">
                          📚 Syllabus Exercises (Matt Pocock Skills Style)
                        </h4>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                          {/* Left: Lessons List */}
                          <div className="lg:col-span-2 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {getCourseSyllabus(course).map(lesson => {
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
                                      setLessonSubTab('explainer');
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
                                  {/* Tabs: explainer, problem, solution */}
                                  <div className="flex border-b border-gray-850 gap-3 pb-1.5 mb-3">
                                    {[
                                      { id: 'explainer', label: '📖 Explainer' },
                                      { id: 'problem', label: '📝 Problem' },
                                      { id: 'solution', label: '✔️ Solution' }
                                    ].map(tab => (
                                      <button
                                        key={tab.id}
                                        onClick={() => setLessonSubTab(tab.id)}
                                        className={`text-[10px] font-bold pb-1 border-b-2 transition-all px-1 ${
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
