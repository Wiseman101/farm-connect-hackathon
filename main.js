// main.js

document.getElementById('signup').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await signUp(email, password);
  if (error) {
  alert("❌ Signup failed: " + error.message);
} else {
  alert("✅ Signup success! Redirecting...");
  window.location.href = 'dashboard.html';
}

});

document.getElementById('login').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await signIn(email, password);
  if (error) {
  alert("❌ Login failed: " + error.message);
} else {
  alert("🎉 Logged in! Redirecting...");
  window.location.href = 'dashboard.html';
}

});
