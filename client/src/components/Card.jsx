/* eslint-disable react/prop-types */
import { FaStar } from "react-icons/fa";

const Card = ({ restaurant }) => {
    return (
        <div
            className="h-64 w-full p-4 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.03] transition duration-200 relative bg-cover bg-center text-white"
            style={{ backgroundImage: `url(${restaurant?.image})` }}
        >
            <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
            <div className="relative z-10 h-full flex flex-col justify-end">
                <h3
                    className={`text-lg font-bold mb-2 transition-all duration-300`}
                >
                    {restaurant?.restaurant_name}
                </h3>
                <div className="mt-2 flex gap-1 items-center">
                    <span
                        className="text-xs flex items-center gap-1 p-1 rounded shadow"
                        style={{
                            backgroundColor: restaurant?.rating_color,
                        }}
                    >
                        <p className="font-bold">
                            {restaurant?.aggregate_rating}
                        </p>
                        <FaStar className="text-yellow-400" />
                    </span>
                    <span className="text-xs">{restaurant?.votes} ratings</span>
                </div>
            </div>
        </div>
    );
};

export default Card;
