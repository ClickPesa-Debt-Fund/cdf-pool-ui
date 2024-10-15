import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import ErrorBoundary from "@/pages/error-boundary";
import App from "@/app.tsx";
import "@/styles/index.sass";
import { SettingsProvider } from "./contexts/settings";
import { WalletProvider } from "./contexts/wallet";
import { FLAGSMITH_ENVIRONMENT_KEY } from "./constants";
import { ThemeProvider } from "./contexts/theme";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FlagsmithProvider
      options={{
        environmentID: FLAGSMITH_ENVIRONMENT_KEY,
      }}
      flagsmith={flagsmith}
    >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <WalletProvider>
              <ThemeProvider>
                <ErrorBoundary>
                  <App />
                  <Toaster />
                </ErrorBoundary>
              </ThemeProvider>
            </WalletProvider>
          </SettingsProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </FlagsmithProvider>
  </React.StrictMode>
);
