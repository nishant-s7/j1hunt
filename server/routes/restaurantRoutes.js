const express = require("express");

const {
    getRestaurants,
    getRestaurant,
} = require("../controllers/restaurantController");

const router = express.Router();

router.post("/restaurants", getRestaurants);
router.get("/restaurant/:id", getRestaurant);

module.exports = router;
