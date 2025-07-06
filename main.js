// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length > 1 && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Fade-in animation on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  section.classList.add('fade-init');
  observer.observe(section);
});

// Typing animation for categories (no flash, smooth)
const categories = [
  'Hairstylist',
  'Lawncare',
  'Mechanic',
  'Farmer',
  'Carpenter',
  'Chef',
  'Cleaner',
  'Truck Driver',
  'Plumber',
  'Electrician',
  'Painter',
  'HVAC Technician',
  'Welder',
  'Medical Aide',
  'Photographer',
  'Gig Worker',
  'Student Helper',
  'Family Helper',
  'Small Business Owner'
];
let catIndex = 0;
let charIndex = 0;
let typing = true;
const typingText = document.getElementById('typing-text');
const cursor = document.querySelector('.typing-cursor');

function typeCategory() {
  if (!typingText) return;
  const current = categories[catIndex];
  if (typing) {
    if (charIndex <= current.length) {
      typingText.textContent = current.slice(0, charIndex++);
      setTimeout(typeCategory, 80);
    } else {
      typing = false;
      setTimeout(typeCategory, 1200);
    }
  } else {
    if (charIndex > 0) {
      typingText.textContent = current.slice(0, --charIndex);
      setTimeout(typeCategory, 40);
    } else {
      typing = true;
      catIndex = (catIndex + 1) % categories.length;
      setTimeout(typeCategory, 400);
    }
  }
}
if (typingText) typeCategory();

// System light/dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.setAttribute('data-theme', 'light');
      themeToggle.textContent = '🌙';
    } else {
      html.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
    }
  });
}
// Set initial theme based on system preference
(function() {
  const html = document.documentElement;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    html.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
})();

// Share modal logic
const shareBtn = document.getElementById('share-btn');
const shareModalBg = document.getElementById('share-modal-bg');
const closeShareModal = document.getElementById('close-share-modal');
const copyMetricsBtn = document.getElementById('copy-metrics');
const downloadCsvBtn = document.getElementById('download-csv');

if (shareBtn) {
  shareBtn.onclick = () => shareModalBg.classList.add('active');
}
if (closeShareModal) {
  closeShareModal.onclick = () => shareModalBg.classList.remove('active');
}
if (shareModalBg) {
  shareModalBg.onclick = (e) => {
    if (e.target === shareModalBg) shareModalBg.classList.remove('active');
  };
}

function getMetricsAndWorklogText() {
  // Gather metrics and work log data as text
  let text = 'Your Metrics:\n';
  document.querySelectorAll('.metric').forEach(m => {
    text += m.innerText + '\n';
  });
  text += '\nWork Log:\n';
  document.querySelectorAll('.worklog-card').forEach(w => {
    text += w.innerText + '\n';
  });
  return text;
}

if (copyMetricsBtn) {
  copyMetricsBtn.onclick = () => {
    const text = getMetricsAndWorklogText();
    navigator.clipboard.writeText(text).then(() => {
      copyMetricsBtn.innerText = 'Copied!';
      setTimeout(() => (copyMetricsBtn.innerText = 'Copy to Clipboard'), 1200);
    });
  };
}

function getMetricsAndWorklogCSV() {
  let csv = 'Metric,Value\n';
  document.querySelectorAll('.metric').forEach(m => {
    const parts = m.innerText.split('\n');
    csv += '"' + parts[0] + '","' + (parts[1] || '') + '"\n';
  });
  csv += '\nWork Log\nDate,Task,Notes\n';
  document.querySelectorAll('.worklog-card').forEach(w => {
    const info = w.querySelector('.worklog-info');
    if (info) {
      const [task, date, notes] = Array.from(info.children).map(x => x.innerText);
      csv += '"' + (date || '') + '","' + (task || '') + '","' + (notes || '') + '"\n';
    }
  });
  return csv;
}

if (downloadCsvBtn) {
  downloadCsvBtn.onclick = () => {
    const csv = getMetricsAndWorklogCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'statsbystep_metrics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}

// Auth gate logic for dashboard
const authGate = document.getElementById('auth-gate');
const dashboardContent = document.getElementById('dashboard-content');
const showDashboardBtn = document.getElementById('show-dashboard-btn');
if (showDashboardBtn) {
  showDashboardBtn.onclick = function() {
    authGate.style.display = 'none';
    dashboardContent.style.display = 'block';
    // Optionally, focus category dropdown or other dashboard element
    const cat = document.getElementById('category');
    if (cat) cat.focus();
  };
}

// --- Dashboard universal metrics and pastel theming ---
const pastelColors = {
  'Hairstylist': '#c7d2fe',
  'Lawncare': '#bbf7d0',
  'Mechanic': '#fef9c3',
  'Farmer': '#fde68a',
  'Carpenter': '#fbcfe8',
  'Chef': '#fcd34d',
  'Cleaner': '#bae6fd',
  'Truck Driver': '#fca5a5',
  'Plumber': '#a7f3d0',
  'Electrician': '#fef08a',
  'Painter': '#fbcfe8',
  'HVAC Technician': '#a5b4fc',
  'Welder': '#fcd34d',
  'Medical Aide': '#fca5a5',
  'Photographer': '#fef9c3',
  'Gig Worker': '#fbcfe8',
  'Student Helper': '#bbf7d0',
  'Family Helper': '#a7f3d0',
  'Small Business Owner': '#c7d2fe'
};
const categoryEmojis = {
  'Hairstylist': '💇‍♂️',
  'Lawncare': '🌱',
  'Mechanic': '🔧',
  'Farmer': '🚜',
  'Carpenter': '🪚',
  'Chef': '👨‍🍳',
  'Cleaner': '🧹',
  'Truck Driver': '🚚',
  'Plumber': '🚰',
  'Electrician': '💡',
  'Painter': '🎨',
  'HVAC Technician': '❄️',
  'Welder': '⚒️',
  'Medical Aide': '🩺',
  'Photographer': '📸',
  'Gig Worker': '💼',
  'Student Helper': '🎒',
  'Family Helper': '🤗',
  'Small Business Owner': '🏪'
};

function updateDashboardTheme(category) {
  const color = pastelColors[category] || '#e0e7ef';
  document.querySelector('.metrics-section').style.background = color;
  document.querySelector('.metrics-section').style.boxShadow = `0 2px 8px 0 ${color}`;
}

function updateCategoryEmoji(category) {
  const emoji = categoryEmojis[category] || '🛠️';
  document.getElementById('category-emoji').textContent = emoji;
}

// --- Universal metrics logic ---
function updateMetricsAndWorklog() {
  const catSelect = document.getElementById('category');
  const selected = catSelect.options[catSelect.selectedIndex].value;
  updateDashboardTheme(selected);
  updateCategoryEmoji(selected);
  const logs = workLogs[selected] || [];
  // Universal metrics
  const metrics = [
    { emoji: '📊', label: 'Clients / Projects Completed', value: logs.length },
    { emoji: '⏱️', label: 'Total Hours Worked', value: logs.reduce((sum, l) => sum + (l.hours || 0), 0) }
  ];
  const metricsList = document.getElementById('metrics-list');
  metricsList.innerHTML = metrics.map(m => `
    <div class="metric" style="border-top: 4px solid #e5e7eb;">
      <span class="metric-emoji">${m.emoji}</span>
      <span class="metric-label">${m.label}</span>
      <span>${m.value}</span>
    </div>
  `).join('');
  // Activity log with remove button
  const worklogList = document.getElementById('worklog-list');
  worklogList.innerHTML = logs.length ? logs.map((l, i) => `
    <div class="worklog-card">
      <span class="worklog-emoji">${categoryEmojis[selected] || '🛠️'}</span>
      <div class="worklog-info">
        <span><strong>${l.task}</strong></span>
        <span class="worklog-date">${l.date}</span>
      </div>
      <div class="worklog-info">
        ${l.hours ? `<span>Hours: <strong>${l.hours}</strong></span>` : ''}
        <span class="worklog-notes">${l.notes}</span>
      </div>
      <button class="remove-entry-btn" data-index="${i}" title="Remove entry">🗑️</button>
    </div>
  `).join('') : '<div style="color:var(--color-text-muted);">No activity logged yet.</div>';
  // Add remove event listeners
  document.querySelectorAll('.remove-entry-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-index'));
      if (!isNaN(idx)) {
        workLogs[selected].splice(idx, 1);
        updateMetricsAndWorklog();
      }
    };
  });
}
// Update on category change
const catSelect = document.getElementById('category');
if (catSelect) {
  catSelect.addEventListener('change', updateMetricsAndWorklog);
}
// Add entry form logic
const modalBg = document.getElementById('modal-bg');
const addEntryBtn = document.getElementById('add-entry-btn');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
addEntryBtn.onclick = () => { modalBg.classList.add('active'); };
modalClose.onclick = modalCancel.onclick = () => { modalBg.classList.remove('active'); };
document.getElementById('add-entry-form').onsubmit = function(e) {
  e.preventDefault();
  const catSelect = document.getElementById('category');
  const selected = catSelect.options[catSelect.selectedIndex].value;
  const date = document.getElementById('entry-date').value;
  const task = document.getElementById('entry-task').value;
  const notes = document.getElementById('entry-notes').value;
  const hours = parseFloat(document.getElementById('entry-hours').value) || undefined;
  if (!workLogs[selected]) workLogs[selected] = [];
  workLogs[selected].push({ date, task, notes, hours });
  modalBg.classList.remove('active');
  this.reset();
  updateMetricsAndWorklog();
};
// Initial load
updateMetricsAndWorklog();

// --- Firebase Auth & Firestore ---
const auth = firebase.auth();
const db = firebase.firestore();

// Sign Up
const signUpBtn = document.getElementById('sign-up-btn');
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const authMsg = document.getElementById('auth-message');

if (signUpBtn) {
  signUpBtn.onclick = function() {
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        authMsg.textContent = 'Signed up!';
        // Create user doc in Firestore
        db.collection('users').doc(userCredential.user.uid).set({
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .catch(error => {
        authMsg.textContent = error.message;
      });
  };
}
// Sign In
if (signInBtn) {
  signInBtn.onclick = function() {
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        authMsg.textContent = 'Signed in!';
      })
      .catch(error => {
        authMsg.textContent = error.message;
      });
  };
}
// Sign Out
if (signOutBtn) {
  signOutBtn.onclick = function() {
    auth.signOut();
  };
}
// Auth State Listener
if (auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      if (signOutBtn) signOutBtn.style.display = 'inline-block';
      if (authMsg) authMsg.textContent = `Logged in as ${user.email}`;
      // Example: Load user data from Firestore
      db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists) {
          // You can use doc.data() to prefill user info or settings
          // console.log('User data:', doc.data());
        }
      });
      // Optionally, show dashboard content
      const dashboardContent = document.getElementById('dashboard-content');
      if (dashboardContent) dashboardContent.style.display = 'block';
    } else {
      if (signOutBtn) signOutBtn.style.display = 'none';
      if (authMsg) authMsg.textContent = 'Not signed in.';
      // Optionally, hide dashboard content
      const dashboardContent = document.getElementById('dashboard-content');
      if (dashboardContent) dashboardContent.style.display = 'none';
    }
  });
} 