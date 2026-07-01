import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PatienceSite from "./PatienceSite.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PatienceSite />
  </StrictMode>
);
