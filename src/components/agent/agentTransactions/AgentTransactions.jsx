"use client";

import TransactionsTable from "@/components/transactions/transactionsTable/TransactionsTable";
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

const AgentTransactions = () => {
  const [agentTransactions, setAgentTransactions] = useState(null);

  useEffect(() => {
    const getAgentTransactions = async () => {
      const { user } = await app.authenticate();
      if (user) {
        const queryResponse = await app.service("transactions").find({
          query: {
            userId: user._id,
          },
        });
        const agentTransactions = queryResponse.data.filter(
          (transaction) => Object.keys(transaction.agentId).length > 0
        );
        setAgentTransactions(agentTransactions);
      } else {
        setAgentTransactions(null);
      }
    };

    getAgentTransactions();
  }, []);

  if (agentTransactions) {
    return (
      <div className="transactions">
        <div className="info">
          <h1>Agent Transactions</h1>
        </div>
        <TransactionsTable transactions={agentTransactions} />
      </div>
    );
  }
};

export default AgentTransactions;
