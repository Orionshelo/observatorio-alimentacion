import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import AlimentosPage from './pages/AlimentosPage';
import ComunidadPage from './pages/ComunidadPage';
import GuiasPage from './pages/GuiasPage';
import IndicadoresPage from './pages/IndicadoresPage';
import RevisionPage from './pages/RevisionPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pb-12">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/mapa"      element={<MapPage />} />
            <Route path="/alimentos" element={<AlimentosPage />} />
            <Route path="/indicadores" element={<IndicadoresPage />} />
            <Route path="/comunidad" element={<ComunidadPage />} />
            <Route path="/guias"     element={<GuiasPage />} />
            <Route path="/equipo/revision" element={<RevisionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
