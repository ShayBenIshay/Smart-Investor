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
    let orders = [];

    await Promise.all(
      portfolioObject.map(async (trade) => {
        if (trade.ticker !== "Cash") {
          try {
            const tradeResponse = await axios.get(
              "http://127.0.0.1:5000/trade",
              {
                params: {
                  ticker: trade.ticker,
                  from_date: "2024-09-16",
                  to_date: "2024-12-27",
                  timespan: "day",
                },
              }
            );
            const orderObject = {
              buy: tradeResponse.data.buy,
              papers: trade.value / tradeResponse.data.buy,
              ticker: trade.ticker,
            };
            orders.push(orderObject);
          } catch (error) {
            console.error(
              "Failed to calculate trade for ticker:",
              trade.ticker,
              error
            );
          }
        }
      })
    );
    console.log("this is the orders the Agent is about to do");
    console.log(orders);
    console.log("executing orders");
    console.log(orders);
    const response = await app
      .service("agent")
      .create({ func: "trades", agentId: agent._id, orders });
    console.log(response);
    window.location.reload();
  } catch (error) {
    console.error("Error fetching portfolio:", error.message);
  }
};

const Agent = ({ agentId }) => {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const getAgent = async () => {
      const { user } = await app.authenticate();
      const agentResponse = await app.service("agent").get(agentId);
      console.log(agentResponse.userId);
      console.log(agentResponse);
      console.log(user._id);
      if (user._id === agentResponse.userId) {
        setAgent(agentResponse);
      } else {
        setAgent(null);
      }
    };

    getAgent();
  }, [agentId]);

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
