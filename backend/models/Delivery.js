const mongoose =
    require("mongoose");

const deliverySchema =
    new mongoose.Schema(
        {

            deliveryId: {
                type: String,
                required: true,
                unique: true
            },

            vehicleId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vehicle",
                default: null
            },

            origin: {
                type: String,
                required: true
            },

            destination: {
                type: String,
                required: true
            },

            cargoType: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                default: 0
            },

            priority: {
                type: String,
                enum: [
                    "CRITICAL",
                    "HIGH",
                    "MEDIUM",
                    "NORMAL"
                ],
                default: "NORMAL"
            },

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "IN_TRANSIT",
                    "DELIVERED",
                    "DELAYED",
                    "CANCELLED"
                ],
                default: "PENDING"
            },

            plannedDeparture: {
                type: Date,
                default: null
            },

            estimatedArrival: {
                type: Date,
                default: null
            },

            actualArrival: {
                type: Date,
                default: null
            }
        },

        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Delivery",
        deliverySchema
    );