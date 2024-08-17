import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaChevronRight } from "react-icons/fa";

const Landing = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                autoPlay
                interval={3000}
                transitionTime={500}
                emulateTouch
                stopOnHover={false}
                showArrows={false}
                showIndicators={false}
            >
                <div>
                    <img
                        src="/car1.jpg"
                        alt="Slide 1"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car2.jpg"
                        alt="Slide 2"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car3.jpg"
                        alt="Slide 3"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car4.jpg"
                        alt="Slide 4"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car5.jpg"
                        alt="Slide 5"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car6.jpg"
                        alt="Slide 6"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car7.jpg"
                        alt="Slide 7"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car8.jpg"
                        alt="Slide 8"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car9.jpg"
                        alt="Slide 9"
                        className="object-cover w-full h-screen"
                    />
                </div>
                <div>
                    <img
                        src="/car10.jpg"
                        alt="Slide 10"
                        className="object-cover w-full h-screen"
                    />
                </div>
            </Carousel>

            {/* Overlay to darken the background */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute inset-0 flex items-center justify-center flex-col text-white gap-2">
                <h1 className="text-6xl font-bold">
                    J<span className="text-orange-600">1</span>hunt
                </h1>
                <p className="text-lg text-center">
                    Explore the best culinary experiences
                </p>
                <Link
                    to="/restaurants"
                    className="flex gap-2 items-center bg-white text-orange-600 font-bold py-2 px-4 rounded transform transition-all duration-300 hover:scale-105"
                >
                    Explore <FaChevronRight />
                </Link>
            </div>
        </div>
    );
};

export default Landing;
