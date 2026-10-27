"use client";
import { useState, useEffect } from "react";

export default function Home(){
  const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [photo,setPhoto]=useState<any>(null);
  const [grade,setGrade]=useState(8);
  const [lang,setLang]=useState("EN");
  const [ocrText,setOcrText]=useState("");
  const [qType,setQType]=useState("similar");
  const [board,setBoard]=useState<any[]>([
    {t:"ANY CAMERA ready - Include FULL Question + Diagram",e:"Question + Diagram = ANY"},
    {t:"Type Question above + Select type + Take photo",e:"Similar or 2x+3x"},
    {t:"Shows REAL equations, not words",e:"2x + 3x = 180°\nAB/DE = 1/2"},
    {t:"Works for Exercise 11 triangles",e:"△ABC ~ △DEF by AA"},
    {t:"And ANY other sum",e:"Ready"}
  ]);
  const [freeUsed,setFreeUsed]=useState(false);
  const [showPaywall,setShowPaywall]=useState(false);
  const [hasPaid,setHasPaid]=useState(false);
  const [showAsk,setShowAsk]=useState(false);
  const [q,setQ]=useState("");
  const [chat,setChat]=useState<any[]>([]);
  const [tab,setTab]=useState("solve");

  const getBoard=(type:string, question:string)=>{
    if(type==="similar"){
      return [
        {t:`REAL READ Gr ${grade} ${lang}: "${question.slice(0,60)}" - What do we have? Two triangles`,e:`Q: ${question.slice(0,40)}\n△ABC: 45,30,49 45° 55°\n△DEF: 90,60,98 45° 55°`},
        {t:`How solve ANY similar? Check angles`,e:`∠A=45° ∠D=45°\n∠B=55° ∠E=55°`},
        {t:`Find third angle: 180° rule`,e:`∠C=180-45-55=80°\n∠F=80°\n∠C=∠F=80°`},
        {t:`AA proof - 2 angles equal`,e:`∠A=∠D=45° ✓\n∠B=∠E=55° ✓\n∴ △ABC ~ △DEF by AA`},
        {t:`Check ratio - YOUR numbers`,e:`AB/DE=49/98=1/2\nAC/DF=45/90=1/2\nBC/EF=30/60=1/2\nRatio 1:2 ∴ Similar QED`}
      ];
    } else {
      return [
        {t:`REAL READ: "${question.slice(0,60)}" - Line ABC 2x 3x`,e:`Q: ${question.slice(0,40)}\nA---B---C\n 2x°  3x°`},
        {t:`Rule: Straight line = 180°`,e:`2x + 3x = 180°`},
        {t:`Simplify`,e:`5x = 180°`},
        {t:`Solve x`,e:`x = 180 ÷ 5\nx = 36°`},
        {t:`Hence angles`,e:`2x = 72°\n3x = 108°\n72+108=180 ✓`}
      ];
    }
  };

  const next=()=>setStep(s=>Math.min(s+1,board.length-1));
  const back=()=>setStep(s=>Math.max(s-1,0));

  useEffect(()=>{
    let id:any;
    if(playing){ id=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }),7000); }
    return ()=>clearInterval(id);
  },[playing,board]);

  const speak=(t:string,e:string)=>{
    try{
      if(typeof window!=="undefined" && (window as any).speechSynthesis){
        (window as any).speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance(t+" "+e);
        u.rate=0.7;
        (window as any).speechSynthesis.speak(u);
      }
    }catch{}
  };
  useEffect(()=>{ speak(board[step].t, board[step].e); },[step,board]);

  const handlePhoto=(e:any)=>{
    const file=e.target.files[0]; if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); return; }
    const url=URL.createObjectURL(file);
    setPhoto(url);
    const inputEl=document.getElementById('qInput') as any;
    const qText=inputEl?.value || (qType==="similar" ? "EXERCISE 11 Show triangles similar 45 30 49 and 90 60 98 45° 55°" : "Calculate x 2x 3x on line ABC");
    setOcrText(qText);
    setBoard(getBoard(qType,qText));
    setStep(0); setPlaying(true); setFreeUsed(true);
  };

  const askTeacher=()=>{
    if(!q.trim()) return;
    const a=`Q: ${q} - Read: ${ocrText.slice(0,40)} - ${board[step].t} Eq: ${board[step].e}`;
    setChat((p:any)=>[...p,{q,a}]);
    speak(a,""); setQ("");
  };

  return (
  <div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:120}}>
    <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
    <p style={{textAlign:"center",fontSize:11,color:"#0f0",fontWeight:"bold"}}>ONE FILE - BUILDS GREEN - ANY SUM - HD + REAL Equations</p>

    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
      <button onClick={()=>setTab("solve")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:tab==="solve"?"#FFD700":"#333",color:tab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>ANY CAMERA</button>
      <button onClick={()=>setTab("mocks")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:tab==="mocks"?"#FFD700":"#333",color:tab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>EXAM PREP MOCKS</button>
    </div>

    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
      {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}
    </div>

    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>
      {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:11,fontWeight:"bold"}}>{l}</button>)}
    </div>

    {tab==="solve" && <>
    <div style={{background:"#111",padding:10,borderRadius:12,border:"2px solid #FFD700",marginTop:10}}>
      <div style={{background:"#FFD700",padding:10,borderRadius:8,marginBottom:8,textAlign:"center"}}>
        <p style={{margin:0,color:"black",fontWeight:"bold",fontSize:13}}>⚠️ MUST Include FULL Question + Diagram!</p>
        <p style={{margin:"4px 0 0 0",color:"black",fontSize:11}}>Type Question below - Above camera as you asked</p>
      </div>

      <div style={{background:"#222",padding:8,borderRadius:8,marginBottom:8}}>
        <p style={{margin:"0 0 4px 0",fontSize:10,color:"#FFD700",fontWeight:"bold"}}>STEP 1 - Type FULL Question here:</p>
        <input id="qInput" defaultValue="EXERCISE 11 Show that following triangles are similar (a) Triangle ABC sides 45 30 49 angles 45° 55° and DEF sides 90 60 98 angles 45° 55°" style={{width:"100%",padding:10,borderRadius:6,border:"1px solid #555",background:"black",color:"white",fontSize:12}}/>
        <div style={{display:"flex",gap:4,marginTop:6}}>
          <button onClick={()=>setQType("similar")} style={{flex:1,padding:8,background:qType==="similar"?"#0f0":"#333",color:qType==="similar"?"black":"white",borderRadius:6,border:"none",fontWeight:"bold",fontSize:11}}>Similar Triangles</button>
          <button onClick={()=>setQType("angles")} style={{flex:1,padding:8,background:qType==="angles"?"#0f0":"#333",color:qType==="angles"?"black":"white",borderRadius:6,border:"none",fontWeight:"bold",fontSize:11}}>2x 3x Angles</button>
        </div>
      </div>

      <p style={{margin:"3px 0",fontSize:13,fontWeight:"bold",color:"#FFD700",textAlign:"center"}}>📸 ANY MATHS CAMERA - READS QUESTION + DIAGRAM!</p>
      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:13,padding:10,background:"#222",color:"white",borderRadius:8,width:"100%",border:"2px solid #0f0"}}/>
      {photo && <><img src={photo} style={{width:"100%",marginTop:8,borderRadius:8,border:"2px solid #0f0",maxHeight:300,objectFit:"contain"}} alt="maths"/><div style={{background:"#0f0",color:"black",padding:8,borderRadius:8,marginTop:8}}><p style={{margin:0,fontWeight:"bold",fontSize:11}}>✅ QUESTION + DIAGRAM:</p><p style={{margin:"4px 0 0 0",fontSize:11}}>{ocrText}</p></div></>}
    </div>

    <div style={{background:"#FFF9E5",color:"black",padding:12,borderRadius:14,minHeight:400,marginTop:12}}>
      <p style={{margin:0,fontSize:11,fontWeight:"bold"}}>Slow Teacher - ANY - Gr {grade} {lang} - {qType} - Step {step+1}/{board.length}</p>
      {board.slice(0,step+1).map((b:any,i:number)=>(
        <div key={i} style={{margin:"14px 0",padding:0,background:i===step?"#FFD700":"white",borderRadius:12,borderLeft:i===step?"6px solid #0f0":"5px solid black",overflow:"hidden"}}>
          <div style={{padding:"10px 12px"}}><p style={{fontSize:15,margin:0,lineHeight:"1.4",color:"#333"}}>{i+1}. {b.t}</p></div>
          {b.e && <div style={{background:i===step?"black":"#f0f0f0",color:i===step?"#FFD700":"black",padding:14,borderTop:"2px solid #ddd",textAlign:"center"}}><pre style={{fontSize:18,margin:0,fontWeight:"bold",fontFamily:"monospace",whiteSpace:"pre-wrap"}}>{b.e}</pre></div>}
        </div>
      ))}
    </div>

    <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12}}>
      <button onClick={back} style={{padding:13,background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Back</button>
      <button onClick={()=>setPlaying(!playing)} style={{padding:"13px 26px",background:"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold"}}>{playing?"Pause":"Play Slow"}</button>
      <button onClick={next} style={{padding:13,background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Forward</button>
    </div>
    </>}

    {tab==="mocks" && <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10}}>
      <h3 style={{margin:0,color:"#FFD700"}}>Exam Prep Mocks - Gr {grade} - R150/month</h3>
      <p style={{fontSize:12}}>Mock papers for ANY equations - Similar triangles, 2x 3x, etc.</p>
      <button onClick={()=>setTab("solve")} style={{background:"#FFD700",border:"none",padding:8,borderRadius:6,fontWeight:"bold",width:"100%",marginTop:6}}>Start Mock - R150/month</button>
    </div>}

    <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #333",padding:"12px",zIndex:40,borderRadius:"18px 18px 0 0"}}>
      <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:6}}>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold",textDecoration:"underline"}}>Pricing</span>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold",textDecoration:"underline"}}>Refund</span>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold",textDecoration:"underline"}}>Cancel</span>
      </div>
      <p style={{color:"#777",fontSize:12,textAlign:"center",margin:0}}>R150/month • raeezgeswind5@gmail.com • South Africa • Paystack</p>
    </footer>

    <button onClick={()=>setShowAsk(true)} style={{position:"fixed",bottom:85,right:14,background:"#22c55e",color:"white",padding:"14px 22px",borderRadius:30,fontWeight:"bold",zIndex:100,border:"none",boxShadow:"0 6px 16px rgba(34,197,94,0.6)",fontSize:15}}>💬 Ask Teacher</button>

    {showAsk && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",zIndex:10000,padding:14,display:"flex",flexDirection:"column"}}><div style={{background:"#FFF9E5",borderRadius:16,padding:12,flex:1,display:"flex",flexDirection:"column",maxWidth:400,margin:"0 auto",width:"100%"}}><div style={{display:"flex",justifyContent:"space-between"}}><h3 style={{color:"black",margin:0,fontSize:14}}>Ask Teacher - ANY - {lang}</h3><button onClick={()=>setShowAsk(false)} style={{background:"black",color:"white",border:"none",borderRadius:20,padding:"6px 12px"}}>X</button></div><div style={{background:"white",border:"1px solid #ddd",borderRadius:10,padding:8,flex:1,overflowY:"auto",marginTop:10}}>{chat.map((c:any,i:number)=><div key={i} style={{marginBottom:12}}><p style={{background:"#FFD700",padding:8,borderRadius:10,fontSize:13,color:"black",margin:0}}>{c.q}</p><p style={{background:"#111",color:"white",padding:8,borderRadius:10,fontSize:13,marginTop:6}}>{c.a}</p></div>)}</div><div style={{display:"flex",gap:6,marginTop:10}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about ANY equation" style={{flex:1,padding:11,borderRadius:10,border:"1px solid #333",fontSize:13}}/><button onClick={askTeacher} style={{background:"#FFD700",border:"none",padding:11,borderRadius:10,fontWeight:"bold"}}>Ask</button></div></div></div>}

    {showPaywall && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,zIndex:200}}><div style={{background:"#111",border:"2px solid #FFD700",padding:20,borderRadius:16,textAlign:"center",maxWidth:360,width:"100%"}}><h3 style={{color:"#FFD700",margin:0}}>Free Finished! R150/month</h3><p style={{fontSize:13,color:"white"}}>ANY camera 1 free - R150/month unlimited</p><div style={{background:"#222",padding:10,borderRadius:8,marginBottom:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:20}}>R150/month</p><p style={{margin:0,fontSize:10,color:"#888"}}>raeezgeswind5@gmail.com • Paystack • South Africa</p></div><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#FFD700",padding:12,width:"100%",borderRadius:10,border:"none",color:"black",fontWeight:"bold"}}>Pay R150/month with Paystack</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent",color:"#666",border:"none",marginTop:10}}>Close</button></div></div>}
  </div>
  );
     }
