export const ADMIN_EMAILS = [
  'jibanjyotisahoo098@gmail.com'
//   'admin@musify.com'
];

export const isAdmin = (userEmail) => {
  return ADMIN_EMAILS.includes(userEmail);
};