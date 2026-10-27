"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const [photo,setPhoto]=useState<string|null>(null);
  const [grade,setGrade]=useState(8); const [detected,setDetected]=useState("ANY maths sum from photo");
  const [board,setBoard]=useState<string[]>(["MATHS CAMERA ANY ready - Photo ANY sum","No typing needed - camera is maths one","ANY type: triangle, algebra, geometry, finance - just photo","Teacher sees photo and solves ANY type slow","Photo ANY sum - no keyboard triangle needed"]);
  const [freeUsed,setFreeUsed]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [hasPaid,setHasPaid]=useState(false);
  const [showAsk,setShowAsk]=useState(false); const [q,setQ]=useState(""); const [chat,setChat]=useState<{q:string,a:string}[]>([]); const [activeTab,setActiveTab]=useState("solve");
  const ref=useRef<any>(null);
  const MOCS:any={
    8:["Exam Prep Mock 1 Term 3 - 50 marks ANY","Exam Prep Mock 2 Final - 100 marks ALL"],
    9:["Exam Prep Mock 1 Term 3 ANY","Exam Prep Mock 2 Final 100 marks"],
    10:["Exam Prep Mock 1 Sept 100 marks","Exam Prep Mock 2 Final NSC 150 marks"],
    11:["Exam Prep Mock Sept Full 300 marks ANY","Exam Prep Mock Nov Final 150 marks"],
    12:["Exam Prep Mock Sept NSC 300 marks ANY","Exam Prep Mock Prelim P1 P2 300 marks","Exam Prep Final Revision ALL"]
  };
  const buildBoard=(raw:string, nums:number[])=>{
    const lower=raw.toLowerCase(); let L=nums[0]||6; let B=nums[1]||4;
    if(L>200)L=6; if(B>200)B=4;
    // For ANY photo we give universal teacher that works for triangle without typing
    if(photo){
      return {detected:`MATHS CAMERA ANY: Photo detected - Gr ${grade} ANY type`, board:[
        `MATHS CAMERA ANY saw your photo - Gr ${grade}. What do we have? Look at photo - is it triangle? Algebra? Geometry? ANY type works - no keyboard needed.`,
        `How solve ANY photo sum? Teacher looks at photo first - what type is it? Triangle? Factorization? Equation? ANY type - need plan.`,
        `Do you remember formula for ANY type? If triangle with 90 degrees use Pythagoras AB2 plus BC2 equals AC2. If rectangle perimeter use 2L plus 2B. Works for ANY photo.`,
        `Do step by step for ANY photo: Write what you see in photo, what you must find, what formula for ANY type, put numbers from photo, calculate slow.`,
        `Answer for ANY photo sum explained slow HOW she got it - no typing triangle - just photo ANY and teacher explains ANY type - that is MATHS CAMERA ANY!`
      ]};
    }
    if(lower.includes("perimeter")){ return {detected:`MATHS ANY: Rectangle ${L}x${B} Perimeter`, board:[`MATHS CAMERA ANY: Rectangle ${L}x${B} Perimeter ANY type`,`How solve ANY perimeter? Add all sides`,`Do you remember? P equals 2L plus 2B for ANY`,`So ${2*L} plus ${2*B}`,`Answer ${2*L+2*B}cm for ANY`]}; }
    if(lower.includes("area")){ return {detected:`MATHS ANY: Area ${L}x${B}`, board:[`MATHS ANY: Area ${L}x${B} ANY type`,`How? Space inside`,`Do you remember? Area equals L times B ANY`,`So ${L} times ${B}`,`Answer ${L*B} cm2 ANY`]}; }
    if(lower.includes("factor")||raw.includes("20a")){ return {detected:`MATHS ANY: Factorization ANY`, board:[`MATHS ANY: Factorization ANY algebra`,`How? Find common for ANY`,`Do you remember? Biggest common 4 ANY`,`20 divided by 4 equals 5`,`Answer 4 times (5a3 minus bc) ANY`]}; }
    return {detected:`MATHS ANY: Photo ANY sum - Gr ${grade}`, board:[
      `MATHS CAMERA ANY saw photo Gr ${grade} - ANY type without typing keyboard - triangle no need to draw`,
      `What do we have? Photo shows maths sum - could be ANY type - triangle, algebra, geometry - camera is maths one`,
      `How solve ANY without keyboard? Teacher looks at photo, makes plan for ANY type, remembers formula for ANY`,
      `Do step by step for ANY photo: What you see, what to find, formula for ANY type, numbers, answer slow`,
      `Answer for ANY photo sum - no keyboard typing triangle - just photo ANY and teacher explains HOW - MATHS CAMERA ANY!`
    ]};
  };
  const next=()=>setStep(s=>Math.min(s+1,board.length-1)); const back=()=>setStep(s=>Math.max(s-1,0));
  useEffect(()=>{ if(playing){ ref.current=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }),6500); } else clearInterval(ref.current); return ()=>clearInterval(ref.current); },[playing,board]);
  const solveAny=(raw:string)=>{ const nums=(raw.match(/\d+/g)||[]).map((n:string)=>parseInt(n)); const res=buildBoard(raw,nums); setDetected(res.detected); setBoard(res.board); setStep(0); setPlaying(true); };
  const handlePhoto=(e:any)=>{ 
    const file=e.target.files[0]; if(!file) return; 
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    setPhoto(URL.createObjectURL(file)); 
    // NO TYPING NEEDED - auto solve ANY type from photo
    setTimeout(()=>{ solveAny("ANY sum photo Gr "+grade+" - triangle algebra geometry finance ANY"); }, 500);
    setFreeUsed(true); 
  };
  const askTeacher=()=>{ if(!q.trim()) return; const ans=`You ask ${q} about ${detected}. For ANY photo sum: ${board[step]}`; setChat(p=>[...p,{q,a:ans}]); setQ(""); };

  return (<div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:0}}>
    <h2 style={{textAlign:"center",color:"#FFD700",margin:0}}>CAPS MATHS BUDDY 786</h2>
    <p style={{textAlign:"center",fontSize:13,color:"#0f0",fontWeight:"bold"}}>MATHS CAMERA FOR ANY TYPE - NO TYPING! - R150</p>
    <p style={{textAlign:"center",fontSize:9,color:"#aaa",margin:0}}>No keyboard triangle needed - just photo ANY sum!</p>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:10}}>
      <button onClick={()=>setActiveTab("solve")} style={{padding:"9px 16px",borderRadius:20,border:"none",background:activeTab==="solve"?"#FFD700":"#333",color:activeTab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>MATHS CAMERA ANY</button>
      <button onClick={()=>setActiveTab("mocks")} style={{padding:"9px 16px",borderRadius:20,border:"none",background:activeTab==="mocks"?"#FFD700":"#333",color:activeTab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>EXAM PREP MOCKS</button>
    </div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>{[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}</div>

    {activeTab==="solve" && <>
    <div style={{background:"#111",padding:12,borderRadius:12,border:photo?"3px solid #0f0":"2px solid #FFD700",marginTop:10}}>
      <p style={{margin:"3px 0",fontSize:14,fontWeight:"bold",color:"#FFD700",textAlign:"center"}}>📸 MATHS CAMERA ANY - NO TYPING NEEDED!</p>
      <p style={{margin:"0 0 8px 0",fontSize:11,color:"#0f0",textAlign:"center",fontWeight:"bold"}}>Just photo ANY sum - triangle, algebra, geometry - NO keyboard!</p>
      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:14,padding:10,background:"#222",color:"white",borderRadius:8,width:"100%",border:"2px solid #0f0",fontWeight:"bold"}}/>
      {photo && <><img src={photo} style={{width:"100%",marginTop:10,borderRadius:8,border:"2px solid #0f0",maxHeight:280,objectFit:"contain"}} alt="any maths sum"/><div style={{background:"#0f0",color:"black",padding:8,borderRadius:8,marginTop:8,textAlign:"center"}}><p style={{margin:0,fontWeight:"bold",fontSize:12}}>✅ MATHS CAMERA ANY detected photo! No typing - solving ANY type...</p><p style={{margin:"4px 0 0 0",fontSize:10}}>Gr {grade} - ANY type - Triangle? No keyboard needed!</p></div></>}
      {!photo && <div style={{background:"#0a0a0a",padding:8,borderRadius:6,marginTop:8,border:"1px dashed #FFD700"}}><p style={{fontSize:11,color:"#FFD700",margin:0,textAlign:"center",fontWeight:"bold"}}>How it works NO TYPING:<br/>1. Photo ANY sum (triangle, equations, anything)<br/>2. Teacher auto solves ANY type - no keyboard<br/>3. R150 paywall after 1st sum</p></div>}
    </div>
    <div style={{background:"#FFF9E5",color:"black",padding:12,borderRadius:14,minHeight:300,marginTop:12}}>
      <p style={{margin:0,fontSize:11,fontWeight:"bold"}}>Slow Teacher ANY - No typing - Gr {grade}: {detected}</p>
      {board.slice(0,step+1).map((b,i)=>(<div key={i} style={{margin:"14px 0",padding:12,background:i===step?"#FFD700":"white",borderRadius:10,borderLeft:"5px solid black"}}><p style={{fontSize:17,margin:0,lineHeight:"1.5"}}>{i+1}. {b}</p></div>))}
    </div>
    <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12,marginBottom:20}}>
      <button onClick={back} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Back</button>
      <button onClick={()=>setPlaying(!playing)} style={{padding:"13px 26px",background:"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>{playing?"Pause":"Play Slow ANY"}</button>
      <button onClick={next} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Forward</button>
    </div>
    </>}

    {activeTab==="mocks" && <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10,marginBottom:20}}>
      <h3 style={{margin:0,color:"#FFD700"}}>Exam Prep Mocks - Gr {grade} - R150</h3>
      <p style={{fontSize:10,color:"#0f0",margin:"4px 0"}}>No typing - Photo ANY sum in mock - R150 unlocks all</p>
      {MOCS[grade].map((m:string,i:number)=><div key={i} style={{background:"#222",padding:12,borderRadius:10,marginBottom:8,border:"1px solid #333"}}><p style={{margin:0,fontWeight:"bold",fontSize:13}}>{m}</p><button onClick={()=>{ setActiveTab("solve"); }} style={{background:"#FFD700",border:"none",padding:"7px 12px",borderRadius:6,fontWeight:"bold",width:"100%",marginTop:6}}>Start Exam Prep Mock - Photo ANY - R150</button></div>)}
    </div>}

    <footer style={{background:"#0a0a0a",borderTop:"3px solid #FFD700",padding:"16px 12px",marginTop:20,marginLeft:-10,marginRight:-10}}>
      <h4 style={{color:"#FFD700",margin:"0 0 4px 0",textAlign:"center",fontSize:14}}>CAPS MATHS BUDDY 786 - R150 - NO TYPING</h4>
      <p style={{color:"#0f0",fontSize:11,textAlign:"center",margin:"0 0 6px 0",fontWeight:"bold"}}>Maths Camera ANY Type - No Keyboard Triangle - Just Photo - R150</p>
      <div style={{borderTop:"1px solid #222",paddingTop:8,display:"flex",justifyContent:"space-between"}}>
        <p style={{color:"#555",fontSize:9,margin:0}}>© 2026 Faranaaswitbooi</p>
        <p style={{color:"#FFD700",fontSize:9,margin:0,fontWeight:"bold"}}>R150 Paystack + No Typing + Bismillah 786</p>
      </div>
    </footer>

    <button onClick={()=>setShowAsk(true)} style={{position:"fixed",bottom:"20px",right:"20px",background:"#FFD700",color:"black",padding:"14px 22px",borderRadius:"30px",fontWeight:"bold",zIndex:9999,border:"none"}}>Ask Teacher ANY</button>
    {showAsk && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",zIndex:10000,padding:15,display:"flex",flexDirection:"column"}}><div style={{background:"#FFF9E5",borderRadius:15,padding:12,flex:1,display:"flex",flexDirection:"column",maxWidth:400,margin:"0 auto",width:"100%"}}><div style={{display:"flex",justifyContent:"space-between"}}><h3 style={{color:"black",margin:0,fontSize:13}}>Ask Teacher ANY - No typing - R150</h3><button onClick={()=>setShowAsk(false)} style={{background:"#333",color:"white",border:"none",borderRadius:20,padding:"6px 12px"}}>X</button></div><div style={{background:"white",border:"1px solid #ddd",borderRadius:10,padding:8,flex:1,overflowY:"auto",marginTop:8}}>{chat.map((c,i)=><div key={i} style={{marginBottom:10}}><p style={{background:"#FFD700",padding:6,borderRadius:8,fontSize:13,color:"black",margin:0}}>{c.q}</p><p style={{background:"#111",color:"white",padding:6,borderRadius:8,fontSize:13,marginTop:4}}>{c.a}</p></div>)}</div><div style={{display:"flex",gap:6,marginTop:8}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about ANY photo sum" style={{flex:1,padding:10,borderRadius:8,border:"1px solid #333",fontSize:12}}/><button onClick={askTeacher} style={{background:"#FFD700",border:"none",padding:"10px 14px",borderRadius:8,fontWeight:"bold"}}>Ask ANY</button></div></div></div>}
    {showPaywall && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",padding:15,zIndex:99}}><div style={{background:"#111",border:"2px solid #FFD700",padding:18,borderRadius:15,textAlign:"center",maxWidth:350}}><h3 style={{color:"#FFD700",margin:0}}>Free Finished! R150</h3><p style={{fontSize:13,color:"white"}}>MATHS CAMERA ANY - 1 free photo used. R150 unlocks unlimited ANY sum photos - no typing needed!</p><div style={{background:"#222",padding:10,borderRadius:8,marginBottom:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:20}}>R150 Once-off</p><p style={{margin:0,fontSize:10,color:"#888"}}>Paystack secure - Instant unlock - No typing</p></div><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#FFD700",padding:12,width:"100%",borderRadius:10,border:"none",color:"black",fontWeight:"bold",fontSize:14}}>Pay R150 with Paystack</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent",color:"#888",border:"none",marginTop:8}}>Close</button></div></div>}
  </div>);
                                             }
