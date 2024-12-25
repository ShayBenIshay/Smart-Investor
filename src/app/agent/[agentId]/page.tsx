import Agent from "@/components/agent/Agent";
const AgentPage = async ({ params }) => {
  console.log(params);
  const { agentId } = params;
  return <Agent agentId={agentId} />;
};

export default AgentPage;
