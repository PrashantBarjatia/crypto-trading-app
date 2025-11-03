import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend
);

export default function PriceChart({ data = [], compact = false }) {
  const labels = useMemo(() => data.map((d) => d.t), [data]);
  const prices = useMemo(() => data.map((d) => d.p), [data]);

  const chartData = {
    labels,
    datasets: [
      {
        label: compact ? "" : "Price",
        data: prices,
        fill: true,
        tension: 0.2,
        pointRadius: compact ? 0 : 2,
        borderColor: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.2)",
      },
    ],
  };

  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !compact,
        labels: { color: "#ffffff" },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        bodyColor: "#000000",
        backgroundColor: "#ffffff",
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "minute", tooltipFormat: "PPpp" },
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#ffffff", maxTicksLimit: 6 },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
    elements: { line: { borderWidth: 1 } },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: compact ? "48px" : "250px",
        maxHeight: compact ? "80px" : "500px",
        padding: compact ? "0" : "8px",
        boxSizing: "border-box",
      }}
    >
      <Line data={chartData} options={opts} />
    </div>
  );
}
