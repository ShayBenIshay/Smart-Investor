"use client";
import { useState, useEffect } from "react";
import PieChartBox from "@/components/portfolio/charts/pieCartBox/PieChartBox";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import PortfolioTable from "@/components/portfolio/portfolioTable/PortfolioTable";

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

const PortfolioComponent = () => {
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user: currentUser } = await app.authenticate();
        if (currentUser) {
          const tot = await app.service("portfolio").find({
            query: {
              name: "calculate",
              userId: currentUser._id,
            },
          });
          setTotals(tot);
        } else {
          setTotals(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!totals) {
    return <div>No data available</div>;
  }

  let cashPercentage = 100;
  let i = 0;
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
  const pieDataArr = Object.entries(totals).map(([ticker, value]) => {
    cashPercentage -= value.percentage;
    return {
      name: ticker,
      value: parseFloat(value.percentage.toFixed(2)),
      color: colors[i++ % colors.length],
    };
  });
  pieDataArr.push({
    name: "cash",
    value: parseFloat(cashPercentage.toFixed(2)),
    color: colors[i++ % colors.length],
  });

  const rows = Object.values(totals)
    .map((item) => ({
      ticker: item.ticker,
      avgBuy: item.avgBuy.toFixed(2),
      totalSpent: item.totalSpent?.toFixed(2),
      position: item.position,
      unrealizedPL: item.unrealizedPL?.toFixed(2),
      currentPrice: item.currentPrice?.toFixed(2),
      currentValue: item.currentValue?.toFixed(2),
      percentage: item.percentage?.toFixed(2),
      change: item.change?.toFixed(2),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const pieDataSorted = pieDataArr.sort((a, b) => b.value - a.value);

  return (
    <div>
      <div className="graphs">
        <div className="box box4">
          <PieChartBox data={pieDataSorted} />
        </div>
        {/* <div className="box box7">
      <BigChartBox colors={colors} stocks={totalValuesData} />
    </div> */}
      </div>
      <div className="box10">
        <PortfolioTable rows={rows} />
      </div>
    </div>
  );
};

export default PortfolioComponent;
