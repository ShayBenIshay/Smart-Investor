import PieChartBox from "@/components/portfolio/charts/pieCartBox/PieChartBox";
import BigChartBox from "@/components/portfolio/charts/bigChartBox/BigChartBox";

import "./portfolio.scss";
import PortfolioTable from "@/components/portfolio/Table/PortfolioTable";
import { buildPortfolio, getWallet } from "@/lib/data";
import { auth } from "@/lib/auth";
import { getTradingDates } from "@/lib/utils";
import { getCachedPrice } from "@/lib/cache";
import enqueue from "../../lib/throttle.js";
// import { fetchPriceFromPolygon } from "@/lib/polygonApi";

export const metadata = {
  title: "Portfolio",
  description: "Portfolio page",
};

const colors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CF5",
  "#FF6666",
  "#FF5C93",
  "#00B8D9",
  "#FFC400",
  "#36B37E",
  "#AAB2BD",
  "#FCF876",
  "#B07D62",
  "#8E8CD8",
  "#FF9A76",
];

const pieChart = (wallet, stocks, totalValue) => {
  const stockData = stocks.map((stock, index) => ({
    name: stock.ticker,
    value: parseFloat(
      ((100 * stock.totalShares * stock.currentPrice) / totalValue).toFixed(2)
    ),
    color: colors[index % colors.length],
  }));

  stockData.push({
    name: "Liquid",
    value: parseFloat(((100 * wallet) / totalValue).toFixed(2)),
    color: colors[stockData.length % colors.length],
  });

  return stockData;
};

export const dynamic = "force-dynamic";

const PortfolioPage = async () => {
  const session = await auth();
  const wallet = await getWallet();
  const stocksArr = await buildPortfolio(session);

  const totals = stocksArr.reduce(
    (acc, stock) => {
      acc.totalValue += stock.currentPrice * stock.totalShares;
      acc.totalInvestment += stock.totalInvestment;
      return acc;
    },
    { totalValue: 0, totalInvestment: 0 }
  );

  const tradingDates = getTradingDates(7);

  const totalValuesData = [];

  for (const date of tradingDates) {
    const dateEntry = { name: date.split("-").reverse().slice(0, 2).join("/") };

    for (const tickerInfo of stocksArr) {
      const { ticker, totalShares } = tickerInfo;

      let dateValue = await getCachedPrice(ticker, date);

      if (!dateValue) {
        try {
          const data = await enqueue(ticker, date, "user");
          dateValue = data?.close;
        } catch (error) {
          console.error("Failed to add API call to queue:", error);
        }
      }
      if (dateValue !== undefined) {
        dateEntry[ticker] = (totalShares * dateValue).toFixed(2);
      }
    }

    totalValuesData.push(dateEntry);
  }

  const firstEntry = totalValuesData[0];
  const { name, ...tickers } = firstEntry;

  const sortedKeys = Object.keys(tickers).sort(
    (a, b) => tickers[b] - tickers[a]
  );

  for (let i = 0; i < totalValuesData.length; i++) {
    const entry = totalValuesData[i];

    const orderedEntry = { name: entry.name };

    for (const key of sortedKeys) {
      if (entry[key] !== undefined) {
        orderedEntry[key] = entry[key];
      }
    }

    totalValuesData[i] = orderedEntry;
  }

  return (
    <div>
      <div className="graphs">
        <div className="box box4">
          <PieChartBox
            data={pieChart(wallet, stocksArr, totals.totalValue + wallet)}
          />
        </div>
        <div className="box box7">
          <BigChartBox colors={colors} stocks={totalValuesData} />
        </div>
      </div>
      <div className="box10">
        <PortfolioTable stocks={stocksArr} />
      </div>
    </div>
  );
};

export default PortfolioPage;
