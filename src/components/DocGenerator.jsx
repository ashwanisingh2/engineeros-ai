import React, { useState } from 'react';
import { FileText, Copy, Save, AlertCircle, Loader, Check, ArrowRight } from 'lucide-react';
import { callAIService } from '../utils/aiService';

const TEMPLATES = [
  { id: 'SOP', name: 'Standard Operating Procedure (SOP)', placeholder: 'Describe the task. e.g. Resetting AD User Passwords, or Deploying a printer via Intune' },
  { id: 'KB', name: 'Knowledge Base (KB) Article', placeholder: 'Describe the issue and resolution. e.g. Outlook prompts for credentials after migration' },
  { id: 'Incident', name: 'Incident Report', placeholder: 'Describe what happened, impact, and immediate action. e.g. DC01 replication failure affecting login times' },
  { id: 'RCA', name: 'Root Cause Analysis (RCA)', placeholder: 'Detail the root cause and permanent fix. e.g. DHCP scope exhaustion due to VLAN configuration issue' },
  { id: 'Change', name: 'Change Request', placeholder: 'Describe the planned change, risk, and rollback plan. e.g. Linking new Win11 Desktop GPO to corporate OU' }
];

export default function DocGenerator({ settings, onSaveToKnowledge }) {
  const [selectedTemplate, setSelectedTemplate] = useState('SOP');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (!settings.apiKey) {
      alert("Claude API Key missing! Settings page me key save karein.");
      return;
    }

    setLoading(true);
    setCopied(false);
    setSaved(false);

    try {
      const promptText = `Write a professional enterprise IT documentation in strict, formal English using Markdown formatting.
      Template Type: ${selectedTemplate}
      Document Title: ${title}
      Description/Details: ${description}
      
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
          📝 ITSM Document Generator
        </h1>
        <p className="text-textMuted mt-1">Generate professional, English-based IT templates (SOPs, RCAs, Changes) ready to file in ticketing tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleGenerate} className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Select Template</label>
              <div className="space-y-2">
                {TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tmpl.id);
                      setGeneratedDoc('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedTemplate === tmpl.id
                        ? 'bg-primaryAccent/15 border-primaryAccent text-textPrimary'
                        : 'bg-sidebarBg border-gray-800 text-textMuted hover:border-gray-700'
                    }`}
                  >
                    <span>{tmpl.name}</span>
                    <ArrowRight size={12} className={selectedTemplate === tmpl.id ? 'opacity-100' : 'opacity-30'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Document Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SOP: AD Account Unlock Procedures"
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Details / Inputs</label>
              <textarea
                required
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={TEMPLATES.find(t => t.id === selectedTemplate)?.placeholder}
                className="w-full bg-sidebarBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim() || !description.trim()}
              className="w-full bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
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

        {/* Right Output */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-cardBg border border-gray-800 rounded-xl p-5 min-h-[380px] flex flex-col justify-between">
            {generatedDoc ? (
              <div className="flex-1 flex flex-col justify-between">
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
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed max-h-[360px] overflow-y-auto pr-1">
                    <pre className="whitespace-pre-wrap font-sans text-textPrimary bg-transparent border-0 p-0 overflow-x-visible">
                      {generatedDoc}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <FileText className="text-textMuted mb-3 opacity-30" size={32} />
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
