import React, { useState } from "react";
import { 
  User, Search, RefreshCw, Activity, TrendingUp, ChevronRight, 
  AlertCircle, CheckCircle, Lock, HelpCircle, CalendarDays 
} from "lucide-react";

export default function FetcherTab({
  username,
  setUsername,
  userData,
  loadingUser,
  userError,
  problems,
  allSubmissions = [],
  syncFeedback,
  onConnectAccount,
  onSelectProblemForAnalysis,
  fetchingSubmissionsStatus,
  onSyncSubmissions
}) {
  const [cookieInput, setCookieInput] = useState("");
  const [usernameInput, setUsernameInput] = useState(username || "");
  const [subSearchQuery, setSubSearchQuery] = useState("");
  const [subDifficultyFilter, setSubDifficultyFilter] = useState("All");
  const [showCookieHelp, setShowCookieHelp] = useState(false);

  // Interactive Heatmap States
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [selectedDateData, setSelectedDateData] = useState(null);

  // Standard UTC date helpers to avoid timezone shift mismatches
  const getUTCDateKey = (date) => {
    const d = new Date(date);
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  };

  const getTimestampDateKey = (timestampSec) => {
    const d = new Date(timestampSec * 1000);
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  };

  // Get list of last 371 days (53 weeks) to display a full year heatmap exactly like LeetCode profile in UTC
  const getHeatmapDays = () => {
    const days = [];
    const today = new Date();
    // Create UTC midnight for today
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const currentDayOfWeek = todayUTC.getUTCDay();
    
    const startOfWeek = new Date(todayUTC);
    startOfWeek.setUTCDate(todayUTC.getUTCDate() - currentDayOfWeek);
    
    const startDate = new Date(startOfWeek);
    startDate.setUTCDate(startDate.getUTCDate() - 52 * 7);
    
    const temp = new Date(startDate);
    while (temp <= todayUTC) {
      days.push(new Date(temp));
      temp.setUTCDate(temp.getUTCDate() + 1);
    }
    return days;
  };

  const getSubmissionsMap = () => {
    const map = {};
    const hasRealSubmissions = allSubmissions && allSubmissions.length > 0;

    if (hasRealSubmissions) {
      allSubmissions.forEach(sub => {
        if (!sub.timestamp) return;
        const dateStr = getTimestampDateKey(sub.timestamp);
        
        if (!map[dateStr]) {
          map[dateStr] = [];
        }
        if (!map[dateStr].some(existing => existing.id === sub.id)) {
          map[dateStr].push(sub);
        }
      });
    }

    return map;
  };

  const submissionsMap = getSubmissionsMap();

  // Calculate accepted counts per slug to identify duplicate submissions on the platform
  const slugAcceptedCounts = {};
  Object.values(submissionsMap).flat().forEach(sub => {
    const isAc = sub.status === "Accepted" || sub.status.toLowerCase().includes("accept");
    if (isAc && sub.titleSlug && sub.titleSlug !== "placeholder") {
      slugAcceptedCounts[sub.titleSlug] = (slugAcceptedCounts[sub.titleSlug] || 0) + 1;
    }
  });

  const allSubmissionsList = Object.values(submissionsMap).flat();
  const sortedRecentSubmissions = [...allSubmissionsList]
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 10);

  const getDayStatus = (dateObj) => {
    const dateStr = getUTCDateKey(dateObj);
    const daySubs = submissionsMap[dateStr] || [];
    
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      timeZone: "UTC",
      weekday: "short", month: "short", day: "numeric", year: "numeric"
    });

    if (daySubs.length === 0) {
      return { count: 0, isDuplicate: false, submissions: [], formattedDate };
    }

    // Check if there are multiple accepted submissions of the same problem on this specific day
    const dailyAcCounts = {};
    daySubs.forEach(s => {
      const isAc = s.status === "Accepted" || s.status.toLowerCase().includes("accept");
      if (isAc && s.titleSlug && s.titleSlug !== "placeholder") {
        dailyAcCounts[s.titleSlug] = (dailyAcCounts[s.titleSlug] || 0) + 1;
      }
    });
    
    let isDuplicate = Object.values(dailyAcCounts).some(cnt => cnt > 1);

    // Also check if any submission on this day is globally a duplicate (i.e., has been accepted on other days as well)
    if (!isDuplicate) {
      daySubs.forEach(s => {
        const isAc = s.status === "Accepted" || s.status.toLowerCase().includes("accept");
        if (isAc && s.titleSlug && s.titleSlug !== "placeholder") {
          if (slugAcceptedCounts[s.titleSlug] > 1) {
            isDuplicate = true;
          }
        }
      });
    }

    return {
      count: daySubs.length,
      isDuplicate,
      submissions: daySubs,
      formattedDate
    };
  };

  const heatmapDays = getHeatmapDays();

  // Filter problems dynamically based on user search and difficulty selection
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch = (prob.title || "").toLowerCase().includes(subSearchQuery.toLowerCase()) || 
                          (prob.titleSlug || "").toLowerCase().includes(subSearchQuery.toLowerCase());
    
    // Use actual dynamically resolved difficulty from backend
    const difficulty = prob.difficulty || "Medium";

    const matchesDifficulty = subDifficultyFilter === "All" || difficulty === subDifficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    onConnectAccount(usernameInput.trim(), cookieInput.trim());
  };

  // Helper to determine duplicate badge color & description
  const getDuplicateStatus = (prob) => {
    const acceptedCount = Number(prob.acceptedSubmissions) || 0;
    
    if (acceptedCount === 0) {
      return {
        text: "Not Submitted",
        color: "bg-slate-100 text-slate-400 border border-slate-200"
      };
    }
    if (acceptedCount === 1) {
      return {
        text: "0% Duplicate (100% Unique)",
        color: "bg-emerald-50 text-emerald-700 border border-emerald-200"
      };
    }
    
    const totalCount = Number(prob.totalSubmissions) || 1;
    const pct = Math.min(100, Math.round((acceptedCount / totalCount) * 100));
    return {
      text: `${pct}% Duplicate`,
      color: pct >= 75
        ? "bg-rose-50 text-rose-700 border border-rose-200 font-bold"
        : "bg-amber-50 text-amber-700 border border-amber-200 font-semibold"
    };
  };

  // Extract statistics for profile graphs
  const acStats = userData?.submitStats?.acSubmissionNum || [];
  const totalStats = userData?.submitStats?.totalSubmissionNum || [];

  const getSolvedCount = (diff) => acStats.find((x) => x.difficulty === diff)?.count || 0;
  const getTotalSubmissionsCount = (diff) => totalStats.find((x) => x.difficulty === diff)?.submissions || 0;

  const solvedAll = getSolvedCount("All");
  const solvedEasy = getSolvedCount("Easy");
  const solvedMedium = getSolvedCount("Medium");
  const solvedHard = getSolvedCount("Hard");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: CONNECT ACCOUNT & STATS */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          
          {/* LeetCode Connection Form */}
          <div className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-2xl p-5 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5" id="connection-card">
            <h3 className="text-sm font-bold tracking-wide uppercase text-slate-800 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Connect LeetCode Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Connect using your username to sync profile stats, and paste your session cookie to securely extract full submission source codes for duplicacy verification.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  LeetCode Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. tamanna_dev"
                    className="w-full bg-slate-50 text-slate-800 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none pl-10 pr-4 py-2 text-sm transition-colors font-mono"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    Session Cookie (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCookieHelp(!showCookieHelp)}
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer font-bold bg-transparent border-none"
                  >
                    <HelpCircle className="w-3 h-3" />
                    How to get?
                  </button>
                </div>

                <input
                  type="password"
                  value={cookieInput}
                  onChange={(e) => setCookieInput(e.target.value)}
                  placeholder="Paste LEETCODE_SESSION cookie..."
                  className="w-full bg-slate-50 text-slate-800 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none px-3.5 py-2 text-xs transition-colors font-mono"
                />

                {showCookieHelp && (
                  <div className="mt-2.5 p-3 bg-blue-50 border border-blue-100 rounded-lg text-[11px] text-slate-600 leading-relaxed space-y-1 shadow-sm">
                    <p className="font-semibold text-blue-700">Steps to extract LEETCODE_SESSION cookie:</p>
                    <ol className="list-decimal list-inside space-y-0.5">
                      <li>Go to <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">leetcode.com</a> and sign in.</li>
                      <li>Right-click anywhere and select <strong>Inspect</strong> (or press F12).</li>
                      <li>Go to the <strong>Application</strong> tab (Chrome) or <strong>Storage</strong> tab (Firefox).</li>
                      <li>Under <strong>Cookies</strong> on the left, click <code>https://leetcode.com</code>.</li>
                      <li>Find and copy the value of the <code>LEETCODE_SESSION</code> row.</li>
                    </ol>
                    <p className="font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Security Note: Stored only on the backend memory. Never shared.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loadingUser}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-neutral-950 font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none hover:scale-[1.01] active:scale-99 shadow-xs hover:shadow-md"
              >
                {loadingUser ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Connecting Profile...
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    Securely Connect Profile
                  </>
                )}
              </button>
            </form>

            {userError && (
              <div className="mt-3.5 p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600 flex items-start gap-2 animate-bounce-short">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Connection Failed</p>
                  <p className="mt-0.5 leading-relaxed">{userError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Live User Profile Card */}
          {userData && (
            <div className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
              
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <img
                  src={userData.profile?.userAvatar || "https://assets.leetcode.com/users/default_avatar.png"}
                  alt={userData.username}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 transition-transform duration-350 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://assets.leetcode.com/users/default_avatar.png";
                  }}
                />
                <div>
                  <h4 className="text-slate-800 font-bold font-display text-sm flex items-center gap-1.5">
                    {userData.profile?.realName || userData.username}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">@{userData.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-bold uppercase tracking-wider">GLOBAL RANK</span>
                  <span className="text-sm font-extrabold font-mono text-blue-600">
                    #{userData.profile?.ranking?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-bold uppercase tracking-wider">CONTEST RATING</span>
                  <span className="text-sm font-extrabold font-mono text-slate-700">
                    {userData.profile?.contestRating != null ? userData.profile.contestRating : "Unrated"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AC Solved Breakdown stats */}
          {userData && (
            <div className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-2xl p-5 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-600 mb-4 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                AC Solved Breakdown
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">TOTAL SOLVED</span>
                    <span className="text-3xl font-extrabold font-mono text-slate-800">{solvedAll}</span>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                    Total Subs: {getTotalSubmissionsCount("All")}
                  </span>
                </div>

                {/* Easy */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Easy Solved
                    </span>
                    <span className="font-mono text-slate-700">
                      {solvedEasy} <span className="text-slate-400 text-[10px]">({getTotalSubmissionsCount("Easy")} subs)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${solvedAll > 0 ? (solvedEasy / solvedAll) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Medium */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-blue-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Medium Solved
                    </span>
                    <span className="font-mono text-slate-700">
                      {solvedMedium} <span className="text-slate-400 text-[10px]">({getTotalSubmissionsCount("Medium")} subs)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${solvedAll > 0 ? (solvedMedium / solvedAll) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Hard */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Hard Solved
                    </span>
                    <span className="font-mono text-slate-700">
                      {solvedHard} <span className="text-slate-400 text-[10px]">({getTotalSubmissionsCount("Hard")} subs)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${solvedAll > 0 ? (solvedHard / solvedAll) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: DYNAMIC RECENT SUBMISSIONS DASHBOARD */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          
          <div className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-2xl p-5 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-800 text-base font-display flex items-center gap-2">
                  Real-Time Problem Directory ({problems.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Displays verified, dynamically aggregated submission histories live from your LeetCode profile.
                </p>
              </div>

              {username && (
                <button
                  onClick={() => onSyncSubmissions(username)}
                  disabled={fetchingSubmissionsStatus[username]}
                  className="bg-blue-50/50 text-blue-600 hover:bg-blue-500 hover:text-neutral-950 font-bold text-xs px-3.5 py-1.5 rounded-lg border border-blue-500/20 hover:border-transparent cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5 hover:scale-103 active:scale-97 duration-200"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingSubmissionsStatus[username] ? "animate-spin" : ""}`} />
                  {fetchingSubmissionsStatus[username] ? "Syncing..." : "Sync Submissions"}
                </button>
              )}
            </div>

            {syncFeedback[username] && (
              <div className="my-3.5 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-600 flex items-center gap-2 shadow-3xs animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-medium">{syncFeedback[username]}</span>
              </div>
            )}

            {username && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={subSearchQuery}
                    onChange={(e) => setSubSearchQuery(e.target.value)}
                    placeholder="Search problem directory by title..."
                    className="w-full bg-slate-50 text-slate-800 rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-none pl-10 pr-4 py-2 text-xs transition-colors font-sans"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSubDifficultyFilter(difficulty)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-200 cursor-pointer hover:scale-105 ${
                        subDifficultyFilter === difficulty
                          ? "bg-blue-500 text-neutral-950 border-transparent font-extrabold shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!username ? (
              <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl mt-4">
                <User className="w-12 h-12 mx-auto mb-3 opacity-20 text-blue-500" />
                <p className="text-sm font-semibold text-slate-500">Please connect a LeetCode Profile above</p>
                <p className="text-xs text-slate-400 mt-1">Once connected, your live solved directories and true submission statistics will load here.</p>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl mt-4">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-20 text-slate-500" />
                <p className="text-sm font-semibold text-slate-500">No matching solved problems found</p>
                <p className="text-xs text-slate-400 mt-1">Try triggering a "Sync Submissions" to pull recent records, or adjust filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto mt-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[10px] tracking-wider uppercase font-extrabold text-slate-400 sticky top-0 bg-white z-10">
                      <th className="py-3 px-4">LeetCode Question</th>
                      <th className="py-3 px-4 text-center">Total Submissions</th>
                      <th className="py-3 px-4 text-center">Accepted Submissions</th>
                      <th className="py-3 px-4 text-right">Duplicate Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProblems.map((prob, idx) => {
                      // Use actual dynamically resolved difficulty from backend
                      const difficulty = prob.difficulty || "Medium";

                      const badge = getDuplicateStatus(prob);

                      return (
                        <tr key={prob.titleSlug || idx} className="hover:bg-slate-50/60 transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-sm">
                              {prob.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="font-mono text-[9px] text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded font-semibold uppercase">
                                JS
                              </span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                difficulty === "Easy" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                difficulty === "Hard" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                "bg-blue-50 text-blue-600 border border-blue-100"
                              }`}>
                                {difficulty}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Latest: {prob.latestSubmissionDate || "Just Now"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-sm text-slate-700 text-center font-semibold">
                            {prob.totalSubmissions}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-sm text-slate-700 text-center font-semibold">
                            {prob.acceptedSubmissions}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border transition-all ${badge.color}`}>
                                {badge.text}
                              </span>
                              <button
                                onClick={() => onSelectProblemForAnalysis(prob.title, prob.titleSlug, "javascript")}
                                className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-neutral-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border-none hover:scale-105 hover:shadow-xs active:scale-95"
                              >
                                Review
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {userData && (
              <div className="mt-6 p-4 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/55 pb-3">
                  <h3 className="text-xs font-bold tracking-wide uppercase text-slate-800 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    Submission Heatmap
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 inline-block"></span>
                      <span>None</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-[#9be9a8] border border-[#9be9a8]/20 inline-block"></span>
                      <span>1 sub</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-[#40c463] border border-[#40c463]/20 inline-block"></span>
                      <span>2 subs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-[#30a14e] border border-[#30a14e]/20 inline-block"></span>
                      <span>3 subs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-[#216e39] border border-[#216e39]/20 inline-block"></span>
                      <span>4+ subs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-rose-300 border border-rose-400/40 inline-block animate-pulse"></span>
                      <span className="text-rose-600">Duplicate (Light Red)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start mt-2">
                  {/* Heatmap Grid Column */}
                  <div className="xl:col-span-8 space-y-3">
                    <p className="text-[11px] text-slate-500 leading-normal font-semibold">
                      Click on any calendar square below to view questions submitted on that day.
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/60 overflow-x-auto custom-scrollbar">
                      <div className="min-w-[760px]">
                        <div className="grid grid-flow-col grid-rows-7 gap-1">
                          {heatmapDays.map((dateObj, idx) => {
                            const dateStr = getUTCDateKey(dateObj);
                            const dayData = getDayStatus(dateObj);
                            const isSelected = selectedDateStr === dateStr;

                            let cellColor = "bg-slate-100 hover:bg-slate-200/80 border border-slate-200/30";
                            if (dayData.count > 0) {
                              if (dayData.isDuplicate) {
                                // Light red for duplicate submissions
                                cellColor = "bg-rose-300 hover:bg-rose-400 border border-rose-400/50 text-rose-800";
                              } else {
                                // GitHub style multi-shade green depending on number of submissions
                                if (dayData.count === 1) {
                                  cellColor = "bg-[#9be9a8] hover:bg-[#8cd799] border border-[#9be9a8]/30";
                                } else if (dayData.count === 2) {
                                  cellColor = "bg-[#40c463] hover:bg-[#39b059] border border-[#40c463]/30";
                                } else if (dayData.count === 3) {
                                  cellColor = "bg-[#30a14e] hover:bg-[#2a8e45] border border-[#30a14e]/30";
                                } else {
                                  cellColor = "bg-[#216e39] hover:bg-[#1a572d] border border-[#216e39]/30";
                                }
                              }
                            }

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedDateStr(dateStr);
                                  setSelectedDateData(dayData);
                                }}
                                title={`${dayData.formattedDate}: ${dayData.count} submissions ${dayData.isDuplicate ? "(Duplicate Detected)" : ""}`}
                                className={`w-3.5 h-3.5 rounded-xs transition-all duration-150 cursor-pointer focus:outline-none hover:scale-110 ${cellColor} ${
                                  isSelected ? "ring-2 ring-blue-500 scale-110 z-10" : ""
                                }`}
                              />
                            );
                          })}
                        </div>
                        
                        {/* Week-range labels */}
                        <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold font-mono mt-2.5 px-0.5">
                          <span>{new Date(heatmapDays[0]).toLocaleDateString("en-US", { month: 'short', year: 'numeric', timeZone: 'UTC' })}</span>
                          <span>← 1 Year Activity (53 Weeks) →</span>
                          <span>{new Date(heatmapDays[heatmapDays.length - 1]).toLocaleDateString("en-US", { month: 'short', year: 'numeric', timeZone: 'UTC' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clicked Day/Submission Feed Panel (Right Side) */}
                  <div className="xl:col-span-4 h-full">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
                      {selectedDateStr ? "Day Details" : "Recent Submissions"}
                    </h4>
                    
                    {selectedDateStr ? (
                      <div className="bg-white border border-slate-200/60 hover:border-slate-300 hover:shadow-md rounded-xl p-3.5 space-y-2.5 shadow-2xs transition-all duration-300">
                        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                           <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Selected Day Activity</span>
                            <span className="text-xs font-bold text-slate-700 font-mono">
                              {selectedDateData?.formattedDate || selectedDateStr}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDateStr(null);
                              setSelectedDateData(null);
                            }}
                            className="text-[9px] text-blue-500 hover:text-blue-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 shadow-3xs cursor-pointer hover:shadow-sm"
                          >
                            Show Recent List
                          </button>
                        </div>

                        {selectedDateData.count === 0 ? (
                          <p className="text-xs text-slate-400 italic text-center py-4">
                            No submissions on this date.
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                            {selectedDateData.submissions.map((sub, i) => {
                              const isPlaceholder = sub.titleSlug === "placeholder";
                              const isDup = !isPlaceholder && slugAcceptedCounts[sub.titleSlug] > 1;
                              return (
                                <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-150 flex items-start justify-between gap-2 shadow-3xs hover:bg-slate-100/50 transition-colors">
                                  <div className="space-y-1">
                                    {isPlaceholder ? (
                                      <div className="text-xs font-bold text-slate-500">
                                        LeetCode Submission
                                        <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                                          Submitted on LeetCode. Sync to view details.
                                        </span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => onSelectProblemForAnalysis(sub.title, sub.titleSlug)}
                                        className="text-xs font-bold text-left text-slate-700 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none p-0 block"
                                      >
                                        {sub.title}
                                      </button>
                                    )}
                                    {!isPlaceholder && (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono font-semibold uppercase border border-slate-200/50">
                                          {sub.lang || "js"}
                                        </span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                          sub.status === "Accepted" || sub.status?.toLowerCase().includes("accept")
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                            : "bg-rose-50 text-rose-600 border border-rose-100"
                                        }`}>
                                          {sub.status || "Accepted"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {isDup && (
                                    <span className="shrink-0 text-[8px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100 px-1.5 py-0.5 rounded uppercase tracking-wider font-sans">
                                      DUPLICATE
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Overall Recent Submissions Activity Feed */
                      <div className="bg-white border border-slate-200/60 hover:border-slate-300 hover:shadow-md rounded-xl p-3.5 space-y-2.5 shadow-2xs transition-all duration-300">
                        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Activity Feed</span>
                            <span className="text-xs font-bold text-slate-700 font-sans">
                              Recent Submissions ({allSubmissionsList.length})
                            </span>
                          </div>
                        </div>

                        {sortedRecentSubmissions.length === 0 ? (
                          <p className="text-xs text-slate-400 italic text-center py-4">
                            No submissions synced yet.
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                            {sortedRecentSubmissions.map((sub, i) => {
                              const isPlaceholder = sub.titleSlug === "placeholder";
                              const isDup = !isPlaceholder && slugAcceptedCounts[sub.titleSlug] > 1;
                              return (
                                <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-150 flex items-start justify-between gap-2 shadow-3xs hover:bg-slate-100/50 transition-colors">
                                  <div className="space-y-1">
                                    {isPlaceholder ? (
                                      <div className="text-xs font-bold text-slate-500">
                                        LeetCode Submission
                                        <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                                          Submitted on LeetCode. Sync to view details.
                                        </span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => onSelectProblemForAnalysis(sub.title, sub.titleSlug)}
                                        className="text-xs font-bold text-left text-slate-700 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none p-0 block"
                                        title="Click to review & compare"
                                      >
                                        {sub.title}
                                      </button>
                                    )}
                                    {!isPlaceholder && (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono font-semibold uppercase border border-slate-200/50">
                                          {sub.lang || "js"}
                                        </span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                          sub.status === "Accepted" || sub.status?.toLowerCase().includes("accept")
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                            : "bg-rose-50 text-rose-600 border border-rose-100"
                                        }`}>
                                          {sub.status || "Accepted"}
                                        </span>
                                        {sub.timestamp && (
                                          <span className="text-[9px] text-slate-400 font-mono">
                                            {new Date(sub.timestamp * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {isDup && (
                                    <span className="shrink-0 text-[8px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100 px-1.5 py-0.5 rounded uppercase tracking-wider font-sans">
                                      DUPLICATE
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}