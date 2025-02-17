'use client'
import NavBar from "@/app/components/NavBar";
import { useEffect, useState } from "react"
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PaginatedItems from "@/app/components/paginated-items";
import axios from 'axios'
import moment from 'moment'
import {getCurrentReadings, getDashboardChartData} from '@/app/composables/fetchSensorReadings'

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

let Dashboard = () => {

  const [isMobile, setIsMobile] = useState(false)
  const [weather, setWeather] = useState({})
  const [sensorReadings, setSensorReadings] = useState([])
  const [chartFogTemp, setChartFogTemp] = useState({
    labels: ['1','1','1','1','1'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [1,1,1,1,1],
        borderColor: '#49ABDF',
        lineTension: 0.4
      }
    ],
  })
  const [chartFogHumidity, setChartFogHumidity] = useState({
    labels: ['1','1','1','1','1'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [1,1,1,1,1],
        borderColor: '#49ABDF',
        lineTension: 0.4
      }
    ],
  })
  const [chartFogLightIntensity, setChartFogLightIntensity] = useState({
    labels: ['1','1','1','1','1'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [1,1,1,1,1],
        borderColor: '#49ABDF',
        lineTension: 0.4
      }
    ],
  })
  const [chartFogCO2Level, setChartFogCO2Level] = useState({
    labels: ['1','1','1','1','1'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [1,1,1,1,1],
        borderColor: '#49ABDF',
        lineTension: 0.4
      }
    ],
  })


  let defaultMobileWidth = 450;

  const weather_url = `https://api.weatherapi.com/v1/current.json?key=44b78a570b194d2c9fb21417251402&q=17.7360796,120.4670137`;

  const fetchWeather = async () => {
    await axios.get(weather_url).then(res=>{
      console.log(res)
      setWeather({
        condition: res.data?.current.condition,
        temp_in_c: res.data?.current.temp_c,
        precip: res.data?.current.precip_mm,
        humidity: res.data?.current.humidity,
        date_time: res.data?.location.localtime
      })

      localStorage.setItem('weather', JSON.stringify({
        condition: res.data?.current.condition,
        temp_in_c: res.data?.current.temp_c,
        precip: res.data?.current.precip_mm,
        humidity: res.data?.current.humidity,
        date_time: res.data?.location.localtime
      }))
      
    }).catch(err=>{
      console.log(err)

      setWeather(JSON.parse(localStorage.getItem('weather')))
    })
  }

  const fetchSensorReadings = async () => {
    const readings = await getCurrentReadings()
    console.log('readings', readings)
    setSensorReadings(readings[0])
  }

  const fetchChartReadings = async () => {
    let formattedSPRTemp = [];
    let formattedSPRHumidity = [];
    let formattedSPRLightIntensity = [];
    let formattedSPRCO2Level = [];

    const data = await getDashboardChartData()
    console.log('chart data', data)
    data.forEach(i=>{
      formattedSPRTemp.push(i?.attributes.spr_temperature)
      formattedSPRHumidity.push(i?.attributes.spr_humidity)
      formattedSPRLightIntensity.push(i?.attributes.spr_light_intensity)
      formattedSPRCO2Level.push(i?.attributes.spr_co2)
    })
    setChartFogTemp({
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: formattedSPRTemp,
          borderColor: '#49ABDF',
          lineTension: 0.4
        }
      ],
    })
    setChartFogHumidity({
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: formattedSPRHumidity,
          borderColor: '#49ABDF',
          lineTension: 0.4
        }
      ],
    })
    setChartFogLightIntensity({
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: formattedSPRLightIntensity,
          borderColor: '#49ABDF',
          lineTension: 0.4
        }
      ],
    })
    setChartFogCO2Level({
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: formattedSPRCO2Level,
          borderColor: '#49ABDF',
          lineTension: 0.4
        }
      ],
    })
  }
  

  useEffect( ()=>{
    fetchSensorReadings()
    fetchChartReadings()
    // console.log(getCurrentReadings())
    // console.log(token)
    // console.log(moment().hours() - moment(JSON.parse(localStorage.getItem('weather'))?.date_time).hours())
    if(localStorage.getItem('weather')){
      if(moment().hours() != moment(JSON.parse(localStorage.getItem('weather'))?.date_time).hours()){
        fetchWeather();
      }else{
        setWeather({
          condition: JSON.parse(localStorage.getItem('weather'))?.condition,
          temp_in_c: JSON.parse(localStorage.getItem('weather'))?.temp_in_c,
          precip: JSON.parse(localStorage.getItem('weather'))?.precip,
          humidity: JSON.parse(localStorage.getItem('weather'))?.humidity,
          date_time: JSON.parse(localStorage.getItem('weather'))?.date_time
        })
        console.log('conditio from localstorage', JSON.parse(localStorage.getItem('weather'))?.condition)
      }
    }else{
      fetchWeather();
    }

    console.log(window.screen.width)
    if(window.screen.width <= defaultMobileWidth){
      setIsMobile(true)
    }else{
      setIsMobile(false)
    }

    let windowListener = window.addEventListener('resize', (e) => {
      if(window.screen.width <= defaultMobileWidth){
        setIsMobile(true)
      }else{
        setIsMobile(false)
      }
      console.log(window.screen.width)
    });

    return () => {
      removeEventListener('resize', windowListener)
    };
  
  }, [])


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

  const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,1,2,3]

  return (
    <div className="text-gray-600">
      {/* for desktop */}
      {
        !isMobile &&
        <div className="h-screen w-screen flex justify-center items-center pl-32 pr-16 py-12">
          {/* Dashboard left side */}
          <div className="h-full w-1/3 pr-4">
            <div className="h-1/3 pb-2">
              <div className="border-slate-400 border rounded p-4 relative h-full">
                <p className="absolute">Ilocos Sur, San Juan</p>
                <div className="flex flex-col h-full justify-center">
                  <div className="text-center mb-3">
                    <div className="flex text-5xl justify-center ">
                      10:30
                      <p className="text-lg right-1/2 ml-1"> am</p>
                    </div>
                    <p>January 24, 2025</p>
                  </div>
                  <div className="flex justify-center mt-3">
                    <div>
                      <div className="flex text-5xl justify-center relative left-2">
                        32
                        <p className="text-xl right-1/2 ml-1"> °C</p>
                      </div>
                      <p>Temperature</p>
                    </div>
                    <div className="mx-10">
                      <div className="flex text-5xl justify-center relative left-2">
                        77
                        <p className="text-xl right-1/2 ml-1"> %</p>
                      </div>
                      <p>Humidity</p>
                    </div>
                    <div>
                      <div className="flex text-5xl justify-center relative left-2">
                        32
                        <p className="text-xl right-1/2 ml-1"> °C</p>
                      </div>
                      <p>Precipitation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-1/3 py-2">
              <div className="border-slate-400 border rounded flex relative h-full">
                <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                  <div className="flex text-5xl justify-center relative left-3">
                    29.3
                    <p className="text-xl right-1/2 ml-1">°C</p>
                  </div>
                  <p>Temperature</p>
                  <div className="flex justify-center mt-2">
                  <Line width={"110%"} height={"45%"} options={options} data={tempData} />
                  </div>
                </div>
                <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                  <div className="flex text-5xl justify-center relative left-3">
                    88
                    <p className="text-xl right-1/2 ml-1"> %</p>
                  </div>
                  <p>Humidity</p>
                  <div className="flex justify-center mt-2">
                  <Line width={"110%"} height={"45%"} options={options} data={tempData} />
                  </div>
                </div>

                {/* just a line in the middle */}
                <div className="border-slate-400 border-r h-full ml-5 absolute right-1/2"></div>
              </div>
            </div>

            <div className="h-1/3 pt-2">
              <div className="border-slate-400 border rounded flex relative h-full">
                <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                  <div className="flex text-5xl justify-center relative left-3">
                    245
                    <p className="text-lg right-1/2 ml-1">cd</p>
                  </div>
                  <p>Light Intensity</p>
                  <div className="flex justify-center mt-2">
                  <Line width={"110%"} height={"45%"} options={options} data={tempData} />
                  </div>
                </div>
                <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                  <div className="flex text-4xl justify-center relative left-3">
                    1242
                    <p className="text-lg right-1/2 ml-1"> ppm</p>
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
          </div>
          <div className="h-full w-2/3">
            <div style={{height: 'calc(6% + 1rem)', paddingBottom: '1rem'}} className="">
              <div className="border-slate-400 border rounded h-full flex items-center justify-between" >
                  <div className="p-1 border-slate-300 border rounded ml-3">
                    <DownloadIcon className="text-blue-400" />
                  </div>
                  <div>
                    <label>SORT: </label>
                    <select id="sort" className="border-slate-400 border rounded py-2">
                      <option value="asc">ASC</option>
                      <option value="desc">DESC</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label>DATE FROM: </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker label="Date From" sx={{}}/>
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div className="flex items-center">
                    <label>DATE TO: </label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker label="Date From" sx={{}}/>
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div className="mr-3">
                     <FilterAltIcon className="text-blue-400" />
                  </div>
              </div>
            </div>
            
            <div className="" style={{height: 'calc(88% - 2rem)'}}>
              <div className="border-slate-400 border rounded h-full overflow-scroll overflow-x-hidden" >
                <table className="w-full">
                  <thead style={{height: '10%'}}>
                    <tr className="sticky top-0">
                      <td className="p-1 pl-2 border bg-slate-200 border-slate-300 font-bold text-sm" style={{width: '16.666%', height: '5%'}}>Temperature</td>
                      <td className=" pl-2 border bg-slate-200 border-slate-300 font-bold text-sm" style={{width: '16.666%'}}>Humidity</td>
                      <td className=" pl-2 border bg-slate-200 border-slate-300 font-bold text-sm" style={{width: '16.666%'}}>CO2 Level</td>
                      <td className=" pl-2 border bg-slate-200 border-slate-300 font-bold text-sm" style={{width: '16.666%'}}>Light Sensitivity</td>
                      <td className=" pl-2 border bg-slate-200 border-slate-300 font-bold text-sm" style={{width: '16.666%'}}>Date and Time</td>
                      <td className=" pl-2 border bg-slate-200 border-slate-300 font-bold text-sm" style={{width: '16.666%'}}>Status</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      arr.map((i,index)=>(
                        <tr key={index} className="">
                          <td className="p-1 border border-slate-300" style={{height: '100%'}}>a</td>
                          <td className="p-1 border border-slate-300">b</td>
                          <td className="p-1 border border-slate-300">c</td>
                          <td className="p-1 border border-slate-300">a</td>
                          <td className="p-1 border border-slate-300">b</td>
                          <td className="p-1 border border-slate-300">c</td>
                        </tr>
                      ))
                    }
                    
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{height: 'calc(6% + 1rem)', paddingTop: '1rem'}} className="">
              <div className="border-slate-400 border rounded h-full" >
                <PaginatedItems itemsPerPage={4} />
              </div>
            </div>
          </div>
        </div>
      }
      
      {/* for mobile only */}
      {
        isMobile && 
        <div>
          <div className="h-screen p-4 pb-16 flex flex-col justify-center">
            <div className="border-slate-400 border h-1/3 mb-4 rounded p-4 relative">
              <p className="absolute">Ilocos Sur, San Juan</p>
              <div className="flex flex-col h-full justify-center">
                <div className="text-center">
                  <div className="flex text-5xl justify-center">
                    {moment(weather?.date_time).format('LT')}
                  </div>
                  <p>{moment(weather?.date_time).format('ll')}</p>
                </div>
                <div className="flex justify-center mt-3">
                  <div>
                    <div className="flex text-5xl justify-center">
                      {weather?.temp_in_c}
                      <p className="text-lg right-1/2 ml-1"> °C</p>
                    </div>
                    <p>{weather?.condition?.text}</p>
                  </div>
                  <div className="mx-6">
                    <div className="flex text-5xl justify-center">
                      {weather?.humidity}
                      <p className="text-lg right-1/2 ml-1"> %</p>
                    </div>
                    <p>Humidity</p>
                  </div>
                  <div>
                    <div className="flex text-5xl justify-center">
                      {weather?.precip}
                      <p className="text-lg right-1/2 ml-1"> mm</p>
                    </div>
                    <p>Precipitation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-slate-400 border h-1/3 mb-4 rounded flex relative">
              <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                <div className="flex text-5xl justify-center">
                  {sensorReadings?.attributes?.spr_temperature}
                  <p className="text-sm right-1/2 ml-1">°C</p>
                </div>
                <p>Temperature</p>
                <div className="flex justify-center mt-2">
                <Line width={"110%"} height={"45%"} options={options} data={chartFogTemp} />
                </div>
              </div>
              <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                <div className="flex text-5xl justify-center">
                {sensorReadings?.attributes?.spr_humidity}
                  <p className="text-lg right-1/2 ml-1"> %</p>
                </div>
                <p>Humidity</p>
                <div className="flex justify-center mt-2">
                <Line width={"110%"} height={"45%"} options={options} data={chartFogHumidity} />
                </div>
              </div>

              {/* just a line in the middle */}
              <div className="border-slate-400 border-r h-full ml-5 absolute right-1/2"></div>
            </div>
            <div className="border-slate-400 border h-1/3 mb-4 rounded flex relative">
              <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                <div className="flex text-5xl justify-center">
                  {sensorReadings?.attributes?.spr_light_intensity}
                  <p className="text-sm right-1/2 ml-1">cd</p>
                </div>
                <p>Light Intensity</p>
                <div className="flex justify-center mt-2">
                <Line width={"110%"} height={"45%"} options={options} data={chartFogLightIntensity} />
                </div>
              </div>
              <div className="flex flex-col justify-center align-middle w-1/2 text-center">
                <div className="flex text-4xl justify-center">
                  {sensorReadings?.attributes?.spr_co2}
                  <p className="text-sm right-1/2 ml-1"> ppm</p>
                </div>
                <p>CO2 Level</p>
                <div className="flex justify-center mt-2">
                <Line width={"110%"} height={"45%"} options={options} data={chartFogCO2Level} />
                </div>
              </div>

              {/* just a line in the middle */}
              <div className="border-slate-400 border-r h-full ml-5 absolute right-1/2"></div>
            </div>
          </div>
          <NavBar />

        </div>
      }

      <NavBar />

      
    </div>
  );
}


export default Dashboard