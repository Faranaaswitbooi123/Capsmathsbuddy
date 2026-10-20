"use client"
import { useState, useEffect, useRef } from "react"

export default function Page(){
  const [grade,setGrade]=useState(12)
  const [sumIndex,setSumIndex]=useState(0)
  const [isPaid,setIsPaid]=useState(false)
  const [isPlaying,setIsPlaying]=useState(false)
  const [lang,setLang]=useState("en-ZA")
  const [askOpen,setAskOpen]=useState(false)
  const [askQ,setAskQ]=useState("")
  const [askAns,setAskAns]=useState("")
  const canvasRef=useRef<HTMLCanvasElement>(null)

  const sums=[
    { q:"Solve: 2x + 3 = 11", steps:["2x = 11 - 3","2x = 8","x = 4"] },
    { q:"Factorise: x² - 9", steps:["x² - 9 = 0","(x-3)(x+3)=0","x=3 or x=-3"] },
    { q:"Gr12: f(x)=x²-4, find turning point", steps:["f'(x)=2x","2x=0","x=0","y=-4","TP (0,-4)"] },
  ]
  const current=sums[sumIndex]
  const isFree=sumIndex===0

  useEffect(()=>{
    if(!isPlaying) return
    const c=canvasRef.current; if(!c) return
    const ctx=c.getContext("2d"); if(!ctx) return
    ctx.clearRect(0,0,c.width,c.height)
    ctx.font="28px Caveat, cursive"; ctx.fillStyle="#111"
    const utter=new SpeechSynthesisUtterance(current.steps.join(". "))
    utter.lang=lang; utter.rate=0.9
    speechSynthesis.cancel(); speechSynthesis.speak(utter)
    let i=0
    const id=setInterval(()=>{
      if(i>=current.steps.length){ clearInterval(id); setIsPlaying(false); return }
      ctx.fillText(current.steps[i],20,50+i*45); i++
    },1300)
    return()=>clearInterval(id)
  },[isPlaying,sumIndex,lang])

  const next=()=>{
    if(!isFree && !isPaid){ window.location.href="/api/paystack"; return }
    if(sumIndex<sums.length-1) setSumIndex(s=>s+1)
  }

  return(
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center p-3 bg-black text-white sticky top-0 z-40">
        <h1 className="font-black text-lg">786 • Caps Maths Buddy</h1>
        <div className="flex gap-2 items-center">
          <button onClick={()=>document.getElementById("exam")?.scrollIntoView({behavior:"smooth"})} className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-xs">📚 Exam Prep</button>
          <select value={lang} onChange={e=>setLang(e.target.value)} className="text-black rounded px-1 text-xs">
            <option value="en-ZA">EN</option><option value="af-ZA">AF</option><option value="xh-ZA">XH</option><option value="zu-ZA">ZU</option>
          </select>
          <select value={grade} onChange={e=>setGrade(Number(e.target.value))} className="text-black rounded px-1 text-xs">
            <option value={8}>Gr8</option><option value={9}>Gr9</option><option value={10}>Gr10</option><option value={11}>Gr11</option><option value={12}>Gr12</option>
          </select>
        </div>
      </header>

      <div className="relative w-[98%] h-[52vh] bg-[#fefcf3] border-[3px] border-black mx-auto mt-2 rounded-xl overflow-hidden">
        <div className="absolute top-1 left-2 text-[10px] opacity-20 font-black tracking-widest">786 • 786 • 786 • 786</div>
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-full"/>
        {!isPlaying && <div className="absolute top-8 left-4 text-[22px] font-bold">{current.q}</div>}
        {isPlaying && <div className="absolute right-10 top-20 text-4xl animate-bounce">✍️</div>}
      </div>

      <div className="flex justify-center gap-2 my-3 px-2">
        <button onClick={()=>sumIndex>0&&setSumIndex(s=>s-1)} className="flex-1 max-w-[80px] py-3 bg-gray-200 rounded-full font-bold text-sm">◀ Back</button>
        <button onClick={()=>setIsPlaying(!isPlaying)} className="flex-1 max-w-[90px] py-3 bg-black text-white rounded-full font-bold text-sm">{isPlaying?"⏸ Pause":"▶ Play"}</button>
        <button onClick={()=>setAskOpen(true)} className="flex-1 max-w-[80px] py-3 bg-blue-600 text-white rounded-full font-bold text-sm">💬 Ask</button>
        <button onClick={next} className="flex-1 max-w-[80px] py-3 bg-yellow-400 rounded-full font-bold text-sm">Next ▶</button>
      </div>

      <section id="exam" className="p-3 border-t mt-2">
        <h2 className="font-black">786 Exam Prep Gr {grade}</h2>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button className="border-2 border-black p-3 rounded-xl font-bold text-sm">NSC P1</button>
          <button className="border-2 border-black p-3 rounded-xl font-bold text-sm">NSC P2</button>
          <button className="border p-3 rounded-xl text-sm">Eastern Cape</button>
          <button className="border p-3 rounded-xl text-sm">Mocks {grade}</button>
        </div>
      </section>

      {!isFree && !isPaid && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-2xl text-center max-w-sm w-full">
            <h2 className="text-3xl font-black">786</h2>
            <p className="my-3 text-sm">Sum 1 was FREE. Unlock all sums + Exam Prep + Voice + Handwriting memo</p>
            <p className="font-black text-xl">R150 / month</p>
            <button onClick={()=>window.location.href="/api/paystack"} className="mt-4 w-full bg-green-600 text-white py-3 rounded-full font-bold">Pay R150 →</button>
          </div>
        </div>
      )}

      {askOpen && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-end justify-center p-2">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-4">
            <div className="flex justify-between"><h3 className="font-black text-sm">786 Ask about this sum</h3><button onClick={()=>setAskOpen(false)}>✕</button></div>
            <p className="text-xs bg-yellow-50 p-2 rounded mt-2 border">Q: {current.q}</p>
            <input value={askQ} onChange={e=>setAskQ(e.target.value)} placeholder="Why x=4?" className="w-full border-2 p-3 rounded-xl mt-3"/>
            <button onClick={async()=>{
              setAskAns("786 thinking..."); 
              setTimeout(()=>setAskAns(`786: For ${current.q}, we do ${current.steps[0]}. Ask me to replay!`),800)
            }} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-2">Ask 786</button>
            {askAns && <div className="mt-3 p-3 bg-gray-100 rounded-xl text-sm">{askAns}</div>}
          </div>
        </div>
      )}
    </div>
  )
   }
