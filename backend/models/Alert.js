const mongoose =
    require("mongoose");

const alertSchema =
    new mongoose.Schema(
        {

            type: {
                type: String,
                enum: [
                    "ROAD_BLOCKED",
                    "HIGH_RISK",
                    "DELIVERY_DELAY",
                    "VEHICLE_DELAY",
                    "WEATHER",
                    "INCIDENT",
                    "OTHER"
                ],
                required: true
            },

            severity: {
                type: String,
                enum: [
                    "LOW",
                    "MEDIUM",
                    "HIGH",
                    "CRITICAL"
                ],
                default: "MEDIUM"
            },

            title: {
                type: String,
                required: true
            },

            message: {
                type: String,
                required: true
            },

            roadId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Road",
                default: null
            },

            vehicleId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vehicle",
                default: null
            },

            deliveryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Delivery",
                default: null
            },

            status: {
                type: String,
                enum: [
                    "UNREAD",
                    "READ",
                    "RESOLVED"
                ],
                default: "UNREAD"
            }
        },

        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Alert",
        alertSchema
    );