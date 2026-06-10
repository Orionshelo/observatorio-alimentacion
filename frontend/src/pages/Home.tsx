import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SUBREGIONS, NUTRITION_ALERT_CONFIG } from '../data/regions';
import { FOODS, FOOD_CATEGORIES } from '../data/foods';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const prioritizedRegions = SUBREGIONS.filter(r => r.isPrioritized);
  const criticalRegions    = SUBREGIONS.filter(r => r.nutritionAlert === 'critica');
  const totalFoods         = FOODS.length;
  const categories         = Object.keys(FOOD_CATEGORIES).length;

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          HERO — gradiente oscuro con blobs animados
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white px-6 pt-20 pb-32 md:pt-28 md:pb-40">

        {/* Blobs de fondo */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.06, 0.13, 0.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-emerald-400 rounded-full blur-3xl pointer-events-none"
        />
        <div className="absolute -top-20 -right-20 w-[550px] h-[550px] bg-yellow-300/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-300/5 rounded-full blur-2xl pointer-events-none"
        />

        <div className="relative max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ICBF · CINDE · UdeA · Nutrir
            </span>
          </motion.div>

          {/* Heading principal */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-4xl md:text-6xl font-bold font-display leading-[1.1] mb-5 text-balance"
          >
            Observatorio del
            <br />
            <span className="text-emerald-300">Derecho a la</span>
            <br />
            <span className="text-yellow-300">Alimentación</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="text-white/75 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Mapeamos la situación nutricional de mujeres gestantes, lactantes y niñas y niños
            con datos oficiales del ICBF — énfasis en{' '}
            <strong className="text-yellow-200 font-semibold">Cesar y Magdalena</strong>.
          </motion.p>

          {/* Pills con datos clave */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-2 mb-10"
          >
            {[
              { val: '26.2%', label: 'anemia en gestantes',           cls: 'bg-red-500/25 border-red-400/40 text-red-100'    },
              { val: '54.2%', label: 'inseguridad alimentaria nal.',   cls: 'bg-orange-500/25 border-orange-400/40 text-orange-100' },
              { val: '66.7%', label: 'Magdalena inseguridad',          cls: 'bg-amber-500/25 border-amber-400/40 text-amber-100' },
              { val: '36.1%', label: 'lactancia materna exclusiva',    cls: 'bg-teal-500/25 border-teal-400/40 text-teal-100'  },
            ].map(p => (
              <motion.span
                key={p.label}
                variants={fadeUp}
                className={`inline-flex items-center gap-1.5 border backdrop-blur-sm text-sm font-medium px-3.5 py-1.5 rounded-full ${p.cls}`}
              >
                <span className="font-bold text-white">{p.val}</span>
                <span className="opacity-75">{p.label}</span>
              </motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/mapa">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-green-900 font-bold px-7 py-3.5 rounded-2xl shadow-xl hover:bg-emerald-50 transition-all text-sm"
              >
                Ver Mapa Interactivo
              </motion.button>
            </Link>
            <Link to="/indicadores">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/10 text-white border border-white/25 backdrop-blur-sm font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/20 transition-all text-sm"
              >
                Indicadores ENSIN 2015
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS — franja oscura con números grandes
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 px-6 py-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800 rounded-2xl overflow-hidden"
        >
          {[
            { value: `${prioritizedRegions.length}`, label: 'Subregiones priorizadas', color: 'text-emerald-400' },
            { value: `${totalFoods}`,                label: 'Alimentos mapeados',       color: 'text-yellow-400' },
            { value: `${categories}`,                label: 'Grupos alimentarios',      color: 'text-teal-400'   },
            { value: `${criticalRegions.length}`,    label: 'Zonas en alerta crítica',  color: 'text-red-400'    },
          ].map(s => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="bg-gray-950 px-6 py-10 text-center"
            >
              <p className={`text-5xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-sm mt-2 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CALLOUT — datos críticos Cesar y Magdalena
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-orange-900 text-white px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12)_0%,transparent_70%)] pointer-events-none" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.10, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-400 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-red-300 mb-4 block"
          >
            ENSIN 2015 — Datos oficiales ICBF
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display mb-4 leading-tight text-balance"
          >
            Una crisis nutricional que requiere<br className="hidden md:block" /> atención urgente
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-white/60 max-w-xl mx-auto mb-12 text-balance"
          >
            Más de la mitad de los hogares colombianos viven con inseguridad alimentaria.
            En Cesar y Magdalena la cifra supera el 64%.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {[
              { val: '66.7%', label: 'Hogares en Magdalena con inseguridad alimentaria', accent: 'border-orange-400' },
              { val: '64.3%', label: 'Hogares en Cesar con inseguridad alimentaria',     accent: 'border-red-400'    },
              { val: '44.5%', label: 'Mujeres gestantes colombianas con deficiencia de hierro',  accent: 'border-pink-400'   },
            ].map(m => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                className={`bg-white/10 backdrop-blur-sm border-t-4 ${m.accent} rounded-2xl p-7`}
              >
                <p className="text-5xl font-bold font-display text-white mb-2">{m.val}</p>
                <p className="text-white/60 text-sm leading-snug">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <Link to="/indicadores">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-red-900 font-bold px-8 py-4 rounded-2xl shadow-xl text-sm hover:bg-red-50 transition-all"
            >
              Ver todos los indicadores oficiales →
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SUBREGIONES PRIORIZADAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold font-display text-gray-900">Subregiones Priorizadas</h2>
              <p className="text-gray-500 text-sm mt-1">Cesar y Magdalena — foco principal del observatorio</p>
            </div>
            <Link to="/mapa" className="text-primary-600 text-sm font-semibold hover:underline hidden sm:block">
              Ver mapa →
            </Link>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {prioritizedRegions.map(region => {
              const alertCfg = NUTRITION_ALERT_CONFIG[region.nutritionAlert ?? 'buena'];
              const accentCls =
                region.nutritionAlert === 'critica'  ? 'border-l-red-400'   :
                region.nutritionAlert === 'moderada' ? 'border-l-amber-400' : 'border-l-green-400';
              return (
                <motion.div key={region.id} variants={fadeUp}>
                  <Link to={`/mapa?region=${region.id}`}>
                    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 border-l-4 ${accentCls} p-5 group hover:-translate-y-1 cursor-pointer`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{region.department}</p>
                          <h3 className="font-bold text-gray-900 font-display mt-0.5 group-hover:text-primary-700 transition-colors">
                            {region.name}
                          </h3>
                        </div>
                        <span
                          className="category-badge text-xs"
                          style={{ backgroundColor: alertCfg.bg, color: alertCfg.color }}
                        >
                          {alertCfg.icon} {alertCfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {region.foods.slice(0, 6).map(food => (
                          <span key={food.id} className="text-lg" title={food.name}>{food.emoji}</span>
                        ))}
                        {region.foods.length > 6 && (
                          <span className="text-xs text-gray-400 self-center">+{region.foods.length - 6}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                        <span>🍽️ {region.menus.length} menús</span>
                        <span>👥 {(region.population / 1000).toFixed(0)}k hab.</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          GUÍAS ICBF — sección teal
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-teal-800 to-emerald-900 text-white px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-300 mb-3 block">
              Guías Alimentarias Basadas en Alimentos
            </span>
            <h2 className="text-3xl font-bold font-display mb-3">GABA — ICBF</h2>
            <p className="text-white/60 max-w-sm mx-auto text-sm leading-relaxed">
              Recomendaciones nutricionales oficiales para las poblaciones más vulnerables.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              { emoji: '🤰', title: 'Mujeres Gestantes', desc: 'Énfasis en folato, hierro y calcio para el desarrollo fetal', path: '/guias' },
              { emoji: '🤱', title: 'Mujeres Lactantes', desc: 'Nutrición para sostener la lactancia y recuperación materna', path: '/guias' },
              { emoji: '👶', title: 'Niñas y niños 6-24 m', desc: 'Introducción de alimentos locales y complementación',         path: '/guias' },
            ].map(g => (
              <motion.div key={g.title} variants={fadeUp}>
                <Link to={g.path}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 flex flex-col gap-4 cursor-pointer hover:bg-white/18 transition-all h-full"
                  >
                    <span className="text-4xl">{g.emoji}</span>
                    <div>
                      <p className="font-bold text-white font-display text-lg">{g.title}</p>
                      <p className="text-white/60 text-sm mt-1.5 leading-relaxed">{g.desc}</p>
                    </div>
                    <span className="text-teal-300 text-xs font-semibold">Ver guía →</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — mapeo comunitario
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-950 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-4 block">
            Mapeo comunitario
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4 text-balance">
            ¿Conoces alimentos o menús de tu región?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
            La comunidad puede mapear menús alimenticios que aún no están identificados.
            Próximamente también por{' '}
            <strong className="text-gray-300">WhatsApp y Telegram</strong>.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/comunidad">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-primary-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-primary-400 transition-all text-sm"
              >
                Contribuir al mapa
              </motion.button>
            </Link>
            <Link to="/alimentos">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/8 text-white border border-white/15 font-semibold px-8 py-4 rounded-2xl hover:bg-white/14 transition-all text-sm"
              >
                Explorar alimentos
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ENTIDADES COOPERANTES
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-t border-gray-200 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block">
              Iniciativa interinstitucional
            </span>
            <h2 className="text-2xl font-bold font-display text-gray-800">
              Entidades Cooperantes
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {[
              {
                sigla:  'ICBF',
                nombre: 'Instituto Colombiano de Bienestar Familiar',
                rol:    'Fuente de datos ENSIN y Guías GABA',
                color:  '#0284c7',
                bg:     '#e0f2fe',
                emoji:  '🏛️',
              },
              {
                sigla:  'CINDE',
                nombre: 'Fundación Centro Internacional de Educación y Desarrollo Humano',
                rol:    'Coordinación y desarrollo del observatorio',
                color:  '#15803d',
                bg:     '#dcfce7',
                emoji:  '🌱',
              },
              {
                sigla:  'UdeA',
                nombre: 'Universidad de Antioquia',
                rol:    'Soporte académico e investigativo',
                color:  '#7c3aed',
                bg:     '#ede9fe',
                emoji:  '🎓',
              },
              {
                sigla:  'Nutrir',
                nombre: 'Nutrir',
                rol:    'Experiencia en seguridad alimentaria regional',
                color:  '#b45309',
                bg:     '#fef3c7',
                emoji:  '🥗',
              },
            ].map(e => (
              <motion.div
                key={e.sigla}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: e.bg }}
                  >
                    {e.emoji}
                  </div>
                  <span className="text-sm font-extrabold tracking-wide" style={{ color: e.color }}>
                    {e.sigla}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 leading-snug">{e.nombre}</p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{e.rol}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Observatorio al Derecho a la Alimentación · Colombia · Datos ENSIN 2015
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ODS — Objetivos de Desarrollo Sostenible
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-gray-100 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 block">
              Agenda 2030 · Naciones Unidas
            </span>
            <h2 className="text-2xl font-bold font-display text-gray-800">
              Objetivos de Desarrollo Sostenible
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Este observatorio contribuye al cumplimiento de tres ODS prioritarios para Colombia
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {[
              {
                num:   2,
                title: 'Hambre Cero',
                desc:  'Poner fin al hambre, lograr la seguridad alimentaria y mejorar la nutrición de gestantes, lactantes y la primera infancia.',
                color: '#DDA63A',
                emoji: '🌾',
              },
              {
                num:   3,
                title: 'Salud y Bienestar',
                desc:  'Garantizar una vida sana y promover el bienestar, reduciendo la anemia, la desnutrición crónica y la mortalidad infantil.',
                color: '#4C9F38',
                emoji: '❤️',
              },
              {
                num:   12,
                title: 'Producción y Consumo Responsables',
                desc:  'Promover patrones sostenibles de producción y consumo basados en alimentos locales de Cesar y Magdalena.',
                color: '#BF8B2E',
                emoji: '♻️',
              },
            ].map(o => (
              <motion.div
                key={o.num}
                variants={fadeUp}
                className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-3 p-5 text-white" style={{ backgroundColor: o.color }}>
                  <span className="text-3xl flex-shrink-0">{o.emoji}</span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">ODS {o.num}</p>
                    <p className="font-bold font-display leading-tight">{o.title}</p>
                  </div>
                </div>
                <div className="p-5 bg-white flex-1">
                  <p className="text-xs text-gray-500 leading-relaxed">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
