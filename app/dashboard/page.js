'use client'
import NavBar from "../components/NavBar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const options = {
    responsive: false,
    elements: {
      point:{
        radius: 0
      }
    },
    scales:{
      y: {
        display: false
      },
      x: {
        display: false
      }
    },
    plugins: {
      // legend: {
      //   position: 'top',
      // },
      legend: {
        display: false
      },
      tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const tempData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3, 10,5,4,12,3,8],
        borderColor: '#49ABDF',
        lineTension: 0.4
      }
    ],
  };

  const humidityData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [10,7,21,10,2,2,14,8,4,7,10,4,5],
        borderColor: '#49ABDF',
        lineTension: 0.4
      }
    ],
  };

  return (
    <div>
      <div className="h-screen p-6 pb-16 flex flex-col justify-center">
        <div className="border-slate-400 border h-1/3 mb-6 rounded">
        
        </div>
        <div className="border-slate-400 border h-1/3 mb-6 rounded flex relative">
          <div className="flex flex-col justify-center align-middle w-1/2 text-center">
            <div className="flex text-5xl justify-center relative">
              29.3
              <p className="top-0 text-sm absolute right-1/2">°C</p>
            </div>
            <p>Temperature</p>
            <div className="flex justify-center mt-2">
            <Line width={"110%"} height={"45%"} options={options} data={tempData} />
            </div>
          </div>
          <div className="flex flex-col justify-center align-middle w-1/2 text-center">
            <div className="flex text-5xl justify-center relative">
              88
              <p className="top-0 text-sm absolute right-1/2">%</p>
            </div>
            <p>Humidity</p>
            <div className="flex justify-center mt-2">
            <Line width={"110%"} height={"45%"} options={options} data={tempData} />
            </div>
          </div>

          {/* just a line in the middle */}
          <div className="border-slate-400 border-r h-full ml-5 absolute right-1/2"></div>
        </div>
        <div className="border-slate-400 border h-1/3 mb-6 rounded flex relative">
          <div className="flex flex-col justify-center align-middle w-1/2 text-center">
            <div className="flex text-5xl justify-center relative">
              245
              <p className="top-0 text-sm absolute right-1/2">cd</p>
            </div>
            <p>Light Intensity</p>
            <div className="flex justify-center mt-2">
            <Line width={"110%"} height={"45%"} options={options} data={tempData} />
            </div>
          </div>
          <div className="flex flex-col justify-center align-middle w-1/2 text-center">
            <div className="flex text-4xl justify-center relative">
              1242
              <p className="top-0 text-sm absolute right-1/2">ppm</p>
            </div>
            <p>CO2 Level</p>
            <div className="flex justify-center mt-2">
            <Line width={"110%"} height={"45%"} options={options} data={humidityData} />
            </div>
          </div>

          {/* just a line in the middle */}
          <div className="border-slate-400 border-r h-full ml-5 absolute right-1/2"></div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}
