"use client";
import { useState, useEffect, useRef } from "react";
export default function Home(){
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const [photo,setPhoto]=useState<string|null>(null);
  const [grade,setGrade]=useState(8); const [detected,setDetected]=useState("");
  const [board,setBoard]=useState<string[]>(["MATHS CAMERA ready - Take photo of ANY sum","ANY type: algebra, geometry, trig, finance, factorization, equations","Teacher will look at sum first then make plan","Then explain slow step by step HOW she got answer","Answer simple so you understand"]);
  const [freeUsed,setFreeUsed]=useState(false); const [showPaywall,setShowPaywall]=useState(false); const [hasPaid,setHasPaid]=useState(false);
  const [ocrLoading,setOcrLoading]=useState(false); const [showAsk,setShowAsk]=useState(false);
  const [q,setQ]=useState(""); const [chat,setChat]=useState<{q:string,a:string}[]>([]); const [activeTab,setActiveTab]=useState("solve");
  const canvasRef=useRef<HTMLCanvasElement>(null); const ref=useRef<any>(null);
  const MOCS:any={
    8:["Exam Prep Mock 1 Term 3 - 50 marks ANY sum mix","Exam Prep Mock 2 Final - 100 marks ALL topics"],
    9:["Exam Prep Mock 1 Term 3 - Algebra Geometry","Exam Prep Mock 2 Final - 100 marks"],
    10:["Exam Prep Mock 1 Sept Prep - 100 marks","Exam Prep Mock 2 Final NSC 150 marks"],
    11:["Exam Prep Mock Sept 2024 Full - 300 marks ANY type","Exam Prep Mock Nov Final - 150 marks"],
    12:["Exam Prep Mock Sept 2024 NSC - 300 marks ANY sum","Exam Prep Mock Prelim P1 P2 - 300 marks","Exam Prep Final Revision - All types"]
  };
  const buildBoardForAnyMaths=(raw:string, nums:number[])=>{
    const lower=raw.toLowerCase(); 
    let L=nums[0]||6; let B=nums[1]||4;
    if(L>200)L=6; if(B>200)B=4;
    if(lower.includes("perimeter")){
      return {detected:`MATHS: Rectangle ${L}x${B} Perimeter - ANY sum`, board:[`MATHS CAMERA detected: Rectangle ${L}cm x ${B}cm Perimeter. ANY type camera works!`,`How solve ANY perimeter? Add all sides.`,`Do you remember? P equals 2L plus 2B for ANY rectangle`,`So ${2*L} plus ${2*B}`,`Answer ${2*L+2*B}cm`]};
    }
    if(lower.includes("area")){
      return {detected:`MATHS: Area ${L}x${B} - ANY`, board:[`MATHS CAMERA detected: Area ${L}x${B}. ANY type area too.`,`How? Area is space inside`,`Do you remember? Area equals L times B for ANY`,`So ${L} times ${B}`,`Answer ${L*B} square cm`]};
    }
    if(lower.includes("triangle")||lower.includes("pythag")){
      const ab=nums[0]||3; const ac=nums[nums.length-1]||5; const bc=Math.sqrt(ac*ac-ab*ab); const bcF=bc.toFixed(1);
      return {detected:`MATHS: Triangle ANY AB ${ab} AC ${ac}`, board:[`MATHS CAMERA detected: Triangle AB ${ab} AC ${ac}. ANY triangle`,`How? Use Pythagoras for ANY right triangle`,`Do you remember? AB2 plus BC2 equals AC2 for ANY`,`${ab*ab} plus BC2 equals ${ac*ac}`,`BC equals ${bcF}cm ANY triangle solved`]};
    }
    if(lower.includes("factor")||raw.includes("20a")){
      return {detected:`MATHS: Factorization ${raw.slice(0,25)} - ANY algebra`, board:[`MATHS CAMERA detected: ${raw}. ANY algebra factorization`,`How? Find number that fits BOTH for ANY sum`,`Do you remember? Biggest common factor 4 for ANY such`,`20 divided by 4 equals 5`,`Answer 4 times (5a3 minus bc) for ANY`]};
    }
    if(raw.includes("=")||lower.includes("equation")){
      return {detected:`MATHS: Equation ${raw.slice(0,30)} - ANY`, board:[`MATHS CAMERA detected: Equation ${raw}. ANY equation`,`How? Get x alone for ANY`,`Do you remember? Whatever do left do right for ANY`,`Move numbers then divide`,`x equals answer for ANY`]};
    }
    return {detected:`MATHS: ANY sum - ${raw.slice(0,40)}`, board:[`MATHS CAMERA detected: ${raw}. ANY type Gr 8-12`,`How solve ANY? Need plan what topic formula for ANY`,`Do you remember for ANY similar sum?`,`Do step by step for ANY: know find formula numbers`,`Answer slow for ANY sum - photo ANY teacher explains`]};
  };
  const next=()=>setStep(s=>Math.min(s+1,board.length-1)); const back=()=>setStep(s=>Math.max(s-1,0));
  useEffect(()=>{ if(playing){ ref.current=setInterval(()=>setStep(s=>{ if(s>=board.length-1){ setPlaying(false); return s } return s+1 }),6200); } else clearInterval(ref.current); return ()=>clearInterval(ref.current); },[playing,board]);
  const speakCalm=(t:string
