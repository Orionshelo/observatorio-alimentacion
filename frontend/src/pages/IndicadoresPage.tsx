import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  INDICADORES_GESTANTES,
  INDICADORES_INSEGURIDAD,
  INDICADORES_NINEZ,
  SOBERANIA_ALIMENTARIA_CONTEXTO,
} from '../data/indicators';
import type { Indicador, AlertLevel, Tendencia } from '../data/indicators';

// ─── Sub-componentes ──────────────────────────────────────────────────────────

const ALERT_CFG: Record<AlertLevel, { bg: string; border: string; text: string; badge: string; badgeText: string; dot: string }> = {
  critico:  { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-100',    badgeText: 'text-red-700',    dot: 'bg-red-500'   },
  moderado: { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100',  badgeText: 'text-amber-700',  dot: 'bg-amber-500' },
  bueno:    { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100',  badgeText: 'text-green-700',  dot: 'bg-green-500' },
};

const ALERT_LABEL: Record<AlertLevel, string> = {
  critico:  'Situación crítica',
  moderado: 'Situación moderada',
  bueno:    'Situación favorable',
};

function TendenciaTag({ t, anterior, anioAnterior }: { t: Tendencia; anterior?: number; anioAnterior?: number }) {
  const cfg = {
    mejora:   { icon: '↓', label: 'Mejora', cls: 'text-green-600 bg-green-50' },
    empeora:  { icon: '↑', label: 'Empeora', cls: 'text-red-600 bg-red-50' },
    estable:  { icon: '→', label: 'Estable', cls: 'text-gray-500 bg-gray-100' },
  }[t];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
      {anterior !== undefined && anioAnterior !== undefined && (
        <span className="font-normal opacity-75">vs {anterior}% ({anioAnterior})</span>
      )}
    </span>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

function IndicadorCard({ ind, index }: { ind: Indicador; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = ALERT_CFG[ind.alerta];
  const isPercent = ind.unidad === '%';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">{ind.nombre}</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge} ${cfg.badgeText}`}>
          {ALERT_LABEL[ind.alerta]}
        </span>
      </div>

      <div className="flex items-end gap-2 mt-2">
        <span className={`text-3xl font-bold font-display ${cfg.text}`}>
          {ind.valor.toLocaleString('es-CO')}
        </span>
        <span className={`text-base font-semibold ${cfg.text} mb-0.5`}>{ind.unidad}</span>
        <span className="text-xs text-gray-400 mb-1 ml-1">· {ind.anio}</span>
      </div>

      {isPercent && (
        <ProgressBar
          value={ind.valor}
          color={
            ind.alerta === 'critico' ? 'bg-red-400' :
            ind.alerta === 'moderado' ? 'bg-amber-400' : 'bg-green-400'
          }
        />
      )}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="text-xs text-gray-500 bg-white/70 px-2 py-0.5 rounded-full border border-gray-200">
          📍 {ind.ambito}
        </span>
        {ind.tendencia && (
          <TendenciaTag
            t={ind.tendencia}
            anterior={ind.valorAnterior}
            anioAnterior={ind.anioAnterior}
          />
        )}
      </div>

      <button
        onClick={() => setExpanded(v => !v)}
        className="text-xs text-gray-400 hover:text-gray-600 mt-2 transition-colors"
      >
        {expanded ? '▲ Menos detalle' : '▼ Ver definición'}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 space-y-1.5 border-t border-white/60 pt-2"
        >
          <p className="text-xs text-gray-600 leading-relaxed">{ind.descripcion}</p>
          {ind.nota && (
            <p className="text-xs font-medium text-gray-700 bg-white/70 rounded-lg px-3 py-2 border border-white">
              💡 {ind.nota}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Fuente:{' '}
            <a href={ind.fuenteUrl} target="_blank" rel="noreferrer" className="underline hover:text-gray-600">
              {ind.fuente}
            </a>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-3xl mt-0.5">{emoji}</span>
      <div>
        <h2 className="text-xl font-bold font-display text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Datos resumen para el encabezado ─────────────────────────────────────────

const KEY_METRICS = [
  { label: 'Gestantes con anemia',           value: '26.2%', alerta: 'critico'  as AlertLevel, desc: 'Nacional · ENSIN 2015' },
  { label: 'Lactancia materna exclusiva',     value: '36.1%', alerta: 'moderado' as AlertLevel, desc: '< 6 meses · Nacional' },
  { label: 'Inseguridad alimentaria hogar',   value: '54.2%', alerta: 'critico'  as AlertLevel, desc: 'Nacional · ENSIN 2015' },
  { label: 'Inseguridad alimentaria Cesar',   value: '64.3%', alerta: 'critico'  as AlertLevel, desc: 'Departamento priorizado' },
  { label: 'Inseguridad alimentaria Magdalena', value: '66.7%', alerta: 'critico' as AlertLevel, desc: 'Departamento priorizado' },
  { label: 'Desnutrición crónica < 5 años',  value: '10.8%', alerta: 'moderado' as AlertLevel, desc: 'Nacional · ENSIN 2015' },
];

// ─── Comparación departamental ────────────────────────────────────────────────

const DEPT_DATA = [
  { nombre: 'Sucre',      valor: 73.9, isPrioritized: false },
  { nombre: 'Magdalena',  valor: 66.7, isPrioritized: true  },
  { nombre: 'Cesar',      valor: 64.3, isPrioritized: true  },
  { nombre: 'Rural Nal.', valor: 65.0, isPrioritized: false },
  { nombre: 'Nacional',   valor: 54.2, isPrioritized: false },
];

function DeptBar({ nombre, valor, isPrioritized, index }: { nombre: string; valor: number; isPrioritized: boolean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center gap-3"
    >
      <span className={`text-sm font-medium w-24 flex-shrink-0 text-right ${isPrioritized ? 'text-primary-700 font-bold' : 'text-gray-600'}`}>
        {isPrioritized && '★ '}{nombre}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${valor}%` }}
          transition={{ duration: 1, delay: index * 0.08, ease: 'easeOut' }}
          className={`h-full rounded-full flex items-center justify-end pr-2 ${isPrioritized ? 'bg-red-500' : 'bg-red-300'}`}
        >
          <span className="text-xs font-bold text-white">{valor}%</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function IndicadoresPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">

      {/* ── Encabezado ── */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full">
            ENSIN 2015 · ICBF
          </span>
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
            Solo datos de fuentes originales verificadas
          </span>
        </div>
        <h1 className="text-3xl font-bold font-display text-gray-900">
          Indicadores Nutricionales Oficiales
        </h1>
        <p className="text-gray-500 mt-1 max-w-2xl">
          Soberanía alimentaria, mujeres gestantes y lactantes — Colombia con énfasis en Cesar y Magdalena.
        </p>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-semibold">Sobre las fuentes de datos</p>
            <p className="mt-0.5 text-amber-700">
              Todos los indicadores provienen de fuentes oficiales publicadas. La{' '}
              <a href="https://www.icbf.gov.co/nutricion/ensin-encuesta-nacional-de-situacion-nutricional"
                 target="_blank" rel="noreferrer" className="underline font-medium">ENSIN 2015
              </a>{' '}
              es la Encuesta Nacional de Situación Nutricional más reciente con datos públicos completos
              disponibles del ICBF (campo noviembre 2015 – diciembre 2016; muestra 151.343 personas en 295 municipios).
              No se incluyen estimaciones propias ni datos sin fuente verificable.
            </p>
          </div>
        </div>
      </div>

      {/* ── Métricas clave ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Indicadores destacados
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {KEY_METRICS.map((m, i) => {
            const cfg = ALERT_CFG[m.alerta];
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}
              >
                <p className={`text-2xl font-bold font-display ${cfg.text}`}>{m.value}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-tight">{m.label}</p>
                <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── SECCIÓN: Soberanía Alimentaria ── */}
      <section className="space-y-4">
        <SectionHeader
          emoji="🌾"
          title="Soberanía Alimentaria en Colombia"
          subtitle="Marco normativo e indicadores según ICBF"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Marco normativo</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {SOBERANIA_ALIMENTARIA_CONTEXTO.definicion}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
              Lactancia materna como soberanía alimentaria
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {SOBERANIA_ALIMENTARIA_CONTEXTO.lactancia}
            </p>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-primary-900 text-sm">
                Plan Decenal de Lactancia Materna y Alimentación Complementaria 2021–2030
              </p>
              <p className="text-sm text-primary-700 mt-1 leading-relaxed">
                {SOBERANIA_ALIMENTARIA_CONTEXTO.planDecenal}
              </p>
              <a
                href={SOBERANIA_ALIMENTARIA_CONTEXTO.urlPlanDecenal}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary-600 underline mt-2 inline-block hover:text-primary-800"
              >
                Ver documento oficial ICBF →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN: Gestantes y Lactantes ── */}
      <section className="space-y-4">
        <SectionHeader
          emoji="🤰"
          title="Gestantes y Lactantes"
          subtitle="Indicadores nutricionales — ENSIN 2015, Colombia"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INDICADORES_GESTANTES.map((ind, i) => (
            <IndicadorCard key={ind.id} ind={ind} index={i} />
          ))}
        </div>
      </section>

      {/* ── SECCIÓN: Inseguridad Alimentaria ── */}
      <section className="space-y-4">
        <SectionHeader
          emoji="🏘️"
          title="Inseguridad Alimentaria del Hogar"
          subtitle="Escala ELCSA — ENSIN 2015, con énfasis en Cesar y Magdalena"
        />

        {/* Comparación por departamento */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Comparación departamental — Inseguridad alimentaria (ELCSA)
          </p>
          <div className="space-y-3">
            {DEPT_DATA.map((d, i) => (
              <DeptBar key={d.nombre} {...d} index={i} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
            ★ Subregiones priorizadas del Observatorio · Fuente: ENSIN 2015 — ICBF
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INDICADORES_INSEGURIDAD.map((ind, i) => (
            <IndicadorCard key={ind.id} ind={ind} index={i} />
          ))}
        </div>
      </section>

      {/* ── SECCIÓN: Niñez ── */}
      <section className="space-y-4">
        <SectionHeader
          emoji="👶"
          title="Niñez menor de 5 años"
          subtitle="Desnutrición y deficiencia de micronutrientes — ENSIN 2015"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INDICADORES_NINEZ.map((ind, i) => (
            <IndicadorCard key={ind.id} ind={ind} index={i} />
          ))}
        </div>
      </section>

      {/* ── Pie de fuentes ── */}
      <section className="bg-gray-900 rounded-2xl p-6 text-white space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Referencias bibliográficas</p>

        <div className="space-y-3">
          {[
            {
              num: '1',
              cita: 'Instituto Colombiano de Bienestar Familiar (ICBF), Ministerio de Salud y Protección Social, Instituto Nacional de Salud, DANE, OPS/OMS.',
              titulo: 'Encuesta Nacional de Situación Nutricional — ENSIN 2015.',
              detalle: 'Bogotá, Colombia, 2019. Muestra: 151.343 personas · 44.202 hogares · 295 municipios.',
              url: 'https://www.icbf.gov.co/nutricion/ensin-encuesta-nacional-de-situacion-nutricional',
            },
            {
              num: '2',
              cita: 'Instituto Colombiano de Bienestar Familiar (ICBF).',
              titulo: 'Plan Decenal de Lactancia Materna y Alimentación Complementaria 2021–2030 (PDLMAC).',
              detalle: 'Bogotá, Colombia, 2021.',
              url: 'https://www.icbf.gov.co/system/files/pdlmac_2021_2030_vf.pdf',
            },
            {
              num: '3',
              cita: 'Instituto Colombiano de Bienestar Familiar (ICBF).',
              titulo: 'Guías Alimentarias Basadas en Alimentos (GABA) para la Población Colombiana.',
              detalle: 'Ediciones para gestantes, lactantes y niños menores de 2 años.',
              url: 'https://www.icbf.gov.co/guias-alimentarias-basadas-en-alimentos-para-la-poblacion-colombiana-mayor-de-2-anos',
            },
          ].map(ref => (
            <div key={ref.num} className="flex gap-3 text-sm">
              <span className="text-gray-500 font-mono text-xs mt-0.5 flex-shrink-0">[{ref.num}]</span>
              <div>
                <span className="text-gray-300">{ref.cita} </span>
                <span className="text-white font-medium italic">{ref.titulo} </span>
                <span className="text-gray-400">{ref.detalle} </span>
                <a href={ref.url} target="_blank" rel="noreferrer" className="text-primary-400 underline hover:text-primary-300 text-xs">
                  {ref.url}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 border-t border-gray-700 pt-3">
          Este observatorio no produce datos propios. Todos los indicadores provienen de fuentes oficiales verificables.
          Para consultar datos actualizados, visitar el{' '}
          <a href="https://suin.icbf.gov.co" target="_blank" rel="noreferrer" className="underline text-gray-400 hover:text-white">
            Sistema SUIN del ICBF
          </a>.
        </p>
      </section>
    </div>
  );
}
