// =========================
// PREDICT LANDSLIDE RISK
// =========================

const predictRisk =
    async (
        req,
        res
    ) => {

        try {

            const {

                latitude,

                longitude,

                elevation,

                slope,

                aspect,

                distanceToNearestRoadM,

                rainfall24hMm

            } =
                req.body;


            // =========================
            // VALIDATE INPUT
            // =========================

            if (

                latitude === undefined ||

                longitude === undefined ||

                elevation === undefined ||

                slope === undefined ||

                aspect === undefined ||

                distanceToNearestRoadM === undefined ||

                rainfall24hMm === undefined

            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "latitude, longitude, elevation, slope, distanceToNearestRoadM and rainfall24hMm are required"
                });
            }


            // =========================
            // VALIDATE DISTANCE
            // =========================

            if (
                distanceToNearestRoadM < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Distance to nearest road cannot be negative"
                });
            }


            // =========================
            // TEMPORARY RESPONSE
            // =========================
            //
            // The ML teammate will later
            // connect this controller to
            // the FastAPI risk engine.
            //
            // For now, we simply verify
            // that the backend receives
            // all required data.
            //

            res.status(200).json({

                success: true,

                message:
                    "Risk prediction request received successfully",

                data: {

                    location: {

                        latitude:
                            latitude,

                        longitude:
                            longitude
                    },

                    features: {

                        elevation:
                            elevation,

                        slope:
                            slope,

                        aspect:
                            aspect,

                        distanceToNearestRoadM:
                            distanceToNearestRoadM,

                        rainfall24hMm:
                            rainfall24hMm
                    }
                }
            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message
            });
        }
    };


module.exports = {

    predictRisk

};