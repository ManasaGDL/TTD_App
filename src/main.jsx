import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingProvider, useLoading } from "./context/LoadingContext.jsx";

import AuthProvider from "./context/AuthProvider.jsx";
import { Toaster } from "sonner";
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <LoadingProvider>
                <Toaster richColors position="top-center" />
                <Router>
                    <App />
                </Router>
            </LoadingProvider>
        </AuthProvider>
    </React.StrictMode>
);
