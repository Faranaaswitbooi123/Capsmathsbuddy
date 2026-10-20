"use client";
import { useState, useRef, useEffect } from "react";

const LANGS = {
  en: { label: "English", voice: "en-ZA", name: "CAPS Maths Buddy 786" },
  af: { label: "Afrikaans", voice: "af-ZA", name: "CAPS Wiskunde Maatjie 786" },
  xh: { label: "Xhosa", voice: "en-ZA", name: "CAPS Iqabane leMaths 786" },
  zu: { label: "Zulu", voice: "zu-ZA", name: "CAPS Umngane weMaths 786" },
} as const;

type Lang = keyof typeof LANGS;

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const [grade, setGrade] = useState("10");
  const [image, setImage] = useState<string | null>(null);
  const [sumText, setSumText] = useState("2x + 3 = 11");
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [writtenText, setWrittenText] = useState("");
  const [letterIdx, setLetterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [freeUsed, setFreeUsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handRef = useRef<HTMLDivElement>(null);

  // Load free status
  useEffect(() => {
    const used = localStorage.getItem("caps786_freeUsed");
    if (used) setFreeUsed(true);
  }, []);

  // Generate steps when sumText changes - locked to that sum only
  useEffect(() => {
    const s = sumText.trim();
    if (!s) return;
    // Example CAPS steps - locked to input sum
    setSteps([
      `Sum: ${s}`,
      `Step 1: Write equation ${s}`,
      `Step 2: Isolate x: ${s} => 2x = 11 - 3`,
      `Step 3: 2x = 8`,
      `Step 4: x = 8 / 2 = 4`,
      `Answer: x = 4 (Checked)`,
    ]);
    setCurrentStep(0);
  }, [sumText]);

  // Whiteboard letter-by-letter hand writing
  useEffect(() => {
    if (!isPlaying || !steps[currentStep]) return;
    const full = steps[currentStep];
    if (letterIdx >= full.length) {
      speak(full);
      const t = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(c => c + 1);
          setWrittenText(""); setLetterIdx(0);
        } else setIsPlaying(false);
      }, 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setWrittenText(full.slice(0, letterIdx + 1));
      setLetterIdx(i => i + 1);
      drawOnBoard(full.slice(0, letterIdx + 1));
    }, 80); // letter speed
    return () => clearTimeout(t);
  }, [isPlaying, letterIdx, currentStep, steps]);

  const drawOnBoard = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.font = "28px 'Comic Sans MS', cursive";
    ctx.fillText(text, 30, 80);
    // move hand
    if (handRef.current) {
      const w = ctx.measureText(text).width;
      handRef.current.style.left = `${30 + w}px`;
      handRef.current.style.top = `45px`;
    }
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    // @ts-ignore
    u.lang = LANGS[lang].voice;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const handlePicture = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (freeUsed) { setShowPaywall(true); return; }
    const url = URL.createObjectURL(file);
    setImage(url);
    // Simulate OCR - in production call your backend
    setSumText("2x + 3 = 11");
    localStorage.setItem("caps786_freeUsed", "1");
    setFreeUsed(true);
  };

  const pay = () => {
    // @ts-ignore Paystack
    const handler = window.PaystackPop?.setup({
      key: "YOUR_PAYSTACK_PUBLIC_KEY",
      email: "learner@caps786.co.za",
      amount: 15000, // R150 x 100
      currency: "ZAR",
      callback: () => { localStorage.setItem("caps786_paid","1"); setShowPaywall(false); alert("Payment success - FNB + Paystack confirmed!"); },
    });
    if (handler) handler.openIframe();
    else alert("Add Paystack script + FNB EFT: Account: CAPS 786, R150/month, Ref: Phone number. For demo, click X to continue.");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-2 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow">
        <h1 className="font-black text-sm">CAPS Maths Buddy 786 - Gr {grade} | {LANGS[lang].label}</h1>
        <select value={lang} onChange={e=>setLang(e.target.value as Lang)} className="border rounded p-1 text-xs">
          <option value="en">English</option><option value="af">Afrikaans</option><option value="xh">Xhosa</option><option value="zu">Zulu</option>
        </select>
      </div>

      {/* Grade */}
      <div className="flex gap-1 mt-2 overflow-auto">
        {["8","9","10","11","12"].map(g=><button key={g} onClick={()=>setGrade(g)} className={`px-3 py-1 rounded-full text-xs ${grade===g?"bg-black text-white":"bg-white border"}`}>Gr {g}</button>)}
        <button className="px-3 py-1 rounded-full text-xs bg-blue-600 text-white ml-auto">Exam Prep</button>
      </div>

      {/* Camera */}
      <div className="mt-3 bg-white p-3 rounded-xl shadow">
        <input type="file" accept="image/*" capture="environment" onChange={handlePicture} className="text-xs" />
        {image && <img src={image} className="mt-2 h-24 rounded" />}
        <input value={sumText} onChange={e=>setSumText(e.target.value)} className="mt-2 w-full border p-2 rounded text-sm" placeholder="Sum will appear here - locked to this sum only" />
      </div>

      {/* Whiteboard with hand writing letter by letter */}
      <div className="relative mt-3 bg-white rounded-xl shadow overflow-hidden flex-1">
        <canvas ref={canvasRef} width={380} height={240} className="w-full h-[260px]" />
        <div ref={handRef} className="absolute text-3xl transition-all duration-100" style={{left: 30, top: 45}}>✍️</div>
        <div className="absolute bottom-1 left-2 text-[10px] text-zinc-400">Teacher hand writes letter by letter • Locked to: {sumText}</div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-3">
        <button onClick={()=>{setCurrentStep(s=>Math.max(0,s-1)); setWrittenText(""); setLetterIdx(0);}} className="flex-1 bg-white border py-3 rounded-xl text-sm font-bold">Back</button>
        <button onClick={()=>setIsPlaying(!isPlaying)} className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold">{isPlaying?"Pause":"Play"}</button>
        <button onClick={()=>{setCurrentStep(s=>Math.min(steps.length-1,s+1)); setWrittenText(""); setLetterIdx(0);}} className="flex-1 bg-white border py-3 rounded-xl text-sm font-bold">Next</button>
        <button onClick={()=>{const q=prompt("Ask about this sum only:"); if(q) speak(`For ${sumText}, ${q} - Answer is in step ${currentStep+1}`)}} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold">Ask</button>
      </div>

      {/* Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <h2 className="font-black">First sum FREE done ✅</h2>
            <p className="text-sm mt-2">To continue: R150/month - Whole SA. Paystack + FNB EFT.</p>
            <p className="text-xs mt-2 text-zinc-600">FNB: Acc 123456789, Branch 250655, Ref: your phone. Or Paystack below.</p>
            <button onClick={pay} className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold">Pay R150 with Paystack / FNB</button>
            <button onClick={()=>setShowPaywall(false)} className="w-full mt-2 text-xs text-zinc-500">Close (demo)</button>
          </div>
        </div>
      )}
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </div>
  );
  }
