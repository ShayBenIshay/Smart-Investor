import Agent from "@/components/agent/Agent";
const AgentPage = async ({ params }) => {
  console.log(params);
  const { agentId } = params;
  return (
    <Agent agentId={agentId} />
    // <div>
    //   AgentPage
    //   {/* <h1>Agent: {agentData.name}</h1>
    //   <p>ID: {agentData.id}</p>
    //   <p>Email: {agentData.email}</p>
    //   <p>Role: {agentData.role}</p> */}
    // </div>
  );
};

export default AgentPage;
