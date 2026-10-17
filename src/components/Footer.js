import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-plum/10 bg-lilac">
      <div className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Link to="/" className="font-display text-3xl text-plum">
            simple market.
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-ink/65">
            Discover the pieces that fit your life. From everyday essentials to
            something a little special.
          </p>
        </div>
        <div>
          <h2 className="eyebrow mb-5">Explore</h2>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/collection">All collections</Link>
            <Link to="/collection?category=home">For your home</Link>
            <Link to="/collection?category=crochet">Crochet by Hager</Link>
          </div>
        </div>
        <div>
          <h2 className="eyebrow mb-5">Your market</h2>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/cart">Shopping bag</Link>
            <Link to="/orders">Your orders</Link>
            <Link to="/signin">Your account</Link>
          </div>
        </div>
      </div>
      <div className="wrap border-t border-plum/10 py-5 text-xs text-ink/60">
        © {new Date().getFullYear()} Simple Market · All prices in EGP
      </div>
    </footer>
  );
}
