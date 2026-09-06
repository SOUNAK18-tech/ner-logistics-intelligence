const mongoose =
    require("mongoose");

const incidentSchema =
    new mongoose.Schema(
        {

            type: {
                type: String,
                enum: [
                    "LANDSLIDE",
                    "FLOOD",
                    "ROAD_DAMAGE",
                    "BRIDGE_DAMAGE",
                    "ACCIDENT",
                    "BLOCKAGE",
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

            description: {
                type: String,
                default: ""
            },

            location: {
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

            roadId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Road",
                default: null
            },

            photoUrl: {
                type: String,
                default: ""
            },

            reportedBy: {
                type: String,
                default: ""
            },

            verified: {
                type: Boolean,
                default: false
            },

            status: {
                type: String,
                enum: [
                    "ACTIVE",
                    "RESOLVED"
                ],
                default: "ACTIVE"
            }
        },

        {
            timestamps: true
        }
    );

incidentSchema.index(
    {
        location: "2dsphere"
    }
);

module.exports =
    mongoose.model(
        "Incident",
        incidentSchema
    );