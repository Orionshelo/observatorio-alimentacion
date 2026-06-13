import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { SUBREGIONS, NUTRITION_ALERT_CONFIG } from '../../data/regions';
import { useCommunityMenus } from '../../hooks/useCommunityMenus';
import type { SubRegion } from '../../types';
import RegionPanel from './RegionPanel';

import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: '', iconUrl: '', shadowUrl: '' });

const ALERT_COLORS: Record<string, string> = {
  critica:  '#ef4444',
  moderada: '#f97316',
  buena:    '#22c55e',
};

function FlyToRegion({ region }: { region: SubRegion | null }) {
  const map = useMap();
  useEffect(() => {
    if (region) map.flyTo(region.coordinates, 9, { duration: 1.2 });
  }, [region, map]);
  return null;
}

export default function ColombiaMap() {
  const [selectedRegion, setSelectedRegion] = useState<SubRegion | null>(null);
  const [filter, setFilter]                 = useState<'all' | 'critica' | 'moderada' | 'buena'>('all');

  // Fusiona los menús comunitarios ya verificados por el equipo con los datos estáticos
  const liveMenus = useCommunityMenus();
  const regionsData = useMemo(
    () => SUBREGIONS.map(r =>
      liveMenus[r.id]?.length ? { ...r, menus: [...r.menus, ...liveMenus[r.id]] } : r
    ),
    [liveMenus]
  );

  const filtered = filter === 'all' ? regionsData : regionsData.filter(r => r.nutritionAlert === filter);

  const close = () => setSelectedRegion(null);

  return (
    <div className="space-y-3">

      {/* ── Mobile: filter pills ────────────────────────────────────── */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(['all', 'critica', 'moderada', 'buena'] as const).map(f => {
          const cfg = f !== 'all' ? NUTRITION_ALERT_CONFIG[f] : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {f === 'all' ? '🌐' : cfg!.icon}
              {f === 'all' ? 'Todas' : cfg!.label}
              <span className="opacity-50">
                {f === 'all' ? SUBREGIONS.length : SUBREGIONS.filter(r => r.nutritionAlert === f).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Main layout: sidebar + map ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4 lg:h-[calc(100vh-8rem)]">

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 gap-3 overflow-y-auto min-h-0">

          {/* Filter */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Estado nutricional
            </p>
            <div className="space-y-1.5">
              {(['all', 'critica', 'moderada', 'buena'] as const).map(f => {
                const cfg = f !== 'all' ? NUTRITION_ALERT_CONFIG[f] : null;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      filter === f ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{f === 'all' ? '🌐' : cfg!.icon}</span>
                    <span>{f === 'all' ? 'Todas las regiones' : cfg!.label}</span>
                    <span className="ml-auto text-xs opacity-60">
                      {f === 'all' ? SUBREGIONS.length : SUBREGIONS.filter(r => r.nutritionAlert === f).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region list */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 overflow-y-auto min-h-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Subregiones</p>
            <div className="space-y-0.5">
              {filtered.map(r => {
                const alertCfg = NUTRITION_ALERT_CONFIG[r.nutritionAlert ?? 'buena'];
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(r)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all ${
                      selectedRegion?.id === r.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-gray-50'
                    } ${r.isPrioritized ? 'font-semibold' : 'font-normal text-gray-600'}`}
                  >
                    <span style={{ color: alertCfg.color }}>{alertCfg.icon}</span>
                    <span className="flex-1 truncate">{r.name}</span>
                    {r.isPrioritized && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded">★</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Leyenda</p>
            {Object.entries(NUTRITION_ALERT_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2 mb-1.5 text-sm">
                <span>{cfg.icon}</span>
                <span className="text-gray-700">{cfg.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm mt-3 pt-3 border-t border-gray-100">
              <span className="text-primary-600 font-bold">★</span>
              <span className="text-gray-700">Subregión priorizada</span>
            </div>
          </div>
        </aside>

        {/* Map column */}
        <div className="flex flex-col gap-3 flex-1 min-h-0">

          {/* Map container */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200
                          h-64 sm:h-80 md:h-96
                          lg:flex-1 lg:min-h-0">
            <MapContainer
              center={[7.0, -74.0]}
              zoom={6}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
              />
              <FlyToRegion region={selectedRegion} />

              {filtered.map(region => (
                <CircleMarker
                  key={region.id}
                  center={region.coordinates}
                  radius={region.isPrioritized ? 18 : 12}
                  pathOptions={{
                    fillColor:    ALERT_COLORS[region.nutritionAlert ?? 'buena'],
                    fillOpacity:  selectedRegion?.id === region.id ? 0.95 : 0.75,
                    color:        region.isPrioritized ? '#1e293b' : 'white',
                    weight:       region.isPrioritized ? 3 : 1.5,
                  }}
                  eventHandlers={{ click: () => setSelectedRegion(region) }}
                >
                  <Popup>
                    <div className="p-1 min-w-[160px]">
                      <p className="text-xs font-semibold text-gray-400 uppercase">{region.department}</p>
                      <h3 className="font-bold text-gray-900 mb-2">{region.name}</h3>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {region.foods.slice(0, 8).map(f => (
                          <span key={f.id} title={f.name} className="text-lg">{f.emoji}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{region.menus.length} preparaciones registradas</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            {/* Region panel — bottom drawer on mobile, side overlay on desktop */}
            <AnimatePresence>
              {selectedRegion && (
                <motion.div
                  key="panel-group"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Mobile backdrop */}
                  <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-[1999]"
                    onClick={close}
                  />
                  {/* Panel */}
                  <motion.div
                    initial={{ y: 24 }}
                    animate={{ y: 0 }}
                    exit={{ y: 24 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className={[
                      // Mobile: fixed bottom drawer, full width
                      'fixed bottom-0 inset-x-0 z-[2000]',
                      // Desktop: absolute overlay inside map, right side
                      'lg:absolute lg:inset-auto lg:bottom-auto lg:top-4 lg:right-4 lg:w-80 lg:z-[1000]',
                    ].join(' ')}
                  >
                    <RegionPanel region={selectedRegion} onClose={close} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: region tap grid below map */}
          <div className="lg:hidden grid grid-cols-2 gap-2">
            {filtered.map(r => {
              const alertCfg = NUTRITION_ALERT_CONFIG[r.nutritionAlert ?? 'buena'];
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                    selectedRegion?.id === r.id
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'
                  }`}
                >
                  <span className="text-base flex-shrink-0" style={{ color: alertCfg.color }}>
                    {alertCfg.icon}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs truncate ${r.isPrioritized ? 'font-bold' : 'font-semibold'}`}>
                      {r.name}
                      {r.isPrioritized && ' ★'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{r.department}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile: compact legend */}
          <div className="lg:hidden flex flex-wrap gap-3 px-1">
            {Object.entries(NUTRITION_ALERT_CONFIG).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1 text-xs text-gray-500">
                {cfg.icon} {cfg.label}
              </span>
            ))}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              ★ Priorizada
            </span>
          </div>

        </div>{/* end map column */}
      </div>{/* end main layout */}
    </div>
  );
}
