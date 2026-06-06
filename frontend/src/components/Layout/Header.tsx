import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Leaf, BarChart2, Users, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/',            label: 'Inicio',      Icon: Home      },
  { path: '/mapa',        label: 'Mapa',        Icon: Map       },
  { path: '/alimentos',   label: 'Alimentos',   Icon: Leaf      },
  { path: '/indicadores', label: 'Indicadores', Icon: BarChart2 },
  { path: '/comunidad',   label: 'Comunidad',   Icon: Users     },
  { path: '/guias',       label: 'Guías ICBF',  Icon: BookOpen  },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-9 h-9 rounded-xl bg-food-gradient flex items-center justify-center shadow-md"
            >
              <Leaf size={18} className="text-white" strokeWidth={2} />
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 font-display leading-tight">Observatorio</p>
              <p className="text-xs text-primary-600 font-medium leading-tight">Derecho a la Alimentación</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-0.5">
            {NAV_ITEMS.map(({ path, label, Icon }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon
                      size={15}
                      strokeWidth={active ? 2.5 : 1.75}
                      className="flex-shrink-0"
                    />
                    <span className="hidden lg:inline">{label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Badge */}
          <div className="hidden xl:flex items-center gap-2 bg-primary-50 px-3 py-1.5 rounded-full flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-slow" />
            <span className="text-xs font-semibold text-primary-700">ICBF – CINDE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
