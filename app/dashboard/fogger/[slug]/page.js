'use client'
import * as React from 'react';
import { useState } from "react";
import DatePicker from "react-datepicker";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('29.1 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('29.7 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('30.3 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('29.3 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('29.4 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('29.5 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('29.9 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('30 °C', '4:16 am Jan 21, 25', 'Normal'),
  createData('31.2 °C', '4:16 am Jan 21, 25', 'Warning'),
  createData('34.5 °C', '4:16 am Jan 21, 25', 'High'),
];

export default function Temperature() {
  const [startDate, setStartDate] = useState(new Date());
  const params = useParams()

  console.log('params', params)

  return (
    <div className='p-4'>
        <div className="border-slate-400 border h-1/3 mb-3 rounded p-4 relative flex">
            <div className='w-1/3 flex items-center justify-center'>
                <div className='text-center'>
                    <div className="flex text-4xl justify-center font-bold">
                        29.3
                        <p className="text-lg right-1/2 ml-1"> °C</p>
                    </div>
                    <p className='text-xs'>Current <br/>Temperature </p>
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
                <Line width={"100%"} height={"45%"} options={options} data={tempData} />
            </div>
        </div>
        <div className="border-slate-400 border h-1/3 mb-3 rounded p-2 relative flex justify-between">
            <FileDownloadIcon className='border-slate-300 border rounded'></FileDownloadIcon>
            <select name="sort" id="sort" className='border-slate-300 border rounded' style={{width: '15%'}}>
                <option value="asc">asc</option>
                <option value="desc">desc</option>
            </select>
            <div className=''>
                <label className=''>from:</label>
                <DatePicker className='border-slate-300 border rounded w-24' selected={startDate} onChange={(date) => setStartDate(date)}/>
                <label className=''>to:</label>
                <DatePicker className='border-slate-300 border rounded w-24' selected={startDate} onChange={(date) => setStartDate(date)}/>
            </div>
        </div>
        <div>
            <TableContainer component={Paper} sx={{  }}>
                <Table sx={{  }}>
                {/* <Table sx={{ minWidth: 700 }} aria-label="customized table"> */}
                    <TableHead>
                    <TableRow>
                        <StyledTableCell><span className='font-black'>Temp in °C</span></StyledTableCell>
                        <StyledTableCell><span className='font-black'>Date and Time</span></StyledTableCell>
                        <StyledTableCell><span className='font-black'>Status</span></StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">
                            {row.name}
                        </StyledTableCell>
                        <StyledTableCell >{row.calories}</StyledTableCell>
                        <StyledTableCell>{row.fat}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div className="border-slate-400 border h-1/3 mt-3 rounded py-2 relative flex justify-center">
            <Stack spacing={3}>
                <Pagination  count={11} defaultPage={6} variant="outlined" shape="rounded" />
            </Stack>
        </div>
    </div>
  );
}
