import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import type { FoodItem } from '../../types';

interface Props {
  foods: FoodItem[];
  title?: string;
  description?: string;
}

function normalize(value: number, max: number) {
  return Math.min(100, Math.round((value / max) * 100));
}

const NUTRIENT_MAX = {
  protein:  25,
  iron:     5,
  calcium:  200,
  vitaminC: 100,
  folate:   250,
  fiber:    10,
};

export default function NutritionRadar({ foods, title = 'Perfil Nutricional Regional', description }: Props) {
  if (!foods.length) return null;

  const avg = (key: keyof typeof NUTRIENT_MAX) =>
    foods.reduce((s, f) => s + (f.nutrients[key as keyof typeof f.nutrients] as number), 0) / foods.length;

  const data = [
    { nutrient: 'Proteína',   value: normalize(avg('protein'),  NUTRIENT_MAX.protein)  },
    { nutrient: 'Hierro',     value: normalize(avg('iron'),     NUTRIENT_MAX.iron)     },
    { nutrient: 'Calcio',     value: normalize(avg('calcium'),  NUTRIENT_MAX.calcium)  },
    { nutrient: 'Vit. C',     value: normalize(avg('vitaminC'), NUTRIENT_MAX.vitaminC) },
    { nutrient: 'Folato',     value: normalize(avg('folate'),   NUTRIENT_MAX.folate)   },
    { nutrient: 'Fibra',      value: normalize(avg('fiber'),    NUTRIENT_MAX.fiber)    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-bold font-display text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-2">Promedio de nutrientes en los alimentos mapeados (% del máximo)</p>
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 12, fill: '#4b5563' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
          <Radar
            name="Nutrientes"
            dataKey="value"
            stroke="#16a34a"
            fill="#22c55e"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(v) => [`${v}%`, 'Aporte relativo']}
            contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
