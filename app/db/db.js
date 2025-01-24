import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

const connect = async () => {

    try {
         mongoose.connect(MONGODB_URI, {
            dbName: 'kabuti',
            bufferCommands: true
        });

         mongoose.connection.on('error', err => {
            // logError(err);
            console.log('error', err)
        });
    } catch (err) {
        console.log("Error: ", err);
        throw new Error("Error", err.message);
    }

    const connectionState = mongoose.connection.readyState
    console.log('herree', connectionState)

    if(connectionState === 1){
        console.log("already connected!");
        return;
    }

    if(connectionState === 2) {
        console.log('Connecting...');
        return;
    }
}

export default connect;