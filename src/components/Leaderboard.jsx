import React, { useState, useEffect } from 'react';
import { Award, Flame, RefreshCw, Loader, Trophy, ArrowUpDown } from 'lucide-react';
import { callAIService } from '../utils/aiService';

const DEFAULT_PEERS = [
  { name: "Rahul Verma", streak: 12, challengesDone: 24, topCert: "CCNA" },
  { name: "Sarah Jenkins", streak: 18, challengesDone: 30, topCert: "AZ-104" },
  { name: "Amit Patel", streak: 5, challengesDone: 15, topCert: "CompTIA A+" },
  { name: "David Kim", streak: 21, challengesDone: 42, topCert: "RHCSA" },
  { name: "Priya Sharma", streak: 8, challengesDone: 10, topCert: "AZ-900" },
  { name: "Michael Chang", streak: 15, challengesDone: 28, topCert: "Network+" },
  { name: "Vikram Singh", streak: 2, challengesDone: 6, topCert: "None yet" },
  { name: "Elena Rostova", streak: 14, challengesDone: 22, topCert: "Security+" },
  { name: "James O'Connor", streak: 9, challengesDone: 18, topCert: "MS-102" }
];

export default function Leaderboard({ streak, settings, courses }) {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('streak'); // 'streak', 'challengesDone', 'name'
  const [sortAsc, setSortAsc] = useState(false);

  // Determine user's completed certs or fallback
  const getUserTopCert = () => {
    if (!courses) return "None yet";
    const completedCourse = courses.find(c => c.status === 'Completed' || c.completedModules === c.totalModules);
    if (completedCourse) {
      return completedCourse.name.split(' (')[0].split(' - ')[0];
    }
    return settings?.currentRole ? settings.currentRole.split(' (')[0] : "None yet";
  };

  const userChallengesDone = parseInt(localStorage.getItem('engineeros_challenges_done') || '0');
  const userRow = {
    name: "You (Current User)",
    streak: streak || 0,
    challengesDone: userChallengesDone,
    topCert: getUserTopCert(),
    isCurrentUser: true
  };

  // Load peers from cache or use defaults
  useEffect(() => {
    const saved = localStorage.getItem('engineeros_leaderboard_peers');
    if (saved) {
      try {
        setPeers(JSON.parse(saved));
      } catch (e) {
        setPeers(DEFAULT_PEERS);
      }
    } else {
      localStorage.setItem('engineeros_leaderboard_peers', JSON.stringify(DEFAULT_PEERS));
      setPeers(DEFAULT_PEERS);
    }
  }, []);

  const handleRefreshPeers = async () => {
    if (!settings?.apiKey) {
      alert("API Key missing in Settings! Default competitors reloaded.");
      setPeers(DEFAULT_PEERS);
      localStorage.setItem('engineeros_leaderboard_peers', JSON.stringify(DEFAULT_PEERS));
      return;
    }

    setLoading(true);
    try {
      const promptText = `Generate exactly 9 realistic peer competitors for an IT certification learning platform leaderboard.
      Each peer must have:
      - name: A realistic professional name (mix of global and Indian names like "Arjun Mehta", "Emily Taylor", "Rajesh Kumar", "Sophia Chen", etc.)
      - streak: A number representing their current daily streak (ranging from 1 to 25)
      - challengesDone: A number representing the total daily challenges completed (ranging from 5 to 50, generally higher or equal to their streak)
      - topCert: A realistic IT certification (e.g., "CCNA", "AZ-104", "RHCSA", "Network+", "CompTIA A+", "Sec+", "MS-102")

      Respond ONLY with a valid JSON array. Do not include markdown code block formatting or introductory text. Return strictly the raw JSON array matching this format:
      [
        { "name": "Competitor Name", "streak": 10, "challengesDone": 20, "topCert": "CCNA" }
      ]`;

      const responseText = await callAIService({
        systemPrompt: "You are a competitive training platform simulation provider. Output raw JSON arrays only.",
        prompt: promptText
      });

      const cleaned = responseText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length === 9) {
        setPeers(parsed);
        localStorage.setItem('engineeros_leaderboard_peers', JSON.stringify(parsed));
      } else {
        throw new Error("AI returned incorrect count of peers.");
      }
    } catch (err) {
      console.error(err);
      alert(`Competitor generation failed: ${err.message}. Using default peers.`);
      setPeers(DEFAULT_PEERS);
    } finally {
      setLoading(false);
    }
  };

  // Combine user with peers and sort
  const combinedData = [userRow, ...peers];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedData = [...combinedData].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return sortAsc ? valA - valB : valB - valA;
    }
  });

  // Find user's rank in sorted list (1-indexed)
  const userRankIndex = sortedData.findIndex(row => row.isCurrentUser);
  const userRank = userRankIndex + 1;

  // Calculate Percentile
  const percentile = 100 - (userRank - 0.5) * 10;

  return (
    <div className="bg-cardBg border border-gray-800 rounded-xl p-6 shadow-xl mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-850 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-amber-500 animate-pulse" />
          <div>
            <h3 className="text-base font-bold text-textPrimary">🏅 Global Study Leaderboard</h3>
            <p className="text-[11px] text-textMuted mt-0.5">
              Ranked among peers based on consistency and completed lab challenges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] bg-primaryAccent/10 border border-primaryAccent/20 px-3 py-1.5 rounded-lg text-primaryAccent font-bold">
            You are in the top {Math.round(100 - percentile)}% of learners
          </span>
          <button
            onClick={handleRefreshPeers}
            disabled={loading}
            className="flex items-center gap-1.5 text-[10px] bg-sidebarBg hover:bg-gray-800 border border-gray-800 text-textSecondary font-bold px-3 py-1.5 rounded-md transition-colors"
          >
            {loading ? <Loader size={11} className="animate-spin" /> : <RefreshCw size={11} />}
            Refresh Competitors
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-textMuted font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-4">Rank</th>
              <th className="py-2.5 px-4 cursor-pointer hover:text-textPrimary transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer hover:text-textPrimary transition-colors" onClick={() => handleSort('streak')}>
                <div className="flex items-center gap-1">
                  Streak
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-2.5 px-4 cursor-pointer hover:text-textPrimary transition-colors" onClick={() => handleSort('challengesDone')}>
                <div className="flex items-center gap-1">
                  Challenges Done
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-2.5 px-4">Top Certification</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => {
              const isUser = row.isCurrentUser;
              return (
                <tr
                  key={index}
                  className={`border-b border-gray-850/50 hover:bg-gray-800/30 transition-colors ${
                    isUser
                      ? 'bg-primaryAccent/5 border-l-4 border-l-primaryAccent font-semibold text-textPrimary'
                      : 'text-textSecondary'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold">
                    {sortedData.findIndex(r => r.name === row.name) + 1}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-1.5">
                    {isUser ? <span className="text-primaryAccent font-bold">★</span> : null}
                    {row.name}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <div className="flex items-center gap-1">
                      <Flame size={12} className={row.streak > 10 ? "text-amber-500" : "text-textMuted"} />
                      {row.streak} Days
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold">{row.challengesDone}</td>
                  <td className="py-3 px-4">
                    <span className="bg-sidebarBg border border-gray-850 px-2 py-0.5 rounded text-[10px] text-textMuted font-medium">
                      {row.topCert}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
