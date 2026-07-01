import React, { useState, useEffect } from "react";
import { 
  Code2, Cpu, Layers, Sparkles, RefreshCw
} from "lucide-react";

import FetcherTab from "./components/FetcherTab.jsx";
import ReviewDrawer from "./components/ReviewDrawer.jsx";

// Base API URL definition (Import statements ke niche rakha gaya hai taaki build crash na ho)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Custom component to render syntax highlighted code with line numbers and optional editing
function CodeDisplay({ code, isEditable, onCodeChange, placeholder }) {
  const [editing, setEditing] = useState(false);
  const displayCode = code || "";

  // Helper to highlight JS/C++ keywords, comments, types, and numbers for a light-themed editor
  const getHighlightedHtml = (source) => {
    if (!source) return `<span class="text-slate-400 italic">${placeholder || "No code loaded..."}</span>`;
    
    const tokenRegex = RegExp(
      [
        '(?<comment>\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)',
        '(?<string>"(?:\\\\.|[^"\\\\])*")',
        '(?<char>\'(?:\\\\.|[^\'\\\\])*\')',
        '(?<keyword>\\b(?:class|public|private|protected|return|for|if|else|virtual|const|static|struct|namespace|using|typename|template|new|delete|let|var|function)\\b)',
        '(?<type>\\b(?:int|vector|auto|size_t|bool|double|float|void|char|string|Map|Set|Array)\\b)',
        '(?<library>\\b(?:max|sort|begin|end|push_back|empty|back|push|pop|insert|erase|clear|find|count|std|has|get|set|push|length|Math|floor)\\b)',
        '(?<number>\\b\\d+\\b)',
        '(?<identifier>[a-zA-Z_][a-zA-Z0-9_]*)',
        '(?<punctuation>[{}()\\[\\];,.+\\-*/%=&|!<>?:~^]+)',
        '(?<whitespace>\\s+)'
      ].join('|'),
      'g'
    );

    let match;
    let html = "";
    let lastIndex = 0;

    const escapeHtml = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    while ((match = tokenRegex.exec(source)) !== null) {
      if (match.index > lastIndex) {
        html += escapeHtml(source.substring(lastIndex, match.index));
      }

      const { comment, string, char, keyword, type, library, number, identifier, punctuation } = (match.groups || {});
      const value = match[0];

      if (comment) {
        html += `<span class="text-[#6a737d] italic font-medium">${escapeHtml(value)}</span>`;
      } else if (string || char) {
        html += `<span class="text-[#22863a] font-medium">${escapeHtml(value)}</span>`;
      } else if (keyword) {
        html += `<span class="text-[#d73a49] font-bold">${escapeHtml(value)}</span>`;
      } else if (type) {
        html += `<span class="text-[#005cc5] font-medium">${escapeHtml(value)}</span>`;
      } else if (library) {
        html += `<span class="text-[#6f42c1] font-semibold">${escapeHtml(value)}</span>`;
      } else if (number) {
        html += `<span class="text-[#005cc5] font-semibold">${escapeHtml(value)}</span>`;
      } else if (identifier) {
        html += `<span class="text-[#24292e]">${escapeHtml(value)}</span>`;
      } else if (punctuation) {
        html += `<span class="text-[#d73a49] font-medium">${escapeHtml(value)}</span>`;
      } else {
        html += escapeHtml(value);
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < source.length) {
      html += escapeHtml(source.substring(lastIndex));
    }

    return html;
  };

  const lines = displayCode.split("\n");

  if (editing && isEditable) {
    return (
      <div className="relative font-mono text-[13px]">
        <textarea
          value={code}
          onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
          rows={15}
          className="w-full bg-[#fbfbfa] text-slate-800 font-mono text-[13px] leading-relaxed p-4 rounded-b-xl border-b border-x border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-y caret-blue-500"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="absolute right-3 top-3 bg-blue-500 hover:bg-blue-600 hover:shadow-md hover:scale-105 active:scale-95 text-neutral-950 font-bold text-[10px] px-2.5 py-1 rounded shadow-xs transition-all duration-200 border-none cursor-pointer"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="relative group border-b border-x border-slate-200 rounded-b-xl overflow-hidden bg-[#fafbfc]">
      <div className="flex font-mono text-[12.5px] leading-relaxed max-h-[480px] overflow-y-auto scrollbar-thin">
        {/* Line Numbers Column */}
        <div className="select-none text-right pr-3 pl-4 py-4 bg-[#f4f4f3] border-r border-[#e8e8e6] text-slate-400 font-mono min-w-[3.2rem] text-xs">
          {lines.map((_, i) => (
            <div key={i} className="h-5 select-none">{i + 1}</div>
          ))}
        </div>
        
        {/* Code Column */}
        <div className="flex-1 pl-4 pr-4 py-4 overflow-x-auto whitespace-pre font-mono text-slate-800 bg-[#fbfbfa]">
          {lines.map((line, i) => (
            <div 
              key={i} 
              className="h-5 hover:bg-slate-200/40 px-1 rounded transition-colors"
              dangerouslySetInnerHTML={{ __html: getHighlightedHtml(line) || "&nbsp;" }}
            />
          ))}
        </div>
      </div>

      {isEditable && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="absolute right-4 bottom-4 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
        >
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit Code
        </button>
      )}
    </div>
  );
}

export default function App() {
  // User States
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState(null);
  const [problems, setProblems] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [leetcodeCalendar, setLeetcodeCalendar] = useState(null);
  const [syncFeedback, setSyncFeedback] = useState({});
  const [fetchingSubmissionsStatus, setFetchingSubmissionsStatus] = useState({});
  const [sessionCookie, setSessionCookie] = useState("");
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [reviewProblemSlug, setReviewProblemSlug] = useState("");

  // Active Problem Details (Audit Workspace)
  const [questionTitle, setQuestionTitle] = useState("Two Sum");
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [codeA, setCodeA] = useState("");
  const [codeB, setCodeB] = useState("");
  const [checkAgainstCommunity, setCheckAgainstCommunity] = useState(false);

  // States for automatic source code retrieval and dropdown selectors
  const [currentSubmissions, setCurrentSubmissions] = useState([]);
  const [selectedSubAId, setSelectedSubAId] = useState("");
  const [selectedSubBId, setSelectedSubBId] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [selectedPrevSubId, setSelectedPrevSubId] = useState("");
  const [editorKey, setEditorKey] = useState(0);

  // Analysis Reports
  const [report, setReport] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Restore session conceptually if saved in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("leetcode_connected_user");
    const savedCookie = localStorage.getItem("leetcode_session_cookie") || "";
    if (savedCookie) {
      setSessionCookie(savedCookie);
    }
    if (savedUser) {
      setUsername(savedUser);
      // Automatically load their connected profile and problem stats on startup
      connectLeetCodeAccount(savedUser, savedCookie);
    }
  }, []);

  // 1. Authenticate & Connect LeetCode profile
  const connectLeetCodeAccount = async (targetUser, cookie) => {
    setLoadingUser(true);
    setUserError(null);
    setUserData(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/leetcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: targetUser, sessionCookie: cookie })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `LeetCode user "${targetUser}" profile not found.`);
      }

      const json = await res.json();
      if (json.success && json.username) {
        setUserData({
          username: json.username,
          profile: json.profile || {},
          submitStats: json.submitStats || { acSubmissionNum: [], totalSubmissionNum: [] }
        });
        setUsername(json.username);
        setHasSession(!!json.hasSession);
        localStorage.setItem("leetcode_connected_user", json.username);
        
        if (cookie) {
          localStorage.setItem("leetcode_session_cookie", cookie);
          setSessionCookie(cookie);
        } else if (!cookie && !json.hasSession) {
          localStorage.removeItem("leetcode_session_cookie");
          setSessionCookie("");
        }

        // Fetch their live submissions
        await syncSubmissions(json.username, cookie);
      }
    } catch (err) {
      console.error("Connect failed:", err);
      setUserError(err.message || "Failed to authenticate LeetCode profile.");
    } finally {
      setLoadingUser(false);
    }
  };

  // 2. Fetch and Cache submission list
  const syncSubmissions = async (targetUser, activeCookie = "") => {
    setFetchingSubmissionsStatus(prev => ({ ...prev, [targetUser]: true }));
    setSyncFeedback(prev => ({ ...prev, [targetUser]: "" }));

    try {
      const cookieToSend = activeCookie || sessionCookie;
      const res = await fetch(`${API_BASE_URL}/api/fetch-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: targetUser, sessionCookie: cookieToSend })
      });

      if (!res.ok) {
        throw new Error(`Failed to sync submission index (HTTP ${res.status})`);
      }

      const json = await res.json();
      if (json.success) {
        setSyncFeedback(prev => ({
          ...prev,
          [targetUser]: `Successfully synced ${json.syncedCount || (json.submissions && json.submissions.length) || 0} submissions!`
        }));
        // Reload problems lists
        await loadProblemsList(targetUser, cookieToSend);
      }
    } catch (err) {
      console.error("Sync submissions failed:", err);
      setSyncFeedback(prev => ({
        ...prev,
        [targetUser]: "Sync finished. Check code analyzer below."
      }));
      await loadProblemsList(targetUser, activeCookie || sessionCookie);
    } finally {
      setFetchingSubmissionsStatus(prev => ({ ...prev, [targetUser]: false }));
    }
  };

  const loadAllSubmissions = async (targetUser, activeCookie = "") => {
    try {
      const cookieToSend = activeCookie || sessionCookie;
      const res = await fetch(`${API_BASE_URL}/api/all-submissions?username=${encodeURIComponent(targetUser)}&sessionCookie=${encodeURIComponent(cookieToSend)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.submissions) setAllSubmissions(json.submissions);
          if (json.calendar) setLeetcodeCalendar(json.calendar);
        }
      }
    } catch (err) {
      console.error("Failed to load submissions for calendar heatmap:", err);
    }
  };

  // 3. Load dynamic problems list with pre-calculated statistics from backend
  const loadProblemsList = async (targetUser, activeCookie = "") => {
    try {
      const cookieToSend = activeCookie || sessionCookie;
      const res = await fetch(`${API_BASE_URL}/api/problems?username=${encodeURIComponent(targetUser)}&sessionCookie=${encodeURIComponent(cookieToSend)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.problems) {
          setProblems(json.problems);
        }
      }
      await loadAllSubmissions(targetUser, cookieToSend);
    } catch (err) {
      console.error("Problems fetch error:", err);
    }
  };

  // 4. Select a problem and lazy-load full source codes for analysis
  const selectProblemForAnalysis = async (title, slug, lang = "javascript") => {
    setQuestionTitle(title);
    setReviewProblemSlug(slug);
    setIsReviewDrawerOpen(true);
    const resolvedPrompt = `Solve or optimize LeetCode problem "${title}" under the titleSlug: ${slug}`;
    setQuestionPrompt(resolvedPrompt);
    setReport(null);
    setAnalysisError(null);
    setLoadingSubmissions(true);

    // Set fallback instructions
    setCodeA("// Syncing details from secure backend cache...");
    setCodeB("// Loading baseline comparisons...");
    setPreviousSubmissions([]);
    setSelectedPrevSubId("");
    setCurrentSubmissions([]);
    setSelectedSubAId("");
    setSelectedSubBId("");

    try {
      const cookieToSend = sessionCookie;
      const res = await fetch(`${API_BASE_URL}/api/problem-submissions/${slug}?username=${encodeURIComponent(username)}&sessionCookie=${encodeURIComponent(cookieToSend)}`);
      if (!res.ok) {
        throw new Error("Failed to load problem code details.");
      }

      const json = await res.json();
      // Even if no active session, backend will return successfully cached profile indicator
      setHasSession(true);

      if (json.success) {
        const subs = json.submissions || [];
        setCurrentSubmissions(subs);

        let codeAText = "";
        let codeBText = "";

        if (subs.length > 0) {
          const subA = subs[0];
          setSelectedSubAId(subA.submissionId || subA.id);
          codeAText = subA.code || "";
          setCodeA(codeAText);

          if (subs.length > 1) {
            const subB = subs[1];
            setSelectedSubBId(subB.submissionId || subB.id);
            codeBText = subB.code || "";
            setCodeB(codeBText);
          } else {
            setSelectedSubBId("");
            codeBText = "// Only one submission exists for this problem.";
            setCodeB(codeBText);
          }
        } else {
          setCodeA("// No submissions loaded.");
          setSelectedSubAId("");
          setCodeB("// No submissions loaded.");
          setSelectedSubBId("");
        }

        // Force a full re-render of the editor to clear any caches or internal states
        setEditorKey(prev => prev + 1);

        // Automatically run evaluation if we have codes
        if (codeAText && codeBText && !codeBText.startsWith("//")) {
          handleAnalyzeDuplicacy(codeAText, codeBText, title, resolvedPrompt);
        }
      }
    } catch (err) {
      console.error("Failed to load problem submissions:", err);
      setCodeA(`// Failed to load source code. Paste Code A here.`);
      setCodeB(`// Failed to load comparison. Paste Code B here.`);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // 5. Perform side-by-side structural plagiarism similarity checks
  const handleAnalyzeDuplicacy = async (overrideCodeA, overrideCodeB, overrideTitle, overridePrompt) => {
    const finalCodeA = typeof overrideCodeA === "string" ? overrideCodeA : codeA;
    const finalCodeB = typeof overrideCodeB === "string" ? overrideCodeB : codeB;
    const finalTitle = typeof overrideTitle === "string" ? overrideTitle : questionTitle;
    const finalPrompt = typeof overridePrompt === "string" ? overridePrompt : questionPrompt;

    if (!finalCodeA.trim()) {
      setAnalysisError("Primary code input (Code A) is required to run comparison.");
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisError(null);
    setReport(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/check-duplicates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeA: finalCodeA,
          codeB: finalCodeB,
          questionTitle: finalTitle,
          questionPrompt: finalPrompt,
          checkAgainstCommunity
        })
      });

      if (!res.ok) {
        throw new Error(`Backend check failed (HTTP ${res.status})`);
      }

      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysisError(err.message || "Failed to run plagiarism evaluation.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500/20">
      
      {/* HEADER BANNER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/15 hover:scale-105 transition-all duration-300">
              <Code2 className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight font-display text-slate-900">
                  LeetShield
                </h1>
                <span className="hidden sm:inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-emerald-100">
                  Production-Ready Live Build
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold tracking-wide">
                Advanced LeetCode Plagiarism & Duplicate Reviewer
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* WORKSPACE */}
        <div className="transition-all duration-300">
          <FetcherTab
            username={username}
            setUsername={setUsername}
            userData={userData}
            loadingUser={loadingUser}
            userError={userError}
            problems={problems}
            allSubmissions={allSubmissions}
            leetcodeCalendar={leetcodeCalendar}
            syncFeedback={syncFeedback}
            onConnectAccount={connectLeetCodeAccount}
            onSelectProblemForAnalysis={selectProblemForAnalysis}
            fetchingSubmissionsStatus={fetchingSubmissionsStatus}
            onSyncSubmissions={syncSubmissions}
          />
        </div>

      </main>

      <ReviewDrawer
        isOpen={isReviewDrawerOpen}
        onClose={() => setIsReviewDrawerOpen(false)}
        problemTitle={questionTitle}
        problemSlug={reviewProblemSlug}
        submissions={currentSubmissions}
        loading={loadingSubmissions || loadingAnalysis}
        report={report}
        onManualAnalyze={handleAnalyzeDuplicacy}
        username={username}
        problems={problems}
      />
    </div>
  );
}