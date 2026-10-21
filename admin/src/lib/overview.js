export function inPeriod(value, period, now = new Date()) {
  if (period === 'all') return true;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return false;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === 'month') start.setDate(1);
  if (period === 'week') start.setDate(start.getDate() - 6);
  return date >= start && date <= now;
}
export function overview(orders, products, users, period, now = new Date()) {
  const selected = orders.filter(o => inPeriod(o.created_at, period, now));
  return {
    selected,
    revenue: selected.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price || 0), 0),
    pending: orders.filter(o => o.status === 'pending'),
    low: products.filter(p => Number(p.stock) < 5).sort((a, b) => a.stock - b.stock),
    customers: users.filter(u => u.role !== 'admin').length,
  };
}
