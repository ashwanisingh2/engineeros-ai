import React, { useState, useEffect } from 'react';
import { Award, Check, AlertCircle, RefreshCw, Loader, Flame, CheckCircle, ArrowRight } from 'lucide-react';

const CHALLENGE_BANK = [
  { id: 1, topic: "Windows Server / GPO", q: "Computer par GPO link karne ke baad client PC par refresh karne ke liye CMD commands batao. Agar policy immediately force karni ho to kya parameter use karenge?" },
  { id: 2, topic: "Active Directory", q: "Domain Controller (DC) ka IP address change karne se pehle aur baad me DNS Server configuration me kya check aur verify karna padta hai?" },
  { id: 3, topic: "Networking (CCNA)", q: "Ek employee local printer connect nahi kar pa raha hai. Subnet mask check kiya to subnets correct lag rahe hain. Console port command line se test karne ke liye 'ping' aur 'tracert' ke beech ka routing boundary difference short me samjhao." },
  { id: 4, topic: "Microsoft 365", q: "Distribution Group aur Shared Mailbox me primary access permissions aur license requirement difference short me specify karo." },
  { id: 5, topic: "Azure (AZ-104)", q: "Azure VM deployment me Availability Sets aur Availability Zones me SLA differences kya hain? Kab kaunsa recommend kiya jata hai?" },
  { id: 6, topic: "PowerShell Scripting", q: "PowerShell session check karte waqt 'Get-Service' run karne par active services list hui. Agar local print spooler service stop ho, toh use restart karne ke liye kya command execute karenge?" },
  { id: 7, topic: "Intune / MDM", q: "Windows Autopilot configuration profile deploy karte waqt 'User-Driven' vs 'Self-Deploying' mode ka core use-case difference list karo." },
  { id: 8, topic: "Linux (RHCSA)", q: "Linux server session par user context switch karne ke bad 'sudo' system warning show kar raha hai. Permissions check karne ke liye file 'etc/sudoers' check karne ka primary command aur syntax kya hai?" },
  { id: 9, topic: "Computer Hardware", q: "System BSOD error code 0x0000007B throw kar raha hai. BIOS/UEFI console setting me SATA controller configuration me kya setting shift change karoge check setup restore karne ke liye?" },
  { id: 10, topic: "SCCM", q: "SCCM client boundary groups aur boundary relationships boundaries configure karne ka core logical criteria kya hota hai?" }
];

export default function DailyChallenge({ settings, streak, onIncrementStreak, onResetStreak }) {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null); // { score, feedback }

  useEffect(() => {
    // Determine daily challenge based on today's date
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('engineeros_challenge_date');
    const savedIndex = localStorage.getItem('engineeros_challenge_index');

    let index = 0;
    if (savedDate === today && savedIndex !== null) {
      index = parseInt(savedIndex);
    } else {
      // Pick a random question index
      index = Math.floor(Math.random() * CHALLENGE_BANK.length);
      localStorage.setItem('engineeros_challenge_date', today);
      localStorage.setItem('engineeros_challenge_index', index.toString());
      
      // Reset answer and evaluation for the new day
      localStorage.removeItem('engineeros_challenge_answer');
      localStorage.removeItem('engineeros_challenge_eval');
    }

    setQuestion(CHALLENGE_BANK[index]);

    const cachedAnswer = localStorage.getItem('engineeros_challenge_answer');
    const cachedEval = localStorage.getItem('engineeros_challenge_eval');

    if (cachedAnswer) setUserAnswer(cachedAnswer);
    if (cachedEval) setEvaluation(JSON.parse(cachedEval));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    if (!settings.apiKey) {
      alert("Claude API Key missing! Settings page par key set karein.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = `${settings.apiEndpoint.replace(/\/$/, '')}/v1/messages`;
      
      const promptText = `Evaluate this user's answer to the technical question.
      Question: "${question.q}"
      User's Answer: "${userAnswer}"
      
      Provide a constructive, brief evaluation in Hinglish (Hindi + English mix).
      Grade the answer out of 10. Be encouraging but honest, like a senior colleague.
      
      Respond ONLY with a valid JSON object. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON object matching this format:
      {
        "score": 8,
        "feedback": "evaluation text in Hinglish. connect theory with practice."
      }`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': settings.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1500,
          system: "You are an interview grader. Evaluate the user response and output raw JSON only.",
          messages: [{ role: "user", content: promptText }]
        })
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      const contentText = data.content[0].text.trim();
      const cleaned = contentText.replace(/^```json/, '').replace(/```$/, '').trim();
      const evalResult = JSON.parse(cleaned);

      setEvaluation(evalResult);
      localStorage.setItem('engineeros_challenge_answer', userAnswer);
      localStorage.setItem('engineeros_challenge_eval', JSON.stringify(evalResult));

      // Handle streak updates
      if (evalResult.score >= 5) {
        onIncrementStreak();
      } else {
        onResetStreak();
      }
    } catch (err) {
      console.error(err);
      alert(`Evaluation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChallenge = () => {
    // Force picking a new challenge (for test/revision purposes)
    const newIndex = (CHALLENGE_BANK.indexOf(question) + 1) % CHALLENGE_BANK.length;
    localStorage.setItem('engineeros_challenge_index', newIndex.toString());
    setQuestion(CHALLENGE_BANK[newIndex]);
    setUserAnswer('');
    setEvaluation(null);
    localStorage.removeItem('engineeros_challenge_answer');
    localStorage.removeItem('engineeros_challenge_eval');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
            🏆 Daily Tech Challenge
          </h1>
          <p className="text-textMuted mt-1">Practice one daily real-world L1/L2 admin problem, test your knowledge, and build consistency.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-900 px-4 py-2 rounded-xl text-amber-500 font-bold shrink-0">
          <Flame size={18} className="animate-bounce" />
          <span>{streak} Day Streak</span>
        </div>
      </div>

      {question && (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="bg-cardBg border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <span className="text-[10px] font-bold text-primaryAccent uppercase tracking-widest block mb-2">
              Topic: {question.topic}
            </span>
            <h2 className="text-lg font-bold text-textPrimary leading-relaxed">
              {question.q}
            </h2>
            <div className="text-xs text-textMuted italic mt-4 flex items-center gap-1">
              <CheckCircle size={12} className="text-primaryAccent" />
              <span>"Theory ko practice se connect karo" — L1 Support to L2 Administrator track.</span>
            </div>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">
                Your Answer (Explain in English or Hinglish)
              </label>
              <textarea
                required
                rows="4"
                disabled={loading || evaluation !== null}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Write your explanation here... e.g. gpupdate /force command run karenge..."
                className="w-full bg-cardBg border border-gray-800 rounded-xl py-3 px-4 text-sm text-textPrimary focus:outline-none focus:border-primaryAccent resize-none disabled:opacity-60"
              />
            </div>

            {evaluation === null ? (
              <button
                type="submit"
                disabled={loading || !userAnswer.trim()}
                className="flex items-center gap-2 bg-primaryAccent hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-xs disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Submitting Answer...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Submit Answer
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                {/* Result Card */}
                <div className={`border rounded-xl p-5 ${
                  evaluation.score >= 5
                    ? 'bg-successGreen/10 border-successGreen/30 text-textPrimary'
                    : 'bg-red-950/20 border-red-900/30 text-textPrimary'
                }`}>
                  <div className="flex items-center justify-between border-b border-gray-850 pb-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-textMuted">AI Score Evaluation</span>
                    <span className={`text-xl font-bold font-mono px-3 py-1 rounded ${
                      evaluation.score >= 7 ? 'text-successGreen bg-successGreen/10' : evaluation.score >= 5 ? 'text-amber-400 bg-amber-400/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                      {evaluation.score}/10
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{evaluation.feedback}</p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-textMuted">
                    {evaluation.score >= 5 ? 'Streak updated! Ready for tomorrow\'s challenge.' : 'Keep trying to score 5+ to retain daily streaks.'}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetChallenge}
                    className="flex items-center gap-1.5 bg-sidebarBg hover:bg-gray-900 border border-gray-850 px-3 py-2 rounded-lg text-xs font-bold text-textPrimary transition-colors"
                  >
                    <RefreshCw size={12} /> Rotate Challenge
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
