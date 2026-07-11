import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AutoAwesome } from "@mui/icons-material";
import "./PersonalizedReport.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const PersonalizedReport = () => {
  const location = useLocation();
  const [reportData, setReportData] = useState(
    location.state?.reportData || {},
  );
  const [fetching, setFetching] = useState(false);
  const [, setErrorMessage] = useState("");

  const profile = reportData.profile || {};
  const allocation = reportData.allocation || [];
  const strengths = reportData.strengths || [];
  const weaknesses = reportData.weaknesses || [];
  const warnings = reportData.warnings || [];
  const missingSectors = reportData.missingSectors || [];
  const suggestions = reportData.suggestions || [];
  const nextSteps = reportData.nextSteps || [];
  const resources = reportData.resources || [];

  const scoreValue = Number.isFinite(Number(reportData.score))
    ? Number(reportData.score)
    : 0;
  const riskValue = Number.isFinite(Number(reportData.riskAlignment))
    ? Number(reportData.riskAlignment)
    : 0;
  const growthValue = Number.isFinite(Number(reportData.growthReadiness))
    ? Number(reportData.growthReadiness)
    : 0;

  const scoreBand =
    reportData.scoreBand ||
    (scoreValue >= 85
      ? "Strong Fit"
      : scoreValue >= 70
        ? "Solid Fit"
        : "Needs Review");
  const riskBand =
    reportData.riskBand ||
    (riskValue >= 80
      ? "Well Aligned"
      : riskValue >= 65
        ? "Balanced"
        : "Needs Attention");
  const growthBand =
    reportData.growthBand ||
    (growthValue >= 80
      ? "Growth Ready"
      : growthValue >= 65
        ? "Momentum Building"
        : "Needs More Preparation");

  const loadReport = async () => {
    const savedForm = sessionStorage.getItem("personalizedAdvisorForm");

    if (!savedForm) {
      setErrorMessage("No advisor profile was found to generate a report.");
      return;
    }

    setFetching(true);
    setErrorMessage("");

    try {
      const profileData = JSON.parse(savedForm);
      const response = await axios.post(
        "http://localhost:3001/api/personalized-advisor",
        profileData,
      );
      setReportData(response.data || {});
    } catch (error) {
      console.error("Personalized report fetch failed:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to load your personalized report right now.",
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (location.state?.reportData) {
      setReportData(location.state.reportData);
      setErrorMessage("");
      return;
    }

    loadReport();
  }, [location.state?.reportData]);

  const chartData = {
    labels: allocation.map((item) => item.label),
    datasets: [
      {
        data: allocation.map((item) => item.value),
        backgroundColor: [
          "#2563eb",
          "#3b82f6",
          "#60a5fa",
          "#93c5fd",
          "#c7d2fe",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="report-shell">
      <section className="report-hero">
        <div>
          <div className="report-pill">
            <AutoAwesome fontSize="small" /> AI Personalized Strategy
          </div>
          <h1>Personalized Investment Report</h1>
          <p>
            A refined plan tailored to your profile, risk appetite, horizon, and
            market preferences.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div className="report-pill">Score {scoreValue}/100</div>
          <button
            type="button"
            onClick={loadReport}
            disabled={fetching}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "10px 16px",
              background: "#2563eb",
              color: "white",
              cursor: fetching ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {fetching ? "Generating..." : "Refresh Insights"}
          </button>
        </div>
      </section>

      <div className="report-grid">
        <div className="report-card">
          <div className="card-title-row">
            <h3>Investment Profile</h3>
            <span className="metric-chip green">
              {profile.goal || "Balanced Growth"}
            </span>
          </div>
          <div className="profile-list">
            <div className="profile-item">
              <span>Age</span>
              <strong>{profile.age || "—"}</strong>
            </div>
            <div className="profile-item">
              <span>Occupation</span>
              <strong>{profile.occupation || "—"}</strong>
            </div>
            <div className="profile-item">
              <span>Risk</span>
              <strong>{profile.riskTolerance || "—"}</strong>
            </div>
            <div className="profile-item">
              <span>Horizon</span>
              <strong>{profile.horizon || "—"}</strong>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="card-title-row">
            <h3>Portfolio Compatibility Score</h3>
            <span className="metric-chip blue">{scoreBand}</span>
          </div>
          <div className="progress-row">
            <span>
              Compatibility <strong>{scoreValue}%</strong>
            </span>
            <div className="progress-bar">
              <div
                style={{
                  width: `${scoreValue}%`,
                  background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                }}
              />
            </div>
          </div>
          <div className="progress-row">
            <span>
              Risk Alignment <strong>{riskValue}%</strong>
            </span>
            <div className="progress-bar">
              <div
                style={{
                  width: `${riskValue}%`,
                  background: "linear-gradient(90deg, #f59e0b, #fb923c)",
                }}
              />
            </div>
          </div>
          <div className="progress-row">
            <span>
              Growth Readiness <strong>{growthValue}%</strong>
            </span>
            <div className="progress-bar">
              <div
                style={{
                  width: `${growthValue}%`,
                  background: "linear-gradient(90deg, #16a34a, #4ade80)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="card-title-row">
            <h3>Risk Personality</h3>
            <span className="metric-chip orange">{riskBand}</span>
          </div>
          <p>
            {reportData.riskPersonality ||
              "Your AI-generated risk personality will appear here once the analysis is complete."}
          </p>
        </div>
        <div className="report-card">
          <div className="card-title-row">
            <h3>Investment Style</h3>
            <span className="metric-chip green">{growthBand}</span>
          </div>
          <p>
            {reportData.investmentStyle ||
              "Your AI-generated investment style will appear here once the analysis is complete."}
          </p>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card chart-card">
          {allocation.length ? (
            <div style={{ width: 260, height: 260 }}>
              <Doughnut
                data={chartData}
                options={{ plugins: { legend: { position: "bottom" } } }}
              />
            </div>
          ) : (
            <p>
              Your AI-generated allocation will appear here once the analysis is
              complete.
            </p>
          )}
        </div>
        <div className="report-card">
          <div className="card-title-row">
            <h3>Recommended Allocation</h3>
            <span className="metric-chip blue">
              {allocation.length ? "AI-weighted" : "Pending"}
            </span>
          </div>
          <div className="list-stack">
            {allocation.length ? (
              allocation.map((item) => (
                <div className="profile-item" key={item.label || item.value}>
                  <span>{item.label || "Asset Class"}</span>
                  <strong>{item.value}%</strong>
                </div>
              ))
            ) : (
              <p>No allocation details were returned by the AI yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="card-title-row">
            <h3>Strengths</h3>
            <span className="metric-chip green">Positive</span>
          </div>
          <div className="list-stack">
            {strengths.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </div>
        </div>
        <div className="report-card">
          <div className="card-title-row">
            <h3>Weaknesses</h3>
            <span className="metric-chip orange">Watch</span>
          </div>
          <div className="list-stack">
            {weaknesses.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="card-title-row">
            <h3>Risk Warnings</h3>
            <span className="metric-chip red">Risk</span>
          </div>
          <div className="badge-list">
            {warnings.map((item, index) => (
              <span className="badge red" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="report-card">
          <div className="card-title-row">
            <h3>Missing Sectors</h3>
            <span className="metric-chip orange">Opportunity</span>
          </div>
          <div className="badge-list">
            {missingSectors.map((item, index) => (
              <span className="badge orange" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="card-title-row">
            <h3>AI Suggestions</h3>
            <span className="metric-chip blue">Recommended</span>
          </div>
          <div className="recommendation-stack">
            {suggestions.map((item, index) => (
              <div className="resource-card" key={`${item}-${index}`}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="report-card">
          <div className="card-title-row">
            <h3>Next Steps</h3>
            <span className="metric-chip green">Action</span>
          </div>
          <div className="recommendation-stack">
            {nextSteps.map((item, index) => (
              <div className="resource-card" key={`${item}-${index}`}>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="card-title-row">
            <h3>Learning Resources</h3>
            <span className="metric-chip blue">Learn</span>
          </div>
          <div className="recommendation-stack">
            {resources.map((item, index) => (
              <div className="resource-card" key={`${item}-${index}`}>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="report-card">
          <div className="card-title-row">
            <h3>Advisory Notes</h3>
            <span className="metric-chip orange">Insight</span>
          </div>
          <p>
            {reportData.notes ||
              "Your AI-generated advisory notes will appear here once the analysis is complete."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedReport;
