"use client";
import { useState, useEffect } from "react";
import AgentPortfolio from "@/components/agent/agentPortfolio/AgentPortfolio";
import AgentTransactions from "@/components/agent/agentTransactions/AgentTransactions";
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

const handleActivate = async (agent) => {
  const { user } = await app.reAuthenticate();
  const queryResponse = await app.service("portfolio").find({
    query: {
      name: "find",
      userId: agent._id,
    },
  });
  const agentPortfolio = queryResponse.data[0];
  const cash = agentPortfolio.cash;

  try {
    const portfolioResponse = await axios.get(
      "http://127.0.0.1:5000/portfolio",
      {
        params: { cash },
      }
    );
    const portfolioJSON = portfolioResponse.data;
    const portfolioObject = portfolioJSON.map((item) => ({
      ...item,
      percentage: parseFloat(item.percentage.replace("%", "")),
      value: parseFloat(item.value.replace(/[$,]/g, "")),
    }));

    portfolioObject.forEach(async (trade) => {
      if (trade.ticker !== "Cash") {
        try {
          const tradeResponse = await axios.get("http://127.0.0.1:5000/trade", {
            params: {
              ticker: trade.ticker,
              from_date: "2024-12-16",
              to_date: "2024-12-19",
              timespan: "day",
            },
          });
          const buyObject = {
            buy: tradeResponse.data.buy,
            papers: trade.value / tradeResponse.data.buy,
            ticker: trade.ticker,
          };
          const executedAt = new Date();
          //here i should use the POST agent service (but custom not create)
          await app.service("transactions").create({
            userId: agent._id,
            ticker: buyObject.ticker,
            price: buyObject.buy,
            executedAt,
            operation: "buy",
            papers: buyObject.papers,
          });
          console.log(
            `bought ${buyObject.papers} papers of ${buyObject.ticker} for ${buyObject.buy} each `
          );
        } catch (error) {
          console.error("failed to calculate trade", error);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error.message);
  }
};

const Agent = ({ agentId }) => {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const getAgent = async () => {
      const { user } = await app.authenticate();
      if (user) {
        const agentResponse = await app.service("agent").get(agentId);
        setAgent(agentResponse);
      } else {
        setAgent(null);
      }
    };

    getAgent();
  }, []);

  if (agent) {
    return (
      <div>
        <div>
          <h2>{` ${agent.name} page`}</h2>
          <p>
            here you can see the agents Portfolio, Trades, and Tweets he posted
          </p>
          <button type="button" onClick={() => handleActivate(agent)}>
            Manually Activate Agent
          </button>
        </div>
        <AgentTransactions agentId={agentId} />
        <AgentPortfolio agentId={agentId} />
      </div>
    );
  }
};

export default Agent;
