console.log("YouTube Focus Pro Loaded");

// Helper
function toggleElement(selector, hide) {
  document.querySelectorAll(selector).forEach(el => {
    el.style.display = hide ? "none" : "";
  });
}

// Shorts everywhere
function hideShorts(hide) {
  toggleElement("ytd-reel-shelf-renderer", hide);

  document.querySelectorAll("a[href^='/shorts/']").forEach(link => {
    const container =
      link.closest("ytd-rich-item-renderer") ||
      link.closest("ytd-video-renderer") ||
      link.closest("ytd-grid-video-renderer") ||
      link.closest("ytd-compact-video-renderer");

    if (container) container.style.display = hide ? "none" : "";
  });
}

// Home feed
function hideHomeFeed(hide) {
  if (window.location.pathname === "/") {
    toggleElement("ytd-browse[page-subtype='home']", hide);
  }
}

// Subscriptions redirect (one-way behavior)
function subscriptionsOnly(enable) {
  const url = window.location.href;

  if (enable) {
    if (!url.includes("/feed/subscriptions")) {
      window.location.assign("/feed/subscriptions");
    }
  } else {
    if (url.includes("/feed/subscriptions")) {
      window.location.assign("/");
    }
  }
}

// Trending
function hideTrending(hide) {
  document.querySelectorAll("a[href='/feed/trending']").forEach(el => {
    el.style.display = hide ? "none" : "";
  });
}

// Focus overlay
function focusMode(enable) {
  let overlay = document.getElementById("yt-focus-overlay");

  if (enable) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "yt-focus-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "white";
      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = "999999";
      overlay.innerHTML = `
        <div style="text-align:center;font-family:sans-serif;">
          <h1>Stay Focused 🚀</h1>
          <p>YouTube is hidden in Focus Mode.</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
  } else {
    if (overlay) overlay.remove();
  }
}

// Apply all
function apply(settings) {
  hideShorts(settings.hideShorts);
  toggleElement("#comments", settings.hideComments);
  toggleElement("#secondary", settings.hideSidebar);
  hideHomeFeed(settings.hideHome);
  subscriptionsOnly(settings.subscriptionsOnly);
  hideTrending(settings.hideTrending);
  focusMode(settings.focusMode);
}

const options = [
  "hideShorts",
  "hideComments",
  "hideSidebar",
  "hideHome",
  "subscriptionsOnly",
  "hideTrending",
  "focusMode"
];

chrome.storage.sync.get(options, apply);

chrome.storage.onChanged.addListener(() => {
  chrome.storage.sync.get(options, apply);
});

// Observe dynamic DOM
const observer = new MutationObserver(() => {
  chrome.storage.sync.get(options, apply);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
