import React, { useState, useEffect } from 'react';
import { FileText, Copy, Download, Loader, Briefcase, Award, Sparkles, CheckSquare, Plus, X } from 'lucide-react';
import { callAIService } from '../utils/aiService';

const AVAILABLE_CERTS = [
  "CCNA 200-301",
  "AZ-900 Azure Fundamentals",
  "AZ-104 Azure Administrator",
  "RHCSA Linux EX-200",
  "MS-102 Microsoft 365 Administrator",
  "MD-102 Endpoint Administrator",
  "CompTIA Network+",
  "CompTIA Security+"
];

export default function ResumeBuilder({ settings }) {
  const [currentTitle, setCurrentTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [yearsExp, setYearsExp] = useState(2);
  const [selectedCerts, setSelectedCerts] = useState([]);
  
  // Skills tags
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(["Active Directory", "DNS", "Troubleshooting", "PowerShell", "Backup"]);
  
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null); // { summary, experience: [], certs: {}, keywords: '' }
  const [oldResume, setOldResume] = useState('');
  const [copiedSection, setCopiedSection] = useState(null);

  // Pre-fill from settings on mount or load
  useEffect(() => {
    if (settings) {
      if (settings.currentRole) setCurrentTitle(settings.currentRole);
      if (settings.targetRole) setTargetRole(settings.targetRole);
    }
  }, [settings]);

  const handleToggleCert = (cert) => {
    setSelectedCerts(prev => 
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skills.includes(clean) && skills.length < 10) {
      setSkills(prev => [...prev, clean]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleGenerateResume = async (e) => {
    e.preventDefault();
    if (!currentTitle || !targetRole) {
      alert("Please enter current and target job roles.");
      return;
    }

    if (!settings?.apiKey) {
      alert("API Key missing! Settings page par key set karein.");
      return;
    }

    setLoading(true);
    try {
      const promptText = `Act as an expert technical resume writer and ATS recruiter.
      Generate a professional resume skeleton block for an IT Engineer.
      Details:
      - Current Job Title: "${currentTitle}"
      - Years of Experience: "${yearsExp} years"
      - Target Role: "${targetRole}"
      - Completed Certifications: ${JSON.stringify(selectedCerts)}
      - Top Skills: ${JSON.stringify(skills)}
      - Reference Old Resume (Optional): "${oldResume || 'None provided'}"

      Instructions:
      1. Write a one-paragraph technical summary focusing on L1/L2 sysadmin skill transitions.
      2. Write exactly 5 action-verb driven, metric-heavy, ATS-friendly bullet points detailing their experience. If an old resume is provided, prioritize re-writing their real-world experience, projects, and duties from that reference into high-quality ATS points.
      3. For each selected certification, write exactly 3 bullet points detailing what skills/labs were tested or achieved.
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "summary": "Professional summary text...",
        "experience": [
          "ATS bullet 1...",
          "ATS bullet 2...",
          "ATS bullet 3...",
          "ATS bullet 4...",
          "ATS bullet 5..."
        ],
        "certs": {
          "CCNA 200-301": [
            "CCNA bullet 1...",
            "CCNA bullet 2...",
            "CCNA bullet 3..."
          ]
        },
        "keywords": "Active Directory, Subnetting, OSPF, DHCP Scope Configuration, Syslog, Wireshark, Azure VM"
      }`;

      const aiResponse = await callAIService({
        systemPrompt: "You are a professional IT resume writer. Output raw JSON objects only.",
        prompt: promptText
      });

      const cleaned = aiResponse.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      setResumeData(parsed);
    } catch (err) {
      console.error(err);
      alert(`Resume generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getFullResumeText = () => {
    if (!resumeData) return '';
    let text = `========================================\n`;
    text += `TECHNICAL RESUME PREVIEW & DRAFT PROFILE\n`;
    text += `========================================\n\n`;
    
    text += `PROFESSIONAL SUMMARY\n`;
    text += `--------------------\n`;
    text += `${resumeData.summary}\n\n`;

    text += `TECHNICAL SKILLS KEYWORDS\n`;
    text += `-------------------------\n`;
    text += `${resumeData.keywords}\n\n`;

    text += `PROFESSIONAL EXPERIENCE\n`;
    text += `-----------------------\n`;
    text += `${currentTitle} | ${yearsExp} Years\n`;
    resumeData.experience.forEach(bullet => {
      text += `* ${bullet}\n`;
    });
    text += `\n`;

    text += `CERTIFICATIONS & CREDENTIALS\n`;
    text += `----------------------------\n`;
    Object.entries(resumeData.certs).forEach(([certName, bullets]) => {
      text += `${certName}\n`;
      bullets.forEach(b => {
        text += `* ${b}\n`;
      });
      text += `\n`;
    });
    
    return text;
  };

  const downloadAsTextFile = () => {
    const text = getFullResumeText();
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${targetRole.replace(/\s+/g, '_')}_Resume_Draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsWord = () => {
    if (!resumeData) return;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${targetRole} Resume</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; color: #333333; }
          h1 { font-size: 18pt; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; margin-top: 0; text-transform: uppercase; color: #111111; }
          h2 { font-size: 12pt; border-bottom: 1px solid #dddddd; padding-bottom: 3px; margin-top: 20px; text-transform: uppercase; color: #4f46e5; }
          h3 { font-size: 11pt; margin-top: 12px; margin-bottom: 4px; color: #111111; font-weight: bold; }
          p { margin: 0 0 8px 0; text-align: justify; }
          ul { margin: 0 0 12px 0; padding-left: 20px; }
          li { margin-bottom: 4px; text-align: justify; }
          .meta-info { font-size: 9.5pt; color: #666666; margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <h1>${targetRole} Resume Draft</h1>
        <div class="meta-info">Current Title: ${currentTitle} | Years of Experience: ${yearsExp}</div>
        
        <h2>Professional Summary</h2>
        <p>${resumeData.summary}</p>
        
        <h2>Technical Skills Keywords</h2>
        <p><strong>Keywords:</strong> ${resumeData.keywords}</p>
        
        <h2>Professional Experience</h2>
        <h3>${currentTitle} (${yearsExp} Years)</h3>
        <ul>
          ${resumeData.experience.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
        
        <h2>Certifications & Credentials</h2>
        ${Object.entries(resumeData.certs).map(([certName, bullets]) => `
          <h3>${certName}</h3>
          <ul>
            ${bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        `).join('')}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `${targetRole.replace(/\s+/g, '_')}_Resume.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsPDF = () => {
    if (!resumeData) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup blocker active! Please allow popups to download PDF.");
      return;
    }
    const htmlContent = `
      <html>
      <head>
        <title>${targetRole.replace(/\s+/g, '_')}_Resume</title>
        <style>
          @page { size: letter; margin: 0.8in; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10.5pt; color: #333; line-height: 1.5; margin: 0; padding: 0; }
          .header { border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 20px; }
          h1 { font-size: 20pt; font-weight: bold; color: #111; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
          .subtitle { font-size: 11pt; color: #4f46e5; font-weight: 600; margin: 0; text-transform: uppercase; }
          h2 { font-size: 12pt; font-weight: bold; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 24px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px; }
          .experience-header { display: flex; justify-content: space-between; font-weight: bold; color: #222; margin-bottom: 6px; font-size: 11pt; }
          .experience-date { font-weight: normal; color: #666; font-size: 9.5pt; }
          p { margin: 0 0 10px 0; text-align: justify; }
          ul { margin: 0 0 15px 0; padding-left: 20px; }
          li { margin-bottom: 6px; text-align: justify; }
          .skills-list { font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Systems Engineer Resume</h1>
          <div class="subtitle">Target Role: ${targetRole}</div>
        </div>
        
        <h2>Professional Summary</h2>
        <p>${resumeData.summary}</p>
        
        <h2>Technical Skills Keywords</h2>
        <p class="skills-list">${resumeData.keywords}</p>
        
        <h2>Professional Experience</h2>
        <div class="experience-header">
          <span>${currentTitle}</span>
          <span class="experience-date">${yearsExp} Years Experience</span>
        </div>
        <ul>
          ${resumeData.experience.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
        
        <h2>Certifications & Credentials</h2>
        ${Object.entries(resumeData.certs).map(([certName, bullets]) => `
          <div class="experience-header" style="margin-top: 12px;">
            <span>${certName}</span>
          </div>
          <ul>
            ${bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        `).join('')}
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
          📄 ATS Resume Builder
        </h1>
        <p className="text-textMuted mt-1">Generate high-impact, ATS-optimized experience bullet points and summary drafts matching your target roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-2 bg-cardBg border border-gray-800 rounded-xl p-6 h-fit space-y-5">
          <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wider border-b border-gray-850 pb-2 flex items-center gap-1.5">
            <Sparkles size={16} className="text-primaryAccent" />
            Resume Profile Criteria
          </h3>

          <form onSubmit={handleGenerateResume} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                Current Job Title
              </label>
              <input
                type="text"
                required
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="e.g. Desktop Support L1"
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-xs font-semibold text-textPrimary focus:outline-none focus:border-primaryAccent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                Target Role
              </label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Sysadmin L2"
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-xs font-semibold text-textPrimary focus:outline-none focus:border-primaryAccent"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={yearsExp}
                  onChange={(e) => setYearsExp(parseInt(e.target.value) || 0)}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-xs font-semibold text-textPrimary focus:outline-none focus:border-primaryAccent font-mono"
                />
              </div>
            </div>

            {/* Skills Tag input */}
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 flex justify-between">
                <span>Top Core Skills (Max 10)</span>
                <span className="text-[10px] text-textMuted">{skills.length}/10</span>
              </label>
              
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Type skill and click +"
                  className="flex-1 bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs font-semibold text-textPrimary focus:outline-none focus:border-primaryAccent"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-sidebarBg border border-gray-800 hover:bg-gray-800 p-2 rounded-lg text-primaryAccent font-bold text-sm"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {skills.map(s => (
                  <span
                    key={s}
                    className="flex items-center gap-1 bg-primaryAccent/10 border border-primaryAccent/20 text-primaryAccent text-[10px] font-bold py-1 px-2 rounded-md"
                  >
                    {s}
                    <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-red-400">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Completed Certifications list */}
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                Completed Certifications (Select All)
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1 border border-gray-850 p-2.5 rounded-lg bg-sidebarBg/20">
                {AVAILABLE_CERTS.map(cert => {
                  const checked = selectedCerts.includes(cert);
                  return (
                    <label
                      key={cert}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer transition-colors text-[10px] font-semibold border ${
                        checked 
                          ? 'border-primaryAccent/30 bg-primaryAccent/5 text-primaryAccent' 
                          : 'border-transparent text-textSecondary hover:bg-gray-900/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleCert(cert)}
                        className="accent-primaryAccent shrink-0"
                      />
                      <span>{cert}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Reference Old Resume Textarea */}
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                Old Resume / Reference Context (Optional)
              </label>
              <textarea
                value={oldResume}
                onChange={(e) => setOldResume(e.target.value)}
                placeholder="Paste your existing resume here to use it as an experience and project reference..."
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2.5 px-4 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent h-24 font-sans leading-relaxed resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Generating ATS Draft...
                </>
              ) : (
                <>
                  <FileText size={14} />
                  Generate ATS Resume Elements
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Formatted Resume Preview */}
        <div className="lg:col-span-3 space-y-6">
          {loading && (
            <div className="bg-cardBg border border-gray-800 rounded-xl p-16 text-center space-y-4">
              <Loader size={36} className="animate-spin text-primaryAccent mx-auto" />
              <h3 className="text-base font-bold text-textPrimary">Creating ATS Elements</h3>
              <p className="text-xs text-textMuted leading-relaxed max-w-sm mx-auto">
                AI is auditing your experience blocks and selected certifications to draft ATS-optimized action points and a technical summary.
              </p>
            </div>
          )}

          {!loading && !resumeData && (
            <div className="bg-cardBg border border-gray-800 rounded-xl p-16 text-center text-textMuted">
              <FileText className="mx-auto text-textMuted mb-4 opacity-30" size={48} />
              <h3 className="text-base font-bold text-textPrimary">No Resume Elements Generated</h3>
              <p className="text-xs text-textMuted mt-1">
                Configure your job history parameters on the left pane and click **"Generate ATS Resume Elements"** to draft copyable resume content.
              </p>
            </div>
          )}

          {!loading && resumeData && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Action Bar */}
              <div className="flex items-center justify-between bg-cardBg border border-gray-800 rounded-xl p-4">
                <span className="text-xs font-bold text-successGreen flex items-center gap-1.5">
                  <Sparkles size={14} /> Output Ready
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={downloadAsTextFile}
                    className="flex items-center gap-1 text-[10px] bg-sidebarBg hover:bg-gray-800 border border-gray-800 text-textPrimary font-bold px-2.5 py-1.5 rounded transition-colors"
                  >
                    <Download size={11} />
                    TXT
                  </button>
                  <button
                    onClick={downloadAsWord}
                    className="flex items-center gap-1 text-[10px] bg-sidebarBg hover:bg-gray-800 border border-gray-800 text-textPrimary font-bold px-2.5 py-1.5 rounded transition-colors"
                  >
                    <Download size={11} />
                    Word
                  </button>
                  <button
                    onClick={downloadAsPDF}
                    className="flex items-center gap-1 text-[10px] bg-primaryAccent hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded transition-colors animate-pulse"
                  >
                    <Download size={11} />
                    PDF / Print
                  </button>
                </div>
              </div>

              {/* Resume Card Preview */}
              <div className="bg-cardBg border border-gray-800 rounded-xl p-6 space-y-6 shadow-xl select-text relative font-sans text-xs">
                {/* 1. Summary */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-gray-850 pb-1">
                    <span className="text-[10px] font-bold text-primaryAccent uppercase tracking-wider">
                      Professional Summary
                    </span>
                    <button
                      onClick={() => copyToClipboard(resumeData.summary, 'summary')}
                      className="text-[10px] text-textMuted hover:text-textPrimary flex items-center gap-1"
                    >
                      <Copy size={11} /> {copiedSection === 'summary' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-textSecondary leading-relaxed text-xs">
                    {resumeData.summary}
                  </p>
                </div>

                {/* 2. Keywords */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-gray-850 pb-1">
                    <span className="text-[10px] font-bold text-primaryAccent uppercase tracking-wider">
                      Technical Skills Keywords
                    </span>
                    <button
                      onClick={() => copyToClipboard(resumeData.keywords, 'keywords')}
                      className="text-[10px] text-textMuted hover:text-textPrimary flex items-center gap-1"
                    >
                      <Copy size={11} /> {copiedSection === 'keywords' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-textSecondary leading-relaxed text-xs font-mono font-medium">
                    {resumeData.keywords}
                  </p>
                </div>

                {/* 3. Experience */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-850 pb-1">
                    <span className="text-[10px] font-bold text-primaryAccent uppercase tracking-wider flex items-center gap-1">
                      <Briefcase size={12} /> Professional Experience
                    </span>
                    <button
                      onClick={() => copyToClipboard(resumeData.experience.join('\n'), 'exp')}
                      className="text-[10px] text-textMuted hover:text-textPrimary flex items-center gap-1"
                    >
                      <Copy size={11} /> {copiedSection === 'exp' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-textPrimary text-xs block">{currentTitle}</strong>
                    <span className="text-[10px] text-textMuted">{yearsExp} Years Experience</span>
                  </div>
                  <ul className="list-disc pl-4 text-textSecondary space-y-2 leading-relaxed">
                    {resumeData.experience.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                {/* 4. Certifications */}
                {Object.keys(resumeData.certs).length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-850 pb-1">
                      <span className="text-[10px] font-bold text-primaryAccent uppercase tracking-wider flex items-center gap-1">
                        <Award size={12} /> Certification Bullet Points
                      </span>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(resumeData.certs).map(([certName, bullets]) => (
                        <div key={certName} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <strong className="text-textPrimary text-xs">{certName}</strong>
                            <button
                              onClick={() => copyToClipboard(bullets.join('\n'), certName)}
                              className="text-[9px] text-textMuted hover:text-textPrimary flex items-center gap-1"
                            >
                              <Copy size={10} /> {copiedSection === certName ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <ul className="list-disc pl-4 text-textSecondary space-y-1.5 leading-relaxed">
                            {bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
