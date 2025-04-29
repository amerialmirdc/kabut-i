import axios from 'axios'
import moment from 'moment'

const server_url = 'https://i-pond-backend.ap.ngrok.io/api'

const displayDateOnly = (data) => {
    const date = moment(data);
    const formattedDate = date.format("YYYY-MM-DD");
    return formattedDate;
};

const getCurrentReadings = async () => {
    let readings = {}
    
    console.log(localStorage.getItem('token'))

    await axios.get(`${server_url}/kabuti-readings?sort[0]=createdAt%3Adesc&pagination[limit]=1`).then(res=>{
        console.log('response:', res)
        readings = res?.data.data
    }).catch(err=>{
        console.log(err)
    })
    
    return readings
}

const getDashboardChartData = async (dateFrom, dateTo, sort, offset) => {
    console.log('DATE FROM:', displayDateOnly(dateFrom))
    console.log('DATE TO:', displayDateOnly(moment(dateTo).add(1,'d')))
    console.log('OFFSET:', offset)
    let data = {}
    let meta = {}
    
    console.log(localStorage.getItem('token'))

    await axios.get(`${server_url}/kabuti-readings?filters[createdAt][$gte]=${displayDateOnly(dateFrom)}&filters[createdAt][$lte]=${displayDateOnly(moment(dateTo).add(1,'d'))}&sort[0]=createdAt%3A${sort}&pagination[start]=${offset}&pagination[limit]=21`).then(res=>{
    // await axios.get(`${server_url}/kabuti-readings?filters[createdAt][$gte]=${displayDateOnly(dateFrom)}T00:00:00Z&filters[createdAt][$lte]=${displayDateOnly(moment(dateTo).add(1,'d'))}T00:00:00Z&sort[0]=createdAt%3A${sort}&pagination[start]=${offset}&pagination[limit]=21`).then(res=>{
        console.log('response:', res)
        data = res?.data.data
        meta = res?.data.meta
    }).catch(err=>{
        console.log(err)
    })
    
    return {data, meta}
}

const getTodayHighLowReadings = async (dateFrom, dateTo) => {
    let data2 = {}
    
    console.log(localStorage.getItem('token'))
    console.log('LH date:', displayDateOnly(dateFrom))
    console.log('LH date:', displayDateOnly(moment(dateTo).add(1,'d')))

    await axios.get(`${server_url}/kabuti-readings?filters[createdAt][$gte]=${displayDateOnly(dateFrom)}&filters[createdAt][$lte]=${displayDateOnly(moment(dateTo).add(1,'d'))}&pagination[limit]=2000`).then(res=>{
        console.log('high:low: ', res)
        data2 = res?.data.data
    }).catch(err=>{
        console.log(err)
    })
    
    return {data2}
}


export {
    getCurrentReadings,
    getDashboardChartData,
    getTodayHighLowReadings
}