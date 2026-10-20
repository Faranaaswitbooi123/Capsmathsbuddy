"use client"
import { useState, useEffect, useRef } from "react"

export default function Page(){
  const [sumIndex,setSumIndex]=useState(0)
  const [isPlaying,setIsPlaying]=useState(false)
  const [askOpen,setAskOpen]=useState(false)
  const [askAns,setAskAns]=useState("")
  const canvasRef=useRef<any>(null)

  const sums=[
    { q:"Solve: 2x + 3 = 11", steps:["2x = 11 - 3","2x = 8","x = 4"] },
    { q:"Factorise: x² - 9", steps:["(x-3)(x+3)","x=3 or x=-3"] },
    { q:"Gr 12: Turning Point", steps:["f'(x)=2x","x=0","TP (0,-4)"] },
  ]
  const current=sums[sumIndex]
  const isFree=sumIndex===0

  useEffect(()=>{
    if(!isPlaying) return
    const c=canvasRef.current; if(!c) return
    const ctx=c.getContext("2d"); if(!ctx) return
    ctx.clearRect(0,0,800,400)
    ctx.font="32px cursive"; ctx.fillStyle="#111"
    let i=0
    const id=setInterval(()=>{ if(i>=current.steps.length){clearInterval(id); setIsPlaying(false); return} ctx.fillText(current.steps[i],30,60+i*50); i++ },1200)
    return()=>clearInterval(id)
  },[isPlaying,sumIndex])

  return(
    <div style={{minHeight:"100vh", background:"#fff", fontFamily:"sans-serif"}}>
      {/* TOP BAR - OLD BEAUTIFUL STYLE */}
      <div style={{background:"#000", color:"#fff", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontWeight:900, fontSize:20}}>786 • Caps Maths Buddy</div>
        <div style={{display:"flex", gap:8}}>
          <button onClick={()=>document.getElementById("exam")?.scrollIntoView({behavior:"smooth"})} style={{background:"#FFD700", color:"#000", padding:"6px 14px", borderRadius:20, fontWeight:800, border:"none"}}>📚 Exam Prep</button>
          <select style={{borderRadius:8, padding:"4px"}}><option>Gr12</option><option>Gr11</option><option>Gr10</option></select>
        </div>
      </div>

      {/* WHITEBOARD - OLD DBE TV STYLE YOU LIKED */}
      <div style={{margin:"12px", background:"#FFFEF5", border:"4px solid #000", borderRadius:16, height:"52vh", position:"relative", boxShadow:"0 8px 20px rgba(0,0,0,0.1)"}}>
        <div style={{position:"absolute", top:6, left:10, opacity:0.15, fontWeight:900, fontSize:12, letterSpacing:2}}>786 • 786 • 786 • 786 • 786</div>
        <canvas ref={canvasRef} width={800} height={400} style={{width:"100%", height:"100%"}}/>
        <div style={{position:"absolute", top:40, left:20, fontSize:24, fontWeight:700}}>{!isPlaying && current.q}</div>
        {isPlaying && <div style={{position:"absolute", right:30, top:60, fontSize:40}}>✍️</div>}
        <div style={{position:"absolute", bottom:8, left:12, fontSize:10, opacity:0.3}}>786 • CAPS Maths Gr 8-12 • DBE Style Board</div>
      </div>

      {/* CONTROLS - OLD ROUNDED BEAUTIFUL BUTTONS */}
      <div style={{display:"flex", justifyContent:"center", gap:10, padding:"12px"}}>
        <button onClick={()=>sumIndex>0&&setSumIndex(s=>s-1)} style={{flex:1, maxWidth:90, padding:"14px 0", background:"#eee", borderRadius:30, fontWeight:800, border:"none"}}>◀ Back</button>
        <button onClick={()=>setIsPlaying(!isPlaying)} style={{flex:1, maxWidth:110, padding:"14px 0", background:"#000", color:"#fff", borderRadius:30, fontWeight:800, border:"none"}}>{isPlaying?"⏸ Pause":"▶ Play"}</button>
        <button onClick={()=>setAskOpen(true)} style={{flex:1, maxWidth:90, padding:"14px 0", background:"#2563EB", color:"#fff", borderRadius:30, fontWeight:800, border:"none"}}>💬 Ask</button>
        <button onClick={()=>{ if(!isFree){window.location.href="/api/paystack"; return} if(sumIndex<sums.length-1) setSumIndex(s=>s+1) }} style={{flex:1, maxWidth:90, padding:"14px 0", background:"#FFD700", borderRadius:30, fontWeight:800, border:"none"}}>Next ▶</button>
      </div>

      {/* EXAM PREP - MOVED TO TOP AREA LIKE YOU ASKED */}
      <div id="exam" style={{padding:16, borderTop:"1px solid #eee", marginTop:8}}>
        <div style={{fontWeight:900}}>786 Exam Prep</div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10}}>
          <div style={{border:"2px solid #000", padding:14, borderRadius:12, fontWeight:700, textAlign:"center"}}>NSC P1</div>
          <div style={{border:"2px solid #000", padding:14, borderRadius:12, fontWeight:700, textAlign:"center"}}>NSC P2</div>
          <div style={{border:"1px solid #ccc", padding:14, borderRadius:12, textAlign:"center"}}>Eastern Cape</div>
          <div style={{border:"1px solid #ccc", padding:14, borderRadius:12, textAlign:"center"}}>Mocks Gr12</div>
        </div>
      </div>

      {askOpen && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:50}}>
          <div style={{background:"#fff", width:"100%", maxWidth:400, borderTopLeftRadius:20, borderTopRightRadius:20, padding:20}}>
            <div style={{display:"flex", justifyContent:"space-between"}}><b>786 Ask</b><button onClick={()=>setAskOpen(false)}>✕</button></div>
            <div style={{background:"#FFFBEB", padding:8, borderRadius:8, marginTop:8, fontSize:12}}>Q: {current.q}</div>
            <button onClick={()=>setAskAns(`786: For ${current.q}, we do ${current.steps[0]}. The hand shows it step by step.`)} style={{width:"100%", background:"#2563EB", color:"#fff", padding:12, borderRadius:12, fontWeight:800, marginTop:12, border:"none"}}>Ask 786</button>
            {askAns && <div style={{marginTop:12, background:"#f5f5f5", padding:10, borderRadius:10, fontSize:14}}>{askAns}</div>}
          </div>
        </div>
      )}
    </div>
  )
                                     }
