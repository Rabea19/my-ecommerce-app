import { contactLinks } from '../config/contact';
const channels = ['Facebook', 'Instagram', 'LinkedIn', 'WhatsApp'];
export default function SocialLinks() {
 return <div className="market-socials" aria-label="Social channels">{channels.map(label => {
  const link = contactLinks.find(item => item.label === label);
  const icon = label === 'LinkedIn' ? <span className="market-linkedin" aria-hidden="true">in</span> : <img src={`/images/social/${label.toLowerCase()}.svg`} alt="" width="22" height="22" />;
  return link ? <a key={label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>{icon}</a> : <span key={label} className="market-social-unavailable" aria-label={`${label}: not available yet`}>{icon}</span>;
 })}</div>;
}
