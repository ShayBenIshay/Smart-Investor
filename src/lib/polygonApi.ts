export const fetchPriceFromPolygon = async (date: Date, symbol: string) => {
  // console.log("date date date date date date date date ");
  // console.log(date);
  const formattedDate = date.toISOString().split("T")[0];
  // console.log(formattedDate);

  // const transformDate = (dateString)=>{
  //   const parts = dateString.split("/");
  //   const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  //   return formattedDate;
  // }
  console.log(process.env.POLYGON_API_KEY);
  const apiKey = "HxBlqtppFyBChxucc0uyVkelkpyw8XuC";
  // console.log(
  //   `https://api.polygon.io/v1/open-close/${symbol}/${formattedDate}?apiKey=${apiKey}`
  // );
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
