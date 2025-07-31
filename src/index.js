import "./styles.css";
import DOMController from "./dom";

document.addEventListener("DOMContentLoaded", () => {
  const ui = DOMController();
  ui.start();
});
