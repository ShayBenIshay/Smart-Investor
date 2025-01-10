"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useFeathers } from "@/services/feathers";
import PieChartBox from "@/components/portfolio/charts/pieCartBox/PieChartBox";
import { CHART_COLORS } from "@/config/constants";
import PortfolioTable from "@/components/portfolio/portfolioTable/PortfolioTable";
// import Wallet from "@/components/portfolio/wallet/Wallet";
import "./agentPortfolio.scss";

const AgentPortfolio = ({ agentId }) => {
  const [agentTotals, setAgentTotals] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const app = useFeathers();

  const fetchPortfolioData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("agentId", agentId);
      const [portfolioData, portfolioResponse] = await Promise.all([
        app.service("agent").find({
          query: {
            name: "calculate",
            agentId: agentId,
          },
        }),
        app.service("agent-portfolio").find({
          query: { agentId: agentId },
        }),
      ]);
      setAgentTotals(portfolioData);
      setPortfolio(portfolioResponse.data[0]);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [agentId, app]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const pieData = useMemo(() => {
    if (!agentTotals) return [];

    let cashPercentage = 100;
    const data = Object.entries(agentTotals).map(([ticker, value], index) => {
      console.log("value", value);
      cashPercentage -= value.percentage;
      return {
        name: ticker,
        value: parseFloat(value.percentage.toFixed(2)),
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    data.push({
      name: "cash",
      value: parseFloat(cashPercentage.toFixed(2)),
      color: CHART_COLORS[data.length % CHART_COLORS.length],
    });

    return data.sort((a, b) => b.value - a.value);
  }, [agentTotals]);

  const rows = useMemo(() => {
    if (!agentTotals) return [];

    return Object.values(agentTotals)
      .map((item) => ({
        ticker: item.ticker,
        avgBuy: item.avgBuy.toFixed(2),
        totalSpent: item.totalSpent?.toFixed(2),
        position: item.position,
        unrealizedPL: item.unrealizedPL?.toFixed(2),
        currentPrice: item.currentPrice?.toFixed(2),
        currentValue: item.currentValue?.toFixed(2),
        percentage: item.percentage?.toFixed(2),
        change: item.change?.toFixed(2),
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [agentTotals]);

  const handleWalletUpdate = useCallback(
    (newCashAmount) => {
      if (!portfolio || !agentTotals) return;

      setPortfolio((prev) => ({
        ...prev,
        cash: newCashAmount,
      }));

      const totalValue =
        Object.values(agentTotals).reduce(
          (sum, item) => sum + item.currentValue,
          0
        ) + newCashAmount;

      const updatedTotals = Object.entries(agentTotals).reduce(
        (acc, [ticker, item]) => {
          acc[ticker] = {
            ...item,
            percentage: (item.currentValue / totalValue) * 100,
          };
          return acc;
        },
        {}
      );

      setAgentTotals(updatedTotals);
    },
    [portfolio, agentTotals]
  );

  if (loading) {
    return (
      <div className="portfolio-container">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-container">
        <div className="error-container">
          <h1>Portfolio</h1>
          <p className="error-message">Error loading portfolio: {error}</p>
          <button onClick={fetchPortfolioData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!agentTotals && !portfolio) {
    return (
      <div className="portfolio-container">
        <div className="empty-state">
          <h1>Portfolio</h1>
          <p>No portfolio data available</p>
          <button onClick={fetchPortfolioData} className="refresh-button">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1>Agent's Holdings</h1>
      </div>
      <div className="portfolio-content">
        <div className="top-section">
          <div className="graphs">
            <div className="box4">
              {agentTotals && <PieChartBox data={pieData} showTitle={false} />}
              {!agentTotals && <p>No assets in portfolio</p>}
            </div>
          </div>
          {/* <div className="wallet-section">
            <Wallet
              liquid={portfolio?.cash || 0}
              onWalletUpdate={handleWalletUpdate}
              agentId={agentId}
            />
          </div> */}
        </div>
        <div className="table-container">
          {agentTotals && <PortfolioTable rows={rows} showTitle={false} />}
        </div>
      </div>
    </div>
  );
};

export default AgentPortfolio;
