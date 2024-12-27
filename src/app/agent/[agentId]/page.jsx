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

export const getStaticPaths = async () => {
  const agents = await app.service("agent").find({
    query: {
      name: "find",
    },
  });

  const paths = agents.map((agent) => ({
    params: { agentId: agent.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export async function getStaticProps({ params }) {
  const { agentId } = params;
  return {
    props: {
      agentId,
    },
  };
}

const AgentPage = async ({ params }) => {
  const { agentId } = params;
  return <Agent agentId={agentId} />;
};

export default AgentPage;
