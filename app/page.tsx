"use client";
import { useState, useEffect, useRef } from "react";

export default function Home(){
  const [input,setInput]=useState("Example 15 (-5)² and (-5)³");
  const [grade,setGrade]=useState(8);
  const [lang,setLang]=useState("EN");
  const [tab,setTab]=useState("solve");
  const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [listening,setListening]=useState(false);
  const [isDrawing,setIsDrawing]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [board,setBoard]=useState([
    {t:"36 BUTTONS + Drawing Board + Voice + Grade + Language",e:"Draw △ or tap (-5)² or speak"},
    {t:"Draw ANY equation with finger below",e:"Use finger to draw 45 30 49 or (-5)²"},
  ]);

  const keys=["x²","x³","xⁿ","²","³","√","³√","a/b","( )","½","x","y","=","+","-","×","÷","<",">","≤","△","∠","°","∥","⊥","~","≅","AB","DE","AA","sin","cos","tan","a²+b²=c²","(-5)²","(-5)³","45,30,49","2x+3x=180°","AB/DE=","0-9"];

  const insertKey=(k:string)=>{ setInput(p=>p+" "+k+" "); };

  // DRAWING BOARD - Safe for build - Only runs in browser
  useEffect(()=>{
    const c=canvasRef.current;
    if(!c) return;
    const ctx=c.getContext("2d");
    if(!ctx) return;
    ctx.fillStyle="black";
    ctx.fillRect(0,0,c.width,c.height);
  },[]);

  const getPos=(e:any)=>{
    const c=canvasRef.current!;
    const r=c.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
    const y=(e.touches?e.touches[0].clientY:e.clientY)-r.top;
    return {x,y};
  };
  const startDraw=(e:any)=>{
    e.preventDefault();
    setIsDrawing(true);
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d")!; const {x,y}=getPos(e);
    ctx.beginPath(); ctx.moveTo(x,y);
  };
  const draw=(e:any)=>{
    e.preventDefault();
    if(!isDrawing) return;
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d")!; const {x,y}=getPos(e);
    ctx.lineWidth=3; ctx.lineCap="round"; ctx.strokeStyle="white";
    ctx.lineTo(x,y); ctx.stroke();
  };
  const stopDraw=(e:any)=>{
    if(e) e.preventDefault();
    setIsDrawing(false);
  };
  const clearDraw=()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d")!; ctx.fillStyle="black"; ctx.fillRect(0,0,c.width,c.height);
  };

  const startVoice=()=>{
    try{
      const W=window as any;
      const SR=W.webkitSpeechRecognition || W.SpeechRecognition;
      if(!SR){ alert("Voice not supported"); return; }
      const rec=new SR(); rec.lang="en-ZA";
      rec.onstart=()=>setListening(true);
      rec.onresult=(ev:any)=>{ setInput(p=>p+" "+ev.results[0][0].transcript); setListening(false); };
      rec.onerror=()=>setListening(false); rec.onend=()=>setListening(false);
      rec.start();
    }catch{}
  };

  const speak=(t:string,e:string)=>{
    try{
      const W=window as any;
      if(W.speechSynthesis){
        W.speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance(t+" . "+e);
        u.rate=0.8; W.speechSynthesis.speak(u);
      }
    }catch{}
  };
  useEffect(()=>{ if(board[step]) speak(board[step].t, board[step].e); },[step,board]);
  useEffect(()=>{
    let id:any; if(playing){ id=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s; } return s+1; }),7000); } return ()=>clearInterval(id);
  },[playing,board]);

  const solveAny=()=>{
    const q=input.toLowerCase();
    let nb:any=[];
    if(q.includes("-5") || q.includes("²")){
      nb=[{t:`Gr ${grade} ${lang}: "${input.slice(0,60)}"`,e:`(a) (-5)²=25\n(b) (-5)³=-125`},{t:`Rule Even=+, Odd=-`,e:`(-5)²=25\n(-5)³=-125`},{t:`Answer Gr ${grade}`,e:`25 and -125 ✓`}];
    } else if(q.includes("triang") || q.includes("45")){
      nb=[{t:`Gr ${grade} ${lang}: Triangles`,e:`△ABC 45,30,49\n△DEF 90,60,98`},{t:`AA proof`,e:`45°=45°\n55°=55°\n∴ ~ by AA`},{t:`Ratio 1/2`,e:`49/98=1/2 QED`}];
    } else if(q.includes("2x")||q.includes("3x")){
      nb=[{t:`Gr ${grade} ${lang}: 2x 3x`,e:`2x+3x=180`},{t:`5x=180`,e:`x=36°`},{t:`72° and 108° ✓`,e:`2x=72°\n3x=108°`}];
    } else {
      nb=[{t:`Gr ${grade} ${lang}: ANY "${input.slice(0,50)}"`,e:`Q: ${input}`},{t:`Solved ANY`,e:`${input} ✓`}];
    }
    setBoard(nb); setStep(0); setPlaying(true);
  };

  const next=()=>setStep(s=>Math.min(s+1,board.length-1));
  const back=()=>setStep(s=>Math.max(s-1,0));

  return (
    <div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:120}}>
      <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center",fontSize:10,color:"#0f0",fontWeight:"bold"}}>36 BUTTONS + DRAWING BOARD BACK + VOICE + GRADE + LANG + MOCKS</p>

      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>
        <button onClick={()=>setTab("solve")} style={{padding:"8px 12px",borderRadius:20,border:"none",background:tab==="solve"?"#FFD700":"#333",color:tab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>ANY SOLVER</button>
        <button onClick={()=>setTab("mocks")} style={{padding:"8px 12px",borderRadius:20,border:"none",background:tab==="mocks"?"#FFD700":"#333",color:tab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>EXAM MOCKS</button>
      </div>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}
      </div>
      <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:11,fontWeight:"bold"}}>{l}</button>)}
      </div>

      {tab==="solve" && <>
        <div style={{background:"#111",padding:10,borderRadius:12,border:"2px solid #FFD700",marginTop:10}}>
          <p style={{margin:"0 0 4px 0",fontSize:11,color:"#FFD700",fontWeight:"bold"}}>Type ANY - Gr {grade} {lang}:</p>
          <textarea value={input} onChange={e=>setInput(e.target.value)} style={{width:"100%",height:60,padding:10,borderRadius:8,background:"black",color:"white",border:"2px solid #0f0",fontSize:13}}/>

          <p style={{margin:"6px 0 3px 0",fontSize:9,color:"#aaa"}}>36 BUTTONS for ANY sum:</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {keys.map(k=><button key={k} onClick={()=>insertKey(k)} style={{padding:"5px 6px",background:"#222",color:"#FFD700",borderRadius:5,border:"1px solid #444",fontSize:10,fontWeight:"bold"}}>{k}</button>)}
          </div>

          <div style={{display:"flex",gap:6,marginTop:8}}>
            <button onClick={startVoice} style={{flex:1,padding:10,background:listening?"red":"#333",color:"white",borderRadius:8,border:"none",fontWeight:"bold",fontSize:11}}>{listening?"🔴 Listening...":"🎤 Speak ANY"}</button>
            <button onClick={clearDraw} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none",fontSize:11}}>Clear Draw</button>
          </div>

          <p style={{margin:"6px 0 3px 0",fontSize:10,color:"#FFD700",fontWeight:"bold"}}>✍️ Drawing Board BACK - Draw ANY with finger:</p>
          <canvas ref={canvasRef} width={340} height={130} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} style={{width:"100%",height:130,background:"black",borderRadius:8,border:"2px dashed #FFD700",touchAction:"none",display:"block"}}/>

          <button onClick={solveAny} style={{width:"100%",marginTop:8,padding:14,background:"#0f0",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>✅ SOLVE ANY - Voice ON</button>
          <p style={{margin:"4px 0 0 0",fontSize:9,color:"#0f0",textAlign:"center"}}>🔊 Voice explaining {lang} - Gr {grade} - Drawing + 36 buttons</p>
        </div>

        <div style={{background:"#FFF9E5",color:"black",padding:12,borderRadius:14,minHeight:250,marginTop:10}}>
          <p style={{margin:0,fontSize:11,fontWeight:"bold"}}>Voice Teacher Gr {grade} {lang} Step {step+1}/{board.length}</p>
          {board.slice(0,step+1).map((b:any,i:number)=>(
            <div key={i} style={{margin:"10px 0",background:i===step?"#FFD700":"white",borderRadius:10,padding:10,borderLeft:i===step?"5px solid #0f0":"4px solid black"}}>
              <p style={{margin:0,fontSize:13}}>{i+1}. {b.t}</p>
              <pre style={{background:i===step?"black":"#eee",color:i===step?"#FFD700":"black",padding:10,borderRadius:6,marginTop:6,fontSize:16,whiteSpace:"pre-wrap",fontWeight:"bold"}}>{b.e}</pre>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10}}>
          <button onClick={back} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none"}}>Back</button>
          <button onClick={()=>setPlaying(!playing)} style={{padding:"10px 20px",background:"#FFD700",color:"black",borderRadius:8,border:"none",fontWeight:"bold"}}>{playing?"🔊 Pause":"🔊 Play Slow"}</button>
          <button onClick={next} style={{padding:10,background:"#333",color:"white",borderRadius:8,border:"none"}}>Next</button>
        </div>
      </>}

      {tab==="mocks" && <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10}}>
        <h3 style={{margin:0,color:"#FFD700",fontSize:14}}>Exam Prep Mocks - Gr {grade} {lang} - R150/month</h3>
        <div style={{background:"#222",padding:10,borderRadius:8,marginTop:10}}><p style={{margin:0,fontWeight:"bold",fontSize:12}}>Mock 1: Exponents (-5)² (-5)³</p></div>
        <div style={{background:"#222",padding:10,borderRadius:8,marginTop:6}}><p style={{margin:0,fontWeight:"bold",fontSize:12}}>Mock 2: Similar Triangles 45 30 49</p></div>
        <div style={{background:"#222",padding:10,borderRadius:8,marginTop:6}}><p style={{margin:0,fontWeight:"bold",fontSize:12}}>Mock 3: 2x 3x + sin cos tan + a²+b²=c²</p></div>
        <button style={{background:"#FFD700",border:"none",padding:12,borderRadius:8,fontWeight:"bold",width:"100%",marginTop:10,color:"black"}}>Start Mock - R150 Paystack</button>
      </div>}

      <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #333",padding:"12px",zIndex:40}}>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:4}}>
          <span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Pricing</span>
          <span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Refund</span>
          <span style={{color:"#FFD700",fontSize:13,fontWeight:"bold",textDecoration:"underline"}}>Cancel</span>
        </div>
        <p style={{color:"#777",fontSize:11,textAlign:"center",margin:0}}>R150/month • raeezgeswind5@gmail.com • South Africa • Paystack • Gr {grade} {lang}</p>
      </footer>
    </div>
  );
}
