import LandingPage from "@/pages/landing-page";
import { Route, Routes } from "react-router-dom";
import Pools from "./pages/pools";
import Pool from "./pages/pool";
import Header from "./layout/header";
import Trustline from "./pages/trustline";

const App = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route element={<LandingPage />} path="*" />
        <Route element={<Pools />} path="/pools" />
        <Route element={<Pool />} path="/pools/:id" />
        <Route element={<Trustline />} path="/trustline" />
      </Routes>
    </div>
  );
};

export default App;
