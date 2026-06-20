import React, { useState } from 'react';
import { Sparkles, FileText, Check, Loader, Clipboard, AlertCircle, RefreshCw } from 'lucide-react';
import { callAIService } from '../utils/aiService';

export default function ResumeAnalyzer({ settings }) {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null); // { score, missingKeywords, wordingChanges, customBullets }

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resume.trim() || !jobDescription.trim()) return;

    if (!settings.apiKey) {
      alert("API Key missing! Settings page par key set karein.");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const promptText = `Analyze this candidate's Resume against the target Job Description.
      Provide a comprehensive compatibility check. Focus on helpdesk (L1) to sysadmin/cloud engineer (L2/L3) progression.
      Rate the match score out of 100. Identify missing technical keywords/skills.
      Suggest specific wording upgrades to reframe basic L1 tasks (e.g. resetting passwords, changing keyboard) into professional L2 descriptions (e.g. AD DS credential lifecycle operations, hardware diagnostics).
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "score": 65,
        "missingKeywords": ["PowerShell scripting", "Active Directory Group Policies", "Entra ID"],
        "wordingChanges": [
          {
            "before": "Created user accounts and reset passwords.",
            "after": "Managed identity provisioning and credential lifecycles using AD DS and Microsoft Graph.",
            "why": "Increases visual profile level to L2 System Admin standard."
          }
        ],
        "customBullets": [
          "Automated stale AD user auditing by scripting PowerShell tasks, reducing directory load by 15%.",
          "Orchestrated Windows deployment profiles via Intune configuration rings, minimizing manual OS staging times."
        ]
      }`;

      const responseText = await callAIService({
        systemPrompt: "You are an expert IT recruiter and resume optimization system. Output raw JSON only.",
        prompt: promptText
      });

      const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      setAnalysis(parsed);
    } catch (err) {
      console.error(err);
      alert(`Resume analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResume('');
    setJobDescription('');
    setAnalysis(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            📄 Resume & JD Matcher
          </h1>
          <p className="text-textMuted mt-1">Upgrade your L1 Support resume keywords and customize statements to match L2/L3 Job Descriptions.</p>
        </div>
        
        {analysis && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 bg-sidebarBg hover:bg-gray-900 border border-gray-850 px-3 py-2 rounded-lg text-xs font-bold text-textPrimary transition-colors"
          >
            <RefreshCw size={12} /> Clear Inputs
          </button>
        )}
      </div>

      {!analysis ? (
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-textMuted uppercase tracking-wide px-1">Paste Your Current Resume</label>
            <textarea
              required
              rows="12"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste text contents of your resume here..."
              className="w-full bg-cardBg border border-gray-800 rounded-xl p-4 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-textMuted uppercase tracking-wide px-1">Paste Target Job Description (JD)</label>
              <textarea
                required
                rows="12"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full bg-cardBg border border-gray-800 rounded-xl p-4 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !resume.trim() || !jobDescription.trim()}
              className="w-full bg-gradient-to-r from-primaryAccent to-indigo-500 hover:from-indigo-700 hover:to-indigo-650 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Analyzing Resume Compatibility...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analyze Compatibility Match
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Results View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Match Score & Missing Keywords */}
          <div className="space-y-6">
            {/* Scorecard */}
            <div className="bg-cardBg border border-gray-800 rounded-xl p-5 text-center space-y-4">
              <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider block">Job Match Score</span>
              
              <div className="relative inline-flex items-center justify-center">
                <span className={`text-4xl font-extrabold font-mono ${
                  analysis.score >= 80 ? 'text-successGreen' : analysis.score >= 55 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {analysis.score}%
                </span>
              </div>
              
              <p className="text-xs leading-relaxed text-textSecondary px-4">
                {analysis.score >= 80 
                  ? "Perfect! Job keywords tightly aligned. You stand a high chance of passing the ATS filter."
                  : analysis.score >= 55
                  ? "Average match. Try adding the missing skills listed on the right side to improve match score."
                  : "Critical mismatch. Major core keywords/certifications are missing from your resume."}
              </p>
            </div>

            {/* Missing Keywords list */}
            <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold text-primaryAccent uppercase tracking-wide block border-b border-gray-850 pb-2">
                Missing Keywords Scan
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.missingKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-sidebarBg text-textPrimary border border-gray-850 rounded-full px-2.5 py-1 flex items-center gap-1 font-semibold"
                  >
                    <AlertCircle size={10} className="text-warningAmber" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Wording & Custom Bullets */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Wording Reframing Tables */}
            <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold text-primaryAccent uppercase tracking-wide block border-b border-gray-850 pb-2">
                Re-wording suggestions: Upgrade L1 descriptions to L2 standard
              </span>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {analysis.wordingChanges.map((change, idx) => (
                  <div key={idx} className="border border-gray-850 rounded-lg overflow-hidden text-xs">
                    <div className="grid grid-cols-2 bg-sidebarBg/60 border-b border-gray-850">
                      <div className="p-3 border-r border-gray-850">
                        <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider block mb-1">Before (Basic L1)</span>
                        <p className="text-textSecondary leading-relaxed">{change.before}</p>
                      </div>
                      <div className="p-3">
                        <span className="text-[9px] text-successGreen font-bold uppercase tracking-wider block mb-1">After (Sysadmin L2)</span>
                        <p className="text-textPrimary leading-relaxed font-semibold">{change.after}</p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-black/10 text-[10px] text-textMuted leading-relaxed flex items-center gap-1.5">
                      <Check size={10} className="text-successGreen" />
                      <span>{change.why}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Resume Bullet points */}
            <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                <span className="text-xs font-bold text-primaryAccent uppercase tracking-wide">
                  Tailored resume bullet points to copy & paste
                </span>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysis.customBullets.join('\n'));
                    alert("Custom bullet points copied!");
                  }}
                  className="text-[10px] bg-sidebarBg text-textMuted hover:text-textPrimary px-2.5 py-1 rounded border border-gray-850 flex items-center gap-1 font-bold transition-colors"
                >
                  <Clipboard size={10} /> Copy All
                </button>
              </div>

              <ul className="space-y-2.5 text-xs text-textSecondary leading-relaxed list-disc pl-4 pr-1">
                {analysis.customBullets.map((bullet, idx) => (
                  <li key={idx} className="hover:text-textPrimary transition-colors">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
