import PieChartBox from "@/components/charts/pieCartBox/PieChartBox";
// import ChartBox from "@/components/charts/chartBox/ChartBox";
// import BarChartBox from "@/components/charts/barChartBox/BarChartBox";
import BigChartBox from "@/components/charts/bigChartBox/BigChartBox";
// import { barChartBoxRevenue } from "@/data/barChartBoxData";
// import { chartBoxRevenue, chartBoxPortfolioValue } from "@/data/chartBoxData";

import "./portfolio.scss";
import PortfolioTable from "@/components/portfolio/PortfolioTable";
import { getPortfolioTransactions } from "@/lib/data";

export const metadata = {
  title: "Portfolio",
  description: "Portfolio page",
};

const pieChart = (stocks, totalValue) => {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return stocks.map((stock, index) => ({
    name: stock.ticker,
    value: parseFloat(
      ((100 * stock.totalShares * stock.currentPrice) / totalValue).toFixed(2)
    ),
    color: colors[index % colors.length],
  }));
};

const PortfolioPage = async () => {
  const stocksArr = await getPortfolioTransactions();

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
          <PieChartBox data={pieChart(stocksArr, totals.totalValue)} />
        </div>
        <div className="box box7">
          <BigChartBox stocks={stocksArr} />
        </div>
        {/* <div className="box box2">
          <ChartBox {...chartBoxPortfolioValue} />
        </div> */}

        {/* <div className="box box9">
          <BarChartBox {...barChartBoxRevenue} />
        </div> */}
      </div>
      <div className="box10">
        <PortfolioTable stocks={stocksArr} />
      </div>
    </div>
  );
};

export default PortfolioPage;

{
  /* <div className="box box2">
          <ChartBox
            {...chartBoxPerformance(totals.totalValue, totals.totalInvestment)}
          />
        </div> */
}

// const chartBoxPerformance = (totalValue, totalInvestment) => {
//   return {
//     color: "teal",
//     icon: "/revenueIcon.svg",
//     title: "Total Holdings",
//     number: totalValue,
//     dataKey: "totalValue",
//     percentage: (100 * (totalValue - totalInvestment)) / totalInvestment,
//     //continue here. should show the Total Holdings for each day
//     chartData: [
//       { name: "Sun", totalValue: 400 },
//       { name: "Mon", totalValue: 600 },
//       { name: "Tue", totalValue: 500 },
//       { name: "Wed", totalValue: 700 },
//       { name: "Thu", totalValue: 400 },
//       { name: "Fri", totalValue: 500 },
//       { name: "Sat", totalValue: 450 },
//     ],
//   };
// };
