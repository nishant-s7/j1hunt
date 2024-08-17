const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const Restaurant = require("../model/Restaurant");

// GenAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

exports.getRestaurant = async (req, res, next) => {
    const { id } = req.params;
    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            const err = new Error("Restaurant not found");
            err.statusCode = 404;
            throw err;
        }
        res.json(restaurant);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getRestaurants = async (req, res, next) => {
    const {
        name,
        page,
        latitude,
        longitude,
        distance,
        filterCountry,
        filterSpendLow,
        filterSpendHigh,
    } = req.body;
    let filterCuisine = req.body.filterCuisine;
    const perPage = 20;

    let query = {};

    try {
        const image = req.file;

        if (image) {
            // prompt (cuisines derived from the dataset)
            const prompt =
                "Answer in one word: Which cuisine is represented in the image from the given options?? [French, Japanese, Desserts, Seafood, Asian, Filipino, Indian, Sushi, Korean, Chinese, European, Mexican, American, Ice Cream, Cafe, Italian, Pizza, Bakery, Mediterranean, Fast Food, Brazilian, Arabian, Bar Food, Grill, International, Peruvian, Latin American, Burger, Juices, Healthy Food, Beverages, Lebanese, Sandwich, Steak, BBQ, Gourmet Fast Food, Mineira, North Eastern, , Coffee and Tea, Vegetarian, Tapas, Breakfast, Diner, Southern, Southwestern, Spanish, Argentine, Caribbean, German, Vietnamese, Thai, Modern Australian, Teriyaki, Cajun, Canadian, Tex-Mex, Middle Eastern, Greek, Bubble Tea, Tea, Australian, Fusion, Cuban, Hawaiian, Salad, Irish, New American, Soul Food, Turkish, Pub Food, Persian, Continental, Singaporean, Malay, Cantonese, Dim Sum, Western, Finger Food, British, Deli, Indonesian, North Indian, Mughlai, Biryani, South Indian, Pakistani, Afghani, Hyderabadi, Rajasthani, Street Food, Goan, African, Portuguese, Gujarati, Armenian, Mithai, Maharashtrian, Modern Indian, Charcoal Grill, Malaysian, Burmese, Chettinad, Parsi, Tibetan, Raw Meats, Kerala, Belgian, Kashmiri, South American, Bengali, Iranian, Lucknowi, Awadhi, Nepalese, Drinks Only, Oriya, Bihari, Assamese, Andhra, Mangalorean, Malwani, Cuisine Varies, Moroccan, Naga, Sri Lankan, Peranakan, Sunda, Ramen, Kiwi, Asian Fusion, Taiwanese, Fish and Chips, Contemporary, Scottish, Curry, Patisserie, South African, Durban, Kebab, Turkish Pizza, Izgara, World Cuisine]";

            // uploading file to the server
            const uploadResult = await fileManager.uploadFile(image.path, {
                mimeType: "image/jpeg",
                displayName: "Food",
            });

            // generating response from the model
            const result = await model.generateContent([
                {
                    fileData: {
                        mimeType: uploadResult.file.mimeType,
                        fileUri: uploadResult.file.uri,
                    },
                },
                { text: prompt },
            ]);

            filterCuisine = result.response
                .text()
                .replace("Answer:", "")
                .trim();

            // deleting file 
            await fileManager.deleteFile(uploadResult.file.name);

            fs.unlink(image.path, (err) => {
                if (err) {
                    console.error(
                        "Error occurred while trying to delete the file:",
                        err
                    );
                    return;
                }
            });
        }

        // location based search
        if (latitude && longitude && distance) {
            query.location = {
                $geoWithin: {
                    $centerSphere: [
                        [longitude, latitude],
                        distance / 6378.1,
                    ],
                },
            };
        }

        // filters
        if (filterCountry) {
            query.country = filterCountry;
        }

        if (filterCuisine) {
            query.cuisines = { $regex: filterCuisine, $options: "i" };
        }

        if (filterSpendLow && filterSpendHigh) {
            query.average_cost_for_two = {
                $gte: filterSpendLow,
                $lte: filterSpendHigh,
            };
        }

        if (name) {
            query.restaurant_name = { $regex: name, $options: "i" };
        }

        const restaurants = await Restaurant.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.json(restaurants);
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
