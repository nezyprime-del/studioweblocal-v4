document.addEventListener('DOMContentLoaded', () => {

  // --- Icônes produit originales (SVG maison, aucun visuel Herbalife) ---
  const ICONS = {
    tub: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tubBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2A9D74"/>
          <stop offset="100%" stop-color="#125940"/>
        </linearGradient>
        <linearGradient id="tubLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF8A6B"/>
          <stop offset="100%" stop-color="#E6552E"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="103" rx="26" ry="5" fill="#000" opacity="0.08"/>
      <path d="M28 46h64l-5 50a8 8 0 0 1-8 7H41a8 8 0 0 1-8-7l-5-50Z" fill="url(#tubBody)"/>
      <path d="M28 46h64l-1.2 12H29.2L28 46Z" fill="#fff" opacity="0.14"/>
      <rect x="24" y="30" width="72" height="18" rx="9" fill="url(#tubLid)"/>
      <ellipse cx="60" cy="34" rx="30" ry="6" fill="#fff" opacity="0.25"/>
      <rect x="40" y="16" width="40" height="16" rx="6" fill="url(#tubLid)"/>
      <path d="M60 60c8 0 14 5 14 11s-6 11-14 11-14-5-14-11 6-11 14-11Z" fill="#fff" opacity="0.16"/>
      <path d="M42 60c1.5-4 5-6 5-6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.35"/>
    </svg>`,
    bottle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottleBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3CB48A"/>
          <stop offset="100%" stop-color="#1B7A5A"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="104" rx="20" ry="5" fill="#000" opacity="0.08"/>
      <path d="M50 18h20v14l6 8v54a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8V40l6-8V18Z" fill="url(#bottleBody)"/>
      <rect x="47" y="10" width="26" height="10" rx="4" fill="#FF6F52"/>
      <path d="M54 46h12M54 55h12M54 64h12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
      <path d="M44 42c2 20-2 42-2 42" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.18"/>
      <ellipse cx="52" cy="34" rx="10" ry="4" fill="#fff" opacity="0.25"/>
    </svg>`,
    sachet: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sachetBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FF8A6B"/>
          <stop offset="100%" stop-color="#E6552E"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="103" rx="24" ry="5" fill="#000" opacity="0.08"/>
      <path d="M32 30h56l6 14-8 52a7 7 0 0 1-7 6H41a7 7 0 0 1-7-6l-8-52 6-14Z" fill="url(#sachetBody)"/>
      <path d="M32 30h56l3 7H29l3-7Z" fill="#fff" opacity="0.2"/>
      <path d="M46 20c2-6 8-8 14-8s12 2 14 8" stroke="#E6552E" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M42 50h36M42 60h36M42 70h26" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
      <ellipse cx="46" cy="40" rx="8" ry="12" fill="#fff" opacity="0.16"/>
    </svg>`,
    bar: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="barBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2A9D74"/>
          <stop offset="100%" stop-color="#125940"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="90" rx="34" ry="6" fill="#000" opacity="0.08"/>
      <path d="M14 46 C10 40 10 34 16 30 L30 24h60l14 6c6 4 6 10 2 16l-6 10c-4 6-4 12 0 18l6 10c4 6 4 12-2 16l-14 6H30l-14-6c-6-4-6-10-2-16l6-10c4-6 4-12 0-18l-6-10Z" fill="url(#barBody)"/>
      <rect x="34" y="30" width="52" height="42" rx="8" fill="#fff" opacity="0.14"/>
      <path d="M44 40v22M56 40v22M68 40v22M80 40v22" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
    </svg>`
  };

  // --- Catalogue produits : groupé par produit, avec variantes goût/format ---
  // Chaque variante a son propre prix. Le libellé du produit (nom) reste générique,
  // le choix du goût/format se fait dans le menu déroulant.
  const PRODUITS_GROUPES = [
    {
      nom: "Formula 1 Nouvelle génération — Boisson Nutritionnelle",
      description: "Shake protéiné à préparer avec du lait ou une boisson végétale, pensé comme repas ou collation équilibrée.",
      composition: "Base de protéines de soja isolées, fibres (inuline, avoine), sucre (fructose), huile végétale, lécithine de soja, arômes, vitamines et minéraux ajoutés. Sans gluten. Allergène : soja (la composition précise varie légèrement selon le parfum).",
      icon: "tub",
      image: "assets/produit-formula1.jpg",
      variantes: [
        { label: "Café Latte — 550 g", prix: 56.32 },
        { label: "Chocolat dubai style — 500 g", prix: 56.32 },
        { label: "Vanille Onctueuse — 550 g", prix: 56.32 },
        { label: "Vanille Onctueuse — 780 g", prix: 70.99 },
        { label: "Cookie crunch — 550 g", prix: 56.32 },
        { label: "Chocolat gourmand — 550 g", prix: 56.32 },
        { label: "Crème de banane — 550 g", prix: 56.32 },
        { label: "Délice de fraise — 550 g", prix: 56.32 },
        { label: "Duo menthe-chocolat — 550 g", prix: 56.32 },
        { label: "Édition Limitée Fraise et pastèque — 550 g", prix: 56.32 },
        { label: "Sans soja/lactose/gluten Framboise & chocolat blanc — 500 g", prix: 56.32 }
      ]
    },
    {
      nom: "Sachets Formula 1 Nouvelle génération",
      description: "Même shake protéiné, en sachets individuels pratiques à emporter ou à tester.",
      composition: "Même base que le Formula 1 en pot (protéines de soja, fibres, arômes, vitamines) — composition exacte à confirmer sur l'emballage.",
      icon: "sachet",
      image: "assets/produit-sachets-formula1.jpg",
      variantes: [
        { label: "Chocolat gourmand — lot de 7 × 26 g", prix: 23.47 }
      ]
    },
    {
      nom: "Boisson instantanée à base de thé et d'extraits végétaux",
      description: "Boisson chaude ou froide à base de thé, à préparer simplement dans de l'eau.",
      composition: "Base de maltodextrine et extraits de thé (thé vert, thé orange pekoe), caféine naturelle, édulcorant d'origine naturelle (stévia), arôme naturel, extraits de plantes selon le parfum (hibiscus, cardamome, mauve). Sans gluten.",
      icon: "sachet",
      image: "assets/produit-the-instantane.jpg",
      variantes: [
        { label: "Classique — 51 g", prix: 36.38 },
        { label: "Classique — 102 g", prix: 65.24 },
        { label: "Mangue fruit du dragon — 102 g", prix: 65.24 },
        { label: "Citron — 51 g", prix: 36.38 },
        { label: "Framboise — 51 g", prix: 36.38 },
        { label: "Pêche — 51 g", prix: 36.38 }
      ]
    },
    {
      nom: "Mélange pour boisson protéinée",
      description: "Complément protéiné à ajouter à un shake ou une boisson pour augmenter l'apport en protéines.",
      composition: "Base de protéines de soja isolées, maltodextrine, caséinate de calcium (dérivé du lait) pour la version non-vegan, huile végétale en poudre, arômes, édulcorant, vitamines et minéraux. Allergènes : soja, lait (sauf version Vegan, sans lait).",
      icon: "tub",
      image: "assets/produit-melange-proteine.jpg",
      variantes: [
        { label: "Vanille — 588 g", prix: 66.49 },
        { label: "Vanille (Vegan) — 560 g", prix: 63.34 },
        { label: "Vanille (Vegan) — sachets 7 × 28 g", prix: 27.71 },
        { label: "Préparation à cuisiner, Saveur Neutre — 480 g", prix: 63.34 }
      ]
    },
    {
      nom: "Fibre Concentrate",
      description: "Concentré liquide à diluer dans l'eau, pour un apport quotidien en fibres.",
      composition: "Base de fibre soluble (Nutriose), vitamine C ajoutée, calcium, édulcorant d'origine naturelle (stévia), arôme naturel orange et baies de goji. Sans sucres ajoutés.",
      icon: "bottle",
      image: "assets/produit-fibre-concentrate.jpg",
      variantes: [
        { label: "Orange douce & baies de goji — 500 ml", prix: 58.68 }
      ]
    },
    {
      nom: "Boisson multi-fibres",
      description: "Boisson en poudre à base de fibres, à préparer dans de l'eau.",
      composition: "6 sources naturelles de fibres (pomme, avoine, maïs, agrumes, chicorée, soja), fibres solubles et insolubles. Sans sucre ajouté, sans édulcorant artificiel. Allergènes : soja, avoine (gluten).",
      icon: "bottle",
      image: "assets/produit-multi-fibres.jpg",
      variantes: [
        { label: "Pomme — 204 g", prix: 38.53 }
      ]
    },
    {
      nom: "Boisson Concentrée à l'Aloe Vera",
      description: "Concentré à diluer dans l'eau, à base d'aloe vera.",
      composition: "Base d'eau et de jus d'aloe vera purifié (feuille entière, environ 40%), correcteur d'acidité, conservateurs, édulcorant, arôme naturel selon le parfum (mangue, agrumes). Sans arôme ni colorant artificiel.",
      icon: "bottle",
      image: "assets/produit-aloe-vera.jpg",
      variantes: [
        { label: "Mangue — 473 ml", prix: 48.25 },
        { label: "Original — 473 ml", prix: 48.25 },
        { label: "Mangue — 1,892 litre", prix: 174.56 }
      ]
    },
    {
      nom: "AloeMax",
      description: "Concentré à base d'aloe vera, à diluer dans l'eau.",
      composition: "Concentré d'aloe vera à haute teneur (~97%) selon les indications du fabricant, sans arôme ni colorant artificiel — composition exacte à confirmer sur l'emballage.",
      icon: "bottle",
      image: "assets/produit-aloemax.jpg",
      variantes: [
        { label: "473 ml", prix: 55.13 }
      ]
    },
    {
      nom: "High Protein Iced Coffee Latte Macchiato",
      description: "Boisson café protéinée en poudre, à préparer avec de l'eau ou du lait.",
      composition: "Composition à confirmer sur l'emballage.",
      icon: "bottle",
      image: "assets/produit-iced-coffee.jpg",
      variantes: [
        { label: "308 g", prix: 65.22 }
      ]
    },
    {
      nom: "Barres aux Protéines",
      description: "Barre protéinée à emporter, en collation.",
      composition: "Concentré de protéines de lait, enrobage chocolat, pâte d'arachide (selon le parfum), sucre, lécithine de soja. Allergènes : lait, arachide, soja.",
      icon: "bar",
      image: "assets/produit-barres-proteinees.jpg",
      variantes: [
        { label: "Vanille Amandes — 14 barres de 35 g", prix: 24.84 },
        { label: "Citron — 14 barres de 35 g", prix: 24.84 }
      ]
    },
    {
      nom: "Chips Protéinées",
      description: "Chips protéinées croustillantes, en collation salée.",
      composition: "Composition à confirmer sur l'emballage.",
      icon: "bar",
      image: "assets/produit-chips-proteinees.jpg",
      variantes: [
        { label: "Nature — 10 sachets de 30 g", prix: 24.26 },
        { label: "Sour Cream & Onion — 10 sachets de 30 g", prix: 24.26 }
      ]
    }
  ];

  function formatPrix(n) {
    return n.toFixed(2).replace('.', ',') + '€';
  }

  // --- Panier (localStorage) ---
  const PANIER_KEY = 'ath_panier';
  function getPanier() {
    try { return JSON.parse(localStorage.getItem(PANIER_KEY)) || []; }
    catch (e) { return []; }
  }
  function setPanier(panier) {
    localStorage.setItem(PANIER_KEY, JSON.stringify(panier));
    updateCartBadge();
  }
  function ajouterAuPanier(produitNom, variante) {
    const panier = getPanier();
    const existant = panier.find(l => l.produit === produitNom && l.variante === variante.label);
    if (existant) {
      existant.qty += 1;
    } else {
      panier.push({ produit: produitNom, variante: variante.label, prix: variante.prix, qty: 1 });
    }
    setPanier(panier);
    ouvrirPanier();
  }
  function retirerDuPanier(index) {
    const panier = getPanier();
    panier.splice(index, 1);
    setPanier(panier);
    renderPanier();
  }
  function changerQty(index, delta) {
    const panier = getPanier();
    if (!panier[index]) return;
    panier[index].qty += delta;
    if (panier[index].qty <= 0) panier.splice(index, 1);
    setPanier(panier);
    renderPanier();
  }
  function totalPanier() {
    return getPanier().reduce((sum, l) => sum + l.prix * l.qty, 0);
  }
  function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = getPanier().reduce((sum, l) => sum + l.qty, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  function renderPanier() {
    const list = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!list || !totalEl) return;
    const panier = getPanier();
    if (!panier.length) {
      list.innerHTML = '<p class="cart__empty">Votre panier est vide.</p>';
    } else {
      list.innerHTML = panier.map((l, i) => `
        <div class="cart__item">
          <div class="cart__item-info">
            <p class="cart__item-name">${l.produit}</p>
            <p class="cart__item-variant">${l.variante}</p>
          </div>
          <div class="cart__item-qty">
            <button type="button" data-qty-minus="${i}" aria-label="Retirer un">−</button>
            <span>${l.qty}</span>
            <button type="button" data-qty-plus="${i}" aria-label="Ajouter un">+</button>
          </div>
          <p class="cart__item-price">${formatPrix(l.prix * l.qty)}</p>
          <button type="button" class="cart__item-remove" data-remove="${i}" aria-label="Supprimer">×</button>
        </div>
      `).join('');
    }
    totalEl.textContent = formatPrix(totalPanier());

    list.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => retirerDuPanier(parseInt(btn.dataset.remove, 10)));
    });
    list.querySelectorAll('[data-qty-plus]').forEach(btn => {
      btn.addEventListener('click', () => changerQty(parseInt(btn.dataset.qtyPlus, 10), 1));
    });
    list.querySelectorAll('[data-qty-minus]').forEach(btn => {
      btn.addEventListener('click', () => changerQty(parseInt(btn.dataset.qtyMinus, 10), -1));
    });
  }

  function ouvrirPanier() {
    const panel = document.getElementById('cartPanel');
    if (!panel) return;
    renderPanier();
    panel.classList.add('is-open');
  }
  function fermerPanier() {
    const panel = document.getElementById('cartPanel');
    if (panel) panel.classList.remove('is-open');
  }

  function injecterPanierUI() {
    if (document.getElementById('cartButton')) return;

    const btn = document.createElement('button');
    btn.id = 'cartButton';
    btn.className = 'cart-fab';
    btn.setAttribute('aria-label', 'Voir le panier');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <span id="cartBadge" class="cart-fab__badge">0</span>
    `;
    btn.addEventListener('click', ouvrirPanier);
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'cartPanel';
    panel.className = 'cart-panel';
    panel.innerHTML = `
      <div class="cart-panel__overlay" data-close-cart></div>
      <div class="cart-panel__content">
        <div class="cart-panel__header">
          <p class="cart-panel__title">Votre panier</p>
          <button type="button" class="cart-panel__close" data-close-cart aria-label="Fermer">×</button>
        </div>
        <div id="cartItems" class="cart-panel__items"></div>
        <div class="cart-panel__footer">
          <div class="cart-panel__total">
            <span>Total</span>
            <span id="cartTotal">0,00€</span>
          </div>
          <a href="#" id="cartCheckout" class="btn btn--primary btn--block">Passer commande</a>
          <p class="cart-panel__note">Adeline vous recontacte pour finaliser le paiement et la livraison.</p>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelectorAll('[data-close-cart]').forEach(el => el.addEventListener('click', fermerPanier));

    document.getElementById('cartCheckout').addEventListener('click', (e) => {
      e.preventDefault();
      const panier = getPanier();
      if (!panier.length) return;
      const lignes = panier.map(l => `- ${l.produit} (${l.variante}) x${l.qty} — ${formatPrix(l.prix * l.qty)}`).join('\n');
      const total = formatPrix(totalPanier());
      const sujet = 'Commande via le site — Ath Nutrition';
      const corps = `Bonjour Adeline,\n\nJe souhaite commander :\n${lignes}\n\nTotal : ${total}\n\nMerci de me recontacter pour finaliser.`;
      window.location.href = `mailto:commerconadeline@gmail.com?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
    });

    updateCartBadge();
  }

  function renderProduits() {
    const grids = document.querySelectorAll('.produits__grid');
    if (!grids.length) return;

    const html = PRODUITS_GROUPES.map((groupe, gi) => `
      <div class="card">
        <div class="card__media card__media--icon" aria-hidden="true">
          <img src="${groupe.image}" alt="${groupe.nom}" class="card__media-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <span class="card__media-fallback">${ICONS[groupe.icon] || ICONS.tub}</span>
        </div>
        <div class="card__body">
          <p class="card__title">${groupe.nom}</p>
          <p class="card__desc">${groupe.description}</p>
          <p class="card__composition"><strong>Composition :</strong> ${groupe.composition || 'À confirmer sur l\'emballage.'}</p>
          <select class="variant-select" data-group="${gi}">
            ${groupe.variantes.map((v, vi) => `<option value="${vi}">${v.label} — ${formatPrix(v.prix)}</option>`).join('')}
          </select>
          <button type="button" class="btn btn--primary btn--block" data-add-group="${gi}">Ajouter au panier</button>
          <p class="card__note">Paiement sécurisé — via Stripe (bientôt), commande relayée par Adeline</p>
        </div>
      </div>
    `).join('');

    grids.forEach(grid => { grid.innerHTML = html; });

    document.querySelectorAll('[data-add-group]').forEach(btn => {
      btn.addEventListener('click', () => {
        const gi = parseInt(btn.dataset.addGroup, 10);
        const select = document.querySelector(`select[data-group="${gi}"]`);
        const vi = parseInt(select.value, 10);
        const groupe = PRODUITS_GROUPES[gi];
        ajouterAuPanier(groupe.nom, groupe.variantes[vi]);
      });
    });
  }

  injecterPanierUI();
  renderProduits();

  // --- Nav mobile ---
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Ombre du header au scroll ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  // --- Cascade sur les groupes de cartes ---
  document.querySelectorAll('.pillars, .steps, .faq__list').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  // --- Reveal au scroll ---
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            observer.unobserve(el);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                el.classList.add('is-visible');
              });
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  // --- Photos "transformation" du hero (fondu enchaîné automatique) ---
  const transformImgs = Array.from(document.querySelectorAll('.hero__transform-img'));
  if (transformImgs.length > 1) {
    let activeIndex = transformImgs.findIndex(img => img.classList.contains('is-active'));
    if (activeIndex === -1) activeIndex = 0;

    setInterval(() => {
      const valid = transformImgs.filter(img => img.style.display !== 'none');
      if (valid.length < 2) return;

      transformImgs[activeIndex].classList.remove('is-active');
      let next;
      do {
        activeIndex = (activeIndex + 1) % transformImgs.length;
        next = transformImgs[activeIndex];
      } while (next.style.display === 'none');
      next.classList.add('is-active');
    }, 3000);
  }

  // --- Formulaire de contact (mailto) ---
  const DEST_EMAIL = 'commerconadeline@gmail.com';
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nom = form.nom.value.trim();
      const email = form.email.value.trim();
      const telephone = form.telephone.value.trim();
      const message = form.message.value.trim();
      const subject = `Question via le site — ${nom}`;
      const body = [
        `Nom : ${nom}`,
        `Email : ${email}`,
        `Téléphone : ${telephone || '—'}`,
        `Message : ${message || '—'}`
      ].join('\n');
      window.location.href = `mailto:${DEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Votre messagerie va s\'ouvrir avec le message pré-rempli.';
    });
  }

  // --- Année footer ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});