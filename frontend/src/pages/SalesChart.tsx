import { Line } from "react-chartjs-2";
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend } from "chart.js";
import { dashboardChartData } from "./Data";
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
const data={...dashboardChartData,datasets:dashboardChartData.datasets.map(dataset=>({...dataset,borderColor:dataset.label==="Dataset 1"?"#6969E8":"#1597C2",backgroundColor:dataset.label==="Dataset 1"?"rgba(105,105,232,.12)":"rgba(21,151,194,.10)",pointBackgroundColor:dataset.label==="Dataset 1"?"#6969E8":"#1597C2",pointBorderColor:"#FFFFFF",pointRadius:3,borderWidth:2.5,tension:.38}))};
const options={responsive:true,maintainAspectRatio:true,plugins:{legend:{position:"top" as const,labels:{color:"#667085",usePointStyle:true,boxWidth:8,padding:18}},title:{display:true,text:"Overview · Sample data",color:"#344054",font:{size:14,weight:"600" as const},padding:{bottom:20}},tooltip:{backgroundColor:"#FFFFFF",titleColor:"#172033",bodyColor:"#475467",borderColor:"#E5EAF2",borderWidth:1,padding:12}},scales:{x:{ticks:{color:"#667085"},grid:{color:"rgba(102,112,133,.10)"}},y:{ticks:{color:"#667085"},grid:{color:"rgba(102,112,133,.10)"}}}};
export default function SalesChart(){return <Line options={options} data={data}/>;}
