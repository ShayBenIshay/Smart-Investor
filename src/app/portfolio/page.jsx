// import PieChartBox from "@/components/portfolio/charts/pieCartBox/PieChartBox";
// import BigChartBox from "@/components/portfolio/charts/bigChartBox/BigChartBox";

// import "./portfolio.scss";
// import PortfolioTable from "@/components/portfolio/portfolioTable/PortfolioTable";
// import { getTradingDates } from "@/lib/utils";
// import enqueue from "../../lib/throttle.js";

import PortfolioComponent from "@/components/portfolio/Portfolio";

export const metadata = {
  title: "Portfolio",
  description: "Portfolio page",
};

export const dynamic = "force-dynamic";

const PortfolioPage = async () => {
  return (
    <PortfolioComponent />
    // <div>
    //   <div className="graphs">
    //     <div className="box box4">
    //       <PieChartBox />
    //     </div>
    //     {/* <div className="box box7">
    //       <BigChartBox colors={colors} stocks={totalValuesData} />
    //     </div> */}
    //   </div>
    //   {/* <div className="box10">
    //     <PortfolioTable stocks={stocksArr} />
    //   </div> */}
    // </div>
  );
};

export default PortfolioPage;

// const tradingDates = getTradingDates(7);

// const totalValuesData = [];

// for (const date of tradingDates) {
//   const dateEntry = { name: date.split("-").reverse().slice(0, 2).join("/") };

//   for (const tickerInfo of stocksArr) {
//     const { ticker, totalShares } = tickerInfo;

//     let dateValue = await getCachedPrice(ticker, date);

//     if (!dateValue) {
//       try {
//         const data = await enqueue(ticker, date, "user");
//         dateValue = data?.close;
//       } catch (error) {
//         dateValue = 0;
//       }
//     }
//     if (dateValue !== undefined) {
//       dateEntry[ticker] = (totalShares * dateValue).toFixed(2);
//     }
//   }

//   totalValuesData.push(dateEntry);
// }

// const firstEntry = totalValuesData[0];
// const { name, ...tickers } = firstEntry;

// const sortedKeys = Object.keys(tickers).sort(
//   (a, b) => tickers[b] - tickers[a]
// );

// for (let i = 0; i < totalValuesData.length; i++) {
//   const entry = totalValuesData[i];

//   const orderedEntry = { name: entry.name };

//   for (const key of sortedKeys) {
//     if (entry[key] !== undefined) {
//       orderedEntry[key] = entry[key];
//     }
//   }

//   totalValuesData[i] = orderedEntry;
// }
