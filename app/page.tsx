// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [input,setInput]=useState(""); const [term,setTerm]=useState(2); const [tab,setTab]=useState("solve"); const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const [listening,setListening]=useState(false); const [isDrawing,setIsDrawing]=useState(false); const [solvesUsed,setSolvesUsed]=useState(0); const [hasPaid,setHasPaid]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [teacherQ,setTeacherQ]=useState(""); const [teacherChat,setTeacherChat]=useState<any[]>([{role:"teacher", text:"Salam! Type any sum - 1 free"}]); const canvasRef=useRef<HTMLCanvasElement>(null); const [board,setBoard]=useState<any[]>([]);
  useEffect(()=>{ const s=localStorage.getItem("caps_solves"); const p=localStorage.getItem("caps_paid"); if(s) setSolvesUsed(parseInt(s)||0); if(p==="true") setHasPaid(true); 
    const ua=navigator.userAgent; if(/FBAN|FBAV|Instagram|WhatsApp/i.test(ua)){ setTimeout(()=>alert("For voice 🔊: Click 3 dots > Open in Chrome"),1000); }
    if(window.speechSynthesis) window.speechSynthesis.getVoices();
  },[]);
  const termTopics:any={1:["Whole Numbers","Exponents"],2:["Functions","Geometry"],3:["Exponents","Equations"],4:["Graphs","Data Handling"]};
  useEffect(()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); if(!ctx) return; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); },[]);
  const getPos=(e:any)=>{ const c=canvasRef.current!; const r=c.getBoundingClientRect(); return {x:(e.touches?e.touches[0].clientX:e.clientX)-r.left, y:(e.touches?e.touches[0].clientY:e.clientY)-r.top}; };
  const startDraw=(e:any)=>{ e.preventDefault(); setIsDrawing(true); const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.beginPath(); ctx.moveTo(x,y); };
  const draw=(e:any)=>{ e.preventDefault(); if(!isDrawing) return; const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.lineWidth=3; ctx.lineCap="round"; ctx.strokeStyle="white"; ctx.lineTo(x,y); ctx.stroke(); };
  const stopDraw=(e:any)=>{ if(e) e.preventDefault(); setIsDrawing(false); };
  const clearDraw=()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); };
  const startVoice=()=>{ try{ const W=window as any; const SR=W.webkitSpeechRecognition||W.SpeechRecognition; if(!SR){ alert("Open in Chrome app for mic"); return; } const rec=new SR(); rec.lang="en-US"; rec.onstart=()=>setListening(true); rec.onresult=(ev:any)=>{ setInput(p=>p+" "+ev.results[0][0].transcript); setListening(false); }; rec.onerror=()=>{ setListening(false); alert("Allow mic: Chrome > Settings > Site settings > Microphone"); }; rec.onend=()=>setListening(false); rec.start(); }catch{} };
  const speak=(t:string,e:string)=>{ try{ const W=window as any; if(!W.speechSynthesis) return; W.speechSynthesis.cancel(); const txt=(t+" . "+e).replace(/×/g," times ").replace(/÷/g," divide ").replace(/\*/g," times ").replace(/\//g," divided by ").slice(0,250); const u=new SpeechSynthesisUtterance(txt); u.rate=0.9; u.lang="en-US"; u.volume=1; const vs=W.speechSynthesis.getVoices(); if(vs.length>0){ const en=vs.find((v:any)=>v.lang.toLowerCase().includes("en")); if(en) u.voice=en; } W.speechSynthesis.speak(u); }catch{} };
  const press=(v:string)=>{ if(v==="AC"){ setInput(""); setBoard([]); return; } if(v==="DEL"){ setInput(p=>p.slice(0,-1)); return; } if(v==="="){ solveAny(); return; } setInput(p=>p + (v==="×"?" x ": v==="÷"?" ÷ ": v===","?"": v==="ON"? "": v + " ")); };
  const solveAny=()=>{
    if(!input.trim()){ alert("Type ANY sum"); return; }
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const raw=input.trim(); let nb:any=[];
    try{
      let expr = raw.replace(/x/g,"*").replace(/×/g,"*").replace(/÷/g,"/").replace(/²/g,"**2").replace(/=/g,"");
      const safe = expr.replace(/[^0-9+\-*/(). ]/g,"").trim();
      const finalAns = Function(`"use strict"; return (${safe})`)();
      nb.push({t:`Sum: ${raw}`, e:`We solve: ${raw}`});
      let cur=safe; let m;
      while((m=cur.match(/\(([^()]+)\)/))!==null){
        const inside=m[1]; const v=Function(`"use strict"; return (${inside})`)();
        nb.push({t:`Inside ( ) : ${inside} = ${v}`, e:`Brackets first:\n${inside} = ${v}\nNow: ${cur.replace(m[0], String(v))}`});
        cur=cur.replace(m[0], String(v));
      }
      let mdR=/(-?\d+(\.\d+)?)\s*([*\/])\s*(-?\d+(\.\d+)?)/;
      while((m=cur.match(mdR))!==null){
        const a=parseFloat(m[1]); const op=m[3]; const b=parseFloat(m[4]); const res=op==="*"?a*b:a/b; const sym=op==="*"?"×":"÷";
        nb.push({t:`Do ${sym}: ${a} ${sym} ${b} = ${res}`, e:`Have: ${cur}\nCalculate: ${a} ${sym} ${b} = ${res}\nBecomes: ${cur.replace(m[0], String(res))}`});
        cur=cur.replace(m[0], String(res));
      }
      let asR=/(-?\d+(\.\d+)?)\s*([+\-])\s*(-?\d+(\.\d+)?)/;
      let tmp=cur; if(tmp.startsWith("-")) tmp="0"+tmp;
      while((m=tmp.match(asR))!==null && /[+\-]/.test(tmp.slice(1))){
        const a=parseFloat(m[1]); const op=m[3]; const b=parseFloat(m[4]); const res=op==="+"?a+b:a-b;
        nb.push({t:`Do ${op}: ${a} ${op} ${b} = ${res}`, e:`Have: ${tmp}\nCalculate: ${a} ${op} ${b} = ${res}\nBecomes: ${tmp.replace(m[0], String(res))}`});
        tmp=tmp.replace(m[0], String(res));
      }
      nb.push({t:`✅ Answer: ${finalAns}`, e:`${raw} = ${finalAns}`});
    }catch{ nb=[{t:`Sum: ${raw}`, e:`Type like 2 x (3+4)`}]; }
    setBoard(nb); setStep(0); const nc=solvesUsed+1; setSolvesUsed(nc); localStorage.setItem("caps_solves", String(nc));
  };
  const askTeacher=()=>{ if(!teacherQ.trim()) return; if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; } setTeacherChat(prev=>[...prev, {role:"you", text:teacherQ}, {role:"teacher", text:`For ${teacherQ}`} ]); setTeacherQ(""); };
  const handlePay=()=>{ window.open("https://paystack.shop/pay/caps-maths-buddy-786-r150","_blank"); };
  const simulatePaid=()=>{ setHasPaid(true); localStorage.setItem("caps_paid","true"); setShowPaywall(false); };
  const resetTrial=()=>{ localStorage.removeItem("caps_solves"); localStorage.removeItem("caps_paid"); setSolvesUsed(0); setHasPaid(false); setShowPaywall(false); };
  const rowStyle={display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginBottom:5} as any;
  const btn = (label:string, color="#333", text="#FFD700")=>({padding:"14px 2px",background:color,color:text,borderRadius:8,border:"1px solid #444",fontSize:13,fontWeight:"bold"} as any);
  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:180}}>
      <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center",fontSize:10,color:"#0f0"}}>FINAL - {hasPaid?"UNLIMITED":`${1 - solvesUsed} FREE LEFT`}</p>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
        <button onClick={()=>setTab("solve")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="solve"?"#FFD700":"#333",color:tab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>CALC</button>
        <button onClick={()=>setTab("teacher")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="teacher"?"#0f0":"#333",color:tab==="teacher"?"black":"white",fontWeight:"bold",fontSize:11}}>Teacher</button>
        <button onClick={()=>setTab("mocks")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="mocks"?"#FFD700":"#333",color:tab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>Exam</button>
      </div>
      {showPaywall && (<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{background:"#111",border:"3px solid #FFD700",borderRadius:16,padding:20,maxWidth:340,width:"100%",textAlign:"center"}}><h2 style={{color:"#FFD700",margin:0}}>1 Free Used</h2><button onClick={handlePay} style={{width:"100%",marginTop:14,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold"}}>Pay R150</button><button onClick={simulatePaid} style={{width:"100%",marginTop:8,padding:8,background:"#222",color:"#777"}}>Test Paid</button><button onClick={resetTrial} style={{width:"100%",marginTop:8,padding:8,background:"#222",color:"#0f0",border:"1px solid #0f0"}}>Reset Free</button></div></div>)}
      {tab==="solve" && <>
        <div style={{background:"#111",padding:10,borderRadius:12,border:"2px solid #FFD700",marginTop:10}}>
          <div style={{background:"#c9d6a0",color:"black",padding:10,borderRadius:8,minHeight:60,border:"3px inset #888"}}><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="0" style={{width:"100%",background:"transparent",border:"none",color:"black",fontSize:18,fontWeight:"bold",fontFamily:"monospace",outline:"none",resize:"none"}} rows={2}/></div>
          <div style={{marginTop:10,background:"#222",padding:8,borderRadius:10,border:"2px solid #333"}}>
            <div style={rowStyle}><button onClick={()=>press("SHIFT")} style={btn("SHIFT","#555","#0f0")}>SHIFT</button><button onClick={()=>press("ALPHA")} style={btn("ALPHA","#555","#ff6b6b")}>ALPHA</button><button onClick={()=>press("MODE")} style={btn("MODE","#444","white")}>MODE</button><button onClick={()=>press("ON")} style={btn("ON","#444","white")}>ON</button><button onClick={()=>press("AC")} style={btn("AC","#ff4444","white")}>AC</button></div>
            <div style={rowStyle}><button onClick={()=>press("x⁻¹")} style={btn("x⁻¹")}>x⁻¹</button><button onClick={()=>press("√(")} style={btn("√")}>√</button><button onClick={()=>press("²")} style={btn("x²")}>x²</button><button onClick={()=>press("³")} style={btn("x³")}>x³</button><button onClick={()=>press("DEL")} style={btn("DEL","#ff9800","black")}>DEL</button></div>
            <div style={rowStyle}><button onClick={()=>press("7")} style={btn("7","#111","white")}>7</button><button onClick={()=>press("8")} style={btn("8","#111","white")}>8</button><button onClick={()=>press("9")} style={btn("9","#111","white")}>9</button><button onClick={()=>press("(")} style={btn("(","#444","#0f0")}>(</button><button onClick={()=>press(")")} style={btn(")","#444","#0f0")}>)</button></div>
            <div style={rowStyle}><button onClick={()=>press("4")} style={btn("4","#111","white")}>4</button><button onClick={()=>press("5")} style={btn("5","#111","white")}>5</button><button onClick={()=>press("6")} style={btn("6","#111","white")}>6</button><button onClick={()=>press("×")} style={btn("×","#444","#FFD700")}>×</button><button onClick={()=>press("÷")} style={btn("÷","#444","#FFD700")}>÷</button></div>
            <div style={rowStyle}><button onClick={()=>press("1")} style={btn("1","#111","white")}>1</button><button onClick={()=>press("2")} style={btn("2","#111","white")}>2</button><button onClick={()=>press("3")} style={btn("3","#111","white")}>3</button><button onClick={()=>press("+")} style={btn("+","#444","#FFD700")}>+</button><button onClick={()=>press("-")} style={btn("-","#444","#FFD700")}>-</button></div>
            <div style={rowStyle}><button onClick={()=>press("0")} style={btn("0","#111","white")}>0</button><button onClick={()=>press(".")} style={btn(".","#111","white")}>.</button><button onClick={()=>press("%")} style={btn("%","#444","white")}>%</button><button onClick={()=>press("π")} style={btn("π","#444","white")}>π</button><button onClick={()=>press("=")} style={btn("=","#0f0","black")}> = </button></div>
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}><button onClick={startVoice} style={{flex:1,padding:10,background:listening?"red":"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>{listening?"Listening...":"🎤 Speak sum"}</button><button onClick={clearDraw} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Clear Draw</button></div>
          <canvas ref={canvasRef} width={340} height={70} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{width:"100%",height:70,background:"black",borderRadius:8,border:"2px dashed #FFD700",touchAction:"none",display:"block",marginTop:6}}/>
          <button onClick={solveAny} style={{width:"100%",marginTop:8,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:14}}>✅ SOLVE - {hasPaid?"UNLIMITED":`${1 - solvesUsed} FREE`} 🔊</button>
        </div>
        <div style={{background:"white",color:"black",padding:10,borderRadius:12,minHeight:200,marginTop:10}}>
          {board.length===0 ? (<div style={{textAlign:"center",padding:30}}><p style={{fontSize:40,margin:0}}>🔢</p><p style={{fontSize:13,fontWeight:"bold"}}>Scientific Ready - Type 2 x (3+4)</p><p style={{fontSize:11,color:"#0f0",fontWeight:"bold"}}>{1 - solvesUsed} free left - Open in Chrome for voice</p></div>) : (<><p style={{margin:0,fontSize:11,fontWeight:"bold",background:"#FFEB3B",padding:6}}>Step {step+1}/{board.length}</p>{board.slice(0,step+1).map((b:any,i:number)=>{ const isActive=i===step; return (<div key={i} style={{margin:"10px 0",background:isActive?"#FFF9C4":"white",borderRadius:8,padding:10,borderLeft:isActive?"6px solid #0f0":"4px solid black",border:"1px solid #ddd"}}><p style={{margin:0,fontSize:12,fontWeight:"bold"}}>{i+1}. {b.t}</p><pre style={{background:isActive?"black":"#f5f5f5",color:isActive?"#ff9800":"black",padding:10,borderRadius:6,marginTop:6,fontSize:13,whiteSpace:"pre-wrap",fontWeight:"bold"}}>{b.e}</pre><button onClick={()=>speak(b.t,b.e)} style={{marginTop:6,padding:8,background:"#0f0",color:"black",borderRadius:6,border:"none",fontSize:11,fontWeight:"bold",width:"100%"}}>🔊 Hear</button></div>); })}</>)}
        </div>
        {board.length>0 && (<div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10,position:"sticky",bottom:160,background:"black",padding:8,borderRadius:20}}><button onClick={()=>setStep(s=>Math.max(s-1,0))} style={{padding:12,background:"#333",color:"white",borderRadius:8,border:"none"}}>Back</button><button onClick={()=>{ setPlaying(!playing); if(board[step]) speak(board[step].t, board[step].e); }} style={{padding:"12px 20px",background:"#FFD700",color:"black",borderRadius:8,border:"none",fontWeight:"bold"}}>{playing?"Pause":"🔊 Play"}</button><button onClick={()=>setStep(s=>Math.min(s+1,board.length-1))} style={{padding:12,background:"#333",color:"white",borderRadius:8,border:"none"}}>Next</button></div>)}
      </>}
      {tab==="teacher" && (<div style={{background:"#111",border:"2px solid #0f0",padding:10,borderRadius:12,marginTop:10}}><h3 style={{margin:0,color:"#0f0",fontSize:13}}>Ask Teacher</h3><div style={{background:"black",borderRadius:8,padding:8,height:300,overflowY:"auto",marginTop:8,border:"1px solid #333"}}>{teacherChat.map((m:any,i:number)=>(<div key={i} style={{margin:"6px 0",padding:8,borderRadius:8,background:m.role==="you"?"#333":"#0a2a0a"}}><pre style={{margin:0,fontSize:11,whiteSpace:"pre-wrap",color:"white"}}>{m.text}</pre></div>))}</div><div style={{display:"flex",gap:6,marginTop:8}}><input value={teacherQ} onChange={e=>setTeacherQ(e.target.value)} placeholder="Ask any" style={{flex:1,padding:8,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:11}}/><button onClick={askTeacher} style={{padding:"8px 14px",background:"#0f0",color:"black",borderRadius:8,border:"none",fontWeight:"bold",fontSize:11}}>Ask</button></div></div>)}
      {tab==="mocks" && (<div style={{background:"#111",border:"2px solid #FFD700",padding:12,borderRadius:12,marginTop:10}}><h3 style={{margin:0,color:"#FFD700",fontSize:15}}>Exam Prep Term {term}</h3><div style={{display:"flex",gap:6,marginTop:10}}>{[1,2,3,4].map(t=>(<button key={t} onClick={()=>setTerm(t)} style={{flex:1,padding:"14px 4px",borderRadius:12,border:term===t?"3px solid #FFD700":"1px solid #333",background:term===t?"#0f0":"#222",color:term===t?"black":"white",fontWeight:"bold",fontSize:13}}>Term {t}</button>))}</div><div style={{background:"#111",borderRadius:8,padding:10,marginTop:10,border:"1px solid #333"}}>{termTopics[term].map((tp:string,i:number)=><p key={i} style={{margin:"4px 0",color:"white",fontSize:11}}>• {tp}</p>)}</div></div>)}
      <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #FFD700",padding:"12px",zIndex:40}}><div style={{textAlign:"center"}}><p style={{color:"#FFD700",fontSize:13,fontWeight:"bold",margin:0}}>CAPS MATHS BUDDY 786</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0"}}>Cape Town | support@capsmathsbuddy.co.za</p></div></footer>
    </div>
  );
    }
