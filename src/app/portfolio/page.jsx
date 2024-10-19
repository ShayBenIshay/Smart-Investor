import PieChartBox from "@/components/charts/pieCartBox/PieChartBox";
import ChartBox from "@/components/charts/chartBox/ChartBox";
import BarChartBox from "@/components/charts/barChartBox/BarChartBox";
import BigChartBox from "@/components/charts/bigChartBox/BigChartBox";
import pieChartData from "@/data/pieChartData";
import { barChartBoxRevenue } from "@/data/barChartBoxData";
import { chartBoxRevenue, chartBoxPortfolioValue } from "@/data/chartBoxData";

import "./portfolio.scss";

export const metadata = {
  title: "Portfolio",
  description: "Portfolio page",
};

const PortfolioPage = () => {
  return (
    <div className="home">
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
  );
};

export default PortfolioPage;
