import LandingPage from "@/pages/landing-page";
import { Route, Routes } from "react-router-dom";
import Header from "./layout/header";
import Dashboard from "./pages/dashboard";
import Backstop from "./pages/backstop";
import { TxStatus, useWallet } from "./contexts/wallet";
import FullPageSpinner from "./components/other/full-page-loader";

const App = () => {
  const { txStatus, isLoading } = useWallet();

  return (
    <div className="min-h-screen">
      {([TxStatus.BUILDING, TxStatus.SIGNING, TxStatus.SUBMITTING].includes(
        txStatus
      ) ||
        isLoading) && (
        <FullPageSpinner
          message={
            txStatus === TxStatus.BUILDING
              ? "Preparing your transaction..."
              : txStatus === TxStatus.SIGNING
              ? "Please confirm the transaction in your wallet."
              : txStatus === TxStatus.SUBMITTING
              ? "Submitting your transaction..."
              : ""
          }
        />
      )}
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
