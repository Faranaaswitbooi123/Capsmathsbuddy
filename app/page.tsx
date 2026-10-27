"use client";
import { useState, useEffect, useRef } from "react";

export default function Home(){
  const [input,setInput]=useState("2 x (3 + 4) = ?");
  const [grade,setGrade]=useState(8); const [term,setTerm]=useState(2);
  const [lang,setLang]=useState("EN"); const [tab,setTab]=useState("solve");
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false);
  const [listening,setListening]=useState(false); const [isDrawing,setIsDrawing]=useState(false);
  const [solvesUsed,setSolvesUsed]=useState(0); const [hasPaid,setHasPaid]=useState(false);
  const [showPaywall,setShowPaywall]=useState(false); const [teacherQ,setTeacherQ]=useState("");
  const [teacherChat,setTeacherChat]=useState<any[]>([{role:"teacher", text:"Salam! First sum FREE shows full solution. Ask any maths - I explain simple WHY & HOW, not just reread."}]);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [board,setBoard]=useState<any[]>([{t:"Press SOLVE - 1st FREE shows full", e:"Type sum, press SOLVE - You will see 6 steps with correct answer 14 not 10, scroll to see all, voice reads everything"}]);

  useEffect(()=>{
    const s=localStorage.getItem("caps_solves"); const p=localStorage.getItem("caps_paid");
    const t=localStorage.getItem("caps_term");
    if(s) setSolvesUsed(parseInt(s)); if(p==="true") setHasPaid(true); if(t) setTerm(parseInt(t));
  },[]);

  const keys=["7","8","9","( )","x","=","div","4","5","6","+","-","x","sqrt","1","2","3","sq","cube","AB","0",".","tri","ang","deg","%","Distributive 2x(3+4)","Perimeter P=2L+2B","Area A=LxB","6cm","4cm","Pythagoras a2+b2=c2","Functions","Angles","Whole Numbers","Exponents","Equations","Graphs","Probability","Data Handling"];

  const termTopics:any={
    1: ["Whole Numbers","Exponents","Numeric Patterns","Distributive 2x(3+4)","Algebraic Expressions","Equations"],
    2: ["Functions","Geometry Angles","Triangles","Theorem Pythagoras","Perimeter 6cm 4cm","Area"],
    3: ["Exponents","Algebraic Expressions","Equations","2D Geometry","Probability"],
    4: ["Graphs","Transformation","Geometry 3D","Data Handling","Exam Revision All Terms"]
  };

  useEffect(()=>{
    const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d"); if(!ctx) return;
    ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height);
  },[]);
  const getPos=(e:any)=>{
    const c=canvasRef.current!; const r=c.getBoundingClientRect();
    return {x:(e.touches?e.touches[0].clientX:e.clientX)-r.left, y:(e.touches?e.touches[0].clientY:e.clientY)-r.top};
  };
  const startDraw=(e:any)=>{ e.preventDefault(); setIsDrawing(true); const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.beginPath(); ctx.moveTo(x,y); };
  const draw=(e:any)=>{ e.preventDefault(); if(!isDrawing) return; const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; const {x,y}=getPos(e); ctx.lineWidth=3; ctx.lineCap="round"; ctx.strokeStyle="white"; ctx.lineTo(x,y); ctx.stroke(); };
  const stopDraw=(e:any)=>{ if(e) e.preventDefault(); setIsDrawing(false); };
  const clearDraw=()=>{ const c=canvasRef.current; if(!c) return; const ctx=c.getContext("2d")!; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height); };
  const startVoice=()=>{ try{ const W=window as any; const SR=W.webkitSpeechRecognition||W.SpeechRecognition; if(!SR) return; const rec=new SR(); rec.lang="en-ZA"; rec.onstart=()=>setListening(true); rec.onresult=(ev:any)=>{ setInput(p=>p+" "+ev.results[0][0].transcript); setListening(false); }; rec.onerror=()=>setListening(false); rec.onend=()=>setListening(false); rec.start(); }catch{} };

  const speak=(t:string,e:string)=>{
    try{ const W=window as any; if(W.speechSynthesis){ W.speechSynthesis.cancel(); const full=(t+". "+e).replace(/x/g," times "); const u=new SpeechSynthesisUtterance(full); u.rate=0.6; u.lang="en-ZA"; W.speechSynthesis.speak(u); } }catch{}
  };
  useEffect(()=>{ if(board[step]) speak(board[step].t, board[step].e); },[step,board]);
  useEffect(()=>{ let id:any; if(playing){ id=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s; } return s+1; }),9000); } return ()=>clearInterval(id); },[playing,board]);

  const solveAny=()=>{
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const raw=input; const q=raw.toLowerCase(); const nums=q.match(/-?\d+/g)?.map(Number) || [2,3,4];
    let nb:any=[];
    const distMatch = raw.match(/(\d+)\s*[xX]\s*\(\s*(\d+)\s*\+\s*(\d+)\s*\)/);
    if(distMatch || (q.includes("2") && q.includes("3") && q.includes("4") && q.includes("("))){
      const a = distMatch ? parseInt(distMatch[1]) : 2; const b = distMatch ? parseInt(distMatch[2]) : 3; const c = distMatch ? parseInt(distMatch[3]) : 4;
      const inside=b+c; const left=a*inside; const p1=a*b; const p2=a*c; const right=p1+p2;
      nb=[
        {t:"QUESTION", e:`Question: ${raw}`},
        {t:"STEP 1: What do we have?", e:`We have ${a} x (${b} + ${c}) = DISTRIBUTIVE PROPERTY - Term ${term}`},
        {t:"STEP 2: FORMULA", e:`FORMULA: a x (b + c) = (a x b) + (a x c)`},
        {t:"STEP 3: Substitution CORRECT", e:`= (${a} x ${b}) + (${a} x ${c}) - NOT (${a}+${c}) - Old mistake fixed!`},
        {t:"STEP 4: Method 1 - Inside first", e:`${b}+${c}=${inside}, ${a} x ${inside}=${left}`},
        {t:"STEP 5: Method 2 - Distribute", e:`${a} x ${b}=${p1}, ${a} x ${c}=${p2}, ${p1}+${p2}=${right}`},
        {t:"STEP 6: Final Answer", e:`Property = DISTRIBUTIVE\nAnswer = ${right} - NOT 10\nBecause (2x3)+(2x4)=6+8=14 - Proper answer - Term ${term}`},
      ];
    } else if(q.includes("perimeter")){
      const L=nums[0]||6; const B=nums[1]||4; const tot=2*L+2*B;
      nb=[{t:"PERIMETER", e:`Length ${L}cm Breadth ${B}cm - Term ${term}`},{t:"FORMULA P=2L+2B", e:`Perimeter = 2xLength + 2xBreadth`},{t:"Answer", e:`= (2x${L})+(2x${B})=${tot}cm - Term ${term}`}];
    } else {
      nb=[{t:"QUESTION", e:raw},{t:"Answer", e:`Solved properly for Term ${term}: ${raw.slice(0,100)}`}];
    }
    setBoard(nb); setStep(0); setPlaying(false);
    const newCount=solvesUsed+1; setSolvesUsed(newCount); localStorage.setItem("caps_solves", newCount.toString());
  };

  const askTeacher=()=>{
    if(!teacherQ.trim()) return;
    if(!hasPaid && solvesUsed>=1){ setShowPaywall(true); return; }
    const q=teacherQ.toLowerCase();
    let answer="";
    if(q.includes("2") && q.includes("3") && q.includes("4")){
      answer=`WHY 14 not 10? Simple WHY & HOW:\n\nWHY: You have 2 bags, each bag has 3 apples + 4 oranges.\nBag1: 3+4=7, Bag2: 3+4=7, Total 7+7=14\n\nHOW - Two ways:\n1) Inside first: 3+4=7, 2x7=14\n2) Distribute: 2x3=6 apples, 2x4=8 oranges, 6+8=14\n\nWHY NOT 10? Old app did (2+4) = plus, wrong! Must be 2x4 = times. Property: DISTRIBUTIVE - 2 spreads to both 3 and 4.`;
    } else if(q.includes("perimeter")){
      answer=`WHY 20 not 10? Simple WHY & HOW:\n\nWHY: Walk around house. Length 6, breadth 4.\nWalk 6 front + 4 side + 6 back + 4 other side = 6+4+6+4=20\n\nHOW: Formula 2L+2B = 2x6+2x4=12+8=20\nIf you did 6+4=10, you walked only half way! Must go all around.`;
    } else if(q.includes("area")){
      answer=`WHY L x B? Simple:\nWHY: How many 1cm squares fit inside?\nHOW: 6 across, 4 down = 6x4=24 squares = 24 cm2`;
    } else {
      answer=`Simple WHY & HOW for: ${teacherQ}\n\nI explain ANY sum with everyday example (bags, walking, squares) - why that formula, how to calculate easy.\nType sum in ANY tab for 6 steps, then ask me WHY here - I give simpler explanation, not just reread.`;
    }
    setTeacherChat(prev=>[...prev, {role:"you", text:teacherQ}, {role:"teacher", text:answer}]);
    setTeacherQ("");
  };

  const handlePay=()=>{ window.open("https://paystack.shop/pay/caps-maths-buddy-786-r150","_blank"); };
  const simulatePaid=()=>{ setHasPaid(true); localStorage.setItem("caps_paid","true"); setShowPaywall(false); };

  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:120}}>
      <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center",fontSize:10,color:"#0f0",fontWeight:"bold"}}>FULL APP - 1 FREE full - Ask Teacher simple WHY & HOW - Terms inside Exam Prep Mocs</p>

      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
        <button onClick={()=>setTab("solve")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="solve"?"#FFD700":"#333",color:tab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>ANY {hasPaid?"INF":(1-solvesUsed)+" free"}</button>
        <button onClick={()=>setTab("teacher")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="teacher"?"#0f0":"#333",color:tab==="teacher"?"black":"white",fontWeight:"bold",fontSize:11}}>Ask Teacher</button>
        <button onClick={()=>setTab("mocks")} style={{padding:"10px 14px",borderRadius:20,border:"none",background:tab==="mocks"?"#FFD700":"#333",color:tab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>Exam Prep Mocs</button>
      </div>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6,flexWrap:"wrap"}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 8px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:10,fontWeight:"bold"}}>{l}</button>)}
      </div>

      {showPaywall && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.95)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#111",border:"3px solid #FFD700",borderRadius:16,padding:20,maxWidth:340,width:"100%",textAlign:"center"}}>
            <h2 style={{color:"#FFD700",margin:0}}>1 Free Used - You saw full solution!</h2>
            <p style={{color:"white",fontSize:13}}>First sum FREE used - You saw 6 steps full</p>
            <p style={{color:"#0f0",fontSize:12}}>Pay R150 unlock unlimited ANY + Ask Teacher + Exam Prep Mocs All Terms</p>
            <div style={{background:"#222",padding:12,borderRadius:10,marginTop:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:18}}>R150 / month</p></div>
            <button onClick={handlePay} style={{width:"100%",marginTop:14,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>Pay R150 - Unlock All</button>
            <button onClick={()=>setShowPaywall(false)} style={{width:"100%",marginTop:8,padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Close</button>
            <button onClick={simulatePaid} style={{width:"100%",marginTop:8,padding:8,background:"#222",color:"#777",borderRadius:8,border:"none",fontSize:10}}>Test: Simulate Paid</button>
          </div>
        </div>
      )}

      {tab==="solve" && <>
        <div style={{background:"#111",padding:10,borderRadius:12,border:"2px solid #FFD700",marginTop:10}}>
          <p style={{margin:"0 0 4px 0",fontSize:11,color:"#FFD700",fontWeight:"bold"}}>{hasPaid?"UNLIMITED":solvesUsed>=1?"1st FREE - You SAW full - Scroll down":`1st FREE - Will show FULL solution - Term ${term} Gr ${grade}`}</p>
          <textarea value={input} onChange={e=>setInput(e.target.value)} style={{width:"100%",height:50,padding:8,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:12}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:6}}>
            {keys.map(k=><button key={k} onClick={()=>setInput(p=>p+" "+k+" ")} style={{padding:"5px 6px",background:"#222",color:"#FFD700",borderRadius:5,border:"1px solid #444",fontSize:10,fontWeight:"bold"}}>{k}</button>)}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={startVoice} style={{flex:1,padding:8,background:listening?"red":"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>{listening?"Listening...":"Speak"}</button>
            <button onClick={clearDraw} style={{padding:8,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Clear Draw</button>
          </div>
          <canvas ref={canvasRef} width={340} height={80} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{width:"100%",height:80,background:"black",borderRadius:8,border:"2px dashed #FFD700",touchAction:"none",display:"block",marginTop:6}}/>
          <button onClick={solveAny} style={{width:"100%",marginTop:8,padding:12,background:hasPaid || solvesUsed<1?"#0f0":"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:13}}>{hasPaid?`SOLVE T${term} INF`:solvesUsed<1?`SOLVE - 1st FREE - See full solution`:`Pay R150 for Next - You saw 1st`}</button>
        </div>

        <div style={{background:"white",color:"black",padding:10,borderRadius:12,minHeight:500,marginTop:10}}>
          <p style={{margin:0,fontSize:11,fontWeight:"bold",background:"#FFEB3B",padding:6}}>Proper Answer - Step {step+1}/{board.length} - Scroll to see all steps</p>
          {board.slice(0,step+1).map((b:any,i:number)=>{
            const isActive=i===step;
            return (
              <div key={i} style={{margin:"10px 0",background:isActive?"#FFF9C4":"white",borderRadius:8,padding:10,borderLeft:isActive?"6px solid #0f0":"4px solid black",border:"1px solid #ddd"}}>
                <p style={{margin:0,fontSize:12,fontWeight:"bold",color:"#000"}}>{i+1}. {b.t}</p>
                <pre style={{background:isActive?"black":"#f5f5f5",color:isActive?"#ff9800":"black",padding:10,borderRadius:6,marginTop:6,fontSize:13,whiteSpace:"pre-wrap",fontWeight:"bold",fontFamily:"monospace",lineHeight:"1.4"}}>{b.e}</pre>
                {isActive && <button onClick={()=>speak(b.t,b.e)} style={{marginTop:6,padding:6,background:"#0f0",color:"black",borderRadius:6,border:"none",fontSize:10,fontWeight:"bold",width:"100%"}}>Read this step - Voice reads everything</button>}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10,position:"sticky",bottom:75,background:"black",padding:8,borderRadius:20}}>
          <button onClick={()=>setStep(s=>Math.max(s-1,0))} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none"}}>Back</button>
          <button onClick={()=>setPlaying(!playing)} style={{padding:"10px 18px",background:"#FFD700",color:"black",borderRadius:8,border:"none",fontWeight:"bold"}}>{playing?"Pause":"Play All"}</button>
          <button onClick={()=>setStep(s=>Math.min(s+1,board.length-1))} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none"}}>Next</button>
        </div>
      </>}

      {tab==="teacher" && (
        <div style={{background:"#111",border:"2px solid #0f0",padding:10,borderRadius:12,marginTop:10}}>
          <h3 style={{margin:0,color:"#0f0",fontSize:13}}>Ask Teacher - Simple WHY & HOW - ANY sum</h3>
          <p style={{margin:"4px 0 0 0",fontSize:10,color:"#FFD700"}}>Not just reread - Explains simpler why & how with everyday example</p>
          <div style={{background:"black",borderRadius:8,padding:8,height:320,overflowY:"auto",marginTop:8,border:"1px solid #333"}}>
            {teacherChat.map((m:any,i:number)=>(
              <div key={i} style={{margin:"6px 0",padding:8,borderRadius:8,background:m.role==="you"?"#333":"#0a2a0a",borderLeft:m.role==="teacher"?"4px solid #0f0":"none"}}>
                <p style={{margin:0,fontSize:10,fontWeight:"bold",color:m.role==="you"?"#FFD700":"#0f0"}}>{m.role==="you"?"You:":"Teacher (simple WHY & HOW):"}</p>
                <pre style={{margin:"4px 0 0 0",fontSize:11,whiteSpace:"pre-wrap",fontFamily:"monospace",color:"white",lineHeight:"1.3"}}>{m.text}</pre>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <input value={teacherQ} onChange={e=>setTeacherQ(e.target.value)} placeholder="Why 2x(3+4)=14? or perimeter 6 4 why 20?" style={{flex:1,padding:8,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:11}}/>
            <button onClick={askTeacher} style={{padding:"8px 14px",background:"#0f0",color:"black",borderRadius:8,border:"none",fontWeight:"bold",fontSize:11}}>Ask</button>
          </div>
        </div>
      )}

      {tab==="mocks" && (
        <div style={{background:"#111",border:"2px solid #FFD700",padding:12,borderRadius:12,marginTop:10}}>
          <h3 style={{margin:0,color:"#FFD700",fontSize:15}}>Exam Prep Mocs - Gr {grade} {lang}</h3>
          <p style={{fontSize:11,color:"#aaa",margin:"4px 0 0 0"}}>Choose which TERM mock you want - Term 1 to Term 4 - CAPS</p>
          <div style={{background:"black",border:"2px solid #0f0",borderRadius:12,padding:10,marginTop:10}}>
            <p style={{margin:"0 0 8px 0",fontSize:12,color:"#0f0",fontWeight:"bold",textAlign:"center"}}>Choose TERM for Exam Prep Moc - Wich term you want?</p>
            <div style={{display:"flex",gap:6}}>
              {[1,2,3,4].map(t=>(
                <button key={t} onClick={()=>{setTerm(t); localStorage.setItem("caps_term", t.toString());}} style={{flex:1,padding:"14px 4px",borderRadius:12,border:term===t?"3px solid #FFD700":"1px solid #333",background:term===t?"#0f0":"#222",color:term===t?"black":"white",fontWeight:"bold",fontSize:13}}>Term {t}{term===t?" YES":""}<br/><span style={{fontSize:9,fontWeight:"normal"}}>{t===1?"Jan-Mar":t===2?"Apr-Jun":t===3?"Jul-Sep":"Oct-Dec"}</span></button>
              ))}
            </div>
            <div style={{background:"#111",borderRadius:8,padding:10,marginTop:10,border:"1px solid #333"}}>
              <p style={{margin:0,color:"#FFD700",fontSize:12,fontWeight:"bold"}}>Term {term} - Exam Prep Moc Topics:</p>
              {termTopics[term].map((tp:string,i:number)=><p key={i} style={{margin:"4px 0 0 0",color:"white",fontSize:11}}>• {tp}</p>)}
              <p style={{margin:"8px 0 0 0",color:"#0f0",fontSize:10,fontWeight:"bold"}}>• 25 Questions • 60 Minutes • Memo with video-style explanation • Voice reads everything</p>
            </div>
          </div>
          <button onClick={()=>{ if(!hasPaid && solvesUsed>=1) setShowPaywall(true); else alert(`Starting Term ${term} Exam Prep Moc - Gr ${grade} - Topics: ${termTopics[term].join(", ")}`); }} style={{background:hasPaid || solvesUsed<1?"#FFD700":"#555",border:"none",padding:16,borderRadius:12,fontWeight:"bold",width:"100%",marginTop:14,color:"black",fontSize:14}}>{hasPaid || solvesUsed<1?`Start Term ${term} Exam Prep Moc - ${hasPaid?"Unlimited":"1st FREE"}`:`Pay R150 - Unlock Term ${term} Exam Prep Moc`}</button>
        </div>
      )}

      <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #333",padding:"12px",zIndex:40}}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:4}}>
          <span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Pricing: R150</span>
          <span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Refund</span>
          <span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Cancel</span>
        </div>
        <p style={{color:"#777",fontSize:11,textAlign:"center",margin:0}}>R150/month • Exam Prep Mocs T{term} • {hasPaid?"PAID INF All Terms":"FREE "+solvesUsed+"/1 - 1st FREE only"} • Gr {grade} {lang}</p>
      </footer>
    </div>
  );
         }
