const Alert =
    require("../models/Alert");


// =========================
// GET ALL ALERTS
// =========================

const getAllAlerts =
    async (
        req,
        res
    ) => {

        try {

            const alerts =
                await Alert.find();

            res.status(200).json({

                success: true,

                data:
                    alerts
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
// GET ALERT BY ID
// =========================

const getAlertById =
    async (
        req,
        res
    ) => {

        try {

            const alert =
                await Alert.findById(
                    req.params.id
                );

            if (!alert) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Alert not found"
                });
            }

            res.status(200).json({

                success: true,

                data:
                    alert
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
// CREATE ALERT
// =========================

const createAlert =
    async (
        req,
        res
    ) => {

        try {

            const alert =
                new Alert(
                    req.body
                );

            const savedAlert =
                await alert.save();

            res.status(201).json({

                success: true,

                message:
                    "Alert created successfully",

                data:
                    savedAlert
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
// UPDATE ALERT
// =========================

const updateAlert =
    async (
        req,
        res
    ) => {

        try {

            const alert =
                await Alert.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    {
                        new: true,

                        runValidators: true
                    }
                );

            if (!alert) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Alert not found"
                });
            }

            res.status(200).json({

                success: true,

                message:
                    "Alert updated successfully",

                data:
                    alert
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
// DELETE ALERT
// =========================

const deleteAlert =
    async (
        req,
        res
    ) => {

        try {

            const alert =
                await Alert.findByIdAndDelete(
                    req.params.id
                );

            if (!alert) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Alert not found"
                });
            }

            res.status(200).json({

                success: true,

                message:
                    "Alert deleted successfully"
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

    getAllAlerts,

    getAlertById,

    createAlert,

    updateAlert,

    deleteAlert

};