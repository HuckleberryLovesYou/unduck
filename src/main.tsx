import { render } from "preact";
import { App } from "./app";
import "./global.css";

const appElement = document.getElementById("app");
if (appElement) {
    render(<App />, appElement);
}
