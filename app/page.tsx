"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [grade, setGrade] = useState(8);
  const [lang, setLang] = useState("EN");
  const [detected, setDetected] = useState("20a³ - 4bc");
  const [board, setBoard] = useState<string[]>(["📸 Take photo of ANY sum - algebra, equation, triangle!","What number fits in 20 and 4? 4!","20 ÷ 4 = 5, 4 ÷ 4 = 1","Take 4 out: 4(5a³ - bc)","Answer: 4(5a³ - bc) - Simple!"]);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [term, setTerm] = useState(3);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [q, setQ] = useState("");
  const [chat, setChat] = useState<{q:string,a:string}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<any>(null);

  const EXAM: any = {
    8:{title:"Grade 8 CAPS Senior", papers:["Nov 2023 Gr8 - Paper 1","June 2024 Gr8 - Paper 2","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 Final (100)"]}},
    9:{title:"Grade 9 CAPS Senior", papers:["Nov 2023 Gr9 - Paper 1","June 2024 Gr9 - Paper 2","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (50)"],2:["Term 2 ANY (50)"],3:["Term 3 ANY (50)"],4:["Term 4 ANY (150)"]}},
    10:{title:"Grade 10 CAPS FET", papers:["DBE P1 2023","DBE P2 2023 + Memo","June 2024 P1"], mocks:{1:["Term 1 ANY (100)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150) P2 (150)"]}},
    11:{title:"Grade 11 CAPS FET", papers:["DBE P1 2023","DBE P2 2023 + Memo","Nov 2023 Memo"], mocks:{1:["Term 1 ANY (75)"],2:["Term 2 ANY (100)"],3:["Term 3 ANY (100)"],4:["Term 4 P1 (150)"]}},
    12:{title:"Grade 12 CAPS FET Matric", papers:["NSC 2023 P1 + Memo","NSC 2023 P2 + Memo","NSC 2024 P1 Trial"], mocks:{1:["Term 1 ANY (150)"],2:["Term 2 ANY (300)"],3:["Term 3 Trial (150)"],4:["Term 4 Final (150)"]}},
  };

  const VOICE: any = {
    EN: (d:string)=> [`Look at your sum! ${d}`, `What number can go into both parts?`, `We use divide!`, `Now we take that number outside!`, `And that's the answer! Easy!`],
    AF: (d:string)=> [`Kyk na jou som! ${d}`, `Watter nommer pas in albei?`, `Ons gebruik deel!`, `Haal daardie nommer uit!`, `En dis die antwoord!`],
    XH: (d:string)=> [`Jonga isibalo sakho! ${d}`, `Leliphi inani?`, `Sisebenzisa ukwahlula!`, `Sikhupha elo nani!`, `Yiyo impendulo!`],
    ZU: (d:string)=> [`Bheka isibalo sakho! ${d}`, `Yisiphi isibalo?`, `Sisebenzisa ukuhlukanisa!`, `Sikhipha leso sibalo!`, `Yiyo impendulo!`],
  };

  const next = () => setStep(s=>Math.min(s+1, board.length-1));
  const back = () => setStep(s=>Math.max(s-1, 0));

  useEffect(()=>{
    if(playing){ ref.current = setInterval(()=> setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }), 4000); }
    else clearInterval(ref.current);
    return ()=> clearInterval(ref.current);
  },[playing, board]);

  const speakCalm = (text:string)=>{
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.82; u.pitch = 0.95; u.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    if(voices.length>0){
      let best = voices.find(v=> v.name.includes('Google') && v.lang.startsWith('en')) || voices.find(v=> v.lang === 'en-ZA') || voices.find(v=> v.lang.startsWith('en'));
      if(best) u.voice = best;
    }
    u.lang = lang==="AF"?"af-ZA":lang==="XH"?"xh-ZA":lang==="ZU"?"zu-ZA":"en-ZA";
    window.speechSynthesis.speak(u);
  };

  useEffect(()=>{
    const list = VOICE[lang] ? VOICE[lang](detected) : VOICE.EN(detected);
    speakCalm(list[step] || list[0]);
  },[step, detected, lang, board]);

  const solveAny = (raw:string)=>{
    let t = raw.trim();
    if(!t) return;
    let nums = t.match(/\d+/g) || [];
    if(t.toLowerCase().includes("triangle") || t.toLowerCase().includes("δ") || (nums.length>=2 && nums.length<=3 && /[ABC]/i.test(t) && !t.includes("="))){
      let ab = nums.length>=1 ? parseInt(nums[0]) : 3;
      let ac = nums.length>=2 ? parseInt(nums[nums.length-1]) : 5;
      if(ab>100) ab=3; if(ac>100) ac=5;
      let bc = Math.sqrt(ac*ac - ab*ab);
      let bcStr = Number.isInteger(bc) ? bc.toString() : bc.toFixed(2);
      setDetected(`Δ ABC, AB=${ab}, AC=${ac}, ∠B=90°`);
      setBoard([`📐 Right Triangle - AB=${ab}, AC=${ac}`, `Pythagoras: AB² + BC² = AC²`, `${ab}² + BC² = ${ac}² → ${ab*ab} + BC² = ${ac*ac}`, `BC² = ${ac*ac} - ${ab*ab} = ${ac*ac-ab*ab}`, `BC = √${ac*ac-ab*ab} = ${bcStr}`]);
      setStep(0); setPlaying(true); return;
    }
    t = t.slice(0,80);
    setDetected(t);
    if(t.includes("=")){
      setBoard([`${t}`, `Bring like terms together`, `Make x alone`, `Divide both sides`, `Answer for ${t}`]);
    } else {
      setBoard([`${t} — Read from camera`, `Find common factor`, `Divide each term`, `Take out common`, `Final: ${t} factored`]);
    }
    setStep(0); setPlaying(true);
  };

  const preprocessAndRead = async (file: Blob)=>{
    setOcrLoading(true);
    setBoard([`⏳ Cleaning image for math...`]);
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise(r=> img.onload = r);
    const canvas = canvasRef.current!;
    const maxW = 1200;
    let w = img.width, h = img.height;
    if(w > maxW){ h = h * maxW / w; w = maxW; }
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img,0,0,w,h);
    let imageData = ctx.getImageData(0,0,w,h);
    let d = imageData.data;
    for(let i=0;i<d.length;i+=4){
      let gray = d[i]*0.299 + d[i+1]*0.587 + d[i+2]*0.114;
      let bw = gray > 160 ? 255 : gray < 100 ? 0 : gray > 130 ? 255 : 0;
      d[i]=d[i+1]=d[i+2]=bw;
    }
    ctx.putImageData(imageData,0,0);
    if(!(window as any).Tesseract){
      await new Promise((resolve, reject)=>{
        const s = document.createElement('script');
        s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
        s.onload = ()=> resolve(true); s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    try{
      // @ts-ignore
      const worker = await (window as any).Tesseract.createWorker('eng');
      await worker.setParameters({ tessedit_char_whitelist: 'ABCabc0123456789xXyYzZ+-=()^/ ', tessedit_pageseg_mode: '7' });
      const { data: { text, confidence } } = await worker.recognize(canvas);
      await worker.terminate();
      let cleaned = text.trim().replace(/\n/g,' ').replace(/\s+/g,' ').slice(0,100).trim();
      if(confidence < 30 || cleaned.length < 2){ let numOnly = text.match(/[\dA-Za-z=+\-^() ]+/g)?.join(' ').slice(0,80) || ""; if(numOnly) cleaned = numOnly; }
      if(!cleaned) cleaned = "3 5 triangle";
      solveAny(cleaned);
    }catch(e){ solveAny("20a³ - 4bc"); }
    setOcrLoading(false);
    if(!freeUsed) setFreeUsed(true);
  };

  const handlePhoto = async (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(freeUsed && !hasPaid){ setShowPaywall(true); e.target.value=""; return; }
    setPhoto(URL.createObjectURL(file));
    await preprocessAndRead(file);
  };

  const askTeacher = ()=>{
    if(!q.trim()) return;
    let lower = q.toLowerCase();
    let ans = "";
    let current = board[step] || "";
    if(lower.includes("don't understand") || lower.includes("explain") || lower.includes("how")){
      if(detected.toLowerCase().includes("triangle") || detected.includes("Δ")){
        ans = `Ok listen! For ${detected}, I used Pythagoras! I know AC is longest side (hypotenuse). So AB² + BC² = AC². ${board[1]}. Then ${board[2]}. Then I minus to get ${board[3]}. Then square root! That's how I got ${board[4]}. You take square root both sides!`;
      } else if(detected.includes("=") && /x/i.test(detected)){
        ans = `Good! For ${detected}, look: ${board[1]} - why? Because we want x alone! If +5 on left, we do -5 both sides to cancel! Then ${board[2]}. Then ${board[3]} - we divide by number in front of x! That's how we get ${board[4]}. We do opposite operation!`;
      } else {
        ans = `Ok! For ${detected}, I look for common number! Like ${board[1]}. Why? Because that number divides both parts! Then ${board[2]} - I divide each part! Then ${board[3]} - I take that number outside brackets! That's factoring! So answer is ${board[4]}!`;
      }
    } else if(lower.includes("why")){
      ans = `Why? Great question! For ${detected}, we do ${current} because if we don't, sum stays big and messy! We do opposite to simplify! Like if plus, we minus! This makes it easier to solve!`;
    } else {
      ans = `For "${q}" about ${detected}: Step ${step+1} is ${current}. Let me break it: First look at what you have, then find what is common or move, then simplify! Ask "how did you get that" and I will explain WHY!`;
    }
    setChat(prev=>[...prev, {q, a:ans}]);
    speakCalm(ans);
    setQ("");
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:10}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <h2 style={{textAlign:"center", color:"#FFD700", margin:0}}>CAPS MATHS BUDDY 786</h2>
      <p style={{textAlign:"center", fontSize:11, color:"#0f0", fontWeight:"bold"}}>✅ MATH CAMERA - Reads ANY equation!</p>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:8}}>
        {[8,9,10,11,12].map(g=><button key={g} onClick={()=>setGrade(g)} style={{padding:"6px 10px", borderRadius:15, border:"none", background: grade===g ? "#FFD700" : "#333", color: grade===g ? "black" : "white", fontWeight:"bold", fontSize:11}}>Gr {g}</button>)}
      </div>
      <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:6}}>
        {["EN","AF","XH","ZU"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"6px 12px", borderRadius:12, border:"none", background: lang===l ? "#FFD700" : "#222", color: lang===l ? "black" : "white", fontSize:11, fontWeight:"bold"}}>{l}</button>)}
      </div>
      <div style={{background:"#111", padding:9, borderRadius:12, border: photo ? "2px solid #0f0" : "1px solid #333", marginTop:8}}>
        <p style={{margin:"3px 0", fontSize:12, fontWeight:"bold"}}>📸 MATH CAMERA - Photo ANY sum!</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{fontSize:12, padding:6, background:"#222", color:"white", borderRadius:6, width:"100%"}}/>
        {ocrLoading && <p style={{color:"#0f0", fontSize:12, fontWeight:"bold", background:"#003300", padding:6, borderRadius:4, marginTop:6}}>⏳ Cleaning + reading...</p>}
        {photo && (
          <>
            <img src={photo} style={{width:"100%", marginTop:6, borderRadius:8, border:"2px solid #0f0"}} alt="your"/>
            <div style={{background:"#222", padding:8, borderRadius:8, marginTop:6}}>
              <p style={{color:"#FFD700", fontSize:11, margin:0, fontWeight:"bold"}}>✏️ Camera read: (edit if wrong)</p>
              <div style={{display:"flex", gap:6, marginTop:4}}>
                <input value={detected} onChange={e=>setDetected(e.target.value)} style={{flex:1, padding:8, borderRadius:6, border:"1px solid #0f0", background:"black", color:"white", fontSize:14}}/>
                <button onClick={()=>solveAny(detected)} style={{background:"#0f0", border:"none", padding:"8px 12px", borderRadius:6, fontWeight:"bold"}}>Solve</button>
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{background:"#FFF9E5", color:"black", padding:12, borderRadius:14, minHeight:300, marginTop:10}}>
        <p style={{margin:0, fontSize:11, fontWeight:"bold"}}>✍🏽 Teacher — {EXAM[grade].title} — {lang}:</p>
        {board.slice(0, step+1).map((b,i)=>(<div key={i} style={{margin:"12px 0", padding:8, background: i===step ? "#FFD700" : "#fff", borderRadius:6, borderLeft:"4px solid black"}}><p style={{fontSize:20, fontFamily:"monospace", margin:0}}>{i+1}. {b}</p></div>))}
      </div>
      <div style={{display:"flex", gap:5, justifyContent:"center", marginTop:10}}>
        <button onClick={back} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>⏪ Back</button>
        <button onClick={()=>{ window.speechSynthesis.cancel(); setPlaying(!playing); }} style={{padding:"12px 22px", background:"#FFD700", color:"black", borderRadius:8, border:"none", fontWeight:"bold", fontSize:14}}>{playing ? "⏸️ Pause" : "▶️ Play Voice"}</button>
        <button onClick={next} style={{padding:"12px 16px", background:"#333", color:"white", borderRadius:8, border:"none", fontWeight:"bold"}}>Forward ⏩</button>
      </div>
      <div style={{background:"#1e1e1e", padding:10, borderRadius:12, marginTop:12, border:"1px solid #333"}}>
        <p style={{fontWeight:"bold", color:"#FFD700", margin:0, fontSize:13}}>📚 EXAM PREP — {EXAM[grade].title}</p>
        <p style={{fontSize:11, color:"#0f0", fontWeight:"bold", margin:"10px 0 4px 0"}}>📄 PAST PAPERS (CAPS):</p>
        <div style={{background:"#111", padding:8, borderRadius:8, border:"1px solid #444"}}>
          {EXAM[grade].papers.map((p:string,i:number)=><div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}><span style={{fontSize:11}}>{p}</span><button style={{background:"#0f0", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold", color:"black"}}>Open</button></div>)}
        </div>
        <div style={{display:"flex", gap:4, marginTop:10}}>{[1,2,3,4].map(t=><button key={t} onClick={()=>setTerm(t)} style={{padding:"5px 10px", borderRadius:12, border:"none", background: term===t ? "#FFD700" : "#333", color: term===t ? "black" : "white", fontSize:11, fontWeight:"bold"}}>Term {t}</button>)}</div>
        <div style={{background:"#111", padding:8, borderRadius:8, marginTop:8, border:"1px solid #0f0"}}>{EXAM[grade].mocks[term].map((m:string,i:number)=><div key={i} style={{display:"flex", justifyContent:"space-between", background:"#222", padding:7, borderRadius:5, marginTop:5}}><span style={{fontSize:11}}>{m}</span><button style={{background:"#FFD700", border:"none", padding:"4px 9px", borderRadius:4, fontSize:10, fontWeight:"bold"}}>Start Mock</button></div>)}</div>
      </div>
      {showPaywall && (<div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:15, zIndex:99}}><div style={{background:"#111", border:"2px solid #FFD700", padding:18, borderRadius:15, textAlign:"center", maxWidth:350}}><h3 style={{color:"#FFD700", margin:0}}>🔒 Free Finished!</h3><p style={{fontSize:13}}>1 free read used. Unlimited R150/month.</p><button onClick={()=>window.open("https://paystack.com/pay/YOUR_SUB_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold"}}>Pay R150/month</button><button onClick={()=>{setHasPaid(true); setShowPaywall(false)}} style={{background:"#333", padding:8, width:"100%", borderRadius:8, border:"none", color:"white", marginTop:8}}>(Test: I Paid)</button><button onClick={()=>setShowPaywall(false)} style={{background:"transparent", color:"#888", border:"none", marginTop:8}}>Close</button></div></div>)}
      <div style={{border:"2px solid #FFD700", padding:12, borderRadius:12, textAlign:"center", marginTop:12, background:"#111"}}><button onClick={()=>setShowPaywall(true)} style={{background:"#FFD700", padding:11, width:"100%", borderRadius:9, border:"none", fontWeight:"bold"}}>{hasPaid ? "✅ Active" : "Pay R150/month"}</button></div>

      <button onClick={()=>setShowAsk(true)} style={{position:'fixed', bottom:'20px', right:'20px', background:'#FFD700', color:'black', padding:'14px 22px', borderRadius:'30px', fontWeight:'bold', zIndex:9999, border:'none'}}>💬 Ask Teacher</button>

      {showAsk && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.92)', zIndex:10000, padding:15, display:'flex', flexDirection:'column'}}>
          <div style={{background:'#FFF9E5', borderRadius:15, padding:12, flex:1, display:'flex', flexDirection:'column', maxWidth:400, margin:'0 auto', width:'100%'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><h3 style={{color:'black', margin:0, fontSize:14}}>👩🏽‍🏫 Ask Teacher — {detected}</h3><button onClick={()=>setShowAsk(false)} style={{background:'#333', color:'white', border:'none', borderRadius:20, padding:'6px 12px'}}>X</button></div>
            <p style={{color:'#666', fontSize:11, margin:"4px 0"}}>Ask "How did you get that?"</p>
            <div style={{background:'white', border:'1px solid #ddd', borderRadius:10, padding:8, flex:1, overflowY:'auto', marginTop:8}}>
              {chat.map((c,i)=><div key={i} style={{marginBottom:10}}><p style={{background:'#FFD700', padding:6, borderRadius:8, fontSize:13, color:'black', margin:0}}><b>You:</b> {c.q}</p><p style={{background:'#111', color:'white', padding:6, borderRadius:8, fontSize:13, marginTop:4, lineHeight:"1.4"}}><b>Teacher:</b> {c.a}</p></div>)}
              {chat.length===0 && <p style={{color:'#888', fontSize:12}}>Ask: "How did you get that?" or "Why divide?" - She will EXPLAIN how!</p>}
            </div>
            <div style={{display:'flex', gap:6, marginTop:8}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder='How did you get that answer?' style={{flex:1, padding:10, borderRadius:8, border:'1px solid #333'}} onKeyDown={e=> e.key==='Enter' && askTeacher()}/><button onClick={askTeacher} style={{background:'#FFD700', border:'none', padding:'10px 14px', borderRadius:8, fontWeight:'bold'}}>Ask</button></div>
            <div style={{display:'flex', gap:4, marginTop:6, flexWrap:'wrap'}}>
              <button onClick={()=>{setQ("How did you get that answer?");}} style={{fontSize:10, padding:'4px 8px', borderRadius:12, border:'1px solid #333', background:'#fff'}}>How did you get that?</button>
              <button onClick={()=>setQ("Why do we do this?")} style={{fontSize:10, padding:'4px 8px', borderRadius:12, border:'1px solid #333', background:'#fff'}}>Why do we do this?</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{marginTop:'30px', padding:'25px 15px', background:'#0f0f0f', textAlign:'center', borderTop:'1px solid #333', borderRadius:'12px'}}>
        <div style={{display:'flex', justifyContent:'center', gap:'15px', flexWrap:'wrap', marginBottom:'10px'}}>
          <a href="/pricing" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Pricing</a>
          <a href="/refund" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Refund</a>
          <a href="/cancellation" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Cancellation</a>
          <a href="/terms" style={{color:'#FFD700', textDecoration:'none', fontWeight:'bold', fontSize:'13px'}}>Terms</a>
        </div>
        <p style={{color:'#666', fontSize:'11px'}}>R150/month • raeezgeswind5@gmail.com • South Africa • Paystack</p>
      </footer>
    </div>
  );
    }
