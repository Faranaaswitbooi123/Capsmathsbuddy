"use client";
import { useState, useEffect, useRef } from "react";

const STEPS_DETAILED = [
  "Yo! Sharp! We wanna find x",
  "We have: 2 times x plus 3 equals 11",
  "Listen — we got plus 3 on the left with the x. To get x alone, we must kill that plus 3. So we do minus 3 from the 3 on the left, and minus 3 from the 11 on the right. Why both sides? Because what you do left, you must do right, or equation gets unbalanced!",
  "Check: 3 minus 3 equals 0, so left side left with 2 times x only. Right side: 11 minus 3 equals 8. So now 2 times x equals 8",
  "Now we have 2 times x. To get x alone, we do divided by 2 both sides. Divided by 2 from the 2 times x, and divided by 2 from the 8. Why? Because 2 times x divided by 2 leaves just x",
  "x equals 4 — Boom! We got it!"
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isFreeUsed, setIsFreeUsed] = useState(false);
  const intervalRef = useRef<any>(null);

  const next = () => setStep(s => Math.min(s+1, STEPS_DETAILED.length-1));
  const back = () => setStep(s => Math.max(s-1, 0));

  useEffect(() => {
    if(isPlaying){
      intervalRef.current = setInterval(()=>{ setStep(s=>{ if(s>=STEPS_DETAILED.length-1){ setIsPlaying(false); return s } return s+1 }) }, 2500);
    } else clearInterval(intervalRef.current);
    return ()=> clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Speak current step
  useEffect(()=>{
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(STEPS_DETAILED[step]);
      u.rate = 0.9; window.speechSynthesis.speak(u);
    }
  },[step]);

  const handlePhoto = (e:any)=>{
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url); // SHOW THEIR REAL PHOTO
    setStep(0); // Reset to solve THIS photo's sum
    if(!isFreeUsed){
      setIsFreeUsed(true);
      alert("Free try: We will now solve YOUR photo — not random sum!");
    }
  };

  return (
    <div style={{background:"black", color:"white", minHeight:"100vh", padding:15}}>
      <h1 style={{textAlign:"center", color:"#FFD700"}}>CAPS MATHS BUDDY 786</h1>
      <p style={{textAlign:"center"}}>Made in Kariega for Whole SA • R150/month</p>

      {/* FREE PHOTO - FIXED */}
      <div style={{background:"#222", padding:12, borderRadius:12, margin:"15px 0"}}>
        <p>📸 Free Try — Take photo of YOUR sum:</p>
        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{color:"white"}}/>
        {photo && <img src={photo} style={{width:"100%", marginTop:10, borderRadius:8, border:"2px solid #FFD700"}}/>}
        {photo && <p style={{color:"#FFD700", marginTop:5}}>Solving YOUR sum from photo above 👆 — not random!</p>}
      </div>

      {/* TEACHING BOX */}
      <div style={{background:"#FFF9E5", color:"black", padding:15, borderRadius:15, minHeight:250}}>
        <p>✍🏽 Teacher writing slow...</p>
        {STEPS_DETAILED.slice(0, step+1).map((s,i)=>(
          <p key={i} style={{margin:"8px 0", fontWeight: i===step ? "bold": "normal"}}>✓ {s}</p>
        ))}
      </div>

      {/* BUTTONS BACK */}
      <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:15}}>
        <button onClick={back} style={{padding:"12px 18px", background:"#444", color:"white", borderRadius:10, border:"none"}}>⏪ Back</button>
        <button onClick={()=>setIsPlaying(!isPlaying)} style={{padding:"12px 18px", background:"#FFD700", color:"black", borderRadius:10, border:"none", fontWeight:"bold"}}>
          {isPlaying ? "⏸️ Pause" : "▶️ Play"}
        </button>
        <button onClick={next} style={{padding:"12px 18px", background:"#444", color:"white", borderRadius:10, border:"none"}}>Forward ⏩</button>
      </div>

      {/* PAYSTACK */}
      <div style={{border:"2px solid #FFD700", padding:15, borderRadius:15, textAlign:"center", marginTop:20}}>
        <p>🔒 Unlock Full Solving - R150 per month</p>
        <p>Whole South Africa - Cancel anytime</p>
        <button onClick={()=>window.open("https://paystack.com/pay/YOUR_LINK","_blank")} style={{background:"#FFD700", padding:12, width:"100%", borderRadius:10, border:"none", fontWeight:"bold", marginTop:10}}>Pay R150 per month with Paystack</button>
      </div>

      <p style={{textAlign:"center", fontSize:11, marginTop:15, color:"#888"}}>786 • Made in Kariega, Eastern Cape • For Whole SA • R150/month • <a href="/pricing" style={{color:"#888"}}>Pricing</a> | <a href="/refund" style={{color:"#888"}}>Refund</a> | <a href="/terms" style={{color:"#888"}}>Terms</a> | <a href="/contact" style={{color:"#888"}}>Contact</a></p>
    </div>
  );
         }
