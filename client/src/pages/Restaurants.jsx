import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGeolocated } from "react-geolocated";
import { FaLocationDot } from "react-icons/fa6";
import { ThreeDots } from "react-loader-spinner";
import { IoClose } from "react-icons/io5";
import { BsFilterRight } from "react-icons/bs";

import useSearch from "../hooks/useSearch";
import Card from "../components/Card";
import FilterModal from "../components/FilterModal";

const Restaurants = () => {
    const [name, setName] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [filters, setFilters] = useState();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 15000,
        });

    const { loading, restaurants, hasMore, error } = useSearch({
        pageNumber,
        name,
        coords,
        filters,
    });

    const observer = useRef();
    const lastRestaurantRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber((prevPageNumber) => prevPageNumber + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const handleSearch = (e) => {
        setName(e.target.value);
        setPageNumber(1);
    };

    const handleClearFilters = () => {
        setFilters();
        setPageNumber(1);
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4 lg:mb-6 items-center">
                <img src="/logo.png" alt="logo" className="h-6 lg:h-8" />
                <input
                    className="w-full lg:flex-1 border-2 border-gray-100 p-2 lg:p-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Search restaurants by name"
                    onChange={handleSearch}
                />
                <div className="flex items-center gap-1 mt-2 lg:mt-0">
                    <FaLocationDot
                        className={`h-5 w-5 lg:h-6 lg:w-6 transition-colors duration-300 ${
                            !isGeolocationAvailable || !isGeolocationEnabled
                                ? "text-red-500"
                                : coords
                                ? "text-orange-600"
                                : "text-blue-500 animate-bounce"
                        }`}
                    />
                    {!isGeolocationAvailable ||
                        (!isGeolocationEnabled && (
                            <div className="text-red-500 text-xs md:text-sm w-20">
                                Couldn&apos;t find you!
                            </div>
                        ))}
                    {coords && (
                        <div className="text-orange-600 text-xs md:text-sm w-20">
                            Found you!
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-4 md:mb-6 flex flex-row gap-4 md:gap-6 flex-wrap">
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-500 transition-colors flex items-center gap-2 w-fit"
                >
                    <BsFilterRight />
                    Filters
                </button>
                {filters && (
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-orange-600 border-2 border-orange-600 rounded-lg shadow-md hover:border-orange-400 hover:text-orange-400 transition-colors flex gap-2 items-center w-fit"
                    >
                        Clear Filters
                        <IoClose />
                    </button>
                )}
            </div>
            {isModalOpen && (
                <FilterModal
                    closeModal={closeModal}
                    coords={coords}
                    setFilters={setFilters}
                    setPageNumber={setPageNumber}
                />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {!loading && restaurants.length === 0 ? (
                    <div>No restaurants found</div>
                ) : (
                    restaurants.map((restaurant, index) =>
                        restaurants.length === index + 1 ? (
                            <Link
                                ref={lastRestaurantRef}
                                key={restaurant._id}
                                className="h-full"
                            >
                                <Card restaurant={restaurant} />
                            </Link>
                        ) : (
                            <Link
                                to={`/restaurant/${restaurant._id}`}
                                key={restaurant._id}
                                className="h-full"
                            >
                                <Card restaurant={restaurant} />
                            </Link>
                        )
                    )
                )}
            </div>
            <div className="mt-4 lg:mt-6 flex justify-center w-full lg:w-[64rem]">
                {loading && !error && (
                    <ThreeDots color="#ea580c" height={50} width={50} />
                )}
                {error && (
                    <div className="text-red-500 font-semibold">
                        Error!!! Please try again.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Restaurants;
