import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initializeAnalytics } from "./utils/analytics";
import { initializeClarity } from "./utils/clarity";

initializeAnalytics();
initializeClarity();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
