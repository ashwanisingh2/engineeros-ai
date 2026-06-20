import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, ShieldAlert, BookOpen, Terminal, Check, Plus, Loader } from 'lucide-react';

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

export default function AIChat({ settings, onSaveToKnowledge, onSaveToScripts }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('engineeros_chat_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Suno techie! Main hoon aapka **EngineerOS AI Copilot**. L1 Support se Sysadmin L2/L3 ya Cloud Admin banne ki journey mein main aapka saathi hoon.

Aap mujhse hardware, networking (CCNA), Active Directory, Windows Server, Azure, AWS, PowerShell scripts ya ticketing tools ke baare mein kuch bhi puch sakte hain.

Aap kya explore karna chahte hain? Neeche diye quick actions use karein ya seedha query enter karein!`,
      }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSaveToast, setActiveSaveToast] = useState(null); // { type: 'knowledge' | 'script', data: {...} }

  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('engineeros_chat_history', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        // Extract the code block immediately preceding or inside the text
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

    if (!settings.apiKey) {
      setErrorMsg("Claude API Key missing! Settings page par jaakar API Key set karein.");
      return;
    }

    setErrorMsg('');
    setActiveSaveToast(null);
    if (!textToSend) setInput('');

    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Prepare message request format for Claude (Anthropic Messages API)
      const endpoint = `${settings.apiEndpoint.replace(/\/$/, '')}/v1/messages`;
      
      const payload = {
        model: "claude-3-5-sonnet-20241022", // Anthropic Sonnet 3.5
        max_tokens: 4000,
        system: SYSTEM_PROMPT + (settings.language === 'English' ? "\nOverride communication style: ONLY explain in professional English." : ""),
        messages: newMessages
          .filter(m => m.id !== 'welcome')
          .map(m => ({
            role: m.role,
            content: m.content
          }))
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': settings.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data.content[0].text;

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: assistantText }]);
      extractJsonBlocks(assistantText);
    } catch (err) {
      console.error(err);
      setErrorMsg(`API Request Failed: ${err.message}. Agar yeh CORS issue hai, toh Settings page mein CORS setup guidelines padhein.`);
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

  const clearHistory = () => {
    if (window.confirm("Chat history delete karni hai?")) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Chat reset ho gaya. Poochhein, aapka kya problem hai?",
        }
      ]);
      setActiveSaveToast(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-800 p-4 shrink-0 bg-sidebarBg/50 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
            <span className="text-primaryAccent animate-pulse">●</span> EngineerOS AI Copilot
          </h1>
          <p className="text-xs text-textMuted mt-0.5">L1 to L2/L3 Sysadmin Career Accelerator</p>
        </div>
        <button
          onClick={clearHistory}
          title="Clear Chat History"
          className="text-textMuted hover:text-red-400 p-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Quick Action Suggestions */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-darkBg border-b border-gray-850 shrink-0 select-none scrollbar-none">
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
              className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-sm ${
                msg.role === 'user'
                  ? 'bg-primaryAccent text-white rounded-br-none shadow-md shadow-indigo-500/10'
                  : 'bg-cardBg border border-gray-800 text-textPrimary rounded-bl-none'
              }`}
            >
              {/* Parse text and highlight titles & code snippets */}
              <div className="whitespace-pre-wrap font-sans">
                {msg.content.split(/(```[\s\S]*?```)/g).map((part, index) => {
                  if (part.startsWith('```')) {
                    // Extract code content
                    const match = part.match(/```(\w*)\n([\s\S]*?)\n```/);
                    const lang = match ? match[1] : '';
                    const code = match ? match[2] : part;
                    if (lang === 'knowledge_extract' || lang === 'script_meta') {
                      return null; // hide raw JSON blocks from UI
                    }
                    return (
                      <div key={index} className="my-3 rounded-lg bg-black border border-gray-800 overflow-hidden font-mono text-xs">
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
                  // Render general text
                  return <span key={index}>{part}</span>;
                })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-cardBg border border-gray-800 text-textMuted rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
              <Loader size={16} className="animate-spin text-primaryAccent" />
              <span>Thinking... Server response verify ho raha hai...</span>
            </div>
          </div>
        )}

        {/* Dynamic Toast Save Integration Card */}
        {activeSaveToast && (
          <div className="bg-sidebarBg border border-primaryAccent/50 rounded-xl p-4 my-2 max-w-md mx-auto shadow-xl">
            <h4 className="text-xs font-bold text-primaryAccent uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>★</span> Auto-Detected Integration
            </h4>
            <p className="text-sm font-semibold text-textPrimary mb-3">
              {activeSaveToast.type === 'knowledge'
                ? `Save solution: "${activeSaveToast.data.title}" to Knowledge Base?`
                : `Save PowerShell script: "${activeSaveToast.data.title}"?`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSaveToastAction}
                className="bg-primaryAccent hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3 rounded-md flex items-center gap-1"
              >
                <Check size={14} /> Save
              </button>
              <button
                onClick={() => setActiveSaveToast(null)}
                className="bg-transparent hover:bg-gray-800 text-textMuted text-xs font-medium py-1.5 px-3 rounded-md border border-gray-800"
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
            className="flex-1 bg-cardBg border border-gray-800 rounded-xl py-3 px-4 text-sm text-textPrimary placeholder-textMuted focus:outline-none focus:border-primaryAccent focus:ring-1 focus:ring-primaryAccent disabled:opacity-55"
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
  );
}
