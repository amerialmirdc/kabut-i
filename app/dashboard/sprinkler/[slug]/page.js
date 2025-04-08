'use client'
import * as React from 'react';
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment'
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import "react-datepicker/dist/react-datepicker.css";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useParams } from 'next/navigation'
import {getCurrentReadings, getDashboardChartData} from '@/app/composables/fetchSensorReadings'

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

export default function Temperature() {
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [_sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)
  const [paginationCount, setPaginationCount] = useState(1)
  const [currentParam, setCurrentParam] = useState('')
  const [paramsData, setParamsData] = useState([])
  const [currentReadings, setCurrentReadings] = useState([])
  const [data, setData] = useState([])
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

  const checkParams = () => {
    console.log('params', params.slug)

    switch(params.slug){
      case 'temperature': 
        console.log('temperature')
        setCurrentParam('temperature')
        break;
      case 'humidity': 
        console.log('humidity')
        setCurrentParam('humidity')
        break;
      case 'light-intensity': 
        console.log('light-intensity')
        setCurrentParam('light-intensity')
        break;
      case 'co2': 
        console.log('co2')
        setCurrentParam('co2')
        break;
      default: 
        console.log('default')
        break;
    }
  }

  const fetchChartReadings = async (datefrom, dateto, sort, _offset) => {
    const {data, meta} = await getDashboardChartData(datefrom, dateto, sort, _offset)
    const currentReadings = await getCurrentReadings()
    setCurrentReadings(currentReadings[0])
    setPaginationCount(Math.ceil(meta?.pagination.total/21))

    console.log('current readings', currentReadings[0])

    console.log('data', data)
    setData(data)

    let formattedFogTemp = [];
    let formattedFogHumidity = [];
    let formattedFogLightIntensity = [];
    let formattedFogCO2Level = [];

    let formattedFogTemp_ = [];
    let formattedFogHumidity_ = [];
    let formattedFogLightIntensity_ = [];
    let formattedFogCO2Level_ = [];

    console.log('chart data', data)
    data.forEach(i=>{
      formattedFogTemp.push({
        reading: i?.attributes.spr_temperature,
        date: `${moment(i?.attributes.createdAt).format('LT')} ${moment(i?.attributes.createdAt).format('ll')}`,
        id: i?.id
      })
      formattedFogHumidity.push({
        reading: i?.attributes.spr_humidity,
        date: `${moment(i?.attributes.createdAt).format('LT')} ${moment(i?.attributes.createdAt).format('ll')}`,
        id: i?.id
      })
      formattedFogLightIntensity.push({
        reading: i?.attributes.spr_light_intensity,
        date: `${moment(i?.attributes.createdAt).format('LT')} ${moment(i?.attributes.createdAt).format('ll')}`,
        id: i?.id
      })
      formattedFogCO2Level.push({
        reading: i?.attributes.spr_co2,
        date: `${moment(i?.attributes.createdAt).format('LT')} ${moment(i?.attributes.createdAt).format('ll')}`,
        id: i?.id
      })

      formattedFogTemp_.push(i?.attributes.spr_temperature)
      formattedFogHumidity_.push(i?.attributes.spr_humidity)
      formattedFogLightIntensity_.push(i?.attributes.spr_light_intensity)
      formattedFogCO2Level_.push(i?.attributes.spr_co2)
    })

    setParamsData({
      temp: formattedFogTemp,
      humid: formattedFogHumidity,
      light: formattedFogLightIntensity,
      CO2: formattedFogCO2Level
    })

    setChartFogTemp({
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: formattedFogTemp_,
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
          data: formattedFogHumidity_,
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
          data: formattedFogLightIntensity_,
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
          data: formattedFogCO2Level_,
          borderColor: '#49ABDF',
          lineTension: 0.4
        }
      ],
    })
  }

  useEffect(()=>{
    checkParams()
    fetchChartReadings(dateFrom, dateTo, _sort, (page*21)-21)
    
  }, [])

  const handleSetDateFrom = async (date) => {
    setDateFrom(date)
    console.log(date)
    // refetch data
    await fetchChartReadings(date, dateTo, _sort, (page*21)-21)
  }

  const handleSetDateTo = async (date) => {
    setDateTo(date)
    console.log(date)
    // refetch data
    await fetchChartReadings(dateFrom, date, _sort, (page*21)-21)
  }
  
  const handleSetSort = async (sort) => {
    setSort(sort)
    await fetchChartReadings(dateFrom, dateTo, sort, (page*21)-21)
  }

  const handleSetPage = async (_page) => {
    setPage(_page)
    console.log(_page)
    await fetchChartReadings(dateFrom, dateTo, _sort, (_page*21)-21)
  }

  return (
    <div className='p-4'>
        <div className="border-slate-400 border h-1/3 mb-3 rounded p-4 relative flex">
            <div className='w-1/3 flex items-center justify-center'>
                <div className='text-center'>
                    <div className="flex text-4xl justify-center font-bold">
                        { currentParam==='temperature' && 
                          <>
                            { currentReadings?.attributes?.spr_temperature }
                            <p className="text-lg right-1/2 ml-1"> °C</p>
                          </>
                        }
                        { currentParam==='humidity' && 
                          <>
                            { currentReadings?.attributes?.spr_humidity  }
                            <p className="text-lg right-1/2 ml-1"> %</p>
                          </>
                        }
                        { currentParam==='light-intensity' && 
                          <>
                            { currentReadings?.attributes?.spr_light_intensity   }
                            <p className="text-lg right-1/2 ml-1"> cd</p>
                          </>
                        }
                        { currentParam==='co2' && 
                          <>
                            { currentReadings?.attributes?.spr_co2   }
                            <p className="text-lg right-1/2 ml-1"> ppm</p>
                          </>
                        }
                        
                    </div>
                    <p className='text-xs capitalize'>Current <br/>{currentParam} </p>
                </div>
            </div>
            <div className='w-1/3 flex flex-col justify-center items-center'>
                <div className='text-center'>
                    <div className="flex text-xl justify-center font-bold">
                        29.3
                        <p className="text-xs right-1/2 ml-1"> °C</p>
                    </div>
                    <p className='text-xs'>Today-highest </p>
                </div>
                <div className='text-center'>
                    <div className="flex text-xl justify-center font-bold">
                        29.3
                        <p className="text-xs right-1/2 ml-1"> °C</p>
                    </div>
                    <p className='text-xs'>Today-lowest</p>
                </div>
            </div>
            <div className='w-1/3 flex items-center justify-center px-2'>
                { currentParam==='temperature' &&
                  <Line width={"100%"} height={"45%"} options={options} data={chartFogTemp} />
                }
                { currentParam==='humidity' &&
                  <Line width={"100%"} height={"45%"} options={options} data={chartFogHumidity} />
                }
                { currentParam==='light-intensity' &&
                  <Line width={"100%"} height={"45%"} options={options} data={chartFogLightIntensity} />
                }
                { currentParam==='co2' &&
                  <Line width={"100%"} height={"45%"} options={options} data={chartFogCO2Level} />
                }
            </div>
        </div>
        <div className="border-slate-400 border h-1/3 mb-3 rounded p-2 relative flex justify-between">
            <FileDownloadIcon className='border-slate-300 border rounded'></FileDownloadIcon>
            <select value={_sort} onChange={(e) => handleSetSort(e.target.value) } name="sort" id="sort" className='border-slate-300 border rounded' style={{width: '15%'}}>
                <option value="asc">asc</option>
                <option value="desc">desc</option>
            </select>
            <div className=''>
                <label className=''>from:</label>
                <DatePicker className='border-slate-300 border rounded w-24' selected={dateFrom} onChange={(date) => handleSetDateFrom(date)}/>
                <label className=''>to:</label>
                <DatePicker className='border-slate-300 border rounded w-24' selected={dateTo} onChange={(date) => handleSetDateTo(date)}/>
            </div>
        </div>
        <div>
            <TableContainer component={Paper} sx={{  }}>
                <Table sx={{  }}>
                {/* <Table sx={{ minWidth: 700 }} aria-label="customized table"> */}
                    <TableHead>
                    <TableRow>
                        { currentParam==='temperature' &&
                          <StyledTableCell><span className='font-black'>Temp in °C</span></StyledTableCell>
                        }
                        { currentParam==='humidity' &&
                          <StyledTableCell><span className='font-black'>Humidity</span></StyledTableCell>
                        }
                        { currentParam==='light-intensity' &&
                          <StyledTableCell><span className='font-black'>Light Intensity</span></StyledTableCell>
                        }
                        { currentParam==='co2' &&
                          <StyledTableCell><span className='font-black'>CO2</span></StyledTableCell>
                        }
                        <StyledTableCell><span className='font-black'>Date/Time</span></StyledTableCell>
                        <StyledTableCell><span className='font-black'>Status</span></StyledTableCell>
                    </TableRow>
                    </TableHead>
                    { currentParam==='temperature' && 
                      <TableBody>
                      {paramsData?.temp?.map((i) => (
                          <StyledTableRow key={i.id}>
                            <StyledTableCell component="th" scope="row">
                                {i?.reading} °C
                            </StyledTableCell>
                            <StyledTableCell >{i?.date}</StyledTableCell>
                            <StyledTableCell>Normal</StyledTableCell>
                          </StyledTableRow>
                      ))}
                      </TableBody>
                    }

                    { currentParam==='humidity' && 
                      <TableBody>
                      {paramsData?.humid?.map((i) => (
                          <StyledTableRow key={i.id}>
                            <StyledTableCell component="th" scope="row">
                                {i?.reading} %
                            </StyledTableCell>
                            <StyledTableCell >{i?.date}</StyledTableCell>
                            <StyledTableCell>Normal</StyledTableCell>
                          </StyledTableRow>
                      ))}
                      </TableBody>
                    }

                    { currentParam==='light-intensity' && 
                      <TableBody>
                      {paramsData?.light?.map((i) => (
                          <StyledTableRow key={i.id}>
                            <StyledTableCell component="th" scope="row">
                                {i?.reading} cd
                            </StyledTableCell>
                            <StyledTableCell >{i?.date}</StyledTableCell>
                            <StyledTableCell>Normal</StyledTableCell>
                          </StyledTableRow>
                      ))}
                      </TableBody>
                    }

                    { currentParam==='co2' && 
                      <TableBody>
                      {paramsData?.CO2?.map((i) => (
                          <StyledTableRow key={i.id}>
                            <StyledTableCell component="th" scope="row">
                                {i?.reading} ppm
                            </StyledTableCell>
                            <StyledTableCell >{i?.date}</StyledTableCell>
                            <StyledTableCell>Normal</StyledTableCell>
                          </StyledTableRow>
                      ))}
                      </TableBody>
                    }
                    
                </Table>
            </TableContainer>
        </div>
        <div className="border-slate-400 border h-1/3 mt-3 rounded py-2 relative flex justify-center">
            <Stack spacing={3}>
                <Pagination onChange={(e, page)=>handleSetPage(page)}  count={paginationCount} page={page} variant="outlined" shape="rounded" />
            </Stack>
        </div>
    </div>
  );
}
