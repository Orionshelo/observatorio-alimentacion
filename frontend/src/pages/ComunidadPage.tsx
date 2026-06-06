import MenuSubmissionForm from '../components/Community/MenuSubmissionForm';

export default function ComunidadPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Mapeo Comunitario</h1>
        <p className="text-gray-500 mt-1">
          Contribuye a identificar menús y alimentos de tu región que aún no están en el observatorio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-3">
          <MenuSubmissionForm />
        </div>

        {/* Info lateral */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cómo funciona */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 font-display mb-3">¿Cómo funciona?</h3>
            <div className="space-y-3">
              {[
                { n: '1', title: 'Describe el menú',  desc: 'Ingresa el nombre, descripción y alimentos que lo componen.', emoji: '✍️' },
                { n: '2', title: 'Selecciona tu zona', desc: 'Indica en qué región o subregión se consume este menú.',      emoji: '📍' },
                { n: '3', title: 'Revisión del equipo', desc: 'Nuestro equipo valida y lo integra al mapa.',               emoji: '✅' },
                { n: '4', title: 'Aparece en el mapa', desc: 'El menú queda disponible para toda la comunidad.',           emoji: '🗺️' },
              ].map(step => (
                <div key={step.n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {step.n}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{step.emoji} {step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canal de mensajería */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
            <h3 className="font-bold text-gray-900 font-display mb-1">
              📱 Bot de captura de datos
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Próximamente podrás reportar el estado de alimentación de niños y gestantes
              directamente por WhatsApp o Telegram.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-green-100">
                <span className="text-xl">💬</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">WhatsApp Bot</p>
                  <p className="text-xs text-gray-500">Reporta en 3 preguntas simples</p>
                </div>
                <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Pronto</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-green-100">
                <span className="text-xl">✈️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Telegram Bot</p>
                  <p className="text-xs text-gray-500">Canal seguro y confidencial</p>
                </div>
                <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Pronto</span>
              </div>
            </div>
          </div>

          {/* Privacidad */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-xs text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">🔒 Privacidad y seguridad</p>
            <p>
              Los datos recopilados son utilizados únicamente para el monitoreo del derecho a la alimentación.
              El contacto es opcional y nunca se comparte con terceros. Cumplimos la Ley 1581 de 2012
              (Habeas Data, Colombia).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
