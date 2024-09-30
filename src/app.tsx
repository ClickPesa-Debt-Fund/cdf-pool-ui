import LandingPage from "@/pages/landing-page";
import { Route, Routes } from "react-router-dom";
import Header from "./layout/header";
import Dashboard from "./pages/dashboard";
import Backstop from "./pages/backstop";

const App = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route element={<LandingPage />} path="*" />
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<Backstop />} path="/dashboard/backstop" />
      </Routes>
    </div>
  );
};

export default App;
