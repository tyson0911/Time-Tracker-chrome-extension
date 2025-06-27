// Keeps track of the current active tab and time spent on each domain
let currentTabId = null;
let currentDomain = null;
let startTime = null;

// Helper to get domain from URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Save time spent to chrome.storage and send to backend
function saveTime(domain, timeSpent) {
  if (!domain || !timeSpent) return;
  chrome.storage.local.get([domain], (result) => {
    const prev = result[domain] || 0;
    const updated = prev + timeSpent;
    chrome.storage.local.set({ [domain]: updated });
    // Send to backend
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    fetch('http://localhost:4000/api/time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, seconds: timeSpent, date: dateStr })
    }).catch(err => console.error('Failed to sync with backend:', err));
  });
}

function handleTabChange(tabId, url) {
  const now = Date.now();
  if (currentDomain && startTime) {
    const timeSpent = Math.floor((now - startTime) / 1000); // seconds
    saveTime(currentDomain, timeSpent);
  }
  currentTabId = tabId;
  currentDomain = getDomain(url);
  startTime = now;
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      handleTabChange(tab.id, tab.url);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    handleTabChange(tabId, changeInfo.url);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // All windows unfocused, save time
    handleTabChange(null, null);
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        handleTabChange(tabs[0].id, tabs[0].url);
      }
    });
  }
});

// On extension suspend, save time
chrome.runtime.onSuspend.addListener(() => {
  handleTabChange(null, null);
}); 