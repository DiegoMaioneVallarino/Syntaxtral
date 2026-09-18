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
import Profile from "./pages/Profile/Profile";
import Calculator
    from "./features/calculator/Calculator";
import Questions from "./pages/Questions/Questions";
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
                      <Route
                          path="/calculator"
                          element={<Calculator />}
                      />
                      <Route
    path="/questions"
    element={<Questions />}
/>
                      <Route
                      
                      
    path="/profile"
    element={<Profile />}
/>
                </Routes>

            </main>

        </div>
    );
}


export default App;