import { loginAuth } from "./loginAuth.js";
import { panelDeControl } from "./panelDeControl.js";
import { filtrarPorCategoria } from "./filtrarPorCategoria.js";
import { products } from "./products.js";
import { showKnowOurProducts } from "./knowOurProducts.js";
import { contactForm } from "./contactForm.js";

const d = document;
const page = d.body.dataset.page;

const pageFunctions = {
  login: loginAuth,
  panel: () => {
    panelDeControl();
    filtrarPorCategoria();
  },
  products: products,
  knowProducts: async () => {
    await showKnowOurProducts();
  },
  contact: contactForm
};
if (pageFunctions[page]) {
  pageFunctions[page](); // Ejecuta la función si esta en pageFunctions
}

