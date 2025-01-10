"use client";
import { useState, useEffect } from "react";
import { useFeathers } from "@/services/feathers";
import AgentPortfolio from "@/components/agent/agentPortfolio/AgentPortfolio";
import AgentTransactions from "@/components/agent/agentTransactions/AgentTransactions";

const Agent = ({ agentId }) => {
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const app = useFeathers();

  useEffect(() => {
    const getAgent = async () => {
      try {
        setIsLoading(true);
        const agentResponse = await app.service("agent").find({
          query: { name: "find", agentId: agentId },
        });
        setAgent(agentResponse);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching agent:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getAgent();
  }, [agentId, app]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!agent) return <div>No agent found</div>;

  return (
    <div>
      <div>
        <h2>Details page of: "{agent.name} page"</h2>
        <p>
          here you can see the agents Portfolio, Trades, and Tweets he posted
        </p>
        {/* <p>Agent Created at: {agent.createdAt}</p> */}
        <p>Agent Cash: {agent.cash}</p>
      </div>
      <AgentTransactions agentId={agentId} />
      <AgentPortfolio agentId={agentId} />
    </div>
  );
};

export default Agent;
