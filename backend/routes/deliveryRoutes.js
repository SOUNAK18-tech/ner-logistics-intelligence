const express =
    require("express");

const router =
    express.Router();

const {
    getAllDeliveries,
    getDeliveryById,
    createDelivery,
    updateDelivery,
    deleteDelivery
} =
    require("../controllers/deliveryController");

router.get(
    "/",
    getAllDeliveries
);

router.get(
    "/:id",
    getDeliveryById
);

router.post(
    "/",
    createDelivery
);

router.put(
    "/:id",
    updateDelivery
);

router.delete(
    "/:id",
    deleteDelivery
);

module.exports =
    router;