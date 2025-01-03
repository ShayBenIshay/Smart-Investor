"use client";

import { useState, useEffect, useMemo } from "react";
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

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { user: currentUser } = await app.authenticate();
      if (!currentUser) {
        setTotals(null);
        setPortfolio(null);
        return;
      }

      // Fetch portfolio data for calculations
      const portfolioData = await app.service("portfolio").find({
        query: {
          name: "calculate",
          userId: currentUser._id,
        },
      });

      // Fetch portfolio data for cash balance
      const portfolioResponse = await app.service("portfolio").find({
        query: {
          name: "find",
          userId: currentUser._id,
        },
      });

      setTotals(portfolioData);
      setPortfolio(portfolioResponse.data[0]);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

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

    return Object.values(totals)
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
  }, [totals]);

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

  if (!totals || !portfolio) {
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
      </div>
      <div className="portfolio-content">
        <div className="top-section">
          <div className="graphs">
            <div className="box4">
              <PieChartBox data={pieData} showTitle={false} />
            </div>
          </div>
          <div className="wallet-section">
            <Wallet liquid={portfolio.cash || 0} />
          </div>
        </div>
        <div className="table-container">
          <PortfolioTable rows={tableRows} showTitle={false} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioComponent;
