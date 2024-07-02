const apiUrl = 'http://localhost:3000/products';
let currentPage = 1;
const limit = 6;
let isLoading = false;
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search');
    const productCount = document.getElementById('product-count');

    async function fetchProducts(page = 1, limit = 6, searchQuery = '') {
        isLoading = true;
        try {
            const response = await fetch(`${apiUrl}?_page=${page}&_limit=${limit}&q=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            allProducts = searchQuery ? data : [...allProducts, ...data];
            renderProducts(allProducts);
            productCount.textContent = `Total products: ${allProducts.length}`;
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            isLoading = false;
        }
    }

    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="category">${product.category}</p>
            `;
            productList.appendChild(productCard);
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedSearch = debounce(async function(event) {
        const query = event.target.value.trim();
        currentPage = 1;
        allProducts = [];
        await fetchProducts(currentPage, limit, query);
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);

    window.addEventListener('scroll', async () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isLoading) {
            currentPage++;
            await fetchProducts(currentPage, limit);
        }
    });

    fetchProducts(currentPage, limit);
});
