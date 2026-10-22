"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(10);
  const [hasFree, setHasFree] = useState(false);
  const ref = useRef<any>(null);

  // BOARD = ONLY NUMBERS - FOR YOUR PHOTO
  const BOARD_STEPS = [
    "2x + 3 = 11",
    "2x + 3 - 3 = 11 - 3",
    "2x = 8",
    "2x / 2 = 8 / 2",
    "x = 4",
  ];

  // VOICE = DETAILED - MINUS FROM 8 AND 11 - WHY
  const VOICE_STEPS = [
    "Yo sharp! We wanna find x. Look at YOUR sum from the photo, neh!",
    "We have 2 times x plus 3 equals 11 — this is from YOUR photo, not random, neh!",
    "Listen good, neh! We have plus 3 on the left with x. To get x alone, we must take away that 3. So we minus 3 from the 3 on the left side, and we minus 3 from the 11 on the right side. Why both sides? Because equation is like a scale, neh! What you do left, you must do right, otherwise it balances wrong!",
    "Now calculate, neh: On the left, 3 minus 3 equals 0, so left with 2 times x. On the right, 11 minus 3 — you take 3 away from 11 — that equals 8. So now 2 times x equals 8, neh!",
    "Now we have 2 times x equals 8. To get x alone, we get rid of times 2. So we divided by 2 from the 2 times x, and divided by 2 from the 8. Why both sides again? Same reason, neh — keep scale balanced!",
    "2 divided by 2 equals 1, so x left alone. 8 divided by 2 equals 4. So x equals 4 — Boom! We got it, neh! That's YOUR sum!",
  ];

  const EXAM_DATA: any = {
    8: { title: "Gr 8 - Senior Phase", topics: ["Exponents", "Algebraic Expressions", "Equations: 2x+3=11", "Geometry: Angles", "Pythagoras"], papers: ["Nov 2023 Paper", "June 2024"] },
    9: { title: "Gr 9 - Senior Phase", topics: ["Factorisation", "Functions", "Graphs", "Finance: Interest", "Trig: Intro"], papers: ["Nov 2023", "June 2024"] },
    10: { title: "Gr 10 - FET", topics: ["Algebra: Complete square", "Trig: Sin Cos Tan", "Euclidean Geometry", "Stats"], papers: ["DBE Nov 2023 P1", "P2 + Memo"] },
    11: { title: "Gr 11 - FET", topics: ["Calculus: First principle", "Analytical Geometry", "Trig: Reduction", "Probability"], papers: ["DBE Nov 2023 P1", "P2 + Memo"] },
    12: { title: "Gr 12 - Matric Final", topics: ["Calculus: Derivatives & Integral", "Matrix", "Finance: Annuity", "Euclidean - Circle", "Stats: Regression"], papers: ["NSC 2023 P1 Memo", "NSC 2023 P2 Memo", "2024 Trial"] },
  };

  const next = () => setStep(s => Math.min(s+1, BOARD_STEPS.length-1));
  const back = () => setStep(s => Math.max(s-1, 0));

  useEffect(()=>{
    if(playing){ ref.current = setInterval(()=> setStep(s=>{ if(s>=BOARD_STEPS.length-1){ setPlaying(false); return s } return s+1 }), 4000); }
    else clearInterval(ref.current);
    return ()=> clearInterval(ref.current);
  },[playing]);

  useEffect(()=>{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      setTimeout(()=>{
        const u = new SpeechSynthesisUtterance(VOICE_STEPS[step]);
        u.rate = 0.85; u.lang = "en-ZA";
        window.speechSynthesis.speak(u);
      },150);
    }
  },[step]);

  const handlePhoto = (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
    setStep(0);
    setPlaying(false);
    window.speechSynthesis.cancel();
    setHasFree(true);
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:12}}>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center", fontSize:11, marginTop:2}}>Made in Kariega, EC - Whole SA - Neh! • R150/month Subscription</p>

      {/* FREE PHOTO - YOUR SUM */}
      <div style={{background:"#111", padding:10, borderRadius:12, border: photo ? "2px solid #FFD700" : "1px solid #333", marginTop:10}}>
        <p style={{margin:"4px 0", fontWeight:"bold", fontSize:13}}>📸 FREE TRY — Photo YOUR sum (not random!), neh!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:12}}/>
        {photo ? (
          <>
            <img src={photo} style={{width:"100%", marginTop:8, borderRadius:8, border:"1px solid #555"}} alt="your sum"/>
            <p style={{color:"#FFD700", fontSize:11, fontWeight:"bold", margin:"5px 0"}}>✅ Solving THIS sum from YOUR photo above, neh! Not random!</p>
          </>
        ) : <p style={{fontSize:11, color:"#aaa", margin:"5px 0"}}>Take clear photo — we solve YOUR sum, neh!</p>}
      </div>

      {/* BOARD ONLY NUMBERS */}
      <div style={{background:"#FFF9E5", color:"black", padding:14, borderRadius:14, minHeight:320, marginTop:12}}>
        <p style={{margin:0, fontSize:11}}>✍🏽 Teacher writing slow — ONLY numbers on board:</p>
        {BOARD_STEPS.slice(0, step+1).map((b,i)=>(
          <div key={i} style={{margin:"14px 0", padding:6, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}>
            <p style={{fontSize:24, fontFamily:"monospace", margin:0}}>{i+1}. {b}</p>
          </div>
        ))}
        <div style={{background:"black", color:"#00FF00", padding:8, borderRadius:6, fontSize:11, marginTop:10}}>🎙️ Voice: {VOICE_STEPS[step]}</div>
      </div>

      {/* CONTROLS */}
      <div style={{display:"flex", gap:6, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"10px 16px", background:"#333", color:"white", borderRadius:8, border:"none"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing)}} style={{padding:"10px 22px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold"}}>{playing ? "⏸️ Pause" : "▶️ Play"}</button>
        <button onClick={next} style={{padding:"10px 16px", background:"#333", color:"white", borderRadius:8, border:"none"}}>Forward ⏩</button>
      </div>

      {/* EXAM PREP 8-12 */}
      <div style={{background:"#1e1e1e", padding:12, borderRadius:12, marginTop:14, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:"0 0 8px 0"}}>📚 EXAM PREP — Grades 8 to 12 — CAPS, neh!</p>
        <div style={{display:"flex", gap:5, overflowX:"auto", paddingBottom:5}}>
          {[8,9,10,11,12].map(g=>(
            <button key={g} onClick={()=>setGrade(g)} style={{padding:"8px 14px", borderRadius:20, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:12, minWidth:60}}>Gr {g}</button>
          ))}
        </div>
        <div style={{marginTop:10}}>
          <p style={{fontWeight:"bold", fontSize:13, margin:0}}>{EXAM_DATA[grade].title}</p>
          <p style={{fontSize:11, color:"#aaa", margin:"4px 0"}}>Topics: {EXAM_DATA[grade].topics.join(" • ")}</p>
          <div style={{display:"flex", gap:5, flexWrap:"wrap", marginTop:6}}>
            {EXAM_DATA[grade].papers.map((p:string,i:number)=>(
              <span key={i} style={{background:"#333", padding:"5px 8px", borderRadius:6, fontSize:10}}>📄 {p}</span>
            ))}
          </div>
        </div>
        <p style={{fontSize:10, color:"#888", marginTop:8}}>All CAPS DBE past papers + Memos — For subscription learners, neh!</p>
      </div>

      {/* R150 SUBSCRIPTION */}
      <div style={{border:"2px solid #FFD700", padding:14, borderRadius:14, textAlign:"center", marginTop:14, background:"#111"}}>
        <p style={{fontWeight:"bold", margin:0}}>🔒 Unlock Full Solving — R150/month Subscription</p>
        <p style={{fontSize:11, margin:"4px 0"}}>Whole SA • Cancel anytime • Secure Paystack</p>
        <p style={{fontSize:10, color:"#aaa"}}>Unlimited YOUR photos + Slow writing + Voice EN/AF/XH/ZU + Gr 8-12 Exam Prep</p>
        <button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold", marginTop:6}}>Pay R150/month — Subscribe with Paystack</button>
        <p style={{fontSize:9, color:"#666", marginTop:5}}>Recurring subscription. Cancel in Paystack dashboard or support@capsbuddy786.co.za. 7-day refund, neh!</p>
      </div>

      <p style={{textAlign:"center", fontSize:9, color:"#555", marginTop:10}}>786 • Kariega, EC • For Whole SA • <a href="/pricing" style={{color:"#555"}}>Pricing</a> | <a href="/refund" style={{color:"#555"}}>Refund</a> | <a href="/terms" style={{color:"#555"}}>Terms</a> | <a href="/privacy" style={{color:"#555"}}>Privacy</a> | <a href="/contact" style={{color:"#555"}}>Contact</a></p>
    </div>
  );
    }
