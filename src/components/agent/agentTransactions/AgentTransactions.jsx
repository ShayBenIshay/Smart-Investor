"use client";

import { useState, useEffect, useCallback } from "react";
import { useFeathers } from "@/services/feathers";
import AgentTransactionsTable from "./agentTransactionsTable/AgentTransactionsTable";
import "./agentTransactions.scss";

const AgentTransactions = ({ agentId }) => {
  const [agentTransactions, setAgentTransactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const app = useFeathers();

  const fetchAgentTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryResponse = await app.service("agent-transactions").find({
        query: {
          agentId: agentId,
        },
      });
      setAgentTransactions(queryResponse.data || []);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching agent transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [app, agentId]);

  useEffect(() => {
    fetchAgentTransactions();
  }, [fetchAgentTransactions]);

  if (loading) {
    return (
      <div className="transactions loading">
        <div className="loading-spinner" />
        <p>Loading agent transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transactions error">
        <h1>Agent Transactions</h1>
        <p className="error-message">Error: {error}</p>
        <button onClick={fetchAgentTransactions} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!agentTransactions || agentTransactions.length === 0) {
    return (
      <div className="agent-transactions empty">
        <h1>Agent Transactions</h1>
        <p>No transactions found for this agent</p>
      </div>
    );
  }

  return (
    <div className="agent-transactions">
      <div className="info">
        <h1>Agent Transactions</h1>
      </div>
      <div className="table-container">
        <AgentTransactionsTable
          transactions={agentTransactions}
          onRefresh={fetchAgentTransactions}
        />
      </div>
    </div>
  );
};

export default AgentTransactions;
