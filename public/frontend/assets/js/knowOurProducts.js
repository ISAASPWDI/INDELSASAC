export async function showKnowOurProducts(productos) {
        // Si no hay productos, cargarlos primero
        const randomPage = Math.random() < 0.5 ? 1 : 2;
        try {
            const response = await fetch(`/indelsaRepo/public/api/productos/paginar?page=${randomPage}`);
            const data = await response.json();
            if (data.status === 'success') {
                productos = data.productos;
            } else {
                console.error('Error al cargar productos');
                return;
            }
        } catch (error) {
            console.error('Error:', error);
            return;
        }
    

    const carouselInner = document.querySelector('#carouselknowOurProducts .know-our-products');
    if (!carouselInner) {
        console.error('Elemento carousel no encontrado');
        return;
    }

    carouselInner.innerHTML = '';

    
    if (productos.length > 24) {
        productos = productos.sort(() => 0.5 - Math.random()).slice(0, 24);
    }else{
        productos = productos.sort(() => 0.5 - Math.random());
    }
    const productGroups = [];
    for (let i = 0; i < productos.length; i += 6) {
        productGroups.push(productos.slice(i, i + 6));
    }
    productGroups.forEach((group, index) => {
        const slideHTML = `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="container">
                    <div class="row justify-content-center g-4 px-5 mx-5">
                        ${group.map(product => `
                            <div class="col-12 col-sm-6 col-md-4 col-lg-2">
                                <div class="card product-card border border-white h-100" data-id="${product.id}">
                                    <a class="cotizar-link" href="./pages/productos.html">
                                    <div class="card-img-container">

                                        <img src="../uploads/${product.imagen}" 
                                             class="card-img-top img-fluid p-2" 
                                             alt="${product.nombre}"
                                             style="max-height: 150px; object-fit: contain;">

                                    </div>
                                    <div class="card-body p-2">
                                        <div class="d-flex justify-content-center align-items-center h-100">
                                            <div class="product-info">
                                                <div>
                                                    <h6 class="card-title text-center text-blue fw-bold mb-0">
                                                        ${product.nombre}
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                                                        </a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        carouselInner.insertAdjacentHTML('beforeend', slideHTML);
    });
}