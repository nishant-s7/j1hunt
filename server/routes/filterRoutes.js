const express = require("express");
const Cuisine = require("../model/Cuisine");
const Country = require("../model/Country");

const router = express.Router();

router.get("/cuisines", async (req, res, next) => {
    try {
        const cuisines = await Cuisine.find({}, "name").sort({ name: 1 });
        // const allCuisines = cuisines.map((cuisine) => cuisine.name).join(", ");
        res.json(cuisines);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
});

router.get("/countries", async (req, res, next) => {
    try {
        const countries = await Country.find({}, "name").sort({ name: 1 });
        res.json(countries);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
});

module.exports = router;
