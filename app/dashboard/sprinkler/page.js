'use client'
import NavBar from "@/app/components/NavBar";
import { useEffect, useState } from "react"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from 'axios'
import moment from 'moment'
import {getCurrentReadings, getDashboardChartData} from '@/app/composables/fetchSensorReadings'
import { useRouter, useParams } from 'next/navigation'
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#CBD5E166',
    color: '#282828',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

let Dashboard = () => {

  const [isMobile, setIsMobile] = useState(false)
  const [weather, setWeather] = useState({})
  const [sensorReadings, setSensorReadings] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedParam, setSelectedParam] = useState({ temp: false, hum: false, light: false, co2: false })
  const [showChart, setShowChart] = useState(false);
  const [tableData, setTableData] = useState([])
  const [_sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)
  const [paginationCount, setPaginationCount] = useState(1)
  const [limit, setLimit] = useState(21)

  const router = useRouter()
  const params = useParams()
  
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

  const fetchChartReadings = async (datefrom, dateto, sort, _offset) => {
    let formattedFogTemp = [];
    let formattedFogHumidity = [];
    let formattedFogLightIntensity = [];
    let formattedFogCO2Level = [];

    const {data, meta} = await getDashboardChartData(datefrom, dateto, sort, _offset)
    console.log('Start date', startDate)
    console.log('End date', endDate)
    console.log('chart data', data)

    setPaginationCount(Math.ceil(meta?.pagination.total/limit))

    data.forEach(i=>{
      formattedFogTemp.push(i?.attributes.spr_temperature)
      formattedFogHumidity.push(i?.attributes.spr_humidity)
      formattedFogLightIntensity.push(i?.attributes.spr_light_intensity)
      formattedFogCO2Level.push(i?.attributes.spr_co2)
    })
    setTableData(data)
    setChartFogTemp({
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: formattedFogTemp,
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
          data: formattedFogHumidity,
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
          data: formattedFogLightIntensity,
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
          data: formattedFogCO2Level,
          borderColor: '#49ABDF',
          lineTension: 0.4
        }
      ],
    })
  }
  

  useEffect( ()=>{
    fetchSensorReadings()
    fetchChartReadings(startDate, endDate, _sort, 0)
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

  const options2 = {
    // responsive: false,
    maintainAspectRatio: false,
    elements: {
      point:{
        radius: 0
      }
    },
    scales:{
      // y: {
      //   display: false
      // },
      // x: {
      //   display: false
      // }
    },
    plugins: {
      // legend: {
      //   position: 'top',
      // },
      legend: {
        display: false
      },
      // tooltips: {
      //     callbacks: {
      //       label: function(tooltipItem) {
      //         return tooltipItem.yLabel;
      //       }
      //     }
      // },
      // title: {
      //   display: false,
      //   text: 'Chart.js Line Chart',
      // },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const tempData = {
    labels: ['2:01','2:10','2:15','2:30','2:46','3:01','3:15','3:31','3:47','4:15','4:30','4:44','5:15','5:25','5:45','6:15','6:35','6:55','7:15','7:25'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [55, 19, 46, 38, 21, 3, 10,5,4,12,88,8,34,49,5,6,88,16,100,36],
        borderColor: '#49ABDF',
        lineTension: 0.30
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

  const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13]
  const arr2 = [1,2,3,4,5,6]


  const handleClick = (val) => {
    switch(val){
      case 'temp': console.log('temperature')
        if(selectedParam.temp) {
          setSelectedParam({
            temp: false,
            hum: false,
            light: false,
            co2: false
          })
          setShowChart(false)
          break;
        }
        setSelectedParam({
          temp: true,
          hum: false,
          light: false,
          co2: false
        })
        setShowChart(true)
        break;
      case 'hum': console.log('humidity')
        if(selectedParam.hum) {
          setSelectedParam({
            temp: false,
            hum: false,
            light: false,
            co2: false
          })
          setShowChart(false)
          break;
        }
        setSelectedParam({
          temp: false,
          hum: true,
          light: false,
          co2: false
        })
        setShowChart(true)
        break;
      case 'light': console.log('light intensity')
        if(selectedParam.light) {
          setSelectedParam({
            temp: false,
            hum: false,
            light: false,
            co2: false
          })
          setShowChart(false)
          break;
        }
        setSelectedParam({
          temp: false,
          hum: false,
          light: true,
          co2: false
        })
        setShowChart(true)
        break; 
      case 'co2': console.log('co2 level')
        if(selectedParam.co2) {
          setSelectedParam({
            temp: false,
            hum: false,
            light: false,
            co2: false
          })
          setShowChart(false)
          break;
        }
        setSelectedParam({
          temp: false,
          hum: false,
          light: false,
          co2: true
        })
        setShowChart(true)
        break;
      default:
        break;
    }
  }

  const sort = async (sort) => {
    setSort(sort)
    await fetchChartReadings(startDate, endDate, sort, (page*limit)-limit)
  }

  const setDateFrom = async (date) => {
    setStartDate(date)
    console.log('set date from', date)

    console.log('DATE FROM:', startDate)
    await fetchChartReadings(date, endDate, _sort, (page*limit)-limit)
  }

  const setDateTo = async (date) => {
    setEndDate(date)
    console.log('set date to', date)

    console.log('DATE TO:', endDate)
    await fetchChartReadings(startDate, date, _sort, (page*limit)-limit)
  }

  const handleSetPage = async (_page) => {
    setPage(_page)
    console.log(_page)
    await fetchChartReadings(startDate, endDate, _sort, (_page*limit)-limit)
  }

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
                    <div className="flex text-4xl justify-center">
                      {moment(weather?.date_time).format('LT')}
                    </div>
                    <p>{moment(weather?.date_time).format('ll')}</p>
                  </div>
                  <div className="flex justify-center mt-3">
                    <div>
                      <div className="flex text-4xl justify-center">
                        {weather?.temp_in_c}
                        <p className="text-lg right-1/2 ml-1"> °C</p>
                      </div>
                      <p>{weather?.condition?.text}</p>
                    </div>
                    <div className="mx-10">
                      <div className="flex text-5xl justify-center relative left-2">
                        {weather.humidity}
                        <p className="text-xl right-1/2 ml-1"> %</p>
                      </div>
                      <p>Humidity</p>
                    </div>
                    <div>
                      <div className="flex text-5xl justify-center relative left-2">
                        {weather.precip}
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
                <div className={`flex flex-col justify-center align-middle w-1/2 text-center hover:border-sky-400 hover:border-4 cursor-pointer ${selectedParam.temp ? 'border-sky-400 border-4':''}`} onClick={()=>handleClick('temp')}>
                  <div className="flex text-5xl justify-center relative left-3">
                    {sensorReadings?.attributes?.spr_temperature}
                    <p className="text-xl right-1/2 ml-1">°C</p>
                  </div>
                  <p>Temperature</p>
                  <div className="flex justify-center mt-2">
                  <Line width={"110%"} height={"45%"} options={options} data={chartFogTemp} />
                  </div>
                </div>
                <div className={`flex flex-col justify-center align-middle w-1/2 text-center hover:border-sky-400 hover:border-4 cursor-pointer ${selectedParam.hum ? 'border-sky-400 border-4':''}`} onClick={()=>handleClick('hum')}>
                  <div className="flex text-5xl justify-center relative left-3">
                    {sensorReadings?.attributes?.spr_humidity}
                    <p className="text-xl right-1/2 ml-1"> %</p>
                  </div>
                  <p>Humidity</p>
                  <div className="flex justify-center mt-2">
                  <Line width={"110%"} height={"45%"} options={options} data={chartFogHumidity} />
                  </div>
                </div>

                {/* just a line in the middle */}
                <div className="border-slate-400 border-r h-full ml-5 absolute right-1/2"></div>
              </div>
            </div>

            <div className="h-1/3 pt-2">
              <div className="border-slate-400 border rounded flex relative h-full">
                <div className={`flex flex-col justify-center align-middle w-1/2 text-center hover:border-sky-400 hover:border-4 cursor-pointer ${selectedParam.light ? 'border-sky-400 border-4':''}`} onClick={()=>handleClick('light')}>
                  <div className="flex text-5xl justify-center relative left-3">
                    {sensorReadings?.attributes?.spr_light_intensity}
                    <p className="text-lg right-1/2 ml-1">cd</p>
                  </div>
                  <p>Light Intensity</p>
                  <div className="flex justify-center mt-2">
                  <Line width={"110%"} height={"45%"} options={options} data={chartFogLightIntensity} />
                  </div>
                </div>
                <div className={`flex flex-col justify-center align-middle w-1/2 text-center hover:border-sky-400 hover:border-4 cursor-pointer ${selectedParam.co2 ? 'border-sky-400 border-4':''}`} onClick={()=>handleClick('co2')}>
                  <div className="flex text-4xl justify-center relative left-3">
                    {sensorReadings?.attributes?.spr_co2}
                    <p className="text-lg right-1/2 ml-1"> ppm</p>
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
          </div>
          <div className="h-full w-2/3">
          {/* <div className="h-full w-2/3 overflow-x-hidden"> */}
            <div style={{height: 'calc(6% + 1rem)', paddingBottom: '1rem'}} className="">
              {/* <div className="border-slate-400 border rounded h-full flex items-center justify-between" >
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
              </div> */}
              <div className="border-slate-400 border mb-3 rounded p-2 px-4 relative flex justify-between items-center">
                <div className="flex items-center">
                  <FileDownloadIcon className='border-slate-300 border rounded p-1 text-sky-400 hover:text-white cursor-pointer hover:bg-sky-500' style={{fontSize: '36px', }}></FileDownloadIcon>
                  <label className='ml-3' style={{position: 'relative', top: '1px'}}>Download</label>
                </div>
                <div className=''>
                  <label className='mr-2'>Sort:</label>
                  <select name="sort" id="sort" className='border-slate-300 border rounded h-9 w-20 pl-2' onChange={e=>sort(e.target.value)}>
                    <option value="asc">asc</option>
                    <option value="desc">desc</option>
                  </select>
                  <label className='mr-2 ml-3'>From:</label>
                  <DatePicker className='border-slate-300 border rounded w-32 h-9 pl-2' selected={startDate} onChange={(date) => setDateFrom(date)}/>
                  <label className='ml-3 mr-2'>To:</label>
                  <DatePicker className='border-slate-300 border rounded w-32 h-9 pl-2' selected={endDate} onChange={(date) => setDateTo(date)}/>
                  <FilterAltIcon className='ml-1' style={{fontSize: '36px', color: 'rgb(14 165 233)'}}></FilterAltIcon>
                </div>
              </div>
            </div>
            
            <div>
            {/* <div className="" style={{height: 'calc(88% - 2rem)'}}> */}

              {/* insert line chart here... */}
              { showChart &&
                <div className="border-slate-400 border rounded mb-3 p-2 flex justify-center" style={{width: '100%', height: '320px'}}>
                  <Line  options={options2} data={tempData} />
                  {/* <Line width={"100"} height={"100"} options={options2} data={tempData} /> */}
                </div>
              }
              <div className="border-slate-400 border rounded " >
              <TableContainer component={Paper} sx={{  }}>
                <Table sx={{  }}>
                    <TableHead>
                    <TableRow>
                      <StyledTableCell><span className='font-bold'>Temperature</span></StyledTableCell>
                      <StyledTableCell><span className='font-bold'>Humidity</span></StyledTableCell>
                      <StyledTableCell><span className='font-bold'>CO2 level</span></StyledTableCell>
                      <StyledTableCell><span className='font-bold'>Light Intensity</span></StyledTableCell>
                      <StyledTableCell><span className='font-bold'>Date/Time</span></StyledTableCell>
                    </TableRow>
                    </TableHead>
                    { showChart &&
                      <TableBody>
                        {
                          arr2.map((i)=>(
                            <StyledTableRow key={i}>
                              <StyledTableCell component="th" scope="row">30.1 °C</StyledTableCell>
                              <StyledTableCell component="th" scope="row">80 %</StyledTableCell>
                              <StyledTableCell component="th" scope="row">200 ppm</StyledTableCell>
                              <StyledTableCell component="th" scope="row">255 cd</StyledTableCell>
                              <StyledTableCell >Feb 25, 2025</StyledTableCell>
                            </StyledTableRow>
                          ))
                        }
                      </TableBody>
                    }
                    { !showChart &&
                      <TableBody>
                        {
                          tableData.map((i)=>(
                            <StyledTableRow key={i?.id}>
                              <StyledTableCell component="th" scope="row">{i?.attributes.spr_temperature} °C</StyledTableCell>
                              <StyledTableCell component="th" scope="row">{i?.attributes.spr_humidity} %</StyledTableCell>
                              <StyledTableCell component="th" scope="row">{i?.attributes.spr_co2} ppm</StyledTableCell>
                              <StyledTableCell component="th" scope="row">{i?.attributes.spr_light_intensity} cd</StyledTableCell>
                              <StyledTableCell >{moment(i?.attributes.createdAt).format('LTS')} - {moment(i?.attributes.createdAt).format('LL')}</StyledTableCell>
                            </StyledTableRow>
                          ))
                        }
                      </TableBody>
                    }
                    
                </Table>
              </TableContainer>
              </div>
            </div>
            <div style={{height: 'calc(6% + 1rem)', paddingTop: '1rem'}} className="">
              <div className="border-slate-400 border rounded h-full flex justify-center items-center" >
                <Stack spacing={3}>
                  <Pagination onChange={(e, page)=>handleSetPage(page)}  count={paginationCount} page={page} variant="outlined" shape="rounded" />
                </Stack>
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
                  <div className="flex text-4xl justify-center">
                    {moment(weather?.date_time).format('LT')}
                  </div>
                  <p>{moment(weather?.date_time).format('ll')}</p>
                </div>
                <div className="flex justify-center mt-3">
                  <div>
                    <div className="flex text-4xl justify-center">
                      {weather?.temp_in_c}
                      <p className="text-lg right-1/2 ml-1"> °C</p>
                    </div>
                    <p>{weather?.condition?.text}</p>
                  </div>
                  <div className="mx-6">
                    <div className="flex text-4xl justify-center">
                      {weather.humidity}
                      <p className="text-lg right-1/2 ml-1"> %</p>
                    </div>
                    <p>Humidity</p>
                  </div>
                  <div>
                    <div className="flex text-4xl justify-center">
                      {weather.precip}
                      <p className="text-lg right-1/2 ml-1"> mm</p>
                    </div>
                    <p>Precipitation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-slate-400 border h-1/3 mb-4 rounded flex relative">
              <div onClick={()=>{router.push('/dashboard/sprinkler/temperature')}} className="flex flex-col justify-center align-middle w-1/2 text-center">
                <div className="flex text-5xl justify-center">
                  {sensorReadings?.attributes?.spr_temperature}
                  <p className="text-sm right-1/2 ml-1">°C</p>
                </div>
                <p>Temperature</p>
                <div className="flex justify-center mt-2">
                <Line width={"110%"} height={"45%"} options={options} data={chartFogTemp} />
                </div>
              </div>
              <div onClick={()=>{router.push('/dashboard/sprinkler/humidity')}} className="flex flex-col justify-center align-middle w-1/2 text-center">
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
              <div onClick={()=>{router.push('/dashboard/sprinkler/light-intensity')}} className="flex flex-col justify-center align-middle w-1/2 text-center">
                <div className="flex text-5xl justify-center">
                  {sensorReadings?.attributes?.spr_light_intensity}
                  <p className="text-sm right-1/2 ml-1">cd</p>
                </div>
                <p>Light Intensity</p>
                <div className="flex justify-center mt-2">
                <Line width={"110%"} height={"45%"} options={options} data={chartFogLightIntensity} />
                </div>
              </div>
              <div onClick={()=>{router.push('/dashboard/sprinkler/co2')}} className="flex flex-col justify-center align-middle w-1/2 text-center">
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
              <div className="border-slate-400 border-r h-full ml-5 absolute right-1/2">
                
              </div>
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