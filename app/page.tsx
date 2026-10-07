"use client";
import { useState } from "react";
const DATA:any={
Grade10:{Algebra:{notes:"CAPS Gr10: Exponents, equations, factorization",quiz:[{q:"Solve 2x+3=11",a:"4"}]},Geometry:{notes:"Triangles, congruence, Pythagoras",quiz:[{q:"Hypotenuse 3,4?",a:"5"}]}},
Grade11:{Algebra:{notes:"CAPS Gr11: Quadratics",quiz:[{q:"Discriminant x²-4x+4",a:"0"}]},Trig:{notes:"Trig functions",quiz:[{q:"sin30=?",a:"0.5"}]}},
Grade12:{Calculus:{notes:"CAPS Gr12: Derivatives",quiz:[{q:"Derivative x³",a:"3x²"}]},Stats:{notes:"Regression",quiz:[{q:"Mean 2,4,6",a:"4"}]}}
};
export default function Page(){
const [grade,setGrade]=useState("Grade10");
const [topic,setTopic]=useState("Algebra");
const [paid,setPaid]=useState(false);
const [ans,setAns]=useState("");
const [msg,setMsg]=useState("");
const d=DATA[grade]?.[topic];
async function pay(){
setMsg("Opening Paystack R150...");
const res=await fetch("/api/pay",{method:"POST"});
const data=await res.json();
if(data.url) window.location.href=data.url; else setMsg("Error "+JSON.stringify(data));
}
return(
<div style={{maxWidth:800,margin:"20px auto",padding:20,fontFamily:"Arial"}}>
<h1>Caps Maths Buddy - R150 Access</h1>
<p>Full CAPS Gr10-12. One payment R150 unlocks all.</p>
<div style={{display:"flex",gap:10,marginBottom:20}}>
<select value={grade} onChange={e=>setGrade(e.target.value)}>{Object.keys(DATA).map(g=><option key={g}>{g}</option>)}</select>
<select value={topic} onChange={e=>setTopic(e.target
