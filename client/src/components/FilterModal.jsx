/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const FilterModal = ({ closeModal, coords, setFilters, setPageNumber }) => {
    const [activeTab, setActiveTab] = useState("country");
    const [imageSelected, setImageSelected] = useState(false);
    const [file, setFile] = useState();
    const [searchProximity, setSearchProximity] = useState("");
    const [spendLow, setSpendLow] = useState("");
    const [spendHigh, setSpendHigh] = useState("");
    const [country, setCountry] = useState("");
    const [cuisine, setCuisine] = useState("");

    const [countries, setCountries] = useState([]);
    const [cuisines, setCuisines] = useState([]);

    useEffect(() => {
        axios
            .get("/api/countries")
            .then((res) => {
                setCountries(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        axios
            .get("/api/cuisines")
            .then((res) => {
                setCuisines(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleImageChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile && uploadedFile.type.startsWith("image/")) {
            setImageSelected(true);
            setFile(uploadedFile);
        } else {
            setImageSelected(false);
        }
    };

    const handleApplyFilters = () => {
        const formData = new FormData();
        if (country) {
            formData.append("filterCountry", country);
        }
        if (cuisine) {
            formData.append("filterCuisine", cuisine);
        }
        if (spendLow && spendHigh) {
            formData.append("filterSpendLow", spendLow);
            formData.append("filterSpendHigh", spendHigh);
        }
        if (activeTab === "imgsearch" && file) {
            formData.append("image", file);
        }
        if (activeTab === "nearby" && searchProximity) {
            formData.append("distance", searchProximity);
            formData.append("latitude", coords.latitude);
            formData.append("longitude", coords.longitude);
        }
        setPageNumber(1);
        setFilters(formData);
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative">
                <div className="text-xl md:text-2xl flex justify-between items-center p-3 md:p-4 border-b-2">
                    <h2 className="font-semibold">Filters</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-800 duration-200"
                    >
                        <IoClose />
                    </button>
                </div>
                <form onSubmit={handleApplyFilters}>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4">
                            <ul className="bg-gray-100">
                                <li>
                                    <button
                                        onClick={() => setActiveTab("country")}
                                        type="button"
                                        className={`w-full text-left p-3 md:p-4 ${
                                            activeTab === "country"
                                                ? "bg-white text-black border-l-4 border-orange-600"
                                                : "text-gray-700 hover:text-black"
                                        }`}
                                    >
                                        Country
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab("cuisine")}
                                        type="button"
                                        className={`w-full text-left p-3 md:p-4 ${
                                            activeTab === "cuisine"
                                                ? "bg-white text-black border-l-4 border-orange-600"
                                                : "text-gray-700 hover:text-black"
                                        }`}
                                    >
                                        Cuisine
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab("spend")}
                                        type="button"
                                        className={`w-full text-left p-3 md:p-4 ${
                                            activeTab === "spend"
                                                ? "bg-white text-black border-l-4 border-orange-600"
                                                : "text-gray-700 hover:text-black"
                                        }`}
                                    >
                                        Average Spend for two people
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() =>
                                            setActiveTab("imgsearch")
                                        }
                                        type="button"
                                        className={`w-full text-left p-3 md:p-4 ${
                                            activeTab === "imgsearch"
                                                ? "bg-white text-black border-l-4 border-orange-600"
                                                : "text-gray-700 hover:text-black"
                                        }`}
                                    >
                                        Image Search
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab("nearby")}
                                        type="button"
                                        className={`w-full text-left p-3 md:p-4 ${
                                            activeTab === "nearby"
                                                ? "bg-white text-black border-l-4 border-orange-600"
                                                : "text-gray-700 hover:text-black"
                                        } ${
                                            !coords
                                                ? "cursor-not-allowed bg-gray-200 text-gray-400 border-l-4 border-gray-300"
                                                : ""
                                        }`}
                                        disabled={!coords}
                                    >
                                        Nearby
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-3/4 p-4 md:p-6">
                            <div className="space-y-4">
                                {activeTab === "nearby" && (
                                    <div>
                                        <input
                                            className="w-full border border-gray-300 rounded-lg p-2"
                                            type="number"
                                            placeholder="Proximity in km"
                                            value={searchProximity}
                                            onChange={(e) =>
                                                setSearchProximity(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                {activeTab === "country" && (
                                    <div>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg py-2 md:py-3 px-2 bg-white"
                                            value={country}
                                            onChange={(e) =>
                                                setCountry(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Select Country
                                            </option>
                                            {countries.map((country) => (
                                                <option
                                                    key={country._id}
                                                    value={country.name}
                                                >
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {activeTab === "cuisine" && (
                                    <div>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg py-2 md:py-3 px-2 bg-white"
                                            value={cuisine}
                                            onChange={(e) =>
                                                setCuisine(e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Select Cuisine
                                            </option>
                                            {cuisines.map((cuisine) => (
                                                <option
                                                    key={cuisine._id}
                                                    value={cuisine.name}
                                                >
                                                    {cuisine.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {activeTab === "spend" && (
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <input
                                                className="w-1/2 border border-gray-300 rounded-lg p-2"
                                                type="number"
                                                placeholder="Lower limit"
                                                value={spendLow}
                                                onChange={(e) =>
                                                    setSpendLow(e.target.value)
                                                }
                                            />
                                            <input
                                                className="w-1/2 border border-gray-300 rounded-lg p-2"
                                                type="number"
                                                placeholder="Upper limit"
                                                value={spendHigh}
                                                onChange={(e) =>
                                                    setSpendHigh(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                                {activeTab === "imgsearch" && (
                                    <div className="">
                                        <label
                                            htmlFor="image"
                                            className={`mb-3 cursor-pointer inline-block w-full p-2 rounded-lg border-2 text-gray-400 ${
                                                imageSelected
                                                    ? "border-orange-400 text-orange-400"
                                                    : "border-gray-300 text-gray-900 hover:border-orange-500"
                                            }`}
                                        >
                                            {imageSelected ? (
                                                "Image Selected! Click to Change"
                                            ) : (
                                                <span>Upload image here</span>
                                            )}
                                        </label>
                                        <input
                                            type="file"
                                            className="hidden w-full border border-gray-300 rounded-lg p-2"
                                            name="image"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {file && (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Uploaded Preview"
                                                className="border border-gray-300 rounded-lg"
                                                style={{
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    display: "block",
                                                    margin: "auto",
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 p-4 border-t-2">
                        <button
                            onClick={closeModal}
                            type="button"
                            className="px-3 md:px-4 py-2 bg-gray-300 hover:bg-gray-200 text-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 md:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500"
                        >
                            Apply Filters
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FilterModal;
