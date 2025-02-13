let panel = document.querySelector('.load-products-panel');
let currentPage = 1;
export function panelDeControl() {
    // Initial load
    arrowStart();
    showUserName();
    loadProducts(currentPage);
}
export async function loadProducts(page) {
    try {
        const response = await fetch(`/indelsaRepo/public/api/productos/paginar?page=${page}`);
        const data = await response.json();

        if (data.status === 'success') {
            displayProducts(data.productos);
            createPagination(data.totalPages, page); // Use page parameter instead of currentPage
        } else {
            panel.innerHTML = '<div class="alert alert-danger">Error al cargar productos</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        panel.innerHTML = '<div class="alert alert-danger">Error de conexión</div>';
    }
}

function displayProducts(productos) { 
    
    document.getElementById('searchButton').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    document.getElementById('searchInput').addEventListener('input', function () {
        const paginationContainerFiltered = document.querySelector('.pagination-container-filtered');
        if (this.value.trim() === '' && !paginationContainerFiltered) {
            loadProducts(1);
        }
    });

    panel.innerHTML = '';

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
    
        panel.insertAdjacentHTML('beforeend', productHTML);
    
        // Llamar a la API para obtener los detalles técnicos y actualizar el contenido
        const detallesContainer = document.getElementById(`detalles-${product.id}`);
        getProductDetails(product.id, detallesContainer);
    });
    
//AGREGAR EVENTOS PARA EDITAR Y ELIMINAR AQUI:
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async function () {
        const productId = this.closest('.product-card').dataset.id;

        // Obtener datos del producto
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.card-title').textContent;
        const productBrand = productCard.querySelector('.card-text.text-muted').textContent.replace('Marca: ', '');
        const productDescription = productCard.querySelector('.card-text.pt-3').textContent.trim();

        // Llenar los inputs
        document.getElementById('editProductId').value = productId;
        document.getElementById('editProductName').value = productName;
        document.getElementById('editProductBrand').value = productBrand;
        document.getElementById('editProductDescription').value = productDescription;

        // Obtener y mostrar los detalles técnicos en inputs editables
        const detailsContainer = document.getElementById('editProductDetails');
        detailsContainer.innerHTML = "<p>Cargando...</p>";

        try {
            const res = await fetch(`/indelsaRepo/public/api/productos/detalles?id=${productId}`);
            const details = await res.json();

            detailsContainer.innerHTML = Object.entries(details)
                .map(([key, value]) => `
                    <div class="input-group mb-2">
                        <input type="text" class="form-control key-detail" placeholder="Clave" value="${key}">
                        <input type="text" class="form-control value-detail" placeholder="Valor" value="${value}">
                        <button type="button" class="btn btn-danger remove-detail">X</button>
                    </div>
                `).join("") || `<p>No hay detalles técnicos</p>`;
        } catch (error) {
            console.error("Error al obtener detalles técnicos:", error);
            detailsContainer.innerHTML = "<p class='text-danger'>Error al cargar detalles</p>";
        }

        new bootstrap.Modal(document.getElementById('editProductModal')).show();
    });
});

// Agregar nuevo detalle técnico
document.getElementById('addDetail').addEventListener('click', function () {
    const detailsContainer = document.getElementById('editProductDetails');
    const newDetail = document.createElement('div');
    newDetail.classList.add('input-group', 'mb-2');
    newDetail.innerHTML = `
        <input type="text" class="form-control key-detail" placeholder="Clave">
        <input type="text" class="form-control value-detail" placeholder="Valor">
        <button type="button" class="btn btn-danger remove-detail">X</button>
    `;
    detailsContainer.appendChild(newDetail);
});

// Eliminar un campo de detalle técnico
document.getElementById('editProductDetails').addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-detail')) {
        event.target.parentElement.remove();
    }
});

// Guardar los cambios en el producto
document.getElementById('editProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const productId = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const brand = document.getElementById('editProductBrand').value;
    const description = document.getElementById('editProductDescription').value;

    // Obtener los detalles técnicos desde los inputs
    const details = {};
    document.querySelectorAll('.key-detail').forEach((keyInput, index) => {
        const key = keyInput.value.trim();
        const value = document.querySelectorAll('.value-detail')[index].value.trim();
        if (key && value) details[key] = value;
    });

    // Crear FormData para enviar datos y la imagen
    const formData = new FormData();
    formData.append("nombre", name);
    formData.append("marca", brand);
    formData.append("descripcion", description);
    formData.append("detalles", JSON.stringify(details));

    // Verificar si se subió una nueva imagen
    const fileInput = document.getElementById('editProductImage');
    if (fileInput.files.length > 0) {
        formData.append("imagen", fileInput.files[0]);
    } else {
        formData.append("imagen_actual", document.getElementById('editProductImageActual').value);
    }

    try {
        const res = await fetch(`/indelsaRepo/public/api/productos/editar?id=${productId}`, {
            method: 'PUT',
            body: formData
        });

        const result = await res.json();
        if (result.status === "success") {
            alert("Producto actualizado correctamente");
            location.reload();
        } else {
            alert("Error al actualizar el producto: " + result.message);
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        alert("Hubo un error al intentar actualizar el producto.");
    }
});


}


function createPagination(totalPages, currentActivePage) {
    // Remove existing pagination if any
    const existingPagination = panel.querySelector('.pagination-container');
    if (existingPagination) {
        existingPagination.remove();
    }

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

    // Add event listeners to pagination controls
    paginationContainer.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;

        if (target.classList.contains('page-link')) {
            const newPage = parseInt(target.dataset.page);
            if (newPage && newPage !== currentActivePage && newPage > 0 && newPage <= totalPages) {
                currentPage = newPage; // Update the currentPage variable
                loadProducts(newPage);
            }
        }
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



function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const paginationContainerFiltered = document.querySelector('.pagination-container-filtered');
    if (paginationContainerFiltered) {
        return;
    }
    if (!searchTerm) {
        return;
    }

    fetch(`/indelsaRepo/public/api/productos/buscar?q=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            
            displayResults(data);
            
        })
        .catch(error => console.error('Error:', error));
}


function displayResults(products) {
    
    const panel = document.querySelector('.load-products-panel');
    panel.innerHTML = ''; // Limpiar resultados previos

    if (products.length === 0) {
        panel.innerHTML = '<p class="text-center">No se encontraron productos.</p>';
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
    products.forEach(product => {
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
        panel.insertAdjacentHTML('beforeend', productHTML);
        // Llamar a la API para obtener los detalles técnicos y actualizar el contenido
        const detallesContainer = document.getElementById(`detalles-${product.id}`);
        getProductDetails(product.id, detallesContainer);
    });

    //AGREGAR EVENTOS PARA EDITAR Y ELIMINAR AQUI:
    
}
const showUserName = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    // Actualizar el DOM con los datos del usuario
    if (userData) {
        const userNameElement = document.querySelector('.user-data-name');
        if (userNameElement) {
            userNameElement.textContent = userData.nombre; // Usar el nombre del usuario o un valor predeterminado
        }
    } else {
        console.warn('No se encontraron datos de usuario en localStorage.');
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