const express =
    require("express");

const router =
    express.Router();

const {
    getAllRoads,
    getRoadById,
    createRoad,
    updateRoad,
    deleteRoad
} =
    require("../controllers/roadController");

// =========================
// GET ALL
// =========================

router.get(
    "/",
    getAllRoads
);

// =========================
// GET ONE
// =========================

router.get(
    "/:id",
    getRoadById
);

// =========================
// CREATE
// =========================

router.post(
    "/",
    createRoad
);

// =========================
// UPDATE
// =========================

router.put(
    "/:id",
    updateRoad
);

// =========================
// DELETE
// =========================

router.delete(
    "/:id",
    deleteRoad
);

module.exports =
    router;