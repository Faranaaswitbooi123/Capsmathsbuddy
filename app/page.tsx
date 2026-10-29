// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [input,setInput]=useState("2 x (3+4)");
  const [tab,setTab]=useState("any");
  const [grade,setGrade]=useState(8);
  const [lang,setLang]=useState("English");
  const [term,setTerm]=useState(2);
  const [step,setStep]=useState(0);
  const [solvesUsed,setSolvesUsed]=useState(0);
  const [hasPaid,setHasPaid]=useState(false);
  const [showPaywall,setShowPaywall]=useState(false);
  const [board,setBoard]=useState([]);
  const [listening,setListening]=useState(false);
  const [teacherQ,setTeacherQ]=useState("");
  const [teacherChat,setTeacherChat]=useState([{role:"teacher", text:"Salam! CAPS Teacher Gr 8-12 - Ask any CAPS sum"}]);
  const [examAns,setExamAns]=useState("");
  const [examRes,setExamRes]=useState("");
  const canvasRef=useRef(null);
  const [isDrawing,setIsDrawing]=useState(false);
  const capsTopics={
    8:{1:"Whole Numbers - CAPS",2:"Algebra Equations - CAPS",3:"Geometry Pythagoras - CAPS",4:"Data Finance - CAPS"},
    9:{1:"Exponents - CAPS",2:"Algebra Factorisation - CAPS",3:"Geometry Trig - CAPS",4:"Stats Finance - CAPS"},
    10:{1:"Algebra Expressions - CAPS",2:"Algebra Factorisation - CAPS",3:"Geometry Trig - CAPS",4:"Stats Finance - CAPS"},
    11:{1:"Algebra Patterns - CAPS",2:"Algebra Functions - CAPS",3:"Geometry Trig - CAPS",4:"Finance Stats - CAPS"},
    12:{1:"Number Patterns - CAPS",2:"Calculus - CAPS",3:"Trig Geometry - CAPS",4:"Stats Exam Revision - CAPS"}
  };
  const capsMocks={
    8:{1:{q:"Term 1 - Gr8: 12 + 3 x 4",a:"24"},2:{q:"Term 2 - Gr8: Solve 2x+3=11",a:"4"},3:{q:"Term 3 - Gr8: Pythagoras 3,4",a:"5"},4:{q:"Term 4 - Gr8: Mean 2,4,6,8",a:"5"}},
    9:{1:{q:"Term 1 - Gr9: 2^3 x 2^2",a:"32"},2:{q:"Term 2 - Gr9: Factor x^2-9",a:"(x-3)(x+3)"},3:{q:"Term 3 - Gr9: Area triangle",a:"12"},4:{q:"Term 4 - Gr9: Interest",a:"200"}},
    10:{1:{q:"Term 1 - Gr10: 3(x+2)=21",a:"5"},2:{q:"Term 2 - Gr10: x^2+5x+6",a:"(x+2)(x+3)"},3:{q:"Term 3 - Gr10: sin30",a:"0.5"},4:{q:"Term 4 - Gr10: Prob",a:"0.5"}},
    11:{1:{q:"Term 1 - Gr11: 2x^2=8",a:"2 or -2"},2:{q:"Term 2 - Gr11: b^2-4ac",a:"real"},3:{q:"Term 3 - Gr11: deriv x^2",a:"2x"},4:{q:"Term 4 - Gr11: compound",a:"A=P(1+i)^n"}},
    12:{1:{q:"Term 1 - Gr12: 2,5,8 next",a:"11"},2:{q:"Term 2 - Gr12: deriv x^2",a:"2x"},3:{q:"Term 3 - Gr12: sin x=0.5",a:"30"},4:{q:"Term 4 - Gr12: Matric",a:"Revision"}}
  };
  const langMap={
    English:{bracket:"CAPS BODMAS Brackets (M1)",times:"CAPS Multiplication (M1)",plus:"CAPS Addition Inverse (M1)",answer:"CAPS Answer (A1)"},
    Afrikaans:{bracket:"CAPS Hakies (M1)",times:"CAPS Vermenigvuldiging (M1)",plus:"CAPS Optelling (M1)",answer:"CAPS Antwoord (A1)"},
    isiXhosa:{bracket:"CAPS Izibiyeli (M1)",times:"CAPS Ukuphindaphinda (M1)",plus:"CAPS Ukudibanisa (M1)",answer:"CAPS Impendulo (A1)"},
    isiZulu:{bracket:"CAPS Abakaki (M1)",times:"CAPS Ukuphindaphinda (M1)",plus:"CAPS Ukwengeza (M1)",answer:"CAPS Impendulo (A1)"}
  };
  useEffect(()=>{
    try{
      localStorage.removeItem("caps_solves");
      const s=localStorage.getItem("caps_CAPS_v6_solves");
      const p=localStorage.getItem("caps_CAPS_v6_paid");
      if(s) setSolvesUsed(parseInt(s)||0);
      if(p==="true") setHasPaid(true);
      if(window.speechSynthesis) window.speechSynthesis.getVoices();
      const c=canvasRef.current;
      if(c){ const ctx=c.getContext("2d"); if(ctx){ ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); } }
    }catch{}
  },[]);
  const getPos=(e)=>{
    const c=canvasRef.current; const r=c.getBoundingClientRect();
    return {x:(e.touches?e.touches[0].clientX:e.clientX)-r.left, y:(e.touches?e.touches[0].clientY:e.clientY)-r.top};
  };
  const startDraw=(e)=>{ e.preventDefault(); setIsDrawing(true); const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  const draw=(e)=>{ e.preventDefault(); if(!isDrawing) return; const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); const p=getPos(e); ctx.lineWidth=3; ctx.lineCap="round"; ctx.strokeStyle="white"; ctx.lineTo(p.x,p.y); ctx.stroke(); };
  const stopDraw=(e)=>{ if(e) e.preventDefault(); setIsDrawing(false); };
  const clearDraw=()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); };
  const startVoice=()=>{
    try{
      const W=window; const SR=W.webkitSpeechRecognition||W.SpeechRecognition;
      if(!SR){ alert("Open in Chrome"); return; }
      const rec=new SR(); rec.lang="en-US";
      rec.onresult=(ev)=>{ setInput(ev.results[0][0].transcript); setListening(false); };
      rec.onerror=()=>setListening(false); rec.onend=()=>setListening(false);
      rec.start(); setListening(true);
    }catch{}
  };
  const speak=(t,e)=>{
    try{ const W=window; W.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance((t+" . "+e).replace(/×/g," times ").slice(0,300)); u.lang="en-US"; u.rate=0.9; W.speechSynthesis.speak(u); }catch{}
  };
  const speakAll=()=>{
    try{
      const W=window; W.speechSynthesis.cancel();
      board.forEach((b)=>{
        const u=new SpeechSynthesisUtterance((b.t+" . "+b.e).replace(/×/g," times ").replace(/÷/g," divide ").slice(0,400));
        u.lang="en-US"; u.rate=0.9; W.speechSynthesis.speak(u);
      });
    }catch{}
  };
  const stopSpeak=()=>{ try{ window.speechSynthesis.cancel(); }catch{} };
  const press=(v)=>{ if(v==="Clear"){ setInput(""); setBoard([]); stopSpeak(); return; } setInput(p=>p + (v==="×"?" x ": v==="÷"?" ÷ ": v+" ")); };
  const checkFree=()=>{ if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return false; } return true; };
  const solveAny=()=>{
    let raw=input.trim().replace(/=$/,"").trim(); if(!raw) return; if(!checkFree()) return;
    let nb=[]; const lm=langMap[lang]||langMap.English;
    try{
      let expr=raw.replace(/x/g,"*").replace(/×/g,"*").replace(/÷/g,"/").replace(/²/g,"**2").replace(/³/g,"**3").replace(/=/g,"");
      const safe=expr.replace(/[^0-9+\-*/(). ]/g,"").trim();
      const ans=Function('"use strict"; return ('+safe+')')();
      nb.push({t:"[CAPS Gr"+grade+" Term "+term+" - "+capsTopics[grade][term]+"] Sum: "+raw, e:"CAPS: "+capsTopics[grade][term]+" - We solve: "+raw});
      let cur=safe; let m;
      while((m=cur.match(/\(([^()]+)\)/))!==null){
        const v=Function('"use strict"; return ('+m[1]+')')();
        nb.push({t:lm.bracket+": "+m[1]+" = "+v, e:"BODMAS Brackets (M1) - "+m[1]+" = "+v});
        cur=cur.replace(m[0], String(v));
      }
      let mdR=/(-?\d+(\.\d+)?)\s*([*\/])\s*(-?\d+(\.\d+)?)/;
      while((m=cur.match(mdR))!==null){
        const a=parseFloat(m[1]); const b=parseFloat(m[4]); const r=m[3]==="*"?a*b:a/b; const s=m[3]==="*"?"x":"div";
        nb.push({t:lm.times+": "+a+" "+s+" "+b+" = "+r, e:"Multiplication (M1) - "+a+" "+s+" "+b+" = "+r});
        cur=cur.replace(m[0], String(r));
      }
      let asR=/(-?\d+(\.\d+)?)\s*([+\-])\s*(-?\d+(\.\d+)?)/; let tmp=cur; if(tmp.startsWith("-")) tmp="0"+tmp;
      while((m=tmp.match(asR))!==null && /[+\-]/.test(tmp.slice(1))){
        const a=parseFloat(m[1]); const b=parseFloat(m[4]); const r=m[3]==="+"?a+b:a-b;
        nb.push({t:lm.plus+": "+a+" "+m[3]+" "+b+" = "+r, e:"Additive Inverse (M1) - "+a+" "+m[3]+" "+b+" = "+r});
        tmp=tmp.replace(m[0], String(r));
      }
      nb.push({t:"Answer: "+ans+" (A1)", e:"Final CAPS Answer: "+raw+" = "+ans});
    }catch{ nb=[{t:"[CAPS] Sum: "+raw, e:"Type like 2 x (3+4) - CAPS BODMAS"}]; }
    setBoard(nb); setStep(0);
    const nc=solvesUsed+1; setSolvesUsed(nc);
    try{ localStorage.setItem("caps_CAPS_v6_solves", String(nc)); }catch{}
    setTimeout(()=>{
      try{
        const W=window; W.speechSynthesis.cancel();
        nb.forEach((b)=>{
          const u=new SpeechSynthesisUtterance((b.t+" . "+b.e).replace(/×/g," times ").slice(0,400));
          u.lang="en-US"; u.rate=0.9; W.speechSynthesis.speak(u);
        });
      }catch{}
    },600);
  };
  const askTeacher=()=>{
    if(!teacherQ.trim()) return; if(!checkFree()) return;
    setTeacherChat(prev=>[...prev, {role:"you", text:teacherQ}, {role:"teacher", text:"[CAPS Gr "+grade+" Term "+term+"] "+capsTopics[grade][term]+" - Method: "+teacherQ+" - Use CAPS BODMAS (M1)"}]);
    setTeacherQ(""); const nc=solvesUsed+1; setSolvesUsed(nc);
    try{ localStorage.setItem("caps_CAPS_v6_solves", String(nc)); }catch{}
  };
  const checkMock=()=>{
    if(!checkFree()) return;
    const correct=capsMocks[grade][term].a.toLowerCase();
    if(examAns.toLowerCase().includes(correct.toLowerCase()) || correct.includes(examAns.toLowerCase())){ setExamRes("Correct! "+capsMocks[grade][term].a+" (A1)"); }
    else{ setExamRes("Try again - Hint: "+capsMocks[grade][term].a+" (M1)"); }
    const nc=solvesUsed+1; setSolvesUsed(nc);
    try{ localStorage.setItem("caps_CAPS_v6_solves", String(nc)); }catch{}
  };
  const kStyle={padding:"10px 0px",background:"#222",color:"#FFD700",borderRadius:"6px",border:"1px solid #444",fontSize:"12px",fontWeight:"bold"};
  const row={display:"grid",gridTemplateColumns:"repeat(13,1fr)",gap:"4px",marginBottom:"4px"};
  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:"8px"}}>
      <h2 style={{textAlign:"center",color:"#FFD700",margin:"0px"}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center",fontSize:"10px",color:"#0f0",margin:"2px 0px"}}>100% DBE CAPS 2026 - Gr {grade} Term {term}</p>
      <p style={{textAlign:"center",fontSize:"10px",color:"#aaa",margin:"0px"}}>{capsTopics[grade][term]} - {lang} - {hasPaid?"UNLIMITED":(1-solvesUsed)+" FREE"}</p>
      <div style={{display:"flex",gap:"4px",justifyContent:"center",margin:"6px 0px"}}>
        {[8,9,10,11,12].map(g=>(
          <button key={g} onClick={()=>setGrade(g)} style={{flex:1,padding:"8px 2px",borderRadius:"8px",border:grade===g?"2px solid #FFD700":"1px solid #333",background:grade===g?"#FFD700":"#222",color:grade===g?"black":"white",fontWeight:"bold",fontSize:"12px"}}>Gr {g}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:"4px",justifyContent:"center",margin:"6px 0px"}}>
        {["English","Afrikaans","isiXhosa","isiZulu"].map(l=>(
          <button key={l} onClick={()=>setLang(l)} style={{flex:1,padding:"6px 2px",borderRadius:"8px",border:lang===l?"2px solid #0f0":"1px solid #333",background:lang===l?"#0f0":"#222",color:lang===l?"black":"white",fontWeight:"bold",fontSize:"10px"}}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:"6px",justifyContent:"center",margin:"8px 0px"}}>
        <button onClick={()=>setTab("any")} style={{padding:"8px 14px",borderRadius:"20px",border:"none",background:tab==="any"?"#FFD700":"#333",color:tab==="any"?"black":"white",fontWeight:"bold",fontSize:"11px"}}>ANY CAPS {hasPaid?"∞":(1-solvesUsed)+" free"}</button>
        <button onClick={()=>setTab("teacher")} style={{padding:"8px 14px",borderRadius:"20px",border:"none",background:tab==="teacher"?"#FFD700":"#333",color:tab==="teacher"?"black":"white",fontWeight:"bold",fontSize:"11px"}}>CAPS Teacher</button>
        <button onClick={()=>setTab("exam")} style={{padding:"8px 14px",borderRadius:"20px",border:"none",background:tab==="exam"?"#FFD700":"#333",color:tab==="exam"?"black":"white",fontWeight:"bold",fontSize:"11px"}}>CAPS Mocks Term 1-4</button>
      </div>
      {showPaywall && (
        <div style={{position:"fixed",top:"0px",left:"0px",right:"0px",bottom:"0px",background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div style={{background:"#111",border:"3px solid #FFD700",borderRadius:"16px",padding:"20px",width:"100%",maxWidth:"340px",textAlign:"center"}}>
            <h3 style={{color:"#FFD700"}}>1 Free Trial Used</h3>
            <p style={{color:"white",fontSize:"12px"}}>Pay R150/month for unlimited CAPS Gr8-12</p>
            <button onClick={()=>window.open("https://paystack.shop/pay/caps-maths-buddy-786-r150","_blank")} style={{width:"100%",padding:"14px",background:"#0f0",color:"black",borderRadius:"10px",border:"none",fontWeight:"bold",marginTop:"10px"}}>Pay R150 - Unlock</button>
            <button onClick={()=>setShowPaywall(false)} style={{width:"100%",marginTop:"10px",padding:"8px",background:"#333",color:"white",borderRadius:"8px",border:"none"}}>Close</button>
          </div>
        </div>
      )}
      {tab==="any" && (
        <div style={{border:"2px solid #FFD700",borderRadius:"10px",padding:"8px",background:"black"}}>
          <div style={{background:"#e8f5c8",border:"3px solid #0f0",borderRadius:"8px",padding:"8px"}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)} style={{width:"100%",background:"transparent",border:"none",color:"black",fontSize:"16px",fontWeight:"bold",outline:"none",resize:"none"}} rows={2}></textarea>
            <p style={{margin:"4px 0px 0px 0px",fontSize:"9px",color:"#333"}}>CAPS Topic: {capsTopics[grade][term]}</p>
          </div>
          <div style={{marginTop:"8px"}}>
            <div style={row}>
              <button onClick={()=>press("7")} style={kStyle}>7</button><button onClick={()=>press("8")} style={kStyle}>8</button><button onClick={()=>press("9")} style={kStyle}>9</button><button onClick={()=>press("()")} style={kStyle}>()</button><button onClick={()=>press("x")} style={kStyle}>x</button><button onClick={()=>press("=")} style={kStyle}>=</button><button onClick={()=>press("÷")} style={kStyle}>÷</button><button onClick={()=>press("4")} style={kStyle}>4</button><button onClick={()=>press("5")} style={kStyle}>5</button><button onClick={()=>press("6")} style={kStyle}>6</button><button onClick={()=>press("+")} style={kStyle}>+</button><button onClick={()=>press("-")} style={kStyle}>-</button><button onClick={()=>press("×")} style={kStyle}>x</button>
            </div>
            <div style={row}>
              <button onClick={()=>press("√")} style={kStyle}>√</button><button onClick={()=>press("1")} style={kStyle}>1</button><button onClick={()=>press("2")} style={kStyle}>2</button><button onClick={()=>press("3")} style={kStyle}>3</button><button onClick={()=>press("²")} style={kStyle}>²</button><button onClick={()=>press("³")} style={kStyle}>³</button><button onClick={()=>press("AB")} style={kStyle}>AB</button><button onClick={()=>press("0")} style={kStyle}>0</button><button onClick={()=>press(".")} style={kStyle}>.</button><button onClick={()=>press("Δ")} style={kStyle}>Δ</button><button onClick={()=>press("∠")} style={kStyle}>∠</button><button onClick={()=>press("°")} style={kStyle}>°</button><button onClick={()=>press("%")} style={kStyle}>%</button>
            </div>
          </div>
          <div style={{display:"flex",gap:"6px",marginTop:"8px"}}>
            <button onClick={startVoice} style={{flex:1,padding:"10px",background:"#222",color:"white",borderRadius:"8px",border:"1px solid #444",fontSize:"12px"}}>{listening?"Listening...":"Speak CAPS Sum"}</button>
            <button onClick={clearDraw} style={{padding:"10px 14px",background:"#222",color:"white",borderRadius:"8px",border:"1px solid #444",fontSize:"12px"}}>Clear Board</button>
            <button onClick={()=>{ setInput(""); setBoard([]); clearDraw(); stopSpeak(); }} style={{padding:"10px 14px",background:"#333",color:"white",borderRadius:"8px",border:"1px solid #444",fontSize:"12px"}}>Clear All</button>
          </div>
          <div style={{marginTop:"8px"}}>
            <p style={{color:"#FFD700",fontSize:"11px",margin:"4px 0px"}}>Chalkboard</p>
            <canvas ref={canvasRef} width={340} height={90} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{width:"100%",height:"90px",background:"black",borderRadius:"8px",border:"2px dashed #FFD700",touchAction:"none",display:"block"}}></canvas>
          </div>
          <div style={{border:"2px dashed #FFD700",borderRadius:"8px",minHeight:"120px",marginTop:"8px",padding:"8px",background:"black"}}>
            {board.length===0 ? <p style={{color:"#777",fontSize:"12px",textAlign:"center",marginTop:"30px"}}>Gr {grade} Term {term} - Press SOLVE - Lady talks auto start to end</p> : board.map((b,i)=>(
              <div key={i} style={{background:i===step?"#FFF9C4":"#111",color:i===step?"black":"white",padding:"10px",borderRadius:"8px",marginBottom:"8px",borderLeft:i===step?"6px solid #0f0":"3px solid #444"}}>
                <p style={{margin:"0px",fontSize:"13px",fontWeight:"bold"}}>{i+1}. {b.t}</p>
                <pre style={{margin:"6px 0px 0px 0px",fontSize:"13px",whiteSpace:"pre-wrap",background:i===step?"black":"#222",color:i===step?"#ff9800":"#0f0",padding:"10px",borderRadius:"6px",fontWeight:"bold"}}>{b.e}</pre>
                <button onClick={()=>{ setStep(i); speak(b.t,b.e); }} style={{width:"100%",marginTop:"6px",padding:"6px",background:i===step?"#0f0":"#333",color:i===step?"black":"white",borderRadius:"6px",border:"none",fontSize:"11px",fontWeight:"bold"}}>Hear Step {i+1}</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"8px",justifyContent:"center",marginTop:"10px"}}>
            <button onClick={()=>{ setStep(s=>Math.max(0,s-1)); stopSpeak(); }} style={{padding:"10px 16px",background:"#333",color:"white",borderRadius:"8px",border:"none"}}>Back</button>
            <button onClick={speakAll} style={{padding:"10px 20px",background:"#FFD700",color:"black",borderRadius:"20px",border:"none",fontWeight:"bold"}}>Play ALL Start to End</button>
            <button onClick={stopSpeak} style={{padding:"10px 16px",background:"#f44336",color:"white",borderRadius:"8px",border:"none"}}>Stop</button>
            <button onClick={()=>setStep(s=>Math.min(board.length-1,s+1))} style={{padding:"10px 16px",background:"#333",color:"white",borderRadius:"8px",border:"none"}}>Next</button>
          </div>
          <button onClick={solveAny} style={{width:"100%",marginTop:"12px",padding:"14px",background:"#0f0",color:"black",borderRadius:"8px",border:"none",fontWeight:"bold",fontSize:"14px"}}>SOLVE CAPS - Auto Talk</button>
        </div>
      )}
      {tab==="teacher" && (
        <div style={{background:"#111",border:"2px solid #0f0",padding:"12px",borderRadius:"12px",marginTop:"10px"}}>
          <h3 style={{color:"#0f0",margin:"0px",fontSize:"14px"}}>CAPS Teacher - Gr {grade} Term {term}</h3>
          <p style={{color:"#aaa",fontSize:"10px",margin:"2px 0px"}}>{capsTopics[grade][term]} - Stays in app</p>
          <div style={{background:"black",borderRadius:"8px",padding:"8px",height:"250px",overflowY:"auto",marginTop:"8px",border:"1px solid #333"}}>
            {teacherChat.map((m,i)=>(
              <div key={i} style={{margin:"6px 0px",padding:"8px",borderRadius:"8px",background:m.role==="you"?"#333":"#0a2a0a"}}>
                <p style={{margin:"0px",fontSize:"12px",color:"white"}}>{m.text}</p>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"6px",marginTop:"8px"}}>
            <input value={teacherQ} onChange={e=>setTeacherQ(e.target.value)} placeholder="Ask CAPS sum" style={{flex:1,padding:"10px",borderRadius:"8px",background:"black",color:"white",border:"2px solid #0f0"}} />
            <button onClick={askTeacher} style={{padding:"10px 14px",background:"#0f0",color:"black",borderRadius:"8px",border:"none",fontWeight:"bold"}}>Ask CAPS</button>
          </div>
        </div>
      )}
      {tab==="exam" && (
        <div style={{background:"#111",border:"2px solid #FFD700",padding:"12px",borderRadius:"12px",marginTop:"10px"}}>
          <h3 style={{color:"#FFD700",margin:"0px",fontSize:"14px"}}>CAPS Exam Mocks - Gr {grade}</h3>
          <div style={{display:"flex",gap:"6px",marginTop:"10px"}}>
            {[1,2,3,4].map(t=>(
              <button key={t} onClick={()=>setTerm(t)} style={{f
