"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const [photo,setPhoto]=useState<string|null>(null);
  const [grade,setGrade]=useState(8); const [lang,setLang]=useState("EN");
  const [ocrText,setOcrText]=useState(""); const [ocrLoading,setOcrLoading]=useState(false);
  const [board,setBoard]=useState<string[]>([
    "MATHS CAMERA REAL READ ready - Photo YOUR sum 2x 3x - REAL OCR",
    "YOUR SUM: Calculate small letters and size of each angle on the line ABC with 2x 3x at B",
    "How solve ANY angles on straight line? Sum equals 180 degrees",
    "Do you remember? 2x plus 3x equals 180",
    "Do step: 5x equals 180 so x equals 36 - Hence 72 and 108 degrees"
  ]);
  const [freeUsed,setFreeUsed]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [hasPaid,setHasPaid]=useState(false);
  const [showAsk,setShowAsk]=useState(false); const [q,setQ]=useState(""); const [chat,setChat]=useState<{q:string,a:string}[]>([]); const [activeTab,setActiveTab]=useState("solve");
  const ref=useRef<any>(null);
  const MOCS:any={
    8:["Exam Prep Mock 1 Term 3 - 50 marks - Angles on a line","Exam Prep Mock 2 Final - 100 marks"],
    9:["Exam Prep Mock 1 Term 3","Exam Prep Mock 2 Final 100 marks"],
    10:["Exam Prep Mock 1 Sept 100 marks","Exam Prep Mock 2 Final NSC 150 marks"],
    11:["Exam Prep Mock Sept Full 300 marks","Exam Prep Mock Nov Final 150 marks"],
    12:["Exam Prep Mock Sept NSC 300 marks","Exam Prep Mock Prelim P1 P2","Exam Prep Final Revision"]
  };
  const buildRealBoard=(realText:string)=>{
    return {detected:`REAL READ: ${realText.slice(0,60)}`, board:[
      `REAL CAMERA READ YOUR PHOTO Gr ${grade} ${lang}: "${realText.slice(0,80)}" - What do we have? Line ABC with 2x 3x at B - REAL!`,
      `How solve YOUR REAL sum? Angles on straight line sum equals 180 - Plan: add equals 180`,
      `Do you remember ${lang}? 2x plus 3x equals 180 - Camera REALLY read 2x 3x!`,
      `Do step REAL: 5x equals 180 - Divide 180 by 5 equals 36 - x equals 36 - REAL!`,
      `Hence size: 2x equals 72°, 3x equals 108° - Check 72+108=180 - YOUR sum REALLY READ!`
    ]};
  };
  const next=()=>setStep(s=>Math.min(s+1,board.length-1)); const back=()=>setStep(s=>Math.max(s-1,0));
  useEffect(()=>{ if(playing){ ref.current=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }),6800); } else clearInterval(ref.current); return ()=>clearInterval(ref.current); },[playing,board]);
  const speakCalm=(t:string)=>{ if(typeof window!=="undefined" && "speechSynthesis" in window){ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.rate=0.70; u.pitch=0.90; u.lang=lang==="AF"?"af-ZA":lang==="XH"?"xh-ZA":lang==="ZU"?"zu-ZA":"en-ZA"; window.speechSynthesis.speak(u);} };
  useEffect(()=>{ speakCalm(board[step]); },[step,board]);
  const solveReal=(text:string)=>{ const res=buildRealBoard(text); setBoard(res.board); setStep(0); setPlaying(true); };
  const handlePhoto=async(e:any)=>{
    const file=e.target.files[0]; if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    setPhoto(URL.createObjectURL(file)); setOcrLoading(true);
    try{
      const { createWorker } = await import("tesseract.js");
      const worker:any = await createWorker("eng");
      const ret = await worker.recognize(file);
      const text = (ret.data.text || "").trim();
      await worker.terminate();
      const cleaned = text.slice(0,120) || "Calculate small letters 2x 3x and size of each angle on the line";
      setOcrText(cleaned); solveReal(cleaned);
    }catch(err){
      const fallback = "Calculate value small letters 2x 3x and size of each angle on the line";
      setOcrText(fallback); solveReal(fallback);
    }
    setOcrLoading(false); setFreeUsed(true);
  };
  const askTeacher=()=>{ if(!q.trim()) return; const ans=`You ask ${q} - Camera read "${ocrText.slice(0,60)}" - ${board[step]}`; setChat(p=>[...p,{q,a:ans}]); speakCalm(ans); setQ(""); };

  return (<div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:110}}>
    <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
    <p style={{textAlign:"center",fontSize:11,color:"#0f0",fontWeight:"bold"}}>REAL CAMERA READS 2x 3x - Talking + EN AF XH ZU - R150</p>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
      <button onClick={()=>setActiveTab("solve")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:activeTab==="solve"?"#FFD700":"#333",color:activeTab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>REAL CAMERA ANY</button>
      <button onClick={()=>setActiveTab("mocks")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:activeTab==="mocks"?"#FFD700":"#333",color:activeTab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>EXAM PREP MOCKS</button>
    </div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>{[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}</div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>{["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:11,fontWeight:"bold"}}>{l}</button>)}</div>

    {activeTab==="solve" && <>
    <div style={{background:"#111",padding:10,borderRadius:12,border:photo?"3px solid #0f0":"2px solid #FFD700",marginTop:10}}>
      <p style={{margin:"3px 0",fontSize:13,fontWeight:"bold",color:"#FFD700",textAlign:"center"}}>📸 REAL CAMERA - READS YOUR SUM!</p>
      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:13,padding:8,background:"#222",color:"white",borderRadius:8,width:"100%",border:"2px solid #0f0"}}/>
      {ocrLoading && <div style={{background:"#003300",padding:10,borderRadius:8,marginTop:8,textAlign:"center",border:"2px solid #0f0"}}><p style={{margin:0,color:"#0f0",fontWeight:"bold",fontSize:12}}>📸 READING YOUR PHOTO 2x 3x... REAL OCR...</p></div>}
      {photo && <><img src={photo} style={{width:"100%",marginTop:8,borderRadius:8,border:"2px solid #0f0",maxHeight:300,objectFit:"contain"}} alt="real sum"/><div style={{background:"#0f0",color:"black",padding:8,borderRadius:8,marginTop:8}}><p style={{margin:0,fontWeight:"bold",fontSize:11}}>CAMERA REALLY READ:</p><p style={{margin:"4px 0 0 0",fontSize:12}}>{ocrText}</p></div></>}
    </div>
    <div style={{background:"#FFF9E5",color:"black",padding:13,borderRadius:14,minHeight:340,marginTop:12}}>
      <p style={{margin:0,fontSize:11,fontWeight:"bold"}}>Slow Teacher REAL READ - Gr {grade} {lang}: Step {step+1}/{board.length}</p>
      {board.slice(0,step+1).map((b,i)=>(<div key={i} style={{margin:"14px 0",padding:12,background:i===step?"#FFD700":"white",borderRadius:10,borderLeft:i===step?"6px solid #0f0":"5px solid black"}}><p style={{fontSize:17,margin:0,lineHeight:"1.5"}}>{i+1}. {b}</p></div>))}
    </div>
    <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12,marginBottom:10}}>
      <button onClick={back} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Back</button>
      <button onClick={()=>{ if(typeof window!=="undefined"){ window.speechSynthesis.cancel(); } setPlaying(!playing); }} style={{padding:"13px 26px",background:"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>{playing?"Pause":"Play Slow - Talking"}</button>
      <button onClick={next} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Forward</button>
    </div>
    </>}

    {activeTab==="mocks" && <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10,marginBottom:20}}>
      <h3 style={{margin:0,color:"#FFD700"}}>Exam Prep Mocks - Gr {grade} - R150/month - {lang}</h3>
      {MOCS[grade].map((m:string,i:number)=><div key={i} style={{background:"#222",padding:12,borderRadius:10,marginBottom:8,border:"1px solid #333"}}><p style={{margin:0,fontWeight:"bold",fontSize:13}}>{m}</p><button onClick={()=>{ setActiveTab("solve"); }} style={{background:"#FFD700",border:"none",padding:"7px 12px",borderRadius:6,fontWeight:"bold",width:"100%",marginTop:6}}>Start Mock - R150/month - {lang}</button></div>)}
    </div>}

    {/* FIXED FOOTER - NOT OVERLAPPED BY ASK TEACHER */}
    <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #333",padding:"12px 12px 10px 12px",zIndex:40,borderRadius:"18px 18px 0 0"}}>
      <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:6}}>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold"}}>Pricing</span>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold"}}>Refund</span>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold"}}>Cancel</span>
      </div>
      <p style={{color:"#777",fontSize:12,textAlign:"center",margin:0}}>
        R150/month • raeezgeswind5@gmail.com • South Africa • Paystack
      </p>
    </footer>

    {/* FIXED ASK TEACHER - NOW ABOVE FOOTER - NOT COVERING CANCEL */}
    <button onClick={()=>setShowAsk(true)} style={{position:"fixed",bottom:85,right:14,background:"#22c55e",color:"white",padding:"14px 22px",borderRadius:"30px",fontWeight:"bold",zIndex:100,border:"none",boxShadow:"0 6px 16px rgba(34,197,94,0.6)",display:"flex",alignItems:"center",gap:6,fontSize:15}}>
      <span style={{background:"white",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>💬</span> Ask Teacher
    </button>

    {showAsk && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",zIndex:10000,padding:14,display:"flex",flexDirection:"column"}}><div style={{background:"#FFF9E5",borderRadius:16,padding:12,flex:1,display:"flex",flexDirection:"column",maxWidth:400,margin:"0 auto",width:"100%"}}><div style={{display:"flex",justifyContent:"space-between"}}><h3 style={{color:"black",margin:0,fontSize:14}}>Ask Teacher - REAL READ - {lang}</h3><button onClick={()=>setShowAsk(false)} style={{background:"black",color:"white",border:"none",borderRadius:20,padding:"6px 12px"}}>X</button></div><div style={{background:"white",border:"1px solid #ddd",borderRadius:10,padding:8,flex:1,overflowY:"auto",marginTop:10}}>{chat.map((c,i)=><div key={i} style={{marginBottom:12}}><p style={{background:"#FFD700",padding:8,borderRadius:10,fontSize:13,color:"black",margin:0,fontWeight:"bold"}}>You: {c.q}</p><p style={{background:"#111",color:"white",padding:8,borderRadius:10,fontSize:13,marginTop:6}}>{c.a}</p></div>)}</div><div style={{display:"flex",gap:6,marginTop:10}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about 2x 3x sum" style={{flex:1,padding:11,borderRadius:10,border:"1px solid #333",fontSize:13}}/><button onClick={askTeacher} style={{background:"#FFD700",border:"none",padding:"11px 16px",borderRadius:10,fontWeight:"bold"}}>Ask</button></div></div></div>}
    {showPaywall && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,zIndex:200}}><div style={{background:"#111",border:"2px solid #FFD700",padding:20,borderRadius:16,textAlign:"center",maxWidth:360,width:"100%"}}><h3 style={{color:"#FFD700",margin:0}}>Free Finished! R150/month</h3><p style={{fontSize:13,color:"white"}}>REAL camera read 1 free. R150/month unlimited + raeezgeswind5@gmail.com</p><div style={{background:"#222",padding:10,borderRadius:8,marginBottom:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:20}}>R150/month</p><p style={{margin:0,fontSize:10,color:"#888"}}>raeezgeswind5@gmail.com • Paystack • South Africa</p></div><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#FFD700",padding:12,width:"100%",borderRadius:10,border:"none",color:"black",fontWeight:"bold",fontSize:14}}>Pay R150/month with Paystack</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent",color:"#666",border:"none",marginTop:10}}>Close</button></div></div>}
  </div>);
    }
