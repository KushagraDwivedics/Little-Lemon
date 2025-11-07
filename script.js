// Load cart state from local storage or initialize as empty array
let cart = JSON.parse(localStorage.getItem('littleLemonCart')) || [];


// DOM ELEMENT REFERENCES


const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const reservationForm = document.getElementById('reservationForm');
const successMessage = document.getElementById('successMessage');
const navbar = document.querySelector('.navbar');
const logo = document.querySelector('.logo');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const menuItems = document.querySelectorAll('.menu-item');
const dateInput = document.getElementById('date');

// Cart specific elements
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartCountElement = document.getElementById('cartCount');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalElement = document.getElementById('cartTotal');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');



// CART FUNCTIONS (ADD, REMOVE, RENDER)


/**
 * Saves the current cart state to Local Storage.
 */
function saveCart() {
    localStorage.setItem('littleLemonCart', JSON.stringify(cart));
}

/**
 * Updates the visible cart count bubble and triggers a bounce animation.
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    if (totalItems > 0) {
        cartCountElement.classList.add('visible', 'bouncing');
        // Remove bouncing class after animation finishes (0.5s)
        setTimeout(() => {
            cartCountElement.classList.remove('bouncing');
        }, 500);
    } else {
        cartCountElement.classList.remove('visible');
    }
}

/**
 * Handles adding an item to the cart.
 * @param {string} itemId - The ID of the item to add.
 */
function addToCart(itemId) {
    const itemElement = document.querySelector(`.menu-item[data-id="${itemId}"]`);
    if (!itemElement) return;

    const name = itemElement.dataset.name;
    const price = parseFloat(itemElement.dataset.price);

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: itemId, name: name, price: price, quantity: 1 });
    }

    saveCart();
    renderCart();
    updateCartCount();
    console.log(`Added ${name} to cart. Cart:`, cart);
}

/**
 * Changes the quantity of an item in the cart.
 * @param {string} itemId - The ID of the item.
 * @param {number} delta - The change in quantity (+1 or -1).
 */
function changeQuantity(itemId, delta) {
    const item = cart.find(i => i.id === itemId);

    if (item) {
        item.quantity += delta;

        if (item.quantity <= 0) {
            // Remove item if quantity drops to zero or below
            cart = cart.filter(i => i.id !== itemId);
        }
    }

    saveCart();
    renderCart();
    updateCartCount();
}

/**
 * Renders the cart items in the cart modal list.
 */
function renderCart() {
    cartItemsList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty. Start adding some delicious food!</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
            <div class="cart-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button data-id="${item.id}" data-action="increase">+</button>
                    <button class="remove-item-btn" data-id="${item.id}">X</button>
                </div>
            </div>
        `;
        cartItemsList.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Toggles the visibility of the cart modal and overlay.
 * @param {boolean} open - true to open, false to close.
 */
function toggleCart(open) {
    if (open) {
        renderCart(); // Render fresh cart every time it opens
        cartModal.classList.add('open');
        cartOverlay.style.display = 'block';
        // Fade in overlay
        setTimeout(() => cartOverlay.style.opacity = '1', 10);
    } else {
        cartModal.classList.remove('open');
        cartOverlay.style.opacity = '0';
        // Hide overlay after animation
        setTimeout(() => cartOverlay.style.display = 'none', 400);
    }
}



// EVENT LISTENERS


// 1. Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when user clicks on a navigation link (on mobile)
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// 2. Add to Cart Button Listeners
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const itemId = e.target.dataset.id;
        addToCart(itemId);
    });
});

// 3. Cart Modal Toggle Listeners
openCartBtn.addEventListener('click', () => toggleCart(true));
closeCartBtn.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false)); // Close when clicking overlay

// 4. Cart Item Controls Listener (Delegation)
cartItemsList.addEventListener('click', (e) => {
    const target = e.target;
    const itemId = target.dataset.id;
    const action = target.dataset.action;

    if (target.classList.contains('remove-item-btn')) {
        // Remove item logic
        cart = cart.filter(i => i.id !== itemId);
        saveCart();
        renderCart();
        updateCartCount();
    } else if (itemId && action) {
        if (action === 'increase') {
            changeQuantity(itemId, 1);
        } else if (action === 'decrease') {
            changeQuantity(itemId, -1);
        }
    }
});


// 5. Hero Slider (Image Carousel)
let currentSlide = 0;
function showSlide(slideIndex) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}
function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
}
// Automatically change slides every 5 seconds
setInterval(nextSlide, 5000);
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});


// 6. Smooth Scrolling for Navigation
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId !== '#' && targetId.length > 1) {
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// 7. Reservation Form Handling
reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        message: document.getElementById('message').value
    };
    console.log('Reservation submitted:', formData);

    reservationForm.style.display = 'none';
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
        reservationForm.style.display = 'block';
        reservationForm.reset();
    }, 5000);
});


// 8. Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});


// 9. Menu Items Animation on Scroll
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateMenuItems() {
    menuItems.forEach((item, index) => {
        if (isElementInViewport(item)) {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}

// Initial hiding for animation effect
menuItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease';
});

window.addEventListener('scroll', animateMenuItems);
// Run on load to check visible elements
animateMenuItems();


// 10. Set Minimum Date for Reservation
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
dateInput.setAttribute('min', formattedDate);


// 11. Logo Click to Scroll to Top
logo.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Final initialization: Load cart and update count on page load
renderCart();
updateCartCount();

// Start the slider on page load
window.onload = function() {
    showSlide(currentSlide);
};