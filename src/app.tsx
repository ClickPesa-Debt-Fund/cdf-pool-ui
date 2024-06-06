import LandingPage from "@/pages/landing-page";
import { Route, Routes } from "react-router-dom";
import Pools from "./pages/pools";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route element={<LandingPage />} path="*" />
        <Route element={<Pools />} path="/pools" />
      </Routes>
    </div>
  );
};

export default App;
