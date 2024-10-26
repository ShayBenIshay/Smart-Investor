import { NextResponse } from "next/server";
import { addToQueue } from "../../../lib/PolygonCallsQueue";
import { savePriceToCache } from "../../../lib/cache";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const date = searchParams.get("date");
  const isUserCall = searchParams.get("user") === "true";
  const apiKey = process.env.POLYGON_API_KEY;
  if (!symbol || !date) {
    return NextResponse.json(
      { error: "Missing symbol or date." },
      { status: 400 }
    );
  }

  const apiCall = async () => {
    const response = await fetch(
      `https://api.polygon.io/v1/open-close/${symbol}/${date}?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.close;
  };

  try {
    const priority = isUserCall ? "high" : "low";
    const closePrice = await addToQueue(apiCall, priority);

    await savePriceToCache(symbol, closePrice, date);

    return NextResponse.json({ close: closePrice }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock data." },
      { status: 500 }
    );
  }
}
