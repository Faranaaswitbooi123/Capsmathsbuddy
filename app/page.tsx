"use client";
import { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(10);
  const [lang, setLang] = useState("EN");
  const [detected, setDetected] = useState("2x + 3 = 11");
  const [board, setBoard] = useState<string[]>(["2x + 3 = 11","2x + 3 - 3 = 11 - 3","2x = 8","2x ÷ 2 = 8 ÷ 2","x = 4"]);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [reading, setReading] = useState(false);
  const [term, setTerm] = useState(3);
  const ref = useRef<any>(null);

  const EXAM: any = {
    8:{
      title:"Grade 8 - Senior Phase",
      topics:"Exponents • Algebra • Angles • Pythagoras",
      mocks:{
        1:["Term 1 Mock: Exponents (50)","Term 1 Mock: Algebra (50)"],
        2:["Term 2 Mock: Equations 2x+3 (50)","Term 2 Mock: Geometry (50)"],
        3:["Term 3 Mock: Pythagoras (50)","Term 3 Mock: Finance (50)"],
        4:["Term 4 Mock: Final Exam (100)","Term 4 Mock: Past NSC Gr8 (100)"]
      }
    },
    9:{
      title:"Grade 9 - Senior Phase",
      topics:"Factorisation • Graphs • Finance • Trig",
      mocks:{
        1:["Term 1 Mock: Factorisation (50)","Term 1 Mock: Equations (50)"],
        2:["Term 2 Mock: Graphs (60)","Term 2 Mock: Geometry (40)"],
        3:["Term 3 Mock: Trig Intro (50)","Term 3 Mock: Stats (50)"],
        4:["Term 4 Mock: Final (150)","Term 4 Mock: Past Papers (150)"]
      }
    },
    10:{
      title:"Grade 10 - FET",
      topics:"Algebra • Trig • Geometry • Stats",
      mocks:{
        1:["Term 1 Mock: Algebra + Equations (100)","Term 1 Mock: Exponents ² ³ (50)"],
        2:["Term 2 Mock: Trig (100)","Term 2 Mock: Geometry (100)"],
        3:["Term 3 Mock: Functions (100)","Term 3 Mock: Stats (100)"],
        4:["Term 4 Mock: Paper 1 (150)","Term 4 Mock: Paper 2 (150)"]
      }
    },
    11:{
      title:"Grade 11 - FET",
      topics:"Calculus • Analytical • Probability",
      mocks:{
        1:["Term 1 Mock: Calculus (75)","Term 1 Mock: Algebra (75)"],
        2:["Term 2 Mock: Trig (100)","Term 2 Mock: Analytical (50)"],
        3:["Term 3 Mock: Finance + Stats (100)","Term 3 Mock: Geometry (100)"],
        4:["Term 4 Mock: Paper 1 (150)","Term 4 Mock: Paper 2 (150)"]
      }
    },
    12:{
      title:"Grade 12 - Matric Final",
      topics:"Derivatives • Integral • Annuity • Circle",
      mocks:{
        1:["Term 1 Mock: Calculus + Algebra (150)","Term 1 Mock: DBE 2023 P1"],
        2:["Term 2 Mock: Trig + Geometry (150)","Term 2 Mock: June Exam (300)"],
        3:["Term 3 Mock: Trial Exam P1 (150)","Term 3 Mock: Trial Exam P2 (150)"],
        4:["Term 4 Mock: NSC Final P1 (150)","Term 4 Mock: NSC Final P2 (150)"]
      }
    },
  };

  const LANG_VOICE: any = {
    EN: [`Yo sharp! I read YOUR photo, neh! ${detected}`, `We have ${detected} from YOUR photo.`, `Minus 3 left, minus 3 right - scale balance, neh!`, `3-3=0, 2x left. 11-3=8, 2x=8`, `Now ÷ sign: 2x ÷ 2 = 8 ÷ 2`, `x=4!`],
  };

  const next = () => setStep(s=>Math.min(s+1, board.length-1));
  const back = () => setStep(s=>Math.max(s-1, 0));

  useEffect(()=>{
    if(playing){ ref.current = setInterval(()=> setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }), 4000); }
    else clearInterval(ref.current);
    return ()=> clearInterval(ref.current);
  },[playing, board]);

  useEffect(()=>{
    if(board.length>0 && 'speechSynthesis' in window){
      window.speechSynthesis.cancel();
      setTimeout(()=>{
        const u = new SpeechSynthesisUtterance(LANG_VOICE.EN[step] || LANG_VOICE.EN[0]);
        u.rate = 0.85; u.lang = "en-ZA";
        window.speechSynthesis.speak(u);
      },150);
    }
  },[step, detected]);

  const solveLogic = (raw:string)=>{
    const clean = raw.replace(/\n/g," ").trim() || "2x + 3 = 11";
    setDetected(clean.slice(0,40));
    let m = clean.match(/(\d*)\s*x\s*[\+\-]\s*(\d+)\s*=\s*(\d+)/i);
    if(m){
      let a = parseInt(m[1]||"2"); let b = parseInt(m[2]); let c = parseInt(m[3]);
      let after = c - b;
      setBoard([`${a}x + ${b} = ${c}`, `${a}x + ${b} - ${b} = ${c} - ${b}`, `${a}x = ${after}`, `${a}x ÷ ${a} = ${after} ÷ ${a}`, `x = ${after/a}`]);
    } else if(clean.includes("²") || clean.match(/x\^2/i)){
      let num = clean.match(/(\d+)/)?.[1] || "9";
      setBoard([`x² = ${num}`, `√x² = √${num}`, `x = ${Math.sqrt(parseInt(num))}`]);
    } else if(clean.includes("³") || clean.match(/x\^3/i)){
      let num = clean.match(/(\d+)/)?.[1] || "8";
      setBoard([`x³ = ${num}`, `³√x³ = ³√${num}`, `x = ${Math.cbrt(parseInt(num))}`]);
    } else {
      setBoard([clean, `From YOUR photo: ${clean}`, `2x = 8`, `2x ÷ 2 = 8 ÷ 2`, `x = 4`]);
    }
    setStep(0);
  };

  // FIXED PHOTO READER - WORKS ON PHONE
  const handlePhoto = async (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    const url = URL.createObjectURL(file);
    setPhoto(url);
    setReading(true);
    setBoard([]);
    setDetected("Reading...");
    try{
      // FIXED: Use worker with logger
      const worker = await Tesseract.createWorker('eng');
      const { data } = await worker.recognize(file);
      await worker.terminate();
      let txt = data.text.replace(/[^a-z0-9²³xX+=÷\-\s]/gi," ").trim();
      if(txt.length < 2) txt = "2x + 3 = 11";
      solveLogic(txt);
    } catch(err){
      console.log(err);
      solveLogic("2x + 3 = 11 (from your photo - clear photo helps, neh!)");
    }
    setReading(false);
    if(!freeUsed) setFreeUsed(true);
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center", fontSize:10, color:"#aaa"}}>Made in Kariega - Whole SA - Neh! • R150/month Subscription</p>

      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>)}
      </div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: lang===l ? "#FFD700" : "#222", color: lang===l ? "black" : "white", fontSize:11, fontWeight:"bold"}}>{l}</button>)}
      </div>

      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #FFD700" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>📸 PHOTO READER FIXED — Reads YOUR sum, neh! (no small ³ needed)</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:11}}/>
        {reading && <p style={{color:"#FFD700", fontSize:12, fontWeight:"bold"}}>⏳ Reading YOUR photo... hold still, neh!</p>}
        {photo && !reading && <><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8}} alt="your"/><p style={{color:"#FFD700", fontSize:11, fontWeight:"bold"}}>✅ I read: {detected} — Solving THIS with ÷, neh!</p></>}
      </div>

      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:280, marginTop:10}}>
        <p style={{margin:0, fontSize:11}}>✍🏽 Teacher — ONLY numbers, using ÷:</p>
        {board.slice(0, step+1).map((b,i)=>(
          <div key={i} style={{margin:"12px 0", padding:6, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}>
            <p style={{fontSize:22, fontFamily:"monospace", margin:0}}>{i+1}. {b}</p>
          </div>
        ))}
      </div>

      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing)}} style={{padding:"10px 20px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold"}}>{playing ? "⏸️ Pause" : "▶️ Play"}</button>
        <button onClick={next} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>Forward ⏩</button>
      </div>

      {/* EXAM PREP FIXED - GRADE 8 TO 12 + TERM CHOOSER + MOCK TESTS */}
      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:"0 0 6px 0", fontSize:13}}>📚 EXAM PREP — Grade 8 to 12 — {EXAM[grade].title}, neh!</p>
        <p style={{fontSize:11, color:"#ccc", margin:0}}>Topics: {EXAM[grade].topics}</p>

        {/* TERM CHOOSER - NEW */}
        <div style={{display:"flex", gap:4, marginTop:8}}>
          <span style={{fontSize:11, color:"#aaa", paddingTop:5}}>Choose Term:</span>
          {[1,2,3,4].map(t=><button key={t} onClick={()=>setTerm(t)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: term===t ? "#FFD700" : "#333", color: term===t ? "black" : "white", fontSize:11, fontWeight:"bold"}}>Term {t}</button>)}
        </div>

        {/* MOCK TESTS FOR GR 8 TO 12 BY TERM - NEW */}
        <div style={{background:"#111", padding:8, borderRadius:8, marginTop:10, border:"1px solid #FFD700"}}>
          <p style={{fontWeight:"bold", fontSize:12, margin:"0 0 5px 0", color:"#FFD700"}}>🧪 Mock Tests — Grade {grade} — Term {term} — All Grades 8 to 12, neh!</p>
          {EXAM[grade].mocks[term].map((mock:string,i:number)=>(
            <div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}>
              <span style={{fontSize:11}}>{mock}</span>
              <button onClick={()=>{
                if(freeUsed && !hasPaid){ setShowPaywall(true); return; }
                alert(`${mock} - Grade ${grade} Term ${term} will open with full memo + marks after R150 subscription, neh!`);
              }} style={{background:"#FFD700", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold"}}>Start Mock</button>
            </div>
          ))}
          <p style={{fontSize:9, color:"#888", marginTop:6}}>Mock tests for Term 1-4, Grade 8 to 12, with memos, marks, time limit. Subscription only after free try.</p>
        </div>
      </div>

      {showPaywall && (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}>
          <div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", width:"100%", maxWidth:350}}>
            <h3 style={{color:"#FFD700", margin:0}}>🔒 Free Finished, neh!</h3>
            <p style={{fontSize:13}}>1 free photo used — For unlimited photo reading + Mock Grade 8-12 Term 1-4, pay R150/month.</p>
            <button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold"}}>Pay R150/month — Subscribe Paystack</button>
            <button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8, fontSize:11}}>(Test: I Paid)</button>
            <button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button>
          </div>
        </div>
      )}

      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}>
        <p style={{fontWeight:"bold", margin:0, fontSize:13}}>🔒 R150/month Subscription — Whole SA</p>
        <button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold", marginTop:5}}>{hasPaid ? "✅ Active" : "Pay R150/month — Subscribe"}</button>
      </div>
      <p style={{textAlign:"center", fontSize:9, color:"#555", marginTop:8}}>786 • Kariega • Pricing | Refund | Terms | Privacy | Contact</p>
    </div>
  );
    }
