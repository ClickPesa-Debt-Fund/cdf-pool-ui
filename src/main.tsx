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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FlagsmithProvider
      options={{
        environmentID: process.env.VITE_FLAGSMITH_ENVIRONMENT_KEY ?? "",
      }}
      flagsmith={flagsmith}
    >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <App />
            <Toaster />
          </ErrorBoundary>
        </QueryClientProvider>
      </BrowserRouter>
    </FlagsmithProvider>
  </React.StrictMode>
);
