// ============================================
// SHOPEASE E-COMMERCE APP
// A modern, responsive e-commerce frontend
// Built with Vanilla JavaScript, HTML5, Tailwind CSS
// ============================================

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

/** Email validation regex pattern */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Toast auto-remove delay (milliseconds) */
const TOAST_DELAY = 3000;

/** localStorage key for cart data */
const CART_STORAGE_KEY = 'cart';

/** localStorage key for favorites data */
const FAVORITES_STORAGE_KEY = 'favorites';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Retrieves cart data from localStorage
 * @returns {Array} Array of cart items
 */
function getCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

/**
 * Saves cart data to localStorage
 * @param {Array} cart - Cart items array
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Retrieves favorites data from localStorage
 * @returns {Array} Array of favorite product IDs
 */
function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
}

/**
 * Saves favorites data to localStorage
 * @param {Array} favorites - Array of favorite product IDs
 */
function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Checks if a product is in favorites
 * @param {number} productId - Product ID
 * @returns {boolean} True if in favorites
 */
function isFavorite(productId) {
    return getFavorites().includes(productId);
}

/**
 * Formats price to currency string
 * @param {number} price - Price value
 * @returns {string} Formatted price (e.g., "29.99")
 */
function formatPrice(price) {
    return price.toFixed(2);
}

/**
 * Gets cart item count (sum of all quantities)
 * @returns {number} Total number of items in cart
 */
function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Gets count of favorite products
 * @returns {number} Number of favorites
 */
function getFavoritesCount() {
    return getFavorites().length;
}

/**
 * Calculates cart total price
 * @returns {number} Sum of all items (quantity × price)
 */
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================

/**
 * Displays a toast notification popup
 * @param {string} message - Notification message
 * @param {string} type - 'success', 'error', or 'info' (default: 'success')
 */
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Determine styling based on type
    const config = {
        success: { color: 'bg-green-500', icon: '✓' },
        error: { color: 'bg-red-500', icon: '✕' },
        info: { color: 'bg-emerald-500', icon: 'ℹ' }
    };
    
    const { color, icon } = config[type] || config.success;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div class="${color} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeInSlide pointer-events-auto">
            <span class="text-xl font-bold">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove toast after delay
    setTimeout(() => {
        toast.style.animation = 'fadeOutSlide 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, TOAST_DELAY);
}

// ============================================
// PRODUCTS DATA
// ============================================

/**
 * Product catalog
 * To add more products, add an object with: id, name, price, image, description
 */
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
        description: 'Feature-rich smartwatch with fitness tracking and notifications'
    },
    {
        id: 3,
        name: 'USB-C Cable',
        price: 12.99,
        image: 'images/usb-cable.jpg',
        description: 'Durable fast-charging USB-C cable, 2-meter length'
    },
    {
        id: 4,
        name: 'Phone Stand',
        price: 24.99,
        image: 'images/phone-stand.jpg',
        description: 'Adjustable phone stand perfect for desk or bedside'
    },
    {
        id: 5,
        name: 'Portable Charger',
        price: 34.99,
        image: 'images/portable-charger.jpg',
        description: '20000mAh portable power bank with fast charging'
    },
    {
        id: 6,
        name: 'Bluetooth Speaker',
        price: 59.99,
        image: 'images/bluetooth-speaker.jpg',
        description: 'Waterproof portable speaker with 360-degree sound'
    }
];

// ============================================
// NAVBAR RENDERING
// ============================================

/**
 * Renders the navigation bar on all pages
 * Displays: Logo, Home link, Favorites link, Cart link (with item count badge)
 */
function renderNavbar() {
    const navElement = document.getElementById('navbar');
    if (!navElement) return; // Element doesn't exist on this page
    
    const cartCount = getCartCount();
    const favCount = getFavoritesCount();
    
    navElement.innerHTML = `
        <nav class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-6 md:px-12">
                <div class="flex justify-between items-center h-20">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <a href="index.html" class="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 flex items-center gap-2">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/></svg>
                            ShopEase
                        </a>
                    </div>
                    
                    <!-- Navigation Links -->
                    <div class="flex items-center space-x-10">
                        <a href="index.html" class="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm">Home</a>
                        <a href="favorites.html" class="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm relative flex items-center gap-2 group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart group-hover:fill-emerald-600 transition-all duration-200">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            Favorites
                            ${favCount > 0 ? `<span class="absolute -top-3 -right-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">${favCount}</span>` : ''}
                        </a>
                        <a href="cart.html" class="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 text-sm relative flex items-center gap-2 group">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart group-hover:text-emerald-600 transition-all duration-200">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Cart
                            ${cartCount > 0 ? `<span class="absolute -top-3 -right-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">${cartCount}</span>` : ''}
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    // Reinitialize Lucide icons for the navbar
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// PRODUCT FILTERING & SEARCH
// ============================================

/**
 * Filters products based on search term, price range, and favorites
 * @param {string} searchTerm - Search term for product name/description
 * @param {number} minPrice - Minimum price filter
 * @param {number} maxPrice - Maximum price filter
 * @param {boolean} favoritesOnly - Show only favorites
 * @returns {Array} Filtered products array
 */
function filterProducts(searchTerm = '', minPrice = 0, maxPrice = 10000, favoritesOnly = false) {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.description.toLowerCase().includes(term)
        );
    }
    
    // Filter by price range
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // Filter by favorites
    if (favoritesOnly) {
        const favorites = getFavorites();
        filtered = filtered.filter(p => favorites.includes(p.id));
    }
    
    return filtered;
}

/**
 * Toggles a product as favorite
 * @param {number} productId - Product ID to toggle
 */
function toggleFavorite(productId) {
    let favorites = getFavorites();
    
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        showToast('Removed from favorites', 'info');
    } else {
        favorites.push(productId);
        showToast('Added to favorites ♡', 'success');
    }
    
    saveFavorites(favorites);
    updateCartUI(); // Updates navbar (includes favorites count)
    
    // Re-render current page if showing products
    if (document.getElementById('products-grid')) {
        renderProducts();
    }
}

// ============================================
// PRODUCT GRID RENDERING (HOMEPAGE)
// ============================================

/**
 * Renders all products in a grid on the homepage
 * Each product card has image, details, action buttons, and favorite heart
 */
function renderProducts() {
    const productsContainer = document.getElementById('products-grid');
    if (!productsContainer) return; // Skip if not on homepage
    
    // Get filter values
    const searchInput = document.getElementById('search-input');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    const searchTerm = searchInput?.value || '';
    const minPrice = minPriceInput?.value ? parseFloat(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput?.value ? parseFloat(maxPriceInput.value) : 10000;
    
    const filtered = filterProducts(searchTerm, minPrice, maxPrice);
    const favorites = getFavorites();
    
    if (filtered.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-xl text-gray-500">No products found. Try adjusting your filters.</p>
            </div>
        `;
        return;
    }
    
    productsContainer.innerHTML = filtered.map(product => `
        <div class="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <!-- Product Header with Favorite Button -->
            <div class="relative">
                <!-- Stock Badge -->
                <div class="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-green-200">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    <span class="text-xs font-semibold text-green-700">In Stock</span>
                </div>
                
                <!-- Favorite Button -->
                <button onclick="toggleFavorite(${product.id})" class="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 hover:scale-110" title="Add to favorites">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${favorites.includes(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart transition-all duration-200 ${favorites.includes(product.id) ? 'text-emerald-600' : 'text-gray-400'}">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                
                <!-- Product Image -->
                <div class="relative h-56 overflow-hidden bg-gray-200">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out">
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="p-6">
                <!-- Category Tag -->
                <div class="mb-2">
                    <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Premium</span>
                </div>
                
                <!-- Title -->
                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">${product.name}</h3>
                
                <!-- Description -->
                <p class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">${product.description}</p>
                
                <!-- Rating -->
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex gap-0.5">
                        ${[...Array(5)].map((_, i) => `<svg class="w-4 h-4 ${i < 4 ? 'text-amber-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`).join('')}
                    </div>
                    <span class="text-xs text-gray-500 font-medium">(24 reviews)</span>
                </div>
                
                <!-- Price -->
                <div class="mb-6">
                    <span class="text-2xl font-bold text-emerald-600">$${formatPrice(product.price)}</span>
                    <span class="text-sm text-gray-500 ml-2 line-through">$${(parseFloat(product.price) * 1.2).toFixed(2)}</span>
                </div>
                
                <!-- Actions -->
                <div class="flex gap-3">
                    <button onclick="addToCart(${product.id})" class="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer">
                        Add to Cart
                    </button>
                    <a href="product.html?id=${product.id}" class="flex-1 border-2 border-gray-200 hover:border-emerald-600 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-xl text-center transition-all duration-200 cursor-pointer">
                        View
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Reinitialize Lucide icons after rendering
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// CART MANAGEMENT
// ============================================

/**
 * Adds a product to the cart
 * If product already exists, increases quantity by 1
 * @param {number} productId - The ID of the product to add
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

/**
 * Removes a product from the cart
 * @param {number} productId - The ID of the product to remove
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCartItems();
    updateCartSummary();
    updateCartUI();
}

/**
 * Updates the quantity of an item in the cart
 * Removes item if quantity goes to zero
 * @param {number} productId - The ID of the product
 * @param {number} change - Amount to change quantity by (+1 or -1)
 */
function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            renderCartItems();
            updateCartSummary();
            updateCartUI();
        }
    }
}

/**
 * Updates the navbar and cart UI
 * Called whenever cart changes
 */
function updateCartUI() {
    renderNavbar();
}

// ============================================
// CART PAGE RENDERING
// ============================================

/**
 * Renders all cart items on the cart page
 * Displays item details, quantity controls, and totals
 */
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return; // Not on cart page
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-12">
                <p class="text-lg text-gray-500 mb-4 font-light">Your cart is empty</p>
                <a href="index.html" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded transition transform hover:scale-105">
                    Continue Shopping
                </a>
            </div>
        `;
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="flex gap-4 border-b pb-4 mb-4">
            <!-- Product Image -->
            <div class="w-20 h-20 flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded">
            </div>
            
            <!-- Product Details -->
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">${item.name}</h3>
                <p class="text-sm text-gray-500">$${formatPrice(item.price)}</p>
            </div>
            
            <!-- Quantity Controls -->
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity(${item.id}, -1)" class="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded text-center leading-8 transition font-semibold text-gray-700">
                    −
                </button>
                <span class="w-8 text-center font-semibold text-gray-900">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded text-center leading-8 transition font-semibold text-gray-700">
                    +
                </button>
            </div>
            
            <!-- Item Total -->
            <div class="w-24 text-right">
                <p class="font-bold text-gray-900">$${formatPrice(item.price * item.quantity)}</p>
                <button onclick="removeFromCart(${item.id})" class="text-red-600 hover:text-red-800 text-xs font-semibold transition">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Updates and displays the cart total
 * Calculates sum of (price × quantity) for all items
 */
function updateCartSummary() {
    const total = getCartTotal();
    const totalElements = document.querySelectorAll('#cart-total');
    
    totalElements.forEach(element => {
        element.textContent = formatPrice(total);
    });
}

// ============================================
// PRODUCT DETAIL PAGE
// ============================================

/**
 * Extracts product ID from URL query parameters
 * Example: product.html?id=1 → returns 1
 * @returns {number} Product ID from URL, or NaN if not found
 */
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

/**
 * Renders detailed product information on product detail page
 * Shows large image, name, price, description, and action buttons
 */
function renderProductDetail() {
    const productContainer = document.getElementById('product-detail');
    if (!productContainer) return; // Not on product detail page
    
    const productId = getProductIdFromURL();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        productContainer.innerHTML = `
            <div class="text-center py-12">
                <p class="text-xl text-gray-500 mb-4">Product not found</p>
                <a href="index.html" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded transition">
                    Back to Home
                </a>
            </div>
        `;
        return;
    }
    
    productContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Product Image -->
            <div class="flex items-center justify-center bg-gray-100 rounded-lg p-8">
                <img src="${product.image}" alt="${product.name}" class="w-full h-auto object-cover rounded-lg">
            </div>
            
            <!-- Product Details -->
            <div class="flex flex-col justify-center">
                <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">${product.name}</h1>
                
                <p class="text-4xl font-bold text-emerald-600 mb-6">$${formatPrice(product.price)}</p>
                
                <p class="text-lg text-gray-600 mb-8 leading-relaxed font-light">${product.description}</p>
                
                <!-- Add to Cart Button -->
                <button onclick="addToCart(${product.id})" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg text-lg transition transform hover:scale-105 mb-4 shadow-md hover:shadow-lg">
                    Add to Cart
                </button>
                
                <!-- Continue Shopping Link -->
                <a href="index.html" class="w-full border border-gray-300 hover:border-emerald-600 text-gray-700 hover:text-emerald-600 font-semibold py-3 px-6 rounded-lg text-center transition">
                    Continue Shopping
                </a>
            </div>
        </div>
    `;
}

// ============================================
// CHECKOUT PAGE
// ============================================

/**
 * Processes checkout form submission
 * Validates form inputs, displays order confirmation, clears cart
 * @param {Event} event - Form submission event
 */
function handleCheckout(event) {
    event.preventDefault();
    
    // Get and trim form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    
    // Validate all fields present
    if (!name || !email || !address) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Calculate order total
    const total = getCartTotal();
    
    // Display order confirmation
    const checkoutContainer = document.getElementById('checkout-form-container');
    checkoutContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center animate-fadeInScale">
            <div class="text-6xl mb-4 animate-bounce">✓</div>
            <h2 class="text-3xl font-bold text-green-600 mb-4">Order Placed!</h2>
            <p class="text-gray-600 mb-6">Thank you for your purchase, ${name}!</p>
            
            <div class="bg-gray-50 rounded p-4 mb-6 text-left">
                <p class="text-gray-700 mb-2"><strong>Order Total:</strong> $${formatPrice(total)}</p>
                <p class="text-gray-700 mb-2"><strong>Email:</strong> ${email}</p>
                <p class="text-gray-700"><strong>Delivery Address:</strong> ${address}</p>
            </div>
            
            <p class="text-gray-600 mb-6">A confirmation email has been sent to ${email}.</p>
            
            <a href="index.html" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded transition transform hover:scale-105">
                Continue Shopping
            </a>
        </div>
    `;
    
    // Clear cart after successful order
    saveCart([]);
    updateCartUI();
    
    // Show success notification
    showToast('Order placed successfully!', 'success');
    
    // Scroll to confirmation message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Renders the favorites page with all favorite products
 */
function renderFavoritesPage() {
    const favContainer = document.getElementById('favorites-grid');
    if (!favContainer) return;
    
    const favorites = getFavorites();
    const favoriteProducts = products.filter(p => favorites.includes(p.id));
    
    if (favoriteProducts.length === 0) {
        favContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-xl text-gray-500 mb-4">No favorite products yet</p>
                <a href="index.html" class="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105">
                    Continue Shopping
                </a>
            </div>
        `;
        return;
    }
    
    favContainer.innerHTML = favoriteProducts.map(product => `
        <div class="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <!-- Product Header with Favorite Button -->
            <div class="relative">
                <!-- Stock Badge -->
                <div class="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-green-200">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    <span class="text-xs font-semibold text-green-700">In Stock</span>
                </div>
                
                <!-- Favorite Button -->
                <button onclick="toggleFavorite(${product.id})" class="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 hover:scale-110" title="Remove from favorites">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-emerald-600">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                
                <!-- Product Image -->
                <div class="relative h-56 overflow-hidden bg-gray-200">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out">
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="p-6">
                <!-- Category Tag -->
                <div class="mb-2">
                    <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Premium</span>
                </div>
                
                <!-- Title -->
                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">${product.name}</h3>
                
                <!-- Description -->
                <p class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">${product.description}</p>
                
                <!-- Rating -->
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex gap-0.5">
                        ${[...Array(5)].map((_, i) => `<svg class="w-4 h-4 ${i < 4 ? 'text-amber-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`).join('')}
                    </div>
                    <span class="text-xs text-gray-500 font-medium">(24 reviews)</span>
                </div>
                
                <!-- Price -->
                <div class="mb-6">
                    <span class="text-2xl font-bold text-emerald-600">$${formatPrice(product.price)}</span>
                    <span class="text-sm text-gray-500 ml-2 line-through">$${(parseFloat(product.price) * 1.2).toFixed(2)}</span>
                </div>
                
                <!-- Actions -->
                <div class="flex gap-3">
                    <button onclick="addToCart(${product.id})" class="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer">
                        Add to Cart
                    </button>
                    <a href="product.html?id=${product.id}" class="flex-1 border-2 border-gray-200 hover:border-emerald-600 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-4 rounded-xl text-center transition-all duration-200 cursor-pointer">
                        View
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Reinitialize Lucide icons after rendering
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Initializes the app when DOM is fully loaded
 * Renders appropriate page content based on current page
 * Sets up event listeners for search and filters
 */
document.addEventListener('DOMContentLoaded', () => {
    // Render navbar on all pages
    renderNavbar();
    
    // Homepage: Render product grid with search/filter
    if (document.getElementById('products-grid')) {
        renderProducts();
        
        // Setup search and filter event listeners
        const searchInput = document.getElementById('search-input');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => renderProducts());
        }
        if (minPriceInput) {
            minPriceInput.addEventListener('change', () => renderProducts());
        }
        if (maxPriceInput) {
            maxPriceInput.addEventListener('change', () => renderProducts());
        }
    }
    
    // Cart page: Render cart items and summary
    if (document.getElementById('cart-items')) {
        renderCartItems();
        updateCartSummary();
    }
    
    // Product detail page: Render single product
    if (document.getElementById('product-detail')) {
        renderProductDetail();
    }
    
    // Favorites page: Render favorite products
    if (document.getElementById('favorites-grid')) {
        renderFavoritesPage();
    }
    
    // Checkout page: Attach form submit handler
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
});
