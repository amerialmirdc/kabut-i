import connect from '@/app/db/db'
import SensorReading from '@/app/db/models/sensor-reading';
import { NextResponse } from "next/server"

export const GET = async () => {
    try{

        // mongodb 
        // blocked by mirdc network
        await connect();
        const sensorReading = await SensorReading.find();
        return new NextResponse(JSON.stringify(sensorReading), {status: 200});
    } catch (error) {
        return new NextResponse("Error in fetching Sensor Readings, " + error.message, {status: 500});
    }
}

// export const POST = async (request) => {
//     try{
//         const body = await request.json();
//         console.log("body", body)
//         await connect();

//         // checks if the attendee already attend today
//         // let today = new Date();
//         // let date_today = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

//         // const alreadyAttended = await Attendance.findOne({attendee: body.attendee, date_attended: date_today}).populate("attendee");
//         const alreadyAttended = await Attendance.findOne({
//             attendee: body.attendee, 
//             date_attended: body.date_today,
//             service_number: body.service_number
//         }).populate("attendee");
//         //
//         if(alreadyAttended){
//             return new NextResponse(JSON.stringify({message: 'Attendance is already recorded for today!', alreadyAttended}),
//                 {status: 200}
//             );
//         }else{
//             const newAttendance = new Attendance({
//                 attendee: body.attendee,
//                 date_attended: body.date_today,
//                 service_number: body.service_number
//             });
//             await newAttendance.save()

//             return new NextResponse(JSON.stringify({message: 'Attendance is created', attendance: newAttendance}),
//                 {status: 200}
//             );
//         }
        

//     }catch (error) {
//         return new NextResponse("Error in creating a attendance " + error.message, {status: 500});
//     }
// }