import React, { useState } from 'react';
import { FileText, Copy, Save, AlertCircle, Loader, Check, ArrowRight } from 'lucide-react';
import { callAIService } from '../utils/aiService';

const TEMPLATES = [
  { id: 'SOP', name: 'Standard Operating Procedure (SOP)', desc: 'Standard/daily procedures list (e.g. Resetting AD password)' },
  { id: 'KB', name: 'Knowledge Base (KB) Article', desc: 'Step-by-step problem fixes (e.g. Outlook configuration repair)' },
  { id: 'Incident', name: 'Incident Report', desc: 'Live server or service crash alerts (e.g. DC01 offline log)' },
  { id: 'RCA', name: 'Root Cause Analysis (RCA)', desc: 'Why an error occurred and how to resolve it permanently' },
  { id: 'Change', name: 'Change Request', desc: 'Planned upgrades requiring risk checks and rollback plans' }
];

export default function DocGenerator({ settings, onSaveToKnowledge }) {
  const [selectedTemplate, setSelectedTemplate] = useState('SOP');
  const [title, setTitle] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // SOP dynamic fields
  const [sopScope, setSopScope] = useState('');
  const [sopPrereqs, setSopPrereqs] = useState('');
  const [sopProcedure, setSopProcedure] = useState('');

  // KB dynamic fields
  const [kbSymptoms, setKbSymptoms] = useState('');
  const [kbRootCause, setKbRootCause] = useState('');
  const [kbResolution, setKbResolution] = useState('');

  // Incident dynamic fields
  const [incDesc, setIncDesc] = useState('');
  const [incSeverity, setIncSeverity] = useState('Medium');
  const [incAction, setIncAction] = useState('');

  // RCA dynamic fields
  const [rcaSummary, setRcaSummary] = useState('');
  const [rcaRootCause, setRcaRootCause] = useState('');
  const [rcaFix, setRcaFix] = useState('');

  // Change dynamic fields
  const [changeProposed, setChangeProposed] = useState('');
  const [changeRisk, setChangeRisk] = useState('Low');
  const [changeRollback, setChangeRollback] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!settings.apiKey) {
      alert("API Key missing! Settings page me key save karein.");
      return;
    }

    setLoading(true);
    setCopied(false);
    setSaved(false);

    // Compile dynamic inputs based on selected template
    let compiledDetails = "";
    if (selectedTemplate === 'SOP') {
      compiledDetails = `Objective & Scope:\n${sopScope}\n\nPrerequisites:\n${sopPrereqs}\n\nStep-by-Step Procedure:\n${sopProcedure}`;
    } else if (selectedTemplate === 'KB') {
      compiledDetails = `Symptoms & Problem:\n${kbSymptoms}\n\nRoot Cause:\n${kbRootCause}\n\nResolution Steps:\n${kbResolution}`;
    } else if (selectedTemplate === 'Incident') {
      compiledDetails = `Incident Description:\n${incDesc}\n\nSeverity Level: ${incSeverity}\n\nImmediate Actions Taken:\n${incAction}`;
    } else if (selectedTemplate === 'RCA') {
      compiledDetails = `Incident Summary:\n${rcaSummary}\n\nRoot Cause Analysis:\n${rcaRootCause}\n\nPreventative Actions:\n${rcaFix}`;
    } else if (selectedTemplate === 'Change') {
      compiledDetails = `Proposed System Change:\n${changeProposed}\n\nRisk Assessment: ${changeRisk}\n\nRollback & Testing Plan:\n${changeRollback}`;
    }

    try {
      const promptText = `Write a professional enterprise IT documentation in strict, formal English using Markdown formatting.
      Template Type: ${selectedTemplate}
      Document Title: ${title}
      Details/Inputs Provided:
      ${compiledDetails}
      
      Structure requirements for ${selectedTemplate}:
      - If SOP: Purpose, Scope, Prerequisites, Step-by-Step Procedure, Verification, Rollback/Troubleshooting.
      - If KB Article: Problem Description, Symptoms, Root Cause, Solution (Step-by-Step), Related links/references.
      - If Incident Report: Incident Summary, Severity, Timeline, Impact, Immediate Action Taken, Status.
      - If RCA: Event Summary, Root Cause Analysis (5-Whys), Preventative Actions, Long-term recommendations.
      - If Change Request: Change Description, Business Justification, Implementation Plan, Risk Level, Test Plan, Rollback Plan.
      
      Do not write any introductory conversational text. Output ONLY the document content in markdown starting directly with a '# ${title}' heading.`;

      const doc = await callAIService({
        systemPrompt: "You are an IT Documentation bot. Generate clear, structured markdown documents in professional English.",
        prompt: promptText
      });
      setGeneratedDoc(doc);
    } catch (err) {
      console.error(err);
      alert(`Document generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKB = () => {
    if (!generatedDoc) return;

    // Create a Knowledge Base Item
    const item = {
      id: Date.now().toString(),
      title: title,
      problem: `Generated ${selectedTemplate} Document`,
      solution: generatedDoc,
      category: 'general',
      tags: [selectedTemplate.toLowerCase(), 'generated'],
      severity: 'low',
      date: new Date().toLocaleDateString()
    };

    onSaveToKnowledge(item);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
          📝 ITSM Document Generator
        </h1>
        <p className="text-textMuted mt-1">Generate professional IT templates (SOPs, RCAs, Changes) ready to file in ticketing tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">1. Select Document Type</label>
              <div className="space-y-2">
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tmpl.id);
                      setGeneratedDoc('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold flex flex-col justify-between transition-all ${
                      selectedTemplate === tmpl.id
                        ? 'bg-primaryAccent/15 border-primaryAccent text-textPrimary'
                        : 'bg-sidebarBg border-gray-800 text-textMuted hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{tmpl.name}</span>
                      <ArrowRight size={12} className={selectedTemplate === tmpl.id ? 'opacity-100' : 'opacity-35'} />
                    </div>
                    <span className="text-[10px] text-textMuted font-normal mt-0.5">{tmpl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 pt-2 border-t border-gray-850">
              <div>
                <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">2. Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g. ${
                    selectedTemplate === 'SOP' ? 'SOP: Active Directory Password Reset' :
                    selectedTemplate === 'KB' ? 'KB: Outlook Credential Prompt Fix' :
                    selectedTemplate === 'Incident' ? 'INC-8291: Primary DC01 Network Failure' :
                    selectedTemplate === 'RCA' ? 'RCA: DHCP Scope Exhaustion' :
                    'CR-4821: Local Subnet Range Expansion'
                  }`}
                  className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent"
                />
              </div>

              {/* Dynamic Inputs based on Template */}
              <div className="space-y-4 pt-1">
                <label className="block text-xs font-semibold text-primaryAccent uppercase tracking-wider border-b border-gray-850 pb-1.5">3. Provide Raw Details</label>
                
                {selectedTemplate === 'SOP' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Objective / Scope (Kaam kya hai aur kiske liye hai)</span>
                      <textarea
                        required
                        rows="2"
                        value={sopScope}
                        onChange={(e) => setSopScope(e.target.value)}
                        placeholder="e.g. Reset user passwords in Active Directory Domain Services securely."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Prerequisites (Required server access or software)</span>
                      <input
                        type="text"
                        required
                        value={sopPrereqs}
                        onChange={(e) => setSopPrereqs(e.target.value)}
                        placeholder="e.g. Domain Controller login, Admin rights in Active Directory."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Step-by-Step Procedure (Kaise karte hain, raw instructions)</span>
                      <textarea
                        required
                        rows="4"
                        value={sopProcedure}
                        onChange={(e) => setSopProcedure(e.target.value)}
                        placeholder="e.g. Open ADUC, search user principal name, right click and choose Reset Password, set temp password, check force change at logon."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate === 'KB' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Symptoms & Problem (User ko kya error aa raha hai)</span>
                      <textarea
                        required
                        rows="2"
                        value={kbSymptoms}
                        onChange={(e) => setKbSymptoms(e.target.value)}
                        placeholder="e.g. Outlook repeatedly prompts the user for login credentials every 5 minutes."
                        className="w-full bg-sidebarBg border border-gray-850 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Root Cause (Problem kyun aa rahi hai - raw details)</span>
                      <input
                        type="text"
                        required
                        value={kbRootCause}
                        onChange={(e) => setKbRootCause(e.target.value)}
                        placeholder="e.g. Corrupted credential entry in Windows Credential Manager."
                        className="w-full bg-sidebarBg border border-gray-850 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Resolution Steps (Problem solve kaise karein)</span>
                      <textarea
                        required
                        rows="4"
                        value={kbResolution}
                        onChange={(e) => setKbResolution(e.target.value)}
                        placeholder="e.g. Open Control Panel, select Credential Manager, select Windows Credentials, find and delete the MS.Outlook cached entries, restart Outlook."
                        className="w-full bg-sidebarBg border border-gray-850 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate === 'Incident' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Incident Description (Kya system crash ya error hua)</span>
                      <textarea
                        required
                        rows="3"
                        value={incDesc}
                        onChange={(e) => setIncDesc(e.target.value)}
                        placeholder="e.g. DC01 server lost network connectivity. Users are unable to resolve DNS domains internally."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Severity / Priority</span>
                      <select
                        value={incSeverity}
                        onChange={(e) => setIncSeverity(e.target.value)}
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent"
                      >
                        <option value="Critical (P1)">P1 - Critical (Entire service down)</option>
                        <option value="High (P2)">P2 - High (Major business impact)</option>
                        <option value="Medium (P3)">P3 - Medium (Workaround available)</option>
                        <option value="Low (P4)">P4 - Low (No business disruption)</option>
                      </select>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Immediate Actions Taken (System ko up karne ke liye kya kiya)</span>
                      <textarea
                        required
                        rows="3"
                        value={incAction}
                        onChange={(e) => setIncAction(e.target.value)}
                        placeholder="e.g. Logged into hypervisor host, rebooted DC01 virtual machine, restarted DNS service. Internal name resolution restored."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate === 'RCA' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Incident Summary (Downtime/failure summary)</span>
                      <textarea
                        required
                        rows="2"
                        value={rcaSummary}
                        onChange={(e) => setRcaSummary(e.target.value)}
                        placeholder="e.g. Local network DHCP scope was 100% exhausted, causing new workstations to fail IP allocations."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Root Cause (Failure kyun aayi details)</span>
                      <textarea
                        required
                        rows="3"
                        value={rcaRootCause}
                        onChange={(e) => setRcaRootCause(e.target.value)}
                        placeholder="e.g. Lease duration was set to 8 days, keeping addresses reserved for users who already left the building. Mobile devices filled up the pool."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Preventative Action (Permanently block karne ke liye updates)</span>
                      <textarea
                        required
                        rows="3"
                        value={rcaFix}
                        onChange={(e) => setRcaFix(e.target.value)}
                        placeholder="e.g. Reduced DHCP lease duration to 8 hours. Separated dynamic pools, and configured subnet VLAN partitioning."
                        className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate === 'Change' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Proposed Change Description (System me kya update karna hai)</span>
                      <textarea
                        required
                        rows="3"
                        value={changeProposed}
                        onChange={(e) => setChangeProposed(e.target.value)}
                        placeholder="e.g. Upgrading domain controller security algorithms and linking new Win11 screen lock GPO."
                        className="w-full bg-sidebarBg border border-gray-850 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Risk Assessment / Level</span>
                      <select
                        value={changeRisk}
                        onChange={(e) => setChangeRisk(e.target.value)}
                        className="w-full bg-sidebarBg border border-gray-850 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent"
                      >
                        <option value="High (Service disruption possible)">High - Needs off-hours execution</option>
                        <option value="Medium (Low user disruption)">Medium - Staging check first</option>
                        <option value="Low (No disruption expected)">Low - Safe to run during work hours</option>
                      </select>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-textMuted uppercase mb-1">Rollback & Test Plan (Agar change fail hua to restart/undo plan)</span>
                      <textarea
                        required
                        rows="3"
                        value={changeRollback}
                        onChange={(e) => setChangeRollback(e.target.value)}
                        placeholder="e.g. Rollback plan: Unlink the new GPO, run gpupdate /force on target clients, verify previous configurations are restored."
                        className="w-full bg-sidebarBg border border-gray-850 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Generating Documentation...
                  </>
                ) : (
                  <>
                    <FileText size={14} />
                    Generate Document
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 min-h-[480px] flex flex-col justify-between">
            {generatedDoc ? (
              <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                <div>
                  <div className="flex items-center justify-between border-b border-gray-850 pb-3 mb-4 shrink-0">
                    <span className="text-xs font-mono text-textMuted uppercase">
                      Generated Output (Markdown)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 bg-sidebarBg hover:bg-gray-800 text-textMuted hover:text-textPrimary px-2.5 py-1 rounded text-[10px] font-bold border border-gray-850 transition-colors"
                      >
                        {copied ? <Check size={10} className="text-successGreen" /> : <Copy size={10} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={handleSaveKB}
                        className="flex items-center gap-1 bg-sidebarBg hover:bg-gray-800 text-textMuted hover:text-textPrimary px-2.5 py-1 rounded text-[10px] font-bold border border-gray-850 transition-colors"
                      >
                        {saved ? <Check size={10} className="text-successGreen" /> : <Save size={10} />}
                        {saved ? 'Saved!' : 'Save to KB'}
                      </button>
                    </div>
                  </div>
                  {/* Markdown rendering output box */}
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed max-h-[440px] overflow-y-auto pr-1">
                    <pre className="whitespace-pre-wrap font-sans text-textPrimary bg-transparent border-0 p-0 overflow-x-visible">
                      {generatedDoc}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <FileText className="text-textMuted mb-3 opacity-30 animate-pulse" size={44} />
                <h3 className="text-sm font-bold text-textPrimary">No Document Generated Yet</h3>
                <p className="text-xs text-textMuted mt-1">Fill in the sidebar form and click 'Generate Document' to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
