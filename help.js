// 🌾 FarmConnect Help Center Logic
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showNotification("🔐 Please login first", "error");
    setTimeout(() => window.location.href = "login.html", 2000);
    return;
  }

  // Initialize help center
  initHelpCenter();
});

function initHelpCenter() {
  // Setup search functionality
  const searchInput = document.getElementById("help-search");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    searchHelpTopics(searchTerm);
  });

  // Setup logout
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    showNotification("👋 Logging out...", "success");
    setTimeout(() => window.location.href = "login.html", 1000);
  });

  // Add click handlers to help items
  const helpItems = document.querySelectorAll(".help-item");
  helpItems.forEach(item => {
    item.addEventListener("click", () => {
      // Add active class to clicked item
      helpItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function searchHelpTopics(searchTerm) {
  const helpItems = document.querySelectorAll(".help-item");
  const helpSections = document.querySelectorAll(".help-section");
  
  helpItems.forEach(item => {
    const title = item.querySelector("h3").textContent.toLowerCase();
    const content = item.textContent.toLowerCase();
    
    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      item.style.display = "block";
      // Show parent section
      item.closest(".help-section").style.display = "block";
    } else {
      item.style.display = "none";
    }
  });

  // Hide empty sections
  helpSections.forEach(section => {
    const visibleItems = section.querySelectorAll(".help-item[style='display: block']");
    if (visibleItems.length === 0) {
      section.style.display = "none";
    }
  });
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