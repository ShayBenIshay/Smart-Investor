"use client";

import { useEffect, useState } from "react";
import { useFeathers } from "@/services/feathers";
import Agent from "@/components/agent/Agent";
import { useRouter } from "next/navigation";

export default function AgentPage({ params }) {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const app = useFeathers();
  const router = useRouter();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        // First check authentication
        try {
          await app.reAuthenticate();
        } catch (authError) {
          console.error("Authentication failed:", authError);
          router.push("/login"); // Redirect to login if not authenticated
          return;
        }

        // Then fetch the agent
        const result = await app.service("agent").get(params.agentId);
        setAgent(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [params.agentId, app, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!agent) return <div>Agent not found</div>;

  return <Agent agent={agent} />;
}
