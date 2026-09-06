const mongoose =
    require("mongoose");

const roadSchema =
    new mongoose.Schema(
        {

            osmId: {
                type: String,
                required: true,
                unique: true
            },

            name: {
                type: String,
                default: ""
            },

            highway: {
                type: String,
                default: ""
            },

            ref: {
                type: String,
                default: ""
            },

            roadType: {
                type: String,
                default: ""
            },

            surface: {
                type: String,
                default: ""
            },

            lengthKm: {
                type: Number,
                default: 0
            },

            lanes: {
                type: Number,
                default: null
            },

            oneway: {
                type: Boolean,
                default: false
            },

            bridge: {
                type: Boolean,
                default: false
            },

            tunnel: {
                type: Boolean,
                default: false
            },

            elevationM: {
                type: Number,
                default: 0
            },

            slopeDeg: {
                type: Number,
                default: 0
            },

            aspectDeg: {
                type: Number,
                default: 0
            },

            rainfall24hMm: {
                type: Number,
                default: 0
            },

            rainfall72hMm: {
                type: Number,
                default: 0
            },

            rainfall7dMm: {
                type: Number,
                default: 0
            },

            landslideCount5km: {
                type: Number,
                default: 0
            },

            nearestLandslideKm: {
                type: Number,
                default: null
            },

            floodExposure: {
                type: Number,
                default: 0
            },

            riskScore: {
                type: Number,
                default: 0
            },

            riskLevel: {
                type: String,
                enum: [
                    "LOW",
                    "MEDIUM",
                    "HIGH"
                ],
                default: "LOW"
            },

            accessibilityScore: {
                type: Number,
                default: 100
            },

            status: {
                type: String,
                enum: [
                    "OPEN",
                    "RESTRICTED",
                    "BLOCKED"
                ],
                default: "OPEN"
            },

            geometry: {
                type: {
                    type: String,
                    enum: [
                        "LineString"
                    ],
                    default: "LineString"
                },

                coordinates: {
                    type: [
                        [
                            Number
                        ]
                    ],
                    default: []
                }
            }
        },

        {
            timestamps: true
        }
    );

roadSchema.index(
    {
        geometry: "2dsphere"
    }
);

module.exports =
    mongoose.model(
        "Road",
        roadSchema
    );