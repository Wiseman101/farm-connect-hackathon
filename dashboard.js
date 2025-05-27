// 🌾 FarmConnect Dashboard Logic
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showNotification("🔐 Please login first", "error");
    setTimeout(() => window.location.href = "login.html", 2000);
    return;
  }

  // Load user data
  loadProfile(currentUser);
  
  // Initialize dashboard
  initDashboard();
  
  // Setup event listeners
  setupEventListeners();
});

function loadProfile(user) {
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-phone").textContent = user.phone || "Not set";
  document.getElementById("profile-joined").textContent = `Member since ${user.joined}`;
  
  // Set avatar
  const avatar = document.getElementById("profile-avatar");
  avatar.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2e7d32&color=fff`;
}

function initDashboard() {
  // Load saved farm info
  loadFarmInfo();
  
  // Load activities
  loadActivities();
  
  // Update weather
  updateWeather();
}

function loadActivities() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const activities = currentUser.activities || [];
  renderActivities(activities);
}

function renderActivities(activities) {
  const list = document.getElementById("activity-list");
  list.innerHTML = "";
  
  if (activities.length === 0) {
    list.innerHTML = `
      <li class="empty-state">
        <i class="fas fa-info-circle"></i>
        <span>No activities yet. Start by updating your farm information!</span>
      </li>
    `;
    return;
  }
  
  activities.forEach(act => {
    const li = document.createElement("li");
    li.innerHTML = `
      <i class="${act.icon}"></i>
      <span>${act.text}</span>
      <small>${act.time}</small>
    `;
    list.appendChild(li);
  });
}

function updateWeather() {
  const weatherConditions = [
    {icon: "fas fa-sun", text: "Sunny", color: "#FFC107", advice: "Great day for harvesting!"},
    {icon: "fas fa-cloud-rain", text: "Rainy", color: "#2196F3", advice: "Good for crops, protect your harvest"},
    {icon: "fas fa-cloud", text: "Cloudy", color: "#9E9E9E", advice: "Ideal for planting"},
    {icon: "fas fa-bolt", text: "Stormy", color: "#9C27B0", advice: "Secure your farm structures"},
    {icon: "fas fa-wind", text: "Windy", color: "#00BCD4", advice: "Protect delicate crops"}
  ];
  
  const temps = [18, 20, 22, 24, 25, 26, 27, 28];
  const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const temp = temps[Math.floor(Math.random() * temps.length)];
  
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.innerHTML = `<i class="${condition.icon}"></i>`;
  weatherIcon.style.color = condition.color;
  
  document.getElementById("weather-text").textContent = 
    `${condition.text}, ${temp}°C | ${condition.advice}`;
}

function loadFarmInfo() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const farmInfo = currentUser.farmInfo || {};
  
  if (farmInfo.produceType) {
    document.getElementById("produce-type").value = farmInfo.produceType;
  }
  
  if (farmInfo.location) {
    document.getElementById("produce-location").value = farmInfo.location;
  }
}

function setupEventListeners() {
  // Logout
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    showNotification("👋 Logging out...", "success");
    setTimeout(() => window.location.href = "login.html", 1000);
  });
  
  // Update farm info
  document.getElementById("update-produce").addEventListener("click", updateFarmInfo);
  
  // Quick actions
  document.getElementById("new-order-btn").addEventListener("click", () => {
    showNotification("📦 New order form will open", "success");
    // Add redirection to order form when implemented
  });
  
  document.getElementById("market-btn").addEventListener("click", () => {
    showNotification("🛒 Opening market...", "success");
    setTimeout(() => {
      window.location.href = "market.html";
    }, 1000);
  });
  
  document.getElementById("help-btn").addEventListener("click", () => {
    showNotification("📚 Opening Help Center...", "success");
    setTimeout(() => window.location.href = "help.html", 1000);
  });
  
  // Weather alerts toggle
  document.getElementById("weather-alerts").addEventListener("change", (e) => {
    const status = e.target.checked ? "ON" : "OFF";
    showNotification(`🌤️ Weather alerts turned ${status}`, "success");
  });
}

function updateFarmInfo() {
  const produceType = document.getElementById("produce-type").value.trim();
  const produceLocation = document.getElementById("produce-location").value.trim();
  
  if (!produceType || !produceLocation) {
    showNotification("🛑 Please fill in all fields", "error");
    return;
  }
  
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users"));
  
  // Update user's farm info
  currentUser.farmInfo = {
    produceType,
    location: produceLocation,
    lastUpdated: new Date().toISOString()
  };
  
  // Add activity
  const newActivity = {
    text: `Farm info updated: ${produceType} in ${produceLocation}`,
    time: "Just now",
    icon: "fas fa-seedling"
  };
  
  currentUser.activities = [newActivity, ...(currentUser.activities || [])];
  
  // Update user in users array
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...currentUser };
  }
  
  // Save to localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("users", JSON.stringify(users));
  
  // Update UI
  renderActivities(currentUser.activities);
  showNotification("✅ Farm information updated successfully", "success");
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