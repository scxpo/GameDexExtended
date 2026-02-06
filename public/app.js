const fallbackProducts = [
  {
    name: 'Giacca Termica Summit Pro',
    category: 'Abbigliamento',
    price: 249.9,
    highlight: 'Traspirante, antivento, pronta per le cime invernali.'
  },
  {
    name: 'Zaino Alpine Trek 45L',
    category: 'Zaini',
    price: 159.0,
    highlight: 'Schienale ergonomico e accesso rapido ai comparti.'
  },
  {
    name: 'Scarponi Roccia GTX',
    category: 'Calzature',
    price: 199.5,
    highlight: 'Grip affidabile su terreni misti e impermeabilità totale.'
  },
  {
    name: 'Bastoncini Carbon Trail',
    category: 'Accessori',
    price: 89.9,
    highlight: 'Leggeri e resistenti con impugnatura in sughero.'
  }
];

function renderProducts(products, summary) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="category">${product.category}</span>
      <h4>${product.name}</h4>
      <p>${product.highlight}</p>
      <p class="price-tag">€ ${Number(product.price).toFixed(2)}</p>
    `;
    grid.appendChild(card);
  });

  const totalProducts = document.getElementById('total-products');
  const categoryCount = document.getElementById('category-count');
  totalProducts.textContent = summary.totalProducts;
  categoryCount.textContent = summary.categories.length;
}

async function loadProducts() {
  try {
    const [productsResponse, summaryResponse] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/summary')
    ]);

    const products = await productsResponse.json();
    const summary = await summaryResponse.json();

    renderProducts(products, summary);
  } catch (error) {
    console.warn('Uso dati locali: server non disponibile.', error);
    renderProducts(fallbackProducts, {
      totalProducts: fallbackProducts.length,
      categories: [...new Set(fallbackProducts.map((item) => item.category))]
    });
  }
}

loadProducts();
