/* =========================================================
   GATE CSE 2027 Command Center — script.js
   Pure vanilla JS. No dependencies. All state in localStorage.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. TIMELINE
  --------------------------------------------------------- */
  const START_DATE = new Date(2026, 6, 21); // July 21, 2026 (Tue)
  const END_DATE = new Date(2027, 1, 6);    // Feb 6, 2027
  const TOTAL_WEEKS = 28;
  const MS_DAY = 86400000;

  function dateAt(offsetDays) {
    return new Date(START_DATE.getTime() + offsetDays * MS_DAY);
  }
  function fmtISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function fmtHuman(d) {
    return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  function weekStartDate(weekNum) {
    return dateAt((weekNum - 1) * 7);
  }
  function weekEndDate(weekNum) {
    return dateAt((weekNum - 1) * 7 + 6);
  }
  function todayISO() {
    return fmtISO(new Date());
  }
  function currentWeekNumber() {
    const diff = Math.floor((new Date().setHours(0, 0, 0, 0) - START_DATE.setHours(0, 0, 0, 0)) / MS_DAY);
    const wk = Math.floor(diff / 7) + 1;
    return Math.min(Math.max(wk, 1), TOTAL_WEEKS);
  }

  /* ---------------------------------------------------------
     2. STATIC ROADMAP DATA
  --------------------------------------------------------- */
  const GATE_PHASES = [
    { range: [1, 6], subjects: ["Engineering Mathematics", "Discrete Mathematics", "Programming in C", "Data Structures", "Algorithms"], extra: ["PYQs", "Revision"] },
    { range: [7, 12], subjects: ["Digital Logic", "Computer Organization", "Operating Systems", "Problem Solving"], extra: ["Revision"] },
    { range: [13, 18], subjects: ["DBMS", "Computer Networks"], extra: ["Revision", "PYQs"] },
    { range: [19, 22], subjects: ["Theory of Computation", "Compiler Design", "General Aptitude"], extra: ["Revision"] },
    { range: [23, 28], subjects: ["Complete Revision", "Subject Revision"], extra: ["Daily PYQs", "Mock Tests", "Weak Topic Revision", "Formula Revision"] }
  ];

  const SUBJECT_TOPICS = {
    "Engineering Mathematics": ["Linear Algebra", "Calculus", "Probability & Statistics", "Numerical Methods"],
    "Discrete Mathematics": ["Set Theory & Relations", "Propositional & Predicate Logic", "Graph Theory", "Combinatorics & Counting"],
    "Programming in C": ["Pointers & Arrays", "Recursion", "Structures & Unions", "File Handling"],
    "Data Structures": ["Arrays & Linked Lists", "Stacks & Queues", "Trees & BSTs", "Graphs", "Hashing"],
    "Algorithms": ["Sorting & Searching", "Divide & Conquer", "Greedy Algorithms", "Dynamic Programming", "Graph Algorithms"],
    "Digital Logic": ["Number Systems", "Boolean Algebra & K-Maps", "Combinational Circuits", "Sequential Circuits"],
    "Computer Organization": ["CPU Architecture", "Memory Hierarchy & Cache", "Pipelining", "I/O Organization"],
    "Operating Systems": ["Process Management", "CPU Scheduling", "Synchronization", "Memory Management", "Deadlocks", "File Systems"],
    "Problem Solving": ["Timed Mixed Problem Set", "Speed Drill"],
    "DBMS": ["ER Modeling", "Relational Algebra & SQL", "Normalization", "Transactions & Concurrency", "Indexing & File Org"],
    "Computer Networks": ["OSI & TCP/IP Model", "Network & Routing Layer", "Transport Layer", "Application Layer Protocols", "Network Security Basics"],
    "Theory of Computation": ["Finite Automata", "Regular Expressions & Languages", "Context-Free Grammars", "Turing Machines", "Decidability & Complexity"],
    "Compiler Design": ["Lexical Analysis", "Parsing Techniques", "Syntax-Directed Translation", "Code Optimization"],
    "General Aptitude": ["Quantitative Aptitude", "Verbal Ability", "Logical Reasoning", "Data Interpretation"],
    "Complete Revision": ["Full Syllabus Sweep — Math & CS Core", "Full Syllabus Sweep — Systems & Theory"],
    "Subject Revision": ["Weak Subject Deep-Dive", "High-Weightage Topic Drill"]
  };

  const SE_TASKS = ["Python Basics", "Advanced Python", "OOP Concepts", "Git Fundamentals", "GitHub Workflows",
    "Linux Command Line", "SQL Fundamentals", "PostgreSQL", "FastAPI Basics", "REST API Design",
    "Authentication & Authorization", "Unit & Integration Testing", "Docker Basics", "Deployment Strategies",
    "CI/CD Basics", "Debugging Techniques", "Technical Documentation", "System Design Basics"];

  const AI_TASKS = ["NumPy", "Pandas", "Data Cleaning", "Missing Values Handling", "Outlier Detection",
    "Exploratory Data Analysis", "Feature Engineering", "Scikit-learn Basics", "Regression Models",
    "Classification Models", "Evaluation Metrics", "Hyperparameter Tuning", "Prompt Engineering", "Embeddings",
    "Hugging Face Basics", "Transformers Architecture", "LLM Fundamentals", "Vector Databases",
    "LangChain Basics", "Retrieval-Augmented Generation (RAG)", "Working with AI APIs",
    "Model Deployment Basics", "AI Project Integration Practice"];

  const REVIEW_ITEMS = ["Completed all GATE Tasks", "Completed Mock Test", "Completed PYQs", "GitHub Commit",
    "Project Updated", "Revision Done", "Workout Completed", "Reflection Written", "Weekly Goal Achieved"];

  const GATE_SUBJECTS = ["Engineering Mathematics", "Discrete Mathematics", "Programming in C", "Data Structures",
    "Algorithms", "Digital Logic", "Computer Organization", "Operating Systems", "DBMS", "Computer Networks",
    "Theory of Computation", "Compiler Design", "General Aptitude"];

  const SE_SKILLS = ["Python", "Git", "GitHub", "Linux", "SQL", "PostgreSQL", "FastAPI", "REST APIs", "Docker",
    "Testing", "Deployment", "System Design"];

  const AI_SKILLS = ["NumPy", "Pandas", "Data Cleaning", "EDA", "Feature Engineering", "Scikit-learn",
    "Machine Learning", "Deep Learning Basics", "Prompt Engineering", "Hugging Face", "Embeddings",
    "Transformers", "LangChain", "Vector Databases", "RAG", "LLM APIs", "Model Deployment"];

  const PROJECTS = [
    { id: "p1", name: "AI Data Analysis Dashboard", weekDeadline: 8 },
    { id: "p2", name: "Student Performance Prediction API", weekDeadline: 13 },
    { id: "p3", name: "Customer Churn Prediction System", weekDeadline: 18 },
    { id: "p4", name: "AI Resume Analyzer", weekDeadline: 22 },
    { id: "p5", name: "PDF Chat Assistant", weekDeadline: 26 }
  ];
  const PROJECT_CHECKLIST = ["Planning & Requirements", "Data Collection / Setup", "Core Development",
    "Testing & Debugging", "Documentation", "Deployment / Demo Polish"];

  const INTERVIEW_ITEMS = [
    { key: "resume", label: "Resume Finalized", type: "check" },
    { key: "linkedin", label: "LinkedIn Optimized", type: "check" },
    { key: "github", label: "GitHub Portfolio Polished", type: "check" },
    { key: "projectsDone", label: "All 5 Projects Completed", type: "check" },
    { key: "dsa", label: "DSA Problems Solved", type: "count" },
    { key: "sql", label: "SQL Problems Solved", type: "count" },
    { key: "mockInterviews", label: "Mock Interviews Done", type: "count" },
    { key: "behavioral", label: "Behavioral Questions Practiced", type: "check" },
    { key: "systemDesign", label: "System Design Practiced", type: "check" },
    { key: "hr", label: "HR Questions Practiced", type: "check" },
    { key: "communication", label: "Communication Skills Self-Rating (1-10)", type: "rating" }
  ];

  const NOTE_CATEGORIES = ["Weekly", "Daily", "Concept", "Interview", "Revision", "Mistake", "Idea"];

  /* ---------------------------------------------------------
     3. WEEK GENERATION (roadmap -> tasks)
  --------------------------------------------------------- */
  function phaseFor(weekNum) {
    return GATE_PHASES.find(p => weekNum >= p.range[0] && weekNum <= p.range[1]) || GATE_PHASES[GATE_PHASES.length - 1];
  }

  function buildWeekDef(weekNum) {
    const phase = phaseFor(weekNum);
    const idxInPhase = weekNum - phase.range[0];
    const gate = [];
    // pick up to 2 subjects for this week, rotating through the phase's subject list
    const subjCount = Math.min(2, phase.subjects.length);
    for (let s = 0; s < subjCount; s++) {
      const subject = phase.subjects[(idxInPhase * subjCount + s) % phase.subjects.length];
      const topics = SUBJECT_TOPICS[subject] || [subject];
      const topic = topics[idxInPhase % topics.length];
      gate.push({ id: "g" + weekNum + "_" + s, text: subject + ": " + topic });
    }
    phase.extra.forEach((ex, i) => {
      gate.push({ id: "g" + weekNum + "_x" + i, text: ex + " Session" });
    });

    const se = [{ id: "se" + weekNum, text: SE_TASKS[(weekNum - 1) % SE_TASKS.length] }];
    const ai = [{ id: "ai" + weekNum, text: AI_TASKS[(weekNum - 1) % AI_TASKS.length] }];

    return { weekNum, gate, se, ai };
  }

  const WEEK_DEFS = [];
  for (let w = 1; w <= TOTAL_WEEKS; w++) WEEK_DEFS.push(buildWeekDef(w));

  /* ---------------------------------------------------------
     4. STATE / PERSISTENCE
  --------------------------------------------------------- */
  const STORAGE_KEY = "gate_planner_state_v1";

  function defaultState() {
    const weeks = {};
    WEEK_DEFS.forEach(w => {
      weeks[w.weekNum] = { gate: {}, se: {}, ai: {}, review: {} };
    });
    const gateSubjects = {};
    GATE_SUBJECTS.forEach(s => { gateSubjects[s] = { progress: 0, revision: 0, pyq: 0, mock: 0, weak: "", notes: "" }; });
    const seSkills = {}; SE_SKILLS.forEach(s => seSkills[s] = 0);
    const aiSkills = {}; AI_SKILLS.forEach(s => aiSkills[s] = 0);
    const projects = {};
    PROJECTS.forEach(p => {
      const checklist = {};
      PROJECT_CHECKLIST.forEach(c => checklist[c] = false);
      projects[p.id] = { checklist, github: "", notes: "", deadline: fmtISO(weekEndDate(p.weekDeadline)) };
    });
    const interview = { dsa: 0, sql: 0, mockInterviews: 0, communication: 5,
      resume: false, linkedin: false, github: false, projectsDone: false, behavioral: false, systemDesign: false, hr: false };
    const revision = { daily: {}, weekly: {}, monthly: {}, final: {}, formulaNotebook: "", errorNotebook: "", weakTopics: "" };
    return {
      weeks, gateSubjects, seSkills, aiSkills, projects, interview, revision,
      mockTests: [], notes: [], days: {}, streak: { current: 0, longest: 0, lastDate: null },
      settings: { installPromptDismissed: false }
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // merge with defaults to tolerate schema growth
      const def = defaultState();
      return deepMerge(def, parsed);
    } catch (e) {
      console.error("State load failed", e);
      return defaultState();
    }
  }

  function deepMerge(base, override) {
    if (typeof base !== "object" || base === null || Array.isArray(base)) {
      return override !== undefined ? override : base;
    }
    const out = Object.assign({}, base);
    for (const k in override || {}) {
      if (Object.prototype.hasOwnProperty.call(base, k) && typeof base[k] === "object" && base[k] !== null && !Array.isArray(base[k])) {
        out[k] = deepMerge(base[k], override[k]);
      } else {
        out[k] = override[k];
      }
    }
    return out;
  }

  let saveTimer = null;
  function saveState() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        flashSaveIndicator();
      } catch (e) {
        console.error("Save failed", e);
      }
    }, 150);
  }

  function flashSaveIndicator() {
    const el = document.getElementById("saveIndicator");
    if (!el) return;
    el.classList.add("show");
    clearTimeout(flashSaveIndicator._t);
    flashSaveIndicator._t = setTimeout(() => el.classList.remove("show"), 900);
  }

  function getDay(iso) {
    if (!state.days[iso]) {
      state.days[iso] = { tasks: [], pomodoros: 0, studyMinutes: 0, water: [false, false, false, false, false, false, false, false], workout: false, notes: "" };
    }
    return state.days[iso];
  }

  /* ---------------------------------------------------------
     5. PROGRESS CALCULATIONS
  --------------------------------------------------------- */
  function pct(done, total) { return total === 0 ? 0 : Math.round((done / total) * 100); }

  function weekTaskCounts(weekNum) {
    const def = WEEK_DEFS[weekNum - 1];
    const rec = state.weeks[weekNum];
    const all = [...def.gate, ...def.se, ...def.ai];
    const done = all.filter(t => rec.gate[t.id] || rec.se[t.id] || rec.ai[t.id]).length;
    return { done, total: all.length };
  }

  function gateWeekProgress(weekNum) {
    const def = WEEK_DEFS[weekNum - 1];
    const rec = state.weeks[weekNum];
    const done = def.gate.filter(t => rec.gate[t.id]).length;
    return pct(done, def.gate.length);
  }

  function overallGateProgress() {
    let done = 0, total = 0;
    WEEK_DEFS.forEach(def => {
      const rec = state.weeks[def.weekNum];
      total += def.gate.length;
      done += def.gate.filter(t => rec.gate[t.id]).length;
    });
    return pct(done, total);
  }
  function overallSEProgress() {
    const vals = SE_SKILLS.map(s => state.seSkills[s] || 0);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  function overallAIProgress() {
    const vals = AI_SKILLS.map(s => state.aiSkills[s] || 0);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  function overallProjectsProgress() {
    let sum = 0;
    PROJECTS.forEach(p => {
      const proj = state.projects[p.id];
      const done = PROJECT_CHECKLIST.filter(c => proj.checklist[c]).length;
      sum += pct(done, PROJECT_CHECKLIST.length);
    });
    return Math.round(sum / PROJECTS.length);
  }
  function interviewReadiness() {
    let score = 0, max = 0;
    INTERVIEW_ITEMS.forEach(it => {
      if (it.type === "check") { max += 100; if (state.interview[it.key]) score += 100; }
      else if (it.type === "count") { max += 100; score += Math.min(100, (state.interview[it.key] || 0) * 5); }
      else if (it.type === "rating") { max += 100; score += (state.interview[it.key] || 0) * 10; }
    });
    return pct(score, max);
  }
  function revisionProgress() {
    const cats = ["daily", "weekly", "monthly", "final"];
    let done = 0, total = 0;
    cats.forEach(c => {
      const obj = state.revision[c];
      const keys = Object.keys(obj);
      total += Math.max(keys.length, 1);
      done += keys.filter(k => obj[k]).length;
    });
    return pct(done, total);
  }
  function weeklyCompletionAvg() {
    let sum = 0;
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      const { done, total } = weekTaskCounts(w);
      sum += pct(done, total);
    }
    return Math.round(sum / TOTAL_WEEKS);
  }
  function overallProgress() {
    const parts = [overallGateProgress() * 2, overallSEProgress(), overallAIProgress(), overallProjectsProgress(), interviewReadiness(), revisionProgress()];
    const weights = [2, 1, 1, 1, 1, 1];
    const sum = parts.reduce((a, b) => a + b, 0);
    return Math.round(sum / weights.reduce((a, b) => a + b, 0));
  }
  function totalCompletedTasks() {
    let n = 0;
    WEEK_DEFS.forEach(def => {
      const rec = state.weeks[def.weekNum];
      n += def.gate.filter(t => rec.gate[t.id]).length;
      n += def.se.filter(t => rec.se[t.id]).length;
      n += def.ai.filter(t => rec.ai[t.id]).length;
    });
    return n;
  }
  function totalTasks() {
    let n = 0;
    WEEK_DEFS.forEach(def => { n += def.gate.length + def.se.length + def.ai.length; });
    return n;
  }

  function recomputeStreak() {
    // Streak = consecutive days ending today/yesterday with >=1 completed daily task or weekly task touched
    let current = 0;
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    for (;;) {
      const iso = fmtISO(d);
      const day = state.days[iso];
      const active = day && (day.tasks.some(t => t.done) || day.studyMinutes > 0 || day.pomodoros > 0);
      if (active) { current++; d = new Date(d.getTime() - MS_DAY); }
      else break;
    }
    state.streak.current = current;
    state.streak.longest = Math.max(state.streak.longest || 0, current);
  }

  /* ---------------------------------------------------------
     6. SVG ICONS (inline, no external assets)
  --------------------------------------------------------- */
  const ICONS = {
    dashboard: '<svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>',
    weeks: '<svg viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm-2 6h14v12H5V8z"/></svg>',
    daily: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5.4l4 2.3-.8 1.3L11 13V7h2z"/></svg>',
    gate: '<svg viewBox="0 0 24 24"><path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7H4z"/></svg>',
    skills: '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.5L21 9l-5 4.6L17.5 21 12 17l-5.5 4L8 13.6 3 9l6.6-.5z"/></svg>',
    projects: '<svg viewBox="0 0 24 24"><path d="M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v2H3V6zm0 4h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z"/></svg>',
    interview: '<svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z"/></svg>',
    tests: '<svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>',
    revision: '<svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6a6 6 0 11-6 6H4a8 8 0 108-8z"/></svg>',
    notes: '<svg viewBox="0 0 24 24"><path d="M5 3h14a1 1 0 011 1v16l-4-3H5a1 1 0 01-1-1V4a1 1 0 011-1zm2 4h10v2H7V7zm0 4h10v2H7v-2z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><path d="M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm12 8H5v9h14v-9z"/></svg>',
    analytics: '<svg viewBox="0 0 24 24"><path d="M4 20V10h3v10H4zm6.5 0V4h3v16h-3zM17 20V13h3v7h-3z"/></svg>',
    data: '<svg viewBox="0 0 24 24"><path d="M12 3c-4.4 0-8 1.1-8 2.5v13C4 19.9 7.6 21 12 21s8-1.1 8-2.5v-13C20 4.1 16.4 3 12 3zm0 2c3.9 0 6 .9 6 .5S15.9 6 12 6s-6-.9-6-.5S8.1 5 12 5z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 10-.7.7l.3.3v.8l5 5L20.5 19l-5-5zm-6 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 3-3 4-3 8a3 3 0 006 0c1 1 2 2.5 2 4.5A5.5 5.5 0 1112 8.5C10.5 6 11 3.5 12 2z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7zm3-4h6l1 2H8l1-2zM4 6h16v2H4V6z"/></svg>',
    water: '<svg viewBox="0 0 24 24"><path d="M12 2s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z"/></svg>',
    timer: '<svg viewBox="0 0 24 24"><path d="M9 1h6v2H9V1zm3 4a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm-1 2h2v4.5l3.5 2-.9 1.5L11 13V9z"/></svg>'
  };

  /* ---------------------------------------------------------
     7. UI HELPERS
  --------------------------------------------------------- */
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }

  function ring(percent, size, label) {
    size = size || 84;
    const r = (size / 2) - 8;
    const c = 2 * Math.PI * r;
    const offset = c - (percent / 100) * c;
    const wrap = el("div", { class: "ring-wrap" });
    wrap.innerHTML =
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-bg"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-fg" style="stroke-dasharray:' + c + ';stroke-dashoffset:' + offset + '"/>' +
      '</svg><div class="ring-label"><strong>' + percent + '%</strong>' + (label ? '<span>' + label + '</span>' : '') + '</div>';
    return wrap;
  }

  function bar(percent, colorClass) {
    const wrap = el("div", { class: "bar" });
    const fill = el("div", { class: "bar-fill " + (colorClass || "") });
    fill.style.width = percent + "%";
    wrap.appendChild(fill);
    return wrap;
  }

  function statusClass(percent) {
    if (percent >= 100) return "status-done";
    if (percent > 0) return "status-progress";
    return "status-pending";
  }

  /* ---------------------------------------------------------
     8. ROUTER / TABS
  --------------------------------------------------------- */
  const TABS = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "weeks", label: "Weekly Planner", icon: "weeks" },
    { id: "daily", label: "Daily Planner", icon: "daily" },
    { id: "gate", label: "GATE Subjects", icon: "gate" },
    { id: "skills", label: "Skill Trackers", icon: "skills" },
    { id: "projects", label: "Projects", icon: "projects" },
    { id: "interview", label: "Interview Prep", icon: "interview" },
    { id: "tests", label: "Mock & PYQ", icon: "tests" },
    { id: "revision", label: "Revision", icon: "revision" },
    { id: "notes", label: "Notes", icon: "notes" },
    { id: "calendar", label: "Calendar", icon: "calendar" },
    { id: "analytics", label: "Analytics", icon: "analytics" },
    { id: "data", label: "Data & Export", icon: "data" }
  ];

  let currentTab = "dashboard";
  let currentDayISO = todayISO();
  let weekFilter = "all";
  let openWeeks = new Set([currentWeekNumber()]);

  function switchTab(id) {
    currentTab = id;
    document.querySelectorAll(".navbtn").forEach(b => b.classList.toggle("active", b.dataset.tab === id));
    render();
    document.getElementById("mainScroll").scrollTop = 0;
    closeSideNav();
  }

  function closeSideNav() {
    document.getElementById("sideNav").classList.remove("open");
    document.getElementById("navOverlay").classList.remove("open");
  }

  /* ---------------------------------------------------------
     9. RENDER: DASHBOARD
  --------------------------------------------------------- */
  function renderDashboard(root) {
    recomputeStreak();
    const wk = currentWeekNumber();
    const iso = todayISO();
    const day = getDay(iso);

    const grid = el("div", { class: "card-grid" });

    const heroCard = el("div", { class: "card hero-card" });
    heroCard.appendChild(ring(overallProgress(), 108, "Overall"));
    const heroText = el("div", { class: "hero-text" }, [
      el("h2", {}, ["Week " + wk + " of " + TOTAL_WEEKS]),
      el("p", { class: "muted" }, [fmtHuman(weekStartDate(wk)) + " – " + fmtHuman(weekEndDate(wk))]),
      el("div", { class: "streak-pill", html: ICONS.flame + " <strong>" + state.streak.current + "</strong> day streak" })
    ]);
    heroCard.appendChild(heroText);
    grid.appendChild(heroCard);

    const metrics = [
      ["GATE Progress", overallGateProgress()],
      ["Software Skills", overallSEProgress()],
      ["AI Skills", overallAIProgress()],
      ["Projects", overallProjectsProgress()],
      ["Interview Readiness", interviewReadiness()],
      ["Revision Progress", revisionProgress()],
      ["Weekly Completion Avg", weeklyCompletionAvg()]
    ];
    metrics.forEach(([label, val]) => {
      const c = el("div", { class: "card metric-card" });
      c.appendChild(el("div", { class: "metric-top" }, [
        el("span", {}, [label]),
        el("span", { class: "metric-val" }, [val + "%"])
      ]));
      c.appendChild(bar(val));
      grid.appendChild(c);
    });

    const statsCard = el("div", { class: "card stats-card" });
    const done = totalCompletedTasks(), tot = totalTasks();
    [["Total Completed", done], ["Remaining Tasks", tot - done], ["Current Streak", state.streak.current + "d"], ["Longest Streak", state.streak.longest + "d"]].forEach(([l, v]) => {
      statsCard.appendChild(el("div", { class: "stat-item" }, [el("strong", {}, [String(v)]), el("span", {}, [l])]));
    });
    grid.appendChild(statsCard);

    root.appendChild(grid);

    // Today's tasks
    const todaySec = el("div", { class: "section" });
    todaySec.appendChild(el("h3", {}, ["Today's Tasks — " + fmtHuman(new Date())]));
    const list = el("div", { class: "task-list" });
    if (day.tasks.length === 0) {
      list.appendChild(el("p", { class: "muted" }, ["No tasks added yet for today. Add some in Daily Planner."]));
    } else {
      day.tasks.forEach(t => list.appendChild(taskRow(t, () => { t.done = !t.done; saveState(); render(); })));
    }
    todaySec.appendChild(list);
    root.appendChild(todaySec);

    // Upcoming milestones
    const mile = el("div", { class: "section" });
    mile.appendChild(el("h3", {}, ["Upcoming Milestones"]));
    const ul = el("div", { class: "milestone-list" });
    PROJECTS.forEach(p => {
      const proj = state.projects[p.id];
      const doneC = PROJECT_CHECKLIST.filter(c => proj.checklist[c]).length;
      const pc = pct(doneC, PROJECT_CHECKLIST.length);
      ul.appendChild(el("div", { class: "milestone-row" }, [
        el("span", { class: "dot " + statusClass(pc) }),
        el("span", { class: "milestone-name" }, [p.name]),
        el("span", { class: "muted" }, [proj.deadline]),
        el("span", { class: "muted" }, [pc + "%"])
      ]));
    });
    mile.appendChild(ul);
    root.appendChild(mile);
  }

  function taskRow(t, onToggle) {
    const row = el("div", { class: "task-row" + (t.done ? " done" : "") });
    const box = el("button", { class: "checkbox" + (t.done ? " checked" : ""), html: t.done ? ICONS.check : "" });
    box.addEventListener("click", onToggle);
    row.appendChild(box);
    row.appendChild(el("span", { class: "task-text" }, [t.text]));
    return row;
  }

  /* ---------------------------------------------------------
     10. RENDER: WEEKLY PLANNER
  --------------------------------------------------------- */
  function renderWeeks(root) {
    const filterBar = el("div", { class: "filter-bar" });
    ["all", "completed", "pending", "gate", "software", "ai"].forEach(f => {
      const b = el("button", { class: "chip" + (weekFilter === f ? " active" : "") }, [f[0].toUpperCase() + f.slice(1)]);
      b.addEventListener("click", () => { weekFilter = f; render(); });
      filterBar.appendChild(b);
    });
    root.appendChild(filterBar);

    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      root.appendChild(weekAccordion(w));
    }
  }

  function passesFilter(task, doneFlag) {
    if (weekFilter === "all") return true;
    if (weekFilter === "completed") return doneFlag;
    if (weekFilter === "pending") return !doneFlag;
    return true; // gate/software/ai handled by section-level filtering
  }

  function weekAccordion(w) {
    const def = WEEK_DEFS[w - 1];
    const rec = state.weeks[w];
    const { done, total } = weekTaskCounts(w);
    const p = pct(done, total);
    const isOpen = openWeeks.has(w);

    const card = el("div", { class: "card week-card" + (w === currentWeekNumber() ? " current" : "") });
    const header = el("div", { class: "week-header" });
    header.appendChild(el("div", { class: "week-title" }, [
      el("span", { class: "dot " + statusClass(p) }),
      el("strong", {}, ["Week " + w]),
      el("span", { class: "muted small" }, [fmtHuman(weekStartDate(w)) + " – " + fmtHuman(weekEndDate(w))])
    ]));
    header.appendChild(el("div", { class: "week-progress" }, [el("span", {}, [p + "%"]), el("span", { class: "chevron" + (isOpen ? " open" : "") }, ["▾"])]));
    header.addEventListener("click", () => { isOpen ? openWeeks.delete(w) : openWeeks.add(w); render(); });
    card.appendChild(header);
    card.appendChild(bar(p));

    if (isOpen) {
      const body = el("div", { class: "week-body" });

      if (weekFilter === "all" || weekFilter === "completed" || weekFilter === "pending" || weekFilter === "gate") {
        body.appendChild(weekSection("GATE Tasks", def.gate, rec.gate, w));
      }
      if (weekFilter === "all" || weekFilter === "completed" || weekFilter === "pending" || weekFilter === "software") {
        body.appendChild(weekSection("Software Engineering", def.se, rec.se, w));
      }
      if (weekFilter === "all" || weekFilter === "completed" || weekFilter === "pending" || weekFilter === "ai") {
        body.appendChild(weekSection("AI Engineering", def.ai, rec.ai, w));
      }

      // Weekly review
      const reviewSec = el("div", { class: "subsection" });
      reviewSec.appendChild(el("h4", {}, ["Weekly Review"]));
      const reviewGrid = el("div", { class: "review-grid" });
      REVIEW_ITEMS.forEach(item => {
        const checked = !!rec.review[item];
        const row = el("label", { class: "review-item" + (checked ? " done" : "") });
        const cb = el("input", { type: "checkbox" });
        cb.checked = checked;
        cb.addEventListener("change", () => { rec.review[item] = cb.checked; saveState(); render(); });
        row.appendChild(cb);
        row.appendChild(el("span", {}, [item]));
        reviewGrid.appendChild(row);
      });
      reviewSec.appendChild(reviewGrid);
      body.appendChild(reviewSec);

      card.appendChild(body);
    }
    return card;
  }

  function weekSection(title, tasks, recBucket, w) {
    const sec = el("div", { class: "subsection" });
    sec.appendChild(el("h4", {}, [title]));
    const list = el("div", { class: "task-list" });
    let visible = 0;
    tasks.forEach(t => {
      const doneFlag = !!recBucket[t.id];
      if (!passesFilter(t, doneFlag)) return;
      visible++;
      list.appendChild(taskRow({ text: t.text, done: doneFlag }, () => {
        recBucket[t.id] = !recBucket[t.id];
        saveState(); render();
      }));
    });
    if (visible === 0) list.appendChild(el("p", { class: "muted small" }, ["No tasks match this filter."]));
    sec.appendChild(list);
    return sec;
  }

  /* ---------------------------------------------------------
     11. RENDER: DAILY PLANNER
  --------------------------------------------------------- */
  function renderDaily(root) {
    const bar1 = el("div", { class: "day-nav" });
    const prev = el("button", { class: "iconbtn" }, ["‹"]);
    const next = el("button", { class: "iconbtn" }, ["›"]);
    const dateInput = el("input", { type: "date", value: currentDayISO, class: "date-input" });
    prev.addEventListener("click", () => { currentDayISO = fmtISO(new Date(new Date(currentDayISO).getTime() - MS_DAY)); render(); });
    next.addEventListener("click", () => { currentDayISO = fmtISO(new Date(new Date(currentDayISO).getTime() + MS_DAY)); render(); });
    dateInput.addEventListener("change", e => { currentDayISO = e.target.value; render(); });
    const todayBtn = el("button", { class: "chip" }, ["Today"]);
    todayBtn.addEventListener("click", () => { currentDayISO = todayISO(); render(); });
    bar1.appendChild(prev); bar1.appendChild(dateInput); bar1.appendChild(next); bar1.appendChild(todayBtn);
    root.appendChild(bar1);

    const day = getDay(currentDayISO);

    // Tasks
    const taskSec = el("div", { class: "section" });
    taskSec.appendChild(el("h3", {}, ["Today's Tasks"]));
    const addRow = el("div", { class: "add-row" });
    const input = el("input", { type: "text", placeholder: "Add a task…", class: "text-input" });
    const prioSel = el("select", { class: "select-input" }, [
      el("option", { value: "high" }, ["High Priority"]),
      el("option", { value: "med" }, ["Medium Priority"]),
      el("option", { value: "low" }, ["Low Priority"])
    ]);
    const addBtn = el("button", { class: "iconbtn primary", html: ICONS.plus });
    function addTask() {
      const v = input.value.trim();
      if (!v) return;
      day.tasks.push({ id: "t" + Date.now(), text: v, done: false, priority: prioSel.value });
      input.value = "";
      saveState(); render();
    }
    addBtn.addEventListener("click", addTask);
    input.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });
    addRow.appendChild(input); addRow.appendChild(prioSel); addRow.appendChild(addBtn);
    taskSec.appendChild(addRow);

    const priorityOrder = { high: 0, med: 1, low: 2 };
    const sorted = [...day.tasks].sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1));
    const list = el("div", { class: "task-list" });
    sorted.forEach(t => {
      const row = taskRow(t, () => { t.done = !t.done; saveState(); render(); });
      row.classList.add("prio-" + (t.priority || "med"));
      const del = el("button", { class: "iconbtn small", html: ICONS.trash });
      del.addEventListener("click", () => { day.tasks = day.tasks.filter(x => x.id !== t.id); saveState(); render(); });
      row.appendChild(del);
      list.appendChild(row);
    });
    taskSec.appendChild(list);
    root.appendChild(taskSec);

    const completed = day.tasks.filter(t => t.done).length;
    const missed = day.tasks.filter(t => !t.done).length;
    const summary = el("div", { class: "mini-stats" }, [
      el("span", {}, ["✅ Completed: " + completed]),
      el("span", {}, ["⏳ Missed/Pending: " + missed])
    ]);
    root.appendChild(summary);

    // Pomodoro / Study timer
    const grid = el("div", { class: "card-grid" });

    const pomoCard = el("div", { class: "card" });
    pomoCard.appendChild(el("h4", { html: ICONS.timer + " Pomodoro Timer" }));
    const pomoDisplay = el("div", { class: "timer-display", id: "pomoDisplay" }, ["25:00"]);
    pomoCard.appendChild(pomoDisplay);
    const pomoBtns = el("div", { class: "btn-row" });
    const startPomo = el("button", { class: "btn" }, ["Start"]);
    const resetPomo = el("button", { class: "btn ghost" }, ["Reset"]);
    const logPomo = el("button", { class: "btn ghost" }, ["+1 Completed (" + day.pomodoros + ")"]);
    pomoBtns.appendChild(startPomo); pomoBtns.appendChild(resetPomo); pomoBtns.appendChild(logPomo);
    pomoCard.appendChild(pomoBtns);
    logPomo.addEventListener("click", () => { day.pomodoros++; day.studyMinutes += 25; saveState(); render(); });
    setupPomodoro(startPomo, resetPomo, pomoDisplay, () => { day.pomodoros++; day.studyMinutes += 25; saveState(); });
    grid.appendChild(pomoCard);

    const studyCard = el("div", { class: "card" });
    studyCard.appendChild(el("h4", {}, ["Study Timer (minutes today)"]));
    const studyInput = el("input", { type: "number", min: "0", value: day.studyMinutes, class: "text-input" });
    studyInput.addEventListener("change", () => { day.studyMinutes = Math.max(0, parseInt(studyInput.value) || 0); saveState(); render(); });
    studyCard.appendChild(studyInput);
    grid.appendChild(studyCard);

    const waterCard = el("div", { class: "card" });
    waterCard.appendChild(el("h4", { html: ICONS.water + " Water Reminder (8 glasses)" }));
    const waterRow = el("div", { class: "water-row" });
    day.water.forEach((filled, i) => {
      const drop = el("button", { class: "water-drop" + (filled ? " filled" : ""), html: ICONS.water });
      drop.addEventListener("click", () => { day.water[i] = !day.water[i]; saveState(); render(); });
      waterRow.appendChild(drop);
    });
    waterCard.appendChild(waterRow);
    grid.appendChild(waterCard);

    const workoutCard = el("div", { class: "card" });
    workoutCard.appendChild(el("h4", {}, ["Workout Reminder"]));
    const wLabel = el("label", { class: "review-item" + (day.workout ? " done" : "") });
    const wCb = el("input", { type: "checkbox" }); wCb.checked = day.workout;
    wCb.addEventListener("change", () => { day.workout = wCb.checked; saveState(); render(); });
    wLabel.appendChild(wCb); wLabel.appendChild(el("span", {}, ["Workout Completed"]));
    workoutCard.appendChild(wLabel);
    grid.appendChild(workoutCard);

    root.appendChild(grid);

    const notesSec = el("div", { class: "section" });
    notesSec.appendChild(el("h3", {}, ["Notes"]));
    const ta = el("textarea", { class: "textarea-input", rows: "4", placeholder: "Jot down anything about today…" });
    ta.value = day.notes;
    ta.addEventListener("input", () => { day.notes = ta.value; saveState(); });
    notesSec.appendChild(ta);
    root.appendChild(notesSec);
  }

  let pomoInterval = null;
  function setupPomodoro(startBtn, resetBtn, display, onComplete) {
    let seconds = 25 * 60;
    let running = false;
    function paint() {
      const m = Math.floor(seconds / 60), s = seconds % 60;
      display.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }
    startBtn.addEventListener("click", () => {
      if (running) { clearInterval(pomoInterval); running = false; startBtn.textContent = "Start"; return; }
      running = true; startBtn.textContent = "Pause";
      pomoInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(pomoInterval); running = false; startBtn.textContent = "Start";
          seconds = 25 * 60; paint(); onComplete();
        } else paint();
      }, 1000);
    });
    resetBtn.addEventListener("click", () => {
      clearInterval(pomoInterval); running = false; startBtn.textContent = "Start"; seconds = 25 * 60; paint();
    });
    paint();
  }

  /* ---------------------------------------------------------
     12. RENDER: GATE SUBJECT TRACKER
  --------------------------------------------------------- */
  function renderGate(root) {
    const grid = el("div", { class: "card-grid" });
    GATE_SUBJECTS.forEach(sub => {
      const data = state.gateSubjects[sub];
      const card = el("div", { class: "card subject-card" });
      card.appendChild(el("h4", {}, [sub]));
      ["progress", "revision", "pyq", "mock"].forEach(field => {
        const labelMap = { progress: "Progress %", revision: "Revision %", pyq: "PYQs %", mock: "Mock Tests %" };
        const row = el("div", { class: "slider-row" });
        row.appendChild(el("span", {}, [labelMap[field]]));
        const range = el("input", { type: "range", min: "0", max: "100", value: data[field] });
        const valSpan = el("span", { class: "slider-val" }, [data[field] + "%"]);
        range.addEventListener("input", () => { data[field] = parseInt(range.value); valSpan.textContent = data[field] + "%"; saveState(); });
        range.addEventListener("change", render);
        row.appendChild(range); row.appendChild(valSpan);
        card.appendChild(row);
      });
      const weak = el("input", { type: "text", class: "text-input", placeholder: "Weak areas…", value: data.weak });
      weak.addEventListener("input", () => { data.weak = weak.value; saveState(); });
      card.appendChild(weak);
      const notes = el("textarea", { class: "textarea-input", rows: "2", placeholder: "Notes…" });
      notes.value = data.notes;
      notes.addEventListener("input", () => { data.notes = notes.value; saveState(); });
      card.appendChild(notes);
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  /* ---------------------------------------------------------
     13. RENDER: SKILL TRACKERS
  --------------------------------------------------------- */
  function skillGrid(list, store) {
    const grid = el("div", { class: "card-grid" });
    list.forEach(name => {
      const card = el("div", { class: "card skill-card" });
      card.appendChild(el("div", { class: "metric-top" }, [el("span", {}, [name]), el("span", { class: "metric-val" }, [store[name] + "%"])]));
      const range = el("input", { type: "range", min: "0", max: "100", value: store[name] });
      range.addEventListener("input", () => {
        store[name] = parseInt(range.value);
        card.querySelector(".metric-val").textContent = store[name] + "%";
        card.querySelector(".bar-fill").style.width = store[name] + "%";
        saveState();
      });
      card.appendChild(bar(store[name]));
      card.appendChild(range);
      grid.appendChild(card);
    });
    return grid;
  }

  function renderSkills(root) {
    root.appendChild(el("h3", {}, ["Software Engineering Skills"]));
    root.appendChild(skillGrid(SE_SKILLS, state.seSkills));
    root.appendChild(el("h3", {}, ["AI Engineering Skills"]));
    root.appendChild(skillGrid(AI_SKILLS, state.aiSkills));
  }

  /* ---------------------------------------------------------
     14. RENDER: PROJECTS
  --------------------------------------------------------- */
  function renderProjects(root) {
    const grid = el("div", { class: "card-grid" });
    PROJECTS.forEach(p => {
      const proj = state.projects[p.id];
      const doneC = PROJECT_CHECKLIST.filter(c => proj.checklist[c]).length;
      const pc = pct(doneC, PROJECT_CHECKLIST.length);
      const card = el("div", { class: "card project-card" });
      card.appendChild(el("div", { class: "metric-top" }, [el("strong", {}, [p.name]), el("span", { class: "metric-val" }, [pc + "%"])]));
      card.appendChild(bar(pc));
      const dl = el("div", { class: "field-row" }, [el("span", {}, ["Deadline"]), el("input", { type: "date", value: proj.deadline, class: "date-input" })]);
      dl.querySelector("input").addEventListener("change", e => { proj.deadline = e.target.value; saveState(); render(); });
      card.appendChild(dl);

      const checklistWrap = el("div", { class: "review-grid" });
      PROJECT_CHECKLIST.forEach(c => {
        const checked = !!proj.checklist[c];
        const row = el("label", { class: "review-item" + (checked ? " done" : "") });
        const cb = el("input", { type: "checkbox" }); cb.checked = checked;
        cb.addEventListener("change", () => { proj.checklist[c] = cb.checked; saveState(); render(); });
        row.appendChild(cb); row.appendChild(el("span", {}, [c]));
        checklistWrap.appendChild(row);
      });
      card.appendChild(checklistWrap);

      const gh = el("input", { type: "url", class: "text-input", placeholder: "GitHub repository link…", value: proj.github });
      gh.addEventListener("input", () => { proj.github = gh.value; saveState(); });
      card.appendChild(gh);

      const notes = el("textarea", { class: "textarea-input", rows: "2", placeholder: "Notes…" });
      notes.value = proj.notes;
      notes.addEventListener("input", () => { proj.notes = notes.value; saveState(); });
      card.appendChild(notes);

      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  /* ---------------------------------------------------------
     15. RENDER: INTERVIEW PREP
  --------------------------------------------------------- */
  function renderInterview(root) {
    const grid = el("div", { class: "card-grid" });
    const summary = el("div", { class: "card hero-card" });
    summary.appendChild(ring(interviewReadiness(), 100, "Readiness"));
    summary.appendChild(el("div", { class: "hero-text" }, [el("h2", {}, ["Interview Readiness"]), el("p", { class: "muted" }, ["Track your prep across resume, DSA, SQL and mocks."])]));
    grid.appendChild(summary);
    root.appendChild(grid);

    const list = el("div", { class: "section" });
    INTERVIEW_ITEMS.forEach(it => {
      const row = el("div", { class: "field-row" });
      row.appendChild(el("span", {}, [it.label]));
      if (it.type === "check") {
        const cb = el("input", { type: "checkbox" }); cb.checked = !!state.interview[it.key];
        cb.addEventListener("change", () => { state.interview[it.key] = cb.checked; saveState(); render(); });
        row.appendChild(cb);
      } else if (it.type === "count") {
        const num = el("input", { type: "number", min: "0", class: "text-input small-input", value: state.interview[it.key] });
        num.addEventListener("change", () => { state.interview[it.key] = Math.max(0, parseInt(num.value) || 0); saveState(); render(); });
        row.appendChild(num);
      } else if (it.type === "rating") {
        const range = el("input", { type: "range", min: "0", max: "10", value: state.interview[it.key] });
        const val = el("span", { class: "slider-val" }, [String(state.interview[it.key])]);
        range.addEventListener("input", () => { state.interview[it.key] = parseInt(range.value); val.textContent = range.value; saveState(); });
        row.appendChild(range); row.appendChild(val);
      }
      list.appendChild(row);
    });
    root.appendChild(list);
  }

  /* ---------------------------------------------------------
     16. RENDER: MOCK TEST + PYQ TRACKER
  --------------------------------------------------------- */
  function renderTests(root) {
    root.appendChild(el("h3", {}, ["Mock Test Tracker"]));
    const addCard = el("div", { class: "card" });
    const f = {};
    const row1 = el("div", { class: "add-row wrap" });
    f.date = el("input", { type: "date", value: todayISO(), class: "date-input" });
    f.subject = el("select", { class: "select-input" }, GATE_SUBJECTS.concat(["Full Syllabus"]).map(s => el("option", { value: s }, [s])));
    f.score = el("input", { type: "number", placeholder: "Score", class: "text-input small-input" });
    f.correct = el("input", { type: "number", placeholder: "Correct", class: "text-input small-input" });
    f.wrong = el("input", { type: "number", placeholder: "Wrong", class: "text-input small-input" });
    f.weak = el("input", { type: "text", placeholder: "Weak topics", class: "text-input" });
    f.remarks = el("input", { type: "text", placeholder: "Remarks", class: "text-input" });
    [f.date, f.subject, f.score, f.correct, f.wrong, f.weak, f.remarks].forEach(x => row1.appendChild(x));
    const addBtn = el("button", { class: "btn" }, ["Add Mock Test"]);
    addBtn.addEventListener("click", () => {
      const correct = parseInt(f.correct.value) || 0, wrong = parseInt(f.wrong.value) || 0;
      const total = correct + wrong;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      state.mockTests.unshift({
        id: "mt" + Date.now(), date: f.date.value || todayISO(), subject: f.subject.value,
        score: f.score.value || "0", correct, wrong, accuracy, weak: f.weak.value, remarks: f.remarks.value
      });
      f.score.value = ""; f.correct.value = ""; f.wrong.value = ""; f.weak.value = ""; f.remarks.value = "";
      saveState(); render();
    });
    addCard.appendChild(row1); addCard.appendChild(addBtn);
    root.appendChild(addCard);

    const tableWrap = el("div", { class: "table-wrap" });
    const table = el("table", { class: "data-table" });
    table.appendChild(el("thead", {}, [el("tr", {}, ["Date", "Subject", "Score", "Correct", "Wrong", "Accuracy", "Weak Topics", "Remarks", ""].map(h => el("th", {}, [h])))]));
    const tbody = el("tbody");
    state.mockTests.forEach(mt => {
      const tr = el("tr", {}, [mt.date, mt.subject, mt.score, String(mt.correct), String(mt.wrong), mt.accuracy + "%", mt.weak, mt.remarks].map(v => el("td", {}, [v])));
      const delBtn = el("button", { class: "iconbtn small", html: ICONS.trash });
      delBtn.addEventListener("click", () => { state.mockTests = state.mockTests.filter(x => x.id !== mt.id); saveState(); render(); });
      tr.appendChild(el("td", {}, [delBtn]));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    root.appendChild(tableWrap);

    root.appendChild(el("h3", {}, ["PYQ Completion by Subject"]));
    const pyqGrid = el("div", { class: "card-grid" });
    GATE_SUBJECTS.forEach(sub => {
      const data = state.gateSubjects[sub];
      const card = el("div", { class: "card" });
      card.appendChild(el("div", { class: "metric-top" }, [el("span", {}, [sub]), el("span", { class: "metric-val" }, [data.pyq + "%"])]));
      card.appendChild(bar(data.pyq));
      pyqGrid.appendChild(card);
    });
    root.appendChild(pyqGrid);
  }

  /* ---------------------------------------------------------
     17. RENDER: REVISION TRACKER
  --------------------------------------------------------- */
  function renderRevision(root) {
    const cats = [["daily", "Daily Revision"], ["weekly", "Weekly Revision"], ["monthly", "Monthly Revision"], ["final", "Final Revision"]];
    cats.forEach(([key, label]) => {
      const sec = el("div", { class: "section" });
      sec.appendChild(el("h3", {}, [label]));
      const addRow = el("div", { class: "add-row" });
      const input = el("input", { type: "text", class: "text-input", placeholder: "Add " + label.toLowerCase() + " item (e.g. subject/topic)…" });
      const addBtn = el("button", { class: "iconbtn primary", html: ICONS.plus });
      function add() {
        const v = input.value.trim();
        if (!v) return;
        state.revision[key][v] = false; input.value = ""; saveState(); render();
      }
      addBtn.addEventListener("click", add);
      input.addEventListener("keydown", e => { if (e.key === "Enter") add(); });
      addRow.appendChild(input); addRow.appendChild(addBtn);
      sec.appendChild(addRow);
      const list = el("div", { class: "task-list" });
      const keys = Object.keys(state.revision[key]);
      if (keys.length === 0) list.appendChild(el("p", { class: "muted small" }, ["No items yet."]));
      keys.forEach(k => {
        const row = taskRow({ text: k, done: state.revision[key][k] }, () => { state.revision[key][k] = !state.revision[key][k]; saveState(); render(); });
        const del = el("button", { class: "iconbtn small", html: ICONS.trash });
        del.addEventListener("click", () => { delete state.revision[key][k]; saveState(); render(); });
        row.appendChild(del);
        list.appendChild(row);
      });
      sec.appendChild(list);
      root.appendChild(sec);
    });

    const notesGrid = el("div", { class: "card-grid" });
    [["formulaNotebook", "Formula Notebook"], ["errorNotebook", "Error Notebook"], ["weakTopics", "Weak Topics"]].forEach(([key, label]) => {
      const card = el("div", { class: "card" });
      card.appendChild(el("h4", {}, [label]));
      const ta = el("textarea", { class: "textarea-input", rows: "5" });
      ta.value = state.revision[key];
      ta.addEventListener("input", () => { state.revision[key] = ta.value; saveState(); });
      card.appendChild(ta);
      notesGrid.appendChild(card);
    });
    root.appendChild(notesGrid);
  }

  /* ---------------------------------------------------------
     18. RENDER: NOTES
  --------------------------------------------------------- */
  function renderNotes(root) {
    const addCard = el("div", { class: "card" });
    const catSel = el("select", { class: "select-input" }, NOTE_CATEGORIES.map(c => el("option", { value: c }, [c])));
    const ta = el("textarea", { class: "textarea-input", rows: "3", placeholder: "Write a note…" });
    const addBtn = el("button", { class: "btn" }, ["Add Note"]);
    addBtn.addEventListener("click", () => {
      const v = ta.value.trim();
      if (!v) return;
      state.notes.unshift({ id: "n" + Date.now(), category: catSel.value, text: v, date: todayISO() });
      ta.value = ""; saveState(); render();
    });
    addCard.appendChild(catSel); addCard.appendChild(ta); addCard.appendChild(addBtn);
    root.appendChild(addCard);

    const filterBar = el("div", { class: "filter-bar" });
    let noteFilter = renderNotes._filter || "All";
    ["All"].concat(NOTE_CATEGORIES).forEach(c => {
      const b = el("button", { class: "chip" + (noteFilter === c ? " active" : "") }, [c]);
      b.addEventListener("click", () => { renderNotes._filter = c; render(); });
      filterBar.appendChild(b);
    });
    root.appendChild(filterBar);

    const list = el("div", { class: "notes-list" });
    state.notes.filter(n => noteFilter === "All" || n.category === noteFilter).forEach(n => {
      const card = el("div", { class: "card note-card" });
      card.appendChild(el("div", { class: "metric-top" }, [el("span", { class: "chip small" }, [n.category]), el("span", { class: "muted small" }, [n.date])]));
      card.appendChild(el("p", {}, [n.text]));
      const del = el("button", { class: "iconbtn small", html: ICONS.trash });
      del.addEventListener("click", () => { state.notes = state.notes.filter(x => x.id !== n.id); saveState(); render(); });
      card.appendChild(del);
      list.appendChild(card);
    });
    if (state.notes.length === 0) list.appendChild(el("p", { class: "muted" }, ["No notes yet."]));
    root.appendChild(list);
  }

  /* ---------------------------------------------------------
     19. RENDER: CALENDAR
  --------------------------------------------------------- */
  let calendarMonthOffset = 0;
  function renderCalendar(root) {
    const base = new Date();
    const viewDate = new Date(base.getFullYear(), base.getMonth() + calendarMonthOffset, 1);
    const nav = el("div", { class: "day-nav" });
    const prev = el("button", { class: "iconbtn" }, ["‹"]);
    const next = el("button", { class: "iconbtn" }, ["›"]);
    prev.addEventListener("click", () => { calendarMonthOffset--; render(); });
    next.addEventListener("click", () => { calendarMonthOffset++; render(); });
    nav.appendChild(prev);
    nav.appendChild(el("strong", {}, [viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })]));
    nav.appendChild(next);
    root.appendChild(nav);

    const legend = el("div", { class: "legend" }, [
      el("span", {}, [el("i", { class: "dot status-done" }), " Completed"]),
      el("span", {}, [el("i", { class: "dot status-progress" }), " In Progress"]),
      el("span", {}, [el("i", { class: "dot status-pending" }), " Mock Test"]),
      el("span", {}, [el("i", { class: "dot deadline-dot" }), " Deadline"])
    ]);
    root.appendChild(legend);

    const grid = el("div", { class: "calendar-grid" });
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(d => grid.appendChild(el("div", { class: "cal-dow" }, [d])));
    const firstDow = viewDate.getDay();
    for (let i = 0; i < firstDow; i++) grid.appendChild(el("div", { class: "cal-cell empty" }));
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const mockDates = new Set(state.mockTests.map(m => m.date));
    const deadlineDates = new Set(PROJECTS.map(p => state.projects[p.id].deadline));
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const iso = fmtISO(dt);
      const isToday = iso === todayISO();
      const inRange = dt >= START_DATE && dt <= END_DATE;
      const day = state.days[iso];
      let cls = "cal-cell";
      if (isToday) cls += " today";
      if (!inRange) cls += " out-range";
      const cell = el("div", { class: cls });
      cell.appendChild(el("span", { class: "cal-num" }, [String(d)]));
      const dots = el("div", { class: "cal-dots" });
      if (day && day.tasks.length && day.tasks.every(t => t.done)) dots.appendChild(el("i", { class: "dot status-done" }));
      else if (day && day.tasks.some(t => t.done)) dots.appendChild(el("i", { class: "dot status-progress" }));
      if (mockDates.has(iso)) dots.appendChild(el("i", { class: "dot status-pending" }));
      if (deadlineDates.has(iso)) dots.appendChild(el("i", { class: "dot deadline-dot" }));
      cell.appendChild(dots);
      cell.addEventListener("click", () => { currentDayISO = iso; switchTab("daily"); });
      grid.appendChild(cell);
    }
    root.appendChild(grid);
  }

  /* ---------------------------------------------------------
     20. RENDER: ANALYTICS
  --------------------------------------------------------- */
  function renderAnalytics(root) {
    recomputeStreak();
    const grid = el("div", { class: "card-grid" });
    [["Weekly Completion Avg", weeklyCompletionAvg()], ["GATE Progress", overallGateProgress()],
     ["Software Skills", overallSEProgress()], ["AI Skills", overallAIProgress()],
     ["Projects Progress", overallProjectsProgress()], ["Overall Completion", overallProgress()]]
      .forEach(([l, v]) => {
        const c = el("div", { class: "card" });
        c.appendChild(ring(v, 76, l));
        grid.appendChild(c);
      });
    root.appendChild(grid);

    let totalMinutes = 0;
    Object.values(state.days).forEach(d => totalMinutes += d.studyMinutes || 0);
    const statsCard = el("div", { class: "card stats-card" });
    [["Total Study Hours", Math.round(totalMinutes / 6) / 10], ["Current Streak", state.streak.current + "d"],
     ["Longest Streak", state.streak.longest + "d"], ["Tasks Completed", totalCompletedTasks()], ["Tasks Remaining", totalTasks() - totalCompletedTasks()]]
      .forEach(([l, v]) => statsCard.appendChild(el("div", { class: "stat-item" }, [el("strong", {}, [String(v)]), el("span", {}, [l])])));
    root.appendChild(statsCard);

    // Simple bar chart: last 14 days study minutes
    root.appendChild(el("h3", {}, ["Study Minutes — Last 14 Days"]));
    const chart = el("div", { class: "chart" });
    for (let i = 13; i >= 0; i--) {
      const d = fmtISO(new Date(Date.now() - i * MS_DAY));
      const mins = (state.days[d] && state.days[d].studyMinutes) || 0;
      const h = Math.min(100, mins); // cap visual height percent
      const col = el("div", { class: "chart-col" });
      const fill = el("div", { class: "chart-fill" });
      fill.style.height = Math.max(3, h) + "%";
      col.appendChild(el("div", { class: "chart-track" }, [fill]));
      col.appendChild(el("span", { class: "chart-label" }, [d.slice(5)]));
      chart.appendChild(col);
    }
    root.appendChild(chart);

    root.appendChild(el("h3", {}, ["Subject Progress"]));
    const subGrid = el("div", { class: "card-grid" });
    GATE_SUBJECTS.forEach(s => {
      const card = el("div", { class: "card" });
      card.appendChild(el("div", { class: "metric-top" }, [el("span", {}, [s]), el("span", {}, [state.gateSubjects[s].progress + "%"])]));
      card.appendChild(bar(state.gateSubjects[s].progress));
      subGrid.appendChild(card);
    });
    root.appendChild(subGrid);
  }

  /* ---------------------------------------------------------
     21. RENDER: DATA / EXPORT / IMPORT
  --------------------------------------------------------- */
  function renderData(root) {
    const grid = el("div", { class: "card-grid" });

    const exportCard = el("div", { class: "card" });
    exportCard.appendChild(el("h4", {}, ["Export"]));
    const jsonBtn = el("button", { class: "btn" }, ["Export Progress as JSON"]);
    jsonBtn.addEventListener("click", () => downloadFile("gate-planner-backup.json", JSON.stringify(state, null, 2), "application/json"));
    const csvBtn = el("button", { class: "btn ghost" }, ["Export Mock Tests as CSV"]);
    csvBtn.addEventListener("click", exportCSV);
    const printBtn = el("button", { class: "btn ghost" }, ["Print Dashboard"]);
    printBtn.addEventListener("click", () => window.print());
    [jsonBtn, csvBtn, printBtn].forEach(b => exportCard.appendChild(b));
    grid.appendChild(exportCard);

    const importCard = el("div", { class: "card" });
    importCard.appendChild(el("h4", {}, ["Import / Restore"]));
    const fileInput = el("input", { type: "file", accept: "application/json", class: "text-input" });
    const importBtn = el("button", { class: "btn" }, ["Import from JSON"]);
    importBtn.addEventListener("click", () => {
      const file = fileInput.files[0];
      if (!file) { alert("Choose a JSON backup file first."); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          state = deepMerge(defaultState(), parsed);
          saveState(); render();
          alert("Import successful.");
        } catch (e) { alert("Invalid JSON file."); }
      };
      reader.readAsText(file);
    });
    importCard.appendChild(fileInput); importCard.appendChild(importBtn);
    grid.appendChild(importCard);

    const dangerCard = el("div", { class: "card" });
    dangerCard.appendChild(el("h4", {}, ["Reset"]));
    dangerCard.appendChild(el("p", { class: "muted small" }, ["This clears all saved progress on this device. Export a backup first."]));
    const resetBtn = el("button", { class: "btn danger" }, ["Erase All Data"]);
    resetBtn.addEventListener("click", () => {
      if (confirm("This will permanently erase all progress. Continue?")) {
        state = defaultState(); saveState(); render();
      }
    });
    dangerCard.appendChild(resetBtn);
    grid.appendChild(dangerCard);

    root.appendChild(grid);

    const installCard = el("div", { class: "card" });
    installCard.appendChild(el("h4", {}, ["Install as App"]));
    installCard.appendChild(el("p", { class: "muted small" }, ["Open your browser menu and choose 'Add to Home Screen' to install this planner. It will then run fully offline."]));
    root.appendChild(installCard);
  }

  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const header = ["Date", "Subject", "Score", "Correct", "Wrong", "Accuracy", "Weak Topics", "Remarks"];
    const rows = state.mockTests.map(m => [m.date, m.subject, m.score, m.correct, m.wrong, m.accuracy + "%", m.weak, m.remarks]);
    const csv = [header].concat(rows).map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
    downloadFile("mock-tests.csv", csv, "text/csv");
  }

  /* ---------------------------------------------------------
     22. SEARCH
  --------------------------------------------------------- */
  function performSearch(query) {
    query = query.trim().toLowerCase();
    if (!query) return [];
    const results = [];
    WEEK_DEFS.forEach(def => {
      [...def.gate, ...def.se, ...def.ai].forEach(t => {
        if (t.text.toLowerCase().includes(query)) results.push({ type: "Task", label: t.text, sub: "Week " + def.weekNum, goto: () => { openWeeks.add(def.weekNum); switchTab("weeks"); } });
      });
    });
    GATE_SUBJECTS.forEach(s => { if (s.toLowerCase().includes(query)) results.push({ type: "GATE Subject", label: s, sub: "", goto: () => switchTab("gate") }); });
    SE_SKILLS.forEach(s => { if (s.toLowerCase().includes(query)) results.push({ type: "SE Skill", label: s, sub: "", goto: () => switchTab("skills") }); });
    AI_SKILLS.forEach(s => { if (s.toLowerCase().includes(query)) results.push({ type: "AI Skill", label: s, sub: "", goto: () => switchTab("skills") }); });
    PROJECTS.forEach(p => { if (p.name.toLowerCase().includes(query)) results.push({ type: "Project", label: p.name, sub: "", goto: () => switchTab("projects") }); });
    return results.slice(0, 40);
  }

  /* ---------------------------------------------------------
     23. MAIN RENDER
  --------------------------------------------------------- */
  const RENDERERS = {
    dashboard: renderDashboard, weeks: renderWeeks, daily: renderDaily, gate: renderGate,
    skills: renderSkills, projects: renderProjects, interview: renderInterview, tests: renderTests,
    revision: renderRevision, notes: renderNotes, calendar: renderCalendar, analytics: renderAnalytics, data: renderData
  };

  function render() {
    const root = document.getElementById("view");
    root.innerHTML = "";
    document.getElementById("pageTitle").textContent = TABS.find(t => t.id === currentTab).label;
    RENDERERS[currentTab](root);
  }

  /* ---------------------------------------------------------
     24. INIT
  --------------------------------------------------------- */
  function buildNav() {
    const side = document.getElementById("sideNav");
    TABS.forEach(t => {
      const b = el("button", { class: "navbtn" + (t.id === currentTab ? " active" : ""), "data-tab": t.id });
      b.innerHTML = '<span class="navicon">' + ICONS[t.icon] + '</span><span>' + t.label + '</span>';
      b.addEventListener("click", () => switchTab(t.id));
      side.appendChild(b);
    });
  }

  function initSearch() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    input.addEventListener("input", () => {
      const r = performSearch(input.value);
      results.innerHTML = "";
      if (!input.value.trim()) { results.classList.remove("open"); return; }
      results.classList.add("open");
      if (r.length === 0) { results.appendChild(el("div", { class: "search-empty" }, ["No matches."])); return; }
      r.forEach(res => {
        const row = el("div", { class: "search-row" }, [
          el("span", { class: "chip small" }, [res.type]),
          el("span", {}, [res.label]),
          el("span", { class: "muted small" }, [res.sub])
        ]);
        row.addEventListener("click", () => { res.goto(); results.classList.remove("open"); input.value = ""; });
        results.appendChild(row);
      });
    });
    document.addEventListener("click", e => {
      if (!e.target.closest(".search-wrap")) results.classList.remove("open");
    });
  }

  function initNavToggles() {
    document.getElementById("menuBtn").addEventListener("click", () => {
      document.getElementById("sideNav").classList.add("open");
      document.getElementById("navOverlay").classList.add("open");
    });
    document.getElementById("navOverlay").addEventListener("click", closeSideNav);
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js").catch(err => console.warn("SW registration failed", err));
      });
    }
  }

  function init() {
    buildNav();
    initSearch();
    initNavToggles();
    render();
    registerServiceWorker();
    setInterval(() => { recomputeStreak(); }, 60000);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
