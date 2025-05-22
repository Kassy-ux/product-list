document.addEventListener('DOMContentLoaded', function() {
 
  const productsContainer = document.querySelector('.products-grid');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartCountElement = document.querySelector('.cart-count');
  const cartTitleCount = document.querySelector('.cart-title h2');
  const clearCartBtn = document.querySelector('.clear-btn');
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  const orderTotalElement = document.createElement('div');
  const confirmOrderBtn = document.createElement('button');
  const carbonNeutralMessage = document.createElement('p');


  let cart = [];

 
  function init() {
    loadProducts();
    loadCart();
    setupOrderConfirmationElements();
    setupEventListeners();
  }

  function loadProducts() {
    
  }

  function loadCart() {
    const savedCart = localStorage.getItem('dessertCart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
      updateProductQuantityControls(); 
    }
  }

  function saveCart() {
    localStorage.setItem('dessertCart', JSON.stringify(cart));
  }

  function setupOrderConfirmationElements() {
    orderTotalElement.className = 'order-total';
    cartItemsContainer.parentNode.insertBefore(orderTotalElement, cartItemsContainer.nextSibling);

    carbonNeutralMessage.className = 'carbon-message';
    carbonNeutralMessage.textContent = 'This is a carbon-neutral delivery';
    cartItemsContainer.parentNode.appendChild(carbonNeutralMessage);

    confirmOrderBtn.className = 'confirm-order-btn';
    confirmOrderBtn.textContent = 'Confirm Order';
    cartItemsContainer.parentNode.appendChild(confirmOrderBtn);

    confirmOrderBtn.addEventListener('click', showOrderConfirmation);
  }

  function setupEventListeners() {
   
    productsContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        addToCart(productCard);
      } else if (e.target.classList.contains('plus')) {
        const productCard = e.target.closest('.product-card');
        updateProductQuantity(productCard, 1);
      } else if (e.target.classList.contains('minus')) {
        const productCard = e.target.closest('.product-card');
        updateProductQuantity(productCard, -1);
      }
    });

    clearCartBtn.addEventListener('click', clearCart);
  }

  function addToCart(productCard) {
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
    const productImage = productCard.querySelector('.product-image').src;

    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
    }

    saveCart();
    updateCartDisplay();
    replaceAddToCartWithControls(productCard);
  }

  function replaceAddToCartWithControls(productCard) {
    const productName = productCard.querySelector('.product-name').textContent;
    const existingItem = cart.find(item => item.name === productName);
    const quantity = existingItem ? existingItem.quantity : 1;

    const quantityControls = document.createElement('div');
    quantityControls.className = 'product-quantity-controls';
    quantityControls.innerHTML = `
      <button class="quantity-btn minus">-</button>
      <span class="quantity">${quantity}</span>
      <button class="quantity-btn plus">+</button>
    `;

    const addToCartBtn = productCard.querySelector('.add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.replaceWith(quantityControls);
    }
  }

  function replaceControlsWithAddToCart(productCard) {
    const quantityControls = productCard.querySelector('.product-quantity-controls');
    if (quantityControls) {
      const addToCartBtn = document.createElement('button');
      addToCartBtn.className = 'add-to-cart';
      addToCartBtn.textContent = 'Add to Cart';
      quantityControls.replaceWith(addToCartBtn);
    }
  }

  function updateProductQuantity(productCard, change) {
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('$', ''));
    const productImage = productCard.querySelector('.product-image').src;
    const quantityElement = productCard.querySelector('.quantity');
    
    let quantity = parseInt(quantityElement.textContent) + change;
    quantity = Math.max(0, quantity);
    
 
    const existingItemIndex = cart.findIndex(item => item.name === productName);
    
    if (existingItemIndex >= 0) {
      if (quantity > 0) {
        cart[existingItemIndex].quantity = quantity;
        quantityElement.textContent = quantity;
      } else {
        cart.splice(existingItemIndex, 1);
       
        replaceControlsWithAddToCart(productCard);
      }
    } else if (quantity > 0) {
      cart.push({
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity
      });
      quantityElement.textContent = quantity;
    }
    
    saveCart();
    updateCartDisplay();
  }

  function updateProductQuantityControls() {
    document.querySelectorAll('.product-card').forEach(card => {
      const productName = card.querySelector('.product-name').textContent;
      const existingItem = cart.find(item => item.name === productName);
      
      if (existingItem && existingItem.quantity > 0) {
       
        if (!card.querySelector('.product-quantity-controls')) {
          replaceAddToCartWithControls(card);
        } else {
       
          const quantityElement = card.querySelector('.quantity');
          if (quantityElement) {
            quantityElement.textContent = existingItem.quantity;
          }
        }
      } else {
      
        if (!card.querySelector('.add-to-cart')) {
          replaceControlsWithAddToCart(card);
        }
      }
    });
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
    updateProductQuantityControls();
  }

  function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateProductQuantityControls(); 
  }

  function resetAllProductsToAddToCart() {
    document.querySelectorAll('.product-card').forEach(card => {
      replaceControlsWithAddToCart(card);
    });
  }

  function updateCartDisplay() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = `Your Cart (${totalItems})`;
    cartTitleCount.textContent = `Your Cart (${totalItems})`;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      emptyCartMessage.style.display = 'block';
      orderTotalElement.style.display = 'none';
      carbonNeutralMessage.style.display = 'none';
      confirmOrderBtn.style.display = 'none';
      return;
    } else {
      emptyCartMessage.style.display = 'none';
      orderTotalElement.style.display = 'block';
      carbonNeutralMessage.style.display = 'block';
      confirmOrderBtn.style.display = 'block';
    }

    let orderTotal = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      orderTotal += itemTotal;

      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
          </div>
          <div class="cart-item-total">
            <p>$${itemTotal.toFixed(2)}</p>
            <button class="remove-item" data-index="${index}">×</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(cartItemElement);
    });

    orderTotalElement.innerHTML = `
      <div class="order-total-row">
        <span>Order Total</span>
        <span>$${orderTotal.toFixed(2)}</span>
      </div>
    `;

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        removeFromCart(index);
      });
    });
  }

  function showOrderConfirmation() {
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'confirmation-modal';
    
    let orderSummaryHTML = '';
    cart.forEach(item => {
      orderSummaryHTML += `
        <div class="order-item">
          <img src="${item.image}" alt="${item.name}" class="order-item-image">
          <div class="order-item-details">
            <h4>${item.name}</h4>
            <p>${item.quantity} × $${item.price.toFixed(2)}</p>
            <p class="order-item-total">$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      `;
    });

    const orderTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    confirmationModal.innerHTML = `
      <div class="confirmation-content">
        <div class="confirmation-header">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#D87D4A"/>
            <path d="M20.7539 33.3328L27.5054 40.0843L43.3085 24.2812" stroke="white" stroke-width="4"/>
          </svg>
          <h2>ORDER CONFIRMED</h2>
        </div>
        
        <div class="order-summary">
        
          <p class="confirmation-message">Your delicious desserts are being prepared!</p>
        
          ${orderSummaryHTML}
          <div class="order-total-row">
            <span>Total</span>
            <span>$${orderTotal.toFixed(2)}</span>
          </div>
        </div>
        
        
        <div class="confirmation-actions">
          <button class="new-order-btn">Start New Order</button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmationModal);
    document.body.style.overflow = 'hidden';

    confirmationModal.querySelector('.new-order-btn').addEventListener('click', function() {
      clearCart();
      resetAllProductsToAddToCart();
      document.body.removeChild(confirmationModal);
      document.body.style.overflow = 'auto';
    });
  }

  init();
});