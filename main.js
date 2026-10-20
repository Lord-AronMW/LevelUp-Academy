(function(){
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg-main:#121212;
      --bg-card:#1e1e1e;
      --text-primary:#e0e0e0;
      --text-secondary:#b0b0b0;
      --accent:#bb86fc;
      --border:#333;
    }
    body {
      background-color: var(--bg-main) !important;
      color: var(--text-primary) !important;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
    }
    a { color: var(--accent) !important; }
    a:hover { opacity:0.8; }
    header, footer, nav, section, article, aside, main {
      background-color: var(--bg-card) !important;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
    }
    button, input, textarea, select {
      background-color: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 0.5rem;
    }
    button:hover, input:hover, textarea:hover, select:hover {
      border-color: var(--accent);
    }
    ::selection {
      background: var(--accent);
      color: #000;
    }
  `;
  document.head.appendChild(style);

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Toggle Dark Mode';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '20px';
  toggleBtn.style.right = '20px';
  toggleBtn.style.zIndex = '1000';
  toggleBtn.style.background = 'var(--accent)';
  toggleBtn.style.color = '#000';
  toggleBtn.style.border = 'none';
  toggleBtn.style.borderRadius = '4px';
  toggleBtn.style.padding = '0.5rem 1rem';
  toggleBtn.style.cursor = 'pointer';
  document.body.appendChild(toggleBtn);

  let dark = true;
  toggleBtn.addEventListener('click', () => {
    dark = !dark;
    if (dark) {
      document.documentElement.style.setProperty('--bg-main','#121212');
      document.documentElement.style.setProperty('--bg-card','#1e1e1e');
      document.documentElement.style.setProperty('--text-primary','#e0e0e0');
      document.documentElement.style.setProperty('--accent','#bb86fc');
    } else {
      document.documentElement.style.setProperty('--bg-main','#ffffff');
      document.documentElement.style.setProperty('--bg-card','#f5f5f5');
      document.documentElement.style.setProperty('--text-primary','#212121');
      document.documentElement.style.setProperty('--accent','#6200ee');
    }
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  document.body.style.fontFamily = '"Roboto", sans-serif';

  const navbar = document.querySelector('nav');
  if (navbar) {
    navbar.classList.add('enhanced-navbar');
    const style = document.createElement('style');
    style.textContent = `.enhanced-navbar{display:flex;justify-content:space-between;align-items:center;background:#333;color:#fff;padding:0.5rem 1rem;}
    .enhanced-navbar a{color:#fff;text-decoration:none;margin:0 0.5rem;padding:0.3rem 0.6rem;border-radius:4px;}
    .enhanced-navbar a.active,.enhanced-navbar a:hover{background:#555;}`;
    document.head.appendChild(style);
  }

  const contentContainer = document.getElementById('content');
  const navLinks = document.querySelectorAll('nav a');

  function setActiveLink(targetHref) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === targetHref);
    });
  }

  async function loadPage(url, pushState = true) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const html = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.getElementById('content');
      if (contentContainer && newContent) {
        contentContainer.innerHTML = newContent.innerHTML;
        document.title = doc.title || document.title;
        setActiveLink(url);
        if (pushState) history.pushState({url}, '', url);
      }
    } catch (e) {
      console.error('Page load failed', e);
      if (contentContainer) contentContainer.innerHTML = '<p>Sorry, the page could not be loaded.</p>';
    }
  }

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        loadPage(href);
      });
    }
  });

  window.addEventListener('popstate', e => {
    const url = e.state && e.state.url ? e.state.url : location.pathname.replace(/^\//, '');
    loadPage(url, false);
  });

  const initialPath = location.pathname.replace(/^\//, '');
  if (initialPath) {
    loadPage(initialPath, false);
  }
});