import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);