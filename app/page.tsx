"use client";
import { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";

const LANGS = {
  en: { code:"en-ZA", name:"English", back:"Back", next:"Next", play:"Play", replay:"Replay", ask:"Ask", exam:"Exam Prep + Mock Tests - Whole SA", free:"1 FREE sum then R150 PLUS", parent:"Parent WhatsApp", unlock:"Unlock PLUS R150", explain:"DBE TV Explain in English" },
  af: { code:"af-ZA", name:"Afrikaans", back:"Terug", next:"Volgende", play:"Speel", replay:"Herhaal", ask:"Vra", exam:"Eksamen + Mock Toetse - Heel SA", free:"1 GRATIS dan R150 PLUS", parent:"Ouer WhatsApp", unlock:"Ontsluit PLUS R150", explain:"Verduidelik in Afrikaans" },
  xh: { code:"xh-ZA", name:"isiXhosa", back:"Emva", next:"Phambili", play:"Dlala", replay:"Phinda", ask:"Buza", exam:"Ulungiselelo + Mock Tests - Whole SA", free:"1 SIMAHLA then R150 PLUS", parent:"WhatsApp yomzali", unlock:"Vula PLUS R150 - 786", explain:"Ichaza ngesiXhosa q,c,x - xh-ZA" },
  zu: { code:"zu-ZA", name:"isiZulu", back:"Emuva", next:"Phambili", play:"Dlala", replay:"Phinda", ask:"Buza", exam:"Ukulungiselela + Mock Tests - Whole SA", free:"1 MAHHALA then R150 PLUS", parent:"WhatsApp yomzali", unlock:"Vula PLUS R150 - 786", explain:"Ichaza ngesiZulu - zu-ZA" },
};

const MOCKS = [
  { id:"g8", grade:"Gr 8 Mock - 50 marks", q:"1. Simplify 3x+2x 2. Solve x+5=12", memo:["5x","x=7"], marks:50, time:60 },
  { id:"g9", grade:"Gr 9 Mock - 60 marks", q:"Factorise x²-9", memo:["(x-3)(x+3)"], marks:60, time:60 },
  { id:"g10", grade:"Gr 10 Mock - 100 marks", q:"Solve 2x²-5x-3=0", memo:["Δ=49","x=3 or -0.5"], marks:100, time:120 },
  { id:"g11", grade:"Gr 11 Mock - 125 marks", q:"Trig Prove sin²+cos²=1", memo:["Unit circle","=1"], marks:125, time:150 },
  { id:"g12", grade:"Gr 12 Mock P1 - 150 marks NSC", q:"Finance R5000 at 8% 3 years", memo:["A=6298.56"], marks:150, time:180 },
];

function Handwriting({ text, trigger }:{text:string, trigger:number}){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c=ref.current!; if(!c) return; const ctx=c.getContext('2d')!;
    const dpr=2; c.width=c.offsetWidth*dpr; c.height=180*dpr; ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,9999,9999); ctx.font="22px Caveat, cursive"; ctx.fillStyle="#1a237e";
    let i=0; const draw=()=>{ if(i>=text.length) return; ctx.fillText(text[i],15+(i*10)%(c.offsetWidth-30),32+Math.floor((i*10)/(c.offsetWidth-30))*32); i++; setTimeout(draw,40); }; draw();
  },[trigger,text]);
  return <canvas ref={ref} className="w-full h-[180px] bg-[#fffde7] rounded-xl border-2 border-yellow-200"/>;
}

export default function Page(){
  const [lang,setLang]=useState<keyof typeof LANGS>("en");
  const [step,setStep]=useState(0);
  const [trigger,setTrigger]=useState(0);
  const [ocr,setOcr]=useState("2(x-3)=4x+10");
  const [loading,setLoading]=useState(false);
  const [freeUsed,setFreeUsed]=useState(false);
  const [paid,setPaid]=useState(false);
  const [parent,setParent]=useState("");
  const [mockOpen,setMockOpen]=useState<any>(null);
  const t=(LANGS as any)[lang];
  const STEPS=["786 | caps Maths buddy | "+ocr,"DBE: 2(x-3)=2x-6","DBE: 2x-6=4x+10","DBE: -2x=16","DBE Final: x=-8"];
  const speak=(txt:string)=>{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(txt); u.lang=t.code; u.rate=0.82; speechSynthesis.speak(u); };
  useEffect(()=>{speak(STEPS[step])},[step,lang,trigger]);
  const onPhoto=async(e:any)=>{ const file=e.target.files[0]; if(!file) return; if(!parent){alert("Enter Parent WhatsApp"); return;} if(freeUsed&&!paid) return; setLoading(true); const worker=await createWorker('eng'); const {data:{text}}=await worker.recognize(file); await worker.terminate(); setOcr(text.slice(0,50)); setFreeUsed(true); setLoading(false); setTrigger(x=>x+1); };
  const pay=async()=>{ const r=await fetch('/api/paystack',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:`${parent}@capsmathsbuddy.co.za`,parent,lang})}); const d=await r.json(); if(d.authorization_url) window.location.href=d.authorization_url; };
  return (
    <div className="min-h-screen bg-[#eef2ff]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');`}</style>
      <div className="bg-[#1a237e] text-center py-3 sticky top-0 z-50"><span className="bg-white text-[#b8860b] px-5 py-1.5 rounded-full font-black border-2 border-yellow-500">786</span><span className="text-white text-[11px] ml-2 font-black">caps Maths buddy • Whole SA • Gr 8-12</span></div>
      <div className="max-w-md mx-auto p-3">
        <div className="flex gap-1 bg-white p-2 rounded-full mt-2">{Object.keys(LANGS).map((l:any)=><button key={l} onClick={()=>{setLang(l); setTrigger(x=>x+1);}} className={`flex-1 py-2 rounded-full text-[10px] font-black ${lang===l?'bg-[#1a237e] text-white':'bg-slate-100'}`}>{(LANGS as any)[l].name}</button>)}</div>
        <div className="bg-white p-3 rounded-xl mt-3"><p className="text-[11px] font-bold">{t.parent}</p><input value={parent} onChange={e=>setParent(e.target.value)} placeholder="27 71 123 4567" className="w-full border p-2 rounded mt-1 text-sm"/></div>
        <div className="bg-white mt-3 rounded-xl shadow p-4"><h2 className="font-black text-[#1a237e] text-sm">caps Maths buddy Whiteboard - {ocr}</h2>{loading?<p className="animate-pulse mt-4">Reading... ✍️</p>:<><div className="mt-3"><Handwriting text={STEPS[step]} trigger={trigger}/></div><p className="text-center font-mono text-xs mt-2 bg-yellow-50 p-2 rounded font-bold">{STEPS[step]}</p></>}<div className="grid grid-cols-5 gap-1.5 mt-4"><button onClick={()=>{setStep(s=>Math.max(0,s-1)); setTrigger(x=>x+1);}} className="bg-slate-100 py-3 rounded-xl text-[10px] font-bold">← {t.back}</button><button onClick={()=>{setStep(s=>Math.min(STEPS.length-1,s+1)); setTrigger(x=>x+1);}} className="bg-blue-100 py-3 rounded-xl text-[10px] font-black">{t.next} →</button><button onClick={()=>speak(STEPS[step])} className="bg-[#1a237e] text-white py-3 rounded-xl text-[10px] font-bold">🔊 {t.play}</button><button onClick={()=>{setStep(0); setTrigger(x=>x+1);}} className="bg-slate-100 py-3 rounded-xl text-[10px] font-bold">↻ {t.replay}</button><button onClick={()=>{const q=prompt(`Ask ONLY about: ${ocr}`); if(q) speak(q);}} className="bg-orange-100 py-3 rounded-xl text-[10px] font-black">? {t.ask}</button></div></div>
        <div className="bg-white rounded-xl mt-3 p-4"><h3 className="font-black text-sm">{t.exam} + MOCKS</h3>{MOCKS.map((m:any)=><div key={m.id} className="text-xs border rounded-lg p-2 flex justify-between mt-2"><span>{m.grade}</span><button onClick={()=>setMockOpen(m)} className="bg-[#1a237e] text-white px-3 py-1 rounded-full text-[10px]">Start ▶</button></div>)}</div>
        {mockOpen&&(<div className="fixed inset-0 bg-black/70 z-[100] p-3 flex items-center justify-center"><div className="bg-white rounded-xl p-4 w-full max-w-md"><h3 className="font-black">{mockOpen.grade}</h3><p className="text-sm mt-2">Q: {mockOpen.q}</p><p className="text-xs mt-2 bg-yellow-50 p-2 rounded font-bold">{mockOpen.memo[0]}</p><button onClick={()=>setMockOpen(null)} className="w-full mt-3 bg-red-100 py-2 rounded text-xs">Close Mock</button></div></div>)}
        <div className="mt-3 bg-white p-3 rounded-xl text-center"><input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="w-full text-xs"/><p className="text-[11px] mt-1 font-bold">{freeUsed?(paid?"PLUS Active ✅":"Free used - Unlock PLUS"):t.free}</p></div>
        {freeUsed&&!paid&&(<div className="bg-white mt-3 p-4 rounded-xl border-2 border-yellow-400 text-center"><p className="font-black text-sm">{t.unlock} - Whole SA</p><button onClick={pay} className="w-full bg-[#0db26a] text-white py-3.5 rounded-full mt-3 text-xs font-black">Pay R150 with Paystack → FNB (Card/EFT/Capitec/1Voucher)</button></div>)}
      </div>
    </div>
  );
        }
