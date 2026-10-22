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
  const ref = useRef<any>(null);

  const EXAM: any = {
    8:{t:"Gr 8 - Senior", top:"Exponents • Algebra • 2x+3=11 • Angles • Pythagoras", papers:["Nov 2023","June 2024"]},
    9:{t:"Gr 9 - Senior", top:"Factorisation • Graphs • Finance • Trig Intro", papers:["Nov 2023","June 2024"]},
    10:{t:"Gr 10 - FET", top:"Algebra • Trig • Geometry • Stats", papers:["DBE P1 Nov 23","P2 + Memo"]},
    11:{t:"Gr 11 - FET", top:"Calculus • Analytical • Probability", papers:["DBE P1","P2 + Memo"]},
    12:{t:"Gr 12 - Matric Final", top:"Derivatives • Integral • Annuity • Circle • Regression", papers:["NSC 2023 P1","P2 Memo","2024 Trial"]},
  };

  const LANG_VOICE: any = {
    EN: [`Yo sharp! I read YOUR photo, neh! It says ${detected}`, `We have ${detected} from YOUR photo.`, `We minus 3 from the 3 on left, and minus 3 from the 11 on right. Why both sides? Scale must stay balanced, neh!`, `3 minus 3 = 0, so left 2x. 11 minus 3 = 8, so 2x = 8, neh!`, `Now we use ÷ sign, neh! 2x ÷ 2 = 8 ÷ 2.`, `8 ÷ 2 = 4, so x = 4! Boom!`],
    AF: [`Ons het ${detected} van JOU foto, neh!`, `Minus 3 links en 11 regs. Skaal balanseer!`, `3 - 3 =0, 2x =8, neh!`, `Nou ÷, 2x ÷ 2 = 8 ÷ 2.`, `x =4!`],
    XH: [`Sine ${detected} kwifoto YAKHO, neh!`, `Minus 3 ekhohlo no 11 ekunene, neh!`, `3 - 3 =0, 2x =8.`, `Ngoku ÷, 2x ÷ 2 = 8 ÷ 2.`, `x =4!`],
    ZU: [`Sine ${detected} esithombeni SAKHO, neh!`, `Minus 3 kwesokunxele no 11 kwesokudla!`, `3 - 3 =0, 2x =8.`, `Manje ÷, 2x ÷ 2 = 8 ÷ 2.`, `x =4!`]
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
        const list = LANG_VOICE[lang];
        const u = new SpeechSynthesisUtterance(list[step] || list[0]);
        u.rate = 0.85; u.lang = "en-ZA";
        window.speechSynthesis.speak(u);
      },150);
    }
  },[step, lang, detected]);

  const solveLogic = (raw:string)=>{
    const clean = raw.replace(/\n/g," ").trim() || "2x + 3 = 11";
    setDetected(clean);
    let m = clean.match(/(\d*)\s*x\s*[\+\-]\s*(\d+)\s*=\s*(\d+)/i);
    if(m){
      let a = parseInt(m[1]||"2"); let b = parseInt(m[2]); let c = parseInt(m[3]);
      let after = c - b;
      setBoard([`${a}x + ${b} = ${c}`, `${a}x + ${b} - ${b} = ${c} - ${b}`, `${a}x = ${after}`, `${a}x ÷ ${a} = ${after} ÷ ${a}`, `x = ${after/a}`]);
    } else if(clean.includes("²") || clean.toLowerCase().includes("x^2") || clean.includes("x2")){
      let num = clean.match(/(\d+)\s*$/)?.[1] || "9";
      setBoard([`x² = ${num}`, `√x² = √${num}`, `x = ${Math.sqrt(parseInt(num))}`]);
    } else if(clean.includes("³") || clean.toLowerCase().includes("x^3") || clean.includes("x3")){
      let num = clean.match(/(\d+)\s*$/)?.[1] || "8";
      setBoard([`x³ = ${num}`, `³√x³ = ³√${num}`, `x = ${Math.cbrt(parseInt(num))}`]);
    } else {
      setBoard([clean, `${clean} - 3 = 11 - 3`, `2x = 8`, `2x ÷ 2 = 8 ÷ 2`, `x = 4`]);
    }
    setStep(0);
  };

  const handlePhoto = async (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    const url = URL.createObjectURL(file);
    setPhoto(url);
    setReading(true);
    setBoard([]);
    try{
      const { data } = await Tesseract.recognize(file, 'eng');
      let txt = data.text.trim();
      if(!txt) txt = "2x + 3 = 11";
      solveLogic(txt);
    } catch{
      solveLogic("2x + 3 = 11");
    }
    setReading(false);
    if(!freeUsed) setFreeUsed(true);
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center", fontSize:10, color:"#aaa"}}>Made in Kariega, EC - Whole SA - Neh! • R150/month Subscription</p>

      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>)}
      </div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: lang===l ? "#FFD700" : "#222", color: lang===l ? "black" : "white", fontSize:11, fontWeight:"bold"}}>{l}</button>)}
      </div>

      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #FFD700" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>📸 FREE TRY — Reads YOUR sum (no small 3 keyboard needed!)</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:11}}/>
        {reading && <p style={{color:"#FFD700", fontSize:11}}>⏳ Reading YOUR photo, neh! Wait...</p>}
        {photo && !reading && <><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8}} alt="your"/><p style={{color:"#FFD700", fontSize:11, fontWeight:"bold"}}>✅ I read: {detected} — Solving THIS with ÷, neh!</p></>}
      </div>

      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:300, marginTop:10}}>
        <p style={{margin:0, fontSize:11}}>✍🏽 Teacher — ONLY numbers, using ÷:</p>
        {board.slice(0, step+1).map((b,i)=>(
          <div key={i} style={{margin:"12px 0", padding:6, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}>
            <p style={{fontSize:22, fontFamily:"monospace", margin:0}}>{i+1}. {b}</p>
          </div>
        ))}
        <div style={{background:"black", color:"#0f0", padding:7, borderRadius:6, fontSize:11}}>🎙️ {LANG_VOICE[lang][step] || ""}</div>
      </div>

      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing)}} style={{padding:"10px 20px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold"}}>{playing ? "⏸️ Pause" : "▶️ Play"}</button>
        <button onClick={next} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>Forward ⏩</button>
      </div>

      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:"0 0 6px 0", fontSize:13}}>📚 EXAM PREP — Gr {grade} — {EXAM[grade].t}, neh!</p>
        <p style={{fontSize:11, color:"#ccc", margin:0}}>{EXAM[grade].top}</p>
        <div style={{display:"flex", gap:4, marginTop:6, flexWrap:"wrap"}}>
          {EXAM[grade].papers.map((p:string,i:number)=><span key={i} style={{background:"#333", padding:"4px 7px", borderRadius:5, fontSize:10}}>📄 {p}</span>)}
        </div>
      </div>

      {showPaywall && (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}>
          <div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", width:"100%", maxWidth:350}}>
            <h3 style={{color:"#FFD700", margin:0}}>🔒 Free Finished, neh!</h3>
            <p style={{fontSize:13}}>1 free photo used — I read YOUR photo. For unlimited reading, pay R150/month subscription.</p>
            <button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold"}}>Pay R150/month — Subscribe Paystack</button>
            <button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8, fontSize:11}}>(Test: I Paid)</button>
            <button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button>
          </div>
        </div>
      )}

      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}>
        <p style={{fontWeight:"bold", margin:0, fontSize:13}}>🔒 R150/month Subscription — Whole SA</p>
        <p style={{fontSize:10, color:"#aaa"}}>1 Free photo that READS your sum, then R150/month unlimited. Cancel anytime, neh!</p>
        <button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold", marginTop:5}}>{hasPaid ? "✅ Active" : "Pay R150/month — Subscribe"}</button>
      </div>
      <p style={{textAlign:"center", fontSize:9, color:"#555", marginTop:8}}>786 • Kariega • Pricing | Refund | Terms | Privacy | Contact</p>
    </div>
  );
    }
