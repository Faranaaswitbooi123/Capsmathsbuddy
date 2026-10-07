import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest){
  const { email, grade } = await req.json();
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method:"POST",
    headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET}`, "Content-Type":"application/json"},
    body: JSON.stringify({
      email: email || "learner@786caps.co.za",
      amount: 4900,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/success?grade=${grade||8}`,
      metadata:{grade}
    })
  });
  const data = await res.json();
  return NextResponse.json(data);
}
