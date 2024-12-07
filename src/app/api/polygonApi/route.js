import { NextResponse } from "next/server";
import enqueue from "../../../lib/throttle.js";

export async function POST(req) {
  const { symbol, date, priority = "system" } = await req.json();
  if (!symbol || !date) {
    return NextResponse.json(
      { error: "Missing symbol or date." },
      { status: 400 }
    );
  }
  try {
    const data = await enqueue(symbol, date, priority);
    return NextResponse.json({ close: data?.close }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock data." },
      { status: 500 }
    );
  }
}
