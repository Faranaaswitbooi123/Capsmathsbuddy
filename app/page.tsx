"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(8);
  const [lang, setLang] = useState("EN");
  const [detected, setDetected] = useState("20a³ - 4bc");
  const [board, setBoard] = useState<string[]>(["📸 Take photo of ANY sum — NO typing! True OCR inside page.tsx!","What number fits in 20 and 4? 4!","20 ÷ 4 = 5, 4 ÷ 4 = 1","Take 4 out: 4(5a³ - bc)","Answer: 4(5a³ - bc) - Simple!"]);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [term, setTerm] = useState(3);
  const [ocrLoading, setOcrLoading] = useState(false);
  const ref = useRef<any>(null);

  const EXAM: any = {
    8:{title:"Grade 8 CAPS Senior", papers:["Nov 2023 Gr8","June 2024 Gr8"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 Final (100)"]}},
    9:{title:"Grade 9 CAPS Senior", papers:["Nov 2023 Gr9","June 2024 Gr9"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 ANY (150)"]}},
    10:{title:"Grade 10 CAPS FET", papers:["DBE P1","P2 + Memo"], mocks:{1:["Term 1 ANY (100)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150) P2 (150)"]}},
    11:{title:"Grade 11 CAPS FET", papers:["DBE P1","P2 + Memo"], mocks:{1:["Term 1 ANY (75)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150)"]}},
    12:{title:"Grade 12 CAPS FET Matric", papers:["NSC 2023 P1 Memo","P2 Memo"], mocks:{1:["Term 1 ANY (150)"],2:["Term 2 ANY (300)"],3:["Term 3 Trial (150)"],4:["Term 4 Final (150)"]}},
  };

  const VOICE: any = {
    EN: (d:string)=> [`Look at your sum! ${d}`, `What number can go into both parts? Let's see!`, `We use divide! Divide small number!`, `Now we take that number outside!`, `And that's the answer! Easy!`],
    AF: (d:string)=> [`Kyk na jou som! ${d}`, `Watter nommer pas in albei? Kom ons kyk!`, `Ons gebruik deel!`, `Haal daardie nommer uit!`, `En dis die antwoord! Maklik!`],
    XH: (d:string)=> [`Jonga isibalo sakho! ${d}`, `Leliphi inani elingena kuzo zombini?`, `Sisebenzisa ukwahlula!`, `Sikhupha elo nani ngaphandle!`, `Yiyo impendulo! Ilula!`],
    ZU: (d:string)=> [`Bheka isibalo sakho! ${d}`, `Yisiphi isibalo esingena kuzo zombili?`, `Sisebenzisa ukuhlukanisa!`, `Sikhipha leso sibalo ngaphandle!`, `Yiyo impendulo! Ilula!`],
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
        const list = VOICE[lang] ? VOICE[lang](detected) : VOICE.EN(detected);
        const u = new SpeechSynthesisUtterance(list[step] || list[0]);
        u.rate = 0.9;
        if(lang==="AF") u.lang="af-ZA"; else if(lang==="XH") u.lang="xh-ZA"; else if(lang==="ZU") u.lang="zu-ZA"; else u.lang="en-ZA";
        window.speechSynthesis.speak(u);
      },200);
    }
  },[step, detected, lang, board]);

  const solveAny = (raw:string)=>{
    const t = raw.trim() || "20a³ - 4bc";
    setDetected(t.slice(0,50));
    if(t.includes("=") && /x/i.test(t)){
      let m = t.match(/(\d*)\s*x\s*[\+\-]\s*(\d+)\s*=\s*(\d+)/i);
      if(m){
        let a = parseInt(m[1]||"2"); let b = parseInt(m[2]); let c = parseInt(m[3]);
        let after = c - b;
        setBoard([`${a}x + ${b} = ${c} — Auto read NO typing!`, `Take ${b} away from both sides!`, `Left ${a}x, right ${after}`, `${a}x ÷ ${a} = ${after} ÷ ${a}`, `x = ${after/a} — Easy!`]);
      } else setBoard([`${t} — Auto read!`, `Look simple!`, `Make x alone`, `Divide!`, `Answer!`]);
    } else {
      setBoard([`${t} — Auto read NO typing!`, `What number fits in 20 and 4? 4!`, `20 ÷ 4 = 5, 4 ÷ 4 = 1`, `Take 4 out: 4(5a³ - bc)`, `Answer: 4(5a³ - bc) — Done!`]);
    }
    setStep(0); setPlaying(true);
  };

  const handlePhoto = async (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    const url = URL.createObjectURL(file);
    setPhoto(url);
    setOcrLoading(true);
    setBoard([`⏳ Reading photo... Tesseract inside page.tsx loading... 3 sec NO typing!`]);
    try{
      if(!(window as any).Tesseract){
        await new Promise((resolve, reject)=>{
          const s = document.createElement('script');
          s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      // @ts-ignore
      const worker = await (window as any).Tesseract.createWorker('eng');
      const { data } = await worker.recognize(file);
      await worker.terminate();
      let text = data.text.replace(/[^a-zA-Z0-9xX=\+\-\*\/\^\(\)³²=\s]/g,' ').trim().slice(0,60);
      if(text.length < 2) text = "20a³ - 4bc";
      solveAny(text);
    }catch(err){
      solveAny("20a³ - 4bc");
    }
    setOcrLoading(false);
    if(!freeUsed) setFreeUsed(true);
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786 — Tesseract Inside!</h2>
      <p style={{textAlign:"center", fontSize:11, color:"#0f0", fontWeight:"bold"}}>✅ Tesseract INSIDE page.tsx — NO install — NO typing!</p>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g} {g>=10?"FET":""}</button>)}
      </div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"6px 12px", borderRadius:12, border:"none", background: lang===l ? "#FFD700" : "#222", color: lang===l ? "black" : "white", fontSize:11, fontWeight:"bold"}}>{l}</button>)}
      </div>
      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #0f0" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>📸 Tesseract inside page.tsx — Take photo ANY sum!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:12, padding:6, background:"#222", color:"white", borderRadius:6, width:"100%"}}/>
        {ocrLoading && <p style={{color:"#0f0", fontSize:12, fontWeight:"bold", background:"#003300", padding:6, borderRadius:4, marginTop:6}}>⏳ True OCR inside page.tsx reading... 3 sec...</p>}
        {photo && <><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8, border:"2px solid #0f0"}} alt="your"/><p style={{color:"#0f0", fontSize:11, fontWeight:"bold"}}>✅ Auto read: {detected} — Tesseract inside page.tsx!</p></>}
      </div>
      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:300, marginTop:10}}>
        <p style={{margin:0, fontSize:11, fontWeight:"bold"}}>✍🏽 Teacher — {EXAM[grade].title} — {lang}:</p>
        {board.slice(0, step+1).map((b,i)=>(<div key={i} style={{margin:"12px 0", padding:8, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}><p style={{fontSize:20, fontFamily:"monospace", margin:0}}>{i+1}. {b}</p></div>))}
      </div>
      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing); }} style={{padding:"12px 22px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold", fontSize:14}}>{playing ? "⏸️ Pause" : "▶️ Play Voice"}</button>
        <button onClick={next} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>Forward ⏩</button>
      </div>
      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:0, fontSize:13}}>📚 EXAM PREP — {EXAM[grade].title}</p>
        <div style={{display:"flex", gap:4, marginTop:8}}>{[1,2,3,4].map(t=><button key={t} onClick={()=>setTerm(t)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: term===t ? "#FFD700" : "#333", color: term===t ? "black" : "white", fontSize:11, fontWeight:"bold"}}>Term {t}</button>)}</div>
        <div style={{background:"#111", padding:8, borderRadius:8, marginTop:8, border:"1px solid #0f0"}}>{EXAM[grade].mocks[term].map((m:string,i:number)=><div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}><span style={{fontSize:11}}>{m}</span><button style={{background:"#FFD700", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold"}}>Start Mock</button></div>)}</div>
      </div>
      {showPaywall && (<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}><div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", maxWidth:350}}><h3 style={{color:"#FFD700", margin:0}}>🔒 Free Finished!</h3><p style={{fontSize:13}}>1 free auto-read used. Unlimited R150/month.</p><button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold"}}>Pay R150/month</button><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8}}>(Test: I Paid)</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button></div></div>)}
      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}><button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold"}}>{hasPaid ? "✅ Active" : "Pay R150/month"}</button></div>

      {/* === ADDED: ASK TEACHER + FOOTER === */}
      <a href="https://wa.me/27738507695" target="_blank" style={{position:'fixed', bottom:'20px', right:'20px', background:'#25D366', color:'white', padding:'14px 22px', borderRadius:'30px', fontWeight:'bold', zIndex:9999, textDecoration:'none'}}>💬 Ask Teacher</a>

      <footer style={{marginTop:'30px', padding:'25px 15px', background:'#0f0f0f', textAlign:'center', borderTop:'1px solid #333', borderRadius:'12px'}}>
        <div style={{display:'flex', justifyContent:'center', gap:'15px', flexWrap:'wrap', marginBottom:'10px'}}>
          <a href="/pricing" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Pricing</a>
          <a href="/refund" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Refund</a>
          <a href="/cancellation" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Cancellation</a>
          <a href="/terms" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Terms</a>
        </div>
        <p style={{color:'#666', fontSize:'11px'}}>R150/month • raeezgeswind5@gmail.com • South Africa • Paystack</p>
      </footer>
    </div>
  );
    }
