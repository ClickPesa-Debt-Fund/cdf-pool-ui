import LandingPage from "@/pages/landing-page";
import { Route, Routes } from "react-router-dom";
// import Pools from "./pages/pools";
// import Pool from "./pages/pool";
import Header from "./layout/header";
import Trustline from "./pages/trustline";
import Dashboard from "./pages/dashboard";

const App = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route element={<LandingPage />} path="*" />
        <Route element={<Dashboard />} path="/dashboard" />
        {/* <Route element={<Pools />} path="/pools" />
        <Route element={<Pool />} path="/pools/:id" /> */}
        <Route element={<Trustline />} path="/trustline" />
      </Routes>
    </div>
  );
};

export default App;
