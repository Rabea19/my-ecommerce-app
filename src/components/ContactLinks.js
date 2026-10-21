import { contactLinks } from "../config/contact";
export default function ContactLinks() {
 return <div className="flex flex-wrap gap-3">{contactLinks.map(({label,href})=><a className="btn-outline" key={label} href={href} target="_blank" rel="noopener noreferrer">{label}<span className="sr-only"> (opens in a new tab)</span></a>)}</div>;
}
