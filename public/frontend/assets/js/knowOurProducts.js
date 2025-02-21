export async function showKnowOurProducts() {
    try {
        const response = await fetch('/indelsaRepo/public/api/productos/all');
        const data = await response.json();
        console.log(data);
        if (!data || !Array.isArray(data)) {
            console.error('Error al cargar productos');
            return;
        }

        

        const productos = data;
        const carouselInner = document.querySelector('#carouselknowOurProducts .know-our-products');
        if (!carouselInner) {
            console.error('Elemento carousel no encontrado');
            return;
        }

        carouselInner.innerHTML = '';
        
        for (let i = 0; i < productos.length; i += 6) {
            const slideHTML = `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                    <div class="container">
                        <div class="row justify-content-center g-4 px-5 mx-5">
                            ${productos.slice(i, i + 6).map(product => `
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
                                                <h6 class="card-title text-center text-blue fw-bold mb-0">
                                                    ${product.nombre}
                                                </h6>
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
        }
    } catch (error) {
        console.error('Error:', error);
    }
}