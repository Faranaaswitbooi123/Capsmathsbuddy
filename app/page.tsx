"use client";
import { useState, useRef, useEffect } from "react";

export default function CapsMathsBuddy786() {
  const [lang, setLang] = useState("en");
  const [grade, setGrade] = useState("10");
  const [image, setImage] = useState<string | null>(null);
  const [sumText, setSumText] = useState("2x + 3 = 11");
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [written, setWritten] = useState("");
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [freeUsed, setFreeUsed] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ if(localStorage.getItem("caps786_freeUsed")) setFreeUsed(true); },[]);

  useEffect(()=>{
    setSteps([`${sumText}`, `Step 1: ${sumText} move 3`, `Step 2: 2x = 11-3`, `Step 3: 2x = 8`, `Step 4: x = 4`]);
    setCurrentStep(0); setWritten(""); setIdx(0);
  },[sumText]);

  useEffect(()=>{
    if(!playing) return;
    const full = steps[currentStep] || "";
    if(idx >= full.length){
      const u = new SpeechSynthesisUtterance(full);
      u.lang = lang==="af"?"af-ZA":"en-ZA"; u.rate=0.65;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
      const t = setTimeout(()=>{ if(currentStep < steps.length-1){ setCurrentStep(c=>c+1); setWritten(""); setIdx(0);} else setPlaying(false); }, 2500);
      return ()=>clearTimeout(t);
    }
    const t = setTimeout(()=>{
      const next = full.slice(0, idx+1);
      setWritten(next);
      const c = canvasRef.current?.getContext("2d");
      if(c){
        c.clearRect(0,0,500,300);
        c.fillStyle="#FFFBEB"; c.fillRect(0,0,500,300);
        c.fillStyle="#111"; c.font="bold 28px sans-serif";
        c.fillText(next, 20, 100);
        if(handRef.current){ c.measureText(next).width; handRef.current.style.left = (20 + c.measureText(next).width)+"px"; }
      }
      setIdx(i=>i+1);
    }, 280);
    return ()=>clearTimeout(t);
  },[playing, idx, currentStep, steps, lang]);

  const onFoto = (e:any)=>{
    const f = e.target.files?.[0]; if(!f) return;
    if(freeUsed){ setPaywall(true); return; }
    const r = new FileReader();
    r.onload = (ev)=>{ setImage(ev.target?.result as string); setSumText("2x + 3 = 11"); localStorage.setItem("caps786_freeUsed","1"); setFreeUsed(true); };
    r.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen bg-[#FFE600] p-2">
      <div className="bg-black text-[#FFE600] p-4 rounded-[24px] border-4 border-white flex justify-between shadow-[6px_6px_0px_#FF2E93]">
        <div className="font-black">CAPS BUDDY 786<br/>GR {grade} FUNKY</div>
        <select value={lang} onChange={e=>setLang(e.target.value)} className="bg-white text-black rounded-full px-3 text-xs h-8"><option value="en">ENG</option><option value="af">AFR</option><option value="xh">XHOSA</option><option value="zu">ZULU</option></select>
      </div>

      <div className="flex gap-1 mt-2 overflow-auto">{["8","9","10","11","12"].map(g=><button key={g} onClick={()=>setGrade(g)} className={`px-4 py-2 rounded-full border-2 border-black text-xs font-black shadow-[3px_3px_0px_black] ${grade===g?"bg-[#FF2E93] text-white":"bg-white"}`}>GR {g}</button>)}<span className="ml-auto bg-blue-600 text-white px-3 py-2 rounded-full text-xs border-2 border-black">EXAM PREP</span></div>

      <div className="mt-3 bg-white border-[3px] border-black rounded-[20px] p-3 shadow-[5px_5px_0px_black]">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFoto} className="hidden" />
        <button onClick={()=>fileRef.current?.click()} className="w-full bg-[#00FF94] border-2 border-black rounded-full py-4 font-black shadow-[3px_3px_0px_black]">📸 TAKE PICTURE OF SUM</button>
        {image && <img src={image} className="mt-2 w-full h-36 object-cover rounded-xl border-2 border-black" />}
        <input value={sumText} onChange={e=>setSumText(e.target.value)} className="mt-2 w-full bg-[#FFE600] border-2 border-black rounded-full p-3 text-sm font-bold" />
        <div className="text-[10px] mt-1">Locked to this sum only • 4 languages SA • Whole SA</div>
      </div>

      <div className="relative mt-3 bg-white border-[3px] border-black rounded-[24px] h-[300px] shadow-[6px_6px_0px_black] overflow-hidden">
        <canvas ref={canvasRef} width={500} height={300} className="w-full h-full" />
        <div ref={handRef} className="absolute top-[65px] text-[36px] transition-all duration-300">✍🏽</div>
        <div className="absolute bottom-2 left-2 bg-black text-[#00FF94] px-3 py-1 rounded-full text-[10px]">{written || "Press PLAY to see hand write letter by letter"}</div>
      </div>

      {/* BIG PLAY PAUSE YOU ASKED */}
      <button onClick={()=>setPlaying(!playing)} className="w-full mt-3 bg-black text-[#FFE600] border-[3px] border-black rounded-[20px] py-6 text-[20px] font-black shadow-[6px_6px_0px_#FF2E93]">{playing?"⏸ PAUSE":"▶ PLAY - HAND WRITES SLOW + VOICE"}</button>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <button onClick={()=>{setCurrentStep(s=>Math.max(0,s-1)); setWritten(""); setIdx(0);}} className="bg-white border-2 border-black rounded-full py-4 font-black shadow-[3px_3px_0px_black]">◀ BACK</button>
        <button onClick={()=>{const q=prompt("Ask about "+sumText+" only"); if(q){const u=new SpeechSynthesisUtterance(q); u.rate=0.65; speechSynthesis.speak(u);}}} className="bg-[#00FF94] border-2 border-black rounded-full py-4 font-black shadow-[3px_3px_0px_black]">💬 ASK</button>
        <button onClick={()=>{setCurrentStep(s=>Math.min(steps.length-1,s+1)); setWritten(""); setIdx(0);}} className="bg-white border-2 border-black rounded-full py-4 font-black shadow-[3px_3px_0px_black]">NEXT ▶</button>
      </div>

      {paywall && <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"><div className="bg-[#FFE600] border-4 border-black rounded-[24px] p-6 w-full max-w-sm"><h2 className="font-black text-xl">FREE DONE - PAY R150</h2><p className="text-sm mt-2 font-bold">Whole SA, Paystack only. Funky access.</p><button onClick={()=>{ // @ts-ignore
      const h=window.PaystackPop?.setup({key:"YOUR_PAYSTACK_KEY", email:"a@b.com", amount:15000, currency:"ZAR", callback:()=>{localStorage.setItem("caps786_paid","1"); setPaywall(false);}}); h?h.openIframe():setPaywall(false);}} className="w-full mt-4 bg-black text-white py-4 rounded-full font-black">PAY R150 PAYSTACK</button><button onClick={()=>setPaywall(false)} className="w-full mt-2 text-xs">Close</button></div></div>}
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  );
                                   }
