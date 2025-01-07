"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import PieChartBox from "@/components/portfolio/charts/pieCartBox/PieChartBox";
import PortfolioTable from "@/components/portfolio/portfolioTable/PortfolioTable";
import Wallet from "@/components/portfolio/wallet/Wallet";
import { useFeathers } from "@/services/feathers";
import { CHART_COLORS } from "@/config/constants";
import "./portfolio.scss";

const PortfolioComponent = () => {
  const [totals, setTotals] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const app = useFeathers();

  const fetchPortfolioData = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        const { user: currentUser } = await app.authenticate();
        if (!currentUser) {
          setTotals(null);
          setPortfolio(null);
          return;
        }

        // Fetch fresh data
        const [portfolioData, portfolioResponse] = await Promise.all([
          app.service("portfolio").find({
            query: { name: "calculate" },
          }),
          app.service("portfolio").find({}),
        ]);

        // Update state
        setTotals(portfolioData);
        setPortfolio(portfolioResponse.data[0]);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    },
    [app]
  );

  // Simplify the transaction handlers
  useEffect(() => {
    const transactionService = app.service("transactions");

    const handleTransactionChange = () => {
      fetchPortfolioData(true);
    };

    transactionService.on("created", handleTransactionChange);
    transactionService.on("updated", handleTransactionChange);
    transactionService.on("removed", handleTransactionChange);

    return () => {
      transactionService.removeListener("created", handleTransactionChange);
      transactionService.removeListener("updated", handleTransactionChange);
      transactionService.removeListener("removed", handleTransactionChange);
    };
  }, [app, fetchPortfolioData]);

  // Initial load
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // Memoize pie chart data calculations
  const pieData = useMemo(() => {
    if (!totals) return [];

    let cashPercentage = 100;
    const pieDataArr = Object.entries(totals).map(([ticker, value], index) => {
      cashPercentage -= value.percentage;
      return {
        name: ticker,
        value: parseFloat(value.percentage.toFixed(2)),
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    pieDataArr.push({
      name: "cash",
      value: parseFloat(cashPercentage.toFixed(2)),
      color: CHART_COLORS[pieDataArr.length % CHART_COLORS.length],
    });

    return pieDataArr.sort((a, b) => b.value - a.value);
  }, [totals]);

  // Memoize table data calculations
  const tableRows = useMemo(() => {
    if (!totals) return [];

    return Object.entries(totals)
      .map(([ticker, item]) => ({
        _id: ticker,
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
  }, [totals]);

  // Update handleWalletUpdate to remove localStorage operations
  const handleWalletUpdate = useCallback(
    (newCashAmount) => {
      if (!portfolio || !totals) return;

      // Update portfolio cash amount locally
      setPortfolio((prev) => ({
        ...prev,
        cash: newCashAmount,
      }));

      // Recalculate totals with new cash amount
      const totalValue =
        Object.values(totals).reduce(
          (sum, item) => sum + item.currentValue,
          0
        ) + newCashAmount;

      // Update percentages in totals
      const updatedTotals = Object.entries(totals).reduce(
        (acc, [ticker, item]) => {
          acc[ticker] = {
            ...item,
            percentage: (item.currentValue / totalValue) * 100,
          };
          return acc;
        },
        {}
      );

      setTotals(updatedTotals);
    },
    [portfolio, totals]
  );

  // Add refresh button handler
  const handleManualRefresh = useCallback(() => {
    fetchPortfolioData(true);
  }, [fetchPortfolioData]);

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

  if (!totals && !portfolio) {
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
        <h1>Holdings</h1>
        {/* <button onClick={handleManualRefresh} className="refresh-button">
          Refresh
        </button> */}
      </div>
      <div className="portfolio-content">
        <div className="top-section">
          <div className="graphs">
            <div className="box4">
              {totals && <PieChartBox data={pieData} showTitle={false} />}
              {!totals && <p>No assets in portfolio</p>}
            </div>
          </div>
          <div className="wallet-section">
            <Wallet
              liquid={portfolio?.cash || 0}
              onWalletUpdate={handleWalletUpdate}
            />
          </div>
        </div>
        <div className="table-container">
          {totals && <PortfolioTable rows={tableRows} showTitle={false} />}
        </div>
      </div>
    </div>
  );
};

export default PortfolioComponent;
