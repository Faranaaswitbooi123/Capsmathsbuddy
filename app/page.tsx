// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [input,setInput]=useState(""); const [grade,setGrade]=useState(8); const [term,setTerm]=useState(2); const [tab,setTab]=useState("solve"); const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const [listening,setListening]=useState(false); const [isDrawing,setIsDrawing]=useState(false); const [solvesUsed,setSolvesUsed]=useState(0); const [hasPaid,setHasPaid]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [teacherQ,setTeacherQ]=useState(""); const [teacherChat,setTeacherChat]=useState<any[]>([{role:"teacher", text:"Salam! Type any sum - 1 free"}]); const canvasRef=useRef<HTMLCanvasElement>(null); const [board,setBoard]=useState<any[]>([]);
  useEffect(()=>{ const s=localStorage.getItem("caps_solves"); const p=localStorage.getItem("caps_paid"); const t=localStorage.getItem("caps_term"); if(s){ const n=parseInt(s); if(!isNaN(n)) setSolvesUsed(n); else setSolvesUsed(0); } else setSolvesUsed(0); if(p==="true") setHasPaid(true); if(t) setTerm(parseInt(t)); },[]);
  
  const termTopics:any={1:["Whole Numbers","Exponents"],2:["Functions","Geometry"],3:["Exponents","Equations"],4:["Graphs","Data Handling"]};

  useEffect(()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); if(!ctx) return; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); },[]);
  const getPos=(e:any)=>{ const c=canvasRef.current!; const r=c.getBoundingClientRect(); return {x:(e.touches?e.touches[0].clientX:e.clientX)-r.left, y:(e.touches?e.touches[0].clientY:e.clientY)-r.top}; };
  const startDraw=(e:any)=>{ e.preventDefault(); setIsDrawing(true); const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.beginPath(); ctx.moveTo(x,y); };
  const draw=(e:any)=>{ e.preventDefault(); if(!isDrawing) return; const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.lineWidth=3; ctx.lineCap="round"; ctx.strokeStyle="white"; ctx.lineTo(x,y); ctx.stroke(); };
  const stopDraw=(e:any)=>{ if(e) e.preventDefault(); setIsDrawing(false); };
  const clearDraw=()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); };
  const startVoice=()=>{ try{ const W=window as any; const SR=W.webkitSpeechRecognition||W.SpeechRecognition; if(!SR) return; const rec=new SR(); rec.lang="en-ZA"; rec.onstart=()=>setListening(true); rec.onresult=(ev:any)=>{ setInput(p=>p+" "+ev.results[0][0].transcript); setListening(false); }; rec.onerror=()=>setListening(false); rec.onend=()=>setListening(false); rec.start(); }catch{} };
  const speak=(t:string,e:string)=>{ try{ const W=window as any; if(W.speechSynthesis){ W.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance((t+". "+e).replace(/×/g," times ")); u.rate=0.85; W.speechSynthesis.speak(u); } }catch{} };
  useEffect(()=>{ if(playing && board[step]) speak(board[step].t, board[step].e); },[step,playing]);
  useEffect(()=>{ let id:any; if(playing){ id=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s; } return s+1; }),6000); } return ()=>clearInterval(id); },[playing,board]);

  const press=(v:string)=>{
    if(v==="AC"){ setInput(""); setBoard([]); return; }
    if(v==="DEL"){ setInput(p=>p.slice(0,-1)); return; }
    if(v==="="){ solveAny(); return; }
    setInput(p=>p + (v==="×"?" x ": v==="÷"?" ÷ ": v===","?"": v==="ON"? "": v + " "));
  };

  const solveAny=()=>{
    if(!input.trim()){ alert("Type ANY sum"); return; }
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const raw=input.trim(); let nb:any=[];
    try{
      let expr = raw.replace(/x/g,"*").replace(/×/g,"*").replace(/÷/g,"/").replace(/²/g,"**2").replace(/³/g,"**3").replace(/√/g,"Math.sqrt").replace(/%/g,"/100").replace(/π/g,"Math.PI");
      const safe = expr.replace(/[^0-9+\-*/(). Math.sqrtPI**]/g,"").trim();
      if(!safe) throw new Error("empty");
      const ans = Function(`"use strict"; return (${safe})`)();
      if(!isFinite(ans)) throw new Error("bad");
      nb=[{t:`Sum: ${raw}`, e:`We solve ${raw}`},{t:`Step 1: Brackets`, e:`( ) first`},{t:`Step 2: × ÷`, e:`Multiply divide`},{t:`Step 3: + -`, e:`Add subtract`},{t:`Answer: ${ans}`, e:`${raw} = ${ans}`}];
      const bm = safe.match(/\(([^()]+)\)/); if(bm){ try{ const iv=Function(`"use strict"; return (${bm[1]})`)(); nb.splice(1,0,{t:`Inside ( ) = ${iv}`, e:`${bm[1]} = ${iv}`}); }catch{} }
    }catch{ nb=[{t:`Sum: ${raw}`, e:`Let's solve ${raw}`},{t:"Tip", e:`Type ANY sum - Scientific keyboard open`}]; }
    setBoard(nb); setStep(0); setPlaying(true); setTimeout(()=>speak(nb[0].t, nb[0].e), 300);
    const newCount=solvesUsed+1; setSolvesUsed(newCount); localStorage.setItem("caps_solves", newCount.toString());
  };
  const askTeacher=()=>{ if(!teacherQ.trim()) return; if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; } setTeacherChat(prev=>[...prev, {role:"you", text:teacherQ}, {role:"teacher", text:`For ${teacherQ} - Brackets, x ÷, + -`} ]); setTeacherQ(""); };
  const handlePay=()=>{ window.open("https://paystack.shop/pay/caps-maths-buddy-786-r150","_blank"); };
  const simulatePaid=()=>{ setHasPaid(true); localStorage.setItem("caps_paid","true"); setShowPaywall(false); };
  const resetTrial=()=>{ localStorage.removeItem("caps_solves"); localStorage.removeItem("caps_paid"); setSolvesUsed(0); setHasPaid(false); setShowPaywall(false); alert("Reset done - 1 free again"); };

  //
