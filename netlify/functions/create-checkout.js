// Fonction Netlify — crée une session de paiement Stripe à partir du panier envoyé par le site.
// Le prix n'est JAMAIS pris depuis le navigateur : on le recalcule ici, à partir de PRODUITS_GROUPES,
// pour qu'un client ne puisse pas modifier le prix affiché avant de payer.

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ Cette table doit rester identique à PRODUITS_GROUPES dans script.js
// (mêmes index gi/vi, mêmes prix). Si tu ajoutes/modifies un produit sur le site,
// répercute le changement ici aussi.
const PRODUITS_GROUPES = [
  {
    nom: "Formula 1 Nouvelle génération — Boisson Nutritionnelle",
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
    variantes: [
      { label: "Chocolat gourmand — lot de 7 × 26 g", prix: 23.47 }
    ]
  },
  {
    nom: "Boisson instantanée à base de thé et d'extraits végétaux",
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
    variantes: [
      { label: "Vanille — 588 g", prix: 66.49 },
      { label: "Vanille (Vegan) — 560 g", prix: 63.34 },
      { label: "Vanille (Vegan) — sachets 7 × 28 g", prix: 27.71 },
      { label: "Préparation à cuisiner, Saveur Neutre — 480 g", prix: 63.34 }
    ]
  },
  {
    nom: "Fibre Concentrate",
    variantes: [
      { label: "Orange douce & baies de goji — 500 ml", prix: 58.68 }
    ]
  },
  {
    nom: "Boisson multi-fibres",
    variantes: [
      { label: "Pomme — 204 g", prix: 38.53 }
    ]
  },
  {
    nom: "Boisson Concentrée à l'Aloe Vera",
    variantes: [
      { label: "Mangue — 473 ml", prix: 48.25 },
      { label: "Original — 473 ml", prix: 48.25 },
      { label: "Mangue — 1,892 litre", prix: 174.56 }
    ]
  },
  {
    nom: "AloeMax",
    variantes: [
      { label: "473 ml", prix: 55.13 }
    ]
  },
  {
    nom: "High Protein Iced Coffee Latte Macchiato",
    variantes: [
      { label: "308 g", prix: 65.22 }
    ]
  },
  {
    nom: "Barres aux Protéines",
    variantes: [
      { label: "Vanille Amandes — 14 barres de 35 g", prix: 24.84 },
      { label: "Citron — 14 barres de 35 g", prix: 24.84 }
    ]
  },
  {
    nom: "Chips Protéinées",
    variantes: [
      { label: "Nature — 10 sachets de 30 g", prix: 24.26 },
      { label: "Sour Cream & Onion — 10 sachets de 30 g", prix: 24.26 }
    ]
  }
];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body || '{}');

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Panier vide' }) };
    }

    const line_items = items.map(({ gi, vi, qty }) => {
      const groupe = PRODUITS_GROUPES[gi];
      const variante = groupe && groupe.variantes[vi];
      if (!groupe || !variante) {
        throw new Error(`Produit invalide (gi=${gi}, vi=${vi})`);
      }
      const quantity = Math.max(1, Math.min(20, parseInt(qty, 10) || 1));
      return {
        quantity,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(variante.prix * 100), // prix recalculé ici, jamais depuis le client
          product_data: {
            name: `${groupe.nom} — ${variante.label}`
          }
        }
      };
    });

    const siteUrl = process.env.URL || `https://${event.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: { allowed_countries: ['FR'] },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      success_url: `${siteUrl}/commande-confirmee.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/index.html#produits`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};