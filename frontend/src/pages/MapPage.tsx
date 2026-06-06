import ColombiaMap from '../components/Map/ColombiaMap';
import NutritionRadar from '../components/Charts/NutritionRadar';
import RegionBarChart from '../components/Charts/RegionBarChart';
import { SUBREGIONS } from '../data/regions';

const prioritizedFoods = SUBREGIONS.filter(r => r.isPrioritized).flatMap(r => r.foods);

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Mapa Alimentario</h1>
        <p className="text-gray-500 mt-1">
          Visualización georreferenciada de alimentos nutritivos por región · Énfasis en Cesar y Magdalena
        </p>
      </div>

      <ColombiaMap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RegionBarChart />
        <NutritionRadar
          foods={prioritizedFoods}
          title="Perfil Nutricional – Cesar y Magdalena"
        />
      </div>
    </div>
  );
}
