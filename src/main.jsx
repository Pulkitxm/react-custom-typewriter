import React from "react";
import ReactDOM from "react-dom/client";
import Typewriter from "./Typewriter.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Typewriter onComplete={()=>console.log("complete")} />
);
