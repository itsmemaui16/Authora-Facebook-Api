const APP_ID = document.documentElement.getAttribute("data-fb-app-id") || "";

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const profilePanel = document.getElementById("profile-panel");
const profileName = document.getElementById("profile-name");
const profilePicture = document.getElementById("profile-picture");
const emailRow = document.getElementById("email-row");
const hometownRow = document.getElementById("hometown-row");
const profileEmail = document.getElementById("profile-email");
const profileHometown = document.getElementById("profile-hometown");

let isSdkLoaded = false;
let isSdkReady = false;

const setButtonState = (state) => {
  if (!loginBtn) return;
  const textEl = loginBtn.querySelector(".btn-text");
  if (state === "loading") {
    loginBtn.disabled = true;
    loginBtn.classList.add("loading");
    if (textEl) textEl.textContent = "Connecting...";
  } else {
    loginBtn.disabled = false;
    loginBtn.classList.remove("loading");
    if (textEl) textEl.textContent = "Continue with Facebook";
  }
};

const showProfile = (user) => {
  profileName.textContent = user.name || "Facebook User";
  profilePicture.src = user.picture || "";

  // Optional fields: show rows only if data exists to keep layout intentional.
  if (user.email) {
    profileEmail.textContent = user.email;
    emailRow.classList.remove("hidden");
    requestAnimationFrame(() => emailRow.classList.add("visible"));
  } else {
    profileEmail.textContent = "";
    emailRow.classList.remove("visible");
    emailRow.classList.add("hidden");
  }

  if (user.hometown) {
    profileHometown.textContent = user.hometown;
    hometownRow.classList.remove("hidden");
    requestAnimationFrame(() => hometownRow.classList.add("visible"));
  } else {
    profileHometown.textContent = "";
    hometownRow.classList.remove("visible");
    hometownRow.classList.add("hidden");
  }

  profilePanel.classList.remove("hidden");
  loginBtn.classList.add("hidden");
  logoutBtn.classList.remove("hidden");

  profilePanel.style.opacity = "0";
  profilePanel.style.transform = "translateY(6px) scale(0.98)";
  requestAnimationFrame(() => {
    profilePanel.style.transition = "opacity 260ms ease, transform 260ms ease";
    profilePanel.style.opacity = "1";
    profilePanel.style.transform = "translateY(0) scale(1)";
  });
};

const resetUI = () => {
  profilePanel.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  loginBtn.classList.remove("hidden");
  emailRow.classList.add("hidden");
  hometownRow.classList.add("hidden");
  emailRow.classList.remove("visible");
  hometownRow.classList.remove("visible");
  setButtonState("idle");
};

// Facebook login requires HTTPS; use ngrok (https) when testing locally.
const loginWithFacebook = () => {
  if (!isSdkReady || typeof FB === "undefined") {
    console.error("Facebook SDK not ready. Ensure HTTPS and SDK load.");
    setButtonState("idle");
    return;
  }

  setButtonState("loading");
  try {
    FB.login(
      (response) => {
        if (response && response.authResponse) {
          // Fetch minimal profile details for UI
          FB.api(
            "/me",
            { fields: "id,name,email,hometown,picture.type(large)" },
            (profile) => {
              if (!profile || profile.error) {
                if (profile?.error?.code === "ERR_BLOCKED_BY_CLIENT") {
                  console.warn("Facebook API request blocked by client");
                } else {
                  console.error("Profile fetch failed", profile?.error);
                }
                setButtonState("idle");
                return;
              }
              const normalized = {
                name: profile.name,
                email: profile.email || null,
                hometown: profile.hometown?.name || null,
                picture: profile.picture?.data?.url,
              };

              if (!normalized.email) {
                // Silence missing email; do not treat as error.
              }

              showProfile(normalized);
              setButtonState("idle");
            }
          );
        } else {
          // User cancelled or closed popup: return button to normal
          setButtonState("idle");
        }
      },
      { scope: "public_profile,email,user_hometown", return_scopes: true }
    );
  } catch (err) {
    console.error("Facebook login error", err);
    setButtonState("idle");
  }
};

const onLogout = () => {
  FB.logout(() => {
    resetUI();
  });
};

const checkStatus = () => {
  // Intentional no-op: avoid automatic FB.getLoginStatus on load.
};

const injectFacebookSDK = () => {
  if (isSdkLoaded || !APP_ID) return;
  isSdkLoaded = true;

  window.fbAsyncInit = function () {
    FB.init({
      appId: APP_ID,
      cookie: true,
      xfbml: false,
      version: "v19.0",
    });
    isSdkReady = true;
  };

  const script = document.createElement("script");
  script.src = "https://connect.facebook.net/en_US/sdk.js";
  script.async = true;
  script.defer = true;
  script.crossOrigin = "anonymous";
  script.onerror = () => {
    setButtonState("idle");
    isSdkLoaded = false;
  };
  document.body.appendChild(script);
};

const init = () => {
  if (!APP_ID) {
    console.warn("Facebook App ID is missing. Set data-fb-app-id on <html>.");
  } else {
    injectFacebookSDK();
  }

  loginBtn.addEventListener("click", loginWithFacebook);

  logoutBtn.addEventListener("click", onLogout);
};

document.addEventListener("DOMContentLoaded", init);

