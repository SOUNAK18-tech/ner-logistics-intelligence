const mongoose =
    require("mongoose");

const vehicleSchema =
    new mongoose.Schema(
        {

            vehicleNumber: {
                type: String,
                required: true,
                unique: true
            },

            vehicleType: {
                type: String,
                default: "Truck"
            },

            driverName: {
                type: String,
                default: ""
            },

            cargoType: {
                type: String,
                default: ""
            },

            capacityKg: {
                type: Number,
                default: 0
            },

            status: {
                type: String,
                enum: [
                    "AVAILABLE",
                    "IN_TRANSIT",
                    "DELIVERED",
                    "DELAYED",
                    "MAINTENANCE"
                ],
                default: "AVAILABLE"
            },

            currentLocation: {
                type: {
                    type: String,
                    enum: [
                        "Point"
                    ],
                    default: "Point"
                },

                coordinates: {
                    type: [
                        Number
                    ],
                    default: [
                        0,
                        0
                    ]
                }
            },

            lastUpdated: {
                type: Date,
                default: Date.now
            }
        },

        {
            timestamps: true
        }
    );

vehicleSchema.index(
    {
        currentLocation:
            "2dsphere"
    }
);

module.exports =
    mongoose.model(
        "Vehicle",
        vehicleSchema
    );