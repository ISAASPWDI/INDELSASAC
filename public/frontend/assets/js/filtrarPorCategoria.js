import { initializeEventListeners, loadProducts } from "./panelDeControl.js";
let currentCategory = "Todos";

export function filtrarPorCategoria() {
    getCategories();
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchTerm = this.value.trim();
        const paginationContainerFiltered = document.querySelector('.pagination-container-filtered');
        if (!paginationContainerFiltered) {
            return;
        }
        // Limpiar el timeout anterior
        clearTimeout(searchTimeout);

        // Establecer un nuevo timeout
        searchTimeout = setTimeout(() => {
            if (searchTerm === '') {
                fetchProductsByCategory(currentCategory, 1);
                return;
            }

            searchInFilteredProducts(currentCategory, searchTerm, 1);
        }, 300); // Esperar 300ms después de que el usuario deje de escribir
    });

}

async function getCategories() {
    try {
        const res = await fetch(`/indelsaRepo/public/api/categorias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const categories = await res.json();

        // Obtener el contenedor de categorías y el offcanvas
        const container = document.querySelector('.filter-product-container');
        const offcanvasElement = document.getElementById('filterProducts');
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);

        // Crear el elemento "Todos"
        const allCategoriesItem = document.createElement('a');
        allCategoriesItem.href = "#";
        allCategoriesItem.classList.add("list-group-item", "list-group-item-action", "custom-filter-item");
        allCategoriesItem.textContent = "Todos";
        allCategoriesItem.addEventListener("click", async (event) => {
            event.preventDefault();
            offcanvas.hide();
            await fetchProductsByCategory("Todos", 1); // Cargar todos los productos
        });

        // Limpiar el contenedor y agregar el elemento "Todos"
        container.innerHTML = "";
        container.appendChild(allCategoriesItem);

        // Crear elementos para cada categoría
        categories.forEach(category => {
            const categoryItem = document.createElement('a');
            categoryItem.href = "#";
            categoryItem.classList.add("list-group-item", "list-group-item-action", "custom-filter-item");
            categoryItem.textContent = category.nombre;

            // Agregar un event listener para cada categoría
            categoryItem.addEventListener("click", async (event) => {
                event.preventDefault();
                offcanvas.hide();
                await fetchProductsByCategory(category.nombre, 1); // Filtrar por categoría
            });

            container.appendChild(categoryItem);
        });
    } catch (error) {
        console.error("Error al obtener categorías:", error);
    }
}
// Contenedor principal donde se muestran los productos
const productPanel = document.querySelector('.load-products-panel');
let currentCategoryPage = 1;
let totalCategoryPages = 1;
async function fetchProductsByCategory(category, page = 1) {
    try {
        // Limpiar el contenedor de productos antes de cargar nuevos
        productPanel.innerHTML = '';

        let url = `/indelsaRepo/public/api/productos/categorias/paginar?category=${category}&page=${page}`;

        const res = await fetch(url);
        const data = await res.json();
        console.log(data);

        if (data) {



            const { productos, currentPage: apiCurrentPage, totalPages: apiTotalPages } = data;
            currentCategory = category;



            // Actualizar variables globales
            currentCategoryPage = apiCurrentPage;
            totalCategoryPages = apiTotalPages;
            const productsMessage = document.querySelector('.load-message-filter-products');

            // Limpiar elementos previos si existen
            const existingCategoryMessage = productsMessage.querySelector('h4.category-title');
            if (existingCategoryMessage) {
                existingCategoryMessage.remove();
            }

            const existingResultMessage = productsMessage.querySelector('p.text-muted');
            if (existingResultMessage) {
                existingResultMessage.remove();
            }


            const existingButton = productsMessage.querySelector('.reset-button');
            if (existingButton) {
                existingButton.remove();
            }


            const categoryMessage = document.createElement('h4');
            categoryMessage.textContent = `Categoría: ${category}`;
            categoryMessage.classList.add('category-title', 'mb-3');
            productsMessage.insertAdjacentElement('afterbegin', categoryMessage);


            const pMessage = document.createElement('p');
            pMessage.textContent = `Mostrando ${productos.length} resultados de ${apiTotalPages} páginas.`;
            pMessage.classList.add('text-muted', 'mb-3');
            productsMessage.insertAdjacentElement('afterbegin', pMessage);


            const resetButton = document.createElement('button');
            resetButton.textContent = "Limpiar Filtro";
            resetButton.classList.add('btn', 'bg-blue-color', 'reset-button', 'mb-3', 'text-white');
            resetButton.addEventListener("click", () => {
                // Función para eliminar elementos específicos dentro de un contenedor
                const removeElements = (container, selectors) => {
                    selectors.forEach(selector => {
                        const element = container.querySelector(selector);
                        if (element) element.remove();
                    });
                };
                // Limpiar elementos previos
                const productsMessage = document.querySelector('.load-message-filter-products');
                const paginationContainer = document.querySelector('.pagination-container-filtered');
                removeElements(productsMessage, ['h4.category-title', 'p.text-muted']);
                if (paginationContainer) paginationContainer.remove();
                resetButton.remove();
                loadProducts(1);
            });
            productsMessage.insertAdjacentElement('afterbegin', resetButton);
            
            // panel.innerHTML = '';


            //         if (FilteredProducts.length === 0) {
            //             panel.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
            //             return;
            //         }

            async function getProductDetails(productId, container) {
                try {
                    const res = await fetch(`/indelsaRepo/public/api/productos/detalles?id=${productId}`);
                    const details = await res.json();

                    if (!details || Object.keys(details).length === 0) {
                        container.innerHTML = "<li>No especificados</li>";
                        return;
                    }

                    container.innerHTML = Object.entries(details)
                        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
                        .join("");
                } catch (error) {
                    console.error("Error al obtener detalles técnicos:", error);
                    container.innerHTML = "<li>Error al cargar detalles</li>";
                }
            }
            productos.forEach(product => {
                const productHTML = `
                    <div class="col-12 col-md-6 col-lg-4 mb-4">
                        <div class="card product-card" data-id="${product.id}">
                            <div class="card-img-container">
                                <img src="../../uploads/${product.imagen}" class="card-img-top img-fluid" alt="Producto">
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div class="product-info">
                                        <h5 class="card-title fw-bold pt-3">${product.nombre}</h5>
                                        <p class="card-text text-muted small">Marca: ${product.marca || 'No especificada'}</p>
                                    </div>
                                    <div class="d-flex justify-content-end gap-2">
                                        <button class="btn text-blue my-4 edit-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil h-4 w-4">
                                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                                <path d="m15 5 4 4"></path>
                                            </svg>
                                        </button>
                                        <button class="btn text-orange my-4 delete-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 h-4 w-4">
                                                <path d="M3 6h18"></path>
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                                <line x1="14" x2="14" y1="11" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p class="card-text pt-3 text-justify-custom">${product.descripcion}</p>
                                <hr>
                                <p class="card-text">
                                    <span class="fw-bold">Detalles técnicos:</span>
                                    <ul class="mt-2 detalles-tecnicos" id="detalles-${product.id}">
                                        <li>Cargando...</li>
                                    </ul>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
                productPanel.insertAdjacentHTML('beforeend', productHTML);

                // Obtener detalles técnicos
                const detallesContainer = document.getElementById(`detalles-${product.id}`);
                getProductDetails(product.id, detallesContainer);

                if (productos.includes("No se encontraron resultados")) {
                    productPanel.innerHTML = `<p class="text-center">No se encontraron productos</p>`;
                    return;
                }


            });



            // Renderizar botones de paginación
            renderPaginationButtons(category);
            //AGREGAR EVENTOS PARA EDITAR Y ELIMINAR AQUI:
            initializeEventListeners();

        } else {
            console.error("Error al obtener productos:", data.message);
            productPanel.innerHTML = "<p>Error al cargar productos.</p>";
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        productPanel.innerHTML = "<p>Error al cargar productos.</p>";
    }
}
function renderPaginationButtons(category) {
    // Eliminar cualquier contenedor de paginación existente
    const existingPagination = document.querySelector('.pagination-container-filtered');
    if (existingPagination) {
        existingPagination.remove();
    }

    // Crear un nuevo contenedor para la paginación
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination-container-filtered', 'd-flex', 'justify-content-center', 'mt-4');

    // Crear botón "Anterior"
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.classList.add('btn', 'btn-outline-primary', 'me-2'); // Estilo Bootstrap
    prevButton.disabled = currentCategoryPage === 1;
    prevButton.addEventListener('click', () => fetchProductsByCategory(category, currentCategoryPage - 1));
    paginationContainer.appendChild(prevButton);

    // Crear botones de números
    for (let i = 1; i <= totalCategoryPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('btn', i === currentCategoryPage ? 'btn-primary' : 'btn-outline-primary', 'me-2'); // Estilo Bootstrap
        button.addEventListener('click', () => fetchProductsByCategory(category, i));
        paginationContainer.appendChild(button);
    }

    // Crear botón "Siguiente"
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.classList.add('btn', 'btn-outline-primary'); // Estilo Bootstrap
    nextButton.disabled = currentCategoryPage === totalCategoryPages;
    nextButton.addEventListener('click', () => fetchProductsByCategory(category, currentCategoryPage + 1));
    paginationContainer.appendChild(nextButton);

    // Agregar el contenedor de paginación después del contenedor de productos
    productPanel.insertAdjacentElement('afterend', paginationContainer);

}
// Función para buscar en productos filtrados
async function searchInFilteredProducts(category, searchTerm, page) {
    try {
        const res = await fetch(`/indelsaRepo/public/api/productos/categorias/buscar?category=${category}&search=${searchTerm}&page=${page}`);
        const data = await res.json();

        // Limpiar el panel actual siempre, independientemente de si hay resultados o no
        productPanel.innerHTML = '';


        // Verificar si hay productos y si el array no está vacío
        if (data && data.productos && data.productos.length > 0) {
            console.log(data.productos);
            if (data.productos.includes('No se encontraron resultados')) {
                productPanel.innerHTML = `
                <div class="col-12 text-center">
                        <p>No se encontraron productos que coincidan con "${searchTerm}" en la categoría "${category}".</p>
                        <p class="mb-0">Intenta con otros términos de búsqueda.</p>
                </div>
            `;
                return;
            }
            async function getProductDetails(productId, container) {
                try {
                    const res = await fetch(`/indelsaRepo/public/api/productos/detalles?id=${productId}`);
                    const details = await res.json();

                    if (!details || Object.keys(details).length === 0) {
                        container.innerHTML = "<li>No especificados</li>";
                        return;
                    }

                    container.innerHTML = Object.entries(details)
                        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
                        .join("");
                } catch (error) {
                    console.error("Error al obtener detalles técnicos:", error);
                    container.innerHTML = "<li>Error al cargar detalles</li>";
                }
            }
            data.productos.forEach(product => {
                const productHTML = `
                    <div class="col-12 col-md-6 col-lg-4 mb-4">
                        <div class="card product-card" data-id="${product.id}">
                            <div class="card-img-container">
                                <img src="../../uploads/${product.imagen}" class="card-img-top img-fluid" alt="Producto">
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div class="product-info">
                                        <h5 class="card-title fw-bold pt-3">${product.nombre}</h5>
                                        <p class="card-text text-muted small">Marca: ${product.marca || 'No especificada'}</p>
                                    </div>
                                    <div class="d-flex justify-content-end gap-2">
                                        <button class="btn text-blue my-4 edit-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil h-4 w-4">
                                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                                <path d="m15 5 4 4"></path>
                                            </svg>
                                        </button>
                                        <button class="btn text-orange my-4 delete-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 h-4 w-4">
                                                <path d="M3 6h18"></path>
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                                <line x1="14" x2="14" y1="11" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p class="card-text pt-3 text-justify-custom">${product.descripcion}</p>
                                <hr>
                                <p class="card-text">
                                    <span class="fw-bold">Detalles técnicos:</span>
                                    <ul class="mt-2 detalles-tecnicos" id="detalles-${product.id}">
                                        <li>Cargando...</li>
                                    </ul>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
                productPanel.insertAdjacentHTML('beforeend', productHTML);

                const detallesContainer = document.getElementById(`detalles-${product.id}`);
                getProductDetails(product.id, detallesContainer);
            });

            // Actualizar mensaje de resultados
            const pMessage = document.querySelector('.load-message-filter-products p.text-muted');
            if (pMessage) {
                pMessage.textContent = `Mostrando ${data.productos.length} resultados de búsqueda`;
            }
            //AGREGAR EVENTOS PARA EDITAR Y ELIMINAR AQUI
            initializeEventListeners();
        } else {
            // Mostrar mensaje cuando no hay resultados
            productPanel.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info" role="alert">
                        <h4 class="alert-heading">No se encontraron productos</h4>
                        <p>No se encontraron productos que coincidan con "${searchTerm}" en la categoría "${category}".</p>
                        <hr>
                        <p class="mb-0">Intenta con otros términos de búsqueda.</p>
                    </div>
                </div>
            `;

            // Actualizar mensaje de resultados
            const pMessage = document.querySelector('.load-message-filter-products p.text-muted');
            if (pMessage) {
                pMessage.textContent = `No se encontraron resultados para "${searchTerm}"`;
            }
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        // Mostrar mensaje de error
        productPanel.innerHTML = `
            <div class="col-12 text-center">
                    <p>Ocurrió un error al buscar los productos. Por favor, intenta nuevamente.</p>
            </div>
        `;
    }
}

// Agregar el event listener con debounce



