import Agent from "@/components/agent/Agent";
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

// This function fetches agent data or just the ids of agents if you're not fetching all data
export async function generateStaticParams() {
  const agents = await app.service("agent").find({
    query: {
      name: "find",
    },
  });

  // Generate an array of params containing all agentIds
  return agents.map((agent) => ({
    agentId: agent.id.toString(), // ensure this is a string for dynamic routing
  }));
}

const AgentPage = ({ params }) => {
  const { agentId } = params;
  return <Agent agentId={agentId} />;
};

export default AgentPage;
