/* eslint-disable react/prop-types */
import { FaStar } from "react-icons/fa";

const images = [
    "/car1.jpg",
    "/car2.jpg",
    "/car3.jpg",
    "/car4.jpg",
    "/car5.jpg",
    "/car6.jpg",
    "/car7.jpg",
    "/car8.jpg",
    "/car9.jpg",
    "/car10.jpg",
    "/car11.jpg",
    "/car12.jpg",
    "/car13.jpg",
    "/car14.jpg",
    "/car15.jpg",
];

const Card = ({ restaurant }) => {
    const randomImageIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomImageIndex];

    return (
        <div
            className="h-64 w-full p-4 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:border-blue-500 transition duration-200 relative bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
            <div className="relative z-10 h-full flex flex-col justify-end">
                <h3
                    className={`text-lg font-bold mb-2 transition-all duration-300`}
                >
                    {restaurant?.restaurant_name}
                </h3>
                <div className="mt-2 flex gap-1 items-center">
                    <span className="text-xs flex items-center gap-1 bg-orange-700 p-1 rounded shadow">
                        <p className="font-bold">
                            {restaurant?.aggregate_rating}
                        </p>
                        <FaStar className="text-yellow-300" />
                    </span>
                    <span className="text-xs">{restaurant?.votes} ratings</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
