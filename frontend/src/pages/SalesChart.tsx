import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { dashboardChartData } from "../pages/Data";

// Chart.js requires registering the pieces you use, once, anywhere in the app.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Overview" },
  },
};

export default function SalesChart() {
  return <Line options={options} data={dashboardChartData} />;
}