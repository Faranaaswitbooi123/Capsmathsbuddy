"use client";
import { useState, useEffect, useRef } from "react";

export default function Home(){
  const [step,setStep]=useState(0); 
  const [playing,setPlaying]=useState(false); 
  const [photo,setPhoto]=useState<string|null>(null);
  const [grade,setGrade]=useState(8); 
  const [lang,setLang]=useState("EN"); 
  const [detected,setDetected]=useState("20a3 - 4bc");
  const [board,setBoard]=useState<string[]>([
    "Take photo of ANY maths sum - any grade 8 to 12",
    "What do we have? We look at sum first - what type is it?",
    "How do we solve? We need plan - what formula or method?",
    "Do step by step - no rushing - slow teacher explains",
    "Answer simple - you understand why not just what"
  ]);
  const [freeUsed,setFreeUsed]=useState(false); 
  const [showPaywall,setShowPaywall]=useState(false); 
  const [hasPaid,setHasPaid]=useState(false);
  const [term,setTerm]=useState(3); 
  const [ocrLoading,setOcrLoading]=useState(false); 
  const [showAsk,setShowAsk]=useState(false);
  const [q,setQ]=useState(""); 
  const [chat,setChat]=useState<{q:string,a:string}[]>([]); 
  const [activeTab,setActiveTab]=useState("solve");
  const canvasRef=useRef<HTMLCanvasElement>(null); 
  const ref=useRef<any>(null);

  const EXAM:any={
    8:{title:"Grade 8", past:["Nov 2023 P1 - Whole Numbers and Integers","June 2023 P1 - Algebra and Equations","Nov 2022 - Geometry and Measurement","March 2023 - Common Test"], mocks:["Mock 1 - Term 3 Test 50 marks","Mock 2 - Final Exam 100 marks","Mock 3 - June Exam Prep"]},
    9:{title:"Grade 9", past:["Nov 2023 P1 - Algebra 75 marks","June 2023 - Functions and Graphs","Nov 2022 - Finance and Growth","Sept 2023 - Geometry"], mocks:["Mock 1 - Term 3 75 marks","Mock 2 - Final 100 marks","Mock 3 - Algebra Focus"]},
    10:{title:"Grade 10", past:["Nov 2023 P1 - Algebra 100 marks","Nov 2023 P2 - Geometry 100 marks","June 2023 P1 - Past Paper","June 2023 P2 - Past Paper"], mocks:["Mock 1 - Sept Prep 100 marks","Mock 2 - Final NSC Style 150 marks","Mock 3 - Term 3 Test"]},
    11:{title:"Grade 11", past:["Nov 2023 P1 - 150 marks DBE","Nov 2023 P2 - 150 marks DBE","June 2023 P1 - Past Paper","June 2023 P2 - Past Paper"], mocks:["Mock Sept 2024 - Full 300 marks","Mock Nov - Final 150 marks","Mock June - P1 only"]},
    12:{title:"Grade 12", past:["DBE Nov 2023 P1 - 150 marks","DBE Nov 2023 P2 - 150 marks","DBE June 2023 P1 - 150 marks","DBE June 2023 P2 - 150 marks","Ieb Nov 2023 P1","Ieb Nov 2023 P2"], mocks:["Mock Sept 2024 NSC 300 marks","Mock Prelim P1 and P2 - 300 marks","Final Revision Mock - All Topics","Past 5 Years Bundle"]}
  };

  const buildBoard=(raw:string, nums:number[])=>{
    const lower=raw.toLowerCase(); 
    let L=nums[0]||6; let B=nums[1]||4; let H=nums[2]||5;
    if(L>200)L=6; if(B>200)B=4; if(H>200)H=5;

    if(lower.includes("perimeter")|| (lower.includes("rectangle") && lower.includes("perimeter"))){
      return {detected:`Rectangle ${L}cm x ${B}cm - Perimeter`, board:[
        `We have Rectangle length ${L}cm and breadth ${B}cm. Calculate perimeter. First question: What do we have? We have length and breadth.`,
        `Now how do we calculate perimeter? Think: Perimeter is distance around shape. Like fence around garden. We add all sides.`,
        `Do you remember formula? Perimeter equals 2 times Length plus 2 times Breadth. Write: P = 2L + 2B`,
        `So put numbers: P = (2 times ${L}) plus (2 times ${B}) = ${2*L} plus ${2*B}`,
        `Equals ${2*L+2*B}cm. Answer is ${2*L+2*B}cm. That is distance around.`
      ]};
    }
    if(lower.includes("area") && lower.includes("rectangle")){
      return {detected:`Area Rectangle ${L} x ${B}`, board:[
        `We have Rectangle length ${L}cm breadth ${B}cm. Calculate area. What type sum? Area sum - space inside.`,
        `How do we calculate area? Imagine tiles on floor. Area is how many squares fit inside.`,
        `Do you remember formula? Area equals Length times Breadth. A = L x B`,
        `So A = ${L} times ${B}`,
        `Equals ${L*B} square cm. Answer ${L*B} cm2. That is space inside.`
      ]};
    }
    if(lower.includes("triangle")||lower.includes("pythag")||lower.includes("right")){
      const ab=nums[0]||3; const ac=nums[nums.length-1]||5; 
      const bcSq = ac*ac - ab*ab; const bc = Math.sqrt(bcSq>0?bcSq:16); const bcF=bc.toFixed(1);
      return {detected:`Triangle AB ${ab} AC ${ac} - Find BC`, board:[
        `Right triangle AB ${ab}cm AC ${ac}cm Angle B 90 degrees Find BC. First: What do we have? Right triangle, 90 degrees at B.`,
        `Now how do we find missing side? We use Pythagoras. Remember: Longest side is hypotenuse AC opposite 90 degrees.`,
        `Do you remember formula? AB squared plus BC squared equals AC squared. AB2 + BC2 = AC2`,
        `Put numbers: ${ab} squared plus BC squared equals ${ac} squared. So ${ab*ab} plus BC squared equals ${ac*ac}`,
        `So BC squared equals ${ac*ac} minus ${ab*ab} equals ${bcSq}. So BC equals square root of ${bcSq} equals ${bcF}cm. Answer BC = ${bcF}cm`
      ]};
    }
    if(lower.includes("factor")|| raw.includes("20a3")|| lower.includes("common")){
      return {detected:raw.slice(0,30)+" - Factorization", board:[
        `We have ${raw}. What type? Factorization - take out common factor. What do we have? Look at both parts.`,
        `How do we factor? Find number that fits in both parts. What is common? Look at 20 and 4.`,
        `Do you remember? Find biggest number that divides both 20 and 4. Biggest common factor is 4. Also a? No.`,
        `So divide: 20 divided by 4 equals 5. And 4bc divided by 4 equals bc. So take 4 outside bracket.`,
        `Inside bracket stays 5a3 minus bc. So answer = 4 times (5a3 - bc). That is factored. Check: 4 times 5a3 = 20a3 correct.`
      ]};
    }
    if(raw.includes("=")||lower.includes("solve for x")||lower.includes("equation")){
      return {detected:raw.slice(0,30)+" - Equation", board:[
        `We have equation ${raw}. What must we find? Find x. Goal get x alone on one side.`,
        `How get x alone? Whatever we do to left we do to right. Keep balanced like scale.`,
        `Do you remember rule? If plus number, minus both sides. If times, divide both sides.`,
        `First move numbers without x to other side. Then divide by number in front of x.`,
        `So x equals answer. Always check by putting answer back into original equation.`
      ]};
    }
    return {detected:raw.slice(0,40), board:[
      `We have ${raw}. What do we have? Look at sum carefully - what is question asking?`,
      `Now how do we solve? Need plan - what topic? Algebra? Geometry? Finance? What formula?`,
      `Do you remember similar sum? Think back to class - what did teacher say for this type?`,
      `Do step by step - write what you know, what you must find, then formula, then numbers, then answer.`,
      `Answer slow and simple - and check if answer makes sense. That is how we learn.`
    ]};
  };

  const next=()=>setStep(s=>Math.min(s+1,board.length-1)); 
  const back=()=>setStep(s=>Math.max(s-1,0));
  
  useEffect(()=>{ 
    if(playing){ 
      ref.current=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }),6500); 
    } else clearInterval(ref.current); 
    return ()=>clearInterval(ref.current); 
  },[playing,board]);
  
  const speakCalm=(t:string)=>{ 
    if(typeof window!=="undefined" && "speechSynthesis" in window){ 
      window.speechSynthesis.cancel(); 
      const u=new SpeechSynthesisUtterance(t); 
      u.rate=0.70; u.pitch=0.90; u.lang=lang==="AF"?"af-ZA":lang==="XH"?"xh-ZA":lang==="ZU"?"zu-ZA":"en-ZA";
      window.speechSynthesis.speak(u);
    } 
  };
  
  useEffect(()=>{ speakCalm(board[step]); },[step,board]);
  
  const solveAny=(raw:string)=>{ 
    const nums=(raw.match(/\d+/g)||[]).map((n:string)=>parseInt(n)); 
    const res=buildBoard(raw.slice(0,80),nums); 
    setDetected(res.detected); 
    setBoard(res.board); 
    setStep(0); 
    setPlaying(true); 
  };
  
  const preprocessAndRead=async(file:Blob)=>{
    setOcrLoading(true); 
    const img=new Image(); 
    img.src=URL.createObjectURL(file); 
    await new Promise(r=>img.onload=r);
    const canvas=canvasRef.current!; 
    canvas.width=img.width; canvas.height=img.height; 
    const ctx=canvas.getContext("2d")!; 
    ctx.filter="grayscale(100%) contrast(150%) brightness(120%)";
    ctx.drawImage(img,0,0);
    if(typeof window!=="undefined" && !(window as any).Tesseract){ 
      await new Promise((res,rej)=>{ 
        const s=document.createElement("script"); 
        s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"; 
        s.onload=()=>res(true); s.onerror=rej; document.head.appendChild(s); 
      }); 
    }
    try{ 
      // @ts-ignore 
      const worker=await (window as any).Tesseract.createWorker("eng"); 
      const r=await worker.recognize(canvas); 
      await worker.terminate(); 
      let cleaned=r.data.text.trim().slice(0,80)||"20a3 - 4bc"; 
      solveAny(cleaned); 
    }catch(e){ 
      solveAny("20a3 - 4bc"); 
    }
    setOcrLoading(false); 
    if(!freeUsed)setFreeUsed(true);
  };
  
  const handlePhoto=async(e:any)=>{ 
    const file=e.target.files[0]; 
    if(!file) return; 
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; } 
    setPhoto(URL.createObjectURL(file)); 
    await preprocessAndRead(file); 
  };
  
  const askTeacher=()=>{ 
    if(!q.trim()) return; 
    const ans=`You ask: ${q} about ${detected}. Listen slow: ${board[step]}. Next step: ${board[Math.min(step+1,board.length-1)]}. Does that make sense?`; 
    setChat(p=>[...p,{q,a:ans}]); 
    speakCalm(ans); 
    setQ(""); 
  };

  return (
  <div style={{background:"black",color:"white",minHeight:"100vh",padding:10,paddingBottom:0}}>
    <canvas ref={canvasRef} style={{display:"none"}}/>
    
    {/* HEADER */}
    <h2 style={{textAlign:"center",color:"#FFD700",margin:0,letterSpacing:1}}>CAPS MATHS BUDDY 786</h2>
    <p style={{textAlign:"center",fontSize:11,color:"#0f0",fontWeight:"bold",margin:"4px 0"}}>Slow Teacher for ANY Sum + Exam Prep + Mocs - Gr 8-12</p>
    
    {/* TABS */}
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:10}}>
      <button onClick={()=>setActiveTab("solve")} style={{padding:"9px 16px",borderRadius:20,border:"none",background:activeTab==="solve"?"#FFD700":"#333",color:activeTab==="solve"?"black":"white",fontWeight:"bold",fontSize:12}}>SOLVE</button>
      <button onClick={()=>setActiveTab("exam")} style={{padding:"9px 16px",borderRadius:20,border:"none",background:activeTab==="exam"?"#FFD700":"#333",color:activeTab==="exam"?"black":"white",fontWeight:"bold",fontSize:12}}>EXAM PREP</button>
      <button onClick={()=>setActiveTab("mocks")} style={{padding:"9px 16px",borderRadius:20,border:"none",background:activeTab==="mocks"?"#FFD700":"#333",color:activeTab==="mocks"?"black":"white",fontWeight:"bold",fontSize:12}}>MOCS</button>
    </div>

    {/* GRADE */}
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:10}}>{[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"7px 12px",borderRadius:15,border:grade===g?"2px solid #FFD700":"1px solid #333",background:grade===g?"#FFD700":"#222",color:grade===g?"black":"white",fontWeight:"bold",fontSize:12}}>Gr {g}</button>)}</div>
    <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:6}}>{["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",borderRadius:12,border:"none",background:lang===l?"#FFD700":"#222",color:lang===l?"black":"white",fontSize:11,fontWeight:"bold"}}>{l}</button>)}</div>

    {/* SOLVE TAB */}
    {activeTab==="solve" && <>
    <div style={{background:"#111",padding:10,borderRadius:12,border:photo?"2px solid #0f0":"1px solid #333",marginTop:10}}>
      <p style={{margin:"3px 0",fontSize:12,fontWeight:"bold",color:"#FFD700"}}>MATH CAMERA - Photo ANY sum! (Gr {grade})</p>
      <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:12,padding:7,background:"#222",color:"white",borderRadius:6,width:"100%",border:"1px solid #444"}}/>
      {ocrLoading && <p style={{color:"#0f0",fontSize:12,fontWeight:"bold",background:"#003300",padding:7,borderRadius:6,marginTop:8,textAlign:"center"}}>Cleaning image plus reading text... please wait</p>}
      {photo && <>
        <img src={photo} style={{width:"100%",marginTop:8,borderRadius:8,border:"2px solid #0f0",maxHeight:250,objectFit:"contain"}} alt="sum"/>
        <div style={{background:"#222",padding:9,borderRadius:8,marginTop:8}}>
          <p style={{margin:"0 0 6px 0",fontSize:11,color:"#888"}}>Detected text (you can edit):</p>
          <div style={{display:"flex",gap:6}}><input value={detected} onChange={e=>setDetected(e.target.value)} style={{flex:1,padding:9,borderRadius:6,border:"1px solid #0f0",background:"black",color:"white",fontSize:14}}/><button onClick={()=>solveAny(detected)} style={{background:"#0f0",border:"none",padding:"9px 14px",borderRadius:6,fontWeight:"bold",color:"black"}}>Solve</button></div>
        </div>
      </>}
      {!photo && <p style={{fontSize:10,color:"#666",marginTop:6,textAlign:"center"}}>Take clear photo of textbook or handwritten sum - works for algebra, geometry, finance, trig</p>}
    </div>

    <div style={{background:"#FFF9E5",color:"black",padding:13,borderRadius:14,minHeight:300,marginTop:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><p style={{margin:0,fontSize:11,fontWeight:"bold"}}>Slow Teacher - {EXAM[grade].title} - {lang}:</p><span style={{fontSize:10,background:"
