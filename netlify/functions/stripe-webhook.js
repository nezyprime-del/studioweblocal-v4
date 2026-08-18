// Fonction Netlify — reçoit la confirmation de paiement de Stripe (webhook),
// puis envoie à Adeline un email avec le détail complet de la commande
// (produits, goûts, formats, quantités, nom, téléphone, adresse du client)
// via EmailJS.

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const DEST_EMAIL = 'commerconadeline@gmail.com';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_mroeeb5';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_g9kinzb';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'sROgIAIK11m80LzKu';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; // requis pour un envoi hors navigateur

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Signature webhook invalide :', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'Ignoré (événement non pertinent)' };
  }

  const session = stripeEvent.data.object;

  try {
    // Récupère les lignes de commande + infos client complètes
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details']
    });

    const lineItems = fullSession.line_items.data;
    const customer = fullSession.customer_details;
    const shipping = fullSession.shipping_details || fullSession.customer_details;

    const lignesTexte = lineItems.map(li =>
      `- ${li.description} × ${li.quantity} — ${(li.amount_total / 100).toFixed(2).replace('.', ',')}€`
    ).join('\n');

    const total = (fullSession.amount_total / 100).toFixed(2).replace('.', ',');

    const adresse = shipping && shipping.address
      ? [
          shipping.address.line1,
          shipping.address.line2,
          `${shipping.address.postal_code} ${shipping.address.city}`,
          shipping.address.country
        ].filter(Boolean).join(', ')
      : 'Non renseignée';

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
      console.error('Variables EmailJS manquantes — email non envoyé.');
      return { statusCode: 500, body: 'Config EmailJS manquante' };
    }

    const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY, // autorise l'envoi depuis un serveur (pas un navigateur)
        template_params: {
          to_email: DEST_EMAIL,
          client_nom: customer.name || 'Non renseigné',
          client_email: customer.email || 'Non renseigné',
          client_telephone: customer.phone || 'Non renseigné',
          client_adresse: adresse,
          produits: lignesTexte,
          total: `${total}€`,
          session_id: session.id
        }
      })
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Erreur EmailJS :', errText);
      return { statusCode: 500, body: 'Erreur envoi email' };
    }

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Erreur traitement webhook' };
  }
};