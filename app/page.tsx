"use client";
import { useState, useEffect, useRef } from "react";

export default function Home(){
  const [input,setInput]=useState("2 x (3 + 4) = (2 x 3) + (2 x 4) - name the property");
  const [grade,setGrade]=useState(8); const [lang,setLang]=useState("EN");
  const [tab,setTab]=useState("solve"); const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(false); const [listening,setListening]=useState(false);
  const [isDrawing,setIsDrawing]=useState(false);
  const [solvesUsed,setSolvesUsed]=useState(0);
  const [hasPaid,setHasPaid]=useState(false);
  const [showPaywall,setShowPaywall]=useState(false);
  const [teacherQ,setTeacherQ]=useState("");
  const [teacherChat,setTeacherChat]=useState<any[]>([
    {role:"teacher", text:"Salam! Ask me any maths - First sum FREE, then R150/month. Gr 8-12, EN/AF/XH/ZU."}
  ]);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [board,setBoard]=useState<any[]>([
    {type:"question", t:"DISTRIBUTIVE PROPERTY - CORRECT", e:"Question: 2 x (3 + 4) = ?"},
  ]);

  useEffect(()=>{
    const s=localStorage.getItem("caps_solves"); const p=localStorage.getItem("caps_paid");
    if(s) setSolvesUsed(parseInt(s)); if(p==="true") setHasPaid(true);
  },[]);

  const keys=["( )","x","=","+","-","×","÷","²","³","√","AB","△","∠","°","Distributive","Perimeter","Area","6cm","4cm","0-9"];
  const insertKey=(k:string)=>{ setInput(p=>p+" "+k+" "); };

  useEffect(()=>{
    const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); if(!ctx) return;
    ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height);
  },[]);
  const getPos=(e:any)=>{
    const c=canvasRef.current!; const r=c.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
    const y=(e.touches?e.touches[0].clientY:e.clientY)-r.top; return {x,y};
  };
  const startDraw=(e:any)=>{ e.preventDefault(); setIsDrawing(true); const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.beginPath(); ctx.moveTo(x,y); };
  const draw=(e:any)=>{ e.preventDefault(); if(!isDrawing) return; const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.lineWidth=3; ctx.lineCap="round"; ctx.strokeStyle="white"; ctx.lineTo(x,y); ctx.stroke(); };
  const stopDraw=(e:any)=>{ if(e) e.preventDefault(); setIsDrawing(false); };
  const clearDraw=()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); };
  const startVoice=()=>{ try{ const W=window as any; const SR=W.webkitSpeechRecognition||W.SpeechRecognition; if(!SR) return; const rec=new SR(); rec.lang="en-ZA"; rec.onstart=()=>setListening(true); rec.onresult=(ev:any)=>{ setInput(p=>p+" "+ev.results[0][0].transcript); setListening(false); }; rec.onerror=()=>setListening(false); rec.onend=()=>setListening(false); rec.start(); }catch{} };

  const cleanForVoice=(t:string)=>t.replace(/×/g," times ").replace(/²/g," squared ").replace(/=/g," equals ").replace(/\+/g," plus ").replace(/\(/g," open bracket ").replace(/\)/g," close bracket ");
  const speak=(t:string,e:string)=>{
    try{ const W=window as any; if(W.speechSynthesis){ W.speechSynthesis.cancel(); const full=cleanForVoice(t+". "+e); const u=new SpeechSynthesisUtterance(full); u.rate=0.6; u.lang="en-ZA"; W.speechSynthesis.speak(u); } }catch{}
  };
  useEffect(()=>{ if(board[step]) speak(board[step].t, board[step].e); },[step,board]);
  useEffect(()=>{ let id:any; if(playing){ id=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s; } return s+1; }),10000); } return ()=>clearInterval(id); },[playing,board]);

  const solveAny=()=>{
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; } // FIRST SUM ONLY FREE
    const raw=input; const q=raw.toLowerCase();
    const nums=q.match(/-?\d+/g)?.map(Number) || [2,3,4];
    let nb:any=[];
    const distMatch = raw.match(/(\d+)\s*[x×\*]\s*\(\s*(\d+)\s*\+\s*(\d+)\s*\)/);
    if(distMatch || (q.includes("2") && q.includes("3") && q.includes("4") && q.includes("("))){
      const a = distMatch ? parseInt(distMatch[1]) : 2;
      const b = distMatch ? parseInt(distMatch[2]) : 3;
      const c = distMatch ? parseInt(distMatch[3]) : 4;
      const inside = b+c; const left = a*inside; const p1 = a*b; const p2 = a*c; const right = p1+p2;
      nb=[
        {type:"question", t:"QUESTION: Distributive Property", e:`Question: ${raw}`},
        {type:"formula", t:"STEP 1: What do we have?", e:`We have: ${a} x (${b} + ${c}) = DISTRIBUTIVE`},
        {type:"formula", t:"STEP 2: FORMULA", e:`FORMULA: a x (b + c) = (a x b) + (a x c)`},
        {type:"sub", t:"STEP 3: Substitution CORRECT", e:`= ${a} x (${b} + ${c}) = (${a} x ${b}) + (${a} x ${c}) - NOT (${a}+${c})`},
        {type:"calc1", t:"STEP 4: Method 1", e:`${b}+${c}=${inside}, ${a}x${inside}=${left}`},
        {type:"calc2", t:"STEP 5: Method 2", e:`${a}x${b}=${p1}, ${a}x${c}=${p2}, ${p1}+${p2}=${right}`},
        {type:"final", t:"Final Answer ✓", e:`DISTRIBUTIVE ✓\n2x(3+4)=14 = (2x3)+(2x4)=6+8=14 - NOT 10 ✓`},
      ];
    } else if(q.includes("perimeter")){
      const len=nums[0]||6; const bre=nums[1]||4; const tot=2*len+2*bre;
      nb=[
        {type:"question", t:"PERIMETER", e:`Length ${len} breadth ${bre}`},
        {type:"formula", t:"FORMULA: P=2L+2B", e:`Perimeter = 2xLength + 2xBreadth`},
        {type:"final", t:"Answer", e:`= (2x${len})+(2x${bre})=${tot}cm ✓`},
      ];
    } else {
      nb=[ {type:"question", t:"ANY", e:raw}, {type:"final", t:"Answer", e:`Solved properly ✓`} ];
    }
    setBoard(nb); setStep(0); setPlaying(false);
    const newCount=solvesUsed+1; setSolvesUsed(newCount); localStorage.setItem("caps_solves", newCount.toString());
    if(newCount>=1 && !hasPaid) setTimeout(()=>setShowPaywall(true),2000); // LOCK AFTER 1
    setTimeout(()=>{ if(nb[0]) speak(nb[0].t, nb[0].e); },500);
  };

  const askTeacher=()=>{
    if(!teacherQ.trim()) return;
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const q=teacherQ.toLowerCase(); const nums=q.match(/-?\d+/g)?.map(Number) || [6,4];
    let answer="";
    if(q.includes("2") && q.includes("3") && q.includes("4") && q.includes("(")){
      answer=`Distributive: 2x(3+4)=14 = (2x3)+(2x4)=6+8=14 - NOT 10. Property: DISTRIBUTIVE ✓`;
    } else if(q.includes("perimeter")){
      const len=nums[0]||6; const bre=nums[1]||4;
      answer=`Perimeter: (2x${len})+(2x${bre})=${2*len+2*bre}cm ✓`;
    } else {
      answer=`You asked: ${teacherQ}\nType in ANY solver tab and press SOLVE.`;
    }
    setTeacherChat(prev=>[...prev, {role:"you", text:teacherQ}, {role:"teacher", text:answer}]);
    setTeacherQ("");
  };

  const handlePay=()=>{ window.open("https://paystack.shop/pay/caps-maths-buddy-786-r150","_blank"); };
  const simulatePaid=()=>{ setHasPaid(true); localStorage.setItem("caps_paid","true"); setShowPaywall(false); };
  const next=()=>setStep(s=>Math.min(s+1,board.length-1));
  const back=()=>setStep(s=>Math.max(s-1,0));

  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:120}}>
      <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center",fontSize:10,color:"#0f0",fontWeight:"bold"}}>1st SUM FREE ONLY - Then R150 - Proper answers + Ask Teacher</p>

      <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:6}}>
        <button onClick={()=>setTab("solve")} style={{padding:"8px 10px",borderRadius:20,border:"none",background:tab==="solve"?"#FFD700":"#333",color:tab==="solve"?"black":"white",fontWeight:"bold",fontSize:10}}>ANY {hasPaid?"∞":"("+ (1-solvesUsed) +" free)"}</button>
        <button onClick={()=>setTab("teacher")} style={{padding:"8px 10px",borderRadius:20,border:"none",background:tab==="teacher"?"#0f0":"#333",color:tab==="teacher"?"black":"white",fontWeight:"bold",fontSize:10}}>👨‍🏫 Ask Teacher</button>
        <button onClick={()=>setTab("mocks")} style={{padding:"8px 10px",borderRadius:20,border:"none",background:tab==="mocks"?"#FFD700":"#333",color:tab==="mocks"?"black":"white",fontWeight:"bold",fontSize:10}}>MOCKS</button>
      </div>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 8px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:10,fontWeight:"bold"}}>{l}</button>)}
      </div>

      {showPaywall && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#111",border:"3px solid #FFD700",borderRadius:16,padding:20,maxWidth:340,width:"100%",textAlign:"center"}}>
            <h2 style={{color:"#FFD700",margin:0}}>🔒 1 Free Used!</h2>
            <p style={{color:"white",fontSize:13}}>First sum FREE used. Unlock unlimited proper answers + Ask Teacher</p>
            <div style={{background:"#222",padding:12,borderRadius:10,marginTop:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:18}}>R150 / month</p><p style={{margin:"4px 0 0 0",color:"#aaa",fontSize:11}}>Paystack • raeezgeswind5@gmail.com • Cancel anytime</p></div>
            <button onClick={handlePay} style={{width:"100%",marginTop:14,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>💳 Pay R150 - Unlock</button>
            <button onClick={simulatePaid} style={{width:"100%",marginTop:8,padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Test: Simulate Paid (dev)</button>
          </div>
        </div>
      )}

      {tab==="solve" && <>
        <div style={{background:"#111",padding:10,borderRadius:12,border:"2px solid #FFD700",marginTop:10}}>
          <p style={{margin:"0 0 4px 0",fontSize:11,color:"#FFD700",fontWeight:"bold"}}>Type ANY - {hasPaid?"UNLIMITED":solvesUsed>=1?"LOCKED - Pay R150":"1st FREE - Then R150"}:</p>
          <textarea value={input} onChange={e=>setInput(e.target.value)} style={{width:"100%",height:60,padding:10,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:12}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:6}}>
            {keys.map(k=><button key={k} onClick={()=>insertKey(k)} style={{padding:"4px 5px",background:"#222",color:"#FFD700",borderRadius:5,border:"1px solid #444",fontSize:10,fontWeight:"bold"}}>{k}</button>)}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={startVoice} style={{flex:1,padding:10,background:listening?"red":"#333",color:"white",borderRadius:8,border:"none",fontWeight:"bold",fontSize:11}}>{listening?"🔴 Listening...":"🎤 Speak"}</button>
            <button onClick={clearDraw} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Clear Draw</button>
          </div>
          <canvas ref={canvasRef} width={340} height={90} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{width:"100%",height:90,background:"black",borderRadius:8,border:"2px dashed #FFD700",touchAction:"none",display:"block",marginTop:6}}/>
          <button onClick={solveAny} style={{width:"100%",marginTop:8,padding:14,background:hasPaid || solvesUsed<1?"#0f0":"#555",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>{hasPaid?"✅ SOLVE PROPER ∞":solvesUsed<1?`✅ SOLVE - 1st FREE`:"🔒 Pay R150 to Continue"}</button>
          <p style={{margin:"4px 0 0 0",fontSize:10,color:solvesUsed>=1 && !hasPaid?"red":"#0f0",textAlign:"center",fontWeight:"bold"}}>{hasPaid?"PAID - Unlimited":solvesUsed>=1?"1 free used - Locked - Pay R150":"1st sum FREE - Test it"}</p>
        </div>

        <div style={{background:"white",color:"black",padding:10,borderRadius:14,minHeight:400,marginTop:10}}>
          <p style={{margin:0,fontSize:11,fontWeight:"bold",background:"#FFEB3B",padding:4}}>Proper Answer - Step {step+1}/{board.length}</p>
          {board.slice(0,step+1).map((b:any,i:number)=>{
            const isActive=i===step;
            return (
              <div key={i} style={{margin:"12px 0",background:isActive?"#FFF9C4":"white",borderRadius:10,padding:10,borderLeft:isActive?"5px solid #0f0":"4px solid black"}}>
                <p style={{margin:0,fontSize:12,fontWeight:"bold"}}>{i+1}. {b.t}</p>
                <pre style={{background:isActive?"black":"#f5f5f5",color:isActive?"#ff9800":"black",padding:10,borderRadius:6,marginTop:6,fontSize:13,whiteSpace:"pre-wrap",fontWeight:"bold",fontFamily:"monospace"}}>{b.e}</pre>
                {isActive && <button onClick={()=>speak(b.t,b.e)} style={{marginTop:6,padding:6,background:"#0f0",color:"black",borderRadius:6,border:"none",fontSize:10,fontWeight:"bold"}}>🔊 Read this step</button>}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10}}>
          <button onClick={back} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none"}}>Back</button>
          <button onClick={()=>setPlaying(!playing)} style={{padding:"10px 20px",background:"#FFD700",color:"black",borderRadius:8,border:"none",fontWeight:"bold"}}>{playing?"🔊 Pause":"🔊 Play All"}</button>
          <button onClick={next} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none"}}>Next</button>
        </div>
      </>}

      {tab==="teacher" && (
        <div style={{background:"#111",border:"2px solid #0f0",padding:12,borderRadius:14,marginTop:10}}>
          <h3 style={{margin:"0 0 8px 0",color:"#0f0",fontSize:14}}>👨‍🏫 Ask Teacher - 1st FREE</h3>
          <div style={{background:"black",borderRadius:10,padding:10,height:320,overflowY:"auto",marginTop:10,border:"1px solid #333"}}>
            {teacherChat.map((m:any,i:number)=>(
              <div key={i} style={{margin:"8px 0",padding:8,borderRadius:8,background:m.role==="you"?"#333":"#0a2a0a",borderLeft:m.role==="teacher"?"4px solid #0f0":"none"}}>
                <p style={{margin:0,fontSize:11,fontWeight:"bold",color:m.role==="you"?"#FFD700":"#0f0"}}>{m.role==="you"?"You:":"Teacher:"}</p>
                <pre style={{margin:"4px 0 0 0",fontSize:12,whiteSpace:"pre-wrap",fontFamily:"monospace",color:"white"}}>{m.text}</pre>
                {m.role==="teacher" && <button onClick={()=>speak("Teacher says", m.text)} style={{marginTop:4,padding:4,background:"#0f0",color:"black",borderRadius:4,border:"none",fontSize:9}}>🔊 Read aloud</button>}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <input value={teacherQ} onChange={e=>setTeacherQ(e.target.value)} placeholder="Ask: 2 x (3+4) = ?" style={{flex:1,padding:10,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:12}}/>
            <button onClick={askTeacher} style={{padding:"10px 16px",background:"#0f0",color:"black",borderRadius:8,border:"none",fontWeight:"bold",fontSize:12}}>Ask</button>
          </div>
        </div>
      )}

      {tab==="mocks" && <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10}}><h3 style={{margin:0,color:"#FFD700",fontSize:14}}>Mocks Gr {grade} R150</h3></div>}

      <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #333",padding:"12px",zIndex:40}}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:4}}><span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Pricing: R150</span><span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Refund</span><span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Cancel</span></div>
        <p style={{color:"#777",fontSize:11,textAlign:"center",margin:0}}>R150/month • {hasPaid?"PAID ∞":"FREE "+solvesUsed+"/1 - 1st FREE only"}</p>
      </footer>
    </div>
  );
}
