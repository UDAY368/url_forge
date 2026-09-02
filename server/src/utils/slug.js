const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const defaultLength = 7;

export function generateSlug(length = defaultLength) {
  let slug = '';

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    slug += alphabet[randomIndex];
  }

  return slug;
}
