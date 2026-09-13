import {
    Route,
    Routes
} from "react-router-dom";

import "./App.css";

import Toolbar from "./components/Toolbar/Toolbar";

import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import Articles from "./pages/Articles/Articles";
import Community from "./pages/Community/Community";

function App() {
    return (
        <div className="app">

            <Toolbar />

            <main className="main">

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/explore"
                        element={<Explore />}
                    />

                    <Route
                        path="/articles"
                        element={<Articles />}
                    />
                    <Route
                        path="/community"
                        element={<Community />}
                    />

                </Routes>

            </main>

        </div>
    );
}


export default App;