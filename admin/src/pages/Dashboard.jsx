import LineChartCard from "../components/charts/LineChartCard";
import BarChartCard from "../components/charts/BarChartCard";
import PieChartCard from "../components/charts/PieChartCard";
import AreaChartCard from "../components/charts/AreaChartCard";
import CategoryStats from "../components/CategoryStats";
import LowStockAlert from "../components/LowStockAlert";
import ProductAnalytics from "../components/ProductAnalytics";
import OrdersProfitChart from "../components/charts/OrdersProfitChart";

export default function Dashboard() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <CategoryStats />
      <LowStockAlert />
      <ProductAnalytics />
      <LineChartCard />
      <BarChartCard />
      <OrdersProfitChart />
      <PieChartCard />
      <AreaChartCard />
    </div>
  );
}
