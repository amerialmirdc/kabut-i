import axios from 'axios'

const server_url = 'https://i-pond-backend.ap.ngrok.io/api'

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

const getDashboardChartData = async () => {
    let data = {}
    
    console.log(localStorage.getItem('token'))

    await axios.get(`${server_url}/kabuti-readings?sort[0]=createdAt%3Adesc&pagination[limit]=21`).then(res=>{
        console.log('response:', res)
        data = res?.data.data
    }).catch(err=>{
        console.log(err)
    })
    
    return data
}


export {
    getCurrentReadings,
    getDashboardChartData
}