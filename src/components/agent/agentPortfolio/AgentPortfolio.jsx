"use client";
import { useState, useEffect } from "react";
import PieChartBox from "@/components/portfolio/charts/pieCartBox/PieChartBox";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import { getLastTradingDate } from "@/lib/utils";
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

const calculateAgentTotals = async (transactions, cash = 10000) => {
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
      const date = getLastTradingDate();
      let currentPrice;
      try {
        const queryResponse = await app.service("cache").find({
          query: { ticker, date },
        });
        currentPrice = queryResponse.closePrice || null;
      } catch (error) {
        currentPrice = null;
      }
      if (!currentPrice) {
        //use previous close instead
        const queryResponse = await app.service("throttle").find({
          query: {
            name: "prev",
            ticker,
            priority: "user",
          },
        });
        const { close: closePrice } = queryResponse[0];

        await app.service("cache").create({
          ticker,
          date,
          closePrice,
        });
        currentPrice = closePrice;
      }
      calcTotals[ticker].currentPrice = currentPrice;
      calcTotals[ticker].change = currentPrice - calcTotals[ticker].avgBuy;
      calcTotals[ticker].currentValue =
        currentPrice * calcTotals[ticker].position;
      totalValue += calcTotals[ticker].currentValue || 0;
      calcTotals[ticker].unrealizedPL =
        calcTotals[ticker].currentValue - calcTotals[ticker].totalSpent;
    } catch (error) {
      console.log(`Failed to fetch price for ${ticker}`);
      calcTotals[ticker].currentPrice = null;
    }
  }

  for (const ticker of Object.keys(calcTotals)) {
    calcTotals[ticker].percentage =
      (calcTotals[ticker].currentValue / totalValue) * 100;
  }
  return calcTotals;
};

const AgentPortfolio = () => {
  const [agentTotals, setAgentTotals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user: currentUser } = await app.authenticate();
        if (currentUser) {
          const transactionsResponse = await app.service("transactions").find({
            query: { userId: currentUser._id },
          });
          const agentTransactions = transactionsResponse.data.filter(
            (transaction) => Object.keys(transaction.agentId).length > 0
          );

          const portfolioResponse = await app.service("portfolio").find({
            query: { userId: currentUser._id },
          });
          const filteredPortfolio = portfolioResponse.data.filter(
            (portfolio) => Object.keys(portfolio.agentId).length > 0
          );
          const portfolio = filteredPortfolio[0];
          const agentTotals = await calculateAgentTotals(
            agentTransactions,
            portfolio.cash
          );
          setAgentTotals(agentTotals);
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

  //change this so if something is missing in totals (api threshold limitation) it will rerun the calculation after a minute.
  if (!agentTotals) {
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
  const pieDataArr = Object.entries(agentTotals).map(([ticker, value]) => {
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
  const rows = Object.values(agentTotals)
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

export default AgentPortfolio;
