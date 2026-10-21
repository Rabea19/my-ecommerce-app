// Configure official store destinations before enabling these channels.
const definitions = [
 ['WhatsApp', process.env.REACT_APP_WHATSAPP_URL, ['wa.me', 'api.whatsapp.com']],
 ['Instagram', process.env.REACT_APP_INSTAGRAM_URL, ['instagram.com', 'www.instagram.com']],
 ['Facebook', process.env.REACT_APP_FACEBOOK_URL, ['facebook.com', 'www.facebook.com']],
 ['LinkedIn', process.env.REACT_APP_LINKEDIN_URL, ['linkedin.com', 'www.linkedin.com']],
];
export const contactLinks = definitions.flatMap(([label, value, hosts]) => {
 try { const url = new URL(value); return url.protocol === 'https:' && hosts.includes(url.hostname) && !url.username && !url.password ? [{label, href:url.href}] : []; } catch { return []; }
});
