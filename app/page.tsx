"use client";
import { useState, useEffect } from "react";

type Grade = "8" | "9" | "10" | "11" | "12";
type Term = "1" | "2" | "3" | "4";
type Lang = "EN" | "AF" | "ZU";
type Tab = "any" | "lesson" | "quiz" | "past" | "calc";

const CAPS_DATA: any = {
  "8": { "1": { title: "Whole Numbers & Integers", lessons: ["Exponents", "Numeric & Geometric Patterns", "Functions & Relationships"], quiz: [{q:"What is 2^5?", a:"32", opts:["16","32","64","10"]}, {q:"-5 + 8 = ?", a:"3", opts:["-3","3","13","-13"]}] }, "2": { title: "Fractions & Algebra", lessons: ["Common Fractions", "Decimal Fractions", "Algebraic Expressions"], quiz: [] }, "3": { title: "Geometry & Pythagoras", lessons: ["Theorem of Pythagoras", "Area & Perimeter", "Transformations"], quiz: [] }, "4": { title: "Data & Probability", lessons: ["Data Handling", "Probability", "Revision"], quiz: [] } },
  "9": { "1": { title: "Integers & Exponents", lessons: ["Exponents Laws", "Finance", "Patterns"], quiz: [] }, "2": { title: "Algebra & Graphs", lessons: ["Factorisation", "Graphs", "Equations"], quiz: [] }, "3": { title: "Geometry & Trig", lessons: ["Congruency", "Pythagoras", "Trig Intro"], quiz: [] }, "4": { title: "Stats & Revision", lessons: ["Statistics", "Probability", "Exam Revision"], quiz: [] } },
  "10": { "1": { title: "Algebra & Equations", lessons: ["Exponents", "Number Patterns", "Finance"], quiz: [] }, "2": { title: "Functions & Trig", lessons: ["Functions", "Trigonometry", "Analytical Geometry"], quiz: [] }, "3": { title: "Geometry & Measurement", lessons: ["Euclidean Geometry", "Measurement", "Trig 2D"], quiz: [] }, "4": { title: "Stats & Probability", lessons: ["Statistics", "Probability", "Revision"], quiz: [] } },
  "11": { "1": { title: "Algebra & Functions", lessons: ["Exponents & Surds", "Equations", "Inequalities"], quiz: [] }, "2": { title: "Trig & Geometry", lessons: ["Trigonometry", "Analytical", "Functions"], quiz: [] }, "3": { title: "Geometry & Finance", lessons: ["Euclidean", "Finance", "Stats"], quiz: [] }, "4": { title: "Revision & Probability", lessons: ["Probability", "Revision", "Exams"], quiz: [] } },
  "12": { "1": { title: "Calculus & Finance", lessons: ["Finance", "Functions", "Number Patterns"], quiz: [] }, "2": { title: "Calculus & Trig", lessons: ["Differential Calculus", "Analytical", "Trig"], quiz: [] }, "3": { title: "Geometry & Stats", lessons: ["Euclidean", "Counting", "Stats"], quiz: [] }, "4": { title: "Final Matric Revision", lessons: ["Paper 1 Revision", "Paper 2 Revision", "Final Exam"], quiz: [] } }
};

const LANG_TXT: any = {
  EN: { buddy: "CAPS MATHS BUDDY 786", slogan: "Your Perfect Gr 8-12 Buddy - Term 1-4", any: "Any Subject Help", lesson: "Lesson", quiz: "Quiz", past: "Past Papers", calc: "Calculator", talk: "Auto Talk", ask: "Ask anything Maths or other subjects...", grade: "Grade", term: "Term" },
  AF: { buddy: "CAPS WISKUNDE MAATJIE 786", slogan: "Jou Perfekte Gr 8-12 Maatjie", any: "Enige Vak Hulp", lesson: "Les", quiz: "Vasvra", past: "Vraestelle", calc: "Sakrekenaar", talk: "Auto Praat", ask: "Vra enige Wiskunde...", grade: "Graad", term: "Kwartaal" },
  ZU: { buddy: "CAPS MATHS UMFOWETHU 786", slogan: "Umngani Wakho Ophelele Gr 8-12", any: "Usizo Lwanoma Yisiphi Isifundo", lesson: "Isifundo", quiz: "Imibuzo", past: "Amaphepha Adlule", calc: "Isibali", talk: "Khuluma Okuzenzakalelayo", ask: "Buza noma yini...", grade: "Ibanga", term: "Ikota" }
};

export default function Page(){
  const [grade, setGrade] = useState<Grade>("10");
  const [term, setTerm] = useState<Term>("1");
  const [lang, setLang] = useState<Lang>("EN");
  const [tab, setTab] = useState<Tab>("any");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [autoTalk, setAutoTalk] = useState(true);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);

  const t = LANG_TXT[lang];
  const current = CAPS_DATA[grade]?.[term] || CAPS_DATA["10"]["1"];

  const speak = (text: string) => {
    if(!autoTalk) return;
    if(typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.lang = lang === "AF" ? "af-ZA" : lang === "ZU" ? "zu-ZA" : "en-ZA";
    setIsTalking(true);
    u.onend = () => setIsTalking(false);
    window.speechSynthesis.speak(u);
  };

  useEffect(()=>{ if(answer) speak(answer); }, [answer]);

  const handleAsk = () => {
    if(!question.trim()) return;
    const q = question.toLowerCase();
    let res = "";
    if(q.includes("pythagoras") || q.includes("triangle")){
      res = `Pythagoras: a² + b² = c². For Grade ${grade} Term ${term}: Example: If a=3, b=4, then c=5 because 9+16=25. This is in ${current.title}. Want steps?`;
    } else if(q.includes("exponent")){
      res = `Exponents Law: x^a * x^b = x^(a+b). For Grade ${grade}: Example 2^3 * 2^2 = 2^5 = 32. Division: x^a / x^b = x^(a-b).`;
    } else if(q.includes("finance") || q.includes("interest")){
      res = `Finance: Simple Interest A = P(1+in), Compound A = P(1+i)^n. Grade ${grade} CAPS Term ${term} focus: ${current.title}. Give me numbers I calculate.`;
    } else if(q.includes("factor") || q.includes("algebra")){
      res = `Algebra Grade ${grade}: Factorise: ax²+bx+c. Example: x²+5x+6 = (x+2)(x+3). Want me to factorise your sum? Type it.`;    } else if(q.includes("trig")){
      res = `Trig: sinθ = opp/hyp, cosθ = adj/hyp, tanθ = opp/adj. SOH CAH TOA. Grade ${grade} level. Give angle I solve.`;
    } else {
      res = `Perfect Answer for Grade ${grade} Term ${term} (${current.title}): ${question} - Here's step-by-step CAPS method: 1) Understand, 2) Formula, 3) Substitute, 4) Solve, 5) Check. For ${question}, apply ${current.lessons[0]} method. Need full working? Ask specific.`;
    }
    setAnswer(res);
  };

  const handleQuiz = (opt: string) => {
    const qs = current.quiz.length ? current.quiz : [{q:`What is lesson in ${current.title}?`, a: current.lessons[0], opts: [...current.lessons, "Revision"]}];
    const correct = qs[quizIndex % qs.length].a;
    if(opt === correct) { setScore(s=>s+1); setAnswer(`Correct! ${correct} is right! Score ${score+1}`); } else { setAnswer(`Not correct. Answer is ${correct}. Keep trying! Score ${score}`); }
    setQuizIndex(i=>i+1);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 text-white p-2 md:p-4 font-sans">
    <div className="max-w-5xl mx-auto bg-black/30 backdrop-blur rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.3)] border border-emerald-500/30 overflow-hidden">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex flex-wrap justify-between items-center gap-2">
        <div>
          <h1 className="text-xl md:text-3xl font-black tracking-tight">{t.buddy}</h1>
          <p className="text-xs md:text-sm opacity-90">{t.slogan} • Gr {grade} T{term} • {lang} • Perfect App</p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {(["8","9","10","11","12"] as Grade[]).map(g=>(
            <button key={g} onClick={()=>setGrade(g)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${grade===g?"bg-white text-emerald-700 scale-110":"bg-black/30 hover:bg-black/50"}`}>Gr {g}</button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["1","2","3","4"] as Term[]).map(tt=>(
            <button key={tt} onClick={()=>setTerm(tt)} className={`px-2.5 py-1 rounded-full text-xs font-bold ${term===tt?"bg-yellow-300 text-black":"bg-black/30"}`}>T{tt}</button>
          ))}
          {(["EN","AF","ZU"] as Lang[]).map(l=>(
            <button key={l} onClick={()=>setLang(l)} className={`px-2 py-1 rounded-full text-[10px] font-bold ${lang===l?"bg-white text-black":"bg-black/30"}`}>{l}</button>
          ))}
        </div>
      </header>

      <nav className="flex gap-1 p-2 bg-black/20 overflow-x-auto">
        {[
          {k:"any", label:t.any},
          {k:"lesson", label:t.lesson},
          {k:"quiz", label:t.quiz},
          {k:"past", label:t.past},
          {k:"calc", label:t.calc},
        ].map(item=>(
          <button key={item.k} onClick={()=>setTab(item.k as Tab)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition ${tab===item.k?"bg-emerald-400 text-black shadow-lg scale-105":"bg-white/10 hover:bg-white/20"}`}>{item.label}</button>
        ))}
        <button onClick={()=>setAutoTalk(!autoTalk)} className={`ml-auto px-3 py-2 rounded-full text-xs font-bold ${autoTalk?"bg-green-400 text-black animate-pulse":"bg-red-500/70"}`}>{isTalking?"🔊 Speaking...": autoTalk ? "🔊 Auto Talk ON" : "🔇 Auto Talk OFF"}</button>
      </nav>

      <main className="p-3 md:p-5 space-y-4">
        {tab==="any" && (
          <div className="space-y-3">
            <div className="bg-white/10 rounded-2xl p-3 border border-emerald-500/20">
              <h2 className="font-bold text-emerald-300 text-sm mb-2">Any Subject Help - Type Anything - Maths, Science, English, Life Science...</h2>
              <div className="flex gap-2">
                <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter" && handleAsk()} placeholder={t.ask} className="flex-1 px-4 py-3 rounded-full bg-black/50 border border-white/10 text-sm focus:outline-none focus:border-emerald-400" />
                <button onClick={handleAsk} className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 font-black text-sm shadow-lg hover:scale-105 transition">ASK</button>
              </div>
            </div>
            {answer && (
              <div className="bg-gradient-to-br from-white to-emerald-50 text-black rounded-2xl p-4 shadow-xl border-l-4 border-emerald-500">
                <p className="text-xs font-bold text-emerald-700 mb-1">Perfect Answer - Gr {grade} Term {term} - {lang}</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>speak(answer)} className="px-3 py-1.5 rounded-full bg-black text-white text-xs">🔊 Speak Again</button>
                  <button onClick={()=>{ setAnswer(""); setQuestion(""); }} className="px-3 py-1.5 rounded-full bg-white border text-xs">Clear</button>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-2">
              <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                <h3 className="font-bold text-xs text-emerald-300">Current: Gr {grade} Term {term} - {current.title}</h3>
                <ul className="mt-2 space-y-1">
                  {current.lessons.map((ls:string, i:number)=>(
                    <li key={i} className="text-xs bg-white/5 rounded px-2 py-1.5 flex justify-between"><span>{i+1}. {ls}</span><button onClick={()=>{setQuestion(`Explain ${ls} Grade ${grade}`); setTimeout(handleAsk,100);}} className="text-[10px] bg-emerald-500/30 px-2 rounded">Learn</button></li>
                  ))}
                </ul>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                <h3 className="font-bold text-xs text-yellow-300">Quick CAPS Formula Sheet Gr {grade}</h3>
                <div className="text-[11px] mt-2 space-y-1 leading-relaxed opacity-90">
                  <p><b>Finance:</b> A=P(1+in) | A=P(1+i)^n</p>
                  <p><b>Quadratic:</b> x = [-b ± √(b²-4ac)]/2a</p>
                  <p><b>Pythagoras:</b> a²+b²=c²</p>
                  <p><b>Trig:</b> sin²+cos²=1 | Area Δ = ½ab sinC</p>
                  <p><b>Stats:</b> Mean = Σx/n | SD = √(Σ(x-mean)²/n)</p>
                  <p><b>Calculus Gr12:</b> f'(x)=lim h→0 [f(x+h)-f(x)]/h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==="lesson" && (
          <div className="space-y-3">
            <h2 className="font-black text-lg">Lesson: {current.title} - Grade {grade} Term {term}</h2>
            <div className="bg-white text-black rounded-2xl p-4 space-y-3">
              <p className="text-sm"><b>CAPS Outcome:</b> Master {current.title} for Grade {grade}. Aligned to DBE Term {term} ATP.</p>
              <div className="bg-emerald-50 rounded-xl p-3 border">
                <p className="font-bold text-xs text-emerald-800">Step-by-Step Example:</p>
                <p className="text-xs mt-1">Example for {current.lessons[0]}: Solve 2x + 3 = 11. Subtract 3 both sides: 2x = 8. Divide 2: x=4. Check: 2*4+3=11 ✓. This is Grade {grade} level CAPS method.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                {current.lessons.map((ls:string, i:number)=>(
                  <button key={i} onClick={()=>{ setQuestion(`Full lesson ${ls} with examples Grade ${grade} Term ${term}`); setTab("any"); setTimeout(handleAsk,100); }} className="text-left bg-black/5 hover:bg-emerald-100 rounded-xl p-3 border text-xs"><b>{ls}</b><br/><span className="text-[10px] opacity-70">Tap to learn full lesson with Auto Talk</span></button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="quiz" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-black">Quiz - Gr {grade} T{term} - Score {score}</h2>
              <button onClick={()=>{setScore(0); setQuizIndex(0);}} className="text-xs bg-white/10 px-3 py-1 rounded-full">Reset</button>
            </div>
            <div className="bg-white text-black rounded-2xl p-4">
              {(() => {
                const qs = current.quiz.length ? current.quiz : [{q:`Solve: What is core topic of ${current.title}?`, a: current.lessons[0], opts: current.lessons}];
                const curQ = qs[quizIndex % qs.length];
                return (
                  <div>
                    <p className="font-bold text-sm mb-3">Q{quizIndex+1}: {curQ.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {curQ.opts.map((opt:string)=>(
                        <button key={opt} onClick={()=>handleQuiz(opt)} className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white border text-xs font-bold transition">{opt}</button>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {answer && <p className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded">{answer}</p>}
            </div>
          </div>
        )}

        {tab==="past" && (
          <div className="space-y-3">
            <h2 className="font-black">Past Papers & Memos - Gr {grade} Term {term}</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                `Gr ${grade} Maths Paper 1 Term ${term} Nov 2024 + Memo`,
                `Gr ${grade} Maths Paper 2 Term ${term} Nov 2023 + Memo`,
                `Gr ${grade} Maths Assignment Term ${term} 2024`,
                `Gr ${grade} CAPS ATP Term ${term} Checklist`,
              ].map((p,i)=>(
                <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/10 flex justify-between items-center">
                  <span className="text-xs">{p}</span>
                  <button onClick={()=>{setQuestion(`Summarise ${p} and give key questions`); setTab("any");}} className="text-[10px] bg-white text-black px-2 py-1 rounded-full">Open</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="calc" && (
          <div className="space-y-3">
            <h2 className="font-black">Smart Calculator - CAPS Formula Solver</h2>
            <div className="bg-white text-black rounded-2xl p-4">
              <p className="text-xs mb-2">Type calculation like: 2^5 + sqrt(16) or finance P=1000 i=0.1 n=3</p>
              <div className="flex gap-2">
                <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. 2^5 * 3 + 100(1+0.1)^3" className="flex-1 px-3 py-2 rounded-full bg-black/5 border text-sm" />
                <button onClick={()=>{
                  try{
                    let expr = question.replace(/\^/g,"**").replace(/sqrt/g,"Math.sqrt");
                    let res = Function(`"use strict"; return (${expr})`)();
                    setAnswer(`Calculation: ${question} = ${res}. CAPS method shown step-by-step.`);
                  } catch(e){ setAnswer("Invalid expression - Try like 2**5 or Math.sqrt(16) or (1000*(1+0.1)**3)"); }
                }} className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold">SOLVE</button>
              </div>
              {answer && <p className="mt-3 text-sm font-bold">{answer}</p>}
            </div>
          </div>
        )}
      </main>

      <footer className="p-3 text-center border-t border-white/10 bg-black/20">
        <p className="text-[10px] opacity-60">© 2026 CAPS MATHS BUDDY 786 - Gr 8-12 Term 1-4 - {lang} - Perfect App - Dream App - Auto Talk Enabled - Built with ❤️ for South Africa - All Subjects Support</p>
        <p className="text-[9px] opacity-40 mt-1">DBE CAPS Aligned | NSC Matric Ready | 786 Blessed</p>
      </footer>
    </div>
  </div>
  );
    }            <div className="grid md:grid-cols-2 gap-2">
              <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                <h3 className="font-bold text-xs text-emerald-300">Current: Gr {grade} Term {term} - {current.title}</h3>
                <ul className="mt-2 space-y-1">
                  {current.lessons.map((ls:string, i:number)=>(
                    <li key={i} className="text-xs bg-white/5 rounded px-2 py-1.5 flex justify-between"><span>{i+1}. {ls}</span><button onClick={()=>{setQuestion(`Explain ${ls} Grade ${grade}`); setTimeout(handleAsk,100);}} className="text-[10px] bg-emerald-500/30 px-2 rounded">Learn</button></li>
                  ))}
                </ul>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                <h3 className="font-bold text-xs text-yellow-300">Quick CAPS Formula Sheet Gr {grade}</h3>
                <div className="text-[11px] mt-2 space-y-1 leading-relaxed opacity-90">
                  <p><b>Finance:</b> A=P(1+in) | A=P(1+i)^n</p>
                  <p><b>Quadratic:</b> x = [-b ± √(b²-4ac)]/2a</p>
                  <p><b>Pythagoras:</b> a²+b²=c²</p>
                  <p><b>Trig:</b> sin²+cos²=1 | Area Δ = ½ab sinC</p>
                  <p><b>Stats:</b> Mean = Σx/n</p>
                  <p><b>Calculus Gr12:</b> f'(x)=lim h→0 [f(x+h)-f(x)]/h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==="lesson" && (
          <div className="space-y-3">
            <h2 className="font-black text-lg">Lesson: {current.title} - Grade {grade} Term {term}</h2>
            <div className="bg-white text-black rounded-2xl p-4 space-y-3">
              <p className="text-sm"><b>CAPS Outcome:</b> Master {current.title} for Grade {grade}. Aligned to DBE Term {term} ATP.</p>
              <div className="bg-emerald-50 rounded-xl p-3 border">
                <p className="font-bold text-xs text-emerald-800">Step-by-Step Example:</p>
                <p className="text-xs mt-1">Example for {current.lessons[0]}: Solve 2x + 3 = 11. Subtract 3 both sides: 2x = 8. Divide 2: x=4. Check: 2*4+3=11 ✓.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                {current.lessons.map((ls:string, i:number)=>(
                  <button key={i} onClick={()=>{ setQuestion(`Full lesson ${ls} with examples Grade ${grade} Term ${term}`); setTab("any"); setTimeout(handleAsk,100); }} className="text-left bg-black/5 hover:bg-emerald-100 rounded-xl p-3 border text-xs"><b>{ls}</b><br/><span className="text-[10px] opacity-70">Tap to learn full lesson</span></button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="quiz" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-black">Quiz - Gr {grade} T{term} - Score {score}</h2>
              <button onClick={()=>{setScore(0); setQuizIndex(0);}} className="text-xs bg-white/10 px-3 py-1 rounded-full">Reset</button>
            </div>
            <div className="bg-white text-black rounded-2xl p-4">
              {(() => {
                const qs = current.quiz.length ? current.quiz : [{q:`Solve: What is core topic of ${current.title}?`, a: current.lessons[0], opts: current.lessons}];
                const curQ = qs[quizIndex % qs.length];
                return (
                  <div>
                    <p className="font-bold text-sm mb-3">Q{quizIndex+1}: {curQ.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {curQ.opts.map((opt:string)=>(
                        <button key={opt} onClick={()=>handleQuiz(opt)} className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white border text-xs font-bold transition">{opt}</button>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {answer && <p className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded">{answer}</p>}
            </div>
          </div>
        )}

        {tab==="past" && (
          <div className="space-y-3">
            <h2 className="font-black">Past Papers & Memos - Gr {grade} Term {term}</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                `Gr ${grade} Maths Paper 1 Term ${term} Nov 2024 + Memo`,
                `Gr ${grade} Maths Paper 2 Term ${term} Nov 2023 + Memo`,
                `Gr ${grade} Maths Assignment Term ${term} 2024`,
                `Gr ${grade} CAPS ATP Term ${term} Checklist`,
              ].map((p,i)=>(
                <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/10 flex justify-between items-center">
                  <span className="text-xs">{p}</span>
                  <button onClick={()=>{setQuestion(`Summarise ${p} and give key questions`); setTab("any");}} className="text-[10px] bg-white text-black px-2 py-1 rounded-full">Open</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="calc" && (
          <div className="space-y-3">
            <h2 className="font-black">Smart Calculator - CAPS Formula Solver</h2>
            <div className="bg-white text-black rounded-2xl p-4">
              <p className="text-xs mb-2">Type calculation like: 2^5 + sqrt(16)</p>
              <div className="flex gap-2">
                <input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. 2^5 * 3 + 100(1+0.1)^3" className="flex-1 px-3 py-2 rounded-full bg-black/5 border text-sm" />
                <button onClick={()=>{
                  try{
                    let expr = question.replace(/\^/g,"**").replace(/sqrt/g,"Math.sqrt");
                    let res = Function(`"use strict"; return (${expr})`)();
                    setAnswer(`Calculation: ${question} = ${res}. CAPS method shown step-by-step.`);
                  } catch(e){ setAnswer("Invalid expression - Try like 2**5 or Math.sqrt(16)"); }
                }} className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold">SOLVE</button>
              </div>
              {answer && <p className="mt-3 text-sm font-bold">{answer}</p>}
            </div>
          </div>
        )}
      </main>

      <footer className="p-3 text-center border-t border-white/10 bg-black/20">
        <p className="text-[10px] opacity-60">© 2026 CAPS MATHS BUDDY 786 - Gr 8-12 Term 1-4 - {lang} - Perfect App - Dream App - Auto Talk Enabled - Built with ❤️ for South Africa - All Subjects Support</p>
        <p className="text-[9px] opacity-40 mt-1">DBE CAPS Aligned | NSC Matric Ready | 786 Blessed</p>
      </footer>
    </div>
  </div>
  );
                                        }
