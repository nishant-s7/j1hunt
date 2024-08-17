const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    restaurant_id: Number,
    restaurant_name: String,
    country: String,
    city: String,
    address: String,
    locality: String,
    locality_verbose: String,
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" },
    },
    cuisines: String,
    average_cost_for_two: Number,
    currency: String,
    has_table_booking: String,
    has_online_delivery: String,
    is_delivering_now: String,
    switch_to_order_menu: String,
    price_range: Number,
    aggregate_rating: Number,
    rating_color: String,
    rating_text: String,
    votes: Number,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
