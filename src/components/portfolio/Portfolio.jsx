"use client";
import { useState, useEffect } from "react";
import PieChartBox from "@/components/portfolio/charts/pieCartBox/PieChartBox";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import { getLastTradingDate } from "@/lib/utils";
import PortfolioTable from "@/components/portfolio/portfolioTable/PortfolioTable";

const socket = io("http://localhost:3030");
const app = feathers();
app.configure(socketio(socket));
app.configure(authentication());

const cacheSocket = io("http://localhost:3031");
const cacheApp = feathers();
cacheApp.configure(socketio(cacheSocket));

// Helper function to calculate totals
const calculateTotals = async (transactions, cash = 10000) => {
  const calcTotals = transactions.reduce((acc, transaction) => {
    const { ticker, price, papers, operation } = transaction;

    if (!acc[ticker]) {
      acc[ticker] = {
        ticker,
        avgBuy: 0,
        totalSpent: 0,
        position: 0,
        unrealizedPL: 0,
        change: 0,
      };
    }

    if (operation === "buy") {
      acc[ticker].totalSpent += price * papers;
      acc[ticker].position += papers;
      acc[ticker].avgBuy = acc[ticker].totalSpent / acc[ticker].position;
    } else if (operation === "sell") {
      acc[ticker].position -= papers;
      acc[ticker].totalSpent -= price * papers;
      acc[ticker].avgBuy =
        acc[ticker].position > 0
          ? acc[ticker].totalSpent / acc[ticker].position
          : 0;
    }

    return acc;
  }, {});

  let totalValue = cash;

  for (const ticker of Object.keys(calcTotals)) {
    try {
      //date should be the last trading date
      const date = getLastTradingDate();
      const queryResponse = await cacheApp.service("cache").find({
        query: { ticker, date },
      });
      let currentPrice = queryResponse.closePrice || null;
      if (!currentPrice) {
        const response = await fetch("/api/polygonApi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticker, date }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        await cacheApp.service("cache").create({
          ticker,
          date,
          closePrice: result.close,
        });
        currentPrice = result.close;
      }
      calcTotals[ticker].currentPrice = currentPrice;
      calcTotals[ticker].change = currentPrice - calcTotals[ticker].avgBuy;
      calcTotals[ticker].currentValue =
        currentPrice * calcTotals[ticker].position;
      totalValue += calcTotals[ticker].currentValue || 0;
      calcTotals[ticker].unrealizedPL =
        calcTotals[ticker].currentValue - calcTotals[ticker].totalSpent;
    } catch (error) {
      console.error(`Failed to fetch price for ${ticker}:`, error);
      calcTotals[ticker].currentPrice = null;
    }
  }

  for (const ticker of Object.keys(calcTotals)) {
    calcTotals[ticker].percentage =
      (calcTotals[ticker].currentValue / totalValue) * 100;
  }
  return calcTotals;
};

const PortfolioComponent = () => {
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user: currentUser } = await app.authenticate();
        if (currentUser) {
          const transactionsResponse = await app.service("transactions").find({
            query: { userId: currentUser._id },
          });
          const transactions = transactionsResponse.data;
          const portfolioResponse = await app.service("portfolio").find({
            query: { userId: currentUser._id },
          });
          const portfolio = portfolioResponse.data[0];
          const totals = await calculateTotals(transactions, portfolio.cash);
          setTotals(totals);
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
      totalSpent: item.totalSpent.toFixed(2),
      position: item.position,
      unrealizedPL: item.unrealizedPL.toFixed(2),
      currentPrice: item.currentPrice.toFixed(2),
      currentValue: item.currentValue.toFixed(2),
      percentage: item.percentage.toFixed(2),
      change: item.change.toFixed(2),
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
