import PieChartBox from "@/components/charts/pieCartBox/PieChartBox";
import ChartBox from "@/components/charts/chartBox/ChartBox";
import BarChartBox from "@/components/charts/barChartBox/BarChartBox";
import BigChartBox from "@/components/charts/bigChartBox/BigChartBox";
import pieChartData from "@/data/pieChartData";
import { barChartBoxRevenue } from "@/data/barChartBoxData";
import { chartBoxRevenue, chartBoxPortfolioValue } from "@/data/chartBoxData";

import "./portfolio.scss";
import { Portfolio, Transaction } from "@/lib/models";
import { aggregateTransactions } from "@/lib/action";
import { auth } from "@/auth";
import PortfolioTable from "@/components/portfolio/PortfolioTable";
import { addCurrentPrices } from "@/lib/action";
import { connectToDb } from "@/lib/utils";

export const metadata = {
  title: "Portfolio",
  description: "Portfolio page",
};

const chartBoxPerformance = (stocks) => {
  const chartBoxPerformance = {
    color: "teal",
    icon: "/revenueIcon.svg",
    title: "Performance",
    //continue here. should be unrealizedPL for a week period
    number: "$56.432",
    dataKey: "revenue",
    percentage: -12,
    chartData: [
      { name: "Sun", revenue: 400 },
      { name: "Mon", revenue: 600 },
      { name: "Tue", revenue: 500 },
      { name: "Wed", revenue: 700 },
      { name: "Thu", revenue: 400 },
      { name: "Fri", revenue: 500 },
      { name: "Sat", revenue: 450 },
    ],
  };
};

const PortfolioPage = async () => {
  const session = await auth();
  connectToDb();
  const portfolio = await Portfolio.findOne({ userId: session.user.id })
    .populate("transactions")
    .exec();
  const transactions = portfolio?.transactions;
  const stockAggregation = await aggregateTransactions(transactions);
  const stocks = await addCurrentPrices(stockAggregation);

  const stocksArr = Object.values(stocks);
  return (
    <div>
      <div className="graphs">
        <div className="box box2">
          <ChartBox {...chartBoxRevenue} />
        </div>
        <div className="box box2">
          <ChartBox {...chartBoxPortfolioValue} />
        </div>
        <div className="box box4">
          <PieChartBox data={pieChartData} />
        </div>
        <div className="box box7">
          <BigChartBox />
        </div>
        <div className="box box9">
          <BarChartBox {...barChartBoxRevenue} />
        </div>
      </div>
      <div className="box10">
        <PortfolioTable stocks={stocksArr} />
      </div>
    </div>
  );
};

export default PortfolioPage;
