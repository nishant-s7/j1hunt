import axios from "axios";
import { useEffect, useState } from "react";

const useSearch = ({ pageNumber, name, filters }) => {
    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setRestaurants([]);
    }, [name, filters]);

    useEffect(() => {
        setLoading(true);
        setError(false);

        let cancel;

        const formData = new FormData();

        if (filters) {
            for (const [key, value] of filters.entries()) {
                formData.append(key, value);
            }
        }

        formData.append("name", name);
        formData.append("page", pageNumber);

        axios
            .post("http://localhost:3000/restaurants", formData, {
                cancelToken: new axios.CancelToken((c) => (cancel = c)),
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                setRestaurants((prevRestaurants) => {
                    return [...prevRestaurants, ...res.data];
                });
                setHasMore(res.data.length > 0);
                setLoading(false);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
                setError(true);
            });
        return () => cancel();
    }, [name, pageNumber, filters]);

    return {
        loading,
        restaurants,
        hasMore,
        error,
    };
};

export default useSearch;
