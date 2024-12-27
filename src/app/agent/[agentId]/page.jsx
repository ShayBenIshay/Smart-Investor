"use client";

import Agent from "@/components/agent/Agent";

const AgentPage = ({ params }) => {
  console.log("params    params");
  console.log(params);
  const { agentId } = params;
  return <Agent agentId={agentId} />;
};

export default AgentPage;
