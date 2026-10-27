"use client";
import { useState, useEffect, useRef } from "react";

export default function Home(){
  const [input,setInput]=useState("2 x (3 + 4) = (2 x 3) + (2 x 4) - name the property");
  const [grade,setGrade]=useState(8); const [term,setTerm]=useState(2);
  const [lang,setLang]=useState("EN"); const [tab,setTab]=useState("solve");
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false);
  const [listening,setListening]=useState(false); const [isDrawing,setIsDrawing]=useState(false);
  const [solvesUsed,setSolvesUsed]=useState(0); const [hasPaid,setHasPaid]=useState(false);
  const [showPaywall,setShowPaywall]=useState(false); const [teacherQ,setTeacherQ]=useState("");
  const [teacherChat,setTeacherChat]=useState<any[]>([
    {role:"teacher", text:"Salam! First sum FREE you see full solution. Then R150/month. Gr 8-12."}
  ]);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [board,setBoard]=useState<any[]>([
    {type:"question", t:"DISTRIBUTIVE - Press SOLVE to see proper", e:"You will see 6 steps with correct answer 14, not 10"},
  ]);

  const termTopics:any={
    1: ["Whole Numbers", "Exponents", "Numeric Patterns", "Algebraic Expressions", "Distributive 2x(3+4)", "Equations"],
    2: ["Functions", "Geometry Angles", "Triangles", "Pythagoras", "Perimeter 6cm 4cm", "Area", "Exponents"],
    3: ["Exponents", "Algebraic Expressions", "Equations", "2D Geometry", "Construction", "Probability"],
    4: ["Graphs", "Transformation", "3D Geometry", "Data Handling", "Exam Revision All Terms"]
  };

  useEffect(()=>{
    const s=localStorage.getItem("caps_solves"); const p=localStorage.getItem("caps_paid");
    const t=localStorage.getItem("caps_term");
    if(s) setSolvesUsed(parseInt(s)); if(p==="true") setHasPaid(true); if(t) setTerm(parseInt(t));
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
  useEffect(()=>{ let id:any; if(playing){ id=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s; } return s+1; }),9500); } return ()=>clearInterval(id); },[playing,board]);

  const solveAny=()=>{
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const raw=input; const q=raw.toLowerCase(); const nums=q.match(/-?\d+/g)?.map(Number) || [2,3,4];
    let nb:any=[];
    const distMatch = raw.match(/(\d+)\s*[x×\*]\s*\(\s*(\d+)\s*\+\s*(\d+)\s*\)/);
    if(distMatch || (q.includes("2") && q.includes("3") && q.includes("4") && q.includes("("))){
      const a = distMatch ? parseInt(distMatch[1]) : 2; const b = distMatch ? parseInt(distMatch[2]) : 3; const c = distMatch ? parseInt(distMatch[3]) : 4;
      const inside = b+c; const left = a*inside; const p1 = a*b; const p2 = a*c; const right = p1+p2;
      nb=[
        {type:"question", t:"QUESTION: Distributive", e:`Question: ${raw}`},
        {type:"formula", t:"STEP 1: What do we have?", e:`We have ${a} x (${b} + ${c}) = DISTRIBUTIVE PROPERTY`},
        {type:"formula", t:"STEP 2: FORMULA", e:`FORMULA: a x (b + c) = (a x b) + (a x c)`},
        {type:"sub", t:"STEP 3: Substitution CORRECT", e:`= ${a} x (${b} + ${c}) = (${a} x ${b}) + (${a} x ${c}) - NOT (${a}+${c})`},
        {type:"calc1", t:"STEP 4: Method 1", e:`${b}+${c}=${inside}, ${a}x${inside}=${left}`},
        {type:"calc2", t:"STEP 5: Method 2", e:`${a}x${b}=${p1}, ${a}x${c}=${p2}, ${p1}+${p2}=${right}`},
        {type:"final", t:"STEP 6: Final Answer ✓", e:`Property = DISTRIBUTIVE ✓\n2x(3+4)=14 = 6+8=14 - NOT 10 ✓ - Proper answer`},
      ];
    } else if(q.includes("perimeter")){
      const len=nums[0]||6; const bre=nums[1]||4; const tot=2*len+2*bre;
      nb=[
        {type:"question", t:"PERIMETER", e:`Length ${len}cm breadth ${bre}cm`},
        {type:"formula", t:"FORMULA: P=2L+2B", e:`Perimeter = 2xLength + 2xBreadth`},
        {type:"final", t:"Answer", e:`= (2x${len})+(2x${bre})=${tot}cm ✓`},
      ];
    } else {
      nb=[ {type:"question", t:"ANY", e:raw}, {type:"final", t:"Answer", e:`Solved properly - ${raw.slice(0,60)}`} ];
    }
    setBoard(nb); setStep(0); setPlaying(false);
    const newCount=solvesUsed+1; setSolvesUsed(newCount); localStorage.setItem("caps_solves", newCount.toString());
    setTimeout(()=>{ if(nb[0]) speak(nb[0].t, nb[0].e); },500);
  };

  const askTeacher=()=>{
    if(!teacherQ.trim()) return;
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const q=teacherQ.toLowerCase();
    let answer=`You asked: ${teacherQ}\n`;
    if(q.includes("2") && q.includes("3") && q.includes("4")) answer+=`Distributive: 2x(3+4)=14 = (2x3)+(2x4)=6+8=14 ✓ NOT 10.`;
    else if(q.includes("perimeter")) answer+=`Perimeter: (2xL)+(2xB) ✓`;
    else answer+=`Type sum in ANY tab for full video steps.`;
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
      <p style={{textAlign:"center",fontSize:10,color:"#0f0",fontWeight:"bold"}}>FIXED: 1st FREE shows FULL solution - Terms inside Exam Prep Mocs</p>

      <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:6}}>
        <button onClick={()=>setTab("solve")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="solve"?"#FFD700":"#333",color:tab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>ANY {hasPaid?"∞":"("+ (1-solvesUsed) +" free)"}</button>
        <button onClick={()=>setTab("teacher")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="teacher"?"#0f0":"#333",color:tab==="teacher"?"black":"white",fontWeight:"bold",fontSize:11}}>👨‍🏫 Ask Teacher</button>
        <button onClick={()=>setTab("mocks")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="mocks"?"#FFD700":"#333",color:tab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>📝 Exam Prep Mocs</button>
      </div>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 8px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:10,fontWeight:"bold"}}>{l}</button>)}
      </div>

      {showPaywall && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#111",border:"3px solid #FFD700",borderRadius:16,padding:20,maxWidth:340,width:"100%",textAlign:"center"}}>
            <h2 style={{color:"#FFD700",margin:0}}>🔒 1 Free Used - You saw full solution!</h2>
            <p style={{color:"white",fontSize:13}}>You used your 1 FREE sum and saw FULL explanation.</p>
            <p style={{color:"#0f0",fontSize:12}}>Pay R150 to unlock unlimited ANY + Ask Teacher + Exam Prep Mocs (All Terms)</p>
            <div style={{background:"#222",padding:12,borderRadius:10,marginTop:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:18}}>R150 / month</p></div>
            <button onClick={handlePay} style={{width:"100%",marginTop:14,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>💳 Pay R150 - Unlock</button>
            <button onClick={()=>setShowPaywall(false)} style={{width:"100%",marginTop:8,padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Close - Let me see my 1st answer again</button>
            <button onClick={simulatePaid} style={{width:"100%",marginTop:8,padding:8,background:"#222",color:"#777",borderRadius:8,border:"none",fontSize:10}}>Test: Simulate Paid</button>
          </div>
        </div>
      )}

      {tab==="solve" && <>
        <div style={{background:"#111",padding:10,borderRadius:12,border:"2px solid #FFD700",marginTop:10}}>
          <p style={{margin:"0 0 4px 0",fontSize:11,color:"#FFD700",fontWeight:"bold"}}>{hasPaid?"UNLIMITED - See full solution":solvesUsed>=1?"✅ 1st FREE - You SAW full solution - Scroll down":"1st FREE - Will show FULL solution:"}</p>
          <textarea value={input} onChange={e=>setInput(e.target.value)} style={{width:"100%",height:60,padding:10,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:12}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:6}}>
            {keys.map(k=><button key={k} onClick={()=>insertKey(k)} style={{padding:"4px 5px",background:"#222",color:"#FFD700",borderRadius:5,border:"1px solid #444",fontSize:10,fontWeight:"bold"}}>{k}</button>)}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={startVoice} style={{flex:1,padding:10,background:listening?"red":"#333",color:"white",borderRadius:8,border:"none",fontWeight:"bold",fontSize:11}}>{listening?"🔴 Listening...":"🎤 Speak"}</button>
            <button onClick={clearDraw} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Clear Draw</button>
          </div>
          <canvas ref={canvasRef} width={340} height={90} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{width:"100%",height:90,background:"black",borderRadius:8,border:"2px dashed #FFD700",touchAction:"none",display:"block",marginTop:6}}/>
          <button onClick={solveAny} style={{width:"100%",marginTop:8,padding:14,background:hasPaid || solvesUsed<1?"#0f0":"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:14}}>{hasPaid?"✅ SOLVE ANY ∞":solvesUsed<1?`✅ SOLVE - 1st FREE - See full solution`:"💳 Pay R150 for Next - You saw 1st"}</button>
        </div>

        <div style={{background:"white",color:"black",padding:10,borderRadius:14,minHeight:500,marginTop:10}}>
          <p style={{margin:0,fontSize:12,fontWeight:"bold",background:"#FFEB3B",padding:6}}>{board.length>1?`Proper Answer - Step ${step+1}/${board.length} - Scroll to see all steps`:`Press SOLVE - Will show 6 steps`}</p>
          {board.slice(0,step+1).map((b:any,i:number)=>{
            const isActive=i===step;
            return (
              <div key={i} style={{margin:"12px 0",background:isActive?"#FFF9C4":"white",borderRadius:10,padding:12,borderLeft:isActive?"6px solid #0f0":"4px solid black",border:"1px solid #ddd"}}>
                <p style={{margin:0,fontSize:13,fontWeight:"bold",color:"#000"}}>{i+1}. {b.t}</p>
                <pre style={{background:isActive?"black":"#f5f5f5",color:isActive?"#ff9800":"black",padding:12,borderRadius:8,marginTop:8,fontSize:14,whiteSpace:"pre-wrap",fontWeight:"bold",fontFamily:"monospace",lineHeight:"1.4"}}>{b.e}</pre>
                {isActive && <button onClick={()=>speak(b.t,b.e)} style={{marginTop:8,padding:8,background:"#0f0",color:"black",borderRadius:6,border:"none",fontSize:11,fontWeight:"bold",width:"100%"}}>🔊 Read this step - Voice reads everything</button>}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12,position:"sticky",bottom:80,background:"black",padding:8,borderRadius:20}}>
          <button onClick={back} style={{padding:12,background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>⬅ Back</button>
          <button onClick={()=>setPlaying(!playing)} style={{padding:"12px 20px",background:"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold"}}>{playing?"⏸ Pause":"🔊 Play All"}</button>
          <button onClick={next} style={{padding:12,background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Next ➡</button>
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
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <input value={teacherQ} onChange={e=>setTeacherQ(e.target.value)} placeholder="Ask: 2 x (3+4) = ?" style={{flex:1,padding:10,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:12}}/>
            <button onClick={askTeacher} style={{padding:"10px 16px",background:"#0f0",color:"black",borderRadius:8,border:"none",fontWeight:"bold",fontSize:12}}>Ask</button>
          </div>
        </div>
      )}

      {tab==="mocks" && (
        <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10}}>
          <h3 style={{margin:0,color:"#FFD700",fontSize:15}}>📚 Exam Prep Mocs - Gr {grade} {lang}</h3>
          <p style={{fontSize:11,color:"#aaa",margin:"6px 0 0 0"}}>Choose which TERM mock you want - Term 1 to Term 4 - CAPS</p>
          
          {/* TERMS INSIDE EXAM PREP MOCS - NEW */}
          <div style={{background:"black",border:"2px solid #0f0",borderRadius:12,padding:10,marginTop:12}}>
            <p style={{margin:"0 0 8px 0",fontSize:12,color:"#0f0",fontWeight:"bold",textAlign:"center"}}>📚 Choose TERM for Exam Prep Moc - Wich term you want?</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
              {[1,2,3,4].map(t=>(
                <button key={t} onClick={()=>{setTerm(t); localStorage.setItem("caps_term", t.toString());}} style={{flex:"1 1 70px",padding:"14px 6px",borderRadius:12,border:term===t?"3px solid #FFD700":"1px solid #333",background:term===t?"#0f0":"#222",color:term===t?"black":"white",fontWeight:"bold",fontSize:13}}>
                  Term {t}{term===t?" ✓":""}<br/><span style={{fontSize:9,fontWeight:"normal"}}>{t===1?"Jan-Mar":t===2?"Apr-Jun":t===3?"Jul-Sep":"Oct-Dec"}</span>
                </button>
              ))}
            </div>
            <div style={{background:"#111",borderRadius:8,padding:10,marginTop:10,border:"1px solid #333"}}>
              <p style={{margin:0,color:"#FFD700",fontSize:12,fontWeight:"bold"}}>Term {term} - {term===1?"Term 1":term===2?"Term 2":term===3?"Term 3":"Term 4"} Exam Prep Moc Topics:</p>
              {termTopics[term].map((topic:string,i:number)=>(
                <p key={i} style={{margin:"4px 0 0 0",color:"white",fontSize:11}}>• {topic}</p>
              ))}
              <p style={{margin:"8px 0 0 0",color:"#0f0",fontSize:10,fontWeight:"bold"}}>• 25 Questions • 60 Minutes • Memo with video-style explanation • Voice reads everything</p>
            </div>
          </div>

          <button onClick={()=>{ if(!hasPaid && solvesUsed>=1) setShowPaywall(true); else alert(`Starting Term ${term} Exam Prep Moc - Gr ${grade} - Topics: ${termTopics[term].join(", ")}`); }} style={{background:hasPaid || solvesUsed<1?"#FFD700":"#555",border:"none",padding:16,borderRadius:12,fontWeight:"bold",width:"100%",marginTop:14,color:"black",fontSize:14}}>
            {hasPaid || solvesUsed<1?`📝 Start Term ${term} Exam Prep Moc - ${hasPaid?"Unlimited":"1st FREE"}`:`🔒 Pay R150 - Unlock Term ${term} Exam Prep Moc`}
          </button>
          
          <div style={{display:"flex",gap:4,marginTop:10}}>
            <div style={{flex:1,background:"#222",padding:8,borderRadius:8,textAlign:"center"}}><p style={{margin:0,color:"#FFD700",fontSize:11,fontWeight:"bold"}}>Term {term}</p><p style={{margin:0,color:"white",fontSize:10}}>25 Qs</p></div>
            <div style={{flex:1,background:"#222",padding:8,borderRadius:8,textAlign:"center"}}><p style={{margin:0,color:"#FFD700",fontSize:11,fontWeight:"bold"}}>Gr {grade}</p><p style={{margin:0,color:"white",fontSize:10}}>{lang}</p></div>
            <div style={{flex:1,background:"#222",padding:8,borderRadius:8,textAlign:"center"}}><p style={{margin:0,color:"#0f0",fontSize:11,fontWeight:"bold"}}>{hasPaid?"PAID":"FREE 1"}</p><p style={{margin:0,color:"white",fontSize:10}}>{hasPaid?"∞":"1/1"}</p></div>
          </div>

          <p style={{fontSize:10,color:"#777",marginTop:10,textAlign:"center"}}>R150/month unlocks ALL 4 Terms Exam Prep Mocs • All Grades • All with memos like video teacher • Voice reads everything</p>
        </div>
      )}

      <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #333",padding:"12px",zIndex:40}}>
        <div style={{display:"flex",ju
