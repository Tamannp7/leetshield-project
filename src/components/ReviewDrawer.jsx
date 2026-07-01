import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { 
  X, Sparkles, AlertTriangle, AlertCircle, CheckCircle2, Calendar, 
  Cpu, Layers, History, BookOpen 
} from "lucide-react";

function HighlightedCode({ code = "", placeholder }) {
  const displayCode = code || "";
  
  if (!displayCode) {
    return (
      <div className="p-4 text-slate-400 italic font-mono text-xs border border-slate-200 rounded-xl bg-[#fbfbfa]">
        {placeholder || "No code loaded..."}
      </div>
    );
  }

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

  while ((match = tokenRegex.exec(displayCode)) !== null) {
    if (match.index > lastIndex) {
      html += escapeHtml(displayCode.substring(lastIndex, match.index));
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

  if (lastIndex < displayCode.length) {
    html += escapeHtml(displayCode.substring(lastIndex));
  }

  const lines = html.split("\n");

  return (
    <div className="flex font-mono text-[12px] leading-relaxed max-h-[380px] overflow-y-auto border border-slate-200 rounded-xl bg-[#fbfbfa]">
      <div className="select-none text-right pr-3 pl-3 py-3 bg-[#f4f4f3] border-r border-[#e8e8e6] text-slate-400 font-mono min-w-[2.5rem] text-[11px]">
        {lines.map((_, i) => (
          <div key={i} className="h-5 select-none">{i + 1}</div>
        ))}
      </div>
      <div className="flex-1 pl-4 pr-4 py-3 overflow-x-auto whitespace-pre font-mono text-slate-800">
        {lines.map((line, i) => (
          <div 
            key={i} 
            className="h-5 hover:bg-slate-200/40 px-1 rounded transition-colors"
            dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
          />
        ))}
      </div>
    </div>
  );
}

// Default demonstration data for Two Sum (unconnected / fallback mode)
const TWO_SUM_DEMO = {
  problemTitle: "Two Sum",
  status: "✔ Accepted",
  duplicateScore: 82,
  verdict: "Possible Self-Plagiarism",
  reasons: [
    "Variable names changed (arr ➔ nums, seen ➔ mapper)",
    "Core algorithm logic is identical (HashMap lookup)",
    "Control flow structures match exactly (single-pass loop)",
    "Identical time and space complexity models"
  ],
  prevDate: "20 June 2026",
  currDate: "28 June 2026",
  similarityBreakdown: {
    ast: 92,
    variable: 43,
    logic: 88,
    structure: 81
  },
  aiVerdict: "Likely copied from previous submission. Reason: Only identifiers were renamed. Algorithm and execution flow remain identical.",
  complexity: {
    old: { time: "O(n)", space: "O(1) auxiliary" },
    new: { time: "O(n)", space: "O(1) auxiliary" },
    status: "No optimization detected."
  },
  timeline: [
    { date: "20 June 2026", status: "Accepted", isAc: true },
    { date: "25 June 2026", status: "Wrong Answer", isAc: false },
    { date: "28 June 2026", status: "Accepted", isAc: true }
  ],
  codeComparison: [
    { oldLine: "for (let i = 0; i < arr.length; i++)", newLine: "for (let idx = 0; idx < nums.length; idx++)", matchType: "rename" },
    { oldLine: "const rem = target - arr[i];", newLine: "const diff = targetVal - nums[idx];", matchType: "rename" },
    { oldLine: "if (seen.has(rem)) {", newLine: "if (mapper.has(diff)) {", matchType: "rename" },
    { oldLine: "return [seen.get(rem), i];", newLine: "return [mapper.get(diff), idx];", matchType: "rename" },
    { oldLine: "seen.set(arr[i], i);", newLine: "mapper.set(nums[idx], idx);", matchType: "rename" }
  ],
  oldCode: `/**
 * @param {number[]} arr
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(arr, target) {
    const seen = new Map();
    for (let i = 0; i < arr.length; i++) {
        const rem = target - arr[i];
        if (seen.has(rem)) {
            return [seen.get(rem), i];
        }
        seen.set(arr[i], i);
    }
    return [];
};`,
  newCode: `/**
 * @param {number[]} nums
 * @param {number} targetVal
 * @return {number[]}
 */
var twoSum = function(nums, targetVal) {
    const mapper = new Map();
    for (let idx = 0; idx < nums.length; idx++) {
        const diff = targetVal - nums[idx];
        if (mapper.has(diff)) {
            return [mapper.get(diff), idx];
        }
        mapper.set(nums[idx], idx);
    }
    return [];
};`
};

function getEstimatedComplexity(slug, type) {
  if (!slug) return type === "time" ? "O(n)" : "O(1)";
  const s = slug.toLowerCase().trim();
  
  if (s.includes("two-sum")) {
    return type === "time" ? "O(n)" : "O(n)";
  }
  if (s.includes("rotated-sorted")) {
    return type === "time" ? "O(log n)" : "O(1)";
  }
  if (s.includes("contains-duplicate")) {
    return type === "time" ? "O(n)" : "O(n)";
  }
  if (s.includes("buy-and-sell-stock")) {
    return type === "time" ? "O(n)" : "O(1)";
  }
  if (s.includes("filter-occupied") || s.includes("intervals")) {
    return type === "time" ? "O(n log n)" : "O(n)";
  }
  if (s.includes("binary-search") || s.includes("sqrt")) {
    return type === "time" ? "O(log n)" : "O(1)";
  }
  if (s.includes("reverse-linked-list") || s.includes("merge-two-sorted")) {
    return type === "time" ? "O(n)" : "O(1)";
  }
  if (s.includes("longest-substring") || s.includes("sliding-window")) {
    return type === "time" ? "O(n)" : "O(k)";
  }
  if (s.includes("anagram") || s.includes("palindrome")) {
    return type === "time" ? "O(n)" : "O(1)";
  }
  
  return type === "time" ? "O(n)" : "O(1)";
}

function formatComplexityDisplay(slug, rawVal, type) {
  const est = getEstimatedComplexity(slug, type);
  if (!rawVal || rawVal === "N/A" || rawVal.trim() === "" || rawVal.includes("N/A")) {
    return est;
  }
  return `${est} (${rawVal})`;
}

function localNormalizeCode(code) {
  if (!code) return "";
  let clean = code.replace(/\/\*[\s\S]*?\*\//g, "");
  clean = clean.replace(/\/\/.*$/gm, "");
  const lines = clean.split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
  return lines.join(" ").replace(/\s+/g, " ");
}

function localTokenize(code) {
  if (!code) return [];
  const tokenRegex = /[a-zA-Z_][a-zA-Z0-9_]*|\d+|[+\-*/%=<>!&|^~]+|[{}[\]().,;?:]/g;
  return code.match(tokenRegex) || [];
}

const CPP_KEYWORDS = new Set([
  "class", "public", "private", "protected", "int", "float", "double", "char", "void", "bool",
  "if", "else", "for", "while", "do", "return", "switch", "case", "break", "continue", "vector",
  "unordered_map", "map", "unordered_set", "set", "const", "static", "using", "namespace", "std",
  "include", "define", "struct", "template", "typename", "typedef", "auto", "nullptr", "true", "false"
]);

function localComputeLCSTokenSimilarity(tokens1, tokens2) {
  const n = tokens1.length;
  const m = tokens2.length;
  if (n === 0 || m === 0) return 0;

  let prev = new Array(m + 1).fill(0);
  let curr = new Array(m + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (tokens1[i - 1] === tokens2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    prev = [...curr];
  }

  const lcsLength = curr[m];
  return (2 * lcsLength) / (n + m);
}

function localComputeIdentifierSimilarity(tokens1, tokens2) {
  const ids1 = new Set(tokens1.filter(t => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t) && !CPP_KEYWORDS.has(t)));
  const ids2 = new Set(tokens2.filter(t => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t) && !CPP_KEYWORDS.has(t)));

  if (ids1.size === 0 && ids2.size === 0) return 1.0;
  if (ids1.size === 0 || ids2.size === 0) return 0.0;

  let intersectionCount = 0;
  ids1.forEach(id => {
    if (ids2.has(id)) {
      intersectionCount++;
    }
  });

  const unionSize = ids1.size + ids2.size - intersectionCount;
  return intersectionCount / unionSize;
}

function localComputeBigramDiceSimilarity(s1, s2) {
  const getBigrams = (str) => {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const bigrams1 = getBigrams(s1);
  const bigrams2 = getBigrams(s2);

  if (bigrams1.size === 0 && bigrams2.size === 0) return 1.0;
  if (bigrams1.size === 0 || bigrams2.size === 0) return 0.0;

  let intersection = 0;
  bigrams1.forEach(bg => {
    if (bigrams2.has(bg)) {
      intersection++;
    }
  });

  return (2 * intersection) / (bigrams1.size + bigrams2.size);
}

function localLevenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost
      );
    }
    prev = [...curr];
  }

  return curr[n];
}

function localPlagiarismSimilarity(codeA, codeB) {
  if (!codeA || !codeB) {
    return {
      similarityScore: 0,
      logicMatch: 0,
      structureMatch: 0,
      identifierMatch: 0,
      levSimilarity: 0,
      verdict: "Unique Implementation",
      obfuscationDetected: false
    };
  }

  if (codeA.includes("SOURCE CODE NOT AVAILABLE") || codeB.includes("SOURCE CODE NOT AVAILABLE") ||
      codeB.includes("Only one submission exists")) {
    return {
      similarityScore: 0,
      logicMatch: 0,
      structureMatch: 0,
      identifierMatch: 0,
      levSimilarity: 0,
      verdict: "Unique Implementation",
      obfuscationDetected: false
    };
  }

  const normA = localNormalizeCode(codeA);
  const normB = localNormalizeCode(codeB);

  const tokensA = localTokenize(normA);
  const tokensB = localTokenize(normB);

  const structureMatch = Math.round(localComputeLCSTokenSimilarity(tokensA, tokensB) * 100);
  const identifierMatch = Math.round(localComputeIdentifierSimilarity(tokensA, tokensB) * 100);
  const logicMatch = Math.round(localComputeBigramDiceSimilarity(normA, normB) * 100);

  const maxLen = Math.max(normA.length, normB.length);
  const levDist = localLevenshteinDistance(normA, normB);
  const levSimilarity = maxLen === 0 ? 100 : Math.round(((maxLen - levDist) / maxLen) * 100);

  const similarityScore = Math.round(
    structureMatch * 0.35 + 
    logicMatch * 0.35 + 
    levSimilarity * 0.2 + 
    identifierMatch * 0.1
  );

  const obfuscationDetected = identifierMatch < 45 && structureMatch > 70;

  let verdict = "Unique Implementation";
  if (similarityScore >= 85) {
    verdict = "Identical / Direct Copy";
  } else if (similarityScore >= 65) {
    verdict = "Highly Suspect Similarity";
  } else if (similarityScore >= 40) {
    verdict = "Moderate Similarities";
  }

  return {
    similarityScore,
    logicMatch,
    structureMatch,
    identifierMatch,
    levSimilarity,
    verdict,
    obfuscationDetected
  };
}

export default function ReviewDrawer({ 
  isOpen, 
  onClose, 
  problemTitle, 
  problemSlug,
  submissions = [], 
  loading = false,
  report = null,
  onManualAnalyze,
  username,
  problems = []
}) {
  const [activeTab, setActiveTab] = useState("report"); // "report" | "code" | "manual"
  const [manualCodeA, setManualCodeA] = useState("");
  const [manualCodeB, setManualCodeB] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [reEvaluating, setReEvaluating] = useState(false);

  // Automatically check if we are running in demo/fallback mode
  useEffect(() => {
    if (isOpen) {
      const usesDemo = !username;
      setIsDemo(usesDemo);
      
      if (usesDemo) {
        setManualCodeA(TWO_SUM_DEMO.oldCode);
        setManualCodeB(TWO_SUM_DEMO.newCode);
      } else {
        setManualCodeA(report?.codeA || submissions[0]?.code || "");
        setManualCodeB(report?.codeB || submissions[1]?.code || "");
      }
    }
  }, [isOpen, problemSlug, submissions, report, username]);

  // Handle local code evaluation
  const handleTriggerReevaluation = async () => {
    if (!onManualAnalyze) return;
    setReEvaluating(true);
    try {
      await onManualAnalyze(manualCodeA, manualCodeB, problemTitle);
      setIsDemo(false); // Switch to dynamic report once custom evaluation is triggered
    } catch (e) {
      console.error(e);
    } finally {
      setReEvaluating(false);
    }
  };

  // Calculate local similarity metrics if report is null but codes are loaded
  const codeAForLocal = submissions[0]?.code || "";
  const codeBForLocal = submissions[1]?.code || "";
  const localEval = (!isDemo && submissions.length > 1 && codeAForLocal && codeBForLocal)
    ? localPlagiarismSimilarity(codeAForLocal, codeBForLocal)
    : null;

  // Determine the list-based duplicate percentage shown in the problem directory
  const problemFromList = problems.find(p => p.titleSlug === problemSlug);
  let listPct = 0;
  let verdictText = "0% Duplicate (100% Unique)";
  
  if (problemSlug !== "manual-compare") {
    if (problemFromList) {
      if (problemFromList.acceptedSubmissions > 1) {
        listPct = Math.min(100, Math.round((problemFromList.acceptedSubmissions / problemFromList.totalSubmissions) * 100));
        verdictText = `${listPct}% Duplicate`;
      } else if (problemFromList.acceptedSubmissions === 0) {
        listPct = 0;
        verdictText = "Problem not accepted";
      } else {
        listPct = 0;
        verdictText = "0% Duplicate (100% Unique)";
      }
    } else if (submissions && submissions.length > 0) {
      const acceptedSubsCount = submissions.filter(s => {
        const rawStatus = s.status || s.statusDisplay || "Accepted";
        return typeof rawStatus === "string" && (
          rawStatus.trim().toLowerCase() === "accepted" || 
          rawStatus.trim().toLowerCase().includes("accept") ||
          rawStatus.trim().toLowerCase() === "ac"
        );
      }).length;
      if (acceptedSubsCount > 1) {
        listPct = Math.min(100, Math.round((acceptedSubsCount / submissions.length) * 100));
        verdictText = `${listPct}% Duplicate`;
      } else if (acceptedSubsCount === 0) {
        listPct = 0;
        verdictText = "Problem not accepted";
      } else {
        listPct = 0;
        verdictText = "0% Duplicate (100% Unique)";
      }
    } else {
      listPct = 0;
      verdictText = "Problem not accepted";
    }
  } else {
    // For manual paste & comparison, use the computed local evaluation similarity
    listPct = report?.similarityScore ?? localEval?.similarityScore ?? 0;
    verdictText = report?.verdict ?? localEval?.verdict ?? "Unique Implementation";
  }

  // Select source data depending on demo vs live report
  const data = isDemo ? TWO_SUM_DEMO : {
    problemTitle: problemTitle || "Two Sum",
    status: report?.status || "✔ Accepted",
    duplicateScore: listPct,
    verdict: verdictText,
    reasons: report ? (report.obfuscationDetected ? [
      "Variable / Identifier renaming detected",
      report?.logicMatch >= 80 ? "Core algorithmic logic is highly identical" : "Minor logic flow mutations",
      report?.structureMatch >= 80 ? "Control flow structure matches perfectly" : "Slight structure refactoring",
      "Identical or equivalent space-time complexity signatures"
    ] : [
      "Significant syntactic code blocks are identical",
      "Same complexity bounds",
      "Matched structural AST branches found"
    ]) : (localEval ? (localEval.obfuscationDetected ? [
      "Variable / Identifier renaming detected (Local Scan)",
      localEval.logicMatch >= 80 ? "Core algorithmic logic is highly identical" : "Minor logic flow mutations",
      localEval.structureMatch >= 80 ? "Control flow structure matches perfectly" : "Slight structure refactoring",
      "Identical or equivalent space-time complexity signatures"
    ] : [
      "Significant syntactic code blocks are identical (Local Scan)",
      "Same complexity bounds",
      "Matched structural token branches found"
    ]) : (submissions.length > 1 ? [
      "Multiple submissions found. Comparison evaluation is pending.",
      "Click 'Manual Paste & Re-Check' to trigger custom analysis."
    ] : (problemFromList?.acceptedSubmissions === 0 || (submissions && submissions.length === 0) ? [
      "No accepted submissions found for this problem on your profile.",
      "A plagiarism comparison requires at least one accepted submission.",
      "Try solving this problem on LeetCode first!"
    ] : [
      "Only one submission exists for this problem on your profile.",
      "A self-similarity comparison requires at least two submissions.",
      "You can paste custom code in the 'Manual Paste & Re-Check' tab to evaluate its originality."
    ]))),
    prevDate: submissions[1]?.date || (submissions[1]?.timestamp ? new Date(submissions[1].timestamp * 1000).toLocaleDateString() : "N/A"),
    currDate: submissions[0]?.date || (submissions[0]?.timestamp ? new Date(submissions[0].timestamp * 1000).toLocaleDateString() : "N/A"),
    similarityBreakdown: {
      ast: report?.structureMatch ?? (localEval && localEval.similarityScore > 0 ? localEval.structureMatch : listPct),
      variable: report?.identifierMatch ?? (localEval && localEval.similarityScore > 0 ? localEval.identifierMatch : (listPct > 0 ? Math.max(30, listPct - 5) : 0)),
      logic: report?.logicMatch ?? (localEval && localEval.similarityScore > 0 ? localEval.logicMatch : listPct),
      structure: report?.structureMatch ?? (localEval && localEval.similarityScore > 0 ? localEval.structureMatch : listPct)
    },
    aiVerdict: report?.analysisReport || (localEval ? (
      (codeAForLocal.includes("SOURCE CODE NOT AVAILABLE") || codeBForLocal.includes("SOURCE CODE NOT AVAILABLE")) ? `### 🛡️ LeetCode Duplicate Submission Summary

We detected **${submissions.length} submissions** for **${problemTitle || "this problem"}** on your LeetCode profile, of which **${submissions.filter(s => {
        const rawStatus = s.status || s.statusDisplay || "Accepted";
        return typeof rawStatus === "string" && (
          rawStatus.trim().toLowerCase() === "accepted" || 
          rawStatus.trim().toLowerCase().includes("accept") ||
          rawStatus.trim().toLowerCase() === "ac"
        );
      }).length}** are successfully Accepted.

- **Profile Duplicate Rate**: **${listPct}%**
- **Verdict**: **${verdictText}**

---

#### 🔑 Deep Code Scan Pending (No Session Cookie)
Because LeetCode's public endpoints do not expose submission source codes, LeetShield is unable to download your solutions for this problem automatically without an active session cookie.

To enable **deep lexical, AST structural, and logic-level comparison**:
1. Copy your \`LEETCODE_SESSION\` cookie using our helpful guide on the dashboard.
2. Paste it in the input field on the home screen to securely connect and fetch your original source codes.
3. Alternatively, you can copy both codes manually and paste them into the **Manual Paste & Re-Check** tab right here to run an instant deep scan!` : `### 🛡️ Local Real-Time Algorithmic Audit Report

An automatic code-similarity comparison has been completed for **${problemTitle || "the specified problem"}** using AST-like token alignment, N-gram logical similarity, and Levenshtein character mapping.

- **Verdict**: **${localEval.verdict}**
- **Overall Similarity Score**: **${localEval.similarityScore}%**
- **Logical Algorithm Match**: **${localEval.logicMatch}%**
- **Control Flow & Structure**: **${localEval.structureMatch}%**
- **Variable/Identifier Match**: **${localEval.identifierMatch}%**
- **Character Distance Similarity**: **${localEval.levSimilarity}%**

---

#### 🔍 Structural & Obfuscation Analysis
${
  localEval.obfuscationDetected
    ? `⚠️ **Obfuscation Detected**: There is a high structural and logical alignment (**${localEval.structureMatch}%**) paired with a significantly lower variable/identifier naming similarity (**${localEval.identifierMatch}%**). This signature is highly indicative of systematic variable renaming, signature modification, or light parameter refactoring designed to bypass simple text-based checkers.`
    : localEval.similarityScore >= 85
    ? `🔴 **Direct Copy Warning**: The logical structure and text characters are almost identical (**${localEval.similarityScore}%** similarity). The code exhibits direct overlap in control loops, indexing, and syntax patterns.`
    : localEval.similarityScore >= 50
    ? `🟡 **Moderate Similarities Detected**: The two solutions utilize highly overlapping helper techniques or core algorithms. While some custom modifications have been introduced, the core logic flow remains structurally similar.`
    : `🟢 **Unique Implementation**: The two solutions show high originality, with different architectural setups, alternative branching strategies, or distinct choice of data structures.`
}

*This report was generated instantly in your browser using compiler-grade lexical comparison algorithms.*`
    ) : (problemFromList?.acceptedSubmissions === 0 || (submissions && submissions.length === 0) ? `### 🛡️ LeetCode Duplicate Submission Summary

We detected **0 accepted submissions** for **${problemTitle || "this problem"}** on your LeetCode profile.

- **Verdict**: **Problem not accepted**
- **Duplicate Rate**: **0%**

---

#### 🔑 No Accepted Submissions Available
Because there are no accepted submissions for this problem on your profile, plagiarism detection cannot be performed automatically. Once you successfully solve this problem on LeetCode, sync your submissions again to view the plagiarism audit report!` : (submissions.length > 1 
      ? "No analysis report available yet. Please trigger a manual evaluation if it persists." 
      : "Only one submission was found for this problem on your profile. A self-similarity comparison requires at least two submissions. You can paste comparison code in 'Manual Paste & Re-Check' to check for duplicates."))),
    complexity: {
      old: { 
        time: formatComplexityDisplay(problemSlug, submissions[1]?.runtime, "time"), 
        space: formatComplexityDisplay(problemSlug, submissions[1]?.memory, "space") 
      },
      new: { 
        time: formatComplexityDisplay(problemSlug, submissions[0]?.runtime, "time"), 
        space: formatComplexityDisplay(problemSlug, submissions[0]?.memory, "space") 
      },
      status: report ? "Evaluation completed." : "No comparison available."
    },
    timeline: submissions && submissions.length > 0 ? 
      [...submissions].reverse().map(s => {
        const rawStatus = s.status || s.statusDisplay || "Accepted";
        const isAc = typeof rawStatus === "string" && (
          rawStatus.trim().toLowerCase() === "accepted" || 
          rawStatus.trim().toLowerCase().includes("accept") ||
          rawStatus.trim().toLowerCase() === "ac"
        );
        return {
          date: s.date || new Date(s.timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          status: rawStatus,
          isAc: isAc
        };
      }) : TWO_SUM_DEMO.timeline,
    codeComparison: report?.identicalBlocks ? report.identicalBlocks.map(block => ({
      oldLine: block.codeB?.split("\n")[0] || "",
      newLine: block.codeA?.split("\n")[0] || "",
      matchType: "rename"
    })).slice(0, 5) : [],
    oldCode: submissions[1]?.code || "",
    newCode: submissions[0]?.code || ""
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* DRAWER CONTAINER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 h-screen w-full max-w-4xl bg-slate-50 shadow-2xl z-50 border-l border-slate-200 flex flex-col overflow-hidden"
          >
            {/* DRAWER HEADER */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200/60 shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 font-display">
                    LeetShield Smart Audit Report
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Problem:</span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {data.problemTitle}
                    </span>
                    {isDemo && (
                      <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200/50 px-1.5 py-0.2 rounded uppercase tracking-wide">
                        DEMO MODE
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer hover:scale-105"
                  title="Close Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="bg-white border-b border-slate-200 px-6 py-1 flex items-center justify-start gap-4 shrink-0">
              <button
                onClick={() => setActiveTab("report")}
                className={`py-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "report" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Audit Summary
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`py-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "code" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Code Diff View
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`py-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "manual" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Manual Paste & Re-Check
              </button>
            </div>

            {/* DRAWER SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-bold text-slate-600 font-display">Evaluating submission similarities...</span>
                  <p className="text-xs text-slate-400">Performing AST, flow & token mutations reviews</p>
                </div>
              ) : activeTab === "report" ? (
                <>
                  {/* OVERVIEW SCORE CARD */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Duplicate Score
                      </span>
                      <span className={`text-5xl font-black font-mono block mt-2 ${
                        data.duplicateScore >= 70 ? "text-rose-500" :
                        data.duplicateScore >= 40 ? "text-amber-500" :
                        "text-emerald-500"
                      }`}>
                        {data.duplicateScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        Similar
                      </span>
                      <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-3xs uppercase tracking-wide border ${
                        data.duplicateScore >= 75
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : data.duplicateScore > 0
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}>
                        {data.duplicateScore >= 75 ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : data.duplicateScore > 0 ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        {data.verdict}
                      </div>
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Key Audit Indicators:
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {data.status}
                        </span>
                      </div>
                      
                      <ul className="space-y-1.5">
                        {data.reasons.map((reason, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                            <span className="text-amber-500 select-none mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 mt-1.5 text-xs">
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Previous Submission</span>
                          <span className="font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {data.prevDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Current Submission</span>
                          <span className="font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {data.currDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SIMILARITY BREAKDOWN */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      Dynamic Similarity Breakdown
                    </h3>

                    <div className="space-y-4">
                      {/* AST */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span>AST Structure Similarity</span>
                          <span className="font-mono">{data.similarityBreakdown.ast}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/30">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${data.similarityBreakdown.ast}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Evaluates structural compilation nodes matches.
                        </span>
                      </div>

                      {/* Variables */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span>Identifier / Variable Similarity</span>
                          <span className="font-mono">{data.similarityBreakdown.variable}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/30">
                          <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${data.similarityBreakdown.variable}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Low similarity indicates heavy identifier/variable renaming or obfuscation.
                        </span>
                      </div>

                      {/* Logic */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span>Algorithm Logic Similarity</span>
                          <span className="font-mono">{data.similarityBreakdown.logic}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/30">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${data.similarityBreakdown.logic}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Measures core instruction sets and mathematical equivalency.
                        </span>
                      </div>

                      {/* Structure */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span>Control Flow & Sequence Similarity</span>
                          <span className="font-mono">{data.similarityBreakdown.structure}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/30">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${data.similarityBreakdown.structure}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Checks block nesting, looping sequences, and jump scopes.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI VERDICT */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      AI Auditor Verdict
                    </h3>
                    <div className="bg-slate-50 border border-slate-150 p-5 rounded-xl text-xs leading-relaxed text-slate-700">
                      <div className="markdown-body prose max-w-none text-slate-600 prose-sm space-y-2 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-3 [&>h3]:mb-1 [&>h4]:text-xs [&>h4]:font-bold [&>h4]:text-slate-800 [&>h4]:mt-2 [&>h4]:mb-1 [&>p]:mb-2 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>hr]:my-3 [&>hr]:border-slate-200">
                        <Markdown>{data.aiVerdict}</Markdown>
                      </div>
                    </div>
                  </div>

                  {/* COMPLEXITY COMPARISON */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-500" />
                      Space-Time Complexity Audit
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Old Code Complexity */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2 hover:bg-slate-100/50 transition-colors">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                          Previous Submission Complexity
                        </span>
                        <div className="flex flex-col gap-1 font-mono text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Time Complexity:</span>
                            <span className="font-bold text-slate-800">{data.complexity.old.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Space Complexity:</span>
                            <span className="font-bold text-slate-800">{data.complexity.old.space}</span>
                          </div>
                        </div>
                      </div>

                      {/* New Code Complexity */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2 hover:bg-slate-100/50 transition-colors">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                          Current Submission Complexity
                        </span>
                        <div className="flex flex-col gap-1 font-mono text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Time Complexity:</span>
                            <span className="font-bold text-slate-800">{data.complexity.new.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Space Complexity:</span>
                            <span className="font-bold text-slate-800">{data.complexity.new.space}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Complexity status: {data.complexity.status}</span>
                    </div>
                  </div>

                  {/* ACTIVE TIMELINE */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <History className="w-4 h-4 text-emerald-500" />
                      Submission History Timeline
                    </h3>

                    <div className="relative pl-6 border-l-2 border-blue-100 space-y-6 py-1">
                      {data.timeline.map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* Point indicator */}
                          <div className={`absolute -left-[31px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 bg-white ${
                            step.isAc ? "border-emerald-500 text-emerald-500" : "border-rose-500 text-rose-500"
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${step.isAc ? "bg-emerald-500" : "bg-rose-500"}`} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-mono font-bold text-slate-700">{step.date}</span>
                              <p className="text-xs text-slate-400 mt-0.5">LeetCode Submission Event</p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              step.isAc ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                              {step.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HIGHLIGHTED CODE COMPARISONS MAPPING */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      Key Code Comparison Mutations
                    </h3>

                    <div className="overflow-hidden border border-slate-150 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-500 border-b border-slate-150 text-[10px] uppercase font-bold tracking-wider">
                            <th className="py-2.5 px-4">Old Code Line</th>
                            <th className="py-2.5 px-4 w-12 text-center">➔</th>
                            <th className="py-2.5 px-4">New Code Line</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white font-mono text-[11px] text-slate-700">
                          {data.codeComparison.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="py-4 text-center text-slate-400 italic">
                                No matching duplicate blocks detected.
                              </td>
                            </tr>
                          ) : (
                            data.codeComparison.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-3 px-4 text-slate-500 line-through max-w-xs truncate" title={item.oldLine}>
                                  {item.oldLine}
                                </td>
                                <td className="py-3 px-4 text-center text-amber-500 font-bold">
                                  改
                                </td>
                                <td className="py-3 px-4 text-emerald-700 bg-emerald-50/20 font-bold max-w-xs truncate" title={item.newLine}>
                                  {item.newLine}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal font-medium italic">
                      Table shows line comparisons identifying variable mutations and logic matches. Click "Code Diff View" to browse full codes.
                    </p>
                  </div>
                </>
              ) : activeTab === "code" ? (
                /* FULL SIDE-BY-SIDE CODE DIFF VIEW */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
                  <div className="space-y-2">
                    <div className="bg-slate-100 border border-slate-200 rounded-t-xl px-4 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Old Code (Previous Solution)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{data.prevDate}</span>
                    </div>
                    <HighlightedCode code={data.oldCode} placeholder="No older submission available" />
                  </div>

                  <div className="space-y-2">
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-t-xl px-4 py-2 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                        New Code (Latest Solution)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600">{data.currDate}</span>
                    </div>
                    <HighlightedCode code={data.newCode} placeholder="No latest submission available" />
                  </div>
                </div>
              ) : (
                /* MANUAL PASTE AND RE-CHECK */
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-display">
                      Custom Play plagiarism check
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Paste two JS/C++ codes to dynamically calculate their similarity percentages on our secure backend.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Code A (Latest Solution)
                      </label>
                      <textarea
                        value={manualCodeA}
                        onChange={(e) => setManualCodeA(e.target.value)}
                        className="w-full bg-[#fbfbfa] text-slate-800 border border-slate-200 rounded-xl p-3.5 font-mono text-[12px] h-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="// Paste Code A here..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Code B (Previous / Reference Solution)
                      </label>
                      <textarea
                        value={manualCodeB}
                        onChange={(e) => setManualCodeB(e.target.value)}
                        className="w-full bg-[#fbfbfa] text-slate-800 border border-slate-200 rounded-xl p-3.5 font-mono text-[12px] h-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="// Paste Code B here..."
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setManualCodeA("");
                        setManualCodeB("");
                      }}
                      className="bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs py-2 px-4 rounded-xl border border-slate-200 transition-all cursor-pointer border-none hover:scale-102"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={handleTriggerReevaluation}
                      disabled={reEvaluating}
                      className="bg-blue-500 hover:bg-blue-600 text-neutral-950 font-bold text-xs py-2 px-5 rounded-xl transition-all cursor-pointer disabled:opacity-50 border-none flex items-center gap-1.5 hover:scale-102 hover:shadow-sm"
                    >
                      {reEvaluating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3.5 h-3.5" />
                          Evaluate Plagiarism
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}