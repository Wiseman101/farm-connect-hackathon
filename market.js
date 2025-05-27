// 🌾 FarmConnect Market Logic
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showNotification("🔐 Please login first", "error");
    setTimeout(() => window.location.href = "login.html", 2000);
    return;
  }

  // Initialize market
  initMarket();
});

function initMarket() {
  // Setup category filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");
      
      const category = btn.dataset.category;
      filterItems(category);
    });
  });

  // Setup search functionality
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    searchItems(searchTerm);
  });

  // Setup add to cart buttons
  const addToCartButtons = document.querySelectorAll(".btn-primary");
  addToCartButtons.forEach(btn => {
    btn.addEventListener("click", handleAddToCart);
  });

  // Setup logout
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    showNotification("👋 Logging out...", "success");
    setTimeout(() => window.location.href = "login.html", 1000);
  });
}

function filterItems(category) {
  const items = document.querySelectorAll(".market-item");
  
  items.forEach(item => {
    if (category === "all" || item.dataset.category === category) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function searchItems(searchTerm) {
  const items = document.querySelectorAll(".market-item");
  
  items.forEach(item => {
    const title = item.querySelector("h3").textContent.toLowerCase();
    const description = item.querySelector(".description").textContent.toLowerCase();
    const seller = item.querySelector(".seller-info span").textContent.toLowerCase();
    
    if (title.includes(searchTerm) || 
        description.includes(searchTerm) || 
        seller.includes(searchTerm)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

function handleAddToCart(e) {
  const item = e.target.closest(".market-item");
  const itemDetails = {
    name: item.querySelector("h3").textContent,
    price: item.querySelector(".price").textContent,
    seller: item.querySelector(".seller-info span").textContent,
    image: item.querySelector("img").src
  };

  // Get current cart or initialize empty array
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Add item to cart
  cart.push(itemDetails);
  
  // Save cart
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Show success message
  showNotification(`Added ${itemDetails.name} to cart!`, "success");
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
} 