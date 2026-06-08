import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, X, Loader2 } from 'lucide-react';
import { FOODS } from '../data/foods';
import { SUBREGIONS } from '../data/regions';

const API_BASE = import.meta.env.DEV ? 'http://localhost:8000' : '';
const TOKEN_KEY = 'observatorio_admin_token';

interface PendingMenu {
  id:           number;
  menu_name:    string;
  description:  string | null;
  foods:        string[];
  region:       string;
  sub_region:   string | null;
  population:   string;
  channel:      string;
  verified:     boolean;
  submitted_at: string;
}

const foodName = (id: string) => FOODS.find(f => f.id === id)?.name ?? id;
const subRegionName = (id: string | null) => SUBREGIONS.find(r => r.id === id)?.name ?? id ?? '—';

export default function RevisionPage() {
  const [token, setToken]     = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? '');
  const [input, setInput]     = useState('');
  const [error, setError]     = useState('');
  const [menus, setMenus]     = useState<PendingMenu[] | null>(null);
  const [busyId, setBusyId]   = useState<number | null>(null);

  const load = async (t: string) => {
    setError('');
    const res = await fetch(`${API_BASE}/api/community/menus?verified=false`, {
      headers: { 'X-Admin-Token': t },
    });
    if (res.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken('');
      setError('Contraseña incorrecta.');
      return;
    }
    setMenus(await res.json());
  };

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(TOKEN_KEY, input);
    setToken(input);
  };

  const act = async (id: number, action: 'verify' | 'reject') => {
    setBusyId(id);
    const url    = action === 'verify' ? `${API_BASE}/api/community/menus/${id}/verify` : `${API_BASE}/api/community/menus/${id}`;
    const method = action === 'verify' ? 'PATCH' : 'DELETE';
    const res = await fetch(url, { method, headers: { 'X-Admin-Token': token } });
    if (res.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken('');
      setError('La sesión expiró. Ingresa la contraseña de nuevo.');
      setBusyId(null);
      return;
    }
    setMenus(prev => (prev ?? []).filter(m => m.id !== id));
    setBusyId(null);
  };

  // ─── Vista: ingreso de contraseña ───────────────────────────────────────────
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-primary-600" />
          </div>
          <h1 className="text-xl font-bold font-display text-gray-900 mb-1">Revisión del equipo</h1>
          <p className="text-sm text-gray-500 mb-6">Ingresa la contraseña del equipo para revisar los menús pendientes.</p>
          <input
            type="password"
            required
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Contraseña"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-400 mb-3"
          />
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            Entrar
          </button>
        </motion.form>
      </div>
    );
  }

  // ─── Vista: lista de menús pendientes ───────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-1">Menús pendientes de revisión</h1>
      <p className="text-sm text-gray-500 mb-8">
        Aprueba para publicar el menú en el mapa, o recházalo si no aplica.
      </p>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {menus === null && (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 size={16} className="animate-spin" /> Cargando…
        </div>
      )}

      {menus?.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          🎉 No hay menús pendientes. ¡Todo al día!
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {menus?.map(m => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-bold text-gray-900">{m.menu_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {m.region} · {subRegionName(m.sub_region)} · 👤 {m.population.replace(/_/g, ' ')} · {m.channel}
                  </p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(m.submitted_at).toLocaleDateString('es-CO')}
                </span>
              </div>

              {m.description && <p className="text-sm text-gray-600 mb-2">{m.description}</p>}

              {m.foods.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.foods.map(id => (
                    <span key={id} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg border border-gray-100">
                      {foodName(id)}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => act(m.id, 'verify')}
                  disabled={busyId === m.id}
                  className="flex items-center gap-1.5 bg-green-50 text-green-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  <Check size={15} /> Aprobar y publicar
                </button>
                <button
                  onClick={() => act(m.id, 'reject')}
                  disabled={busyId === m.id}
                  className="flex items-center gap-1.5 bg-red-50 text-red-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <X size={15} /> Rechazar
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
