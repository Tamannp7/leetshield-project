# 🛡️ LeetShield

> **AI-Powered LeetCode Submission Auditor**

LeetShield is an AI-powered LeetCode submission auditor that detects duplicate or reposted submissions, identifies suspicious similarity patterns, and generates AI-based review reports to help users better understand their coding activity.

---

## 💡 Inspiration

In this busy coding world, on my busy days, just to maintain my LeetCode streak and keep my contribution heatmap green, I often found myself resubmitting my previously accepted solutions.

One day, I thought, **"What if I could detect these reposted submissions instead of treating every accepted submission as genuine progress?"**

That's how **LeetShield** was born.

Instead of simply showing accepted submissions like LeetCode, LeetShield analyzes submission history, detects duplicate or highly similar solutions, and highlights reposted submissions in **red** on the heatmap, giving users a more meaningful picture of their coding consistency.

---

## ✨ How is LeetShield different from LeetCode?

LeetCode helps users solve coding problems and track their submissions.

**LeetShield analyzes those submissions.** It detects duplicate or reposted solutions, identifies suspicious similarity patterns, and provides an AI-generated review explaining why two submissions are considered similar.

---

# 🛠️ Tech Stack

### 🎨 Frontend

* React 19
* Vite
* Tailwind CSS
* Lucide React
* React Markdown

### ⚙️ Backend

* Node.js
* Express.js
* Axios
* CORS
* Dotenv

### 🤖 AI

* Google Gemini API

### 🌐 External API

* LeetCode GraphQL API

### 🚀 Deployment

* Frontend: Vercel
* Backend: Railway

---

# 🧠 How Duplicate Detection Works

LeetShield does **not** directly ask AI whether two codes are duplicates.

Instead, it first compares every submission using multiple similarity algorithms. These algorithms calculate a weighted similarity score, making the results consistent, explainable, and independent of AI responses.

### 📊 Weighted Similarity Formula

```text
Similarity Score =
0.35 × Structure Match
+ 0.35 × Logic Match
+ 0.20 × Levenshtein Similarity
+ 0.10 × Identifier Match
```

### Similarity Metrics

| Metric                    |  Weight | Purpose                                                                        |
| ------------------------- | :-----: | ------------------------------------------------------------------------------ |
| 🏗️ Structure Match       | **35%** | Compares the structure of two programs using Longest Common Subsequence (LCS). |
| 🧩 Logic Match            | **35%** | Compares logical flow using Bigram Dice Similarity.                            |
| ✏️ Levenshtein Similarity | **20%** | Measures edit distance between normalized source codes.                        |
| 🏷️ Identifier Match      | **10%** | Compares variable and function names using Jaccard Similarity.                 |

---

# 🚩 Code Obfuscation Detection

LeetShield can also identify simple code obfuscation.

If two submissions have a very similar structure but significantly different variable names, they are flagged as potentially obfuscated, helping detect cases where users try to hide copied code by simply renaming identifiers.

---

# 🤖 Why not use AI directly for duplicate detection?

A common approach is to send both codes directly to an LLM and ask whether they are similar.

However, this has several drawbacks:

* ❌ AI responses may not always be consistent.
* ❌ API rate limits and token limits can interrupt analysis.
* ❌ Sending every comparison to an LLM increases API cost.
* ❌ AI responses are slower than local algorithms.
* ❌ If the AI service is unavailable, duplicate detection would stop completely.

For these reasons, **LeetShield first calculates the similarity using deterministic algorithms.**

When the user clicks the **Review** button, Google Gemini uses those calculated metrics to generate a detailed explanation of the duplicate report.

> **Algorithms calculate the similarity. AI explains the similarity.**

---

# 🔄 AI Reliability

LeetShield includes a fallback mechanism for AI requests.

If one AI model reaches its rate limit or becomes unavailable, the backend automatically switches to alternative configured AI models, ensuring users can continue generating review reports with minimal interruption.

---

# 📈 Similarity Classification

| Similarity    | Result                  |
| ------------- | ----------------------- |
| 🟥 85% – 100% | Identical / Direct Copy |
| 🟧 65% – 84%  | Highly Similar          |
| 🟨 40% – 64%  | Moderate Similarity     |
| 🟩 Below 40%  | Mostly Unique           |

---

# ⚠️ Current Limitation

LeetShield depends on the data returned by the LeetCode GraphQL API.

Currently, LeetCode does not expose a user's complete submission history through its API. Due to pagination and platform restrictions, only the latest accessible submissions can be retrieved.

As a result:

* The heatmap is generated only from the retrieved submissions.
* Duplicate detection is limited to the available submission history.
* Older submissions cannot be analyzed because they are not exposed by LeetCode.

This limitation comes from LeetCode's API, not from LeetShield's duplicate detection engine.

---

# 🚀 Future Improvements

* 🌳 AST-based code comparison
* 🌍 Cross-language duplicate detection
* 📄 PDF report export
* 📈 Advanced analytics dashboard
* 🔐 User authentication
* 🗄️ Historical report storage
* 📱 Chrome Extension for one-click analysis

---

## 👩‍💻 Author

**Tamanna Priyadarshi**

GitHub: https://github.com/Tamannp7

---

## ⭐ Support

If you found this project interesting, consider giving it a **⭐ Star** on GitHub.

