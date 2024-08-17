import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
    FaUtensils,
    FaLocationArrow,
    FaStar,
    FaCheckCircle,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import "leaflet/dist/leaflet.css";
import { ThreeDots } from "react-loader-spinner";

const Details = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`/api/restaurant/${id}`)
            .then((res) => {
                setRestaurant(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {loading ? (
                <div className="text-center text-blue-500 font-semibold text-lg">
                    <ThreeDots color="#ea580c" height={50} width={50} />
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg h-64 shadow-md space-y-6 transition-transform transform hover:scale-[1.02]">
                        <img
                            src={restaurant?.image}
                            alt="bg"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 space-y-6 transition-transform transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between gap-2">
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
                                {restaurant?.restaurant_name}
                            </h1>
                            <div className="flex gap-2">
                                <FaStar className="text-yellow-500 text-xl" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm sm:text-lg font-semibold text-gray-700">
                                        {restaurant?.aggregate_rating} / 5
                                    </span>
                                    <span className="text-gray-500 text-xs sm:text-sm">
                                        ({restaurant?.votes} votes)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {restaurant?.cuisines
                                .split(", ")
                                .map((cuisine, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold"
                                    >
                                        {cuisine}
                                    </span>
                                ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm sm:text-lg">
                            <div className="flex items-center">
                                <FaLocationDot className="text-red-500 mr-3 text-3xl" />
                                <span>
                                    {restaurant?.address}, {restaurant?.city},{" "}
                                    {restaurant?.country}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FaUtensils className="text-orange-500 mr-3" />
                                <span>
                                    Average Cost for Two: {restaurant?.currency}{" "}
                                    {restaurant?.average_cost_for_two}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FaCheckCircle
                                    className={`mr-3 ${
                                        restaurant?.has_table_booking === "Yes"
                                            ? "text-green-500"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span>
                                    Table Booking:{" "}
                                    {restaurant?.has_table_booking === "Yes"
                                        ? "Available"
                                        : "Not Available"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FaCheckCircle
                                    className={`mr-3 ${
                                        restaurant?.has_online_delivery ===
                                        "Yes"
                                            ? "text-green-500"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span>
                                    Online Delivery:{" "}
                                    {restaurant?.has_online_delivery === "Yes"
                                        ? "Available"
                                        : "Not Available"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FaCheckCircle
                                    className={`mr-3 ${
                                        restaurant?.is_delivering_now === "Yes"
                                            ? "text-green-500"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span>
                                    Currently Delivering:{" "}
                                    {restaurant?.is_delivering_now === "Yes"
                                        ? "Yes"
                                        : "No"}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t gap-10">
                            <div className="sm:flex text-sm text-gray-600 hidden gap-2">
                                <span>Price Range:</span>
                                <div>
                                    {Array(restaurant?.price_range)
                                        .fill()
                                        .map((_, i) => (
                                            <GiMoneyStack
                                                key={i}
                                                className="inline-block text-green-500 text-xl"
                                            />
                                        ))}
                                </div>
                            </div>
                            <div className="sm:text-lg text-gray-700 font-semibold">
                                Rating:{" "}
                                <span
                                    className="px-2 py-1 rounded-full text-white"
                                    style={{
                                        backgroundColor:
                                            restaurant?.rating_color,
                                        color:
                                            restaurant?.rating_color ===
                                                "#FFFF00" ||
                                            restaurant?.rating_color ===
                                                "#FFFFFF"
                                                ? "black"
                                                : "white",
                                    }}
                                >
                                    {restaurant?.rating_text}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-[1.02]">
                        <MapContainer
                            center={[
                                restaurant?.location.coordinates[1],
                                restaurant?.location.coordinates[0],
                            ]}
                            zoom={16}
                            scrollWheelZoom={true}
                            className="h-72 rounded-lg"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker
                                position={[
                                    restaurant?.location.coordinates[1],
                                    restaurant?.location.coordinates[0],
                                ]}
                            >
                                <Popup>{restaurant?.restaurant_name}</Popup>
                            </Marker>
                        </MapContainer>
                        <div className="flex items-center justify-between p-6 bg-gray-50">
                            <div className="text-gray-600">
                                <FaLocationArrow className="inline mr-2" />
                                Coordinates:{" "}
                                {restaurant?.location.coordinates[1]},{" "}
                                {restaurant?.location.coordinates[0]}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Details;
