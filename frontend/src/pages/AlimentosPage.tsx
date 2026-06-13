import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FOODS, FOOD_CATEGORIES } from '../data/foods';
import FoodGroupChart from '../components/Charts/FoodGroupChart';
import NutritionRadar from '../components/Charts/NutritionRadar';
import PageHeader from '../components/Layout/PageHeader';
import type { FoodCategory } from '../types';

const ALL = 'all';

const POP_EMOJI: Record<string, string> = {
  gestantes:  '🤰',
  lactantes:  '🤱',
  ninos_6_24: '👶',
};

const POP_LABEL: Record<string, string> = {
  gestantes:  'Mujeres Gestantes',
  lactantes:  'Mujeres Lactantes',
  ninos_6_24: 'Niñas y niños 6-24 m',
};

export default function AlimentosPage() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>(ALL);
  const [search, setSearch]                 = useState('');
  const [selectedFood, setSelectedFood]     = useState<typeof FOODS[0] | null>(null);

  const filtered = FOODS.filter(f => {
    const matchCat    = activeCategory === ALL || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        (f.localName ?? '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const close = () => setSelectedFood(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <PageHeader
        eyebrow="Guía ICBF–UdeA 2025"
        emoji="🥗"
        title="Alimentos Mapeados"
        subtitle="Catálogo de alimentos nutritivos por grupo alimentario de la Guía de Alimentación ICBF–UdeA."
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FoodGroupChart />
        <NutritionRadar
          foods={filtered.length ? filtered : FOODS}
          description="Cada eje del radar muestra qué tan cerca está el grupo de alimentos visible de un valor de referencia para ese nutriente: cuanto más se acerca la línea verde al borde exterior, mayor es su aporte relativo de proteína, hierro, calcio, vitamina C, folato o fibra. Filtra por categoría o población para ver cómo cambia el perfil — por ejemplo, los alimentos recomendados para gestantes suelen destacar en folato y calcio, mientras que los de inicio para niñas y niños 6-24 meses priorizan hierro y vitamina C."
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar alimento..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <span className="text-sm text-gray-400 flex-shrink-0">{filtered.length} resultados</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(ALL)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === ALL ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🌐 Todos
          </button>
          {Object.entries(FOOD_CATEGORIES).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as FoodCategory)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                activeCategory === key
                  ? { backgroundColor: cfg.color, color: '#fff' }
                  : { backgroundColor: cfg.bgColor, color: cfg.color }
              }
            >
              {cfg.emoji} {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(food => {
          const catCfg = FOOD_CATEGORIES[food.category];
          return (
            <motion.div
              key={food.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedFood(food === selectedFood ? null : food)}
              className={`food-card p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-shadow ${
                selectedFood?.id === food.id ? 'ring-2 ring-primary-400 shadow-md' : ''
              }`}
            >
              <span className="text-4xl">{food.emoji}</span>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{food.name}</p>
              {food.localName && (
                <p className="text-xs text-gray-400 leading-tight">{food.localName}</p>
              )}
              <span
                className="category-badge text-xs"
                style={{ backgroundColor: catCfg?.bgColor, color: catCfg?.color }}
              >
                {catCfg?.emoji} {catCfg?.label}
              </span>
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                  <span>Nutrición</span>
                  <span>{food.nutritionScore}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${food.nutritionScore}%` }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: catCfg?.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Food detail panel — bottom sheet on mobile, floating card on desktop */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            key="food-detail-group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-[199]"
              onClick={close}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className={[
                // Mobile: full-width bottom sheet
                'fixed bottom-0 inset-x-0 z-[200]',
                // Desktop: centered floating card
                'lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2',
                'lg:inset-x-auto lg:w-full lg:max-w-lg lg:px-4',
              ].join(' ')}
            >
              {/* Mobile drag handle */}
              <div className="lg:hidden flex justify-center pt-3 bg-white rounded-t-3xl border-t border-x border-gray-100">
                <div className="w-10 h-1 bg-gray-300 rounded-full mb-1" />
              </div>

              <div className="bg-white lg:rounded-3xl rounded-b-none rounded-t-none shadow-2xl border border-gray-100
                              max-h-[80vh] overflow-y-auto lg:rounded-3xl">
                <div className="p-5 sm:p-6">

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-4xl flex-shrink-0">{selectedFood.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 font-display truncate">{selectedFood.name}</h3>
                        {selectedFood.localName && (
                          <p className="text-xs text-gray-500 truncate">{selectedFood.localName}</p>
                        )}
                        {(() => {
                          const catCfg = FOOD_CATEGORIES[selectedFood.category];
                          return catCfg ? (
                            <span
                              className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: catCfg.bgColor, color: catCfg.color }}
                            >
                              {catCfg.emoji} {catCfg.label}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                    <button
                      onClick={close}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors ml-2"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Notes */}
                  {selectedFood.notes && (
                    <p className="text-sm text-gray-600 bg-primary-50 rounded-xl p-3 mb-4 leading-relaxed">
                      {selectedFood.notes}
                    </p>
                  )}

                  {/* Nutrients */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'Proteína', value: `${selectedFood.nutrients.protein}g`,   emoji: '💪' },
                      { label: 'Hierro',   value: `${selectedFood.nutrients.iron}mg`,     emoji: '🩸' },
                      { label: 'Calcio',   value: `${selectedFood.nutrients.calcium}mg`,  emoji: '🦴' },
                      { label: 'Vit. C',   value: `${selectedFood.nutrients.vitaminC}mg`, emoji: '🍊' },
                      { label: 'Folato',   value: `${selectedFood.nutrients.folate}mcg`,  emoji: '🫘' },
                      { label: 'Fibra',    value: `${selectedFood.nutrients.fiber}g`,     emoji: '🌾' },
                    ].map(n => (
                      <div key={n.label} className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-lg">{n.emoji}</p>
                        <p className="text-xs text-gray-500">{n.label}</p>
                        <p className="text-sm font-bold text-gray-900">{n.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Guía ICBF–UdeA population recommendations */}
                  {selectedFood.guideRecommended && selectedFood.guideRecommended.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Recomendado por la Guía ICBF–UdeA para
                      </p>
                      <div className="space-y-1.5">
                        {selectedFood.guideRecommended.map(rec => (
                          <div
                            key={rec.population}
                            className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                              rec.priority === 'alta'
                                ? 'bg-red-50 text-red-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            <span className="flex-shrink-0 font-bold">
                              {POP_EMOJI[rec.population]} {POP_LABEL[rec.population]}
                            </span>
                            <span className={`flex-shrink-0 font-bold px-1.5 rounded ${
                              rec.priority === 'alta' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {rec.priority === 'alta' ? '★' : '◆'}
                            </span>
                            <span className="leading-relaxed text-gray-700">{rec.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preparations */}
                  {selectedFood.preparation && selectedFood.preparation.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Preparaciones
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedFood.preparation.map(p => (
                          <span
                            key={p}
                            className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full font-medium"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Season */}
                  {selectedFood.season && selectedFood.season.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Temporada
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedFood.season.map(s => (
                          <span key={s} className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            📅 {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
