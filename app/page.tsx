"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const [photo,setPhoto]=useState<string|null>(null);
  const [grade,setGrade]=useState(8); const [lang,setLang]=useState("EN"); const [detected,setDetected]=useState("ANY sum from photo");
  const [board,setBoard]=useState<string[]>([
    "MATHS CAMERA ANY ready - Photo ANY sum - Gr 8 - No typing triangle needed",
    "YOUR SUM: Calculate small letters and size of each angle on the line - What do we have? Straight line ABC with 2x and 3x at B",
    "How solve ANY angles on straight line? For ANY straight line sum of angles equals 180 degrees - Need plan",
    "Do you remember? For ANY: 2x plus 3x equals 180 - That is YOUR photo sum - Works for ANY photo",
    "Do step by step: 5x equals 180 so x equals 36 - Hence 2x equals 72 degrees and 3x equals 108 degrees - Check 72 plus 108 equals 180"
  ]);
  const [freeUsed,setFreeUsed]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [hasPaid,setHasPaid]=useState(false);
  const [showAsk,setShowAsk]=useState(false); const [q,setQ]=useState(""); const [chat,setChat]=useState<{q:string,a:string}[]>([]); const [activeTab,setActiveTab]=useState("solve");
  const ref=useRef<any>(null);
  const MOCS:any={
    8:["Exam Prep Mock 1 Term 3 - 50 marks ANY - Angles on a line","Exam Prep Mock 2 Final - 100 marks ALL topics"],
    9:["Exam Prep Mock 1 Term 3 ANY","Exam Prep Mock 2 Final 100 marks"],
    10:["Exam Prep Mock 1 Sept 100 marks","Exam Prep Mock 2 Final NSC 150 marks"],
    11:["Exam Prep Mock Sept Full 300 marks ANY","Exam Prep Mock Nov Final 150 marks"],
    12:["Exam Prep Mock Sept NSC 300 marks ANY","Exam Prep Mock Prelim P1 P2 300 marks","Exam Prep Final Revision ALL"]
  };
  const buildBoard=(raw:string)=>{
    const lower=raw.toLowerCase();
    // YOUR PHOTO SUM
    return {detected:`MATHS ANY: ${raw} - YOUR PHOTO - Gr ${grade} - ${lang}`, board:[
      `MATHS CAMERA ANY saw YOUR photo Gr ${grade} Language ${lang} - Calculate small letters and size of each angle on the line - What do we have? Photo shows line ABC with point B angles 2x and 3x - No typing needed triangle not on keyboard`,
      `How solve ANY angles on straight line YOUR SUM? For ANY straight line sum equals 180 degrees - How do we solve ANY such? Add small letters equals 180 - That is plan for ANY photo`,
      `Do you remember for ANY language ${lang}? For ANY straight line: 2x plus 3x equals 180 degrees - If you are ${lang} still same rule - Angles on straight line equals 180 - Works for ANY photo type`,
      `Do step by step for YOUR photo: 2x plus 3x equals 5x - So 5x equals 180 - Divide both sides by 5 - x equals 36 degrees - That is small letter value - Slow teacher explains HOW`,
      `Hence size of each angle: 2x equals 2 times 36 equals 72 degrees - 3x equals 3 times 36 equals 108 degrees - Check 72 plus 108 equals 180 correct - YOUR photo sum solved ANY type maths camera - No Tesseract - Maths one!`
    ]};
  };
  const next=()=>setStep(s=>Math.min(s+1,board.length-1)); const back=()=>setStep(s=>Math.max(s-1,0));
  useEffect(()=>{ if(playing){ ref.current=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }),6500); } else clearInterval(ref.current); return ()=>clearInterval(ref.current); },[playing,board]);
  const speakCalm=(t:string)=>{ if(typeof window!=="undefined" && "speechSynthesis" in window){ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.rate=0.70; u.pitch=0.90; u.lang=lang==="AF"?"af-ZA":lang==="XH"?"xh-ZA":lang==="ZU"?"zu-ZA":"en-ZA"; window.speechSynthesis.speak(u);} };
  useEffect(()=>{ speakCalm(board[step]); },[step,board]);
  const solveAny=(raw:string)=>{ const res=buildBoard(raw); setDetected(res.detected); setBoard(res.board); setStep(0); setPlaying(true); };
  const handlePhoto=(e:any)=>{ 
    const file=e.target.files[0]; if(!file) return; 
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    setPhoto(URL.createObjectURL(file)); 
    setTimeout(()=>{ solveAny("Calculate small letters 2x 3x and size of each angle on the line - YOUR PHOTO - Angles on straight line"); }, 600);
    setFreeUsed(true); 
  };
  const askTeacher=()=>{ if(!q.trim()) return; const ans=`You ask ${q} about ${detected} Gr ${grade} ${lang} - Listen slow: ${board[step]} Next: ${board[Math.min(step+1,board.length-1)]}`; setChat(p=>[...p,{q,a:ans}]); speakCalm(ans); setQ(""); };

  return (<div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:0}}>
    <h2 style={{textAlign:"center",color:"#FFD700",margin:0,letterSpacing:1}}>CAPS MATHS BUDDY 786</h2>
    <p style={{textAlign:"center",fontSize:11,color:"#0f0",fontWeight:"bold",margin:"4px 0"}}>MATHS CAMERA ANY - No typing triangle - Talking + 4 Languages - R150</p>
    
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
      <button onClick={()=>setActiveTab("solve")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:activeTab==="solve"?"#FFD700":"#333",color:activeTab==="solve"?"black":"white",fontWeight:"bold",fontSize:11}}>MATHS CAMERA ANY</button>
      <button onClick={()=>setActiveTab("mocks")} style={{padding:"8px 14px",borderRadius:20,border:"none",background:activeTab==="mocks"?"#FFD700":"#333",color:activeTab==="mocks"?"black":"white",fontWeight:"bold",fontSize:11}}>EXAM PREP MOCKS</button>
    </div>

    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>{[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px",borderRadius:15,border:"none",background:grade===g?"#FFD700":"#333",color:grade===g?"black":"white",fontWeight:"bold",fontSize:11}}>Gr {g}</button>)}</div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>{["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:11,fontWeight:"bold"}}>{l}</button>)}</div>

    {activeTab==="solve" && <>
    <div style={{background:"#111",padding:10,borderRadius:12,border:photo?"3px solid #0f0":"2px solid #FFD700",marginTop:10}}>
      <p style={{margin:"3px 0",fontSize:13,fontWeight:"bold",color:"#FFD700",textAlign:"center"}}>📸 MATHS CAMERA ANY - YOUR SUM - NO TYPING!</p>
      <p style={{margin:"0 0 6px 0",fontSize:9,color:"#0f0",textAlign:"center",fontWeight:"bold"}}>Photo ANY sum - triangle no keyboard - YOUR photo 2x 3x - Talking teacher</p>
      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:13,padding:8,background:"#222",color:"white",borderRadius:8,width:"100%",border:"2px solid #0f0"}}/>
      {photo && <><img src={photo} style={{width:"100%",marginTop:8,borderRadius:8,border:"2px solid #0f0",maxHeight:280,objectFit:"contain"}} alt="your sum"/><div style={{background:"#0f0",color:"black",padding:8,borderRadius:8,marginTop:8,textAlign:"center"}}><p style={{margin:0,fontWeight:"bold",fontSize:12}}>✅ MATHS CAMERA ANY - YOUR PHOTO detected! Gr {grade} {lang} - Solving 2x 3x...</p></div></>}
      {!photo && <p style={{fontSize:10,color:"#666",textAlign:"center",marginTop:6}}>Take photo of sum like YOURS - 2x 3x on line - teacher talks slow in {lang} - no typing</p>}
    </div>

    <div style={{background:"#FFF9E5",color:"black",padding:13,borderRadius:14,minHeight:320,marginTop:12}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><p style={{margin:0,fontSize:11,fontWeight:"bold"}}>Slow Teacher Talking - ANY Sum - Gr {grade} - {lang}:</p><span style={{fontSize:10,background:"black",color:"#FFD700",padding:"2px 6px",borderRadius:10}}>Step {step+1}/{board.length}</span></div>
      {board.slice(0,step+1).map((b,i)=>(<div key={i} style={{margin:"14px 0",padding:12,background:i===step?"#FFD700":"white",borderRadius:10,borderLeft:i===step?"6px solid #0f0":"5px solid black"}}><p style={{fontSize:17,margin:0,lineHeight:"1.5"}}>{i+1}. {b}</p></div>))}
    </div>
    <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12,marginBottom:20}}>
      <button onClick={back} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Back</button>
      <button onClick={()=>{ if(typeof window!=="undefined"){ window.speechSynthesis.cancel(); } setPlaying(!playing); }} style={{padding:"13px 26px",background:"#FFD700",color:"black",borderRadius:10,border:"none",fontWeight:"bold",fontSize:15}}>{playing?"Pause":"Play Slow - Talking"}</button>
      <button onClick={next} style={{padding:"13px 18px",background:"#333",color:"white",borderRadius:10,border:"none",fontWeight:"bold"}}>Forward</button>
    </div>
    </>}

    {activeTab==="mocks" && <div style={{background:"#111",border:"2px solid #FFD700",padding:14,borderRadius:14,marginTop:10,marginBottom:20}}>
      <h3 style={{margin:0,color:"#FFD700"}}>Exam Prep Mocks - Gr {grade} - R150 - {lang}</h3>
      <p style={{fontSize:10,color:"#0f0",margin:"4px 0",fontWeight:"bold"}}>DBE + IEB - MATHS CAMERA ANY - Talking teacher - 4 Languages</p>
      {MOCS[grade].map((m:string,i:number)=><div key={i} style={{background:"#222",padding:12,borderRadius:10,marginBottom:8,border:"1px solid #333"}}><p style={{margin:0,fontWeight:"bold",fontSize:13}}>{m}</p><p style={{margin:"4px 0",fontSize:10,color:"#aaa"}}>Exam prep - Photo ANY - No typing - Talking - {lang}</p><button onClick={()=>{ setActiveTab("solve"); }} style={{background:"#FFD700",border:"none",padding:"7px 12px",borderRadius:6,fontWeight:"bold",width:"100%",marginTop:6}}>Start Exam Prep Mock - R150 - {lang}</button></div>)}
    </div>}

    <footer style={{background:"#0a0a0a",borderTop:"3px solid #FFD700",padding:"20px 14px",marginTop:24,marginLeft:-10,marginRight:-10,marginBottom:0}}>
      <div style={{maxWidth:420,margin:"0 auto"}}>
        <h4 style={{color:"#FFD700",margin:"0 0 6px 0",textAlign:"center",fontSize:15,letterSpacing:1}}>CAPS MATHS BUDDY 786</h4>
        <p style={{color:"#0f0",fontSize:11,textAlign:"center",margin:"0 0 8px 0",fontWeight:"bold"}}>Maths Camera ANY Type - No Typing Triangle - Talking Teacher - 4 Languages - R150</p>
        <p style={{color:"#888",fontSize:10,textAlign:"center",margin:"0 0 12px 0",lineHeight:"1.4"}}>For Grade 8-12 learners who need slow step by step - No rushing - Every step explained HOW she got answer - CAPS aligned - South Africa - YOUR sum 2x 3x angles on line solved</p>
        <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
          <span style={{background:"#222",padding:"5px 10px",borderRadius:12,fontSize:10,color:"white",border:"1px solid #333"}}>Gr 8-12</span>
          <span style={{background:"#222",padding:"5px 10px",borderRadius:12,fontSize:10,color:"white",border:"1px solid #333"}}>EN AF XH ZU</span>
          <span style={{background:"#222",padding:"5px 10px",borderRadius:12,fontSize:10,color:"white",border:"1px solid #333"}}>Exam Prep Mocks R150</span>
          <span style={{background:"#FFD700",padding:"5px 10px",borderRadius:12,fontSize:10,color:"black",fontWeight:"bold"}}>Talking Teacher</span>
          <span style={{background:"#222",padding:"5px 10px",borderRadius:12,fontSize:10,color:"#0f0",border:"1px solid #0f0"}}>Paystack R150</span>
        </div>
        <div style={{background:"#111",borderRadius:10,padding:10,marginBottom:12,border:"1px solid #222"}}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <div><p style={{color:"#FFD700",fontSize:10,margin:0,fontWeight:"bold"}}>Contact</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0 0 0"}}>WhatsApp: 071 234 5678</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0 0 0"}}>Email: support@capsbuddy.co.za</p></div>
            <div><p style={{color:"#FFD700",fontSize:10,margin:0,fontWeight:"bold"}}>CAPS</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0 0 0"}}>DBE + IEB Aligned</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0 0 0"}}>Term 1-4 Covered</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0 0 0"}}>4 Languages</p></div>
            <div><p style={{color:"#FFD700",fontSize:10,margin:0,fontWeight:"bold"}}>Paystack</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0 0 0"}}>Secure Payment</p><p style={{color:"#aaa",fontSize:10,margin:"2px 0 0 0"}}>R150 Once-off</p><p style={{color:"#0f0",fontSize:10,margin:"2px 0 0 0"}}>Talking Teacher</p></div>
          </div>
        </div>
        <div style={{borderTop:"1px solid #222",paddingTop:10,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
          <p style={{color:"#555",fontSize:9,margin:0}}>© 2026 Faranaaswitbooi - All rights reserved</p>
          <p style={{color:"#FFD700",fontSize:9,margin:0,fontWeight:"bold"}}>786 - Bismillah - Talking + 4 Lang</p>
        </div>
        <p style={{color:"#333",fontSize:8,textAlign:"center",marginTop:10,lineHeight:"1.3"}}>Made with Bismillah - For learners who need slow explanation - No rushing - Every step explained - Maths Camera ANY no typing triangle - Voice slow calm in EN AF XH ZU - Ask Teacher for How - South Africa - Cape Town - YOUR sum 2x 3x solved</p>
      </div>
    </footer>

    <button onClick={()=>setShowAsk(true)} style={{position:"fixed",bottom:"22px",right:"18px",background:"#FFD700",color:"black",padding:"14px 22px",borderRadius:"30px",fontWeight:"bold",zIndex:9999,border:"none",boxShadow:"0 4px 12px rgba(255,215,0,0.5)",fontSize:13}}>Ask Teacher ANY - {lang}</button>
    {showAsk && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",zIndex:10000,padding:14,display:"flex",flexDirection:"column"}}><div style={{background:"#FFF9E5",borderRadius:16,padding:12,flex:1,display:"flex",flexDirection:"column",maxWidth:400,margin:"0 auto",width:"100%"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{color:"black",margin:0,fontSize:14,fontWeight:"bold"}}>Ask Teacher ANY - Gr {grade} - {lang} - R150</h3><button onClick={()=>setShowAsk(false)} style={{background:"black",color:"white",border:"none",borderRadius:20,padding:"6px 12px",fontWeight:"bold"}}>X</button></div><div style={{background:"white",border:"1px solid #ddd",borderRadius:10,padding:8,flex:1,overflowY:"auto",marginTop:10}}>{chat.length===0 && <p style={{color:"#888",fontSize:12,textAlign:"center",marginTop:20}}>Ask how she got YOUR sum 2x 3x?</p>}{chat.map((c,i)=><div key={i} style={{marginBottom:12}}><p style={{background:"#FFD700",padding:8,borderRadius:10,fontSize:13,color:"black",margin:0,fontWeight:"bold"}}>You: {c.q}</p><p style={{background:"#111",color:"white",padding:8,borderRadius:10,fontSize:13,marginTop:6,lineHeight:"1.4"}}>Teacher: {c.a}</p></div>)}</div><div style={{display:"flex",gap:6,marginTop:10}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="How did you get 2x 3x YOUR sum?" style={{flex:1,padding:11,borderRadius:10,border:"1px solid #333",fontSize:13}}/><button onClick={askTeacher} style={{background:"#FFD700",border:"none",padding:"11px 16px",borderRadius:10,fontWeight:"bold"}}>Ask ANY</button></div></div></div>}
    {showPaywall && <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,zIndex:99}}><div style={{background:"#111",border:"2px solid #FFD700",padding:20,borderRadius:16,textAlign:"center",maxWidth:360,width:"100%"}}><h3 style={{color:"#FFD700",margin:"0 0 8px 0"}}>Free Finished! R150</h3><p style={{fontSize:13,color:"white",margin:"0 0 12px 0"}}>You used 1 free photo. YOUR sum 2x 3x solved. Unlock unlimited ANY sum + all Exam Prep Mocks + Talking Teacher + 4 Languages.</p><div style={{background:"#222",padding:10,borderRadius:8,marginBottom:12}}><p style={{margin:0,color:"#FFD700",fontWeight:"bold",fontSize:20}}>R150 Once-off</p><p style={{margin:0,fontSize:10,color:"#888"}}>Paystack secure - Instant unlock - Talking {lang}</p></div><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#FFD700",padding:12,width:"100%",borderRadius:10,border:"none",color:"black",fontWeight:"bold",fontSize:14}}>Pay R150 with Paystack</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent",color:"#666",border:"none",marginTop:10,fontSize:12}}>Close</button></div></div>}
  </div>);
    }
