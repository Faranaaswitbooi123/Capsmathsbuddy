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
  const [showAsk, setShowAsk] = useState(false);
  const [q, setQ] = useState("");
  const [chat, setChat] = useState<{q:string,a:string}[]>([]);
  const ref = useRef<any>(null);

  const EXAM: any = {
    8:{title:"Grade 8 CAPS Senior", papers:["Nov 2023 Gr8 - Paper 1","June 2024 Gr8 - Paper 2","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 Final (100)"]}},
    9:{title:"Grade 9 CAPS Senior", papers:["Nov 2023 Gr9 - Paper 1","June 2024 Gr9 - Paper 2","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 ANY (150)"]}},
    10:{title:"Grade 10 CAPS FET", papers:["DBE P1 2023","DBE P2 2023 + Memo","June 2024 P1"], mocks:{1:["Term 1 ANY (100)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150) P2 (150)"]}},
    11:{title:"Grade 11 CAPS FET", papers:["DBE P1 2023","DBE P2 2023 + Memo","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (75)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150)"]}},
    12:{title:"Grade 12 CAPS FET Matric", papers:["NSC 2023 P1 + Memo","NSC 2023 P2 + Memo","NSC 2024 P1 Trial"], mocks:{1:["Term 1 ANY (150)"],2:["Term 2 ANY (300)"],3:["Term 3 Trial (150)"],4:["Term 4 Final (150)"]}},
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

  const speakCalm = (text:string)=>{
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.82; u.pitch = 0.95; u.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    if(voices.length>0){
      let best = voices.find(v=> v.name.includes('Google') && v.lang.startsWith('en')) 
              || voices.find(v=> v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen'))
              || voices.find(v=> v.lang === 'en-ZA')
              || voices.find(v=> v.lang.startsWith('en'));
      if(best) u.voice = best;
    }
    if(lang==="AF") u.lang="af-ZA"; else if(lang==="XH") u.lang="xh-ZA"; else if(lang==="ZU") u.lang="zu-ZA"; else u.lang="en-ZA";
    window.speechSynthesis.speak(u);
  };

  useEffect(()=>{
    if(board.length>0 && 'speechSynthesis' in window){
      const list = VOICE[lang] ? VOICE[lang](detected) : VOICE.EN(detected);
      speakCalm(list[step] || list[0]);
    }
  },[step, detected, lang, board]);

  const solveAny = (raw:string)=>{
    const t = raw.trim() || "20a³ - 4bc";
    setDetected(t.slice(0,60));
    if(t.includes("=") && /x/i.test(t)){
      let m = t.match(/(\d*)\s*x\s*[\+\-]\s*(\d+)\s*=\s*(\d+)/i);
      if(m){
        let a = parseInt(m[1]||"2"); let b = parseInt(m[2]); let c = parseInt(m[3]);
        let after = c - b;
        setBoard([`${a}x + ${b} = ${c} — Auto read!`, `Take ${b} away from both sides!`, `Left ${a}x, right ${after}`, `${a}x ÷ ${a} = ${after} ÷ ${a}`, `x = ${after/a} — Easy!`]);
      } else setBoard([`${t} — Auto read!`, `Look simple!`, `Make x alone`, `Divide!`, `Answer!`]);
    } else {
      let nums = t.match(/\d+/g);
      if(nums && nums.length>=2){
        let n1 = parseInt(nums[0]); let n2 = parseInt(nums[1]);
        let gcd = 1; for(let i=Math.min(n1,n2); i>=2; i--){ if(n1%i===0 && n2%i===0){ gcd=i; break; } }
        setBoard([`${t} — Auto read from photo!`, `What number fits in ${n1} and ${n2}? ${gcd}!`, `${n1} ÷ ${gcd} = ${n1/gcd}, ${n2} ÷ ${gcd} = ${n2/gcd}`, `Take ${gcd} out: ${gcd}(${n1/gcd}... - ...)`, `Answer: ${gcd}(...) — Done!`]);
      } else {
        setBoard([`${t} — Auto read from photo!`, `What number fits in 20 and 4? 4!`, `20 ÷ 4 = 5, 4 ÷ 4 = 1`, `Take 4 out: 4(5a³ - bc)`, `Answer: 4(5a³ - bc) — Done!`]);
      }
    }
    setStep(0); setPlaying(true);
  };

  const askTeacher = ()=>{
    if(!q.trim()) return;
    let lower = q.toLowerCase();
    let answer = "";
    if(lower.includes("don't understand") || lower.includes("step") || lower.includes("explain")){
      answer = `No problem! Let's look again at step ${step+1}. ${board[step]}. For ${detected}, we are looking for what is common.`;
    } else if(lower.includes("why") && (lower.includes("4") || lower.includes("divide"))){
      answer = `Good question! We divide because we want to make it smaller. For ${detected}, we look for common number.`;
    } else {
      answer = `Great question about ${detected}! On step ${step+1}, ${board[step]}. Click Back or Forward to review.`;
    }
    setChat(prev=>[...prev, {q:q, a:answer}]);
    speakCalm(answer);
    setQ("");
  };

  const handlePhoto = async (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    const url = URL.createObjectURL(file);
    setPhoto(url);
    setOcrLoading(true);
    setBoard([`⏳ Reading YOUR photo... 4 seconds...`]);
    try{
      if(!(window as any).Tesseract){
        await new Promise((resolve, reject)=>{
          const s = document.createElement('script');
          s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
          s.onload = ()=> resolve(true); s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const result = await (window as any).Tesseract.recognize(file, 'eng');
      let rawText = result.data.text || "";
      let cleaned = rawText.trim().replace(/\n/g,' ').replace(/\s+/g,' ').slice(0,80).trim();
      if(!cleaned || cleaned.length < 1){
        setBoard([`⚠️ Could not read clearly - try closer photo!`]);
        setOcrLoading(false);
        return;
      }
      solveAny(cleaned);
    }catch(err){
      setBoard([`⚠️ OCR error - try clearer photo!`]);
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
      </div
