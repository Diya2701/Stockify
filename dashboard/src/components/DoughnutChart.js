import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function DoughnutChart({ data, title = "Watchlist Overview" }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 16,
          color: "#475569",
          boxWidth: 10,
        },
      },
      title: {
        display: true,
        text: title,
        color: "#0f172a",
        font: {
          size: 16,
          weight: "700",
        },
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ₹${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="doughnut-chart-card">
      <div className="doughnut-chart-wrapper">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
