// Static data for the dashboard chart.
// Edit the numbers in `data` below to change what the chart shows.

export const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];

export const chartColors = {
  red: "rgb(255, 99, 132)",
  blue: "rgb(54, 162, 235)",
};

function transparentize(color: string, opacity: number) {
  // turns "rgb(r,g,b)" into "rgba(r,g,b,alpha)"
  const alpha = 1 - opacity;
  return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
}

export const dashboardChartData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [65, -42, 80, 12, -25, 90, 33],
      borderColor: chartColors.red,
      backgroundColor: transparentize(chartColors.red, 0.5),
      tension: 0.3,
    },
    {
      label: "Dataset 2",
      data: [-30, 55, -10, 70, 40, -15, 60],
      borderColor: chartColors.blue,
      backgroundColor: transparentize(chartColors.blue, 0.5),
      tension: 0.3,
    },
  ],
};