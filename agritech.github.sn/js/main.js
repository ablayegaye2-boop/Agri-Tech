// ================================
// AGRI·TECH — main.js
// ================================

// === MENU MOBILE ===
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const toggle = document.querySelector('.nav-toggle');
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  }
  
  // Fermer le menu en cliquant ailleurs
  document.addEventListener('click', function(e) {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
    }
  });
  
  // Fermer le menu quand on clique sur un lien
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.remove('open');
      document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
    });
  });
  
  // === ANIMATION AU DÉFILEMENT ===
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.card, .mois-card, .info-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 12px 24px rgba(26, 71, 49, 0.18)';
      card.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.transform = '';
    });
  });
  
  // === BOUTON RETOUR EN HAUT ===
  const btnHaut = document.createElement('button');
  btnHaut.id = 'btn-haut';
  btnHaut.innerHTML = '↑';
  btnHaut.title = 'Retour en haut';
  btnHaut.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--vert-moyen);
    color: white;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: background 0.2s;
  `;
  btnHaut.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btnHaut.addEventListener('mouseover', () => btnHaut.style.background = 'var(--vert-fonce)');
  btnHaut.addEventListener('mouseout', () => btnHaut.style.background = 'var(--vert-moyen)');
  document.body.appendChild(btnHaut);
  
  window.addEventListener('scroll', () => {
    btnHaut.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  
  // === ANNÉE DYNAMIQUE DANS LE FOOTER ===
  document.querySelectorAll('footer p').forEach(p => {
    if (p.textContent.includes('2024')) {
      p.textContent = p.textContent.replace('2024', new Date().getFullYear());
    }
  });
  
  // === MESSAGE DE BIENVENUE CONSOLE ===
  console.log('%c🌱 AGRI·TECH', 'color:#4caf7d; font-size:1.5rem; font-weight:bold;');
  console.log('%cSite développé pour le projet de fin d\'études', 'color:#1a4731;');
