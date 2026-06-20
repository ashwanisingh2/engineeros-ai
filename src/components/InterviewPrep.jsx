import React, { useState } from 'react';
import { Play, Check, RotateCcw, AlertTriangle, Eye, Sparkles, BookOpen, Loader } from 'lucide-react';

const PRELOADED_QUESTIONS = {
  "MCSA Windows Server": [
    { q: "What is the difference between Additional DC, Child DC, and RODC? When would you use each?", a: "1. Additional DC (ADC): Same domain controller replicated in another site for load balancing/high availability.\n2. Child DC (CDC): Creates a subdomain (e.g. support.domain.com) with its own security boundaries.\n3. Read-Only DC (RODC): Deploy in insecure branch offices. It contains read-only database copy, doesn't replicate changes, and secures credentials by default.", difficulty: "Medium" },
    { q: "Explain the 5 FSMO roles and what happens if each one fails.", a: "Forest-level roles:\n1. Schema Master: Schema updates (failures only impact schema modification, not auth).\n2. Domain Naming Master: Adding/removing domains (failures block domain changes).\nDomain-level roles:\n3. PDC Emulator: Password changes, GPO sync, time synchronization (critical failure: locks/logins fail, sync errors).\n4. RID Master: Assigns RIDs to DC for creating objects (failure: cannot create new AD objects after current pool exhausts).\n5. Infrastructure Master: Cross-domain references (failure: object name translation issues).", difficulty: "Hard" },
    { q: "AD replication ek site ke andar aur site ke beech mein kaise kaam karti hai?", a: "1. Intra-site Replication: Site ke andar replication instant (within 15 seconds notification) hoti hai, uncompressed traffic, RPC over IP transport use karti hai.\n2. Inter-site Replication: Sites ke beech replication schedule-based (default 180 min) hoti hai, compressed traffic, IP/SMTP transport, cost-metrics based path routes utilize karti hai.", difficulty: "Medium" },
    { q: "GPO inheritance block karne ke 3 tarike kaunse hain? Difference explain karo.", a: "1. Block Inheritance: Parent container ke GPOs subfolder pe inherit nahi hote.\n2. Enforce (No Override): GPO settings will overwrite everything. Block inheritance is bypassed by enforced policy.\n3. Security Filtering: Policy links only to specific users/computers, bypassing standard AU (Authenticated Users) group.", difficulty: "Hard" },
    { q: "Tombstone lifetime aur AD recycle bin mein kya difference hai?", a: "1. Tombstone lifetime: Time period (default 180 days) jiske baad deleted objects completely hard-delete ho jaate hain. Pehle yeh 'tombstone' state mein context and link attributes loose karke rehte hain.\n2. AD Recycle Bin: Enable karne par deleted objects complete attributes ke saath (without state loss) restore ho sakte hain within the tombstone/deleted-object lifetime duration.", difficulty: "Medium" }
  ],
  "CCNA 200-301": [
    { q: "VLAN aur subnet mein kya difference hai? Kab dono use karte hain?", a: "VLAN Layer 2 concept hai jo network card broadcast domain ko logically split karta hai (same physical switch par traffic separate karne ke liye). Subnet Layer 3 concept hai jo IP address range ko network segments me divide karta hai routing control karne ke liye. Usually, a 1-to-1 mapping is maintained (1 VLAN = 1 Subnet) to enable easy inter-VLAN routing.", difficulty: "Medium" },
    { q: "Explain inter-VLAN routing using Layer 3 switch vs Router-on-a-stick.", a: "1. Router-on-a-Stick (ROAS): Switch port trunk mode me router interface se connected hota hai, aur router interface par logical sub-interfaces banaye jaate hain (.1Q tag read karne ke liye). Small network ke liye fine hai but bandwidth bottleneck ho sakta hai.\n2. Layer 3 Switch: Switch ports routing enable karne ke baad Switch Virtual Interfaces (SVIs) deploy kiye jaate hain. SVI default gateway ban jaata hai. Fast routing hoti hai (ASIC level) and no physical link congestion.", difficulty: "Hard" },
    { q: "OSPF mein DR aur BDR election kaise hoti hai? Priority kaise set karte hain?", a: "DR (Designated Router) aur BDR (Backup DR) election broadcast networks par redundancy and routing traffic management optimize karne ke liye hoti hai. Election step-by-step:\n1. Highest Interface OSPF priority check hoti hai (default 1, range 0-255. Priority 0 cannot participate).\n2. Priority tie hone par Highest Router ID (RID) select hoti hai. RID manual assign set hota hai, ya highest loopback IP, ya highest active physical interface IP. Priority modify karne ke liye command 'ip ospf priority <val>' run karte hain.", difficulty: "Hard" },
    { q: "Standard ACL aur Extended ACL mein difference? Placement rule kya hai?", a: "1. Standard ACL (1-99, 1300-1999): Matches source IP address only. Route placement should be close to destination to avoid blocking valid traffic.\n2. Extended ACL (100-199, 2000-2699): Matches source & destination IP, protocol, port numbers. Route placement should be close to source to drop unwanted traffic early and save link bandwidth.", difficulty: "Medium" },
    { q: "NAT types kaunse hain? PAT (Port Address Translation) kaise kaam karta hai?", a: "Types: Static NAT (1-to-1 mapping), Dynamic NAT (IP pool range mapping), PAT/Overload (Many-to-1 mapping).\nPAT works by translating multiple private inside IPs to a single public inside IP by changing the TCP/UDP source port numbers on the fly, creating a dynamic state table mapping internal endpoints.", difficulty: "Medium" }
  ],
  "Microsoft 365 Admin": [
    { q: "Conditional Access policy mein \"Grant\" vs \"Block\" controls kab use karte hain?", a: "1. Block Controls: Highly restricted scenarios me (e.g. untrusted location block, legacy auth protocols block) strict enforcement ke liye.\n2. Grant Controls: Access grant tabhi hoga jab conditions (like Require MFA, Require Hybrid Joined Device, ya Approved Client App) meet hongi.", difficulty: "Medium" },
    { q: "Entra Connect Delta Sync aur Full Sync mein kya difference hai?", a: "1. Delta Sync: Sirf recent modifications/updates ko sync karta hai (runs automatically every 30 minutes).\n2. Full Sync (Initial): Complete directory databases structural match export karta hai. Pehli bar, attributes mapping updates ke bad, ya user flow filters modify karne ke bad run karna zaroori hai.", difficulty: "Medium" },
    { q: "Shared mailbox aur distribution group mein kya difference hai? Licensing kaisi hoti hai?", a: "1. Shared Mailbox: Shared storage email inbox hota hai. Multiple users access kar sakte hain. Sub-folders support karta hai. No direct license is required up to 50 GB storage (but needs licensing for Archive or Exchange Plan 2).\n2. Distribution Group: Sirf routing query list hai. Koi storage ya physical mailbox nahi hota. Email members ke respective personal mailbox me distribute ho jata hai. No license required.", difficulty: "Easy" },
    { q: "Exchange Online mein mail flow rule (transport rule) kab use karte hain? Example do.", a: "Mail flow rules messages to evaluate and direct filter parameters ko manipulate karne ke liye dynamic logic perform karte hain before delivery. Example: Agar recipient external host hai aur subject me 'Confidential' keyword hai, toh action 'Encrypt message' and 'Forward to Manager for Approval' trigger karna.", difficulty: "Medium" },
    { q: "MFA methods kaunse available hain? FIDO2 vs Authenticator App vs SMS comparison.", a: "1. SMS/Voice: Weakest method (SIM swapping risk, text delivery delays).\n2. Microsoft Authenticator: Secure (push notification, number matching prevents fatigue attacks).\n3. FIDO2 Security Key: Strongest (Hardware token, phishing-resistant, cryptographic proof binding).", difficulty: "Hard" }
  ],
  "AZ-104 Azure Administrator": [
    { q: "NSG aur Azure Firewall mein kya difference hai? Dono kab use karte hain?", a: "1. Network Security Group (NSG): Layer 3/4 stateful packet filter. Subnet ya VM network interface level par set hota hai. Simple source/dest IP/port filtering ke liye suitable hai.\n2. Azure Firewall: Layer 3-7 managed security appliance. High-availability, deep-packet inspection, application rule queries (FQDN filtering), threat intelligence and central log management ke liye enterprise structure me deploy kiya jata hai.", difficulty: "Hard" },
    { q: "VNet Peering aur VPN Gateway mein difference? Transitive peering kya hoti hai?", a: "1. VNet Peering: Direct backbone traffic link between VNets (low latency, high speed, cheap).\n2. VPN Gateway: Encrypted IPsec tunnels over the internet (used for cross-region, secure, or hybrid links).\n3. Transitive Peering: If VNet A peers with B, and B peers with C, A cannot communicate with C unless Gateway Transit routing is explicitly configured on VNet B.", difficulty: "Hard" },
    { q: "RBAC roles: Owner vs Contributor vs Reader — kab kya assign karte hain?", a: "1. Owner: Full resource management + rights to assign RBAC roles to other entities.\n2. Contributor: Full resource management (creation, edit, deletion) but CANNOT assign roles to others.\n3. Reader: View only rights. Cannot create/modify resources.", difficulty: "Easy" },
    { q: "Azure Availability Sets vs Availability Zones — kab kaunsa use karo?", a: "1. Availability Set: Protects VMs within the same datacenter against hardware failure (Fault Domain) and updates (Update Domain) - guarantees 99.95% SLA.\n2. Availability Zone: Protects against datacenter failure by spreading VMs across physically separate datacenter facilities in the same region - guarantees 99.99% SLA.", difficulty: "Medium" },
    { q: "ARM template aur Bicep mein kya difference hai? Infrastructure as Code kyon zaroori hai?", a: "ARM templates JSON format syntax use karte hain, readable complexity high hoti hai. Bicep is a declarative domain-specific language (DSL) to deploy Azure infrastructure that compiles directly to ARM. IaC provides idempotency, version-control support, and rapid automated reproduction of dev environments.", difficulty: "Medium" }
  ]
};

const COURSE_LIST = [
  "Computer Hardware",
  "CCNA 200-301",
  "MCSA Windows Server",
  "RHCSA Linux",
  "Virtualization (VMware/Hyper-V)",
  "PowerShell",
  "Microsoft 365 Admin",
  "AZ-900 Azure Fundamentals",
  "AZ-104 Azure Administrator",
  "Microsoft Intune / MD-102",
  "SCCM / MECM",
  "AWS Fundamentals",
  "L2-L3 Multi Cloud",
  "Desktop Support L1",
  "Ticketing Tool (ITSM)"
];

export default function InterviewPrep({ settings }) {
  const [selectedCourse, setSelectedCourse] = useState("MCSA Windows Server");
  const [questions, setQuestions] = useState(PRELOADED_QUESTIONS["MCSA Windows Server"] || []);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studyStats, setStudyStats] = useState({}); // { [questionHash]: 'confident' | 'practice' }

  const activeQuestion = questions[activeQuestionIndex];

  // Helper to unique identify question
  const getQuestionId = (qObj) => {
    return qObj ? `${selectedCourse}_${qObj.q.substring(0, 15)}` : '';
  };

  const handleCourseChange = (courseName) => {
    setSelectedCourse(courseName);
    setActiveQuestionIndex(0);
    setShowAnswer(false);
    if (PRELOADED_QUESTIONS[courseName]) {
      setQuestions(PRELOADED_QUESTIONS[courseName]);
    } else {
      // Fallback message indicating they need to generate via AI or use placeholder
      setQuestions([
        {
          q: `Is topic (${courseName}) ke questions loaded nahi hain.`,
          a: "Aap niche 'Generate 5 Questions with AI' button dabakar Claude model se custom questions generate kar sakte hain!",
          difficulty: "Easy"
        }
      ]);
    }
  };

  const handleGenerateAI = async () => {
    if (!settings.apiKey) {
      alert("Claude API Key missing! Settings page par key set karein.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = `${settings.apiEndpoint.replace(/\/$/, '')}/v1/messages`;
      
      const promptText = `Generate exactly 5 realistic, industry-relevant technical interview questions and answers for the IT Admin topic: "${selectedCourse}".
      The questions must be highly realistic to what actual system administrator, desktop support, and cloud engineer roles face in interviews in India.
      Difficulty levels must be mix of Easy, Medium, and Hard.
      Explanations and answers must be detailed and written in natural Hinglish (mix of Hindi and English explanation with technical terms in English).
      
      Respond ONLY with a valid JSON array. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON array matching this format:
      [
        {"q": "question text", "a": "detailed explanation answer", "difficulty": "Easy|Medium|Hard"}
      ]`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': settings.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 3000,
          system: "You are an interview bot that output raw JSON only.",
          messages: [{ role: "user", content: promptText }]
        })
      });

      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }

      const resJson = await response.json();
      const contentText = resJson.content[0].text.trim();
      
      // Clean JSON if Claude wrapped it in ```json
      const cleaned = contentText.replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
        setActiveQuestionIndex(0);
        setShowAnswer(false);
      } else {
        throw new Error("Invalid response format received from AI model");
      }
    } catch (e) {
      console.error(e);
      alert(`AI Question Generation Failed: ${e.message}. Using default starter prep questions.`);
    } finally {
      setLoading(false);
    }
  };

  const markConfidence = (status) => {
    const qId = getQuestionId(activeQuestion);
    setStudyStats(prev => ({ ...prev, [qId]: status }));
    
    // Auto advance to next question after scoring
    if (activeQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setActiveQuestionIndex(prev => prev + 1);
        setShowAnswer(false);
      }, 500);
    }
  };

  const resetStats = () => {
    setStudyStats({});
    setActiveQuestionIndex(0);
    setShowAnswer(false);
  };

  const confidentCount = Object.keys(studyStats).filter(
    k => k.startsWith(selectedCourse) && studyStats[k] === 'confident'
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            🎯 Interview Prep Portal
          </h1>
          <p className="text-textMuted mt-1">Practice interview questions, reveal answers, and rate your confidence.</p>
        </div>
        <button
          onClick={handleGenerateAI}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-primaryAccent to-indigo-500 hover:from-indigo-700 hover:to-indigo-650 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-sm disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              AI: Generate 5 Questions
            </>
          )}
        </button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Select Study Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full bg-cardBg border border-gray-800 rounded-lg py-2.5 px-4 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent"
          >
            {COURSE_LIST.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
        <div className="bg-cardBg border border-gray-800 rounded-lg p-4 flex flex-col justify-center">
          <span className="text-xs text-textMuted">Session Coverage</span>
          <span className="text-lg font-bold text-textPrimary mt-0.5">
            Question {activeQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="bg-cardBg border border-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-textMuted">Confidence Status</span>
            <div className="text-lg font-bold text-successGreen mt-0.5">
              {confidentCount} Confident ✓
            </div>
          </div>
          <button
            onClick={resetStats}
            title="Reset stats"
            className="text-textMuted hover:text-textPrimary p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Flashcard Body */}
      {activeQuestion ? (
        <div className="space-y-6">
          <div className="bg-cardBg border border-gray-800 rounded-xl p-8 shadow-xl min-h-[220px] flex flex-col justify-between relative overflow-hidden">
            {/* Top Indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                activeQuestion.difficulty === 'Hard'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : activeQuestion.difficulty === 'Medium'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-successGreen/10 border-successGreen/30 text-successGreen'
              }`}>
                {activeQuestion.difficulty || 'Medium'} Difficulty
              </span>
              <span className="text-xs font-mono text-textMuted">
                Rating: {studyStats[getQuestionId(activeQuestion)] || 'Not Attempted'}
              </span>
            </div>

            {/* Question / Answer View */}
            <div className="my-6">
              <h2 className="text-lg md:text-xl font-bold text-textPrimary leading-relaxed mb-4">
                {activeQuestion.q}
              </h2>

              {showAnswer ? (
                <div className="border-t border-gray-850 pt-4 mt-4 animate-fadeIn">
                  <span className="block text-[10px] font-bold text-primaryAccent uppercase tracking-widest mb-2 flex items-center gap-1">
                    <BookOpen size={10} /> Explanations & Model Answer:
                  </span>
                  <div className="text-sm text-textPrimary leading-relaxed whitespace-pre-wrap">
                    {activeQuestion.a}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="mt-6 flex items-center gap-2 bg-sidebarBg hover:bg-gray-900 border border-gray-850 px-4 py-2.5 rounded-lg text-xs font-bold text-textPrimary transition-all mx-auto"
                >
                  <Eye size={14} /> Reveal Answer
                </button>
              )}
            </div>

            {/* Bottom Actions */}
            {showAnswer && (
              <div className="flex justify-center gap-3 pt-4 border-t border-gray-850 mt-4">
                <button
                  onClick={() => markConfidence('practice')}
                  className="flex items-center gap-1.5 bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  <AlertTriangle size={14} /> Need Practice
                </button>
                <button
                  onClick={() => markConfidence('confident')}
                  className="flex items-center gap-1.5 bg-successGreen/20 text-successGreen border border-successGreen/40 hover:bg-successGreen/30 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  <Check size={14} /> Confident ✓
                </button>
              </div>
            )}
          </div>

          {/* Nav Controls */}
          <div className="flex justify-between items-center px-2">
            <button
              onClick={() => {
                if (activeQuestionIndex > 0) {
                  setActiveQuestionIndex(prev => prev - 1);
                  setShowAnswer(false);
                }
              }}
              disabled={activeQuestionIndex === 0}
              className="text-xs text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:hover:text-textMuted font-bold"
            >
              ← Previous Question
            </button>
            <button
              onClick={() => {
                if (activeQuestionIndex < questions.length - 1) {
                  setActiveQuestionIndex(prev => prev + 1);
                  setShowAnswer(false);
                }
              }}
              disabled={activeQuestionIndex === questions.length - 1}
              className="text-xs text-textMuted hover:text-textPrimary disabled:opacity-30 disabled:hover:text-textMuted font-bold"
            >
              Next Question →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-cardBg border border-gray-800 rounded-xl p-12 text-center">
          <BookOpen className="mx-auto text-textMuted mb-4" size={36} />
          <h3 className="text-lg font-bold text-textPrimary">No Questions Available</h3>
          <p className="text-textMuted text-sm mt-1">Please select another course or click 'Generate 5 Questions with AI' above.</p>
        </div>
      )}
    </div>
  );
}
