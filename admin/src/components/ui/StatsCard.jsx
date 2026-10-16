import { motion } from "framer-motion";

export default function StatsCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow-md transition-all"
    >
      <h2 className="text-gray-500 text-sm font-medium">{title}</h2>

      <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
    </motion.div>
  );
}
