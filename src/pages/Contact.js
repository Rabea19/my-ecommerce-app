import { Link } from "react-router-dom";
import ContactLinks from "../components/ContactLinks";
import { contactLinks } from "../config/contact";
export default function Contact() {
 return <main className="wrap max-w-3xl py-14"><p className="eyebrow mb-4">Stay connected</p><h1 className="heading">Contact Simple Market</h1>
 <section className="panel mt-8"><h2 className="font-display text-2xl mb-4">Find us online</h2>
 {contactLinks.length ? <><p className="text-ink/60 mb-6">Choose one of our official channels below.</p><ContactLinks/></> : <p className="text-ink/60">Our contact channels are not available yet. Please check back soon.</p>}
 </section><section className="panel mt-6"><h2 className="font-display text-2xl mb-4">Looking for your order?</h2><p className="mb-5 text-ink/60">Sign in to view your orders and their current status.</p><Link className="btn-outline" to="/orders">View orders</Link></section></main>;
}
