"use server";

import { PriceCache } from "./models";
import { connectToDb } from "./utils";

export async function getCachedPrice(
  ticker: string,
  date: String
): Promise<number | null> {
  try {
    const cachedDoc = await PriceCache.findOne({
      ticker,
    });
    const cachedPrice = cachedDoc?.prices?.find((price) => price.date === date);
    return cachedPrice ? cachedPrice.closePrice : null;
  } catch (error) {
    console.error(`Error fetching cached price for ${ticker}:`, error);
    return null;
  }
}

export async function savePriceToCache(
  ticker: string,
  closePrice: number,
  date: string
) {
  try {
    connectToDb();

    const existingCache = await PriceCache.findOne({ ticker });

    const isDateExists = existingCache?.prices?.find(
      (cache) => cache.date === date
    );

    if (isDateExists) {
      console.log(
        `Price for ${ticker} on ${date} already exists. No changes made.`
      );
      return;
    }

    const updatedCache = await PriceCache.findOneAndUpdate(
      { ticker },
      {
        $push: {
          prices: { date: date, closePrice: closePrice },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log("updatedCache", updatedCache);
  } catch (error) {
    console.error(`Error saving price to cache for ${ticker}:`, error);
  }
}
