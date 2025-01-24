import {Schema, model, models} from "mongoose";

const SensorReadingSchema = new Schema(
    {
        tent_number: {
            type: Number,
            require: true
        },
        lightIntensity: {
            type: Number,
            require: true
        },
        CO2_level: {
            type: Number,
            require: true
        },
        humidity: {
            type: Number,
            require: true
        },
        temperature: {
            type: Number,
            require: true
        },
    },
    {
        timestamps: true
    }
)

const SensorReading = models.SensorReading || model("SensorReading", SensorReadingSchema)

export default SensorReading;