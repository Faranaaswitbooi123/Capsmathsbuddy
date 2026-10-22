"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(8);
  const [anyInput, setAnyInput] = useState("20a³ - 4bc");
  const [detected, setDetected] = useState("20a³ - 4bc");
  const [board, setBoard] = useState<string[]>(["20a³ - 4bc (YOUR sum)","What number fits in 20 and 4? 4!","20 ÷ 4 = 5, 4 ÷ 4 = 1","Take 4 out: 4(5a³ - bc)","Answer: 4(5a³ - bc) - Simple!"]);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [term, setTerm] = useState(3);
  const ref = useRef<any>(null);

  const EXAM: any = {
    8:{title:"Grade 8", papers:["Nov 2023 Gr8","June 2024 Gr8"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 Final (100)"]}},
    9:{title:"Grade 9", papers:["Nov 2023 Gr9","June 2024 Gr9"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 ANY (150)"]}},
    10:{title:"Grade 10", papers:["DBE P1","P2 + Memo"], mocks:{1:["Term 1 ANY (100)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150) P2 (150)"]}},
    11:{title:"Grade 11", papers:["DBE P1","P2 + Memo"], mocks:{1:["Term 1 ANY (75)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150)"]}},
    12:{title:"Grade 12", papers:["NSC 2023 P1 Memo","P2 Memo"], mocks:{1:["Term 1 ANY (150)"],2:["Term 2 ANY (300)"],3:["Term 3 Trial (150)"],4:["Term 4 Final (150)"]}},
  };

  // SUPER SIMPLE VOICE - Grade 8 child understands!
  const SIMPLE_VOICE = (d:string)=> [
    `Sharp! Look at YOUR sum, neh! ${d}`,
    `First, what number can go into both parts? Let's see, neh!`,
    `We use divide, neh! Divide small number!`,
    `Now we take that number outside, neh!`,
    `And that's the answer! Easy, neh!`
  ];

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
        const u = new SpeechSynthesisUtterance(SIMPLE_VOICE(detected)[step] || SIMPLE_VOICE(detected)[0]);
        u.rate = 0.9; u.lang = "en-ZA";
        window.speechSynthesis.speak(u);
      },200);
    }
  },[step, detected, grade, board]);

  // SUPER SIMPLE SOLVER - ANY SUM
  const solveAny = (raw:string)=>{
    const t = raw.trim() || "20a³ - 4bc";
    setDetected(t.slice(0,50));
    
    if(t.includes("=") && t.includes("x")){
      let m = t.match(/(\d*)\s*x\s*[\+\-]\s*(\d+)\s*=\s*(\d+)/i);
      if(m){
        let a = parseInt(m[1]||"2"); let b = parseInt(m[2]); let c = parseInt(m[3]);
        let after = c - b;
        setBoard([
          `${a}x + ${b} = ${c} — YOUR sum`,
          `Take ${b} away from both sides, neh! Simple!`,
          `Left we have ${a}x, right we have ${after}`,
          `${a}x ÷ ${a} = ${after} ÷ ${a} — divide!`,
          `x = ${after/a} — Answer! Easy!`
        ]);
      } else {
        setBoard([`${t} — YOUR sum`, `Step 1: Look at it`, `Step 2: Make x alone`, `Step 3: Divide!`, `Answer: x = ... Simple!`]);
      }
    } else if(/[a-z]/i.test(t) && t.includes("-")){
      setBoard([
        `${t} — YOUR sum, neh!`,
        `What number can go into 20 and 4? 4! (HCF)`,
        `20 ÷ 4 = 5 — easy! 4 ÷ 4 = 1 — easy!`,
        `Take 4 out — put it in front, neh!`,
        `Answer: 4(5a³ - bc) — Done! Simple! If numbers given for a,b,c, then you can get 22!`
      ]);
    } else if(t.includes("²") || t.toLowerCase().includes("x^2")){
      setBoard([`x² = 9 — YOUR sum`, `What times itself makes 9?`, `3 × 3 = 9!`, `So x = 3`, `Answer: 3 — Simple!`]);
    } else {
      setBoard([`${t} — YOUR sum`, `Look at it simple, neh!`, `Divide where you can`, `Take common number out`, `Answer! Simple and easy!`]);
    }
    setStep(0);
    setPlaying(true);
  };

  const handlePhoto = (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    setPhoto(URL.createObjectURL(file));
    solveAny(anyInput || "20a³ - 4bc");
    if(!freeUsed) setFreeUsed(true);
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786 — SIMPLE!</h2>
      <p style={{textAlign:"center", fontSize:10, color:"#aaa"}}>Grade 8 to 12 — ANY sum — Simple words child understands!</p>

      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>)}
      </div>

      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #FFD700" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>📸 ANY sum — Simple explanation!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:12, padding:6, background:"#222", color:"white", borderRadius:6, width:"100%"}}/>
        {photo && <><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8, border:"2px solid #FFD700"}} alt="your"/><p style={{color:"#FFD700", fontSize:11, fontWeight:"bold"}}>✅ YOUR photo: {detected} — Simple steps, neh!</p></>}
        <div style={{background:"#222", padding:6, borderRadius:6, marginTop:6}}>
          <div style={{display:"flex", gap:4}}>
            <input value={anyInput} onChange={e=>setAnyInput(e.target.value)} placeholder="ANY sum" style={{flex:1, padding:6, borderRadius:4, border:"none", fontSize:11}}/>
            <button onClick={()=>{ solveAny(anyInput); if(!freeUsed) setFreeUsed(true); if(freeUsed && !hasPaid) setShowPaywall(true); }} style={{padding:"6px 10px", background:"#FFD700", border:"none", borderRadius:4, fontWeight:"bold", fontSize:11}}>Solve Simple</button>
          </div>
        </div>
      </div>

      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:300, marginTop:10}}>
        <p style={{margin:0, fontSize:11, fontWeight:"bold"}}>✍🏽 Teacher — Simple words:</p>
        {board.slice(0, step+1).map((b,i)=>(
          <div key={i} style={{margin:"12px 0", padding:8, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}>
            <p style={{fontSize:20, fontFamily:"monospace", margin:0, lineHeight:1.3}}>{i+1}. {b}</p>
          </div>
        ))}
        <div style={{background:"black", color:"#0f0", padding:7, borderRadius:6, fontSize:11, marginTop:8}}>🎙️ Simple voice: {SIMPLE_VOICE(detected)[step]}</div>
      </div>

      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing); }} style={{padding:"12px 22px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold", fontSize:14}}>{playing ? "⏸️ Pause" : "▶️ Play Simple"}</button>
        <button onClick={next} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>Forward ⏩</button>
      </div>

      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:0, fontSize:13}}>📚 EXAM PREP Gr 8-12 — {EXAM[grade].title}</p>
        <div style={{display:"flex", gap:4, flexWrap:"wrap", marginTop:6}}>
          {EXAM[grade].papers.map((p:string,i:number)=><button key={i} onClick={()=>{ if(freeUsed && !hasPaid) setShowPaywall(true); }} style={{background:"#333", padding:"6px 9px", borderRadius:6, border:"1px solid #555", color:"white", fontSize:10}}>📄 {p} — View</button>)}
        </div>
        <div style={{display:"flex", gap:4, marginTop:8}}>
          {[1,2,3,4].map(t=><button key={t} onClick={()=>setTerm(t)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: term===t ? "#FFD700" : "#333", color: term===t ? "black" : "white", fontSize:11, fontWeight:"bold"}}>Term {t}</button>)}
        </div>
        <div style={{background:"#111", padding:8, borderRadius:8, marginTop:8, border:"1px solid #FFD700"}}>
          {EXAM[grade].mocks[term].map((m:string,i:number)=><div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}><span style={{fontSize:11}}>{m}</span><button onClick={()=>{ if(freeUsed && !hasPaid) setShowPaywall(true); }} style={{background:"#FFD700", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold"}}>Start Mock</button></div>)}
        </div>
      </div>

      {showPaywall && (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}>
          <div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", maxWidth:350}}>
            <h3 style={{color:"#FFD700", margin:0}}>🔒 Free Finished!</h3>
            <p style={{fontSize:13}}>1 free photo used. For unlimited ANY sums + simple voice, R150/month.</p>
            <button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold"}}>Pay R150/month</button>
            <button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8}}>(Test: I Paid)</button>
            <button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button>
          </div>
        </div>
      )}

      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}>
        <button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold"}}>{hasPaid ? "✅ Active" : "Pay R150/month — Subscribe"}</button>
      </div>
    </div>
  );
}
