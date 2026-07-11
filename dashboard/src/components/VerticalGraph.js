import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function VerticalGraph({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#475569",
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      title: {
        display: true,
        text: "Portfolio Allocation",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "700",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f8fafc",
        bodyColor: "#f8fafc",
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.15)",
        },
        ticks: {
          color: "#64748b",
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div style={{ height: "280px", marginTop: "20px" }}>
      <Bar options={options} data={data} />
    </div>
  );
}
