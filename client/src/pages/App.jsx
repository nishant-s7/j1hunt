import { Outlet } from "react-router-dom";

const App = () => {
    return (
        <div className="flex min-h-screen flex-1 flex-col items-center bg-orange-50">
            <Outlet />
        </div>
    );
};

export default App;
