let panel = document.querySelector('.load-products-panel');
let currentPage = 1;
let categorias = [];
export function panelDeControl() {
    // Initial load
    arrowStart();
    showUserName();
    const logoutButton = document.querySelector('.nav-item button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    loadProducts(currentPage);

    fetch('/indelsaRepo/public/api/categorias')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            categorias = data; // Almacenar las categorías en la variable global

            // Select para Agregar Producto
            const selectAddProduct = document.getElementById('addProductCategory');
            // Select para Editar Producto
            const selectEditProduct = document.getElementById('editProductCategory');
            // Select para Editar Categoría
            const selectEditCategory = document.getElementById('editCategorySelect');
            // Select para Eliminar Categoría
            const selectDeleteCategory = document.getElementById('deleteCategorySelect');

            // Limpiar selects antes de agregar opciones
            selectAddProduct.innerHTML = '';
            selectEditProduct.innerHTML = '';
            selectEditCategory.innerHTML = '';
            selectDeleteCategory.innerHTML = '';

            // Agregar opciones a cada select
            data.forEach(categoria => {
                // Opción para Agregar Producto
                const optionAP = document.createElement('option');
                optionAP.value = categoria.id;
                optionAP.textContent = categoria.nombre;
                selectAddProduct.appendChild(optionAP);

                // Opción para Editar Producto
                const optionEP = document.createElement('option');
                optionEP.value = categoria.id;
                optionEP.textContent = categoria.nombre;
                selectEditProduct.appendChild(optionEP);

                // Opción para Editar Categoría
                const optionEC = document.createElement('option');
                optionEC.value = categoria.id;
                optionEC.textContent = categoria.nombre;
                selectEditCategory.appendChild(optionEC);

                // Opción para Eliminar Categoría
                const optionDelete = document.createElement('option');
                optionDelete.value = categoria.id;
                optionDelete.textContent = categoria.nombre;
                selectDeleteCategory.appendChild(optionDelete);
            });
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });
    // Agregar nuevo detalle técnico
    document.getElementById('addDetailAP').addEventListener('click', function () {
        const detailsContainer = document.getElementById('addProductDetails');
        const newDetail = document.createElement('div');
        newDetail.classList.add('input-group', 'mb-2');
        newDetail.innerHTML = `
        <input type="text" class="form-control key-detailAP" placeholder="Detalle">
        <input type="text" class="form-control value-detailAP" placeholder="Característica">
        <button type="button" class="btn btn-danger remove-detailAP">X</button>
    `;
        detailsContainer.appendChild(newDetail);
    });
    // Eliminar un campo de detalle técnico
    document.getElementById('addProductDetails').addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-detailAP')) {
            event.target.parentElement.remove();
        }
    });
    document.getElementById('addProductForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', document.getElementById('addProductName').value);
        formData.append('marca', document.getElementById('addProductBrand').value);
        formData.append('descripcion', document.getElementById('addProductDescription').value);
        formData.append('imagen', document.getElementById('addProductImage').files[0]);

        // Obtener los detalles técnicos
        const detalles = {};
        document.querySelectorAll('#addProductDetails .input-group').forEach(group => {
            const key = group.querySelector('.key-detailAP').value.trim();
            const value = group.querySelector('.value-detailAP').value.trim();
            if (key && value) detalles[key] = value;
        });
        formData.append('detalles', JSON.stringify(detalles));

        // Incluir la categoría seleccionada
        const categoriaId = document.getElementById('addProductCategory').value;
        formData.append('categorias', categoriaId);
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const res = await fetch('/indelsaRepo/public/api/productos/agregar', {
                method: 'POST',
                body: formData
            });
            console.log(res.status);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Error HTTP: ${res.status}`);
            }

            const result = await res.json();



            if (result.status === "success") {
                alert("Producto agregado correctamente");
                location.reload();
            } else {
                alert("Error al agregar el producto: " + result.message);
            }
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Error al agregar el producto: " + error.message);
        }
    });




}
export async function loadProducts(page) {

    try {
        const response = await fetch(`/indelsaRepo/public/api/productos/paginar?page=${page}`);
        const data = await response.json();

        if (data.status === 'success') {
            displayProducts(data.productos);
            createPagination(data.totalPages, page);
        } else {
            panel.innerHTML = '<div class="alert alert-danger">Error al cargar productos</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        panel.innerHTML = '<div class="alert alert-danger">Error de conexión</div>';
    }
}

function displayProducts(productos) {
    // Remover event listeners existentes
    // const searchButton = document.getElementById('searchButton');
    // const searchInput = document.getElementById('searchInput');
    // const oldSearchButton = searchButton.cloneNode(true);
    // const oldSearchInput = searchInput.cloneNode(true);
    // searchButton.parentNode.replaceChild(oldSearchButton, searchButton);
    // searchInput.parentNode.replaceChild(oldSearchInput, searchInput);

    // Remover event listeners del formulario y botones
    document.querySelectorAll('.edit-btn').forEach(button => {
        const oldButton = button.cloneNode(true);
        button.parentNode.replaceChild(oldButton, button);
    });

    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        const oldForm = editForm.cloneNode(true);
        editForm.parentNode.replaceChild(oldForm, editForm);
    }

    const addDetailButton = document.getElementById('addDetail');
    if (addDetailButton) {
        const oldAddDetail = addDetailButton.cloneNode(true);
        addDetailButton.parentNode.replaceChild(oldAddDetail, addDetailButton);
    }

    const editProductDetails = document.getElementById('editProductDetails');
    if (editProductDetails) {
        const oldDetails = editProductDetails.cloneNode(true);
        editProductDetails.parentNode.replaceChild(oldDetails, editProductDetails);
    }
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

    // const showingResultsParr = document.createElement('p');
    // const showingResults = document.querySelector('.load-message-products');
    // showingResultsParr.classList.add('add-pages-text')
    // showingResultsParr.textContent = `Mostrando ${productos.length} resultados`;
    // showingResults.insertAdjacentElement('afterbegin', showingResultsParr);





    // showingResults.innerHTML = `<p class="text-muted">Mostrando resultados</p>`;





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

    // Inicializar todos los event listeners
    initializeEventListeners();
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
    // const paginationText = document.querySelector('.add-pages-text');
    // const paginationTextEl = document.createElement('span');
    // paginationTextEl.textContent = ` página ${currentActivePage} de ${totalPages}`
    // paginationText.appendChild(paginationTextEl);

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
    initializeEventListeners();
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

const handleLogout = async () => {
    try {
        const response = await fetch('/indelsaRepo/public/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.status === 'success') {
            localStorage.removeItem('user'); // Eliminar datos del usuario del localStorage
            window.location.href = data.redirect;
        } else {
            alert(data.message || 'Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error completo:', error);
        alert('Error al intentar cerrar sesión: ' + error.message);
    }
}
// Función principal para gestionar todos los event listeners
export function initializeEventListeners() {
    // Función auxiliar para remover y reiniciar event listeners
    function removeAndReinitialize(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const oldElement = element.cloneNode(true);
            element.parentNode.replaceChild(oldElement, element);
            return oldElement;
        }
        return null;
    }

    // Función para remover listeners de múltiples elementos
    function removeMultipleListeners(selector) {
        document.querySelectorAll(selector).forEach(element => {
            const oldElement = element.cloneNode(true);
            element.parentNode.replaceChild(oldElement, element);
        });
    }

    // Remover listeners existentes
    removeMultipleListeners('.edit-btn');
    removeMultipleListeners('.delete-btn');

    // Remover y reinicializar formularios y elementos específicos
    const elements = [
        'editProductForm',
        'addDetail',
        'editProductDetails',
        'editCategoryForm',
        'editCategorySelect',
        'deleteCategoryForm',
        'addCategoryForm',
        'confirmDelete'
    ];

    elements.forEach(removeAndReinitialize);

    // Inicializar listeners para edición de productos
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const productId = this.closest('.product-card').dataset.id;

            // Obtener datos del producto desde el DOM
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.card-title').textContent;
            const productBrand = productCard.querySelector('.card-text.text-muted').textContent.replace('Marca: ', '');
            const productDescription = productCard.querySelector('.card-text.pt-3').textContent.trim();

            // Obtener el contenedor de la imagen y la imagen actual
            const imageElement = productCard.querySelector('.card-img-container img');
            let productImage = imageElement ? imageElement.src : "";

            // Corregir la URL eliminando la parte duplicada
            const baseURL = "http://localhost/indelsaRepo/public/uploads/";
            if (productImage.includes(baseURL)) {
                productImage = productImage.replace(baseURL, "");
            }

            // Llenar los inputs con la información obtenida
            document.getElementById('editProductId').value = productId;
            document.getElementById('editProductName').value = productName;
            document.getElementById('editProductBrand').value = productBrand;
            document.getElementById('editProductDescription').value = productDescription;
            document.getElementById('editProductImageActual').value = productImage; // Guardar la imagen actual en el input oculto

            // Opcional: Mostrar la imagen actual en una vista previa
            const preview = document.getElementById('editProductImagePreview');
            if (preview) {
                preview.src = productImage;
            }

            console.log("Imagen actual asignada:", productImage);

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

            // Mostrar el modal de edición
            new bootstrap.Modal(document.getElementById('editProductModal')).show();
        });
    });

    // Listener para agregar detalles
    const addDetail = document.getElementById('addDetail');
    if (addDetail) {
        addDetail.addEventListener('click', function () {
            const detailsContainer = document.getElementById('editProductDetails');
            const newDetail = document.createElement('div');
            newDetail.classList.add('input-group', 'mb-2');
            newDetail.innerHTML = `
        <input type="text" class="form-control key-detail" placeholder="Detalle">
        <input type="text" class="form-control value-detail" placeholder="Característica">
        <button type="button" class="btn btn-danger remove-detail">X</button>
    `;
            detailsContainer.appendChild(newDetail);
        });
    }

    // Listener para eliminar detalles
    const editProductDetails = document.getElementById('editProductDetails');
    if (editProductDetails) {
        editProductDetails.addEventListener('click', function (event) {
            if (event.target.classList.contains('remove-detail')) {
                event.target.parentElement.remove();
            }
        });
    }

    // Listener para el formulario de edición de productos
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const productId = document.getElementById('editProductId').value;
            const name = document.getElementById('editProductName').value;
            const brand = document.getElementById('editProductBrand').value;
            const description = document.getElementById('editProductDescription').value;

            // Obtener los detalles técnicos
            const details = {};
            document.querySelectorAll('.key-detail').forEach((keyInput, index) => {
                const key = keyInput.value.trim();
                const value = document.querySelectorAll('.value-detail')[index].value.trim();
                if (key && value) details[key] = value;
            });

            const formData = new FormData();
            formData.append("nombre", name);
            formData.append("marca", brand);
            formData.append("descripcion", description);
            formData.append("detalles", JSON.stringify(details));

            // Manejo mejorado de la imagen
            const fileInput = document.getElementById('editProductImage');
            const imagenActual = document.getElementById('editProductImageActual').value;

            if (fileInput.files.length > 0) {
                formData.append("imagen", fileInput.files[0]);
            }
            // Siempre enviamos la imagen actual
            formData.append("imagen_actual", imagenActual);
            const categoriaId = document.getElementById('editProductCategory').value;
            formData.append('categorias', JSON.stringify([categoriaId]));
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            try {
                const res = await fetch(`/indelsaRepo/public/api/productos/editar?id=${productId}`, {
                    method: 'PUT',
                    body: formData
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Error HTTP: ${res.status}`);
                }

                const result = await res.json();
                if (result.status === "success") {
                    alert("Producto actualizado correctamente");
                    location.reload();
                } else {
                    alert("Error al actualizar el producto: " + result.message);
                }
            } catch (error) {
                console.error("Error al actualizar producto:", error);
                alert("Error al actualizar el producto: " + error.message);
            }
        });
    }

    // Listeners para eliminación de productos
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.closest('.product-card').dataset.id;

            // Mostrar el modal de confirmación
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
            deleteModal.show();

            // Asignar el ID del producto al botón de confirmar eliminación
            document.getElementById('confirmDelete').dataset.productId = productId;
        });
    });

    // Listener para confirmar eliminación
    const confirmDelete = document.getElementById('confirmDelete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', async function () {
            const productId = this.dataset.productId;

            try {
                const res = await fetch(`/indelsaRepo/public/api/productos/eliminar?id=${productId}`, {
                    method: 'DELETE'
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Error HTTP: ${res.status}`);
                }

                const result = await res.json();
                if (result.status === "success") {
                    alert("Producto eliminado correctamente");
                    location.reload(); // Recargar la página para reflejar los cambios
                } else {
                    alert("Error al eliminar el producto: " + result.message);
                }
            } catch (error) {
                console.error("Error al eliminar producto:", error);
                alert("Error al eliminar el producto: " + error.message);
            } finally {
                // Cerrar el modal después de la operación
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
                deleteModal.hide();
            }
        });
    }

    // Listeners para categorías
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nombre = document.getElementById('categoryName').value;

            try {
                const response = await fetch('/indelsaRepo/public/api/categorias/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre }),
                });

                const result = await response.json();

                if (result.status === 'success') {
                    alert('Categoría agregada correctamente');
                    location.reload(); // Recargar la página para ver los cambios
                } else {
                    throw new Error(result.message || 'Error al agregar la categoría');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al agregar la categoría: ' + error.message);
            }
        });
    }

    const editCategoryForm = document.getElementById('editCategoryForm');
    if (editCategoryForm) {
        editCategoryForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            // Obtener los datos del formulario
            const id = document.getElementById('editCategoryId').value;
            const nombre = document.getElementById('editCategoryName').value;

            try {
                const response = await fetch(`/indelsaRepo/public/api/categorias/editar?id=${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre}),
                });

                const result = await response.json();

                if (result.status === 'success') {
                    alert('Categoría actualizada correctamente');
                    location.reload(); // Recargar la página para ver los cambios
                } else {
                    throw new Error(result.message || 'Error al actualizar la categoría');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar la categoría: ' + error.message);
            }
        });
    }

    const editCategorySelect = document.getElementById('editCategorySelect');
    if (editCategorySelect) {
        editCategorySelect.addEventListener('change', function () {
            const categoriaId = this.value;

            if (!categoriaId) {
                // Limpiar los campos si no se selecciona una categoría
                document.getElementById('editCategoryId').value = '';
                document.getElementById('editCategoryName').value = '';
                document.getElementById('editCategoryDescription').value = '';
                return;
            }

            // Buscar la categoría seleccionada en la variable global
            const categoriaSeleccionada = categorias.find(categoria => categoria.id == categoriaId);

            if (categoriaSeleccionada) {
                // Llenar los campos con los detalles de la categoría
                document.getElementById('editCategoryId').value = categoriaSeleccionada.id; // Guardar el ID en el campo oculto
                document.getElementById('editCategoryName').value = categoriaSeleccionada.nombre;
                document.getElementById('editCategoryDescription').value = categoriaSeleccionada.descripcion;
            } else {
                console.error('No se encontró la categoría seleccionada');
                alert('No se encontró la categoría seleccionada');
            }
        });
    }

    const deleteCategoryForm = document.getElementById('deleteCategoryForm');
    if (deleteCategoryForm) {
        deleteCategoryForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            // Obtener el ID de la categoría seleccionada
            const id = document.getElementById('deleteCategorySelect').value;

            try {
                const response = await fetch(`/indelsaRepo/public/api/categorias/eliminar?id=${id}`, {
                    method: 'DELETE',
                });

                const result = await response.json();

                if (result.status === 'success') {
                    alert('Categoría eliminada correctamente');
                    location.reload();
                } else {
                    throw new Error(result.message || 'Error al eliminar la categoría');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar la categoría: ' + error.message);
            }
        });
    }

    // Listener para edición de usuario
    const adminProfileForm = document.querySelector('#adminProfile form');
    if (adminProfileForm) {
        adminProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = {
                nombre: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                password: this.querySelector('input[type="password"]').value
            };

            fetch(`/indelsaRepo/public/api/usuarios/editar?id=1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Perfil actualizado correctamente');
                        location.reload();
                    } else {
                        alert('Error al actualizar el perfil: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    }
}
