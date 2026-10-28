// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
export default function Home(){
  const [input,setInput]=useState("2 x (3+4)"); const [tab,setTab]=useState("any"); const [term,setTerm]=useState(2); const [step,setStep]=useState(0); const [solvesUsed,setSolvesUsed]=useState(0); const [hasPaid,setHasPaid]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [board,setBoard]=useState<any[]>([]); const [listening,setListening]=useState(false); const [teacherQ,setTeacherQ]=useState(""); const [teacherChat,setTeacherChat]=useState<any[]>([{role:"teacher", text:"Salam! Ask any sum"}]);
  useEffect(()=>{ const s=localStorage.getItem("caps_solves"); const p=localStorage.getItem("caps_paid"); if(s) setSolvesUsed(parseInt(s)||0); if(p==="true") setHasPaid(true); if(window.speechSynthesis) window.speechSynthesis.getVoices(); },[]);
  const termTopics:any={1:["Whole Numbers","Exponents"],2:["Functions","Geometry"],3:["Exponents","Equations"],4:["Graphs","Data Handling"]};
  const startVoice=()=>{ try{ const W=window as any; const SR=W.webkitSpeechRecognition||W.SpeechRecognition; if(!SR){ alert("Open in Chrome for mic"); return; } const rec=new SR(); rec.lang="en-US"; rec.onstart=()=>setListening(true); rec.onresult=(ev:any)=>{ setInput(ev.results[0][0].transcript); setListening(false); }; rec.onerror=()=>setListening(false); rec.onend=()=>setListening(false); rec.start(); }catch{} };
  const speak=(t:string,e:string)=>{ try{ const W=window as any; W.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance((t+". "+e).replace(/×/g," times ").replace(/÷/g," divide ").slice(0,300)); u.lang="en-US"; u.rate=0.9; W.speechSynthesis.speak(u); }catch{} };
  const press=(v:string)=>{ if(v==="Clear"){ setInput(""); setBoard([]); return; } setInput(p=>p + (v==="×"?" x ": v==="÷"?" ÷ ": v+" ")); };
  const solveAny=()=>{
    let raw=input.trim().replace(/=$/,"").trim(); if(!raw) return; if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    let nb:any=[]; try{
      let expr=raw.replace(/x/g,"*").replace(/×/g,"*").replace(/÷/g,"/").replace(/²/g,"**2").replace(/³/g,"**3").replace(/=/g,"");
      const safe=expr.replace(/[^0-9+\-*/(). ]/g,"").trim(); 
      const finalAns=Function(`"use strict"; return (${safe})`)();
      nb.push({t:`Sum: ${raw}`, e:`We must solve: ${raw}\nBODMAS - Brackets first`});
      let cur=safe; let m; 
      while((m=cur.match(/\(([^()]+)\)/))!==null){ 
        const inside=m[1]; const v=Function(`"use strict"; return (${inside})`)(); 
        nb.push({t:`Inside ( ): ${inside} = ${v}`, e:`Brackets first:\n${inside} = ${v}\nExpression now: ${cur.replace(m[0], String(v))}`}); 
        cur=cur.replace(m[0], String(v)); 
      }
      let mdR=/(-?\d+(\.\d+)?)\s*([*\/])\s*(-?\d+(\.\d+)?)/; 
      while((m=cur.match(mdR))!==null){ 
        const a=parseFloat(m[1]); const b=parseFloat(m[4]); const res=m[3]==="*"?a*b:a/b; const sym=m[3]==="*"?"×":"÷"; 
        nb.push({t:`Do ${sym}: ${a} ${sym} ${b} = ${res}`, e:`We have: ${cur}\nDo ${sym} exactly:\n${a} ${sym} ${b} = ${res}\nBecomes: ${cur.replace(m[0], String(res))}`}); 
        cur=cur.replace(m[0], String(res)); 
      }
      let asR=/(-?\d+(\.\d+)?)\s*([+\-])\s*(-?\d+(\.\d+)?)/; let tmp=cur; if(tmp.startsWith("-")) tmp="0"+tmp; 
      while((m=tmp.match(asR))!==null && /[+\-]/.test(tmp.slice(1))){ 
        const a=parseFloat(m[1]); const b=parseFloat(m[4]); const res=m[3]==="+"?a+b:a-b; 
        nb.push({t:`Do ${m[3]}: ${a} ${m[3]} ${b} = ${res}`, e:`Have: ${tmp}\nCalculate: ${a} ${m[3]} ${b} = ${res}\nNow: ${tmp.replace(m[0], String(res))}`}); 
        tmp=tmp.replace(m[0], String(res)); 
      }
      nb.push({t:`✅ Answer: ${finalAns}`, e:`Final answer:\n${raw} = ${finalAns}`});
    }catch(e){ nb=[{t:`Sum: ${raw}`, e:`Type like 2 x (3+4)`}]; }
    setBoard(nb); setStep(0); 
    const nc=solvesUsed+1; setSolvesUsed(nc); localStorage.setItem("caps_solves", String(nc));
    // Auto speak first step
    setTimeout(()=>{ if(nb[0]) speak(nb[0].t, nb[0].e); },500);
  };
  const askTeacher=()=>{ if(!teacherQ.trim()) return; if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; } setTeacherChat(prev=>[...prev, {role:"you", text:teacherQ}, {role:"teacher", text:`For ${teacherQ} - Do brackets first`} ]); setTeacherQ(""); };
  const kBtn=(l:string)=>({padding:"10px 0px",background:"#222",color:"#FFD700",borderRadius:6,border:"1px solid #444",fontSize:12,fontWeight:"bold"} as any);
  const rowStyle={display:"grid",gridTemplateColumns:"repeat(13,1fr)",gap:4,marginBottom:4} as any;
  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:8}}>
      <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center",fontSize:11,color:"#0f0",margin:"4px 0"}}>OPEN TO ANY SUM - {hasPaid?"UNLIMITED":`${1 - solvesUsed} FREE LEFT`}</p>
      <div style={{display:"flex",gap:6,justifyContent:"center",margin:"8px 0"}}>
        <button onClick={()=>setTab("any")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:tab==="any"?"#FFD700":"#333",color:tab==="any"?"black":"white",fontWeight:"bold",fontSize:11}}>ANY {1 - solvesUsed} free</button>
        <button onClick={()=>setTab("teacher")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:tab==="teacher"?"#FFD700":"#333",color:tab==="teacher"?"black":"white",fontSize:11}}>Ask Teacher</button>
        <button onClick={()=>setTab("exam")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:tab==="exam"?"#FFD700":"#333",color:tab==="exam"?"black":"white",fontSize:11}}>Exam Prep</button>
      </div>
      {showPaywall && (<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{background:"#111",border:"3px solid #FFD700",borderRadius:16,padding:20,width:"100%",maxWidth:340,textAlign:"center"}}><h3 style={{color:"#FFD700",margin:0}}>1 Free Used</h3><p style={{color:"white",fontSize:12,marginTop:8}}>R150/month unlocks unlimited sums, teacher, exam</p><p style={{color:"#aaa",fontSize:10}}>Uitenhage, Eastern Cape</p><button onClick={()=>window.open("https://paystack.shop/pay/caps-maths-buddy-786-r150","_blank")} style={{width:"100%",padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",marginTop:14}}>Pay R150 - Unlock</button><button onClick={()=>setShowPaywall(false)} style={{width:"100%",marginTop:10,padding:8,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:12}}>Close</button></div></div>)}
      {tab==="any" && (
      <div style={{border:"2px solid #FFD700",borderRadius:10,padding:8,background:"black"}}>
        <div style={{background:"#e8f5c8",border:"3px solid #0f0",borderRadius:8,padding:8}}><textarea value={input} onChange={e=>setInput(e.target.value)} style={{width:"100%",background:"transparent",border:"none",color:"black",fontSize:16,fontWeight:"bold",outline:"none",resize:"none"}} rows={2}/></div>
        <div style={{marginTop:8}}><div style={rowStyle}><button onClick={()=>press("7")} style={kBtn("7")}>7</button><button onClick={()=>press("8")} style={kBtn("8")}>8</button><button onClick={()=>press("9")} style={kBtn("9")}>9</button><button onClick={()=>press("()")} style={kBtn("()")}>()</button><button onClick={()=>press("x")} style={kBtn("x")}>x</button><button onClick={()=>press("=")} style={kBtn("=")}>=</button><button onClick={()=>press("÷")} style={kBtn("÷")}>÷</button><button onClick={()=>press("4")} style={kBtn("4")}>4</button><button onClick={()=>press("5")} style={kBtn("5")}>5</button><button onClick={()=>press("6")} style={kBtn("6")}>6</button><button onClick={()=>press("+")} style={kBtn("+")}>+</button><button onClick={()=>press("-")} style={kBtn("-")}>-</button><button onClick={()=>press("×")} style={kBtn("×")}>×</button></div><div style={rowStyle}><button onClick={()=>press("√")} style={kBtn("√")}>√</button><button onClick={()=>press("1")} style={kBtn("1")}>1</button><button onClick={()=>press("2")} style={kBtn("2")}>2</button><button onClick={()=>press("3")} style={kBtn("3")}>3</button><button onClick={()=>press("²")} style={kBtn("²")}>²</button><button onClick={()=>press("³")} style={kBtn("³")}>³</button><button onClick={()=>press("AB")} style={kBtn("AB")}>AB</button><button onClick={()=>press("0")} style={kBtn("0")}>0</button><button onClick={()=>press(".")} style={kBtn(".")}>.</button><button onClick={()=>press("Δ")} style={kBtn("Δ")}>Δ</button><button onClick={()=>press("∠")} style={kBtn("∠")}>∠</button><button onClick={()=>press("°")} style={kBtn("°")}>°</button><button onClick={()=>press("%")} style={kBtn("%")}>%</button></div></div>
        <div style={{display:"flex",gap:6,marginTop:8}}><button onClick={startVoice} style={{flex:1,padding:10,background:"#222",color:"white",borderRadius:8,border:"1px solid #444",fontSize:12}}>{listening?"Listening...":"🎤 Speak"}</button><button onClick={()=>{ setInput(""); setBoard([]); }} style={{padding:"10px 14px",background:"#222",color:"white",borderRadius:8,border:"1px solid #444",fontSize:12}}>Clear</button></div>
        <div style={{border:"2px dashed #FFD700",borderRadius:8,minHeight:120,marginTop:8,padding:8,background:"black"}}>
          {board.length===0 ? <p style={{color:"#777",fontSize:12,textAlign:"center",marginTop:30}}>Type sum then press SOLVE - Will show exact × ÷ steps here</p> : 
          board.map((b:any,i:number)=>{ const active=i===step; return (<div key={i} style={{background:active?"#FFF9C4":"#111",color:active?"black":"white",padding:10,borderRadius:8,marginBottom:8,borderLeft:active?"6px solid #0f0":"3px solid #444"}}><p style={{margin:0,fontSize:13,fontWeight:"bold"}}>{i+1}. {b.t}</p><pre style={{margin:"6px 0 0 0",fontSize:13,whiteSpace:"pre-wrap",background:active?"black":"#222",color:active?"#ff9800":"#0f0",padding:10,borderRadius:6,fontWeight:"bold"}}>{b.e}</pre><button onClick={()=>{ setStep(i); speak(b.t,b.e); }} style={{width:"100%",marginTop:6,padding:6,background:active?"#0f0":"#333",color:active?"black":"white",borderRadius:6,border:"none",fontSize:11,fontWeight:"bold"}}>🔊 Hear Step {i+1}</button></div>)})}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10}}><button onClick={()=>setStep(s=>Math.max(0,s-1))} style={{padding:"10px 16px",background:"#333",color:"white",borderRadius:8,border:"none"}}>Back</button><button onClick={()=>{ if(board[step]) speak(board[step].t, board[step].e); }} style={{padding:"10px 20px",background:"#FFD700",color:"black",borderRadius:20,border:"none",fontWeight:"bold"}}>🔊 Play</button><button onClick={()=>setStep(s=>Math.min(board.length-1,s+1))} style={{padding:"10px 16px",background:"#333",color:"white",borderRadius:8,border:"none"}}>Next</button></div>
        <button onClick={solveAny} style={{width:"100%",marginTop:12,padding:14,background:"#0f0",color:"black",borderRadius:8,border:"none",fontWeight:"bold",fontSize:14}}>✅ SOLVE ANY SUM - {hasPaid?"UNLIMITED":`${1 - solvesUsed} free left`} 🔊</button>
      </div>
      )}
      {tab==="teacher" && (<div style={{background:"#111",border:"2px solid #0f0",padding:12,borderRadius:12,marginTop:10}}><h3 style={{color:"#0f0",margin:0,fontSize:14}}>Ask Teacher - Uitenhage</h3><div style={{background:"black",borderRadius:8,padding:8,height:250,overflowY:"auto",marginTop:8,border:"1px solid #333"}}>{teacherChat.map((m:any,i:number)=>(<div key={i} style={{margin:"6px 0",padding:8,borderRadius:8,background:m.role==="you"?"#333":"#0a2a0a"}}><p style={{margin:0,fontSize:12,color:"white"}}>{m.text}</p></div>))}</div><div style={{display:"flex",gap:6,marginTop:8}}><input value={teacherQ} onChange={e=>setTeacherQ(e.target.value)} placeholder="Ask any sum" style={{flex:1,padding:10,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0"}}/><button onClick={askTeacher} style={{padding:"10px 14px",background:"#0f0",color:"black",borderRadius:8,border:"none",fontWeight:"bold"}}>Ask</button></div></div>)}
      {tab==="exam" && (<div style={{background:"#111",border:"2px solid #FFD700",padding:12,borderRadius:12,marginTop:10}}><h3 style={{color:"#FFD700",margin:0}}>Exam Prep Term {term}</h3><div style={{display:"flex",gap:6,marginTop:10}}>{[1,2,3,4].map(t=>(<button key={t} onClick={()=>setTerm(t)} style={{flex:1,padding:"12px 4px",borderRadius:12,border:term===t?"3px solid #FFD700":"1px solid #333",background:term===t?"#0f0":"#222",color:term===t?"black":"white",fontWeight:"bold"}}>Term {t}</button>))}</div><div style={{marginTop:10}}>{termTopics[term].map((tp:string,i:number)=><p key={i} style={{margin:"4px 0",fontSize:12,color:"white"}}>• {tp}</p>)}</div></div>)}
      <footer style={{marginTop:16,background:"#111",borderTop:"3px solid #FFD700",padding:"14px 10px",textAlign:"center"}}>
        <p style={{color:"#FFD700",fontWeight:"bold",margin:0,fontSize:14}}>CAPS MATHS BUDDY 786</p>
        <p style={{color:"#aaa",fontSize:11,margin:"4px 0"}}>Uitenhage, Eastern Cape, South Africa | support@capsmathsbuddy.co.za | 071 123 4567</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginTop:6}}>
          <span style={{color:"#FFD700",fontSize:11,fontWeight:"bold",textDecoration:"underline"}}>Pricing: R150/month</span>
          <span style={{color:"#FFD700",fontSize:11,textDecoration:"underline"}}>Refund Policy</span>
          <span style={{color:"#FFD700",fontSize:11,textDecoration:"underline"}}>Cancel Anytime</span>
          <span style={{color:"#FFD700",fontSize:11,textDecoration:"underline"}}>Terms</span>
          <span style={{color:"#FFD700",fontSize:11,textDecoration:"underline"}}>Privacy</span>
        </div>
        <p style={{color:"#666",fontSize:9,marginTop:8}}>© 2026 CAPS MATHS BUDDY 786 • Educational CAPS Tool • R150/month • Open to ANY sum • All rights reserved</p>
      </footer>
    </div>
  );
    }
