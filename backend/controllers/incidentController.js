const Incident =
    require("../models/Incident");


// =========================
// GET ALL INCIDENTS
// =========================

const getAllIncidents =
    async (
        req,
        res
    ) => {

        try {

            const incidents =
                await Incident.find();

            res.status(200).json({

                success: true,

                data:
                    incidents
            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message
            });
        }
    };


// =========================
// GET INCIDENT BY ID
// =========================

const getIncidentById =
    async (
        req,
        res
    ) => {

        try {

            const incident =
                await Incident.findById(
                    req.params.id
                );

            if (!incident) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Incident not found"
                });
            }

            res.status(200).json({

                success: true,

                data:
                    incident
            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message
            });
        }
    };


// =========================
// CREATE INCIDENT
// =========================

const createIncident =
    async (
        req,
        res
    ) => {

        try {

            const incident =
                new Incident(
                    req.body
                );

            const savedIncident =
                await incident.save();

            res.status(201).json({

                success: true,

                message:
                    "Incident created successfully",

                data:
                    savedIncident
            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message
            });
        }
    };


// =========================
// UPDATE INCIDENT
// =========================

const updateIncident =
    async (
        req,
        res
    ) => {

        try {

            const incident =
                await Incident.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true,

                        runValidators: true
                    }
                );

            if (!incident) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Incident not found"
                });
            }

            res.status(200).json({

                success: true,

                message:
                    "Incident updated successfully",

                data:
                    incident
            });

        } catch (error) {

            res.status(500).json({

                success: false,

                message:
                    error.message
            });
        }
    };


// =========================
// DELETE INCIDENT
// =========================

const deleteIncident =
    async (
        req,
        res
    ) => {

        try {

            const incident =
                await Incident.findByIdAndDelete(
                    req.params.id
                );

            if (!incident) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Incident not found"
                });
            }

            res.status(200).json({

                success: true,

                message:
                    "Incident deleted successfully"
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

    getAllIncidents,

    getIncidentById,

    createIncident,

    updateIncident,

    deleteIncident

};