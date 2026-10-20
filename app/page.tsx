"use client"
import { useState, useEffect, useRef } from "react"

export default function Page(){
  const [grade,setGrade]=useState(12)
  const [lang,setLang]=useState("en-ZA")
  const [sumIndex,setSumIndex]=useState(0)
  const [isPlaying,setIsPlaying]=useState(false)
  const [handPos,setHandPos]=useState({x:0,y:0})
  const [showCam,setShowCam]=useState(false)
  const canvasRef=useRef<any>(null)
  const videoRef=useRef<any>(null)

  const T:any={
    "en-ZA":{exam:"📚 Exam", play:"▶ Play", title:"786 • Caps Maths Buddy", voice:"en-ZA"},
    "af-ZA":{exam:"📚 Eksamen", play:"▶ Speel", title:"786 • KABV Wiskunde", voice:"af-ZA"},
    "xh-ZA":{exam:"📚 Ulungiselelo", play:"▶ Dlala", title:"786 • Maths Buddy XH", voice:"en-ZA"},
    "zu-ZA":{exam:"📚 Ukulungela", play:"▶ Dlala", title:"786 • Maths Buddy ZU", voice:"zu-ZA"},
  }
  const t=T[lang]||T["en-ZA"]

  const sums=[
    { q:"Solve: 2x+3=11", en:["To solve 2x plus 3 equals 11","Minus 3 both sides","2x equals 8","So x equals 4"], steps:["2x+3=11","2x=11-3","2x=8","x=4"] },
    { q:"Factorise: x²-9", en:["Factorise x squared minus 9","This is difference of squares","Answer x minus 3 times x plus 3"], steps:["x²-9","(x-3)(x+3)","x=3 or -3"] },
  ]
  const cur=sums[sumIndex]

  // HAND + VOICE MAGIC
  useEffect(()=>{
    if(!isPlaying) return
    const c=canvasRef.current; if(!c) return
    const ctx=c.getContext("2d"); if(!ctx) return
    ctx.clearRect(0,0,800,400)
    ctx.font="34px Caveat, cursive"; ctx.fillStyle="#111"

    // VOICE that explains
    const textToSpeak = cur.en.join(". ")
    const utter = new SpeechSynthesisUtterance(textToSpeak)
    utter.lang=t.voice; utter.rate=0.85
    speechSynthesis.cancel(); speechSynthesis.speak(utter)

    // HAND that writes
    let step=0
    const interval=setInterval(()=>{
      if(step>=cur.steps.length){ clearInterval(interval); setIsPlaying(false); setHandPos({x:0,y:0}); return }
      // animate hand moving
      const x=30 + cur.steps[step].length*4
      const y=50 + step*55
      setHandPos({x,y})
      ctx.fillText(cur.steps[step],30,60+step*55)
      step++
    },1800)
    return()=>{ clearInterval(interval); speechSynthesis.cancel() }
  },[isPlaying,sumIndex,lang])

  const openCam=async()=>{
    setShowCam(true)
    try{ const s=await navigator.mediaDevices.getUserMedia({video:true}); if(videoRef.current) videoRef.current.srcObject=s }catch{}
  }

  return(
    <div style={{minHeight:"100vh", background:"#fff"}}>
      <div style={{background:"#000", color:"#fff", padding:"10px", display:"flex", justifyContent:"space-between"}}>
        <div style={{fontWeight:900}}>{t.title}</div>
        <div style={{display:"flex", gap:5}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{color:"#000", fontSize:11, borderRadius:6}}><option value="en-ZA">EN</option><option value="af-ZA">AF</option><option value="xh-ZA">XH</option><option value="zu-ZA">ZU</option></select>
          <select value={grade} onChange={e=>setGrade(Number(e.target.value))} style={{color:"#000", fontSize:11, borderRadius:6}}><option value={8}>Gr8</option><option value={9}>Gr9</option><option value={10}>Gr10</option><option value={11}>Gr11</option><option value={12}>Gr12</option></select>
        </div>
      </div>

      <div style={{margin:"10px", background:"#FFFEF5", border:"3px solid #000", borderRadius:16, height:"48vh", position:"relative", overflow:"hidden"}}>
        <canvas ref={canvasRef} width={800} height={400} style={{width:"100%", height:"100%"}}/>
        <div style={{position:"absolute", top:30, left:16, fontSize:22, fontWeight:800}}>{!isPlaying && cur.q}</div>
        {/* HAND THAT WRITES */}
        {isPlaying && <div style={{position:"absolute", left:handPos.x, top:handPos.y, fontSize:32, transition:"all 0.8s", transform:"rotate(-15deg)"}}>✍️</div>}
        {showCam && <video ref={videoRef} autoPlay playsInline style={{position:"absolute", right:10, top:10, width:100, height:75, border:"2px solid #000", borderRadius:8}}/>}
        <div style={{position:"absolute", bottom:5, left:10, fontSize:9, opacity:0.3}}>786 • Gr {grade} • Hand + Voice • Whole SA</div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:6, padding:10}}>
        <button onClick={()=>{setIsPlaying(false); setSumIndex(s=>Math.max(0,s-1))}} style={{padding:12, background:"#eee", borderRadius:20, fontWeight:800, border:"none"}}>Back</button>
        <button onClick={()=>setIsPlaying(!isPlaying)} style={{padding:12, background:isPlaying?"#FF4444":"#000", color:"#fff", borderRadius:20, fontWeight:800, border:"none"}}>{isPlaying?"⏸ Stop":t.play+" 🔊"}</button>
        <button onClick={openCam} style={{padding:12, background:"#fff", border:"2px solid #000", borderRadius:20, fontWeight:800}}>📷</button>
        <button onClick={()=>alert("786 Ask: How can I help with "+cur.q+"?")} style={{padding:12, background:"#2563EB", color:"#fff", borderRadius:20, fontWeight:800, border:"none"}}>Ask</button>
        <button onClick={()=>{setIsPlaying(false); setSumIndex(s=>Math.min(sums.length-1,s+1))}} style={{padding:12, background:"#FFD700", borderRadius:20, fontWeight:800, border:"none"}}>Next</button>
      </div>

      <div style={{textAlign:"center", fontSize:11, opacity:0.5, padding:10}}>🔊 Turn on sound — Hand writes + Voice explains in 4 languages • Gr 8-12 Whole SA • 786</div>
    </div>
  )
    }
