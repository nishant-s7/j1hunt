const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cuisineSchema = new Schema({
    name: String,
});

module.exports = mongoose.model("Cuisine", cuisineSchema);
