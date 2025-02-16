
let panel = document.querySelector('.load-products');
let currentPage = 1;


export function products() {
    console.log('products working');
    arrowStart();
    loadGeneralProducts(1);
    getCategories();
    setupSearchListeners();
}
export async function loadGeneralProducts(page) {

    try {
        const response = await fetch(`/indelsaRepo/public/api/productos/paginar?page=${page}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            updateGeneralMessage(data.productos.length, page, data.totalPages);
            displayProducts(data.productos);
            showRelatedProducts(data.productos);
            createPagination(data.totalPages, page);
        } else {
            panel.innerHTML = '<div class="alert alert-danger">Error al cargar productos</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        panel.innerHTML = '<div class="alert alert-danger">Error de conexión</div>';
    }
}

export async function fetchProductsByCategory(category, page = 1) {
    try {
        // Limpiar el panel antes de cargar los nuevos productos filtrados
        panel.innerHTML = '';

        const response = await fetch(`/indelsaRepo/public/api/productos/categorias/paginar?category=${category}&page=${page}`);
        const data = await response.json();

        // Asumimos que el API devuelve status, productos, currentPage y totalPages
        if (data.status === 'success') {
            const { productos, currentPage: apiCurrentPage, totalPages: apiTotalPages } = data;
            // Renderizamos los productos con la estructura requerida:
            updateFilterMessage(category, productos.length, apiCurrentPage, apiTotalPages);
            displayProducts(productos);
            createPagination(apiTotalPages, apiCurrentPage, category);
        } else {
            panel.innerHTML = '<div class="alert alert-danger">Error al cargar productos filtrados</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        panel.innerHTML = '<div class="alert alert-danger">Error de conexión</div>';
    }
}
// Modificar la función displayProductDetail para incluir el contexto de la categoría
async function displayProductDetail(productId, allProducts) {
    const product = allProducts.find(p => p.id === parseInt(productId));
    const currentCategory = getCurrentCategory(); // Obtener la categoría actual

    if (!product) {
        panel.innerHTML = '<div class="alert alert-danger">Producto no encontrado</div>';
        return;
    }

    try {
        const detailsResponse = await fetch(`/indelsaRepo/public/api/productos/detalles?id=${productId}`);
        const detalles = await detailsResponse.json();
        console.log('Detalles recibidos:', detalles);

        let detallesTecnicosHTML = '<p>Sin detalles técnicos disponibles</p>';

        if (detalles && Object.keys(detalles).length > 0) {
            detallesTecnicosHTML = `
                <div class="mt-4">
                    <p class="text-blue fs-3">DETALLES TÉCNICOS</p>
                    <ul class="list-unstyled">
                        ${Object.entries(detalles).map(([key, value]) => `
                            <li class="mb-4">
                                <strong class="text-secondary">${key}:</strong> 
                                <span class="ms-2">${value}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        console.log(product);
        
        panel.innerHTML = `
            <div class="container py-4">
    <div class="row justify-content-center">
        <div class="col-12 col-lg-10"> <!-- Wrapper column for centering -->
            <button class="btn btn-link d-flex align-items-center mb-4 text-orange back-button" data-category="${currentCategory || ''}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span class="ms-2">Volver a productos</span>
            </button>

            <!-- Product Description Card -->
            <div class="card border-0 mt-5 mb-4">
                <div class="row container g-0">
                    <div class="col-md-4 text-center">
                        <img src="../../uploads/${product.imagen}" class="img-fluid rounded" alt="${product.nombre}" style="max-width: 300px;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body text-justify-custom border-orange-bottom ps-3 ps-md-0 pt-5 me-0 me-md-0" style="max-width: 780px;">
                            <p class="mb-2 fs-4">DESCRIPCIÓN DEL PRODUCTO:</p>
                            <h2 class="text-blue mb-3">${product.nombre}</h2>
                            <p class="mb-3">${product.descripcion}</p>
                            <p class="mb-0 fw-bold">MARCA: ${product.marca}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Technical Details and Delivery Section -->
            <div class="card border-0">
                <div class="row container g-0 px-md-5">
                    <div class="col-md-9">
                        <div class="card-body">
                            <!-- Technical Details -->
                            <div id="detallesTecnicos" class="mb-4">
                                <p class="text-blue fs-4">DETALLES TÉCNICOS</p>
                                ${detalles && Object.keys(detalles).length > 0 ? `
                                    <ul class="list-unstyled">
                                        ${Object.entries(detalles).map(([key, value]) => `
                                            <li class="mb-2">
                                                <strong class="text-secondary">${key}:</strong> 
                                                <span class="ms-2">${value}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                    <button class="btn btn-warning btn-sm mt-2 text-white rounded-5 more-tec-info-btn">
                                        MAYOR INFORMACIÓN TÉCNICA
                                    </button>
                                ` : '<p>Sin detalles técnicos disponibles</p>'}
                            </div>

                            <!-- Delivery Information -->
                            <div class="mb-3">
                                <h5 class="text-blue mb-3">DISPONIBILIDAD Y TIEMPO DE ENTREGA</h5>
                                <div class="d-flex align-items-center mb-3">
                                    <img class="ms-3" src="../assets/img/oficinas-orange-icon.png" height="35">
                                    <span class="ms-3">Entrega en Nuestras Oficinas</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <img src="../assets/img/entregas-orange-icon.png" height="23" >
                                    <span class="ms-3">Puesto en sus almacenes - Lima y/o Agencia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quotation Button -->
                    <div class="col-md-3 px-4 py-md-3">
                        <a href="https://wa.me/" class="d-flex align-items-center flex-wrap flex-md-row cotizar-link">
                            <span class="text-orange me-3">Solicita tu Cotización</span>
                            <img src="../assets/img/green-wsp-icon.webp" alt="WhatsApp" class="ms-2 mt-md-3 mt-lg-3 mt-xl-0" style="width: 45px; height: 45px;">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        `;

        // Modificar el event listener del botón de volver
        const backButton = panel.querySelector('.back-button');
        backButton.addEventListener('click', () => {
            const category = backButton.dataset.category;
            if (category) {
                fetchProductsByCategory(category, 1);
            } else {
                loadGeneralProducts(1);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        panel.innerHTML = '<div class="alert alert-danger">Error al cargar los detalles del producto</div>';
    }
}
export async function displayProducts(productos) {
    panel.innerHTML = '';

    productos.forEach(product => {
        const productHTML = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card product-card border border-white" data-id="${product.id}">
                    <div class="card-img-container" style="height: 300px">
                        <img src="../../uploads/${product.imagen}" class="card-img-top img-fluid" alt="Producto" >
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-center">
                            <div class="product-info">
                                <div>
                                    <h5 class="card-title text-center text-blue fw-bold pt-3">${product.nombre}</h5>
                                </div>
                                <div class="d-flex justify-content-center align-items-center">
                                    <button class="btn discover-more-btn d-flex align-items-center gap-2" 
                                            data-product-id="${product.id}">
                                        <span class="text-orange">Descubre más</span>
                                        <img src="../assets/img/discover-more-orange-icon.png" 
                                             alt="discover-more-icon" 
                                             height="15">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        panel.insertAdjacentHTML('beforeend', productHTML);
    });

    // Add event listeners to discover buttons
    const discoverButtons = document.querySelectorAll('.discover-more-btn');
    discoverButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            displayProductDetail(productId, productos);
        });
    });
}
async function showRelatedProducts(productos) {
    const panelRelated = document.querySelector('.load-related-products');
    panelRelated.innerHTML = '';

    if (productos.length > 6) {
        productos = productos.sort(() => 0.5 - Math.random()).slice(0, 6);
    }

    productos.forEach(product => {
        const productHTML = `
            <div class="col-12 col-md-6 col-lg-4 col-xl-2 mb-4">
                <div class="card product-card border border-white" data-id="${product.id}">
                    <div class="card-img-container d-flex w-100">
                        <img src="../../uploads/${product.imagen}" class="card-img-top img-fluid p-md-5 p-lg-5 p-xl-0" alt="Producto" style="min-height: 180px;">
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-center">
                            <div class="product-info">
                                <div>
                                    <h5 class="card-title text-center text-blue fw-bold pt-3">${product.nombre}</h5>
                                </div>
                                <div class="d-flex justify-content-center align-items-center">
                                    <button class="btn bg-green-cotizar d-flex align-items-center gap-2" 
                                            data-product-id="${product.id}">
                                        <a href="#" class="text-white fw-bold cotizar-link">
                                        <img class="text-white" src="../assets/img/whatsapp-white-icon-transparent.png" alt="wsp-cotizar-icon" height="20">
                                        ¡COTIZAR!</a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        panelRelated.insertAdjacentHTML('beforeend', productHTML);
    });
}
// async function showKnowOurProducts(productos) {
//     console.log(productos);
    
//     const carouselInner = document.querySelector('#carouselknowOurProducts .know-our-products');
//     carouselInner.innerHTML = '';

//     // Si hay más de 9 productos, seleccionar 9 al azar
//     if (productos.length > 9) {
//         productos = productos.sort(() => 0.5 - Math.random()).slice(0, 9);
//     }

//     // Agrupar productos en grupos de 3 para cada slide
//     const productGroups = [];
//     for (let i = 0; i < productos.length; i += 3) {
//         productGroups.push(productos.slice(i, i + 3));
//     }

//     // Crear slides para cada grupo de productos
//     productGroups.forEach((group, index) => {
//         const slideHTML = `
//             <div class="carousel-item ${index === 0 ? 'active' : ''}">
//                 <div class="container">
//                     <div class="row justify-content-center">
//                         ${group.map(product => `
//                             <div class="col-12 col-md-6 col-lg-4">
//                                 <div class="card product-card border border-white" data-id="${product.id}">
//                                     <div class="card-img-container d-flex w-100">
//                                         <img src="../../uploads/${product.imagen}" 
//                                              class="card-img-top img-fluid p-md-5 p-lg-5 p-xl-0" 
//                                              alt="${product.nombre}"
//                                              style="min-height: 180px;">
//                                     </div>
//                                     <div class="card-body">
//                                         <div class="d-flex justify-content-center">
//                                             <div class="product-info">
//                                                 <div>
//                                                     <h5 class="card-title text-center text-blue fw-bold pt-3">
//                                                         ${product.nombre}
//                                                     </h5>
//                                                 </div>
//                                                 <div class="d-flex justify-content-center align-items-center">
//                                                     <button class="btn bg-green-cotizar d-flex align-items-center gap-2" 
//                                                             data-product-id="${product.id}">
//                                                         <a href="#" class="text-white fw-bold cotizar-link">
//                                                             <img class="text-white" 
//                                                                  src="../assets/img/whatsapp-white-icon-transparent.png" 
//                                                                  alt="wsp-cotizar-icon" 
//                                                                  height="20">
//                                                             ¡COTIZAR!
//                                                         </a>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         `).join('')}
//                     </div>
//                 </div>
//             </div>
//         `;

//         carouselInner.insertAdjacentHTML('beforeend', slideHTML);
//     });
// }


function updateGeneralMessage(totalResults, currentPage, totalPages) {
    const existingResetButton = document.querySelector('.reset-filter');
    if (existingResetButton) existingResetButton.remove();
    const mensajeContainer = document.getElementById('mensajeProductos');
    mensajeContainer.innerHTML = `
      <h2 class="text-blue">Todos los productos</h2>
      <p>Mostrando ${totalResults} resultados, página ${currentPage} de ${totalPages}</p>
    `;
}


function updateFilterMessage(category, totalResults, currentPage, totalPages) {
    const mensajeContainer = document.getElementById('mensajeProductos');
    // Actualizar solo el contenido del mensaje
    mensajeContainer.innerHTML = `
      <h2 class="text-blue">Categoría: ${category}</h2>
      <p>Mostrando ${totalResults} resultados, página ${currentPage} de ${totalPages}</p>
    `;

    // Crear botón de reset como elemento separado
    const existingResetButton = document.querySelector('.reset-filter');
    if (existingResetButton) existingResetButton.remove(); // Eliminar botón anterior

    const resetButton = document.createElement('button');
    resetButton.className = 'btn bg-blue-color text-white reset-filter mb-4 ms-3';
    resetButton.style.width = '150px';
    resetButton.textContent = 'Limpiar Filtro';

    // Insertar el botón DESPUÉS del contenedor
    mensajeContainer.insertAdjacentElement('afterend', resetButton);

    // Agregar evento
    resetButton.addEventListener('click', () => loadGeneralProducts(1));
}
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const category = getCurrentCategory();
    
    if (!searchTerm) return;
    
    if (category) {
        searchInFilteredProducts(category, searchTerm, 1);
    } else {
        fetch(`/indelsaRepo/public/api/productos/buscar?q=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data);
            })
            .catch(error => console.error('Error:', error));
    }
}

function displayResults(products) {

    const panel = document.querySelector('.load-products');
    panel.innerHTML = ''; // Limpiar resultados previos

    if (products.length === 0) {
        panel.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
        return;
    }

    products.forEach(product => {
        const productHTML = `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card product-card border border-white" data-id="${product.id}">
                    <div class="card-img-container" style="height: 300px">
                        <img src="../../uploads/${product.imagen}" class="card-img-top img-fluid" alt="Producto">
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-center">
                            <div class="product-info">
                                <div>
                                    <h5 class="card-title text-center text-blue fw-bold pt-3">${product.nombre}</h5>
                                </div>
                                <div class="d-flex justify-content-center align-items-center">
                                    <button class="btn discover-more-btn d-flex align-items-center gap-2" 
                                            data-product-id="${product.id}">
                                        <span class="text-orange">Descubre más</span>
                                        <img src="../img/discover-more-orange-icon.png" 
                                             alt="discover-more-icon" 
                                             height="15">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        panel.insertAdjacentHTML('beforeend', productHTML);
    });
    // Agregar event listeners a los botones "Descubre más"
    const discoverButtons = document.querySelectorAll('.discover-more-btn');
    discoverButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            displayProductDetail(productId, products);
        });
    });

}


function generatePaginationItems(totalPages, currentActivePage) {
    let items = '';
    for (let i = 1; i <= totalPages; i++) {
        items += `
            <li class="page-item ${currentActivePage === i ? 'active' : ''}">
                <button class="page-link" data-page="${i}">${i}</button>
            </li>
        `;
    }
    return items;
}

// Función unificada para búsqueda en categorías
async function searchInFilteredProducts(category, searchTerm, page) {
    try {
        const res = await fetch(`/indelsaRepo/public/api/productos/categorias/buscar?category=${encodeURIComponent(category)}&search=${encodeURIComponent(searchTerm)}&page=${page}`);
        const data = await res.json();
        
        const productPanel = document.querySelector('.load-products');
        productPanel.innerHTML = '';

        if (data.status === 'success' && data.productos && data.productos.length > 0) {

            if (data.productos.includes('No se encontraron resultados')) {
                productPanel.innerHTML = `
                <div class="col-12 text-center">
                        <p>No se encontraron productos que coincidan con "${searchTerm}" en la categoría "${category}".</p>
                        <p class="mb-0">Intenta con otros términos de búsqueda.</p>
                </div>
            `;
            return;
            }
            // Usar la misma estructura de displayProducts
            displayProducts(data.productos);
            
            // Actualizar mensaje con paginación
            updateFilterMessage(category, data.productos.length, data.currentPage, data.totalPages);
            
            // Crear paginación con contexto de búsqueda
            createPagination(data.totalPages, data.currentPage, category, searchTerm);
            
        } else {
            // Mensaje cuando no hay resultados
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
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        productPanel.innerHTML = `
            <div class="col-12 text-center">
                <p>Ocurrió un error al buscar los productos. Por favor, intenta nuevamente.</p>
            </div>
        `;
    }
}


function setupSearchListeners() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    // Remove existing listeners first to prevent duplicates
    searchButton.removeEventListener('click', performSearch);
    searchInput.removeEventListener('keypress', handleSearchKeypress);
    searchInput.removeEventListener('input', handleSearchInput);
    
    // Add new listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', handleSearchKeypress);
    searchInput.addEventListener('input', handleSearchInput);
}
function handleSearchKeypress(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
}

function handleSearchInput() {
    const searchTerm = this.value.trim();
    const category = getCurrentCategory();
    
    if (searchTerm === '') {
        if (category) {
            fetchProductsByCategory(category, 1);
        } else {
            loadGeneralProducts(1);
        }
    }
}

function getCurrentCategory() {
    const categoryElement = document.querySelector('#mensajeProductos h2.text-blue');
    if (!categoryElement) return null;
    
    const text = categoryElement.textContent;
    return text.startsWith('Categoría: ') ? text.replace('Categoría: ', '').trim() : null;
}

// Modificar createPagination para soportar búsqueda
function createPagination(totalPages, currentActivePage, category = null, searchTerm = '') {
    const existingPagination = panel.querySelector('.pagination-container');
    if (existingPagination) existingPagination.remove();

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container col-12 d-flex justify-content-center mt-4';

    const pagination = `
        <nav aria-label="Navegación de productos">
            <ul class="pagination">
                <li class="page-item ${currentActivePage <= 1 ? 'disabled' : ''}">
                    <button class="page-link" data-page="${currentActivePage - 1}" ${currentActivePage <= 1 ? 'disabled' : ''}>
                        Anterior
                    </button>
                </li>
                ${generatePaginationItems(totalPages, currentActivePage)}
                <li class="page-item ${currentActivePage >= totalPages ? 'disabled' : ''}">
                    <button class="page-link" data-page="${currentActivePage + 1}" ${currentActivePage >= totalPages ? 'disabled' : ''}>
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    `;

    paginationContainer.innerHTML = pagination;
    panel.appendChild(paginationContainer);

    paginationContainer.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        const newPage = parseInt(target.dataset.page);

        if (target.classList.contains('page-link') && newPage) {
            if (category) {
                if (searchTerm) {
                    searchInFilteredProducts(category, searchTerm, newPage);
                } else {
                    fetchProductsByCategory(category, newPage);
                }
            } else {
                loadGeneralProducts(newPage, searchTerm);
            }
        }
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
            loadGeneralProducts(1) // Cargar todos los productos
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
const arrowStart = () => {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove("d-none");
        } else {
            scrollToTopBtn.classList.add("d-none");
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
};