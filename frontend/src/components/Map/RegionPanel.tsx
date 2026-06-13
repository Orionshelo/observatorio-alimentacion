import { useState } from 'react';
import type { SubRegion, PopulationGroup } from '../../types';
import { NUTRITION_ALERT_CONFIG } from '../../data/regions';
import { FOOD_CATEGORIES as FC } from '../../data/foods';

interface Props {
  region: SubRegion;
  onClose: () => void;
}

const POP_TABS: { value: PopulationGroup | 'todos'; label: string; emoji: string; color: string; bg: string }[] = [
  { value: 'todos',      label: 'Todos',       emoji: '🗺️', color: '#374151', bg: '#f3f4f6' },
  { value: 'gestantes',  label: 'Mujeres Gestantes', emoji: '🤰', color: '#9d174d', bg: '#fce7f3' },
  { value: 'lactantes',  label: 'Mujeres Lactantes', emoji: '🤱', color: '#1e40af', bg: '#dbeafe' },
  { value: 'ninos_6_24', label: 'Niñas y niños 6-24 m', emoji: '👶', color: '#065f46', bg: '#d1fae5' },
];

const PRIORITY_LABEL: Record<'alta' | 'media', { label: string; bg: string; color: string }> = {
  alta:  { label: 'Alta',  bg: '#fee2e2', color: '#b91c1c' },
  media: { label: 'Media', bg: '#fef3c7', color: '#92400e' },
};

export default function RegionPanel({ region, onClose }: Props) {
  const [popFilter, setPopFilter] = useState<PopulationGroup | 'todos'>('todos');
  const alertCfg = NUTRITION_ALERT_CONFIG[region.nutritionAlert ?? 'buena'];

  const recommendedFoods = region.foods
    .map(food => {
      const rec = food.guideRecommended?.find(r => r.population === popFilter);
      return rec ? { food, rec } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => (a.rec.priority === 'alta' ? -1 : 1) - (b.rec.priority === 'alta' ? -1 : 1));

  const foodsByCategory = region.foods.reduce<Record<string, typeof region.foods>>((acc, food) => {
    if (!acc[food.category]) acc[food.category] = [];
    acc[food.category].push(food);
    return acc;
  }, {});

  const activePop = POP_TABS.find(t => t.value === popFilter)!;

  return (
    // Mobile: full-width, rounded top corners only (bottom drawer)
    // Desktop: normal rounded card
    <div className="bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden
                    flex flex-col max-h-[72vh] lg:max-h-[85vh]">

      {/* Mobile drag handle */}
      <div className="lg:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Header */}
      <div className="p-4 bg-food-gradient text-white flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide truncate">
              {region.department}
            </p>
            <h2 className="font-bold text-lg font-display leading-tight mt-0.5 truncate">
              {region.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: alertCfg.bg, color: alertCfg.color }}
          >
            {alertCfg.icon} {alertCfg.label}
          </span>
          {region.isPrioritized && (
            <span className="px-2.5 py-1 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold">
              ★ Priorizada
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{region.foods.length}</p>
            <p className="text-xs text-white/80">Alimentos</p>
          </div>
          <div className="bg-white/15 rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{region.menus.length}</p>
            <p className="text-xs text-white/80">Preparaciones</p>
          </div>
        </div>
      </div>

      {/* Population filter tabs */}
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Filtrar por población
        </p>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {POP_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setPopFilter(tab.value)}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
              style={
                popFilter === tab.value
                  ? { backgroundColor: tab.color, color: '#fff' }
                  : { backgroundColor: tab.bg,    color: tab.color }
              }
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 p-4 space-y-4">

        {/* ── FILTERED VIEW ──────────────────────────────────────────── */}
        {popFilter !== 'todos' && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: activePop.color }}>
              {activePop.emoji} Recomendados (Guía ICBF–UdeA) para {activePop.label}
            </p>

            {recommendedFoods.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  Ningún alimento mapeado tiene recomendación específica de la Guía ICBF–UdeA para {activePop.label} en {region.name}.
                </p>
                <p className="text-xs text-gray-400 mt-1">Contribuye desde la sección Comunidad.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recommendedFoods.map(({ food, rec }) => {
                  const pLabel = PRIORITY_LABEL[rec.priority];
                  const catCfg = FC[food.category];
                  return (
                    <div
                      key={food.id}
                      className="rounded-xl border overflow-hidden"
                      style={{ borderColor: catCfg?.bgColor ?? '#f3f4f6' }}
                    >
                      <div
                        className="flex items-center gap-2 px-3 py-2"
                        style={{ backgroundColor: catCfg?.bgColor ?? '#f9fafb' }}
                      >
                        <span className="text-xl flex-shrink-0">{food.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                            {food.name}
                            {food.localName && (
                              <span className="ml-1 text-xs text-gray-400 font-normal">({food.localName})</span>
                            )}
                          </p>
                          {catCfg && (
                            <p className="text-xs font-medium" style={{ color: catCfg.color }}>
                              {catCfg.emoji} {catCfg.label}
                            </p>
                          )}
                        </div>
                        <span
                          className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: pLabel.bg, color: pLabel.color }}
                        >
                          {rec.priority === 'alta' ? '★ Alta' : '◆ Media'}
                        </span>
                      </div>
                      <div className="px-3 py-2 bg-white">
                        <p className="text-xs text-gray-600 leading-relaxed">{rec.reason}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── DEFAULT VIEW: all foods by category ────────────────────── */}
        {popFilter === 'todos' && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Alimentos mapeados
            </p>
            <div className="space-y-2">
              {Object.entries(foodsByCategory).map(([cat, foods]) => {
                const catCfg = FC[cat];
                if (!catCfg) return null;
                return (
                  <div key={cat} className="flex items-start gap-2">
                    <span className="text-base w-6 mt-1 flex-shrink-0">{catCfg.emoji}</span>
                    <div
                      className="flex-1 rounded-lg px-2 py-1.5 min-w-0"
                      style={{ backgroundColor: catCfg.bgColor }}
                    >
                      <p className="text-xs font-semibold" style={{ color: catCfg.color }}>
                        {catCfg.label}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {foods.map(f => (
                          <span
                            key={f.id}
                            className="text-xs bg-white/70 rounded px-1.5 py-0.5 font-medium"
                            style={{ color: catCfg.color }}
                          >
                            {f.emoji} {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preparaciones */}
        {region.menus.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Alimentos y preparaciones registrados
            </p>
            <div className="space-y-2">
              {region.menus.map(menu => (
                <div key={menu.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{menu.name}</p>
                    <div className="flex gap-1 flex-shrink-0">
                      {menu.isTraditional && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Tradición</span>
                      )}
                      {menu.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">✓</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{menu.description}</p>
                  <p className="text-xs text-primary-600 mt-1.5 font-medium capitalize">
                    👤 {menu.population.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-400 text-center">
            👥 {(region.population / 1000).toFixed(0)}k hab. · Recomendaciones: Guía ICBF–UdeA (2025)
          </p>
        </div>
      </div>
    </div>
  );
}
