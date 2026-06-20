import React, { useState, useEffect, useRef } from 'react';
import { Play, Send, Loader, Check, BookOpen, Terminal, ArrowRight, ClipboardList } from 'lucide-react';
import { callAIService } from '../utils/aiService';

export default function TicketSimulator({ onSaveToKnowledge }) {
  const [tier, setTier] = useState('L1 Support (Desktop)');
  const [ticket, setTicket] = useState(null); // { id, title, description, priority, category, user, status, tasks: [] }
  const [logs, setLogs] = useState([]); // Array of { role: 'system' | 'user', content: '', rating?: number }
  const [actionInput, setActionInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null); // { score, feedback, rca, method, kbSolution }
  const [completedTasks, setCompletedTasks] = useState({}); // { [idx]: boolean }

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleGenerateTicket = async () => {
    setLoading(true);
    setTicket(null);
    setLogs([]);
    setEvaluation(null);
    setActionInput('');
    setCompletedTasks({});

    try {
      const promptText = `Generate a realistic IT support ticket for a ${tier} engineer.
      The ticket should involve common issues in Active Directory, M365, networking, printer configuration, server roles, or hardware crashes.
      Provide realistic user descriptions (including typical mistakes or clues).
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "id": "INC-8392",
        "title": "Short ticket title",
        "description": "Full description from the user reporting the issue",
        "priority": "P1-Critical|P2-High|P3-Medium|P4-Low",
        "category": "active_directory|networking|azure|m365|linux|powershell|hardware|general",
        "user": "Full name of reporting employee",
        "tasks": [
          "Check local system diagnostic indicators or basic connection logs",
          "Isolate the root cause of the error or check server permissions",
          "Apply the corrective command, script, or settings tweak",
          "Confirm fix is operational and request client confirmation"
        ]
      }`;

      const responseText = await callAIService({
        systemPrompt: "You are a ticket generation system that outputs raw JSON only.",
        prompt: promptText
      });

      const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      const ticketData = { 
        ...parsed, 
        tasks: parsed.tasks || [
          "Check system logs or run initial diagnostics",
          "Identify and isolate the root cause",
          "Apply corrective fix or run commands",
          "Confirm solution is working with client"
        ],
        status: 'Open' 
      };
      setTicket(ticketData);
      
      // Seed first system message
      setLogs([
        {
          role: 'system',
          content: `📥 **New Ticket Assigned**\n\n**User:** ${ticketData.user}\n**Problem:** ${ticketData.description}\n\n*Action check:* Kripya problem diagnose karein aur solution start karne ke liye logs mein check steps type karein.`
        }
      ]);
    } catch (e) {
      console.error(e);
      alert(`Ticket generation failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep = async (e) => {
    e.preventDefault();
    if (!actionInput.trim() || evaluating) return;

    const userText = actionInput.trim();
    setActionInput('');

    const newLogs = [...logs, { role: 'user', content: userText }];
    setLogs(newLogs);
    setEvaluating(true);

    try {
      const promptText = `The engineer is troubleshooting the following ticket:
      Ticket Title: "${ticket.title}"
      Ticket Description: "${ticket.description}"
      
      Logs so far:
      ${newLogs.map(l => `${l.role === 'user' ? 'Engineer' : 'System/Client'}: ${l.content}`).join('\n')}
      
      Analyze the Engineer's latest troubleshooting step: "${userText}".
      Provide the system's output response or the customer's answer. Rate this step out of 10 for technical accuracy.
      Decide if the ticket is solved based on this step.
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "response": "the system's output or customer's reply (write in Hinglish)",
        "rating": 8,
        "isSolved": false
      }`;

      const responseText = await callAIService({
        systemPrompt: "You are an IT ticket simulation engine. Evaluate the step and output raw JSON only.",
        prompt: promptText
      });

      const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      const updatedLogs = [
        ...newLogs,
        {
          role: 'system',
          content: `⚡ **System Output / User Response:**\n${parsed.response}`,
          rating: parsed.rating
        }
      ];
      setLogs(updatedLogs);

      if (parsed.isSolved) {
        setTicket(prev => ({ ...prev, status: 'Solved' }));
        handleEvaluateTicket(updatedLogs, parsed.response);
      }
    } catch (e) {
      console.error(e);
      alert(`Step evaluation failed: ${e.message}`);
    } finally {
      setEvaluating(false);
    }
  };

  const handleEvaluateTicket = async (currentLogs, lastResponse) => {
    setEvaluating(true);
    try {
      const allLogs = currentLogs || logs;
      const promptText = `The ticket troubleshooting simulation has concluded.
      Ticket: "${ticket.title}"
      
      Troubleshooting Logs:
      ${allLogs.map(l => `${l.role === 'user' ? 'Engineer' : 'System'}: ${l.content}`).join('\n')}
      
      Evaluate the entire troubleshooting session. Give an overall score (0 to 100).
      Write a short Hinglish feedback summary detailing what was good and what could be optimized.
      Provide the structured resolution details to save to the Knowledge Base.
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "score": 85,
        "feedback": "Overall summary of the engineer's performance in Hinglish.",
        "rca": "Root Cause Analysis details (written in English) for saving to the KB.",
        "method": "Resolution method and step-by-step diagnostic/remediation procedure followed by the engineer (written in English).",
        "kbSolution": "Final permanent resolution steps (written in English) for saving to the KB."
      }`;

      const responseText = await callAIService({
        systemPrompt: "You are a senior IT manager grading a support ticket. Output raw JSON only.",
        prompt: promptText
      });

      const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const evalResult = JSON.parse(cleaned);

      setEvaluation(evalResult);
      setTicket(prev => ({ ...prev, status: 'Closed' }));
    } catch (e) {
      console.error(e);
      alert(`Final evaluation failed: ${e.message}`);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveToKB = () => {
    if (!evaluation || !ticket) return;

    onSaveToKnowledge({
      title: `RCA: ${ticket.id} - ${ticket.title}`,
      problem: ticket.description,
      solution: `Root Cause:\n${evaluation.rca}\n\nResolution Method:\n${evaluation.method || 'Troubleshooting logs review'}\n\nResolution:\n${evaluation.kbSolution}`,
      category: ticket.category,
      severity: ticket.priority.toLowerCase().split('-')[0],
      tags: ['simulated', ticket.category]
    });

    alert("Resolved Ticket successfully saved to Knowledge Base!");
  };

  const toggleTask = (idx) => {
    setCompletedTasks(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            🎫 Ticket Simulator (ITSM Portal)
          </h1>
          <p className="text-textMuted mt-1">Practice resolving real-world helpdesk tickets, apply commands, and get scored.</p>
        </div>
        
        {/* Tier Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            disabled={loading || (ticket && ticket.status !== 'Closed')}
            className="bg-cardBg border border-gray-800 text-textPrimary text-xs font-semibold py-2 px-3 rounded-lg focus:outline-none focus:border-primaryAccent"
          >
            <option value="L1 Support (Desktop)">L1 Support (Desktop / OS)</option>
            <option value="L2 Support (Sysadmin)">L2 Support (AD / Server / GPO)</option>
            <option value="L3 Support (Cloud/Network)">L3 Support (Azure / M365 / Cisco)</option>
          </select>
          
          <button
            onClick={handleGenerateTicket}
            disabled={loading}
            className="bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-xs flex items-center gap-1.5"
          >
            {loading ? <Loader size={12} className="animate-spin" /> : <Play size={12} />}
            New Ticket
          </button>
        </div>
      </div>

      {ticket ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Ticket Info & Tasks */}
          <div className="space-y-6">
            <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-850 pb-3">
                <span className="text-sm font-bold font-mono text-primaryAccent">{ticket.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  ticket.status === 'Closed' 
                    ? 'bg-successGreen/10 border-successGreen/30 text-successGreen'
                    : ticket.status === 'Solved'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {ticket.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-textPrimary mb-1">{ticket.title}</h3>
                <p className="text-xs text-textMuted flex items-center gap-1.5">
                  <span>User: **{ticket.user}**</span>
                  <span>•</span>
                  <span className="uppercase text-primaryAccent font-semibold">{ticket.category}</span>
                </p>
              </div>

              <div className="bg-darkBg/60 border border-gray-850 rounded-lg p-3 text-xs leading-relaxed text-textPrimary">
                <span className="block text-[10px] font-bold text-textMuted uppercase tracking-wider mb-1">Issue Description</span>
                {ticket.description}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-textMuted">Priority:</span>
                <span className="font-bold text-red-400 uppercase font-mono">{ticket.priority}</span>
              </div>
            </div>

            {/* Troubleshooting Tasks Checklist */}
            {ticket.tasks && (
              <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3 animate-fadeIn">
                <h4 className="text-xs font-bold text-textPrimary flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  <ClipboardList size={14} className="text-primaryAccent" />
                  <span>Troubleshooting Checklist</span>
                </h4>
                <div className="space-y-2">
                  {ticket.tasks.map((task, idx) => {
                    const isChecked = !!completedTasks[idx];
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer select-none transition-all text-[11px] font-medium ${
                          isChecked
                            ? 'border-successGreen/30 bg-successGreen/5 text-successGreen'
                            : 'border-gray-850 bg-sidebarBg/20 text-textSecondary hover:border-gray-800'
                        }`}
                        onClick={() => toggleTask(idx)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="accent-successGreen mt-0.5 cursor-pointer"
                        />
                        <span className={isChecked ? 'line-through text-successGreen/75' : ''}>
                          {task}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scorecard block when closed */}
            {evaluation && (
              <div className="bg-successGreen/5 border border-successGreen/20 rounded-xl p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                  <span className="text-xs font-bold text-successGreen uppercase tracking-wider">Evaluation Card</span>
                  <span className="text-lg font-bold font-mono text-successGreen">{evaluation.score}/100</span>
                </div>
                <p className="text-xs leading-relaxed text-textSecondary">{evaluation.feedback}</p>
                
                {/* Details Section */}
                <div className="space-y-3 pt-2 border-t border-gray-850 text-[11px] leading-relaxed">
                  <div>
                    <span className="font-bold text-primaryAccent block mb-0.5">Root Cause (RCA):</span>
                    <p className="text-textSecondary bg-darkBg/30 p-2 rounded border border-gray-850">{evaluation.rca}</p>
                  </div>
                  {evaluation.method && (
                    <div>
                      <span className="font-bold text-amber-400 block mb-0.5">Resolution Method:</span>
                      <p className="text-textSecondary bg-darkBg/30 p-2 rounded border border-gray-850">{evaluation.method}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-successGreen block mb-0.5">Permanent Fix:</span>
                    <p className="text-textSecondary bg-darkBg/30 p-2 rounded border border-gray-850">{evaluation.kbSolution}</p>
                  </div>
                </div>

                <button
                  onClick={handleSaveToKB}
                  className="w-full flex items-center justify-center gap-1.5 bg-sidebarBg hover:bg-gray-800 text-textPrimary text-xs font-bold py-2 rounded-lg border border-gray-850 transition-colors mt-2"
                >
                  <BookOpen size={12} />
                  Save to Knowledge Base
                </button>
              </div>
            )}
          </div>

          {/* Right panel: Log console */}
          <div className="lg:col-span-2 flex flex-col bg-cardBg border border-gray-800 rounded-xl overflow-hidden h-[540px]">
            {/* Thread Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                      log.role === 'user'
                        ? 'bg-primaryAccent text-white rounded-br-none font-mono'
                        : 'bg-darkBg border border-gray-850 text-textPrimary rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{log.content}</div>
                    
                    {log.rating !== undefined && (
                      <div className="mt-2 pt-1 border-t border-gray-800 flex items-center justify-between text-[10px] text-textMuted">
                        <span>AI Accuracy Grade:</span>
                        <span className="font-bold text-amber-400 font-mono">{log.rating}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {evaluating && (
                <div className="flex justify-start">
                  <div className="bg-darkBg border border-gray-850 text-textMuted rounded-xl rounded-bl-none px-4 py-2 text-xs flex items-center gap-2">
                    <Loader size={12} className="animate-spin text-primaryAccent" />
                    <span>AI is evaluating troubleshooting step...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            {ticket.status !== 'Closed' && ticket.status !== 'Solved' && (
              <form onSubmit={handleSubmitStep} className="p-3 border-t border-gray-800 bg-sidebarBg flex items-center gap-2">
                <input
                  type="text"
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  disabled={evaluating}
                  placeholder="Type troubleshooting action... e.g. run ping, verify AD settings..."
                  className="flex-1 bg-cardBg border border-gray-800 rounded-lg py-2 px-3 text-xs text-textPrimary focus:outline-none focus:border-primaryAccent"
                />
                
                <button
                  type="submit"
                  disabled={evaluating || !actionInput.trim()}
                  className="bg-primaryAccent hover:bg-indigo-700 text-white rounded-lg p-2 transition-all disabled:opacity-50"
                >
                  <Send size={14} className="transform rotate-45" />
                </button>
                
                {logs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleEvaluateTicket()}
                    className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition-all"
                  >
                    Resolve
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-cardBg border border-gray-800 rounded-xl p-16 text-center max-w-lg mx-auto">
          <Terminal className="mx-auto text-textMuted mb-4 opacity-40 animate-pulse" size={44} />
          <h3 className="text-lg font-bold text-textPrimary">ITS Simulator Console Offline</h3>
          <p className="text-textMuted text-xs mt-1.5 leading-relaxed">
            Select a Tier (L1 Support for Desktop support, L2 for Active Directory setups) and click **"New Ticket"** to launch an interactive live troubleshooting training sandbox.
          </p>
        </div>
      )}
    </div>
  );
}
