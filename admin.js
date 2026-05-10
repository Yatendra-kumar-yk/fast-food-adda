/* Fast Food Adda admin demo script */
const adminStorageKeys = {
  menu: 'ffadda_menu',
  orders: 'ffadda_orders',
};

const adminAuthKey = 'ffadda_admin_user';

const adminElements = {
  loginPanel: document.getElementById('loginPanel'),
  dashboardPanel: document.getElementById('dashboardPanel'),
  adminLoginForm: document.getElementById('adminLoginForm'),
  adminSignupForm: document.getElementById('adminSignupForm'),
  adminForgotForm: document.getElementById('adminForgotForm'),
  logoutButton: document.getElementById('logoutButton'),
  headerLoginLink: document.getElementById('headerLoginLink'),
  headerLogoutBtn: document.getElementById('headerLogoutBtn'),
  mobileLoginLink: document.getElementById('mobileLoginLink'),
  mobileLogoutBtn: document.getElementById('mobileLogoutBtn'),
  newItemButton: document.getElementById('newItemButton'),
  modalOverlay: document.getElementById('modalOverlay'),
  modalClose: document.getElementById('modalClose'),
  menuForm: document.getElementById('menuForm'),
  menuTableBody: document.getElementById('menuTableBody'),
  ordersTableBody: document.getElementById('ordersTableBody'),
  totalOrders: document.getElementById('totalOrders'),
  totalRevenue: document.getElementById('totalRevenue'),
  pendingOrders: document.getElementById('pendingOrders'),
  completedOrders: document.getElementById('completedOrders'),
  modalTitle: document.getElementById('modalTitle'),
  itemName: document.getElementById('itemName'),
  itemCategory: document.getElementById('itemCategory'),
  itemPrice: document.getElementById('itemPrice'),
  itemImage: document.getElementById('itemImage'),
  itemStatus: document.getElementById('itemStatus'),
  adminName: document.getElementById('adminName'),
  signupEmail: document.getElementById('signupEmail'),
  signupPassword: document.getElementById('signupPassword'),
  signupConfirmPassword: document.getElementById('signupConfirmPassword'),
  forgotEmail: document.getElementById('forgotEmail'),
  forgotPassword: document.getElementById('forgotPassword'),
  forgotConfirmPassword: document.getElementById('forgotConfirmPassword'),
  authMessage: document.getElementById('authMessage'),
  authHeading: document.getElementById('authHeading'),
  authLinkButtons: document.querySelectorAll('.auth-link'),
};

let adminMenu = [];
let adminOrders = [];
let editItemId = null;

const sampleMenuItems = [
  {
    id: 'burger-01',
    name: 'Veg Burger',
    category: 'Burgers',
    price: 80,
    image:
      'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    status: 'Available',
  },
  {
    id: 'burger-02',
    name: 'Chicken Burger',
    category: 'Burgers',
    price: 100,
    image:
      'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    status: 'Available',
  },
  {
    id: 'pizza-01',
    name: 'Paneer Pizza',
    category: 'Pizza',
    price: 150,
    image:
      'https://images.pexels.com/photos/3621613/pexels-photo-3621613.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    status: 'Available',
  },
  {
    id: 'fries-01',
    name: 'French Fries',
    category: 'Fries',
    price: 60,
    image:
      'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1',
    status: 'Available',
  },
];

const sampleOrders = [
  {
    id: 'order-1021',
    items: ['Veg Burger', 'French Fries'],
    total: 140,
    status: 'Preparing',
    payment: 'Pending',
    createdAt: 'Today 12:24 PM',
  },
  {
    id: 'order-1020',
    items: ['Paneer Pizza'],
    total: 150,
    status: 'Completed',
    payment: 'Paid',
    createdAt: 'Today 11:10 AM',
  },
];

function initializeAdminStorage() {
  if (!localStorage.getItem(adminStorageKeys.menu)) {
    localStorage.setItem(adminStorageKeys.menu, JSON.stringify(sampleMenuItems));
  }
  if (!localStorage.getItem(adminStorageKeys.orders)) {
    localStorage.setItem(adminStorageKeys.orders, JSON.stringify(sampleOrders));
  }
}

function loadAdminData() {
  adminMenu = JSON.parse(localStorage.getItem(adminStorageKeys.menu)) || sampleMenuItems;
  adminOrders = JSON.parse(localStorage.getItem(adminStorageKeys.orders)) || sampleOrders;
}

function saveAdminMenu() {
  localStorage.setItem(adminStorageKeys.menu, JSON.stringify(adminMenu));
}

function saveAdminOrders() {
  localStorage.setItem(adminStorageKeys.orders, JSON.stringify(adminOrders));
}

function getAdminUser() {
  return JSON.parse(localStorage.getItem(adminAuthKey)) || {
    name: 'Admin',
    email: 'admin@adda.com',
    password: 'admin123',
  };
}

function saveAdminUser(user) {
  localStorage.setItem(adminAuthKey, JSON.stringify(user));
}

function setAuthMessage(message, type = 'info') {
  adminElements.authMessage.textContent = message;
  adminElements.authMessage.className = `auth-message ${type}`;
  adminElements.authMessage.classList.remove('hidden');
}

function clearAuthMessage() {
  adminElements.authMessage.textContent = '';
  adminElements.authMessage.className = 'auth-message hidden';
}

function showAuthForm(target) {
  const forms = [adminElements.adminLoginForm, adminElements.adminSignupForm, adminElements.adminForgotForm];
  forms.forEach((form) => form.classList.add('hidden'));

  if (target === 'signup') {
    adminElements.adminSignupForm.classList.remove('hidden');
    adminElements.authHeading.textContent = 'Create an admin account';
  } else if (target === 'forgot') {
    adminElements.adminForgotForm.classList.remove('hidden');
    adminElements.authHeading.textContent = 'Reset your password';
  } else {
    adminElements.adminLoginForm.classList.remove('hidden');
    adminElements.authHeading.textContent = 'Sign in to access the admin dashboard';
  }

  clearAuthMessage();
}

function handleLogin(event) {
  event.preventDefault();
  const savedUser = getAdminUser();
  const email = adminElements.adminLoginForm.querySelector('#adminEmail').value.trim().toLowerCase();
  const password = adminElements.adminLoginForm.querySelector('#adminPassword').value.trim();

  if (email === savedUser.email.toLowerCase() && password === savedUser.password) {
    openAdminDashboard();
    return;
  }

  setAuthMessage('Invalid credentials. Use admin@adda.com / admin123 or sign up for a new admin account.', 'error');
}

function handleSignup(event) {
  event.preventDefault();
  const name = adminElements.adminName.value.trim();
  const email = adminElements.signupEmail.value.trim().toLowerCase();
  const password = adminElements.signupPassword.value.trim();
  const confirmPassword = adminElements.signupConfirmPassword.value.trim();
  const currentUser = getAdminUser();

  if (!name || !email || !password || !confirmPassword) {
    setAuthMessage('Please complete all signup fields.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    setAuthMessage('Passwords do not match. Please confirm your password.', 'error');
    return;
  }

  if (email === currentUser.email.toLowerCase()) {
    setAuthMessage('This email is already registered. Please login or reset your password.', 'error');
    return;
  }

  saveAdminUser({ name, email, password });
  setAuthMessage('Account created successfully. Please login with your new credentials.', 'success');
  showAuthForm('login');
  adminElements.adminSignupForm.reset();
}

function handleForgotPassword(event) {
  event.preventDefault();
  const email = adminElements.forgotEmail.value.trim().toLowerCase();
  const password = adminElements.forgotPassword.value.trim();
  const confirmPassword = adminElements.forgotConfirmPassword.value.trim();
  const currentUser = getAdminUser();

  if (!email || !password || !confirmPassword) {
    setAuthMessage('Please complete all reset fields.', 'error');
    return;
  }

  if (email !== currentUser.email.toLowerCase()) {
    setAuthMessage('No matching admin email found. Please sign up or use the registered email.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    setAuthMessage('Passwords do not match. Please confirm your new password.', 'error');
    return;
  }

  saveAdminUser({ ...currentUser, password });
  setAuthMessage('Password updated successfully. Please login with your new password.', 'success');
  showAuthForm('login');
  adminElements.adminForgotForm.reset();
}

function renderDashboard() {
  adminElements.totalOrders.textContent = adminOrders.length;
  adminElements.totalRevenue.textContent = `₹${adminOrders.reduce((sum, order) => sum + order.total, 0)}`;
  adminElements.pendingOrders.textContent = adminOrders.filter((order) => order.status !== 'Completed').length;
  adminElements.completedOrders.textContent = adminOrders.filter((order) => order.status === 'Completed').length;
  renderMenuTable();
  renderOrdersTable();
}

function renderMenuTable() {
  adminElements.menuTableBody.innerHTML = adminMenu
    .map(
      (item) => `
      <tr>
        <td class="menu-item-row">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <strong>${item.name}</strong>
            <span>${item.id}</span>
          </div>
        </td>
        <td>${item.category}</td>
        <td>₹${item.price}</td>
        <td><span class="tag ${item.status === 'Available' ? 'available' : 'out-of-stock'}">${item.status}</span></td>
        <td>
          <div class="action-buttons">
            <button type="button" data-action="edit" data-id="${item.id}"><i class="fas fa-edit"></i></button>
            <button type="button" data-action="delete" data-id="${item.id}"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');

  adminElements.menuTableBody.querySelectorAll('button').forEach((button) => {
    const action = button.dataset.action;
    const id = button.dataset.id;
    button.addEventListener('click', () => {
      if (action === 'edit') openEditModal(id);
      if (action === 'delete') deleteMenuItem(id);
    });
  });
}

function renderOrdersTable() {
  adminElements.ordersTableBody.innerHTML = adminOrders
    .map(
      (order) => `
      <tr>
        <td>${order.id}<span>${order.createdAt}</span></td>
        <td>${order.items.join(', ')}</td>
        <td>₹${order.total}</td>
        <td>
          <select class="payment-select" data-id="${order.id}" data-type="payment">
            <option value="Pending" ${order.payment === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Paid" ${order.payment === 'Paid' ? 'selected' : ''}>Paid</option>
          </select>
        </td>
        <td>
          <select class="status-select" data-id="${order.id}" data-type="status">
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
      </tr>
    `
    )
    .join('');

  adminElements.ordersTableBody.querySelectorAll('select').forEach((select) => {
    select.addEventListener('change', () => {
      const id = select.dataset.id;
      const type = select.dataset.type;
      const order = adminOrders.find((entry) => entry.id === id);
      if (!order) return;
      order[type] = select.value;
      saveAdminOrders();
      renderDashboard();
    });
  });
}

function openAdminDashboard() {
  adminElements.loginPanel.classList.add('hidden');
  adminElements.dashboardPanel.classList.remove('hidden');
  adminElements.headerLoginLink.classList.add('hidden');
  adminElements.headerLogoutBtn.classList.remove('hidden');
  adminElements.mobileLoginLink.classList.add('hidden');
  adminElements.mobileLogoutBtn.classList.remove('hidden');
  renderDashboard();
}

function openNewItemModal() {
  editItemId = null;
  adminElements.modalTitle.textContent = 'Add Menu Item';
  adminElements.menuForm.reset();
  adminElements.itemCategory.value = 'Burgers';
  adminElements.itemStatus.value = 'Available';
  adminElements.modalOverlay.classList.remove('hidden');
}

function openEditModal(itemId) {
  const item = adminMenu.find((entry) => entry.id === itemId);
  if (!item) return;
  editItemId = itemId;
  adminElements.modalTitle.textContent = 'Edit Menu Item';
  adminElements.itemName.value = item.name;
  adminElements.itemCategory.value = item.category;
  adminElements.itemPrice.value = item.price;
  adminElements.itemImage.value = item.image;
  adminElements.itemStatus.value = item.status;
  adminElements.modalOverlay.classList.remove('hidden');
}

function closeModal() {
  adminElements.modalOverlay.classList.add('hidden');
}

function deleteMenuItem(itemId) {
  adminMenu = adminMenu.filter((entry) => entry.id !== itemId);
  saveAdminMenu();
  renderDashboard();
}

function handleMenuForm(event) {
  event.preventDefault();
  const newItem = {
    id: editItemId || `item-${Date.now()}`,
    name: adminElements.itemName.value.trim(),
    category: adminElements.itemCategory.value,
    price: Number(adminElements.itemPrice.value),
    image: adminElements.itemImage.value.trim(),
    status: adminElements.itemStatus.value,
  };

  if (editItemId) {
    adminMenu = adminMenu.map((item) => (item.id === editItemId ? newItem : item));
  } else {
    adminMenu.unshift(newItem);
  }

  saveAdminMenu();
  closeModal();
  renderDashboard();
}

function setupAdminEvents() {
  adminElements.adminLoginForm.addEventListener('submit', handleLogin);
  adminElements.adminSignupForm.addEventListener('submit', handleSignup);
  adminElements.adminForgotForm.addEventListener('submit', handleForgotPassword);

  adminElements.authLinkButtons.forEach((button) => {
    button.addEventListener('click', () => showAuthForm(button.dataset.target));
  });

  adminElements.logoutButton.addEventListener('click', () => {
    adminElements.dashboardPanel.classList.add('hidden');
    adminElements.loginPanel.classList.remove('hidden');
    adminElements.headerLoginLink.classList.remove('hidden');
    adminElements.headerLogoutBtn.classList.add('hidden');
    adminElements.mobileLoginLink.classList.remove('hidden');
    adminElements.mobileLogoutBtn.classList.add('hidden');
    showAuthForm('login');
  });

  adminElements.headerLogoutBtn.addEventListener('click', () => {
    adminElements.dashboardPanel.classList.add('hidden');
    adminElements.loginPanel.classList.remove('hidden');
    adminElements.headerLoginLink.classList.remove('hidden');
    adminElements.headerLogoutBtn.classList.add('hidden');
    adminElements.mobileLoginLink.classList.remove('hidden');
    adminElements.mobileLogoutBtn.classList.add('hidden');
    showAuthForm('login');
  });

  adminElements.mobileLogoutBtn.addEventListener('click', () => {
    adminElements.dashboardPanel.classList.add('hidden');
    adminElements.loginPanel.classList.remove('hidden');
    adminElements.headerLoginLink.classList.remove('hidden');
    adminElements.headerLogoutBtn.classList.add('hidden');
    adminElements.mobileLoginLink.classList.remove('hidden');
    adminElements.mobileLogoutBtn.classList.add('hidden');
    showAuthForm('login');
  });

  adminElements.newItemButton.addEventListener('click', openNewItemModal);
  adminElements.modalClose.addEventListener('click', closeModal);
  adminElements.modalOverlay.addEventListener('click', (event) => {
    if (event.target === adminElements.modalOverlay) closeModal();
  });
  adminElements.menuForm.addEventListener('submit', handleMenuForm);
}

function initAdmin() {
  initializeAdminStorage();
  loadAdminData();
  setupAdminEvents();
  showAuthForm('login');
}

initAdmin();
