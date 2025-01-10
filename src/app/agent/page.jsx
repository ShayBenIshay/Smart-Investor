import Agent from "@/components/agent/Agent";

export const metadata = {
  title: "Agent Page",
  description:
    "This is the page of Shay's first personal trading market agent. here you can see the agent's performance and transactions.",
};

const AgentPage = () => {
  return <Agent agentId="6780f4c4500298ca8476c548" />;
};

export default AgentPage;
