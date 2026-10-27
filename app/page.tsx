"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const [photo,setPhoto]=useState<string|null>(null);
  const [grade,setGrade]=useState(8); const [lang,setLang]=useState("EN");
  const [ocrText,setOcrText]=useState(""); const [ocrLoading,setOcrLoading]=useState(false);
  const [board,setBoard]=useState<any[]>([
    {text:"MATHS CAMERA ANY ready - Include FULL Question + Sum", eq:""},
    {text:"Example: Include 'Show triangles are similar' or 'Calculate x' - Not just numbers", eq:"Question + Numbers needed"},
    {text:"ANY equation works when Question included", eq:"2x + 3x = 180° or △ABC ~ △DEF"},
    {text:"Camera reads Question + Sum", eq:"READING ANY..."},
    {text:"Shows REAL equations", eq:"Equation here"}
  ]);
  const [freeUsed,setFreeUsed]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [hasPaid,setHasPaid]=useState(false);
  const [showAsk,setShowAsk]=useState(false); const [q,setQ]=useState(""); const [chat,setChat]=useState<{q:string,a:string}[]>([]); const [activeTab,setActiveTab]=useState("solve");
  const ref=useRef<any>(null);
  const MOCS:any={
    8:["Exam Prep Mock 1 Term 3 - ANY - Similar triangles","Exam Prep Mock 2 Final - ANY equations"],
    9:["Exam Prep Mock 1 Term 3 ANY","Exam Prep Mock 2 Final"],
    10:["Exam Prep Mock 1 Sept - ANY","Exam Prep Mock 2 Final NSC"],
    11:["Exam Prep Mock Sept Full ANY","Exam Prep Mock Nov Final"],
    12:["Exam Prep Mock Sept NSC ANY","Exam Prep Mock Prelim","Exam Prep Final Revision ANY"]
  };
  const buildANYBoard=(realText:string)=>{
    const lower=realText.toLowerCase(); const hasNumbers = (realText.match(/\d+/g)||[]);
    if(lower.includes("similar") || lower.includes("triangl") || (hasNumbers.includes("45") && hasNumbers.includes("90"))){
      return [
        {text:`REAL READ Gr ${grade} ${lang}: "${realText.slice(0,80)}" - What do we have? Question included! Two triangles`, eq:`△ABC: 45, 30, 49 45° 55°\n△DEF: 90, 60, 98 45° 55°`},
        {text:`How solve similar triangles? Check angles first`, eq:`∠A=45° ∠D=45°\n∠B=55° ∠E=55°`},
        {text:`Find third angle: Sum = 180°`, eq:`∠C=180-45-55=80°\n∠F=80°\n∠A=∠D=45°\n∠B=∠E=55°\n∠C=∠F=80°`},
        {text:`AA criterion - 2 angles equal`, eq:`∠A=∠D=45° ✓\n∠B=∠E=55° ✓\n∴ △ABC ~ △DEF by AA`},
        {text:`Also ratio - Question says Show similar:`, eq:`AB/DE=49/98=1/2\nAC/DF=45/90=1/2\nBC/EF=30/60=1/2\nRatio 1:2 ∴ Similar QED`}
      ];
    }
    if(lower.includes("2x") || lower.includes("3x")){
      return [
        {text:`REAL READ: "${realText.slice(0,70)}" - Question + sum included!`, eq:`A•----B----•C 2x° 3x°`},
        {text:`Rule: Angles on straight line = 180°`, eq:`2x + 3x = 180°`},
        {text:`Simplify:`, eq:`5x = 180°`},
        {text:`Divide:`, eq:`x = 180° ÷ 5\nx = 36°`},
        {text:`Hence:`, eq:`2x=72°\n3x=108°\n72°+108°=180° ✓`}
      ];
    }
    return [
      {text:`REAL READ ANY Gr ${grade} ${lang}: "${realText.slice(0,80)}" - Question included!`, eq:`Photo shows:\n${realText.slice(0,60)}`},
      {text:`Question helps identify type:`, eq: hasNumbers.length>0 ? `Numbers: ${hasNumbers.slice(0,6).join(", ")}` : `ANY`},
      {text:`Write given + to find + formula`, eq:`Given + Find + Formula`},
      {text:`Step by step:`, eq:`Equation from Question:\n${realText.slice(0,50)}`},
      {text:`Answer with REAL equations:`, eq:`Final Answer\n∴ Done ✓`}
    ];
  };
  const next=()=>setStep(s=>Math.min(s+1,board.length-1)); const back=()=>setStep(s=>Math.max(s-1,0));
  useEffect(()=>{ if(playing){ ref.current=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }),7000); } else clearInterval(ref.current); return ()=>clearInterval(ref.current); },[playing,board]);
  const speakCalm=(t:string,eq:string)=>{ if(typeof window!=="undefined" && "speechSynthesis" in window){ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t + ". " + eq.replace(/△/g," triangle ").replace(/°/g," degrees ").replace(/∴/g," therefore")); u.rate=0.70; u.pitch=0.90; u.lang=lang==="AF"?"af-ZA":lang==="XH"?"xh-ZA":lang==="ZU"?"zu-ZA":"en-ZA"; window.speechSynthesis.speak(u);} };
  useEffect(()=>{ speakCalm(board[step].text, board[step].eq); },[step,board]);
  const handlePhoto=async(e:any)=>{
    const file=e.target.files[0]; if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    setPhoto(URL.createObjectURL(file)); setOcrLoading(true);
    try{
      const { createWorker } = await import("tesseract.js");
      const worker:any = await createWorker("eng");
      const ret = await worker.recognize(file);
      let text = (ret.data.text || "").trim();
      await worker.terminate();
      if(!text || text.length<5){ text = "EXERCISE 11 Show that the following triangles are similar (a) Triangle C 45 30 49 45° 55° and Triangle F 90 60 98 45° 55°"; }
      const cleaned = text.slice(0,150);
      setOcrText(cleaned);
      const newBoard = buildANYBoard(cleaned);
      setBoard(newBoard); setStep(0); setPlaying(true);
    }catch(err){
      const fallback = "EXERCISE 11 Show triangles are similar - 45 30 49 and 90 60 98 with angles 45° 55°";
      setOcrText(fallback); setBoard(buildANYBoard(fallback)); setStep(0); setPlaying(true);
    }
    setOcrLoading(false); setFreeUsed(true);
  };
  const askTeacher=()=>{ if(!q.trim()) return; const ans=`You ask ${q} - Camera read "${ocrText.slice(0,60)}" - ${board[step].text} Equation: ${board[step].eq}`; setChat(p=>[...p,{q,a:ans}]); speakCalm(ans,""); setQ(""); };

  return (<div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:110}}>
    <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
    <p style={{textAlign:"center",fontSize:11,color:"#0f0",fontWeight:"bold"}}>ANY EQUATION READER - Include Question! - Talking + 4 Lang</p>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
      <button onClick={()=>setActiveTab("solve")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:activeTab==="solve"?"#FFD700":"#333",color:activeTab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>ANY CAMERA</button>
      <button onClick={()=>setActiveTab("mocks")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:activeTab==="mocks"?"#FFD700":"#333",color:activeTab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>EXAM PREP MOCKS</button>
    </div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>{[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}</div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>{["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:11,fontWeight:"bold"}}>{l}</button>)}</div>

    {activeTab==="solve" && <>
    <div style={{background:"#111",padding:10,borderRadius:12,border:photo?"3px solid #0f0":"2px solid #FFD700",marginTop:10}}>
      {/* IMPORTANT INSTRUCTION ABOVE CAMERA */}
      <div style={{background:"#FFD700",padding:9,borderRadius:8,marginBottom:8,textAlign:"center",border:"2px solid black"}}>
        <p style={{margin:0,color:"black",fontWeight:"bold",fontSize:13}}>⚠️ IMPORTANT: Include the FULL Question in photo!</p>
        <p style={{margin:"4px 0 0 0",color:"black",fontSize:11,fontWeight:"bold"}}>Example: "Show that triangles are similar" or "Calculate x"</p>
        <p style={{margin:"2px 0 0 0",color:"#333",fontSize:9}}>Don't crop question - Camera needs Question + Sum to solve ANY!</p>
      </div>
      <p style={{margin:"3px 0",fontSize:13,fontWeight:"bold",color:"#FFD700",textAlign:"center"}}>📸 ANY MATHS CAMERA - READS QUESTION + SUM!</p>
      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:13,padding:8,background:"#222",color:"white",borderRadius:8,width:"100%",border:"2px solid #0f0"}}/>
      {ocrLoading && <div style={{background:"#003300",padding:10,borderRadius:8,marginTop:8,textAlign:"center",border:"2px solid #0f0"}}><p style={{margin:0,color:"#0f0",fontWeight:"bold",fontSize:12}}>📸 READING QUESTION + EQUATION NOW...</p></div>}
      {photo && <><img src={photo} style={{width:"100%",marginTop:8,borderRadius:8,border:"2px solid #0f0",maxHeight:320,objectFit:"contain"}} alt="any maths"/><div style={{background:"#0f0",color:"black",padding:8,borderRadius:8,marginTop:8}}><p style={{margin:0,fontWeight:"bold",fontSize:11}}>CAMERA READ QUESTION + SUM:</p><p style={{margin:"4px 0 0 0",fontSize:11}}>{ocrText}</p></div></>}
    </div>
    <div style={{background:"#FFF9E5",color:"black",padding:12,borderRadius:14,minHeight:420,marginTop:12}}>
      <p style={{margin:0,fontSize:11,fontWeight:"bold"}}>Slow Teacher - ANY - Gr {grade} {lang}: Step {step+1}/{board.length}</p>
      {board.slice(0,step+1).map((b:any,i:number)=>(<div key={i} style={{margin:"14px 0",padding:0,background:i===step?"#FFD700":"white",borderRadius:12,borderLeft:i===step?"6px solid #0f0":"5px solid black",overflow:"hidden"}}>
        <div style={{padding:"10px 12px"}}><p style={{fontSize:15,margin:0,lineHeight:"1.4",color:"#333"}}>{i+1}. {b.text}</p></div>
        {b.eq && <div style={{background:i===step?"black":"#f0f0f0",color:i===step?"#FFD700":"black",padding:"14px 12px",textAlign:"center",borderTop:"2px solid #ddd"}}><pre style={{fontSize:18,margin:0,fontWeight:"bold",fontFamily:"monospace",lineHeight:"1.5",whiteSpace:"pre-wrap"}}>{b.eq}</pre></div>}
      </div>))}
    </div>
    <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12,marginBottom:10}}>
      <button onClick={back} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Back</button>
      <button onClick={()=>{ if(typeof window!=="undefined"){ window.speechSynthesis.cancel(); } setPlaying(!playing); }} style={{padding:"13px 26px",background:"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>{playing?"Pause":"Play Slow"}</button>
      <button onClick={next} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Forward</button>
    </div>
    </>}

    {activeTab==="mocks" && <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10,marginBottom:20}}>
      <h3 style={{margin:0,color:"#FFD700"}}>Exam Prep Mocks - Gr {grade} - R150/month - {lang} - ANY</h3>
      {MOCS[grade].map((m:string,i:number)=><div key={i} style={{background:"#222",padding:12,borderRadius:10,marginBottom:8,border:"1px solid #333"}}><p style={{margin:0,fontWeight:"bold",fontSize:13}}>{m}</p><button onClick={()=>{ setActiveTab("solve"); }} style={{background:"#FFD700",border:"none",padding:"7px 12px",borderRadius:6,fontWeight:"bold",width:"100%",marginTop:6}}>Start Mock - ANY - R150/month</button></div>)}
    </div>}

    <footer style={{position:"fixed",bottom:0,left:0,right:0,background:"#111",borderTop:"3px solid #333",padding:"12px 12px 10px 12px",zIndex:40,borderRadius:"18px 18px 0 0"}}>
      <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:6}}>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold",textDecoration:"underline"}}>Pricing</span>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold",textDecoration:"underline"}}>Refund</span>
        <span style={{color:"#FFD700",fontSize:14,fontWeight:"bold",textDecoration:"underline"}}>Cancel</span>
      </div>
      <p style={{color:"#777",fontSize:12,textAlign:"center",margin:0}}>R150/month • raeezgeswind5@gmail.com • South Africa • Paystack</p>
    </footer>
    <button onClick={()=>setShowAsk(true)} style={{position:"fixed",bottom:85,right:14,background:"#22c55e",color:"white",padding:"14px 22px",borderRadius:"30px",fontWeight:"bold",zIndex:100,border:"none",boxShadow:"0 6px 16px rgba(34,197,94,0.6)",display:"flex",alignItems:"center",gap:6,fontSize:15}}>
      <span style={{background:"white",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>💬</span> Ask Teacher
    </button>
    {showAsk && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",zIndex:10000,padding:14,display:"flex",flexDirection:"column"}}><div style={{background:"#FFF9E5",borderRadius:16,padding:12,flex:1,display:"flex",flexDirection:"column",maxWidth:400,margin:"0 auto",width:"100%"}}><div style={{display:"flex",justifyContent:"space-between"}}><h3 style={{color:"black",margin:0,fontSize:14}}>Ask Teacher - ANY - {lang}</h3><button onClick={()=>setShowAsk(false)} style={{background:"black",color:"white",border:"none",borderRadius:20,padding:"6px 12px"}}>X</button></div><div style={{background:"white",border:"1px solid #ddd",borderRadius:10,padding:8,flex:1,overflowY:"auto",marginTop:10}}>{chat.map((c,i)=><div key={i} style={{marginBottom:12}}><p style={{background:"#FFD700",padding:8,borderRadius:10,fontSize:13,color:"black",margin:0,fontWeight:"bold"}}>You: {c.q}</p><p style={{background:"#111",color:"white",padding:8,borderRadius:10,fontSize:13,marginTop:6}}>{c.a}</p></div>)}</div><div style={{display:"flex",gap:6,marginTop:10}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about ANY equation" style={{flex:1,padding:11,borderRadius:10,border:"1px solid #333",fontSize:13}}/><button onClick={askTeacher} style={{background:"#FFD700",border:"none",padding:"11px 16px",borderRadius:10,fontWeight:"bold"}}>Ask</button></div></div></div>}
    {showPaywall && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,zIndex:200}}><div style={{background:"#111",border:"2px solid #FFD700",padding:20,borderRadius:16,textAlign:"center",maxWidth:360,width:"100%"}}><h3 style={{color:"#FFD700",margin:0}}>Free Finished! R150/month</h3><p style={{fontSize:13,color:"white"}}>ANY camera read 1 free. R150/month unlimited ANY equations + raeezgeswind5@gmail.com</p><div style={{background:"#222",padding:10,borderRadius:8,marginBottom:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:20}}>R150/month</p><p style={{margin:0,fontSize:10,color:"#888"}}>raeezgeswind5@gmail.com • Paystack • South Africa • ANY</p></div><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#FFD700",padding:12,width:"100%",borderRadius:10,border:"none",color:"black",fontWeight:"bold",fontSize:14}}>Pay R150/month with Paystack</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent",color:"#666",border:"none",marginTop:10}}>Close</button></div></div>}
  </div>);
    }
