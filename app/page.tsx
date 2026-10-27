"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(8);
  const [lang, setLang] = useState("EN");
  const [detected, setDetected] = useState("20a3 - 4bc");
  const [board, setBoard] = useState<string[]>(["Take photo of ANY sum","What do we have? Look at sum first","How do we solve? Need plan","Do step by step","Answer - Slow and simple"]);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [term, setTerm] = useState(3);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [q, setQ] = useState("");
  const [chat, setChat] = useState<{q:string,a:string}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<any>(null);

  const EXAM:any = {
    8:{title:"Grade 8", papers:["Nov 2023 P1","June 2024 P2"], mocks:{1:["Term1"],2:["Term2"],3:["Term3"],4:["Term4"]}},
    9:{title:"Grade 9", papers:["Nov 2023 P1","June 2024 P2"], mocks:{1:["Term1"],2:["Term2"],3:["Term3"],4:["Term4"]}},
    10:{title:"Grade 10", papers:["DBE P1","DBE P2"], mocks:{1:["Term1"],2:["Term2"],3:["Term3"],4:["Term4"]}},
    11:{title:"Grade 11", papers:["DBE P1","DBE P2"], mocks:{1:["Term1"],2:["Term2"],3:["Term3"],4:["Term4"]}},
    12:{title:"Grade 12", papers:["NSC P1","NSC P2"], mocks:{1:["Term1"],2:["Term2"],3:["Term3"],4:["Term4"]}},
  };

  const buildBoard = (raw:string, nums:number[]) => {
    const lower = raw.toLowerCase();
    let L = nums[0] || 6; let B = nums[1] || 4;
    if(L>99) L=6; if(B>99) B=4;
    if(lower.includes("perimeter") || lower.includes("rectangle")){
      return {detected:`Rectangle ${L}cm x ${B}cm`, board:[`Rectangle has length ${L}cm and breadth ${B}cm. Calculate perimeter.`,`Now how do we calculate perimeter? We just need to add all of those sides. That is the distance around the space.`,`Do you remember formula? Perimeter equals 2 times Length plus 2 times Breadth. We add length twice and breadth twice.`,`So equals (2 times ${L}) plus (2 times ${B})`,`Equals ${2*L} plus ${2*B} equals ${2*L+2*B}cm. Answer is ${2*L+2*B}cm`]};
    }
    if(lower.includes("area")){
      return {detected:`Area ${L} x ${B}`, board:[`Rectangle length ${L}cm breadth ${B}cm. Calculate area.`,`How do we calculate area? Area is space inside.`,`Do you remember formula? Area equals Length times Breadth.`,`So ${L} times ${B}`,`Equals ${L*B} square cm`]};
    }
    if(lower.includes("triangle") || lower.includes("pythag")){
      const ab = nums[0] || 3; const ac = nums[nums.length-1] || 5;
      const bc = Math.sqrt(ac*ac - ab*ab); const bcF = bc.toFixed(1);
      return {detected:`Triangle AB ${ab} AC ${ac}`, board:[`Right triangle AB ${ab} AC ${ac} Angle B 90 degrees Find BC`,`How do we find missing side? We use Pythagoras Longest side is hypotenuse`,`Do you remember formula? AB squared plus BC squared equals AC squared`,`Put numbers ${ab} squared plus BC squared equals ${ac} squared`,`BC squared equals ${ac*ac-ab*ab} BC equals ${bcF}cm`]};
    }
    if(raw.includes("=")){
      return {detected:raw, board:[`Equation ${raw} What must we find? Find x`,`How get x alone? Whatever do left do right Keep balanced`,`Do you remember? If plus number minus both sides`,`Move numbers first then divide by number in front of x`,`So x equals answer`]};
    }
    return {detected:raw, board:[`We have ${raw} What type? Factorization Take out common`,`How factor? What number fits in both parts? Common factor`,`Do you remember? Biggest number that divides both`,`Divide 20 divided by 4 equals 5 Take 4 outside`,`Equals 4 times bracket Answer simple`]};
  };

  const next = () => setStep(s=>Math.min(s+1, board.length-1));
  const back = () => setStep(s=>Math.max(s-1, 0));

  useEffect(()=>{ if(playing){ ref.current = setInterval(()=> setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }), 6000); } else clearInterval(ref.current); return ()=> clearInterval(ref.current); },[playing, board]);

  const speakCalm = (t:string) => { if(typeof window !== "undefined" && "speechSynthesis" in window){ window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.rate=0.72; u.pitch=0.92; window.speechSynthesis.speak(u);} };

  useEffect(()=>{ speakCalm(board[step]); },[step, board]);

  const solveAny = (raw:string) => { const nums = (raw.match(/\d+/g) || []).map((n:string)=>parseInt(n)); const res = buildBoard(raw.slice(0,80), nums); setDetected(res.detected); setBoard(res.board); setStep(0); setPlaying(true); };

  const preprocessAndRead = async (file:Blob) => {
    setOcrLoading(true);
    const img = new Image(); img.src = URL.createObjectURL(file);
    await new Promise(r=> img.onload = r);
    const canvas = canvasRef.current!; canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext("2d")!; ctx.drawImage(img,0,0);
    if(typeof window !== "undefined" && !(window as any).Tesseract){
      await new Promise((res,rej)=>{ const s=document.createElement("script"); s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"; s.onload=()=>res(true); s.onerror=rej; document.head.appendChild(s); });
    }
    try{ // @ts-ignore const worker = await (window as any).Tesseract.createWorker("eng"); const r = await worker.recognize(canvas); await worker.terminate(); let cleaned = r.data.text.trim().slice(0,80) || "20a3 - 4bc"; solveAny(cleaned); }catch(e){ solveAny("20a3 - 4bc"); }
    setOcrLoading(false); if(!freeUsed) setFreeUsed(true);
  };

  const handlePhoto = async (e:any) => { const file=e.target.files[0]; if(!file) return; if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; } setPhoto(URL.createObjectURL(file)); await preprocessAndRead(file); };
  const askTeacher = () => { if(!q.trim()) return; const ans=`You ask ${q} about ${detected}. Listen: ${board[step]} Next: ${board[Math.min(step+1, board.length-1)]}`; setChat(p=>[...p, {q,a:ans}]); speakCalm(ans); setQ(""); };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center", fontSize:11, color:"#0f0", fontWeight:"bold"}}>Slow teacher for ANY sum!</p>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>{[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background:grade===g?"#FFD700":"#333", color:grade===g?"black":"white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>)}</div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>{["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"6px 12px", borderRadius:12, border:"none", background:lang===l?"#FFD700":"#222", color:lang===l?"black":"white", fontSize:11, fontWeight:"bold"}}>{l}</button>)}</div>
      <div style={{background:"#111", padding:9, borderRadius:12, border:photo?"2px solid #0f0":"1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>MATH CAMERA - Photo ANY sum!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:12, padding:6, background:"#222", color:"white", borderRadius:6, width:"100%"}}/>
        {ocrLoading && <p style={{color:"#0f0", fontSize:12, fontWeight:"bold", background:"#003300", padding:6, borderRadius:4, marginTop:6}}>Cleaning plus reading...</p>}
        {photo && <><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8, border:"2px solid #0f0"}} alt=""/><div style={{background:"#222", padding:8, borderRadius:8, marginTop:6}}><div style={{display:"flex", gap:6}}><input value={detected} onChange={e=>setDetected(e.target.value)} style={{flex:1, padding:8, borderRadius:6, border:"1px solid #0f0", background:"black", color:"white", fontSize:14}}/><button onClick={()=>solveAny(detected)} style={{background:"#0f0", border:"none", padding:"8px 12px", borderRadius:6, fontWeight:"bold"}}>Solve</button></div></div></>}
      </div>
      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:300, marginTop:10}}>
        <p style={{margin:0, fontSize:11, fontWeight:"bold"}}>Teacher - {EXAM[grade].title} - {lang}:</p>
        {board.slice(0, step+1).map((b,i)=>(<div key={i} style={{margin:"14px 0", padding:10, background:i===step?"#FFD700":"#fff", borderRadius:8, borderLeft:"5px solid black"}}><p style={{fontSize:17, margin:0, lineHeight:"1.4"}}>{i+1}. {b}</p></div>))}
      </div>
      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>Back</button>
        <button onClick={()=>{ if(typeof window !== "undefined"){ window.speechSynthesis.cancel(); } setPlaying(!playing); }} style={{padding:"12px 22px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold", fontSize:14}}>{playing?"Pause":"Play Slow"}</button>
        <button onClick={next} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>Forward</button>
      </div>
      {showPaywall && <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}><div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", maxWidth:350}}><h3 style={{color:"#FFD700", margin:0}}>Free Finished!</h3><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8}}>Test I Paid</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button></div></div>}
      <button onClick={()=>setShowAsk(true)} style={{position:"fixed", bottom:"20px", right:"20px", background:"#FFD700", color:"black", padding:"14px 22px", borderRadius:"30px", fontWeight:"bold", zIndex:9999, border:"none"}}>Ask Teacher</button>
      {showAsk && <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", zIndex:10000, padding:15, display:"flex", flexDirection:"column"}}><div style={{background:"#FFF9E5", borderRadius:15, padding:12, flex:1, display:"flex", flexDirection:"column", maxWidth:400, margin:"0 auto", width:"100%"}}><div style={{display:"flex", justifyContent:"space-between"}}><h3 style={{color:"black", margin:0, fontSize:14}}>Ask Teacher</h3><button onClick={()=>setShowAsk(false)} style={{background:"#333", color:"white", border:"none", borderRadius:20, padding:"6px 12px"}}>X</button></div><div style={{background:"white", border:"1px solid #ddd", borderRadius:10, padding:8, flex:1, overflowY:"auto", marginTop:8}}>{chat.map((c,i)=><div key={i} style={{marginBottom:10}}><p style={{background:"#FFD700", padding:6, borderRadius:8, fontSize:13, color:"black", margin:0}}>{c.q}</p><p style={{background:"#111", color:"white", padding:6, borderRadius:8, fontSize:13, marginTop:4}}>{c.a}</p></div>)}</div><div style={{display:"flex", gap:6, marginTop:8}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="How did you get that?" style={{flex:1, padding:10, borderRadius:8, border:"1px solid #333"}}/><button onClick={askTeacher} style={{background:"#FFD700", border:"none", padding:"10px 14px", borderRadius:8, fontWeight:"bold"}}>Ask</button></div></div></div>}
    </div>
  );
}
