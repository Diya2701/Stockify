import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AccountBalanceWalletOutlined,
  AutoAwesomeOutlined,
  BarChartOutlined,
  InsightsOutlined,
  PieChartOutlined,
  TrendingDownOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./PortfolioAnalysis.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function PortfolioAnalysis() {
  const [analysisData, setAnalysisData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAnalysis = async () => {
    setFetching(true);
    setErrorMessage("");
    try {
      const response = await axios.post(
        "https://stockify-backend-opit.onrender.com/api/ai/analyze-portfolio",
      );
      const analysis = response?.data || null;

      if (analysis?.error) {
        setErrorMessage(analysis.error);
        setAnalysisData(null);
      } else {
        setAnalysisData(analysis);
      }
    } catch (error) {
      console.error("Portfolio analysis fetch failed:", error);
      setErrorMessage(
        error?.response?.data?.error ||
          "Unable to fetch portfolio analysis right now.",
      );
      setAnalysisData(null);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  const metrics = useMemo(() => {
    const stats = analysisData?.portfolioStats || {};
    return {
      totalInvestment: Number(stats.totalInvestment || 0),
      currentValue: Number(stats.currentValue || 0),
      profit: Number(stats.overallProfit || 0),
      percent: Number(stats.overallProfitPercent || 0),
      holdingsCount: Array.isArray(analysisData?.portfolio)
        ? analysisData.portfolio.length
        : 0,
      riskLevel: stats.riskLevel || "—",
      diversificationLevel: stats.diversificationLevel || "—",
      portfolioHealthScore: Number(stats.portfolioHealthScore || 0),
      riskScore: Number(stats.riskScore || 0),
      diversificationScore: Number(stats.diversificationScore || 0),
      numberOfSectors: Number(stats.numberOfSectors || 0),
    };
  }, [analysisData]);

  const holdingsChartData = useMemo(() => {
    const source = Array.isArray(analysisData?.portfolio)
      ? analysisData.portfolio
      : [];
    const sorted = [...source].sort(
      (a, b) => Number(b.holdingValue || 0) - Number(a.holdingValue || 0),
    );

    return {
      labels: sorted.map((item) => item.name || "Asset"),
      datasets: [
        {
          label: "Current Value",
          data: sorted.map((item) => Number(item.holdingValue || 0)),
          backgroundColor: sorted.map((item) =>
            Number(item.profit || 0) >= 0 ? "#4f46e5" : "#f97316",
          ),
          borderRadius: 10,
          maxBarThickness: 44,
        },
      ],
    };
  }, [analysisData]);

  const sectorChartData = useMemo(() => {
    const sectors = Array.isArray(analysisData?.aiSummary?.sectorAnalysis)
      ? analysisData.aiSummary.sectorAnalysis
      : Array.isArray(analysisData?.sectorAllocation)
        ? analysisData.sectorAllocation
        : [];

    return {
      labels: sectors.map((sector) => sector.sector || "Sector"),
      datasets: [
        {
          data: sectors.map((sector) => Number(sector.allocation || 0)),
          backgroundColor: [
            "#4f46e5",
            "#3b82f6",
            "#0f766e",
            "#8b5cf6",
            "#f59e0b",
            "#ef4444",
            "#10b981",
            "#64748b",
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [analysisData]);

  const topPerformers = Array.isArray(analysisData?.topPerformers)
    ? analysisData.topPerformers
    : [];
  const worstPerformers = Array.isArray(analysisData?.worstPerformers)
    ? analysisData.worstPerformers
    : [];
  const strengths = Array.isArray(analysisData?.aiSummary?.strengths)
    ? analysisData.aiSummary.strengths
    : [];
  const weaknesses = Array.isArray(analysisData?.aiSummary?.weaknesses)
    ? analysisData.aiSummary.weaknesses
    : [];
  const recommendations = Array.isArray(
    analysisData?.aiSummary?.recommendations,
  )
    ? analysisData.aiSummary.recommendations
    : [];
  const sectorAnalysis = Array.isArray(analysisData?.aiSummary?.sectorAnalysis)
    ? analysisData.aiSummary.sectorAnalysis
    : Array.isArray(analysisData?.sectorAllocation)
      ? analysisData.sectorAllocation
      : [];

  return (
    <div className="analysis-container">
      <div className="analysis-hero">
        <div>
          <p className="eyebrow">AI PORTFOLIO ANALYSIS</p>
          <h1>Understand your investments in a simple, visual way</h1>
          <p className="hero-subtext">
            Every number, chart, and insight on this page comes from your
            portfolio data and analysis.
          </p>
        </div>
        <button
          className="primary-action"
          onClick={loadAnalysis}
          disabled={fetching}
        >
          {fetching ? "Refreshing..." : "Refresh Analysis"}
        </button>
      </div>

      {errorMessage ? (
        <div className="analysis-card error-card">{errorMessage}</div>
      ) : null}

      <div className="stats-grid">
        <div className="stat-card primary-card">
          <div className="stat-icon">
            <AccountBalanceWalletOutlined />
          </div>
          <div>
            <span style={{ color: "white" }}>Current Value</span>
            <strong style={{ color: "white" }}>
              {formatCurrency(metrics.currentValue)}
            </strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUpOutlined />
          </div>
          <div>
            <span>Overall Profit</span>
            <strong className={metrics.profit >= 0 ? "profit" : "loss"}>
              {metrics.profit >= 0 ? "+" : ""}
              {formatCurrency(metrics.profit)}
            </strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <BarChartOutlined />
          </div>
          <div>
            <span>Return</span>
            <strong className={metrics.percent >= 0 ? "profit" : "loss"}>
              {metrics.percent >= 0 ? "+" : ""}
              {formatPercent(metrics.percent)}
            </strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <InsightsOutlined />
          </div>
          <div>
            <span>Holdings</span>
            <strong>{metrics.holdingsCount}</strong>
          </div>
        </div>
      </div>

      <div className="analysis-card summary-card">
        <div className="section-header">
          <div>
            <h3>Portfolio Summary</h3>
            <p>A simple explanation of how your portfolio is doing</p>
          </div>
          <div className="summary-pill">LIVE</div>
        </div>

        <p className="summary-text">
          {analysisData?.aiSummary?.summary ||
            "Waiting for your portfolio analysis..."}
        </p>

        <div className="score-grid">
          <div className="score-card">
            <span>Health Score</span>
            <strong>{metrics.portfolioHealthScore}</strong>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(metrics.portfolioHealthScore, 100)}%`,
                }}
              />
            </div>
          </div>
          <div className="score-card">
            <span>Risk Score</span>
            <strong>{metrics.riskScore}</strong>
            <div className="progress-track">
              <div
                className="progress-fill risk-fill"
                style={{ width: `${Math.min(metrics.riskScore * 10, 100)}%` }}
              />
            </div>
          </div>
          <div className="score-card">
            <span>Diversification</span>
            <strong>{metrics.diversificationScore}</strong>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(metrics.diversificationScore * 10, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="analysis-card">
          <div className="section-header">
            <div>
              <h3>Holding Performance</h3>
              <p>Current value of each holding from your portfolio</p>
            </div>
            <div className="icon-badge">
              <BarChartOutlined />
            </div>
          </div>
          <div className="chart-shell">
            <Bar
              data={holdingsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#64748b" }, grid: { display: false } },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: "#64748b",
                      callback: (value) => `₹${value}`,
                    },
                    grid: { color: "rgba(148, 163, 184, 0.16)" },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="analysis-card">
          <div className="section-header">
            <div>
              <h3>Sector Allocation</h3>
              <p>See how your portfolio is spread across sectors</p>
            </div>
            <div className="icon-badge">
              <PieChartOutlined />
            </div>
          </div>
          <div className="chart-shell pie-shell">
            <Pie
              data={sectorChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#475569", padding: 16 },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="analysis-card">
          <div className="section-header">
            <div>
              <h3>Key Insights</h3>
              <p>High-level takeaways from your portfolio analysis</p>
            </div>
            <div className="icon-badge">
              <InsightsOutlined />
            </div>
          </div>
          <div className="insight-list">
            <div className="insight-row">
              <span>Largest Holding</span>
              <span className="insight-badge positive">
                <span className="arrow-icon">↗</span>
                <strong>
                  {analysisData?.portfolioInsights?.largestHolding?.name || "—"}
                </strong>
              </span>
            </div>
            <div className="insight-row">
              <span>Weighted Return</span>
              <span className="insight-badge positive">
                <span className="arrow-icon">↗</span>
                <strong>
                  {analysisData?.portfolioInsights?.weightedReturn || 0}%
                </strong>
              </span>
            </div>
            <div className="insight-row">
              <span>Profitable Stocks</span>
              <span className="insight-badge positive">
                <span className="arrow-icon">✓</span>
                <strong>
                  {analysisData?.portfolioInsights?.profitableStocks || 0}
                </strong>
              </span>
            </div>
            <div className="insight-row">
              <span>Loss Stocks</span>
              <span className="insight-badge negative">
                <span className="arrow-icon">↓</span>
                <strong>
                  {analysisData?.portfolioInsights?.lossStocks || 0}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="analysis-card">
          <div className="section-header">
            <div>
              <h3>Top and Weak Performers</h3>
              <p>Best and weakest holdings from your portfolio</p>
            </div>
            <div className="icon-badge">
              <AutoAwesomeOutlined />
            </div>
          </div>
          <div className="micro-list-block">
            <div className="micro-list-heading">Top Performers</div>
            {topPerformers.map((item, index) => (
              <div className="micro-row" key={`${item.name}-${index}`}>
                <span>{item.name}</span>
                <span className="performer-badge positive">
                  <span className="arrow-icon">↑</span>
                  <strong className="profit">{item.profitPercent}%</strong>
                </span>
              </div>
            ))}
          </div>
          <div className="micro-list-block">
            <div className="micro-list-heading">Weak Performers</div>
            {worstPerformers.map((item, index) => (
              <div className="micro-row" key={`${item.name}-${index}`}>
                <span>{item.name}</span>
                <span className="performer-badge negative">
                  <span className="arrow-icon">↓</span>
                  <strong className="loss">{item.profitPercent}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overview-grid three-col">
        <div className="analysis-card">
          <div className="section-header">
            <div>
              <h3>Strengths</h3>
              <p>What the AI sees as positive</p>
            </div>
            <div className="icon-badge">
              <TrendingUpOutlined />
            </div>
          </div>
          <ul className="bullet-list">
            {strengths.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-card">
          <div className="section-header">
            <div>
              <h3>Watchouts</h3>
              <p>Where your portfolio analysis suggests caution</p>
            </div>
            <div className="icon-badge">
              <TrendingDownOutlined />
            </div>
          </div>
          <ul className="bullet-list">
            {weaknesses.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-card">
          <div className="section-header">
            <div>
              <h3>Recommendations</h3>
              <p>Practical next steps from your portfolio analysis</p>
            </div>
            <div className="icon-badge">
              <AutoAwesomeOutlined />
            </div>
          </div>
          <ul className="bullet-list">
            {recommendations.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="analysis-card section-card">
        <div className="section-header">
          <div>
            <h3>Sector View</h3>
            <p>Portfolio sector comments and allocation context</p>
          </div>
        </div>
        <div className="sector-list">
          {sectorAnalysis.map((sector, index) => (
            <div className="sector-row" key={`${sector.sector}-${index}`}>
              <div className="sector-info">
                <strong>{sector.sector}</strong>
                <span>{sector.allocation}%</span>
              </div>
              <div className="sector-bar">
                <div
                  className="sector-bar-fill"
                  style={{ width: `${Math.min(sector.allocation, 100)}%` }}
                />
              </div>
              <p>
                {sector.comment ||
                  `Current value: ₹${sector.currentValue || 0}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="analysis-card beginner-card">
        <div className="section-header">
          <div>
            <h3>Beginner Explanation</h3>
            <p>Easy-to-understand takeaway from your portfolio</p>
          </div>
        </div>
        <p className="beginner-text">
          {analysisData?.aiSummary?.beginnerExplanation ||
            "Your beginner explanation will appear here once the backend response is loaded."}
        </p>
      </div>
    </div>
  );
}

export default PortfolioAnalysis;
