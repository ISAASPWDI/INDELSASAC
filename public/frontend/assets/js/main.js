import { loginAuth } from "./loginAuth.js";
import { panelDeControl } from "./panelDeControl.js";
import { filtrarPorCategoria } from "./filtrarPorCategoria.js";

const d = document;
const page = d.body.dataset.page;

const pageFunctions = {
  login: loginAuth,
  panel: () => {
    panelDeControl();
    filtrarPorCategoria();
  }
};
if (pageFunctions[page]) {
  pageFunctions[page](); // Ejecuta la función si esta en pageFunctions
}

