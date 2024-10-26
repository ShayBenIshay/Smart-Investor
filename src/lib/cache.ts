"use server";

import { PriceCache } from "./models";
import { connectToDb } from "./utils";

export async function getCachedPrice(
  ticker: string,
  date: String
): Promise<number | null> {
  try {
    const cachedPrice = await PriceCache.findOne({ ticker, fetchedAt: date });
    return cachedPrice ? cachedPrice.lastClosePrice : null;
  } catch (error) {
    console.error(`Error fetching cached price for ${ticker}:`, error);
    return null;
  }
}

export async function savePriceToCache(
  ticker: string,
  lastClosePrice: number,
  date: string
) {
  try {
    connectToDb();
    const newCache = new PriceCache({
      ticker,
      lastClosePrice,
      fetchedAt: date,
    });
    await newCache.save();
    console.log("newCache", newCache);
  } catch (error) {
    console.error(`Error saving price to cache for ${ticker}:`, error);
  }
}
