import connect from '@/app/db/db'
import SensorReading from '@/app/db/models/sensor-reading';
import { NextResponse } from "next/server"
import { headers } from 'next/headers'
import axios from 'axios'


export const GET = async () => {
    try{

        // mongodb 
        // blocked by mirdc network
        await connect();
        const sensorReading = await SensorReading.find();
        return new NextResponse(`${JSON.stringify(sensorReading)} here`, {status: 200});
    } catch (error) {
        return new NextResponse("Error in fetching Sensor Readings, " + error.message, {status: 500});
    }
}

export const POST = async (request) => {
    
    try{
        const headersList = await headers()
        const body = await request.json();
        // console.log("body", body)
        // console.log('token', request.headers['authorization'])

        const config = {
            headers: {
                "Authorization": headersList.get('authorization')
            }
        }
        
        const fog_light_intensity = body.data.fog_light_intensity
        const fog_co2 = body.data.fog_co2
        const fog_humidity = body.data.fog_humidity
        const fog_temperature = body.data.fog_temperature
        const spr_light_intensity = body.data.spr_light_intensity
        const spr_co2 = body.data.spr_co2
        const spr_humidity = body.data.spr_humidity
        const spr_temperature = body.data.spr_temperature

        let error_ = "";
        let response_ = "";
        console.log('body', body)

        // send to mongodb
        await connect();
        const newReadings = new SensorReading({
            fog_light_intensity: fog_light_intensity,
            fog_co2: fog_co2,
            fog_humidity: fog_humidity,
            fog_temperature: fog_temperature,
            spr_light_intensity: spr_light_intensity,
            spr_co2: spr_co2,
            spr_humidity: spr_humidity,
            spr_temperature: spr_temperature
        });
        await newReadings.save()

        return new NextResponse(JSON.stringify({message: 'sent data to mongodb' }),
            {status: 200}
        );
        

        // send data to amerial server
        // await axios.post('https://i-pond-backend.ap.ngrok.io/api/kabuti-readings', body, config)
        //     .then(async response => {
        //       // send to mongodb
        //         await connect();
        //         const newReadings = new SensorReading({
        //             fog_light_intensity: fog_light_intensity,
        //             fog_co2: fog_co2,
        //             fog_humidity: fog_humidity,
        //             fog_temperature: fog_temperature,
        //             spr_light_intensity: spr_light_intensity,
        //             spr_co2: spr_co2,
        //             spr_humidity: spr_humidity,
        //             spr_temperature: spr_temperature
        //         });
        //         await newReadings.save()
        //         // end

        //         response_ = response
        //         console.log('success')
        //     }).catch(err => {
        //         error_ = err;
        //         console.log('error')
        //     })
        // //end

        // if(error_){
        //     console.log(error_)
        //     return new NextResponse(JSON.stringify({message: 'Error in sending data to amerial server', error: error_}),
        //         {status: 500}
        //     );
        // }else{
        //     return new NextResponse(JSON.stringify({message: 'sent data to amerial server', data: response_.data }),
        //         {status: 200}
        //     );
        // }
        
    }catch (error) {
        return new NextResponse("Error in inserting sensor readings " + error.message, {status: 500});
    }
}