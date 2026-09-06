const express =
    require("express");

const router =
    express.Router();

const {
    getAllAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert
} =
    require("../controllers/alertController");

router.get(
    "/",
    getAllAlerts
);

router.get(
    "/:id",
    getAlertById
);

router.post(
    "/",
    createAlert
);

router.put(
    "/:id",
    updateAlert
);

router.delete(
    "/:id",
    deleteAlert
);

module.exports =
    router;