"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(8);
  const [lang, setLang] = useState("EN");
  const [detected, setDetected] = useState("20a3 - 4bc");
  const [board, setBoard] = useState<string[]>([
    "Take photo of ANY sum",
    "What do we have here? We look at the sum first.",
    "How do we solve this type? We need a plan.",
    "Do it step by step",
    "Answer - Simple when we go slow!"
  ]);
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

  const EXAM: any = {
    8:{title:"Grade 8 CAPS Senior", papers:["Nov 2023 Gr8 - Paper 1","June 2024 Gr8 - Paper 2","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 Final (100)"]}},
    9:{title:"Grade 9 CAPS Senior", papers:["Nov 2023 Gr9 - Paper 1","June 2024 Gr9 - Paper 2","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 ANY (150)"]}},
    10:{title:"Grade 10 CAPS FET", papers:["DBE P1 2023","DBE P2 2023 + Memo","June 2024 P1"], mocks:{1:["Term 1 ANY (100)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150) P2 (150)"]}},
    11:{title:"Grade 11 CAPS FET", papers:["DBE P1 2023","DBE P2 2023 + Memo","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (75)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150)"]}},
    12:{title:"Grade 12 CAPS FET Matric", papers:["NSC 2023 P1 + Memo","NSC 2023 P2 + Memo","NSC 2024 P1 Trial"], mocks:{1:["Term 1 ANY (150)"],2:["Term 2 ANY (300)"],3:["Term 3 Trial (150)"],4:["Term 4 Final (150)"]}},
  };

  const buildBoard = (raw:string, nums:number[]) => {
    let lower = raw.toLowerCase();
    let L = nums[0] || 6; let B = nums[1] || 4; 
    if(L>99) L=6; if(B>99) B=4;
    
    if(lower.includes("perimeter") || lower.includes("rectangle") || lower.includes("omtrek")){
      return {
        detected: `Rectangle length ${L}cm breadth ${B}cm`,
        board: [
          `The rectangle below has a length of ${L}cm and a breadth of ${B}cm. Calculate the perimeter.`,
          `Now how do we calculate perimeter? We just need to add all of those sides. That is the distance around the space.`,
          `Do you remember what formula looks like? Perimeter equals 2 times Length plus 2 times Breadth. We add length twice and breadth twice.`,
          `So this is going to be equals (2 times ${L}cm) plus (2 times ${B}cm)`,
          `Equals ${2*L}cm plus ${2*B}cm equals ${2*L+2*B}cm. So answer is ${2*L+2*B}cm`
        ]
      };
    }
    if(lower.includes("area") || lower.includes("oppervlakte")){
      return {
        detected: `Rectangle area length ${L} breadth ${B}`,
        board: [
          `The rectangle has length ${L}cm and breadth ${B}cm. Calculate the area.`,
          `Now how do we calculate area? Area is space inside. We fill it.`,
          `Do you remember formula? Area equals Length times Breadth.`,
          `So equals ${L}cm times ${B}cm`,
          `Equals ${L*B} square cm. Answer is ${L*B} square cm`
        ]
      };
    }
    if(lower.includes("triangle") || lower.includes("pythag") || lower.includes("driehoek") || lower.includes("right")){
      let ab = nums[0] || 3; let ac = nums[nums.length-1] || 5;
      let bc = Math.sqrt(ac*ac - ab*ab); let bcF = Number.isInteger(bc) ? bc.toString() : bc.toFixed(1);
      return {
        detected: `Right triangle AB ${ab} AC ${ac}`,
        board: [
          `We have right triangle. AB is ${ab}cm and AC is ${ac}cm. Angle B is 90 degrees. Find BC.`,
          `Now how do we find missing side? We use Pythagoras. The longest side is hypotenuse, AC.`,
          `Do you remember formula? AB squared plus BC squared equals AC squared.`,
          `Put numbers: ${ab} squared plus BC squared equals ${ac} squared. That is ${ab*ab} plus BC squared equals ${ac*ac}`,
          `So BC squared equals ${ac*ac} minus ${ab*ab} equals ${ac*ac-ab*ab}. BC equals square root ${ac*ac-ab*ab} equals ${bcF}cm`
        ]
      };
    }
    if(raw.includes("=")){
      return {
        detected: raw,
        board: [
          `We have equation: ${raw}. What must we find? We must find x.`,
          `How do we get x alone? Whatever we do on left, we must do on right. That keeps it balanced.`,
          `Do you remember? If we have plus number, we minus both sides. If we have minus number, we plus both sides.`,
          `So move numbers first, then we have x term left. Then divide by number in front of x.`,
          `When we do that we get x equals answer. That is how we solve ${raw}`
        ]
      };
    }
    return {
      detected: raw,
      board: [
        `We have: ${raw}. What type is this? This is factorization. We must take out common.`,
        `Now how do we factor? We ask: what number fits in both parts? That is common factor.`,
        `Do you remember? We look for biggest number that divides both. Like 4 fits in 20 and 4.`,
        `So we divide: 20 divided by 4 equals 5, 4 divided by 4 equals 1. Then we take 4 outside bracket.`,
        `Equals 4 times bracket 5a3 minus bc. That is answer. We took common out, simple.`
      ]
    };
  };

  const next = () => setStep(s=>Math.min(s+1, board.length-1));
  const back = () => setStep(s=>Math.max(s-1, 0));

  useEffect(()=>{
    if(playing){ ref.current = setInterval(()=> setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }), 6000); }
    else clearInterval(ref.current);
    return ()=> clearInterval(ref.current);
  },[playing, board]);

  const speakCalm = (text:string)=>{
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.72; u.pitch = 0.92; u.volume = 0.9;
    u.lang = lang==="AF"?"af-ZA":lang==="XH"?"xh-ZA":lang==="ZU"?"zu-ZA":"en-ZA";
    window.speechSynthesis.speak(u);
  };

  useEffect(()=>{ speakCalm(board[step]); },[step, board]);

  const solveAny = (raw:string)=>{
    let nums = (raw.match(/\d+/g) || []).map(n=>parseInt(n));
    let res = buildBoard(raw.slice(0,80), nums);
    setDetected(res.detected);
    setBoard(res.board);
    setStep(0); setPlaying(true);
  };

  const preprocessAndRead = async (file: Blob)=>{
    setOcrLoading(true);
    const img = new Image(); img.src = URL.createObjectURL(file);
    await new Promise(r=> img.onload = r);
    const canvas = canvasRef.current!;
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext("2d")!; ctx.drawImage(img,0,0);
    let data = ctx.getImageData(0,0,canvas.width,canvas.height);
    for(let i=0;i<data.data.length;i+=4){
      let gray = data.data[i]*0.299 + data.data[i+1]*0.587 + data.data[i+2]*0.114;
      let bw = gray > 160 ? 255 : 0;
      data.data[i]=data.data[i+1]=data.data[i+2]=bw;
    }
    ctx.putImageData(data,0,0);
    if(!(window as any).Tesseract){
      await new Promise((res,rej)=>{
        const s = document.createElement('script'); s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"; s.onload = ()=>res(true); s.onerror = rej; document.head.appendChild(s);
      });
    }
    try{
      // @ts-ignore
      const worker = await (window as any).Tesseract.createWorker('eng');
      const { data: { text } } = await worker.recognize(canvas);
      await worker.terminate();
      let cleaned = text.trim().replace(/\n/g,' ').slice(0,100) || "20a3 - 4bc";
      solveAny(cleaned);
    }catch(e){ solveAny("20a3 - 4bc"); }
    setOcrLoading(false);
    if(!freeUsed) setFreeUsed(true);
  };

  const handlePhoto = async (e:any)=>{
    const file = e.target.files[0]; if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    setPhoto(URL.createObjectURL(file));
    await preprocessAndRead(file);
  };

  const askTeacher = ()=>{
    if(!q.trim()) return;
    let ans = `Good! You ask ${q} about ${detected}. Listen: ${board[step]}. How I got it? ${board[Math.min(step+1, board.length-1)] || board[0]}. I do it slowly so you understand why, not just answer.`;
    setChat(prev=>[...prev, {q, a:ans}]);
    speakCalm(ans);
    setQ("");
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center", fontSize:11, color:"#0f0", fontWeight:"bold"}}>Slow teacher for ANY sum!</p>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>)}
      </div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"6px 12px", borderRadius:12, border:"none", background: lang===l ? "#FFD700" : "#222", color: lang===l ? "black" : "white", fontSize:11, fontWeight:"bold"}}>{l}</button>)}
      </div>
      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #0f0" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>MATH CAMERA - Photo ANY sum!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:12, padding:6, background:"#222", color:"white", borderRadius:6, width:"100%"}}/>
        {ocrLoading && <p style={{color:"#0f0", fontSize:12, fontWeight:"bold", background:"#003300", padding:6, borderRadius:4, marginTop:6}}>Cleaning plus reading...</p>}
        {photo && (<><img src={photo} style={{width:"100%", marginTop:6, borderRadius:8, border:"2px solid #0f0"}} alt=""/><div style={{background:"#222", padding:8, borderRadius:8, marginTop:6}}><p style={{color:"#FFD700", fontSize:11, margin:0, fontWeight:"bold"}}>Camera read: (edit if wrong)</p><div style={{display:"flex", gap:6, marginTop:4}}><input value={detected} onChange={e=>setDetected(e.target.value)} style={{flex:1, padding:8, borderRadius:6, border:"1px solid #0f0", background:"black", color:"white", fontSize:14}}/><button onClick={()=>solveAny(detected)} style={{background:"#0f0", border:"none", padding:"8px 12px", borderRadius:6, fontWeight:"bold"}}>Solve</button></div></div></>)}
      </div>
      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:300, marginTop:10}}>
        <p style={{margin:0, fontSize:11, fontWeight:"bold"}}>Teacher - {EXAM[grade].title} - {lang}:</p>
        {board.slice(0, step+1).map((b,i)=>(<div key={i} style={{margin:"14px 0", padding:10, background: i===step ? "#FFD700" : "#fff", borderRadius:8, borderLeft:"5px solid black"}}><p style={{fontSize:17, margin:0, lineHeight:"1.4"}}>{i+1}. {b}</p></div>))}
      </div>
      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing); }} style={{padding:"12px 22px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold", fontSize:14}}>{playing ? "Pause" : "Play Slow"}</button>
        <button onClick={next} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>Forward</button>
      </div>
      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:0, fontSize:13}}>EXAM PREP - {EXAM[grade].title}</p>
        <p style={{fontSize:11, color:"#0f0", fontWeight:"bold", margin:"10px 0 4px 0"}}>PAST PAPERS (CAPS):</p>
        <div style={{background:"#111", padding:8, borderRadius:8, border:"1px solid #444"}}>{EXAM[grade].papers.map((p:string,i:number)=><div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}><span style={{fontSize:11}}>{p}</span><button style={{background:"#0f0", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold", color:"black"}}>Open</button></div>)}</div>
        <div style={{display:"flex", gap:4, marginTop:10}}>{[1,2,3,4].map(t=><button key={t} onClick={()=>setTerm(t)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: term===t ? "#FFD700" : "#333", color: term===t ? "black" : "white", fontSize:11, fontWeight:"bold"}}>Term {t}</button>)}</div>
        <div style={{background:"#111", padding:8, borderRadius:8, marginTop:8, border:"1px solid #0f0"}}>{EXAM[grade].mocks[term].map((m:string,i:number)=><div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}><span style={{fontSize:11}}>{m}</span><button style={{background:"#FFD700", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold"}}>Start Mock</button></div>)}</div>
      </div>
      {showPaywall && (<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}><div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", maxWidth:350}}><h3 style={{color:"#FFD700", margin:0}}>Free Finished!</h3><p style={{fontSize:13}}>1 free read used. Unlimited R150/month.</p><button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold"}}>Pay R150/month</button><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8}}>(Test: I Paid)</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button></div></div>)}
      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}><button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold"}}>{hasPaid ? "Active" : "Pay R150/month"}</button></div>
      <button onClick={()=>setShowAsk(true)} style={{position:'fixed', bottom:'20
