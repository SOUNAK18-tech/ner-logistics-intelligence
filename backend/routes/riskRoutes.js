const express =
    require("express");

const riskController =
    require(
        "../controllers/riskController"
    );

const router =
    express.Router();


// =========================
// PREDICT LANDSLIDE RISK
// =========================

router.post(
    "/predict",
    riskController.predictRisk
);


module.exports =
    router;