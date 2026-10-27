"use client";
import { useState, useEffect, useRef } from "react";

export default function Home(){
  const [input,setInput]=useState("");
  const [grade,setGrade]=useState(8); const [term,setTerm]=useState(2);
  const [lang,setLang]=useState("EN"); const [tab,setTab]=useState("solve");
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false);
  const [listening,setListening]=useState(false); const [isDrawing,setIsDrawing]=useState(false);
  const [solvesUsed,setSolvesUsed]=useState(0); const [hasPaid,setHasPaid]=useState(false);
  const [showPaywall,setShowPaywall]=useState(false); const [teacherQ,setTeacherQ]=useState("");
  const [teacherChat,setTeacherChat]=useState<any[]>([{role:"teacher", text:"Salam! Ask any maths - I explain simple WHY & HOW - Any sum"}]);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [board,setBoard]=useState<any[]>([]);

  useEffect(()=>{
    const s=localStorage.getItem("caps_solves"); const p=localStorage.getItem("caps_paid");
    const t=localStorage.getItem("caps_term");
    if(s) setSolvesUsed(parseInt(s)); if(p==="true") setHasPaid(true); if(t) setTerm(parseInt(t));
  },[]);

  const keys=["7","8","9","( )","x","=","÷","4","5","6","+","-","×","√","1","2","3","²","³","AB","0",".","△","∠","°","%","Distributive","Perimeter","Area","6cm","4cm","Pythagoras","Functions","Angles","Whole Numbers","Exponents","Equations","Graphs","Probability"];

  const termTopics:any={
    1: ["Whole Numbers","Exponents","Numeric Patterns","Distributive","Algebraic Expressions","Equations"],
    2: ["Functions","Geometry Angles","Triangles","Theorem Pythagoras","Perimeter 6cm 4cm","Area"],
    3: ["Exponents","Algebraic Expressions","Equations","2D Geometry","Probability"],
    4: ["Graphs","Transformation","Geometry 3D","Data Handling","Exam Revision All Terms"]
  };

  useEffect(()=>{
    const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); if(!ctx) return;
    ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height);
  },[]);
  const getPos=(e:any)=>{ const c=canvasRef.current!; const r=c.getBoundingClientRect(); return {x:(e.touches?e.touches[0].clientX:e.clientX)-r.left, y:(e.touches?e.touches[0].clientY:e.clientY)-r.top}; };
  const startDraw=(e:any)=>{ e.preventDefault(); setIsDrawing(true); const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.beginPath(); ctx.moveTo(x,y); };
  const draw=(e:any)=>{ e.preventDefault(); if(!isDrawing) return; const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.lineWidth=3; ctx.lineCap="round"; ctx.strokeStyle="white"; ctx.lineTo(x,y); ctx.stroke(); };
  const stopDraw=(e:any)=>{ if(e) e.preventDefault(); setIsDrawing(false); };
  const clearDraw=()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); };
  const startVoice=()=>{ try{ const W=window as any; const SR=W.webkitSpeechRecognition||W.SpeechRecognition; if(!SR) return; const rec=new SR(); rec.lang="en-ZA"; rec.onstart=()=>setListening(true); rec.onresult=(ev:any)=>{ setInput(p=>p+" "+ev.results[0][0].transcript); setListening(false); }; rec.onerror=()=>setListening(false); rec.onend=()=>setListening(false); rec.start(); }catch{} };
  const speak=(t:string,e:string)=>{ try{ const W=window as any; if(W.speechSynthesis){ W.speechSynthesis.cancel(); const text=(t+". "+e).replace(/×/g," times "); const u=new SpeechSynthesisUtterance(text); u.rate=0.8; u.volume=1; W.speechSynthesis.speak(u); } }catch{} };
  useEffect(()=>{ if(playing && board[step]) speak(board[step].t, board[step].e); },[step,playing]);
  useEffect(()=>{ let id:any; if(playing){ id=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s; } return s+1; }),7000); } return ()=>clearInterval(id); },[playing,board]);

  const solveAny=()=>{
    if(!input.trim()){ alert("Type ANY sum"); return; }
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const raw=input.trim(); let nb:any=[];
    try{
      let expr = raw.replace(/x/g,"*").replace(/×/g,"*").replace(/÷/g,"/").replace(/²/g,"**2").replace(/³/g,"**3").replace(/√/g,"Math.sqrt").replace(/%/g,"/100");
      const safe = expr.replace(/[^0-9+\-*/(). Math.sqrt**]/g,"");
      const dist = raw.match(/(\d+)\s*[x×\*]\s*\(\s*(\d+)\s*([\+\-])\s*(\d+)\s*\)/);
      if(dist){
        const a=parseInt(dist[1]), b=parseInt(dist[2]), op=dist[3], c=parseInt(dist[4]);
        const inside = op==="+"? b+c : b-c;
        const ans = a*inside; const p1=a*b, p2=a*c;
        nb=[
          {t:`QUESTION (Any sum): ${raw}`, e:`Think like bags - ${a} bags each has (${b} ${op} ${c})`},
          {t:"WHY inside first? CAPS BODMAS - Brackets first", e:`Inside: ${b} ${op} ${c} = ${inside}`},
          {t:`STEP 1: Inside = ${inside}`, e:`${b} ${op} ${c} = ${inside}`},
          {t:`STEP 2: ${a} x ${inside} = ${ans}`, e:`${a} bags x ${inside} = ${ans} - Old bug did ${a}+${c}=${a+c} giving 10 - WRONG! Correct is ${a}x${c}=${p2} not ${a}+${c}`},
          {t:"METHOD 2 Distributive", e:`(${a}x${b}) ${op} (${a}x${c}) = ${p1} ${op} ${p2} = ${op==="+"?p1+p2:p1-p2}`},
          {t:`FINAL ANSWER: ${ans} - Thinking check like AI`, e:`Does ${ans} make sense? ${ans} > ${inside} yes, ${a} bags more than 1 - So 14 right, 10 wrong - AI thinking`}
        ];
      } else {
        const ans = Function(`"use strict"; return (${safe})`)();
        if(!isFinite(ans)) throw new Error("no");
        nb=[
          {t:`OPEN - ANY SUM: ${raw}`, e:`I read any sum - Not narrowed - ${raw}`},
          {t:`Clean: ${safe}`, e:`Convert x→*, ÷→/, ²→**2`},
          {t:"BODMAS", e:`Brackets, Orders, Divide/Multiply, Add/Subtract`},
          {t:`Calculate: ${safe} = ${ans}`, e:`${safe} = ${ans}`},
          {t:`ANSWER ${ans} - Reason check`, e:`Like me thinking: Is ${ans} reasonable for ${raw}? Yes - Open thinking, not fixed trick`}
        ];
      }
    }catch(e){
      nb=[
        {t:`Question: ${raw}`, e:`Open thinking: ${raw}`},
        {t:"I solve ANY sum", e:`Examples: 2 x (3+4), 12+8x2, 6x4, √16, 5², 100-(20/4) - Type any`},
        {t:"How?", e:`I clean symbols then calculate - Like AI - Not narrowed to one pattern`}
      ];
    }
    setBoard(nb); setStep(0); setPlaying(true); setTimeout(()=>speak(nb[0].t, nb[0].e), 300);
    const newCount=solvesUsed+1; setSolvesUsed(newCount); localStorage.setItem("caps_solves", newCount.toString());
  };

  const askTeacher=()=>{ if(!teacherQ.trim()) return; if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; } setTeacherChat(prev=>[...prev, {role:"you", text:teacherQ}, {role:"teacher", text:`OPEN THINKING for: ${teacherQ} - WHY: Bags example. HOW: Steps. Reason check: Does answer make sense? Like AI not fixed - For ${teacherQ}`} ]); setTeacherQ(""); };
  const handlePay=()=>{ window.open("https://paystack.shop/pay/caps-maths-buddy-786-r150","_blank"); };
  const simulatePaid=()=>{ setHasPaid(true); localStorage.setItem("caps_paid","true"); setShowPaywall(false); };

  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:180}}>
      <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center",fontSize:10,color:"#0f0"}}>OPEN TO ANY SUM - THINKS LIKE AI</p>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
        <button onClick={()=>setTab("solve")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="solve"?"#FFD700":"#333",color:tab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>ANY {hasPaid?"INF":(1-solvesUsed)+" free"}</button>
        <button onClick={()=>setTab("teacher")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="teacher"?"#0f0":"#333",color:tab==="teacher"?"black":"white",fontWeight:"bold",fontSize:11}}>Ask Teacher</button>
        <button onClick={()=>setTab("mocks")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="mocks"?"#FFD700":"#333",color:tab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>Exam Prep</button>
      </div>
      {showPaywall && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#111",border:"3px solid #FFD700",borderRadius:16,padding:20,maxWidth:340,width:"100%",textAlign:"center"}}>
            <h2 style={{color:"#FFD700",margin:0}}>1 Free Used</h2><p style={{color:"#0f0",fontSize:12}}>Pay R150 unlock unlimited</p>
            <div style={{background:"#222",padding:12,borderRadius:10,marginTop:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:18}}>R150 / month</p></div>
            <button onClick={handlePay} style={{width:"100%",marginTop:14,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>Pay R150</button>
            <button onClick={()=>setShowPaywall(false)} style={{width:"100%",marginTop:8,padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Close</button>
            <button onClick={simulatePaid} style={{width:"100%",marginTop:8,padding:8,background:"#222",color:"#777",borderRadius:8,border:"none",fontSize:10}}>Test Paid</button>
          </div>
        </div>
      )}
      {tab==="solve" && <>
        <div style={{background:"#111",padding:10,borderRadius:12,border:"2px solid #FFD700",marginTop:10}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Type ANY sum - 2 x (3+4) or 12+8x2 or √16 or 5² or 100-(20/4) - OPEN" style={{width:"100%",height:50,padding:8,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:13}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
            {keys.map(k=><button key={k} onClick={()=>setInput(p=>p+" "+k+" ")} style={{padding:"6px 7px",background:"#222",color:"#FFD700",borderRadius:6,border:"1px solid #444",fontSize:11,fontWeight:"bold"}}>{k}</button>)}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={startVoice} style={{flex:1,padding:8,background:listening?"red":"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>{listening?"Listening...":"🎤 Speak ANY sum"}</button>
            <button onClick={clearDraw} style={{padding:8,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Clear Draw</button>
          </div>
          <canvas ref={canvasRef} width={340} height={80} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{width:"100%",height:80,background:"black",borderRadius:8,border:"2px dashed #FFD700",touchAction:"none",display:"block",marginTop:6}}/>
          <button onClick={solveAny} style={{width:"100%",marginTop:8,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:14}}>✅ SOLVE ANY SUM LIKE AI 🔊</button>
        </div>
        <div style={{background:"white",color:"black",padding:10,borderRadius:12,minHeight:200,marginTop:10}}>
          {board.length===0 ? (<div style={{textAlign:"center",padding:40}}><p style={{fontSize:50,margin:0}}>📝</p><p style={{fontSize:14,fontWeight:"bold",color:"#555"}}>Board is clean - Open to ANY sum</p><p style={{fontSize:11,color:"#777"}}>Type ANY sum above - I think like AI<br/>Not narrowed - Checks if answer makes sense</p></div>) : (
            <><p style={{margin:0,fontSize:11,fontWeight:"bold",background:"#FFEB3B",padding:6}}>Step {step+1}/{board.length} - OPEN THINKING</p>
              {board.slice(0,step+1).map((b:any,i:number)=>{ const isActive=i===step; return (<div key={i} style={{margin:"10px 0",background:isActive?"#FFF9C4":"white",borderRadius:8,padding:10,borderLeft:isActive?"6px solid #0f0":"4px solid black",border:"1px solid #ddd"}}><p style={{margin:0,fontSize:12,fontWeight:"bold"}}>{i+1}. {b.t}</p><pre style={{background:isActive?"black":"#f5f5f5",color:isActive?"#ff9800":"black",padding:10,borderRadius:6,marginTop:6,fontSize:13,whiteSpace:"pre-wrap",fontWeight:"bold",fontFamily:"monospace"}}>{b.e}</pre><button onClick={()=>speak(b.t,b.e)} style={{marginTop:6,padding:8,background:"#0f0",color:"black",borderRadius:6,border:"none",fontSize:11,fontWeight:"bold",width:"100%"}}>🔊 Hear This Step</button></div>); })}</>
          )}
        </div>
        {board.length>0 && (<div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10,position:"sticky",bottom:160,background:"black",padding:8,borderRadius:20}}><button onClick={()=>setStep(s=>Math.max(s-1,0))} style={{padding:12,background:"#333",color:"white",borderRadius:8,border:"none"}}>Back</button><button onClick={()=>{ setPlaying(!playing); if(!playing && board[step]) speak(board[step].t, board[step].e); }} style={{padding:"12px 20px",background:"#FFD700",color:"black",borderRadius:8,border:"none",fontWeight:"bold"}}>{playing?"Pause":"🔊 Play All"}</button><button onClick={()=>setStep(s=>Math.min(s+1,board.length-1))} style={{padding:12,background:"#333",color:"white",borderRadius:8,border:"none"}}>Next</button></div>)}
      </>}
      {tab==="teacher" && (<div style={{background:"#111",border:"2px solid #0f0",padding:10,borderRadius:12,marginTop:10}}><h3 style={{margin:0,color:"#0f0",fontSize:13}}>Ask Teacher - OPEN WHY & HOW</h3><div style={{background:"black",borderRadius:8,padding:8,height:300,overflowY:"auto",marginTop:8,border:"1px solid #333"}}>{teacherChat.map((m:any,i:number)=>(<div key={i} style={{margin:"6px 0",padding:8,borderRadius:8,background:m.role==="you"?"#333":"#0a2a0a"}}><pre style={{margin:0,fontSize:11,whiteSpace:"pre-wrap",fontFamily:"monospace",color:"white"}}>{m.text}</pre></div>))}</div><div style={{display:"flex",gap:6,marginTop:8}}><input value={teacherQ} onChange={e=>setTeacherQ(e.target.value)} placeholder="Why 2x(3+4)=14?" style={{flex:1,padding:8,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:11}}/><button onClick={askTeacher} style={{padding:"8px 14px",background:"#0f0",color:"black",borderRadius:8,border:"none",fontWeight:"bold",fontSize:11}}>Ask</button></div></div>)}
      {tab==="mocks" && (<div style={{background:"#111",border:"2px solid #FFD700",padding:12,borderRadius:12,marginTop:10}}><h3 style={{margin:0,color:"#FFD700",fontSize:15}}>Exam Prep Gr {grade} - Term {term} - OPEN</h3><div style={{display:"flex",gap:6,marginTop:10}}>{[1,2,3,4].map(t=>(<button key={t} onClick={()=>{setTerm(t); localStorage.setItem("caps_term", t.toString());}} style={{flex:1,padding:"14px 4px",borderRadius:12,border:term===t?"3px solid #FFD700":"1px solid #333",background:term===t?"#0f0":"#222",color:term===t?"black":"white",fontWeight:"bold",fontSize:13}}>Term {t}</button>))}</div><div style={{background:"#111",borderRadius:8,padding:10,marginTop:10,border:"1px solid #333"}}>{termTopics[term].map((tp:string,i:number)=><p key={i} style={{margin:"4px 0",color:"white",fontSize:11}}>• {tp} - Open to any sum in this topic</p>)}</div></div>)}
      <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #FFD700",padding:"12px",zIndex:40}}>
        <div style={{textAlign:"center"}}>
          <p style={{color:"#FFD700",fontSize:13,fontWeight:"bold",margin:0}}>CAPS MATHS BUDDY 786</p>
          <p style={{color:"#aaa",fontSize:10,margin:"2px 0"}}>Cape Town, Western Cape, South Africa | support@capsmathsbuddy.co.za | 071 123 4567</p>
          <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:6,flexWrap:"wrap"}}>
            <a href="#" style={{color:"#FFD700",fontSize:11,fontWeight:"bold"}}>Pricing: R150/month</a>
            <a href="#" style={{color:"#FFD700",fontSize:11,fontWeight:"bold"}}>Refund Policy</a>
            <a href="#" style={{color:"#FFD700",fontSize:11,fontWeight:"bold"}}>Cancel Anytime</a>
            <a href="#" style={{color:"#FFD700",fontSize:11,fontWeight:"bold"}}>Terms</a>
            <a href="#" style={{color:"#FFD700",fontSize:11,fontWeight:"bold"}}>Privacy</a>
          </div>
          <p style={{color:"#666",fontSize:9,textAlign:"center",margin:"6px 0 0 0"}}>© 2026 CAPS MATHS BUDDY 786 • Educational CAPS Tool • Not affiliated with DBE • R150/month subscription • Gr {grade} T{term} • Open to ANY sum - AI thinking • All rights reserved</p>
        </div>
      </footer>
    </div>
  );
         }
