
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {AppContextProvider} from "./context/AppContext.jsx";

AppContextProvider;
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
      <ToastContainer position="center" autoClose={2000}/>
    </AppContextProvider>
  </BrowserRouter>
);
