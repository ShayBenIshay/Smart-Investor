import PieChartBox from "@/components/charts/pieCartBox/PieChartBox";
import BigChartBox from "@/components/charts/bigChartBox/BigChartBox";

import "./portfolio.scss";
import PortfolioTable from "@/components/portfolio/PortfolioTable";
import { buildPortfolio, getWallet } from "@/lib/data";
import { auth } from "@/auth";

export const metadata = {
  title: "Portfolio",
  description: "Portfolio page",
};

const pieChart = (wallet, stocks, totalValue) => {
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

  return (
    <div>
      <div className="graphs">
        <div className="box box4">
          <PieChartBox
            data={pieChart(wallet, stocksArr, totals.totalValue + wallet)}
          />
        </div>
        <div className="box box7">
          <BigChartBox stocks={stocksArr} />
        </div>
      </div>
      <div className="box10">
        <PortfolioTable stocks={stocksArr} />
      </div>
    </div>
  );
};

export default PortfolioPage;
