const options = [
  "hideShorts",
  "hideComments",
  "hideSidebar",
  "hideHome",
  "subscriptionsOnly",
  "hideTrending",
  "focusMode"
];

chrome.storage.sync.get(options, (data) => {
  options.forEach(option => {
    const el = document.getElementById(option);
    if (el) el.checked = data[option] ?? false;
  });
});

options.forEach(option => {
  const el = document.getElementById(option);
  if (el) {
    el.addEventListener("change", () => {
      chrome.storage.sync.set({ [option]: el.checked });
    });
  }
});
