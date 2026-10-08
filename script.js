const CONFIG = {
  HOME_URL: "https://www.recursoseso.com/",
  PROTECTED_URL: "https://www.smartproxy.es/proxy-site/",
  PASSWORD: "insperalada"
};

const state = {
  currentView: "home",
  isAuthenticated: false,
  currentPassword: CONFIG.PASSWORD
};

const webFrame = document.getElementById("webFrame");
const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");

function hideOverlays() {
  loginOverlay.classList.add("hidden");
  loginError.textContent = "";
}

function showHome() {
  state.currentView = "home";
  webFrame.src = CONFIG.HOME_URL;
  hideOverlays();
}

function showProtected() {
  state.currentView = "protected";
  webFrame.src = CONFIG.PROTECTED_URL;
  hideOverlays();
}

function showLogin() {
  state.currentView = "login";
  hideOverlays();
  loginOverlay.classList.remove("hidden");
  passwordInput.value = "";
  loginError.textContent = "";
  setTimeout(() => passwordInput.focus(), 50);
}

function openPreviousView() {
  if (state.isAuthenticated) {
    if (state.currentView === "home" || state.currentView === "login") {
      showProtected();
    } else {
      showHome();
    }
    return;
  }

  showHome();
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const value = passwordInput.value.trim();

  if (value === state.currentPassword) {
    state.isAuthenticated = true;
    showProtected();
    return;
  }

  loginError.textContent = "Contraseña incorrecta";
  passwordInput.value = "";
  passwordInput.focus();
}

function handleTabNavigation(event) {
  if (event.key !== "Tab") {
    return;
  }

  const activeTag = document.activeElement && document.activeElement.tagName;
  const inFormField = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(activeTag);

  if (inFormField && !event.target.closest("#loginForm")) {
    return;
  }

  if (state.currentView === "login") {
    return;
  }

  event.preventDefault();

  if (!state.isAuthenticated) {
    showLogin();
    return;
  }

  if (state.currentView === "home") {
    showProtected();
  } else {
    showHome();
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    handleTabNavigation(event);
  }

  if (event.key === "Escape") {
    if (state.currentView === "login") {
      if (state.isAuthenticated) {
        openPreviousView();
      } else {
        showHome();
      }
    }
  }
});

loginForm.addEventListener("submit", handleLoginSubmit);

showHome();
