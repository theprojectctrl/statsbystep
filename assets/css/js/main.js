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

// Add category-based dashboard theming
function updateDashboardTheme() {
  const catSelect = document.getElementById('category');
  if (!catSelect) return;
  const selectedOption = catSelect.options[catSelect.selectedIndex];
  const color = selectedOption.getAttribute('data-color') || '#3b82f6';
  const emoji = selectedOption.getAttribute('data-emoji') || '';
  // Calculate darker accent for hover
  function darken(hex, amt = 30) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    let num = parseInt(c, 16);
    let r = Math.max(0, (num >> 16) - amt), g = Math.max(0, ((num >> 8) & 0x00FF) - amt), b = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }
  const accent = color;
  const accentDark = darken(color, 40);
  const accentShadow = color + '33';
  const gradient = `linear-gradient(135deg, ${color}1A 0%, #fff 100%)`;
  // Set CSS variables for theme
  const section = document.querySelector('.section');
  if (section) {
    section.classList.add('category-theme');
    section.style.setProperty('--cat-accent', accent);
    section.style.setProperty('--cat-accent-dark', accentDark);
    section.style.setProperty('--cat-accent-shadow', accentShadow);
    section.style.setProperty('--cat-gradient', gradient);
    // Remove any previous animated bg
    let animBg = section.querySelector('.category-anim-bg');
    if (animBg) animBg.remove();
    // Inject animated shapes
    animBg = document.createElement('div');
    animBg.className = 'category-anim-bg';
    animBg.innerHTML = `
      <div class="category-anim-shape shape1"></div>
      <div class="category-anim-shape shape2"></div>
      <div class="category-anim-shape shape3"></div>
    `;
    section.prepend(animBg);
  }
  // Accent color for metrics (for dynamic updates)
  document.querySelectorAll('.metric').forEach(m => {
    m.style.setProperty('color', accent);
    m.style.setProperty('borderTop', `4px solid ${accent}`);
  });
  // Optionally update h1 or icon
  const h1 = section ? section.querySelector('h1') : null;
  if (h1 && emoji) {
    h1.innerHTML = `${emoji} Welcome`;
  } else if (h1) {
    h1.textContent = 'Welcome';
  }
}
// Listen for category changes
const catSelect = document.getElementById('category');
if (catSelect) {
  catSelect.addEventListener('change', updateDashboardTheme);
  // Initial theme
  updateDashboardTheme();
}

// === Export Buttons Logic ===
// Download metrics as image
const downloadImageBtn = document.getElementById('download-metrics-image');
if (downloadImageBtn) {
  downloadImageBtn.addEventListener('click', () => {
    const exportArea = document.getElementById('dashboard-export-area');
    if (!exportArea) return;
    html2canvas(exportArea, { backgroundColor: null }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'dashboard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });
}
// Download metrics and work log as CSV
const downloadCsvBtn = document.getElementById('download-metrics-csv');
if (downloadCsvBtn) {
  downloadCsvBtn.addEventListener('click', () => {
    const catSelect = document.getElementById('category');
    if (!catSelect) return;
    const selected = catSelect.options[catSelect.selectedIndex].value;
    // Metrics
    let csv = 'Metrics\n';
    const metricsList = document.querySelectorAll('.metric');
    metricsList.forEach(m => {
      const label = m.querySelector('.metric-label')?.textContent || '';
      const value = m.querySelector('span:last-child')?.textContent || '';
      csv += `"${label}","${value}"\n`;
    });
    // Work Log
    csv += '\nWork Log\nDate,Task,Hours,Notes\n';
    if (typeof workLogs !== 'undefined' && workLogs[selected]) {
      workLogs[selected].forEach(l => {
        csv += `"${l.date}","${l.task}","${l.hours}","${l.notes?.replace(/"/g, '""') || ''}"\n`;
      });
    }
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dashboard.csv';
    link.click();
  });
} 