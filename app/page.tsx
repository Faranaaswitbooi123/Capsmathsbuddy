"use client";
import { useState } from "react";
export default function Page(){
const [grade,setGrade]=useState("Grade 12");
const [term,setTerm]=useState("Term 3");
const [lang,setLang]=useState("EN");
const [sub,setSub]=useState("Algebra");
const [msg,setMsg]=useState("");
const [msgs,setMsgs]=useState([{role:"ai",text:"Assalamu Alaikum Joh! 🌙 786 - I am your Perfect CAPS MATHS BUDDY - Gr 8-12 - Term 1-4 - EN/AF/ZU - Maths + ANY subject - Auto Talk - Ready! What do you want to learn today?"}]);
const [autoTalk,setAutoTalk]=useState(true);
const speak=(t:string)=>{try{const u=new SpeechSynthesisUtterance(t);u.lang=lang==="AF"?"af-ZA":lang==="ZU"?"zu-ZA":"en-ZA";speechSynthesis.cancel();speechSynthesis.speak(u);}catch{}};
const subjects=["Algebra","Geometry","Trigonometry","Calculus","Statistics","Past Papers","Any Subject"];
const t=(en:string,af:string,zu:string)=>lang==="AF"?af:lang==="ZU"?zu:en;
const send=()=>{
if(!msg.trim())return;
const userMsg=msg;
const newMsgs=[...msgs,{role:"user",text:userMsg}];
setMsgs(newMsgs as any);
setMsg("");
const isMaths=subjects.slice(0,5).includes(sub);
const lower=userMsg.toLowerCase();
let reply="";
if(lower.includes("hello")||lower.includes("sawubona")||lower.includes("hallo")){
reply=t("Hello Joh! 🌟 Ready to ace CAPS Maths? Choose topic and ask!","Hallo Joh! 🌟 Gereed vir CAPS Wiskunde? Kies onderwerp!","Sawubona Joh! 🌟 Ulungele ukuphumelela i-CAPS Maths? Khetha isihloko!");
}else if(sub==="Past Papers"){
reply=`📄 **Past Papers - ${grade} ${term}**\n\n**Q1:** Solve: 2x+3=11\n**Solution:** 2x=8 => x=4\n\n**Q2:** Factorise x²-9\n**Solution:** (x-3)(x+3)\n\n**Q3:** ${userMsg} - Let's solve together step-by-step. Tell me where you stuck.\n\nDBE NSC Style - 786 Blessed`;
}else if(isMaths){
reply=`📘 **${sub} - ${grade} ${term} (${lang})**\n\n**Topic:** ${userMsg}\n\n**1. Explain:** This is CAPS aligned for ${grade}. We break into steps.\n\n**2. Formula:** Use CAPS formula sheet. Example: Quadratic x = (-b±√(b²-4ac))/2a\n\n**3. Example:** Solve for your question: ${userMsg}\nLet's do: If 2x²+3x-2=0 then x = [-3±√(9+16)]/4 = [-3±5]/4 => x=0.5 or x=-2\n\n**4. Try:** Now you try similar with your numbers.\n\n**Tip:** Show all steps for NSC marks. 786`;
}else{
reply=`🌍 **Any Subject - CAPS Buddy - ${grade}**\n\nYou asked: "${userMsg}"\n\nI will help you CAPS way:\n\n1. What is it? Simple definition\n2. Why important? CAPS link\n3. Example\n4. How to answer in exam\n\nAsk follow-up - I explain deeper.\n\n${t("You can ask ANY subject - Maths, Science, Life, History, Languages","Jy kan ENIGE vak vra - Wiskunde, Wetenskap, ens","Ungabuza ISIHLUKO NOMA YISIPHI - Maths, Science njalo")}`;
}
const final=[...newMsgs,{role:"ai",text:reply}];
setMsgs(final as any);
if(autoTalk) setTimeout(()=>speak(reply.replace(/\*\*/g,"").slice(0,200)),300);
};
return (
<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-3">
<div className="max-w-3xl mx-auto bg-white rounded-[24px] shadow-xl overflow-hidden">
<div className="bg-emerald-700 text-white p-4">
<h1 className="text-xl font-black">786 CAPS MATHS BUDDY - Perfect Dream App</h1>
<p className="text-xs opacity-90">DBE CAPS Aligned | Gr 8-12 | Term 1-4 | EN/AF/ZU | NSC Matric Ready</p>
<div className="flex gap-2 mt-3 flex-wrap">
<select value={grade} onChange={e=>setGrade(e.target.value)} className="text-black rounded px-2 py-1 text-sm">{["Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"].map(g=><option key={g}>{g}</option>)}</select>
<select value={term} onChange={e=>setTerm(e.target.value)} className="text-black rounded px-2 py-1 text-sm">{["Term 1","Term 2","Term 3","Term 4"].map(g=><option key={g}>{g}</option>)}</select>
<select value={lang} onChange={e=>setLang(e.target.value)} className="text-black rounded px-2 py-1 text-sm"><option value="EN">EN</option><option value="AF">AF</option><option value="ZU">ZU</option></select>
<select value={sub} onChange={e=>setSub(e.target.value)} className="text-black rounded px-2 py-1 text-sm">{subjects.map(s=><option key={s}>{s}</option>)}</select>
<button onClick={()=>setAutoTalk(!autoTalk)} className={`px-3 py-1 rounded text-sm ${autoTalk?"bg-yellow-400 text-black":"bg-white/20"}`}>{autoTalk?"🔊 Auto Talk ON":"🔇 OFF"}</button>
</div>
</div>
<div className="p-4 h-[420px] overflow-y-auto space-y-3 bg-slate-50">
{msgs.map((m,i)=><div key={i} className={`p-3 rounded-xl text-sm whitespace-pre-wrap ${m.role==="user"?"bg-emerald-600 text-white ml-10":"bg-white border mr-10"}`}>{m.text}<div className="mt-2 flex gap-2">{m.role==="ai"&&<button onClick={()=>speak(m.text)} className="text-xs bg-slate-100 px-2 py-1 rounded">🔊 Speak</button>}</div></div>)}
</div>
<div className="p-3 border-t flex gap-2">
<input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t("Ask Maths or any subject...","Vra Wiskunde of enige vak...","Buza Maths noma yisiphi isifundo...")} className="flex-1 border rounded-full px-4 py-2 text-sm"/>
<button onClick={send} className="bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-bold">Send</button>
</div>
<footer className="bg-slate-900 text-white text-center text-[10px] p-3">
© 2026 CAPS MATHS BUDDY 786 - Perfect App - Dream App - Whole & Small<br/>DBE CAPS Aligned | NSC Matric Ready | 786 Blessed | No more circles
</footer>
</div>
</div>
);
  }
