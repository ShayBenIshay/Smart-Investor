"use client";

import { useState, useEffect } from "react";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import authentication from "@feathersjs/authentication-client";

let app;
try {
  const socket = io(process.env.NEXT_PUBLIC_REST_SERVICES_CLIENT_URL);
  app = feathers();
  app.configure(socketio(socket));
  app.configure(authentication());
} catch (error) {
  console.error("failed to connect to Smart Investor Services");
}

const dateToStr = (dateNumber) => {
  const formatString = new Date(parseInt(dateNumber.$date.$numberLong, 10))
    .toISOString()
    .split("T")[0];
  return formatString;
};

const handleAgent = (agentId) => {
  window.location.href = `/agent/${agentId}`;
};

const handleCreate = async () => {
  window.location.href = "/agent/create";
};

const Agents = () => {
  const [agents, setAgents] = useState(null);

  useEffect(() => {
    const getAgents = async () => {
      const { user } = await app.authenticate();
      if (user) {
        const queryResponse = await app.service("agent").find({
          query: {
            name: "find",
            userId: user._id,
          },
        });
        setAgents(queryResponse);
      } else {
        setAgents(null);
      }
    };
    getAgents();
  }, []);
  if (agents) {
    return (
      <div>
        <button type="button" onClick={handleCreate}>
          Create New Agent
        </button>
        {agents.map((agent) => {
          const createdAt = dateToStr(agent.createdAt);
          return (
            <button onClick={() => handleAgent(agent._id)}>
              <p>Name: {agent.name}</p>
              <p>Timespan: {agent.timespan}</p>
              <p>Preference: {agent.preferences}</p>
              <p>Date of creation: {createdAt}</p>
            </button>
          );
        })}
      </div>
    );
  }
};
export default Agents;
