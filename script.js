/* Fast Food Adda demo app script */
const STORAGE_KEYS = {
  cart: 'ffadda_cart',
  menu: 'ffadda_menu',
  orders: 'ffadda_orders',
};


const defaultMenuItems = [
  {
    id: 'burger-01',
    name: 'Veg Burger',
    category: 'Burgers',
    price: 80,
    image:
      './images/veg_burger.png',
    description: 'Soft bun, crisp lettuce, cheese, and our signature veggie patty.',
    available: true,
  },
  {
    id: 'burger-02',
    name: 'Chicken Burger',
    category: 'Burgers',
    price: 100,
    image:
      './images/chicken_burger.png',
    description: 'Grilled chicken, melted cheese, and fresh crunchy toppings.',
    available: true,
  },
  {
    id: 'pizza-01',
    name: 'Paneer Pizza',
    category: 'Pizza',
    price: 150,
    image:
      './images/paneer_pizza.png',
    description: 'Loaded with paneer, peppers, and tomato sauce on a thin crust.',
    available: true,
  },
  {
    id: 'fries-01',
    name: 'French Fries',
    category: 'Fries',
    price: 60,
    image:
      './images/french_fries.png',
    description: 'Golden crispy fries served hot with our secret seasoning.',
    available: true,
  },
  {
    id: 'drink-01',
    name: 'Cold Drink',
    category: 'Drinks',
    price: 40,
    image:
      './images/cold_drink.png',
    description: 'Refreshing soda to complete your meal.',
    available: true,
  },
  {
    id: 'combo-01',
    name: 'Burger Combo',
    category: 'Combos',
    price: 220,
    image:
      'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    description: 'Burger, fries and drink combo with a tasty discount.',
    available: true,
  },
];

const defaultOrders = [
  {
    id: 'order-1021',
    items: [
      { id: 'burger-01', name: 'Veg Burger', price: 80, quantity: 1 },
      { id: 'fries-01', name: 'French Fries', price: 60, quantity: 1 },
    ],
    total: 140,
    status: 'Preparing',
    payment: 'Pending',
    createdAt: 'Today 12:24 PM',
  },
  {
    id: 'order-1020',
    items: [
      { id: 'pizza-01', name: 'Paneer Pizza', price: 150, quantity: 1 },
    ],
    total: 150,
    status: 'Completed',
    payment: 'Paid',
    createdAt: 'Today 11:10 AM',
  },
];

const categories = ['All', 'Burgers', 'Pizza', 'Fries', 'Drinks', 'Combos'];
let cart = [];
let menuItems = [];
let orders = [];
let activeCategory = 'All';
let searchTerm = '';

const elements = {
  menuGrid: document.getElementById('menuGrid'),
  categoryFilters: document.getElementById('categoryFilters'),
  searchInput: document.getElementById('searchInput'),
  cartCount: document.getElementById('cartCount'),
  cartCountMobile: document.getElementById('cartCountMobile'),
  cartButton: document.getElementById('cartButton'),
  cartButtonMobile: document.getElementById('cartButtonMobile'),
  cartSidebar: document.getElementById('cartSidebar'),
  cartClose: document.getElementById('cartClose'),
  cartItems: document.getElementById('cartItems'),
  cartItemsCount: document.getElementById('cartItemsCount'),
  cartTotal: document.getElementById('cartTotal'),
  checkoutButton: document.getElementById('checkoutButton'),
  clearCartButton: document.getElementById('clearCartButton'),
  mobileMenu: document.getElementById('mobileMenu'),
  mobileToggle: document.getElementById('mobileToggle'),
  mobileClose: document.getElementById('mobileClose'),
  toastContainer: document.getElementById('toast'),
};

function initializeStorage() {
  const savedMenu = localStorage.getItem(STORAGE_KEYS.menu);
  const savedOrders = localStorage.getItem(STORAGE_KEYS.orders);
  if (!savedMenu) {
    localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(defaultMenuItems));
  }
  if (!savedOrders) {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(defaultOrders));
  }
}

function loadData() {
  menuItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.menu)) || [...defaultMenuItems];
  cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || [];
  orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders)) || [...defaultOrders];
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function filterMenu() {
  return menuItems.filter((item) => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
}

function renderCategoryButtons() {
  elements.categoryFilters.innerHTML = categories
    .map(
      (category) =>
        `<button type="button" class="${category === activeCategory ? 'active' : ''}" data-category="${category}">${category}</button>`
    )
    .join('');

  elements.categoryFilters.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      renderCategoryButtons();
      renderMenu();
    });
  });
}

function renderMenu() {
  const items = filterMenu();
  if (!items.length) {
    elements.menuGrid.innerHTML = '<p class="empty-state">No menu items found. Try another search.</p>';
    return;
  }

  elements.menuGrid.innerHTML = items
    .map(
      (item) => `
        <article class="menu-card">
          <div class="food-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="food-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price-row">
              <strong>₹${item.price}</strong>
              <span>${item.category}</span>
            </div>
            <button type="button" class="btn btn-primary btn-add" data-id="${item.id}" ${item.available ? '' : 'disabled'}>${item.available ? 'Add to Cart' : 'Unavailable'}</button>
          </div>
        </article>
      `
    )
    .join('');

  elements.menuGrid.querySelectorAll('.btn-add').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.id));
  });
}

// function updateCartUI() {
//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   elements.cartCount.textContent = totalItems;
//   elements.cartCountMobile.textContent = totalItems;
//   elements.cartItemsCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
//   renderCartItems();
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  elements.cartCount.textContent = totalItems;
  elements.cartCountMobile.textContent = totalItems;
  elements.cartItemsCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

  if (totalItems > 0) {
    elements.cartCount.style.display = 'flex';
  } else {
    elements.cartCount.style.display = 'none';
  }

  renderCartItems();
}


function renderCartItems() {
  if (!cart.length) {
    elements.cartItems.innerHTML = '<p class="empty-state">Your cart is empty. Add a tasty item to begin.</p>';
    elements.cartTotal.textContent = '₹0';
    return;
  }

  elements.cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p>₹${item.price} x ${item.quantity}</p>
            <div class="cart-item-actions">
              <div class="quantity-control">
                <button type="button" data-action="decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="increase" data-id="${item.id}">+</button>
              </div>
              <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      `
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  elements.cartTotal.textContent = `₹${total}`;

  elements.cartItems.querySelectorAll('button').forEach((button) => {
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (!action || !id) return;
    button.addEventListener('click', () => updateCartItem(action, id));
  });
}

function addToCart(itemId) {
  const item = menuItems.find((entry) => entry.id === itemId);
  if (!item) return;
  const existing = cart.find((entry) => entry.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  openCartSidebar();
  showToast(`${item.name} added to cart.`);
}

function updateCartItem(action, itemId) {
  const item = cart.find((entry) => entry.id === itemId);
  if (!item) return;
  if (action === 'increase') {
    item.quantity += 1;
  }
  if (action === 'decrease') {
    item.quantity -= 1;
  }
  if (action === 'remove' || item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== itemId);
  }
  saveCart();
  updateCartUI();
}

function openCartSidebar() {
  elements.cartSidebar.classList.add('open');
}

function closeCartSidebar() {
  elements.cartSidebar.classList.remove('open');
}

function checkoutCart() {
  if (!cart.length) {
    showToast('Your cart is empty.', 'warning');
    return;
  }
  const orderId = `order-${Date.now()}`;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newOrder = {
    id: orderId,
    items: cart.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
    total,
    status: 'Confirmed',
    payment: 'Pending',
    createdAt: new Date().toLocaleString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  cart = [];
  saveCart();
  updateCartUI();
  closeCartSidebar();
  showToast('Order placed successfully. Check the admin dashboard for demo status.');
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  showToast('Cart cleared.');
}

function showToast(message, type = 'success') {
  const element = document.createElement('div');
  element.className = 'toast';
  element.textContent = message;
  elements.toastContainer.appendChild(element);
  setTimeout(() => element.remove(), 2800);
}

function setupEvents() {
  elements.searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value;
    renderMenu();
  });

  elements.cartButton.addEventListener('click', openCartSidebar);
  elements.cartButtonMobile.addEventListener('click', openCartSidebar);
  elements.cartClose.addEventListener('click', closeCartSidebar);
  elements.checkoutButton.addEventListener('click', checkoutCart);
  elements.clearCartButton.addEventListener('click', clearCart);

  elements.mobileToggle.addEventListener('click', () => elements.mobileMenu.classList.add('open'));
  elements.mobileClose.addEventListener('click', () => elements.mobileMenu.classList.remove('open'));

  document.querySelectorAll('.mobile-links a').forEach((link) => {
    link.addEventListener('click', () => elements.mobileMenu.classList.remove('open'));
  });

  document.addEventListener('click', (event) => {
    if (event.target === elements.mobileMenu) {
      elements.mobileMenu.classList.remove('open');
    }
  });
}

function initApp() {
  initializeStorage();
  loadData();
  renderCategoryButtons();
  renderMenu();
  updateCartUI();
  setupEvents();
  setupHeroCarousel();
}

const heroImages = [
  './images/hero_food_banner.png',
  './images/home_food_banner-1.png',
  './images/home_food_banner-2.png',
];

let heroSlideIndex = 0;

function updateHeroCarousel(index) {
  const heroImage = document.getElementById('heroCarouselImage');
  const dots = document.querySelectorAll('.hero-slider-dots button');

  if (!heroImage || !dots.length) return;

  heroImage.classList.add('fade');

  setTimeout(() => {
    heroSlideIndex = index;
    heroImage.src = heroImages[heroSlideIndex];

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === heroSlideIndex);
    });

    heroImage.classList.remove('fade');
  }, 250);
}

function setupHeroCarousel() {
  const dots = document.querySelectorAll('.hero-slider-dots button');

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      updateHeroCarousel(Number(dot.dataset.slide));
    });
  });

  setInterval(() => {
    const nextIndex = (heroSlideIndex + 1) % heroImages.length;
    updateHeroCarousel(nextIndex);
  }, 3000);
}


initApp();
