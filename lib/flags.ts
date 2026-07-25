// NEXT_PUBLIC_* é congelada em build time.
// Alterar essa env em .env.local exige restart do `next dev` para propagar.
export const V73_ENABLED = process.env.NEXT_PUBLIC_V73_ENABLED === '1';
