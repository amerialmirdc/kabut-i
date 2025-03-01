import {Schema, model, models} from "mongoose";

const SensorReadingSchema = new Schema(
    {
        fog_light_intensity: {
            type: Number,
            require: true
        },
        fog_co2: {
            type: Number,
            require: true
        },
        fog_humidity: {
            type: Number,
            require: true
        },
        fog_temperature: {
            type: Number,
            require: true
        },
        spr_light_intensity: {
            type: String, // made string to catch trial data
            require: true
        },
        spr_co2: {
            type: Number,
            require: true
        },
        spr_humidity: {
            type: Number,
            require: true
        },
        spr_temperature: {
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