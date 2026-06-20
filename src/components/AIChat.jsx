import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, ShieldAlert, BookOpen, Terminal, Check, Plus, Loader, Menu, ChevronLeft, MessageSquare } from 'lucide-react';
import { callAIService } from '../utils/aiService';

const SYSTEM_PROMPT = `You are EngineerOS AI — a senior IT engineer and mentor helping an IT professional grow from Desktop Support L1 to System Administrator / Cloud Engineer level.

YOUR TECHNICAL EXPERTISE COVERS:
- Computer Hardware: motherboard, CPU, RAM, storage, RAID, troubleshooting BSOD/boot/display issues
- CCNA Networking: OSI model, TCP/IP, VLANs, trunking, inter-VLAN routing, OSPF, ACLs, NAT, subnetting
- Windows Server 2022: AD DS, DNS, DHCP, GPO, FSMO roles, RODC, ADC, CDC, DFS, FSRM, iSCSI, RAID, Hyper-V, BitLocker, NLB, Failover Cluster, RRAS VPN
- RHCSA Linux: bash commands, file permissions, user/group management, systemd services, SSH, RPM/YUM/DNF, LVM, file systems
- Virtualization: VMware vSphere/ESXi/vCenter, Hyper-V, VirtualBox
- PowerShell: AD module, Exchange Online module, Microsoft Graph, error handling, automation scripts
- Microsoft 365 / MS-102: Entra ID, Conditional Access, MFA, SSPR, Exchange Online, Teams, SharePoint, OneDrive, Defender for Office 365, DLP, Purview, Intune
- AZ-900: Cloud concepts, Azure architecture, compute, networking, storage, identity, security, cost management
- AZ-104: Azure identities/RBAC, storage accounts, VMs/VMSS/App Services, VNets/NSG/peering/VPN Gateway/Load Balancer, Azure Monitor/Backup, ARM templates
- MD-102 / Intune: Device enrollment (Windows/Android/iOS), compliance policies, configuration profiles, Win32 app deployment, Windows Autopilot, BitLocker, update rings, Conditional Access, co-management
- SCCM/MECM: Site roles, discovery methods, boundaries, device collections, application deployment, OSD, WSUS, software updates, reporting
- AWS Fundamentals: EC2, VPC, subnets, internet gateway, NAT gateway, S3, AMI, snapshots, security groups, IAM basics
- ITSM / Ticketing: Incident management, ticket lifecycle, SLA, escalation, ITIL basics

COMMUNICATION STYLE:
Speak in Hinglish — natural mix of Hindi and English, exactly like Indian IT engineers talk to each other.

Rules:
- Technical terms, commands, error messages ALWAYS in English
- Explanations, steps, tips, encouragement in Hinglish
- Simple, conversational — jaise senior colleague baat kar raha ho
- Do NOT write formal English or pure Hindi

Examples:
BAD: "Please verify that the DNS resolution is functioning correctly."
GOOD: "Pehle DNS resolution check karo — nslookup se test karo."

BAD: "The Group Policy Object has been successfully linked."  
GOOD: "GPO link ho gaya! Ab gpupdate /force run karo aur verify karo."

BAD: "I recommend reviewing the Event Viewer logs."
GOOD: "Event Viewer mein dekho — System aur Application logs check karo, wahan error milega."

FOR TROUBLESHOOTING — Always use this format:
---
**LIKELY CAUSE:** [Most probable reason — Hinglish mein]

**INVESTIGATION STEPS:**
1. [Pehle yeh check karo]
2. [Phir yeh]
3. [Phir yeh]

**COMMANDS:**
\`\`\`powershell
# Paste-ready commands here
\`\`\`

**FIX:**
[Clear steps — Hinglish mein]

**VERIFY KARO:**
[How to confirm it worked]

**DHYAN RAHO:**
[Any warnings or gotchas]
---

FOR POWERSHELL SCRIPTS:
- Always production-ready with try/catch error handling
- Comments har section pe
- Note karo: "Administrator ke saath run karna hai" if needed
- Note karo: which modules to import first

FOR INTERVIEW QUESTIONS:
- Generate realistic questions that Indian IT companies actually ask
- Answer detailed but practical — theoretical + real-world example dono
- Difficulty: mark each as [Easy] [Medium] [Hard]
- Format: Q: ... A: ...

FOR DOCUMENT GENERATION:
- SOPs and KB Articles ALWAYS in professional English (these are shared docs)
- Only chat responses in Hinglish

IMPORTANT RULES:
1. No unnecessary disclaimers — seedha answer do
2. Deprecated commands mat use karo (e.g., use Get-MgUser not Get-AzureADUser)
3. Mark risky commands: ⚠️ WARNING: Production pe test karo pehle
4. When generating quiz questions, vary difficulty and include trick questions
5. If something needs Global Admin in M365, mention karo
6. Azure suggestions mein cost impact mention karo jab relevant ho

After any troubleshooting answer, append this JSON block (app uses it to auto-save):
\`\`\`knowledge_extract
{"title":"","problem":"","solution":"","category":"windows|networking|azure|m365|linux|powershell|intune|sccm|aws|hardware|general","tags":[],"severity":"low|medium|high|critical"}
\`\`\`

After any PowerShell script (5+ lines), append:
\`\`\`script_meta
{"title":"","description":"","category":""}
\`\`\``;

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `Suno techie! Main hoon aapka **EngineerOS AI Copilot**. L1 Support se Sysadmin L2/L3 ya Cloud Admin banne ki journey mein main aapka saathi hoon.

Aap mujhse hardware, networking (CCNA), Active Directory, Windows Server, Azure, AWS, PowerShell scripts ya ticketing tools ke baare mein kuch bhi puch sakte hain.

Aap kya explore karna chahte hain? Neeche diye quick actions use karein ya seedha query enter karein!`,
};

export default function AIChat({ settings, onSaveToKnowledge, onSaveToScripts }) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSaveToast, setActiveSaveToast] = useState(null);

  const chatEndRef = useRef(null);

  // Load sessions on mount
  useEffect(() => {
    const saved = localStorage.getItem('engineeros_chat_sessions');
    let loadedSessions = [];
    if (saved) {
      try {
        loadedSessions = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing chat sessions", e);
      }
    }

    if (loadedSessions.length === 0) {
      const initial = {
        id: Date.now().toString(),
        title: "New Chat",
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        messages: [WELCOME_MESSAGE]
      };
      loadedSessions = [initial];
    }
    setSessions(loadedSessions);
    setActiveSessionId(loadedSessions[0].id);
  }, []);

  // Save sessions to localStorage
  const saveSessions = (updatedSessions) => {
    setSessions(updatedSessions);
    localStorage.setItem('engineeros_chat_sessions', JSON.stringify(updatedSessions));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [WELCOME_MESSAGE];

  const handleStartNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: "New Chat",
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      messages: [WELCOME_MESSAGE]
    };
    
    // Max 20 sessions - slice the oldest (which is at the end of the array)
    const updated = [newSession, ...sessions].slice(0, 20);
    saveSessions(updated);
    setActiveSessionId(newSession.id);
    setInput('');
    setErrorMsg('');
    setActiveSaveToast(null);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setErrorMsg('');
    setActiveSaveToast(null);
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      // Just clear current chat
      const cleared = [{
        id: Date.now().toString(),
        title: "New Chat",
        date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        messages: [WELCOME_MESSAGE]
      }];
      saveSessions(cleared);
      setActiveSessionId(cleared[0].id);
      return;
    }

    const filtered = sessions.filter(s => s.id !== id);
    saveSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const extractJsonBlocks = (text) => {
    // Parse knowledge extracts
    const knowRegex = /```knowledge_extract\n([\s\S]*?)\n```/;
    const knowMatch = text.match(knowRegex);
    if (knowMatch) {
      try {
        const parsed = JSON.parse(knowMatch[1].trim());
        if (parsed.title) {
          setActiveSaveToast({ type: 'knowledge', data: parsed });
        }
      } catch (e) {
        console.error("Failed to parse knowledge extract JSON", e);
      }
    }

    // Parse script metadata
    const scriptRegex = /```script_meta\n([\s\S]*?)\n```/;
    const scriptMatch = text.match(scriptRegex);
    if (scriptMatch) {
      try {
        const parsed = JSON.parse(scriptMatch[1].trim());
        const codeBlockRegex = /```powershell\n([\s\S]*?)\n```/i;
        const codeMatch = text.match(codeBlockRegex);
        const scriptCode = codeMatch ? codeMatch[1].trim() : '';
        if (parsed.title && scriptCode) {
          setActiveSaveToast({ type: 'script', data: { ...parsed, script: scriptCode } });
        }
      } catch (e) {
        console.error("Failed to parse script meta JSON", e);
      }
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!settings?.apiKey) {
      setErrorMsg("API Key missing! Settings page par jaakar API Key set karein.");
      return;
    }

    setErrorMsg('');
    setActiveSaveToast(null);
    if (!textToSend) setInput('');

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMsg];

    // Determine session title auto-update on first user message
    let sessionTitle = activeSession.title;
    if (sessionTitle === "New Chat" && messages.length <= 1) {
      sessionTitle = text.slice(0, 40) + (text.length > 40 ? '...' : '');
    }

    // Update active session with user message
    let updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, title: sessionTitle, messages: updatedMessages };
      }
      return s;
    });

    saveSessions(updatedSessions);
    setLoading(true);

    try {
      const systemPrompt = SYSTEM_PROMPT + (settings.language === 'English' ? "\nOverride communication style: ONLY explain in professional English." : "");
      const assistantText = await callAIService({
        systemPrompt,
        messages: updatedMessages.filter(m => m.id !== 'welcome')
      });

      const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: assistantText, timestamp: new Date().toISOString() };
      
      // Update active session with assistant message
      updatedSessions = sessions.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, title: sessionTitle, messages: [...updatedMessages, assistantMsg] };
        }
        return s;
      });

      saveSessions(updatedSessions);
      extractJsonBlocks(assistantText);
    } catch (err) {
      console.error(err);
      setErrorMsg(`API Request Failed: ${err.message}. Verify settings API keys.`);
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = (actionType) => {
    let prompt = "";
    if (actionType === "Troubleshoot") {
      prompt = "System par BSOD (Blue Screen of Death) code 0x0000007B aa raha hai. Ise troubleshoot karne ke steps batayein.";
    } else if (actionType === "Explain This") {
      prompt = "Active Directory (AD) mein FSMO roles kya hote hain? Simple words mein explain karo.";
    } else if (actionType === "Generate PowerShell") {
      prompt = "Ek PowerShell script likho jo local Active Directory se disabled accounts list kare aur CSV export kare.";
    } else if (actionType === "Write SOP") {
      prompt = "Windows Server 2022 mein Active Directory Domain Controller setup karne ka full SOP (Standard Operating Procedure) English mein likho.";
    } else if (actionType === "Quiz Me") {
      prompt = "CCNA Subnetting ke related ek interview question pucho (Hinglish mein) aur evaluation options do.";
    }
    setInput(prompt);
  };

  const handleSaveToastAction = () => {
    if (!activeSaveToast) return;
    if (activeSaveToast.type === 'knowledge') {
      onSaveToKnowledge(activeSaveToast.data);
    } else if (activeSaveToast.type === 'script') {
      onSaveToScripts(activeSaveToast.data);
    }
    setActiveSaveToast(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] overflow-hidden">
      {/* Sessions Left Sidebar */}
      <div 
        className={`bg-sidebarBg border-r border-gray-800 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-56' : 'w-0'
        } overflow-hidden shrink-0`}
      >
        <div className="p-3 border-b border-gray-850 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-textMuted uppercase font-bold tracking-wider">Past Chats</span>
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1 text-[9px] bg-primaryAccent/10 border border-primaryAccent/20 hover:bg-primaryAccent/20 text-primaryAccent font-bold py-1 px-2 rounded transition-colors"
          >
            <Plus size={10} />
            New Chat
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(s => {
            const active = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer text-left text-xs transition-colors ${
                  active 
                    ? 'bg-primaryAccent/10 border border-primaryAccent/20 text-primaryAccent font-bold' 
                    : 'text-textSecondary hover:bg-gray-900/30'
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-1.5 flex-1">
                  <MessageSquare size={13} className="shrink-0 text-textMuted" />
                  <div className="truncate">
                    <span className="block truncate leading-tight">{s.title}</span>
                    <span className="text-[9px] text-textMuted font-mono block mt-0.5">{s.date} • {s.messages.length} msgs</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded transition-all shrink-0"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-darkBg">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-4 shrink-0 bg-sidebarBg/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-textMuted hover:text-textPrimary p-1.5 hover:bg-gray-900 rounded-lg transition-colors shrink-0"
              title="Toggle Sidebar"
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
            </button>
            <div>
              <h1 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                <span className="text-primaryAccent animate-pulse">●</span> {activeSession?.title || 'Copilot Chat'}
              </h1>
              <p className="text-[10px] text-textMuted mt-0.5">L1 to L2/L3 Sysadmin Career Accelerator</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (activeSessionId) {
                const clearedSessions = sessions.map(s => {
                  if (s.id === activeSessionId) {
                    return { ...s, messages: [WELCOME_MESSAGE] };
                  }
                  return s;
                });
                saveSessions(clearedSessions);
                setActiveSaveToast(null);
              }
            }}
            title="Clear Chat Messages"
            className="text-textMuted hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Quick Action Suggestions */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-darkBg border-b border-gray-850 shrink-0 select-none scrollbar-none">
          <button
            onClick={() => {
              // Trigger search for weak topics revision
              const savedMistakes = JSON.parse(localStorage.getItem('engineeros_mistakes') || '[]');
              if (savedMistakes.length === 0) {
                alert("No mistakes logged yet! Practice quizzes to collect data on your weak topics first.");
                return;
              }
              const counts = {};
              savedMistakes.forEach(m => {
                const t = m.topic || "General Concepts";
                counts[t] = (counts[t] || 0) + 1;
              });
              const listText = Object.entries(counts)
                .map(([topic, count]) => `- Topic: ${topic} (${count} mistakes)`)
                .join('\n');
              const promptText = `Pehle review karo mere weak areas aur in topics ke concepts clear karne ke liye ek revision plan system design karo.
  
Mene inn topics par standard quizzes me errors kiye hain:
${listText}
  
Please outline:
1. Gaps analysis: in subtopics me key points me kya confusion hoti hai.
2. Conceptual clarifications: briefly summarize the core correct logic for the top 3 weak areas (in Hinglish).
3. Next steps: study roadmap alignment actions.`;
              handleSend(promptText);
            }}
            className="text-xs shrink-0 bg-red-950/20 border border-red-900/60 text-red-400 hover:bg-red-900/40 px-3 py-1.5 rounded-full transition-all font-semibold flex items-center gap-1.5"
          >
            <ShieldAlert size={12} />
            Review my weak topics
          </button>
          {["Troubleshoot", "Explain This", "Generate PowerShell", "Write SOP", "Quiz Me"].map((act) => (
            <button
              key={act}
              onClick={() => triggerAction(act)}
              className="text-xs shrink-0 bg-cardBg border border-gray-800 text-textPrimary hover:bg-primaryAccent hover:border-primaryAccent hover:text-white px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1.5"
            >
              {act === "Troubleshoot" && <ShieldAlert size={12} />}
              {act === "Explain This" && <BookOpen size={12} />}
              {act === "Generate PowerShell" && <Terminal size={12} />}
              {act === "Write SOP" && <Plus size={12} />}
              {act}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="bg-red-950/40 border-b border-red-800 text-red-300 px-4 py-2 text-xs font-semibold shrink-0 flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Messages Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-xs ${
                  msg.role === 'user'
                    ? 'bg-primaryAccent text-white rounded-br-none shadow-md shadow-indigo-500/10'
                    : 'bg-cardBg border border-gray-800 text-textPrimary rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content.split(/(```[\s\S]*?```)/g).map((part, index) => {
                    if (part.startsWith('```')) {
                      const match = part.match(/```(\w*)\n([\s\S]*?)\n```/);
                      const lang = match ? match[1] : '';
                      const code = match ? match[2] : part;
                      if (lang === 'knowledge_extract' || lang === 'script_meta') {
                        return null;
                      }
                      return (
                        <div key={index} className="my-3 rounded-lg bg-black border border-gray-800 overflow-hidden font-mono text-xs select-text">
                          <div className="bg-sidebarBg px-4 py-1.5 text-textMuted flex items-center justify-between border-b border-gray-850">
                            <span>{lang || 'code'}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(code);
                              }}
                              className="hover:text-textPrimary transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-green-400">
                            <code>{code}</code>
                          </pre>
                        </div>
                      );
                    }
                    return <span key={index}>{part}</span>;
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-cardBg border border-gray-800 text-textMuted rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-2">
                <Loader size={16} className="animate-spin text-primaryAccent" />
                <span>Thinking... Server response verify ho raha hai...</span>
              </div>
            </div>
          )}

          {/* Dynamic Toast Save Integration Card */}
          {activeSaveToast && (
            <div className="bg-sidebarBg border border-primaryAccent/50 rounded-xl p-4 my-2 max-w-md mx-auto shadow-xl">
              <h4 className="text-[10px] font-bold text-primaryAccent uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>★</span> Auto-Detected Integration
              </h4>
              <p className="text-xs font-semibold text-textPrimary mb-3">
                {activeSaveToast.type === 'knowledge'
                  ? `Save solution: "${activeSaveToast.data.title}" to Knowledge Base?`
                  : `Save PowerShell script: "${activeSaveToast.data.title}"?`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveToastAction}
                  className="bg-primaryAccent hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-md flex items-center gap-1"
                >
                  <Check size={14} /> Save
                </button>
                <button
                  onClick={() => setActiveSaveToast(null)}
                  className="bg-transparent hover:bg-gray-800 text-textMuted text-[10px] font-semibold py-1.5 px-3 rounded-md border border-gray-800"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-gray-800 bg-sidebarBg/50 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Puchho... e.g. GPO link kaise karein? or Generate a script to delete inactive users..."
              className="flex-1 bg-cardBg border border-gray-800 rounded-xl py-3 px-4 text-xs text-textPrimary placeholder-textMuted focus:outline-none focus:border-primaryAccent focus:ring-1 focus:ring-primaryAccent disabled:opacity-55"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primaryAccent hover:bg-indigo-700 text-white rounded-xl p-3 shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:hover:bg-primaryAccent"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
