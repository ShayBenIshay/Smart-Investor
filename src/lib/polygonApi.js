"use server";

export const fetchPriceFromPolygon = async (date, symbol) => {
  if (!date) {
    console.error("Invalid date provided");
    return null;
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    console.error("Invalid Date object");
    return null;
  }
  const formattedDate = date?.toISOString().split("T")[0];

  const apiKey = process.env.POLYGON_API_KEY;
  console.log(apiKey);

  try {
    const response = await fetch(
      `https://api.polygon.io/v1/open-close/${symbol}/${formattedDate}?apiKey=${apiKey}`
    );
    const data = await response.json();
    if (data) {
      return data.close;
    }
  } catch (error) {
    console.error("Error fetching price:", error);
  }
  return null;
};
