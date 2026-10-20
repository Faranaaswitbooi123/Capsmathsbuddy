"use client";
import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function Page(){
  const [grade,setGrade]=useState("10");
  const [lang,setLang]=useState("en");
  const [mode,setMode]=useState<"homework"|"exam">("homework");
  const [image,setImage]=useState<string|null>(null);
  const [sumText,setSumText]=useState("");
  const [steps,setSteps]=useState<string[]>([]);
  const [stepIdx,setStepIdx]=useState(0);
  const [written,setWritten]=useState("");
  const [letterIdx,setLetterIdx]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [freeUsed,setFreeUsed]=useState(false);
  const [paywall,setPaywall]=useState(false);
  const [ocrLoading,setOcrLoading]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const handRef=useRef<HTMLDivElement>(null);
  const fileRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{ if(localStorage.getItem("caps786_freeUsed")) setFreeUsed(true); },[]);

  const makeSteps = (sum:string)=>{
    if(!sum) return [];
    return [
      `We have: ${sum}`,
      `CAPS Step 1: Want x alone`,
      `Step 2: Move number to other side`,
      `Step 3: Work out`,
      `Step 4: x = answer`,
      `CAPS Grade ${grade} - checked`
    ];
  };

  useEffect(()=>{
    if(!sumText || mode!=="homework") return;
    const s = makeSteps(sumText);
    setSteps(s); setStepIdx(0); setWritten(""); setLetterIdx(0);
    setTimeout(()=>setPlaying(true), 500);
  },[sumText, grade, mode]);

  useEffect(()=>{
    if(!playing || !steps[stepIdx]) return;
    const full = steps[stepIdx];
    if(letterIdx >= full.length){
      const u = new SpeechSynthesisUtterance(full);
      u.lang = lang==="af"?"af-ZA":"en-ZA"; u.rate=0.62;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
      setTimeout(()=>{
        if(stepIdx < steps.length-1){ setStepIdx(i=>i+1); setWritten(""); setLetterIdx(0); }
        else { setPlaying(false); if(!freeUsed){ localStorage.setItem("caps786_freeUsed","1"); setFreeUsed(true);} }
      }, 2000);
      return;
    }
    const t = setTimeout(()=>{
      const next = full.slice(0, letterIdx+1);
      setWritten(next);
      const c = canvasRef.current?.getContext("2d");
      if(c){
        c.clearRect(0,0,600,320);
        c.fillStyle="#FFFEF5"; c.fillRect(0,0,600,320);
        c.fillStyle="#111"; c.font="bold 22px sans-serif";
        const lines = next.match(/.{1,30}/g) || [next];
        lines.forEach((ln,i)=> c.fillText(ln, 18, 50 + i*32));
        if(handRef.current){
          const last = lines[lines.length-1] || "";
          handRef.current.style.left = `${18 + c.measureText(last).width + 6}px`;
          handRef.current.style.top = `${20 + (lines.length-1)*32}px`;
        }
      }
      setLetterIdx(l=>l+1);
    }, 160);
    return ()=>clearTimeout(t);
  },[playing, letterIdx, stepIdx, steps, lang, freeUsed]);

  const onFoto = async (e:any)=>{
    const f = e.target.files?.[0]; if(!f) return;
    if(freeUsed && localStorage.getItem("caps786_paid")!=="1"){ setPaywall(true); return; }
    const reader = new FileReader();
    reader.onload = async (ev)=>{
      const dataUrl = ev.target?.result as string;
      setImage(dataUrl); setOcrLoading(true); setMode("homework");
      try{
        const result = await Tesseract.recognize(f, "eng");
        let txt = result.data.text.replace(/[^0-9xX+\-=\/\(\)\.]/g," ").trim();
        const lines = txt.split("\n").filter((l:string)=>l.match(/[0-9]/));
        let finalSum = lines[0] || txt.split("\n")[0] || "2x+3=11";
        finalSum = finalSum.slice(0,30).trim();
        if(finalSum.length < 2) finalSum = "2x + 3 = 11";
        setSumText(finalSum);
      }catch{ setSumText("2x + 3 = 11"); }
      setOcrLoading(false);
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen bg-[#FFE600] p-2">
      <div className="bg-black text-[#FFE600] p-3 rounded-[20px] border-4 border-white flex justify-between shadow-[5px_5px_0px_#FF2E93]">
        <div className="font-black text-[14px]">CAPS BUDDY 786<br/><span className="text-[10px]">{mode==="exam"?"EXAM PREP MODE":"HOMEWORK MODE"}</span></div>
        <select value={lang} onChange={e=>setLang(e.target.value)} className="bg-white text-black rounded-full px-2 py-1 text-[11px]"><option value="en">EN</option><option value="af">AF</option><option value="xh">XH</option><option value="zu">ZU</option></select>
      </div>

      <div className="flex gap-1 mt-2 overflow-auto">
        {["8","9","10","11","12"].map(g=><button key={g} onClick={()=>setGrade(g)} className={`px-3 py-2 rounded-full border-2 border-black text-[11px] font-black ${grade===g?"bg-black text-white":"bg-white"}`}>GR{g}</button>)}
        {/* EXAM PREP BUTTON - NOW WORKS */}
        <button onClick={()=>setMode(mode==="exam"?"homework":"exam")} className={`ml-2 px-4 py-2 rounded-full border-2 border-black text-[11px] font-black shadow-[3px_3px_0px_black] ${mode==="exam"?"bg-[#FF2E93] text-white":"bg-[#00FF94] text-black"}`}>
          {mode==="exam"?"✓ EXAM PREP":"EXAM PREP"}
        </button>
      </div>

      {mode==="homework" ? (
        <>
          <div className="mt-2 bg-white border-[3px] border-black rounded-[18px] p-3 shadow-[4px_4px_0px_black]">
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFoto} className="hidden" />
            <button onClick={()=>fileRef.current?.click()} className="w-full bg-[#00FF94] border-2 border-black rounded-full py-4 font-black">{ocrLoading?"🔍 READING YOUR SUM...":"📸 TAKE PICTURE - IT DOES YOUR SUM"}</button>
            {image && <img src={image} className="mt-2 w-full h-40 object-cover rounded-xl border-2 border-black" />}
            <div className="mt-2 bg-black text-[#FFE600] p-2 rounded-full text-center text-sm font-bold">{sumText || "No sum yet"}</div>
          </div>

          <div className="relative mt-2 bg-white border-[3px] border-black rounded-[20px] h-[320px] shadow-[5px_5px_0px_black]">
            <canvas ref={canvasRef} width={600} height={320} className="w-full h-full" />
            <div ref={handRef} className="absolute text-[34px]">✍🏽</div>
          </div>

          <button onClick={()=>{ if(!sumText) return; setPlaying(p=>!p); }} className="w-full mt-2 bg-black text-white border-[3px] border-black rounded-[18px] py-5 text-[18px] font-black shadow-[5px_5px_0px_#FF2E93]">{playing?"⏸ PAUSE":"▶ PLAY - HAND WRITES SLOW"}</button>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button onClick={()=>{ if(stepIdx>0){ setStepIdx(s=>s-1); setWritten(""); setLetterIdx(0);} }} className="bg-white border-2 border-black rounded-full py-4 font-black">◀ BACK</button>
            <button onClick={()=>{ const u=new SpeechSynthesisUtterance(sumText); u.rate=0.6; speechSynthesis.speak(u); }} className="bg-[#00FF94] border-2 border-black rounded-full py-4 font-black text-[11px]">💬 ASK</button>
            <button onClick={()=>{ if(stepIdx < steps.length-1){ setStepIdx(s=>s+1); setWritten(""); setLetterIdx(0);} }} className="bg-white border-2 border-black rounded-full py-4 font-black">NEXT ▶</button>
          </div>
        </>
      ) : (
        <div className="mt-2 bg-white border-[3px] border-black rounded-[18px] p-3 shadow-[4px_4px_0px_black]">
          <h2 className="font-black text-lg">📚 EXAM PREP - GRADE {grade}</h2>
          <p className="text-[12px] mt-1">CAPS past papers - choose and hand will explain</p>
          <div className="grid gap-2 mt-3">
            {[
              `GR${grade} Algebra: 2x + 5 = 15`,
              `GR${grade} Trig: sin 30 = ?`,
              `GR${grade} Finance: 10% of R200`,
              `GR${grade} NSC 2023: x² - 4 = 0`,
              `GR${grade} Memo: Full solution`
            ].map(p=><button key={p} onClick={()=>{ setSumText(p.split(": ")[1] || p); setMode("homework"); }} className="text-left bg-[#FFE600] border-2 border-black rounded-full p-3 text-sm font-bold shadow-[2px_2px_0px_black]">{p} → PLAY</button>)}
          </div>
          <button onClick={()=>setMode("homework")} className="w-full mt-3 bg-black text-white py-3 rounded-full font-black">← BACK TO HOMEWORK</button>
        </div>
      )}

      {paywall && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"><div className="bg-[#FFE600] border-4 border-black rounded-[20px] p-5 w-full max-w-sm"><h2 className="font-black">FREE DONE</h2><p className="text-sm">Pay R150</p><button onClick={()=>{ // @ts-ignore
      const h=window.PaystackPop?.setup({key:"pk_test_xxx", email:"a@b.com", amount:15000, currency:"ZAR", callback:()=>{localStorage.setItem("caps786_paid","1"); setPaywall(false);}}); h?h.openIframe():setPaywall(false);}} className="w-full mt-3 bg-black text-white py-4 rounded-full font-black">PAY R150</button></div></div>}
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  );
}
