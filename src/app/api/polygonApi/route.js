import { NextResponse } from "next/server";
import enqueue from "../../../lib/throttle.js";

export async function POST(req) {
  console.log("Executing /api/polygonApi route");
  const { ticker, date, priority = "system" } = await req.json();
  console.log(`ticker: ${ticker} date: ${date} priority: ${priority}`);
  if (!ticker || !date) {
    return NextResponse.json(
      { error: "Missing ticker or date." },
      { status: 400 }
    );
  }
  try {
    const data = await enqueue(ticker, date, priority);
    console.log(data);
    return NextResponse.json({ close: data?.close }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock data." },
      { status: 500 }
    );
  }
}
