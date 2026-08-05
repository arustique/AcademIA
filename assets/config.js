// Configuration publique du site AcademIA.
// L'URL et la clé "anon" Supabase sont conçues pour être publiques (visibles dans le
// code source du site) — c'est la sécurité côté base de données (Row Level Security)
// qui protège réellement le contenu payant, pas le secret de cette clé.
// Ne JAMAIS mettre ici la clé "service_role".

window.ACADEMIA_CONFIG = {
  SUPABASE_URL: "https://chyboeyrtoqvwgztevke.supabase.co/rest/v1/",
  SUPABASE_ANON_KEY: "sb_publishable_-_sQslwKnyrUZHYxEKINkA_JNEqx1Ri",
  CHARIOW_CHECKOUT_URL: "https://chariow.com/VOTRE-LIEN-DE-PAIEMENT",
  PRICE_LABEL: "10 000 FCFA",
};
