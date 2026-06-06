import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FOOD_GUIDES, FOOD_CATEGORIES } from '../data/foods';

const POP_EMOJI: Record<string, string> = {
  gestantes:  '🤰',
  lactantes:  '🤱',
  ninos_6_24: '👶',
};

export default function GuiasPage() {
  const [activeGuide, setActiveGuide] = useState(FOOD_GUIDES[0].id);
  const guide = FOOD_GUIDES.find(g => g.id === activeGuide)!;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Guías Alimentarias ICBF</h1>
        <p className="text-gray-500 mt-1">
          Guías Alimentarias Basadas en Alimentos (GABA) – adaptadas a las regiones de Cesar y Magdalena.
          Fuente: Instituto Colombiano de Bienestar Familiar (ICBF).
        </p>
      </div>

      {/* Guide selector */}
      <div className="flex gap-3 flex-wrap">
        {FOOD_GUIDES.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGuide(g.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeGuide === g.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {POP_EMOJI[g.population]}
            {g.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeGuide}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >

          {/* ── Row 1: Portions + Key messages ───────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Daily portions */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold font-display text-gray-900 mb-0.5">{guide.title}</h2>
              <p className="text-sm text-gray-500 mb-1">{guide.ageRange}</p>

              {/* Meals & hydration summary pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                  🍽️ {guide.mealsPerDay}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  💧 {guide.hydrationLiters} L de agua/día
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Porciones diarias recomendadas
              </p>
              <div className="space-y-3">
                {Object.entries(guide.dailyPortions)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, portions]) => {
                    const catCfg = FOOD_CATEGORIES[cat];
                    if (!catCfg) return null;
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="text-xl w-8">{catCfg.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 font-medium">{catCfg.label}</span>
                            <span className="font-bold text-gray-900">
                              {portions} porción{portions !== 1 ? 'es' : ''}
                            </span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((portions / 8) * 100, 100)}%` }}
                              transition={{ duration: 0.7, delay: 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: catCfg.color }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Key messages */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Mensajes clave GABA
              </p>
              <div className="space-y-3">
                {guide.keyMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3 bg-primary-50 rounded-xl p-3"
                  >
                    <span className="text-primary-600 font-bold text-sm flex-shrink-0">{i + 1}</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{msg}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Fuente: GABA – ICBF Colombia
                </p>
              </div>
            </div>
          </div>

          {/* ── Row 2: Supplements + Avoid foods ─────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Supplements */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💊</span>
                <p className="text-sm font-bold text-gray-800">Suplementación recomendada</p>
              </div>
              <ul className="space-y-2.5">
                {guide.supplements.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                    <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid foods */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🚫</span>
                <p className="text-sm font-bold text-gray-800">Alimentos y hábitos a evitar</p>
              </div>
              <ul className="space-y-2.5">
                {guide.avoidFoods.map((a, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                    <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">✗</span>
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Row 3: Portion examples ───────────────────────────────── */}
          {guide.portionExamples.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">🥄</span>
                <p className="text-sm font-bold text-gray-800">¿Cuánto es una porción? Ejemplos locales</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {guide.portionExamples.map((p, i) => {
                  const catCfg = FOOD_CATEGORIES[p.category];
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-3 border"
                      style={{
                        backgroundColor: catCfg?.bgColor ?? '#f9fafb',
                        borderColor:     catCfg?.bgColor ?? '#e5e7eb',
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-base">{catCfg?.emoji ?? '🍽️'}</span>
                        <p className="text-xs font-bold" style={{ color: catCfg?.color ?? '#374151' }}>
                          {catCfg?.label ?? p.category}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-1">{p.description}</p>
                      <p
                        className="text-xs font-semibold leading-relaxed"
                        style={{ color: catCfg?.color ?? '#374151' }}
                      >
                        🌴 {p.localExample}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Row 4: Healthy plate visual ──────────────────────────── */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
            <h3 className="text-xl font-bold font-display text-gray-900 mb-2 text-center">
              🍽️ Plato Saludable Adaptado – {guide.title}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Distribución visual del plato principal con alimentos de la región Caribe (Cesar y Magdalena)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: '½ Plato – Frutas y verduras', foods: ['🥭 Mango', '🎃 Auyama', '🍈 Guayaba'], color: '#dcfce7', border: '#22c55e' },
                { title: '¼ Plato – Proteínas',         foods: ['🐟 Mojarra', '🥚 Huevo criollo', '🟢 Guandú'], color: '#fee2e2', border: '#ef4444' },
                { title: '¼ Plato – Granos y raíces',   foods: ['🌿 Yuca', '🟤 Ñame', '🍚 Arroz de coco'], color: '#fef9c3', border: '#ca8a04' },
                { title: 'Complemento – Lácteos',       foods: ['🧀 Queso costeño', '🥛 Leche'], color: '#e0f2fe', border: '#0284c7' },
              ].map(section => (
                <div
                  key={section.title}
                  className="rounded-2xl p-4 border-2 text-center"
                  style={{ backgroundColor: section.color, borderColor: section.border }}
                >
                  <p className="text-xs font-bold mb-3 leading-tight" style={{ color: section.border }}>
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.foods.map(food => (
                      <p key={food} className="text-sm text-gray-700">{food}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
