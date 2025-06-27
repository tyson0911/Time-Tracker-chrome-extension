const PRODUCTIVE_DOMAINS = [
  'github.com', 'stackoverflow.com', 'leetcode.com', 'w3schools.com', 'docs.google.com', 'kaggle.com'
];
const UNPRODUCTIVE_DOMAINS = [
  'facebook.com', 'instagram.com', 'twitter.com', 'youtube.com', 'reddit.com', 'tiktok.com'
];

function classifyDomain(domain) {
  if (PRODUCTIVE_DOMAINS.includes(domain)) return 'Productive';
  if (UNPRODUCTIVE_DOMAINS.includes(domain)) return 'Unproductive';
  return 'Neutral';
}

function secondsToHms(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor(d % 60);
  return `${h}h ${m}m ${s}s`;
}

async function fetchAnalytics(start, end) {
  const res = await fetch(`http://localhost:4000/api/analytics/weekly?start=${start}&end=${end}`);
  return res.json();
}

function renderTable(data) {
  const tbody = document.querySelector('#analytics-table tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.domain}</td><td>${secondsToHms(row.total_seconds)}</td><td>${classifyDomain(row.domain)}</td>`;
    tbody.appendChild(tr);
  });
}

function renderChart(data) {
  const ctx = document.getElementById('barChart').getContext('2d');
  if (window.barChartInstance) window.barChartInstance.destroy();
  window.barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(row => row.domain),
      datasets: [{
        label: 'Time Spent (seconds)',
        data: data.map(row => row.total_seconds),
        backgroundColor: data.map(row => classifyDomain(row.domain) === 'Productive' ? '#4caf50' : classifyDomain(row.domain) === 'Unproductive' ? '#f44336' : '#90caf9')
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diffToMonday));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10)
  };
}

function setDefaultWeek() {
  const today = new Date();
  const { start, end } = getWeekRange(today);
  document.getElementById('start-date').value = start;
  document.getElementById('end-date').value = end;
}

async function updateDashboard() {
  const start = document.getElementById('start-date').value;
  const end = document.getElementById('end-date').value;
  const data = await fetchAnalytics(start, end);
  renderTable(data);
  renderChart(data);
}

document.getElementById('fetch-btn').addEventListener('click', updateDashboard);
setDefaultWeek();
updateDashboard(); 