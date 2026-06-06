import { useState } from 'react';
import { motion } from 'framer-motion';
import { SUBREGIONS } from '../../data/regions';
import { FOODS } from '../../data/foods';
import type { CommunitySubmission, PopulationGroup } from '../../types';

const POPULATION_OPTIONS: { value: PopulationGroup; label: string; emoji: string }[] = [
  { value: 'gestantes',  label: 'Mujeres gestantes',  emoji: '🤰' },
  { value: 'lactantes',  label: 'Madres lactantes',   emoji: '🤱' },
  { value: 'ninos_6_24', label: 'Niños 6-24 meses',  emoji: '👶' },
  { value: 'ninos_2_5',  label: 'Niños 2-5 años',    emoji: '🧒' },
  { value: 'general',    label: 'Población general',  emoji: '👥' },
];

const PRIORITIZED = SUBREGIONS.filter(r => r.isPrioritized);

const INITIAL: CommunitySubmission = {
  menuName:    '',
  description: '',
  foods:       [],
  region:      '',
  subRegion:   '',
  population:  'general',
  contact:     '',
  channel:     'web',
  submittedAt: new Date().toISOString(),
};

export default function MenuSubmissionForm() {
  const [form, setForm]       = useState<CommunitySubmission>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');

  const filteredFoods = FOODS.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    (f.localName ?? '').toLowerCase().includes(foodSearch.toLowerCase())
  );

  const toggleFood = (id: string) => {
    setForm(prev => ({
      ...prev,
      foods: prev.foods.includes(id)
        ? prev.foods.filter(f => f !== id)
        : [...prev.foods, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, submittedAt: new Date().toISOString() };
    // API call (backend FastAPI)
    try {
      const base = import.meta.env.DEV ? 'http://localhost:8000' : '';
      await fetch(`${base}/api/community/menus`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
    } catch {
      // Guardado local si el backend no está disponible
      const saved = JSON.parse(localStorage.getItem('community_menus') ?? '[]');
      saved.push(payload);
      localStorage.setItem('community_menus', JSON.stringify(saved));
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-10 shadow-md border border-gray-100 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">
          ¡Gracias por tu contribución!
        </h2>
        <p className="text-gray-500 mb-6">
          Tu menú ha sido registrado y será revisado por nuestro equipo antes de aparecer en el mapa.
        </p>
        <button
          onClick={() => { setForm(INITIAL); setSubmitted(false); }}
          className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
        >
          Registrar otro menú
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-food-gradient p-6 text-white">
        <h2 className="text-xl font-bold font-display">Registrar Menú Alimenticio</h2>
        <p className="text-white/80 text-sm mt-1">
          Ayúdanos a mapear los alimentos de tu región que aún no están en el observatorio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">

        {/* Nombre del menú */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nombre del menú o preparación *
          </label>
          <input
            required
            value={form.menuName}
            onChange={e => setForm(p => ({ ...p, menuName: e.target.value }))}
            placeholder="Ej: Sancocho de guandú con yuca"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Descripción
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Cuéntanos cómo se prepara, cuándo se consume, qué hace especial este plato..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
          />
        </div>

        {/* Región */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Región *</label>
            <select
              required
              value={form.region}
              onChange={e => setForm(p => ({ ...p, region: e.target.value, subRegion: '' }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            >
              <option value="">Seleccionar región</option>
              <option value="cesar">Cesar</option>
              <option value="magdalena">Magdalena</option>
              <option value="otra">Otra región de Colombia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subregión</label>
            <select
              value={form.subRegion ?? ''}
              onChange={e => setForm(p => ({ ...p, subRegion: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            >
              <option value="">Seleccionar subregión</option>
              {PRIORITIZED
                .filter(r => form.region === '' || r.department.toLowerCase() === form.region)
                .map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Población objetivo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ¿Para quién es especialmente nutritivo? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {POPULATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(p => ({ ...p, population: opt.value }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                  form.population === opt.value
                    ? 'bg-primary-50 border-primary-400 text-primary-700 font-semibold'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selección de alimentos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Alimentos que contiene este menú
          </label>
          <input
            value={foodSearch}
            onChange={e => setFoodSearch(e.target.value)}
            placeholder="🔍 Buscar alimento..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 mb-2"
          />
          <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-xl p-2 space-y-0.5">
            {filteredFoods.map(food => (
              <button
                key={food.id}
                type="button"
                onClick={() => toggleFood(food.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-left transition-all ${
                  form.foods.includes(food.id)
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{food.emoji}</span>
                <span>{food.name}</span>
                {food.localName && (
                  <span className="text-gray-400 text-xs">({food.localName})</span>
                )}
                {form.foods.includes(food.id) && (
                  <span className="ml-auto text-primary-600">✓</span>
                )}
              </button>
            ))}
          </div>
          {form.foods.length > 0 && (
            <p className="text-xs text-primary-600 mt-1.5 font-medium">
              {form.foods.length} alimento(s) seleccionado(s)
            </p>
          )}
        </div>

        {/* Contacto y canal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Contacto (opcional)
            </label>
            <input
              value={form.contact ?? ''}
              onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
              placeholder="Email o teléfono"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Medio de envío
            </label>
            <select
              value={form.channel ?? 'web'}
              onChange={e => setForm(p => ({ ...p, channel: e.target.value as any }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            >
              <option value="web">🌐 Web</option>
              <option value="whatsapp" disabled>📱 WhatsApp (próximamente)</option>
              <option value="telegram" disabled>✈️ Telegram (próximamente)</option>
            </select>
          </div>
        </div>

        {/* Próximamente: bots */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-sm font-semibold text-blue-800 mb-1">📱 Próximamente en WhatsApp y Telegram</p>
          <p className="text-xs text-blue-600">
            Estamos desarrollando un bot conversacional para que puedas reportar el estado alimentario
            de gestantes y niños directamente desde tu teléfono. ¡Pronto disponible!
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-700 transition-colors shadow-md"
        >
          Enviar menú al mapa 🗺️
        </button>
      </form>
    </motion.div>
  );
}
