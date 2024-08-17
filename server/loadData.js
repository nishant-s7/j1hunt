require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const csvParser = require("csv-parser");

const Restaurant = require("./model/Restaurant");
const Country = require("./model/Country");
const Cuisine = require("./model/Cuisine");

const { MONGO_URI } = process.env;
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

const countryMap = {
    1: "India",
    14: "Australia",
    30: "Brazil",
    37: "Canada",
    94: "Indonesia",
    148: "New Zealand",
    162: "Phillipines",
    166: "Qatar",
    184: "Singapore",
    189: "South Africa",
    191: "Sri Lanka",
    208: "Turkey",
    214: "UAE",
    215: "United Kingdom",
    216: "United States",
};

const ratingColorMap = {
    "Dark Green": "#003e00", //055205
    Green: "#008000", //008000
    Orange: "#FFA500", //DB6C0B
    Red: "#FF0000", //BE0A0A
    White: "#FFFFFF", //A7A7A7
    Yellow: "#ffff00", //BCB111
};

const imageFiles = [
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901886/rcg6v7zjidbhgxkvczrz.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901889/vmn26d52mcmrtro11uhs.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901886/itea5fnfy980vpmmo9by.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901886/wc5l3mascejnnt3qxyal.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901886/ifitocegmdaxkze7iway.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901885/wimkpwzfmd5kpjmj3ckk.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901885/vxncvdomgj9uowvcdovr.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901884/hniq7rzfykzygkdxu6mm.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901884/om8vs3qqkuuhavq7wgdi.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901884/wn7wdrelqdcjtbqkcgy1.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901884/jgl2mrw5k6qobcxrsxm8.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901883/uozpersg92efpahoskwz.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901883/q723jbccbaa9ks4ijbdp.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901883/imzdfoe9quplzyd9pzhf.jpg",
    "https://res.cloudinary.com/dmbgtk6be/image/upload/v1723901882/geupk3hm3ykcyofqlyys.jpg",
];

const cuisineSet = new Set();

// Reading zomato.csv file
const zomatoData = [];
fs.createReadStream("./data/zomato.csv")
    .pipe(csvParser())
    .on("data", (row) => {
        if (countryMap[row["Country Code"]]) {
            row["Country"] = countryMap[row["Country Code"]];
            delete row["Country Code"];
        }

        // Splitting the cuisines string into an array and adding each cuisine to the set
        const cuisines = row["Cuisines"]
            .split(", ")
            .map((cuisine) => cuisine.trim());
        cuisines.forEach((cuisine) => cuisineSet.add(cuisine));

        // Randomly assign an image file to the restaurant
        const randomImage =
            imageFiles[Math.floor(Math.random() * imageFiles.length)];

        zomatoData.push({
            restaurant_id: parseInt(row["Restaurant ID"]),
            restaurant_name: row["Restaurant Name"],
            country: row["Country"],
            city: row["City"],
            address: row["Address"],
            locality: row["Locality"],
            locality_verbose: row["Locality Verbose"],
            location: {
                type: "Point",
                coordinates: [
                    parseFloat(row["Longitude"]),
                    parseFloat(row["Latitude"]),
                ],
            },
            cuisines: row["Cuisines"],
            average_cost_for_two: parseInt(row["Average Cost for two"]),
            currency: row["Currency"],
            has_table_booking: row["Has Table booking"],
            has_online_delivery: row["Has Online delivery"],
            is_delivering_now: row["Is delivering now"],
            switch_to_order_menu: row["Switch to order menu"],
            price_range: parseInt(row["Price range"]),
            aggregate_rating: parseFloat(row["Aggregate rating"]),
            rating_color: ratingColorMap[row["Rating color"]], // Use hex code
            rating_text: row["Rating text"],
            votes: parseInt(row["Votes"]),
            image: randomImage, // Add image field
        });
    })
    .on("end", async () => {
        try {
            // Insert restaurants
            const restaurantDocs = await Restaurant.insertMany(zomatoData);
            console.log(
                `Inserted ${restaurantDocs.length} restaurants into the collection`
            );

            // Insert cuisines
            const cuisineData = Array.from(cuisineSet).map((cuisineName) => ({
                name: cuisineName,
            }));
            const cuisineDocs = await Cuisine.insertMany(cuisineData);
            console.log(
                `Inserted ${cuisineDocs.length} cuisines into the collection`
            );
        } catch (err) {
            console.error("err");
        } finally {
            mongoose.connection.close();
        }
    });

// Creating countries collection
const countries = Object.values(countryMap).map((name) => ({ name }));

Country.insertMany(countries)
    .then((docs) => {
        console.log(
            `Inserted ${docs.length} documents into the countries collection`
        );
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error(err);
        mongoose.connection.close();
    });
