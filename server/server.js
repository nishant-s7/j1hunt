require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const restaurantRoutes = require("./routes/restaurantRoutes");
const filterRoutes = require("./routes/filterRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Handling image upload
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, "food");
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

// Connecting to MongoDB
const { MONGO_URI } = process.env;
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

// routes
app.use("/api", restaurantRoutes);
app.use("/api", filterRoutes);

// error route
app.use((error, req, res, next) => {
    const status = error?.statusCode || 500;
    const message = error.message || "An error occurred";
    const data = error.data || null;
    res.status(status).json({ message, data });
});

// Setting up the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
