import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { SUBREGIONS, NUTRITION_ALERT_CONFIG } from '../../data/regions';

const ALERT_COLORS: Record<string, string> = {
  critica:  '#ef4444',
  moderada: '#f97316',
  buena:    '#22c55e',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const r = SUBREGIONS.find(s => s.name === label);
  const alertCfg = r ? NUTRITION_ALERT_CONFIG[r.nutritionAlert ?? 'buena'] : null;
  return (
    <div className="bg-white shadow-xl rounded-xl p-3 border border-gray-100 max-w-[200px]">
      <p className="font-semibold text-gray-900 text-xs mb-1">{label}</p>
      <p className="text-gray-500 text-xs">🥗 {payload[0].value} alimentos</p>
      {alertCfg && (
        <p className="text-xs mt-1" style={{ color: alertCfg.color }}>
          {alertCfg.icon} {alertCfg.label}
        </p>
      )}
    </div>
  );
}

export default function RegionBarChart() {
  const data = SUBREGIONS
    .filter(r => r.isPrioritized)
    .map(r => ({
      name:   r.name.split(' ').slice(0, 3).join(' '),
      foods:  r.foods.length,
      menus:  r.menus.length,
      alert:  r.nutritionAlert ?? 'buena',
    }))
    .sort((a, b) => b.foods - a.foods);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-bold font-display text-gray-900 mb-1">
        Alimentos por Subregión Priorizada
      </h3>
      <p className="text-sm text-gray-500 mb-4">Cesar y Magdalena – cobertura alimentaria</p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 11, fill: '#4b5563' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="foods" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {data.map((entry, i) => (
              <Cell key={i} fill={ALERT_COLORS[entry.alert]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
