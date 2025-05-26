// 🌾 FarmConnect Authentication Logic
let loginForm;
let signupForm;

document.addEventListener("DOMContentLoaded", () => {
  loginForm = document.getElementById("login-form");
  signupForm = document.getElementById("signup-form");

  // LOGIN: Enable button only when both fields are filled
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const loginBtn = document.getElementById("login-btn");

  if (loginEmail && loginPassword && loginBtn) {
    function checkLoginInputs() {
      loginBtn.disabled = !(loginEmail.value.trim() && loginPassword.value.trim());
    }
    loginEmail.addEventListener("input", checkLoginInputs);
    loginPassword.addEventListener("input", checkLoginInputs);
    checkLoginInputs();
  }

  // SIGNUP: Enable button only when all fields are filled
  const signupName = document.getElementById("signup-name");
  const signupEmail = document.getElementById("signup-email");
  const signupPhone = document.getElementById("signup-phone");
  const signupPassword = document.getElementById("signup-password");
  const signupConfirm = document.getElementById("confirm-password");
  const signupBtn = document.getElementById("signup-btn");

  if (signupName && signupEmail && signupPhone && signupPassword && signupConfirm && signupBtn) {
    function checkSignupInputs() {
      signupBtn.disabled = !(
        signupName.value.trim() &&
        signupEmail.value.trim() &&
        signupPhone.value.trim() &&
        signupPassword.value.trim() &&
        signupConfirm.value.trim()
      );
    }
    signupName.addEventListener("input", checkSignupInputs);
    signupEmail.addEventListener("input", checkSignupInputs);
    signupPhone.addEventListener("input", checkSignupInputs);
    signupPassword.addEventListener("input", checkSignupInputs);
    signupConfirm.addEventListener("input", checkSignupInputs);
    checkSignupInputs();
  }

  // Handle login
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Handle signup
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }
});

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  // Optional: const rememberMe = document.getElementById("remember-me")?.checked;

  // Validation
  if (!email || !password) {
    showNotification("🛑 Please fill in all fields", "error");
    return;
  }

  // Show loading state
  const btn = loginForm.querySelector("button");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
  btn.disabled = true;

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showNotification("🔐 Invalid email or password", "error");
    btn.innerHTML = originalText;
    btn.disabled = false;
    return;
  }

  // Create user session without password
  const { password: _, ...userSession } = user;

  // Save to localStorage
  localStorage.setItem("currentUser", JSON.stringify(userSession));

  // Show success message
  showNotification("Login successful! Redirecting to dashboard...", "success");

  // Redirect to dashboard after 1 second
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}

async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  // Validate passwords match
  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error");
    return;
  }

  // Validation
  if (!name || !email || !phone || !password) {
    showNotification("🛑 Please fill in all fields", "error");
    return;
  }

  if (password.length < 6) {
    showNotification("🔐 Password must be at least 6 characters", "error");
    return;
  }

  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    showNotification("📧 Please enter a valid email address", "error");
    return;
  }

  // Show loading state
  const btn = signupForm.querySelector("button");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
  btn.disabled = true;

  // Get existing users or initialize empty array
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  if (users.some(u => u.email === email)) {
    showNotification("📧 Email already registered", "error");
    btn.innerHTML = originalText;
    btn.disabled = false;
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    password,
    joined: new Date().toLocaleDateString(),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e7d32&color=fff`,
    farmInfo: {
      produceType: "",
      location: "",
      lastUpdated: null
    },
    activities: []
  };

  // Add user to array
  users.push(newUser);

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Show success message
  showNotification("🎉 Account created! Redirecting to login...", "success");

  // Redirect to login page after 2 seconds
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
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
