"use client";

import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";
import axios from "axios";

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

const AgentLayout = ({ children }) => {
  const handleCreate = async () => {
    window.location.href = "/agent/create";
  };
  const handlePortfolio = async () => {
    window.location.href = "/agent/portfolio";
  };
  const handleTransactions = async () => {
    window.location.href = "/agent/transactions";
  };
  const handleTweets = async () => {
    window.location.href = "/agent/tweets";
  };
  const handleActivate = async () => {
    const { user } = await app.reAuthenticate();
    const queryResponse = await app.service("portfolio").find({
      query: {
        userId: user._id,
      },
    });
    const agentsPortfolio = queryResponse.data.filter(
      (portfolio) =>
        portfolio.agentId && Object.keys(portfolio.agentId).length > 0
    );
    const agentPortfolio = agentsPortfolio[0];
    const cash = agentPortfolio.cash;

    try {
      const portfolioResponse = await axios.get(
        "http://127.0.0.1:5000/portfolio",
        {
          params: { cash },
        }
      );
      const portfolioJSON = JSON.parse(portfolioResponse.data);
      const portfolioObject = portfolioJSON.map((item) => ({
        ...item,
        percentage: parseFloat(item.percentage.replace("%", "")),
        value: parseFloat(item.value.replace(/[$,]/g, "")),
      }));

      portfolioObject.forEach(async (trade) => {
        if (trade.ticker !== "Cash") {
          try {
            const tradeResponse = await axios.get(
              "http://127.0.0.1:5000/trade",
              {
                params: {
                  ticker: trade.ticker,
                  count: 10,
                  timespan: "day",
                },
              }
            );
            const buyObject = {
              buy: tradeResponse.data.buy,
              papers: trade.value / tradeResponse.data.buy,
              ticker: trade.ticker,
            };
            console.log(buyObject);
            await app.service("transactions").create({
              ticker: buyObject.ticker,
              price: buyObject.buy,
              executedAt: "2024-12-20",
              operation: "buy",
              papers: buyObject.papers,
              agentId: agentPortfolio.agentId,
            });
            console.log(
              `bought ${buyObject.papers} papers of ${buyObject.ticker} for ${buyObject.buy} each `
            );
          } catch (error) {
            consonle.error("failed to calculate trade", error);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching portfolio:", error.message);
    }
  };

  return (
    <div>
      <nav
        style={{ background: "#f4f4f4", padding: "1rem", marginBottom: "1rem" }}
      >
        <div>
          <button type="button" onClick={handleActivate}>
            Manually Activate Agent
          </button>
          <button type="button" onClick={handleCreate}>
            Create Agent
          </button>
          <button type="button" onClick={handlePortfolio}>
            Agent's Portfolio
          </button>
          <button type="button" onClick={handleTransactions}>
            Agent's Transactions
          </button>
          <button type="button" onClick={handleTweets}>
            Agent's Tweets
          </button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default AgentLayout;
