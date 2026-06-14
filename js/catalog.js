function formatPrice(value) {
  return `${value.toLocaleString("en-LK")} LKR`;
}

function normalizeCategory(product) {
  const raw = (product.category || "").trim();
  return raw || "Other";
}

function renderProducts(container, products) {
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    const stockLabel = product.in_stock ? "In Stock" : "Out of Stock";
    const stockClass = product.in_stock ? "in" : "out";

    card.innerHTML = `
      <img class="zoomable" data-lightbox="true" data-fullsrc="${getFullImageUrl(product.images[0])}" src="${getThumbnailUrl(product.images[0])}" alt="${product.name}" loading="lazy" decoding="async">
      <h3>${product.name}</h3>
      <div class="price">${formatPrice(product.price)}</div>
      <span class="stock-badge ${stockClass}">${stockLabel}</span>
      <div class="card-actions">
        <a class="btn" href="product.html?id=${product.id}">View Product</a>
        <button class="btn secondary" data-add-to-cart="${product.id}" ${
          product.in_stock ? "" : "disabled"
        }><span class="cart-icon">🛒</span> Add to Cart</button>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll("[data-add-to-cart]").forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-add-to-cart");
      const product = window.PRODUCTS.find(item => String(item.id) === String(productId));
      if (!product || !product.in_stock) return;

      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        color: product.colors?.[0] || "Default",
        quantity: 1
      });

      button.textContent = "Added";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.disabled = false;
      }, 1200);
    });
  });
}

function buildCategoryTabs(container, categories, onSelect) {
  container.innerHTML = "";
  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab";
    button.textContent = category;
    button.dataset.category = category;
    button.addEventListener("click", () => onSelect(category));
    container.appendChild(button);
  });
}

function setActiveTab(container, category) {
  container.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
}

async function renderCatalog() {
  const container = document.getElementById("productContainer");
  const searchInput = document.getElementById("searchInput");
  const tabsContainer = document.getElementById("categoryTabs");
  if (!container) return;

  if (window.PRODUCTS_READY) {
    await window.PRODUCTS_READY;
  }

  const categories = [
    "All",
    ...Array.from(new Set(window.PRODUCTS.map(normalizeCategory))).sort()
  ];

  let activeCategory = "All";
  let searchTerm = "";

  const applyFilters = () => {
    const term = searchTerm.toLowerCase();
    const filtered = window.PRODUCTS.filter(product => {
      const category = normalizeCategory(product);
      const matchesCategory = activeCategory === "All" || category === activeCategory;
      const haystack = `${product.name} ${product.category || ""} ${product.description || ""}`.toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      return matchesCategory && matchesSearch;
    });

    renderProducts(container, filtered);
    if (tabsContainer) {
      setActiveTab(tabsContainer, activeCategory);
    }
  };

  if (tabsContainer) {
    buildCategoryTabs(tabsContainer, categories, category => {
      activeCategory = category;
      applyFilters();
    });
    setActiveTab(tabsContainer, activeCategory);
  }

  if (searchInput) {
    searchInput.addEventListener("input", event => {
      searchTerm = event.target.value.trim();
      applyFilters();
    });
  }

  applyFilters();
}

document.addEventListener("DOMContentLoaded", renderCatalog);

