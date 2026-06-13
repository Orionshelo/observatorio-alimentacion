import ColombiaMap from '../components/Map/ColombiaMap';
import NutritionRadar from '../components/Charts/NutritionRadar';
import RegionBarChart from '../components/Charts/RegionBarChart';
import PageHeader from '../components/Layout/PageHeader';
import { SUBREGIONS } from '../data/regions';

const prioritizedFoods = SUBREGIONS.filter(r => r.isPrioritized).flatMap(r => r.foods);

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        eyebrow="Geolocalización"
        emoji="🗺️"
        title="Mapa Alimentario"
        subtitle="Visualización georreferenciada de alimentos nutritivos por región · Énfasis en Cesar y Magdalena."
      />

      <ColombiaMap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RegionBarChart />
        <NutritionRadar
          foods={prioritizedFoods}
          title="Perfil Nutricional – Cesar y Magdalena"
          description="Este radar agrupa los alimentos priorizados en las seis subregiones de Cesar y Magdalena y promedia su aporte de seis nutrientes clave. Sirve para detectar de un vistazo las fortalezas nutricionales del territorio (ejes que llegan al borde exterior) y los vacíos que requieren mayor atención (ejes más cortos), información que orienta las recomendaciones de la Guía ICBF–UdeA para gestantes, madres lactantes y niñas y niños de 6 a 24 meses en la región."
        />
      </div>
    </div>
  );
}
