"use client";
import { useState, useRef, useEffect } from "react";

export default function CapsBuddy786() {
  const [lang, setLang] = useState("EN");
  const [grade, setGrade] = useState("10");
  const [image, setImage] = useState<string | null>(null);
  const [solving, setSolving] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [uses, setUses] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // SCHOOL LANGUAGE — minus, plus, times, divided by, equals
  const sayMaths = (t: string) => {
    return t
      .replace(/-/g, " minus ")
      .replace(/\+/g, " plus ")
      .replace(/\*/g, " times ")
      .replace(/x/g, " times x ")
      .replace(/\//g, " divided by ")
      .replace(/=/g, " equals ");
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const clean = sayMaths(text);
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 0.8; // SLOW for learners
    u.lang = lang === "AF" ? "af-ZA" : lang === "XH" ? "xh-ZA" : "en-ZA";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const translations: any = {
    EN: { title: "CAPS MATHS BUDDY 786", sub: "Made in SA for SA Learners", take: "Take Photo of Homework", solving: "Sharp! Let me solve...", unlock: "Unlock Full Solving - R150 per month", free: "1st sum FREE — try me!" },
    AF: { title: "CAPS MATHS BUDDY 786", sub: "Gemaak in SA vir SA Leerders", take: "Neem Foto van Huiswerk", solving: "Lekker! Kom ek wys jou...", unlock: "Ontsluit Volledig - R150 per maand", free: "1ste som GRATIS!" },
    XH: { title: "CAPS MATHS BUDDY 786", sub: "Yenzelwe eMzantsi Afrika", take: "Thatha Ifoto Yomsebenzi", solving: "Sharp! Mandikubonise...", unlock: "Vula Yonke - R150 ngenyanga", free: "Isibalo sokuqala SIMAHLA!" },
    ZU: { title: "CAPS MATHS BUDDY 786", sub: "Yenzelwe eNingizimu Afrika", take: "Thatha Isithombe Somsebenzi", solving: "Sharp! Ake ngikubonise...", unlock: "Vula Konke - R150 ngenyanga", free: "Isibalo sokuqala MAHHALA!" }
  };
  const t = translations[lang];

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      startSolving();
    };
    reader.readAsDataURL(file);
  };

  const startSolving = () => {
    if (!isPaid && uses >= 1) return; // PAYWALL
    setSolving(true);
    setSteps([]);
    setCurrentStep(0);
    
    // Example solving — this will be your AI logic
    const demoSteps = [
      "Yo! Sharp! We wanna find x",
      "We have: 2 times x plus 3 equals 11",
      "Minus 3 both sides",
      "2 times x equals 8",
      "Divided by 2 both sides",
      "x equals 4 — Boom! We got it!"
    ];
    
    setSteps(demoSteps);
    setUses(u => u+1);
    
    // Slow hand writing simulation
    let i = 0;
    const interval = setInterval(() => {
      if (i < demoSteps.length) {
        setCurrentStep(i);
        speak(demoSteps[i]);
        i++;
      } else {
        clearInterval(interval);
        setSolving(false);
      }
    }, 3500); // 3.5 sec per step = SLOW
  };

  const handlePay = () => {
    // Replace with your Paystack link
    window.location.href = "https://paystack.com/pay/caps786-monthly";
    // For testing, uncomment next line:
    // setIsPaid(true);
  };

  return (
    <div style={{minHeight:"100vh", background:"#0a0a0a", color:"white", padding:"16px", fontFamily:"system-ui"}}>
      <div style={{maxWidth:500, margin:"0 auto"}}>
        {/* HEADER */}
        <div style={{textAlign:"center", marginBottom:20}}>
          <h1 style={{fontSize:22, fontWeight:900, margin:0}}>{t.title}</h1>
          <p style={{color:"#22c55e", fontSize:13, margin:0}}>{t.sub} | Grade 8-12 CAPS</p>
        </div>

        {/* CONTROLS */}
        <div style={{display:"flex", gap:8, marginBottom:16}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{flex:1, padding:10, borderRadius:8, background:"#1a1a1a", color:"white", border:"1px solid #333"}}>
            <option value="EN">English</option><option value="AF">Afrikaans</option><option value="XH">isiXhosa</option><option value="ZU">isiZulu</option>
          </select>
          <select value={grade} onChange={e=>setGrade(e.target.value)} style={{flex:1, padding:10, borderRadius:8, background:"#1a1a1a", color:"white", border:"1px solid #333"}}>
            <option>Grade 8</option><option>Grade 9</option><option>Grade 10</option><option>Grade 11</option><option>Grade 12</option>
          </select>
        </div>

        {/* FREE BADGE */}
        <div style={{background:"#22c55e22", border:"1px solid #22c55e", padding:8, borderRadius:8, textAlign:"center", fontSize:12, marginBottom:16}}>{t.free}</div>

        {/* CAMERA */}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{display:"none"}} />
        <button onClick={()=>fileRef.current?.click()} style={{width:"100%", padding:20, background:"white", color:"black", fontWeight:800, borderRadius:12, fontSize:18, border:"none"}}>
          📸 {t.take}
        </button>

        {image && <img src={image} style={{width:"100%", marginTop:12, borderRadius:12, border:"2px solid #333"}} />}

        {/* PAYWALL */}
        {!isPaid && uses >= 1 && (
          <div style={{marginTop:20, background:"#1a1a1a", border:"2px solid #facc15", padding:16, borderRadius:12, textAlign:"center"}}>
            <h3 style={{margin:"0 0 8px 0"}}>🔒 {t.unlock}</h3>
            <p style={{fontSize:12, color:"#aaa"}}>Whole South Africa - Cancel anytime</p>
            <button onClick={handlePay} style={{width:"100%", marginTop:10, padding:14, background:"#facc15", color:"black", fontWeight:900, borderRadius:8, border:"none", fontSize:16}}>
              Pay R150 per month with Paystack
            </button>
          </div>
        )}

        {/* HAND WRITING BOARD */}
        {steps.length > 0 && (
          <div style={{marginTop:20, background:"#fefce8", color:"black", borderRadius:12, padding:16, minHeight:200, position:"relative"}}>
            <div style={{fontSize:11, color:"#888"}}>✍🏽 Teacher writing slow...</div>
            {steps.slice(0, currentStep+1).map((s, idx)=>(
              <div key={idx} style={{
                fontSize:18, 
                fontWeight: idx===currentStep ? 900 : 400,
                marginTop:12,
                opacity: idx===currentStep ? 1 : 0.7,
                transition:"all 0.5s",
                fontFamily:"cursive"
              }}>
                {idx===currentStep ? "✍🏽 " : "✓ "}{s}
              </div>
            ))}
            <div style={{marginTop:16, fontSize:12, background:"#000", color:"#0f0", padding:8, borderRadius:6, fontFamily:"monospace"}}>
              Speaking: {sayMaths(steps[currentStep] || "")}
            </div>
          </div>
        )}

        <p style={{textAlign:"center", fontSize:10, color:"#555", marginTop:20}}>786 • Made in Kariega, Eastern Cape • For Whole SA • R150/month</p>
      </div>
    </div>
  );
}
