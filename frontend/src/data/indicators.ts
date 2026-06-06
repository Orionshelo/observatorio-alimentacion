// Fuente primaria: ENSIN 2015 – Encuesta Nacional de Situación Nutricional
// ICBF, Ministerio de Salud y Protección Social, INS, DANE, OPS/OMS
// Campo: noviembre 2015 – diciembre 2016 · Muestra: 151.343 personas, 44.202 hogares, 295 municipios

export type AlertLevel = 'critico' | 'moderado' | 'bueno';
export type Tendencia = 'mejora' | 'empeora' | 'estable';
export type UnidadMedida = '%' | 'µg/L' | 'g/dL';

export interface Indicador {
  id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  unidad: UnidadMedida;
  anio: number;
  fuente: string;
  fuenteUrl: string;
  ambito: string;
  alerta: AlertLevel;
  tendencia?: Tendencia;
  valorAnterior?: number;
  anioAnterior?: number;
  nota?: string;
}

const ENSIN_URL = 'https://www.icbf.gov.co/nutricion/ensin-encuesta-nacional-de-situacion-nutricional';
const ENSIN_FUENTE = 'ENSIN 2015 — ICBF / MinSalud / INS / DANE / OPS';

// ─── SECCIÓN 1: GESTANTES Y LACTANTES ────────────────────────────────────────

export const INDICADORES_GESTANTES: Indicador[] = [
  {
    id: 'anemia-gestantes',
    nombre: 'Anemia en mujeres gestantes',
    descripcion:
      'Prevalencia de anemia (hemoglobina baja) en mujeres entre 13 y 49 años en período de gestación. Medida por concentración de hemoglobina ajustada por altitud.',
    valor: 26.2,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'critico',
    nota: '1 de cada 4 mujeres gestantes presenta anemia. Principal causa: deficiencia de hierro.',
  },
  {
    id: 'deficiencia-hierro-gestantes',
    nombre: 'Deficiencia de hierro en mujeres gestantes',
    descripcion:
      'Proporción de gestantes con ferritina sérica < 12 µg/L, indicador de reservas de hierro depletadas. Población evaluada: gestantes entre 13 y 49 años.',
    valor: 44.5,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'critico',
    nota: 'Casi 1 de cada 2 gestantes tiene reservas de hierro insuficientes para cubrir las demandas del embarazo.',
  },
  {
    id: 'ferritina-media-gestantes',
    nombre: 'Concentración media de ferritina sérica en gestantes',
    descripcion:
      'Valor promedio de ferritina sérica en mujeres gestantes colombianas. El umbral de normalidad es ≥ 30 µg/L.',
    valor: 29.3,
    unidad: 'µg/L',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'moderado',
    nota: 'El promedio nacional se encuentra por debajo del umbral de normalidad (30 µg/L).',
  },
  {
    id: 'lactancia-exclusiva',
    nombre: 'Lactancia materna exclusiva en menores de 6 meses',
    descripcion:
      'Proporción de niños y niñas menores de 6 meses alimentados exclusivamente con leche materna, sin agua, jugos ni alimentos complementarios. Indicador clave del Plan Decenal de Lactancia Materna y Alimentación Complementaria 2021–2030.',
    valor: 36.1,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'moderado',
    tendencia: 'mejora',
    nota: 'Meta OMS y Plan Decenal LM 2021–2030: ≥ 50% para 2030. Punto de partida Plan Decenal: 36% en 2021.',
  },
  {
    id: 'lactancia-primera-hora',
    nombre: 'Inicio de lactancia en la primera hora de vida',
    descripcion:
      'Proporción de recién nacidos que reciben lactancia materna durante la primera hora después del parto. La OMS establece como meta el 70% para considerarlo una práctica óptima.',
    valor: 72.0,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'bueno',
    nota: 'Colombia supera la meta de la OMS del 70%. El inicio temprano protege contra mortalidad neonatal.',
  },
];

// ─── SECCIÓN 2: INSEGURIDAD ALIMENTARIA DEL HOGAR (ELCSA) ────────────────────

export const INDICADORES_INSEGURIDAD: Indicador[] = [
  {
    id: 'iah-nacional',
    nombre: 'Inseguridad alimentaria del hogar — Nacional',
    descripcion:
      'Prevalencia de inseguridad alimentaria medida con la Escala Latinoamericana y Caribeña de Seguridad Alimentaria (ELCSA). Incluye niveles leve, moderado y severo. Es el indicador más utilizado por ICBF para aproximarse a la Seguridad y Soberanía Alimentaria.',
    valor: 54.2,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'critico',
    nota: 'Más de la mitad de los hogares colombianos no tiene acceso pleno y permanente a alimentos suficientes, inocuos y nutritivos.',
  },
  {
    id: 'iah-magdalena',
    nombre: 'Inseguridad alimentaria del hogar — Magdalena',
    descripcion:
      'Prevalencia de inseguridad alimentaria (ELCSA) en hogares del departamento de Magdalena. Subregión de énfasis del Observatorio.',
    valor: 66.7,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Magdalena',
    alerta: 'critico',
    nota: '12.5 puntos porcentuales por encima del promedio nacional.',
  },
  {
    id: 'iah-cesar',
    nombre: 'Inseguridad alimentaria del hogar — Cesar',
    descripcion:
      'Prevalencia de inseguridad alimentaria (ELCSA) en hogares del departamento de Cesar. Subregión de énfasis del Observatorio.',
    valor: 64.3,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Cesar',
    alerta: 'critico',
    nota: '10.1 puntos porcentuales por encima del promedio nacional.',
  },
  {
    id: 'iah-sucre',
    nombre: 'Inseguridad alimentaria del hogar — Sucre',
    descripcion:
      'Prevalencia de inseguridad alimentaria (ELCSA) en hogares del departamento de Sucre. Referencia comparativa regional del Caribe colombiano.',
    valor: 73.9,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Sucre',
    alerta: 'critico',
    tendencia: 'empeora',
    valorAnterior: 72.4,
    anioAnterior: 2010,
    nota: 'El departamento del Caribe con mayor inseguridad alimentaria. Aumentó 1.5 pp respecto a 2010.',
  },
  {
    id: 'iah-rural',
    nombre: 'Inseguridad alimentaria — Hogares rurales',
    descripcion:
      'Proporción de hogares en zonas rurales con algún grado de inseguridad alimentaria. La brecha urbano-rural es un indicador de inequidad territorial en el acceso a alimentos.',
    valor: 65.0,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Rural nacional',
    alerta: 'critico',
  },
  {
    id: 'iah-jefatura-femenina',
    nombre: 'Inseguridad alimentaria — Hogares con jefatura femenina',
    descripcion:
      'Los hogares con mujer como jefa de hogar presentan mayor inseguridad alimentaria que los hogares con jefatura masculina (52.0%). Indicador de vulnerabilidad diferenciada por género.',
    valor: 57.6,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'critico',
    nota: 'Brecha de 5.6 pp respecto a jefatura masculina (52.0%). Afecta directamente la nutrición de gestantes y lactantes.',
  },
  {
    id: 'iah-indigena',
    nombre: 'Inseguridad alimentaria — Población indígena',
    descripcion:
      'Prevalencia de inseguridad alimentaria en hogares de comunidades y pueblos indígenas colombianos. Refleja la erosión de sistemas alimentarios propios y la vulneración de la soberanía alimentaria territorial.',
    valor: 77.0,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Pueblos indígenas — Nacional',
    alerta: 'critico',
    nota: '22.8 pp por encima del promedio nacional. El mayor nivel entre todos los grupos étnicos medidos.',
  },
];

// ─── SECCIÓN 3: NIÑEZ < 5 AÑOS ───────────────────────────────────────────────

export const INDICADORES_NINEZ: Indicador[] = [
  {
    id: 'desnutricion-cronica',
    nombre: 'Desnutrición crónica — retraso en talla para la edad',
    descripcion:
      'Proporción de niños y niñas menores de 5 años con talla baja para su edad (puntaje Z < −2 DE). Refleja desnutrición acumulada durante períodos prolongados; la deficiencia en gestación y primeros 2 años es la causa principal.',
    valor: 10.8,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'moderado',
    tendencia: 'mejora',
    valorAnterior: 13.2,
    anioAnterior: 2010,
    nota: 'Redujo 2.4 pp respecto a 2010. El retraso en talla es en gran parte irreversible después de los 2 años.',
  },
  {
    id: 'desnutricion-global',
    nombre: 'Desnutrición global — bajo peso para la edad',
    descripcion:
      'Proporción de niños y niñas menores de 5 años con bajo peso para su edad (puntaje Z < −2 DE). Indicador de resumen del estado nutricional general.',
    valor: 3.7,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'moderado',
    tendencia: 'mejora',
    valorAnterior: 8.6,
    anioAnterior: 1990,
    nota: 'Tendencia sostenida de mejora en 25 años. Redujo 4.9 pp desde 1990.',
  },
  {
    id: 'desnutricion-aguda',
    nombre: 'Desnutrición aguda — bajo peso para la talla',
    descripcion:
      'Proporción de niños y niñas menores de 5 años con peso bajo para su talla (emaciación, puntaje Z < −2 DE). Señala una crisis nutricional reciente y activa; requiere atención inmediata.',
    valor: 2.3,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'moderado',
    tendencia: 'empeora',
    valorAnterior: 0.9,
    anioAnterior: 2010,
    nota: 'ALERTA: aumentó 1.4 pp respecto a 2010 — la única forma de desnutrición que empeoró en el período.',
  },
  {
    id: 'deficiencia-vitamina-a',
    nombre: 'Deficiencia de vitamina A (niños 1–4 años)',
    descripcion:
      'Proporción de niños y niñas entre 1 y 4 años con concentraciones insuficientes de vitamina A en suero. La deficiencia aumenta la mortalidad por enfermedades infecciosas y causa ceguera.',
    valor: 27.3,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'critico',
    nota: '1 de cada 4 niños menores de 5 años presenta esta deficiencia. La lactancia materna exclusiva protege contra ella.',
  },
  {
    id: 'deficiencia-zinc',
    nombre: 'Deficiencia de zinc (niños 1–4 años)',
    descripcion:
      'Proporción de niños y niñas entre 1 y 4 años con concentraciones insuficientes de zinc sérico. El zinc es esencial para el crecimiento, la función inmune y el desarrollo cognitivo.',
    valor: 36.0,
    unidad: '%',
    anio: 2015,
    fuente: ENSIN_FUENTE,
    fuenteUrl: ENSIN_URL,
    ambito: 'Colombia — Nacional',
    alerta: 'critico',
    tendencia: 'mejora',
    valorAnterior: 43.3,
    anioAnterior: 2010,
    nota: 'Redujo 7.3 pp respecto a 2010. Aun así, más de 1 de cada 3 niños presenta esta deficiencia.',
  },
];

// ─── TEXTOS CONTEXTUALES ──────────────────────────────────────────────────────

export const SOBERANIA_ALIMENTARIA_CONTEXTO = {
  definicion:
    'En el marco normativo colombiano, la soberanía alimentaria es el derecho de los pueblos a definir sus propias políticas y estrategias sustentables de producción, distribución y consumo de alimentos (Art. 65, Constitución Política; Ley 101 de 1993). El ICBF la operacionaliza a través del Derecho Humano a la Alimentación Adecuada (DHAA) y la mide principalmente con la Escala Latinoamericana y Caribeña de Seguridad Alimentaria (ELCSA).',
  lactancia:
    'Las Guías Alimentarias Basadas en Alimentos (GABA) del ICBF definen la lactancia materna como "el primer acto de soberanía alimentaria" de un recién nacido. Garantizar la lactancia materna exclusiva durante los primeros 6 meses y complementaria hasta los 2 años es una de las estrategias centrales del Plan Decenal de Lactancia Materna y Alimentación Complementaria 2021–2030.',
  planDecenal:
    'El Plan Decenal de Lactancia Materna y Alimentación Complementaria 2021–2030 (PDLMAC), publicado por el ICBF, establece como punto de partida el 36% de lactancia materna exclusiva en 2021 y fija como meta alcanzar el 50% en 2030, en línea con los Objetivos de Desarrollo Sostenible.',
  fuentePlanDecenal:
    'Plan Decenal de Lactancia Materna y Alimentación Complementaria 2021–2030 — ICBF',
  urlPlanDecenal:
    'https://www.icbf.gov.co/system/files/pdlmac_2021_2030_vf.pdf',
};

export const FUNDACION_NUTRIR_INFO = {
  nombre: 'Fundación Nutrir',
  fundacion: 1986,
  sede: 'Manizales, Villamaría y Chinchiná (Caldas) — Quibdó (Chocó)',
  url: 'https://www.nutrirong.com',
  beneficiarios: '~2.000 niños y niñas',
  comedores: 20,
  coberturaNutricional: '70% de los requerimientos nutricionales diarios',
  programas: ['Comedores Nutrir', 'Gestar Futuro'],
  indicadoresMonitoreados: [
    'Desnutrición crónica (retraso en talla)',
    'Lactancia materna exclusiva',
    'Retraso en talla (stunting)',
  ],
  nota:
    'Fundación Nutrir no publica reportes anuales con indicadores nacionales de acceso público. Su trabajo es de alcance local (Caldas y Chocó). Los indicadores que monitorean se alinean con los estándares del ICBF pero no están disponibles en informes públicos desagregados.',
};
