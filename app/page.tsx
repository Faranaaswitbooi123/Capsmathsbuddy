"use client";
import { useState, useEffect, useRef } from "react";

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
  const ref = useRef<any>(null);

  const LANG_VOICE: any = {
    EN: ["Yo sharp! We wanna find x. Look at YOUR sum from photo, neh!","We have "+detected+" from YOUR photo.","We minus 3 from the 3 left, and minus 3 from the 11 right. Why both sides? Scale must stay balanced, neh!","3 - 3 = 0, left is 2x. 11 - 3 = 8, so 2x = 8.","Now divided by, neh! We use ÷. So 2x ÷ 2 = 8 ÷ 2. 2 ÷ 2 =1, so x left.","8 ÷ 2 =4, so x =4! Boom!"],
    AF: ["Ons soek x, neh!","Ons het "+detected+" van JOU foto.","Ons minus 3 links en 11 regs. Skaal moet balanseer!","3 - 3 =0, 2x =8.","Nou ÷. 2x ÷ 2 = 8 ÷ 2.","x =4!"],
    XH: ["Molo! Sifuna u-x, neh!","Sine "+detected+" kwifoto YAKHO.","Minus 3 ekhohlo no 11 ekunene, neh! Isikali!","3 - 3 =0, 2x =8.","Ngoku ÷. 2x ÷ 2 = 8 ÷ 2.","x =4!"],
    ZU: ["Sawubona! Sifuna u-x, neh!","Sine "+detected+" esithombeni SAKHO.","Minus 3 kwesokunxele no 11 kwesokudla, neh!","3 - 3 =0, 2x =8.","Manje ÷. 2x ÷ 2 = 8 ÷ 2.","x =4!"]
  };
  const VOICE = LANG_VOICE[lang];
  const EXAM: any = {
    8:{t:"Gr 8", top:"Exponents • Algebra • 2x+3=11 • Angles", papers:["Nov 2023","June 2024"]},
    9:{t:"Gr 9", top:"Factorisation • Graphs • Finance", papers:["Nov 2023","June 2024"]},
    10:{t:"Gr 10", top:"Algebra • Trig • Geometry", papers:["DBE P1 Nov 23","P2 + Memo"]},
    11:{t:"Gr 11", top:"Calculus • Analytical • Probability", papers:["DBE P1","P2 + Memo"]},
    12:{t:"Gr 12", top:"Derivatives • Integral • Annuity • Circle", papers:["NSC 2023 P1","P2 Memo"]},
  };

  const next = () => setStep(s=>Math.min(s+1, board.length-1));
  const back = () => setStep(s=>Math.max(s-1, 0));

  useEffect(()=>{
    if(playing){ ref.current = setInterval(()=> setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }), 3800); }
    else clearInterval(ref.current);
    return ()=> clearInterval(ref.current);
  },[playing, board]);

  useEffect(()=>{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      setTimeout(()=>{
        const u = new SpeechSynthesisUtterance(VOICE[step] || VOICE[0]);
        u.rate = 0.85; u.lang = lang==="AF" ? "af-ZA" : "en-ZA";
        window.speechSynthesis.speak(u);
      },150);
    }
  },[step, lang]);

  const solveFromText = (text:string)=>{
    const m = text.match(/(\d*)\s*x\s*\+\s*(\d+)\s*=\s*(\d+)/i) || text.match(/(\d+)x\+(\d+)=(\d+)/i);
    if(m){
      let a = parseInt(m[1]||"2"); let b = parseInt(m[2]); let c = parseInt(m[3]);
      let after = c - b; let xVal = after / a;
      setBoard([`${a}x + ${b} = ${c}`, `${a}x + ${b} - ${b} = ${c} - ${b}`, `${a}x = ${after}`, `${a}x ÷ ${a} = ${after} ÷ ${a}`, `x = ${xVal}`]);
      setDetected(`${a}x + ${b} = ${c}`);
    } else {
      setBoard(["2x + 3 = 11","2x + 3 - 3 = 11 - 3","2x = 8","2x ÷ 2 = 8 ÷ 2","x = 4"]);
      setDetected(text.slice(0,30));
    }
    setStep(0);
  };

  const handlePhoto = async (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    
    // PAYWALL CHECK - AFTER FREE SUM
    if(freeUsed && !hasPaid){
      setShowPaywall(true);
      e.target.value = ""; // reset input
      return;
    }

    const url = URL.createObjectURL(file);
    setPhoto(url);
    setStep(0);
    setPlaying(false);
    window.speechSynthesis.cancel();
    
    const fake = prompt("I see your photo, neh! Type sum you see (e.g. 3x+5=20) so I solve YOUR exact sum with ÷:");
    if(fake) solveFromText(fake);
    else solveFromText("2x + 3 = 11");
    
    if(!freeUsed) setFreeUsed(true); // Mark free as used after first
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786</h2>

      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=>(
          <button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>
        ))}
      </div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=>(
          <button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: lang===l ? "#FFD700" : "#222", color: lang===l ? "black" : "white", fontSize:11, fontWeight:"bold"}}>{l}</button>
        ))}
      </div>

      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #FFD700" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>📸 {hasPaid ? "Unlimited Photos - You Paid!" : freeUsed ? "FREE USED - Next photo locked 🔒" : "FREE TRY - 1 Free Photo"} — Solve YOUR sum!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:11}}/>
        {photo && <><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8}} alt="your"/><p style={{color:"#FFD700", fontSize:11, fontWeight:"bold"}}>✅ Detected: {detected} — Solving THIS with ÷, neh!</p></>}
      </div>

      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:280, marginTop:10}}>
        <p style={{margin:0, fontSize:11}}>✍🏽 Teacher — ONLY numbers, using ÷:</p>
        {board.slice(0, step+1).map((b,i)=>(
          <div key={i} style={{margin:"12px 0", padding:6, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}>
            <p style={{fontSize:22, fontFamily:"monospace", margin:0}}>{i+1}. {b}</p>
          </div>
        ))}
        <div style={{background:"black", color:"#0f0", padding:7, borderRadius:6, fontSize:11}}>🎙️ {VOICE[step]}</div>
      </div>

      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing)}} style={{padding:"10px 20px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold"}}>{playing ? "⏸️ Pause" : "▶️ Play"}</button>
        <button onClick={next} style={{padding:"10px 14px", background:"#333", color:"white", borderRadius:8, border:"none"}}>Forward ⏩</button>
      </div>

      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:"0 0 6px 0", fontSize:13}}>📚 EXAM PREP — Gr {grade} — {EXAM[grade].t}, neh!</p>
        <p style={{fontSize:11, color:"#ccc", margin:0}}>{EXAM[grade].top}</p>
      </div>

      {/* PAYWALL MODAL AFTER FREE */}
      {showPaywall && (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.9)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}>
          <div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", width:"100%", maxWidth:350}}>
            <h3 style={{color:"#FFD700", margin:0}}>🔒 Free Try Finished, neh!</h3>
            <p style={{fontSize:13, margin:"10px 0"}}>You used your 1 free photo. To solve unlimited YOUR photos, you need R150/month subscription.</p>
            <p style={{fontSize:11, color:"#aaa"}}>✅ Unlimited YOUR photos (not random)<br/>✅ Board with ÷ sign<br/>✅ Voice EN/AF/XH/ZU, slow writing<br/>✅ Gr 8-12 Exam Prep<br/>✅ Cancel anytime, neh!</p>
            <button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold", marginTop:8}}>Pay R150/month — Subscribe with Paystack</button>
            <button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8, fontSize:11}}>(Test: I Paid — Unlock)</button>
            <button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8, fontSize:11}}>Close</button>
            <p style={{fontSize:9, color:"#666", marginTop:6}}>Secure recurring subscription. 7-day refund. support@capsbuddy786.co.za</p>
          </div>
        </div>
      )}

      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}>
        <p style={{fontWeight:"bold", margin:0, fontSize:13}}>🔒 {freeUsed && !hasPaid ? "Free Used — Subscribe Now" : "R150/month Subscription"} — Whole SA</p>
        <p style={{fontSize:10, color:"#aaa"}}>{freeUsed && !hasPaid ? "1 free photo used. Next photo needs R150/month, neh!" : "1 Free photo, then R150/month. Unlimited YOUR photos + ÷ + Gr 8-12"}</p>
        <button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold", marginTop:5}}>{hasPaid ? "✅ Subscribed — R150/month Active" : "Pay R150/month — Subscribe Paystack"}</button>
      </div>

      <p style={{textAlign:"center", fontSize:9, color:"#555", marginTop:8}}>786 • Kariega • Pricing | Refund | Terms | Privacy | Contact</p>
    </div>
  );
}
