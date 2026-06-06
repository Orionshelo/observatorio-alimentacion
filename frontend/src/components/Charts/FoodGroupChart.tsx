import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { FOODS, FOOD_CATEGORIES } from '../../data/foods';

const chartData = Object.entries(FOOD_CATEGORIES).map(([key, cfg]) => ({
  name:  cfg.label,
  emoji: cfg.emoji,
  value: FOODS.filter(f => f.category === key).length,
  color: cfg.color,
})).filter(d => d.value > 0);

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, emoji }: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={16}>
      {emoji}
    </text>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white shadow-xl rounded-xl p-3 border border-gray-100">
      <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
      <p className="text-gray-500 text-xs mt-0.5">{d.value} alimentos mapeados</p>
    </div>
  );
}

export default function FoodGroupChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-bold font-display text-gray-900 mb-1">
        Distribución por Grupo Alimentario
      </h3>
      <p className="text-sm text-gray-500 mb-4">Alimentos mapeados por categoría</p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
