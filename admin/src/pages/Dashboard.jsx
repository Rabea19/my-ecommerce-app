import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecords, money, date } from '../lib/admin';
import { overview } from '../lib/overview';
import { ArrowRight, ShoppingCart, Package, Users, ChartNoAxesColumnIncreasing, Plus, CalendarDays, RefreshCw } from 'lucide-react';
import { State, Status } from '../components/AdminUI';
import './Dashboard.css';
export default function Dashboard() {
  const orders = useRecords('orders'), products = useRecords('products'), users = useRecords('users');
  const [period, setPeriod] = useState('month');
  const loading = orders.loading || products.loading || users.loading;
  const error = orders.error || products.error || users.error;
  const refresh = () => { orders.refresh(); products.refresh(); users.refresh(); };
  const info = overview(orders.data, products.data, users.data, period);
  const names = new Map(users.data.map(u => [String(u.id), u.name || u.email]));
  const stats = [
    ['Completed revenue', money(info.revenue), ChartNoAxesColumnIncreasing, 'Completed orders in selected period'],
    ['Orders', info.selected.length, ShoppingCart, 'In selected period'],
    ['Products', products.data.length, Package, 'Current catalog'],
    ['Customers', info.customers, Users, 'Registered accounts'],
  ];
  return <div className="store-overview">
    <div className="overview-heading">
      <div><h1>Store overview</h1><p>Your store at a glance</p></div>
      <div className="overview-controls">
        <label className="overview-period"><CalendarDays size={18}/><select aria-label="Overview period" value={period} onChange={e => setPeriod(e.target.value)}><option value="today">Today</option><option value="week">Last 7 days</option><option value="month">This month</option><option value="all">All time</option></select></label>
        <button className="btn-soft" onClick={refresh} disabled={loading} aria-label="Refresh overview"><RefreshCw size={17}/></button>
        <Link className="btn" to="/products?new=1"><Plus size={18}/>Add product</Link>
      </div>
    </div>
    <State loading={loading} error={error} onRetry={refresh}/>
    {!loading && !error && <>
      <section className="overview-stats" aria-label="Store statistics">{stats.map(([label,value,Icon,note]) => <article className="overview-card" key={label}><div className="overview-stat-main"><span className="overview-stat-icon"><Icon size={25}/></span><div><h2>{label}</h2><strong>{value}</strong></div></div><p>{note}</p></article>)}</section>
      <section className="overview-attention" aria-label="Needs attention">
        <Link to="/orders?status=pending"><span className={info.pending.length ? 'attention-dot' : 'attention-dot clear'}/><div><strong>{info.pending.length} orders awaiting action</strong><p>Pending orders across all dates.</p></div><span className="overview-view">View <ArrowRight size={16}/></span></Link>
        <Link to="/products?stock=low"><span className={info.low.length ? 'attention-dot' : 'attention-dot clear'}/><div><strong>{info.low.length} products low in stock</strong><p>Products with fewer than 5 units remaining.</p></div><span className="overview-view">View <ArrowRight size={16}/></span></Link>
      </section>
      <div className="overview-content">
        <section className="overview-card overview-orders"><div className="overview-section-heading"><h2>Recent orders</h2><Link to="/orders">View all <ArrowRight size={16}/></Link></div>
          <div className="overview-table-wrap"><table><thead><tr>{['Order','Customer','Date','Total','Status','Action'].map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{info.selected.slice(0,6).map(o=><tr key={o.id}><td><Link to={'/orders/'+o.id}>#{o.id.slice(-8)}</Link></td><td>{names.get(String(o.user_id)) || 'Unavailable customer'}</td><td>{date(o.created_at)}</td><td>{money(o.total_price)}</td><td><Status value={o.status}/></td><td><Link className="overview-view" aria-label={'View order '+o.id} to={'/orders/'+o.id}>View <ArrowRight size={15}/></Link></td></tr>)}</tbody></table></div>
          {!info.selected.length && <p className="overview-empty">No orders in this period. Choose another period to see more.</p>}
        </section>
        <div className="overview-side"><section className="overview-card"><div className="overview-section-heading"><h2>Low stock</h2><Link to="/products?stock=low">View all <ArrowRight size={16}/></Link></div>
          {info.low.slice(0,4).map(p=><Link className="overview-stock-row" key={p.id} to={'/products?edit='+encodeURIComponent(p.id)+'&stock=low'}><span className="overview-product-image">{p.image ? <img src={p.image} alt="" onError={e=>{e.currentTarget.style.display='none';}}/> : <Package size={23}/>}</span><span className="overview-product-name">{p.name}<small>{p.category}</small></span><span className="overview-stock-count">{p.stock === 0 ? 'Out of stock' : p.stock+' left'}</span></Link>)}
          {!info.low.length && <p className="overview-empty">All products have at least 5 units in stock.</p>}
          <Link className="overview-stock-action" to="/products?stock=low"><Package size={17}/>Update stock <ArrowRight size={15}/></Link>
        </section><section className="overview-card overview-quick"><h2>Quick actions</h2><div><Link className="btn-soft" to="/products"><Package size={17}/>Manage products</Link><Link className="btn-soft" to="/orders?status=pending">View pending orders</Link></div></section></div>
      </div>
    </>}
  </div>;
}
