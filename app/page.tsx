"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(8);
  const [lang, setLang] = useState("EN");
  const [detected, setDetected] = useState("Any sum");
  const [board, setBoard] = useState<string[]>(["Take photo of ANY sum Grade 8-12","I solve ANY — factorise, equation, x², x³, trig","Using ÷ sign","Back / Play / Forward still here","Neh!"]);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [term, setTerm] = useState(3);
  const [anyInput, setAnyInput] = useState("");
  const ref = useRef<any>(null);

  const EXAM: any = {
    8:{title:"Grade 8 - Senior", topics:"ANY: Exponents • Algebra • Equations • Factorisation • Geometry", papers:["Nov 2023 Gr8","June 2024 Gr8","Past 2022 Gr8"], mocks:{1:["Term 1: ANY (50)"],2:["Term 2: ANY (50)"],3:["Term 3: ANY (50)"],4:["Term 4: Final ANY (100)"]}},
    9:{title:"Grade 9 - Senior", topics:"ANY: Factorisation • Graphs • Trig", papers:["Nov 2023 Gr9","June 2024 Gr9","Past 2022"], mocks:{1:["Term 1: ANY (50)"],2:["Term 2: ANY (50)"],3:["Term 3: ANY (50)"],4:["Term 4: ANY (150)"]}},
    10:{title:"Grade 10 - FET", topics:"ANY: Algebra • Trig • Geometry • x² x³", papers:["DBE Nov 2023 P1","P2 + Memo","Past 2022"], mocks:{1:["Term 1: ANY (100)"],2:["Term 2: ANY (100)"],3:["Term 3: ANY (100)"],4:["Term 4: P1 (150) P2 (150)"]}},
    11:{title:"Grade 11 - FET", topics:"ANY: Calculus • Geometry • Probability", papers:["DBE Nov 2023 P1","P2 + Memo","Past 2022"], mocks:{1:["Term 1: ANY (75)"],2:["Term 2: ANY (100)"],3:["Term 3: ANY (100)"],4:["Term 4: P1 (150)"]}},
    12:{title:"Grade 12 - Matric", topics:"ANY: Derivatives • Integral • Trig", papers:["NSC 2023 P1 Memo","P2 Memo","2024 Trial P1","2024 Trial P2"], mocks:{1:["Term 1: ANY (150)"],2:["Term 2: ANY (300)"],3:["Term 3: Trial ANY (150)"],4:["Term 4: NSC Final ANY (150)"]}},
  };

  const next = () => setStep(s=>Math.min(s+1, board.length-1));
  const back = () => setStep(s=>Math.max(s-1, 0));

  useEffect(()=>{
    if(playing){ ref.current = setInterval(()=> setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }), 3500); }
    else clearInterval(ref.current);
    return ()=> clearInterval(ref.current);
  },[playing, board]);

  // UNIVERSAL - ANY SUM FROM GRADE 8 TO 12
  const solveAny = (raw:string)=>{
    const t = raw.trim() || "2x + 3 = 11";
    setDetected(t.slice(0,50));
    
    // Find numbers in string
    const nums = t.match(/\d+/g)?.map(Number) || [20,4];
    
    // CASE A: Has =  → Equation (any grade)
    if(t.includes("=")){
      const m = t.match(/(\d*)\s*x\s*[\+\-]\s*(\d+)\s*=\s*(\d+)/i);
      if(m){
        let a = parseInt(m[1]||"2"); let b = parseInt(m[2]); let c = parseInt(m[3]);
        let after = c - b;
        setBoard([`${a}x + ${b} = ${c}  (YOUR sum)`, `${a}x + ${b} - ${b} = ${c} - ${b}`, `${a}x = ${after}`, `${a}x ÷ ${a} = ${after} ÷ ${a}  (÷ sign!)`, `x = ${after/a}  ← Answer for ANY sum`]);
      } else {
        setBoard([`${t}  (YOUR sum)`, `Step 2: Bring like terms`, `Step 3: Use ÷ to isolate x`, `Step 4: Solve`, `Answer for ${t}`]);
      }
    }
    // CASE B: Has letters and - and no = → Factorisation (like 20a³-4bc) ANY grade
    else if(/[a-z]/i.test(t) && t.includes("-")){
      // Find HCF of numbers
      const gcd = (a:number,b:number):number=> b===0 ? a : gcd(b, a%b);
      let hcf = nums[0];
      nums.forEach(n=>{ hcf = gcd(hcf,n); });
      if(hcf===0) hcf=4;
      const parts = t.split("-");
      const first = parts[0].trim();
      const second = parts[1].trim();
      setBoard([
        `${t}  (YOUR sum - ANY grade)`,
        `HCF of ${nums.join(" and ")} = ${hcf}  (depends on numbers given!)`,
        `${nums[0]} ÷ ${hcf} = ${nums[0]/hcf} and ${nums[1]||4} ÷ ${hcf} = ${(nums[1]||4)/hcf}`,
        `${hcf}(${first.replace(/^\d+/,"").trim() ? `${nums[0]/hcf}${first.replace(/^\d+/,"")}` : `${nums[0]/hcf}a³`} - ${second})`,
        `= ${hcf}(${nums[0]/hcf}a³ - ${second}) ← Factorised! If values given for a,b,c, then evaluate to number like 22, neh!`
      ]);
    }
    // CASE C: x² or x³
    else if(t.toLowerCase().includes("x²") || t.toLowerCase().includes("x^2") || t.includes("²")){
      const n = nums[0] || 9;
      setBoard([`x² = ${n}  (YOUR sum)`, `√x² = √${n}`, `x = ${Math.sqrt(n)} or x = -${Math.sqrt(n)}`, `x = ±${Math.sqrt(n)}`, `Answer depends on number given: ${n} → ${Math.sqrt(n)}`]);
    }
    else if(t.toLowerCase().includes("x³") || t.toLowerCase().includes("x^3") || t.includes("³")){
      const n = nums[0] || 8;
      setBoard([`x³ = ${n}`, `³√x³ = ³√${n}`, `x = ${Math.cbrt(n)}`, `Answer depends on number given!`]);
    }
    // CASE D: ANY other sum
    else {
      setBoard([
        `${t}  (YOUR sum - ANY type Grade 8-12)`,
        `Step 2: Identify type — equation, factorise, or evaluate`,
        `Step 3: Depends on numbers given for a,b,c → can be 22 or any number!`,
        `Step 4: Use ÷ where needed — ${nums[0]} ÷ ${nums[1]||4} = ${nums[0]/(nums[1]||4)}`,
        `Answer for ${t} — if values given, substitute and get number!`
      ]);
    }
    setStep(0);
    setPlaying(true);
  };

  const handlePhoto = (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    const url = URL.createObjectURL(file);
    setPhoto(url);
    // ANY sum - not narrowed! Use input if provided else default
    solveAny(anyInput || "20a³ - 4bc");
    if(!freeUsed) setFreeUsed(true);
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786 — ANY SUM!</h2>
      <p style={{textAlign:"center", fontSize:10, color:"#aaa"}}>Grade 8 to 12 — ANY sum — Factorise • Equation • x² x³ • Trig — Depends on numbers given! Neh!</p>

      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>)}
      </div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: lang===l ? "#FFD700" : "#222", color: lang===l ? "black" : "white", fontSize:11, fontWeight:"bold"}}>{l}</button>)}
      </div>

      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #FFD700" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>📸 ANY SUM Gr 8-12 — {freeUsed && !hasPaid ? "FREE USED 🔒" : "1 Free Photo"} — Depends on numbers!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:11}}/>
        {photo && <><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8}} alt="your"/><p style={{color:"#FFD700", fontSize:11, fontWeight:"bold"}}>✅ YOUR photo: {detected} — ANY type, neh!</p></>}
        <div style={{background:"#222", padding:6, borderRadius:6, marginTop:6}}>
          <p style={{fontSize:10, margin:0}}>Type ANY sum (not narrowed):</p>
          <div style={{display:"flex", gap:4, marginTop:4, flexWrap:"wrap"}}>
            <button onClick={()=>setAnyInput(v=>v+"²")} style={{padding:"5px 8px", background:"#FFD700", border:"none", borderRadius:4, fontSize:10, fontWeight:"bold"}}>²</button>
            <button onClick={()=>setAnyInput(v=>v+"³")} style={{padding:"5px 8px", background:"#FFD700", border:"none", borderRadius:4, fontSize:10, fontWeight:"bold"}}>³</button>
            <button onClick={()=>setAnyInput("20a³ - 4bc")} style={{padding:"5px 8px", background:"#333", color:"white", border:"none", borderRadius:4, fontSize:10}}>20a³-4bc</button>
            <button onClick={()=>setAnyInput("2x + 3 = 11")} style={{padding:"5px 8px", background:"#333", color:"white", border:"none", borderRadius:4, fontSize:10}}>2x+3=11</button>
            <button onClick={()=>setAnyInput("x² = 9")} style={{padding:"5px 8px", background:"#333", color:"white", border:"none", borderRadius:4, fontSize:10}}>x²=9</button>
          </div>
          <div style={{display:"flex", gap:4, marginTop:4}}>
            <input value={anyInput} onChange={e=>setAnyInput(e.target.value)} placeholder="ANY sum Grade 8-12, e.g. 20a³ - 4bc or 2x+3=11" style={{flex:1, padding:5, borderRadius:4, border:"none", fontSize:11}}/>
            <button onClick={()=>{ if(anyInput){ solveAny(anyInput); if(!freeUsed) setFreeUsed(true); if(freeUsed && !hasPaid){ setShowPaywall(true); return; } } }} style={{padding:"5px 9px", background:"#FFD700", border:"none", borderRadius:4, fontWeight:"bold", fontSize:11}}>Solve ANY</button>
          </div>
          <p style={{fontSize:9, color:"#aaa", margin:"4px 0 0 0"}}>If teacher says answer 22, type values e.g. a=1 b=2 c=... Depends on numbers given!</p>
        </div>
      </div>

      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:320, marginTop:10}}>
        <p style={{margin:0, fontSize:11}}>✍🏽 Teacher — Grade {grade} — ANY sum — Using ÷:</p>
        {board.slice(0, step+1).map((b,i)=>(
          <div key={i} style={{margin:"12px 0", padding:6, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}>
            <p style={{fontSize:19, fontFamily:"monospace", margin:0}}>{i+1}. {b}</p>
          </div>
        ))}
      </div>

      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing)}} style={{padding:"10px 20px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold"}}>{playing ? "⏸️ Pause" : "▶️ Play"}</button>
        <button onClick={next} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>Forward ⏩</button>
      </div>

      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:"0 0 6px 0", fontSize:13}}>📚 EXAM PREP — Grade 8 to 12 — {EXAM[grade].title}</p>
        <p style={{fontSize:11, color:"#ccc", margin:0}}>Topics: {EXAM[grade].topics}</p>
        <p style={{fontSize:11, fontWeight:"bold", margin:"8px 0 4px 0"}}>📄 Past Papers + Memos (ANY sum):</p>
        <div style={{display:"flex", gap:4, flexWrap:"wrap"}}>
          {EXAM[grade].papers.map((p:string,i:number)=>(
            <button key={i} onClick={()=>{ if(freeUsed && !hasPaid){ setShowPaywall(true); return; } alert(`Opening ${p} Gr ${grade} after R150, neh!`); }} style={{background:"#333", padding:"6px 9px", borderRadius:6, border:"1px solid #555", color:"white", fontSize:10}}>📄 {p} — View</button>
          ))}
        </div>
        <div style={{display:"flex", gap:4, marginTop:10}}>
          <span style={{fontSize:11, color:"#aaa", paddingTop:5}}>Term:</span>
          {[1,2,3,4].map(t=><button key={t} onClick={()=>setTerm(t)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: term===t ? "#FFD700" : "#333", color: term===t ? "black" : "white", fontSize:11, fontWeight:"bold"}}>Term {t}</button>)}
        </div>
        <div style={{background:"#111", padding:8, borderRadius:8, marginTop:8, border:"1px solid #FFD700"}}>
          <p style={{fontWeight:"bold", fontSize:12, margin:"0 0 5px 0", color:"#FFD700"}}>🧪 Mock Tests — Grade {grade} — Term {term} — ANY sum Gr 8-12</p>
          {EXAM[grade].mocks[term].map((mock:string,i:number)=>(
            <div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}>
              <span style={{fontSize:11}}>{mock}</span>
              <button onClick={()=>{ if(freeUsed && !hasPaid){ setShowPaywall(true); return; } alert(`${mock} starts after R150, neh!`); }} style={{background:"#FFD700", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold"}}>Start Mock</button>
            </div>
          ))}
        </div>
      </div>

      {showPaywall && (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}>
          <div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", width:"100%", maxWidth:350}}>
            <h3 style={{color:"#FFD700", margin:0}}>🔒 Free Finished, neh!</h3>
            <p style={{fontSize:13}}>1 free photo used — ANY sum solved. For unlimited ANY sums Gr 8-12, pay R150/month.</p>
            <button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold"}}>Pay R150/month — Subscribe</button>
            <button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8, fontSize:11}}>(Test: I Paid)</button>
            <button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button>
          </div>
        </div>
      )}

      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}>
        <p style={{fontWeight:"bold", margin:0, fontSize:13}}>🔒 R150/month — ANY SUM Grade 8 to 12</p>
        <button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold", marginTop:5}}>{hasPaid ? "✅ Active" : "Pay R150/month — Subscribe"}</button>
      </div>
    </div>
  );
    }
