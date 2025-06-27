function secondsToHms(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor(d % 60);
  return `${h}h ${m}m ${s}s`;
}

chrome.storage.local.get(null, (data) => {
  const list = document.getElementById('time-list');
  list.innerHTML = '';
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    list.textContent = 'No data yet.';
    return;
  }
  entries.forEach(([domain, seconds]) => {
    const div = document.createElement('div');
    div.textContent = `${domain}: ${secondsToHms(seconds)}`;
    list.appendChild(div);
  });
}); 