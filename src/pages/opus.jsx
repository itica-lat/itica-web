import React, { useState, useEffect } from 'react';
import { Search, Users, Zap, Globe, Smartphone, Monitor, ArrowRight, CheckCircle, Star, Brain, Target, Clock } from 'lucide-react';

const OpusLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('freelancers');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Match Inteligente",
      description: "Sistema de inteligencia artificial que preselecciona candidatos y recomienda trabajos automáticamente"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Enfoque LATAM",
      description: "Especializado en el mercado latinoamericano con comprensión local de necesidades"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Ahorro de Tiempo",
      description: "Maximiza tu eficiencia con búsquedas automáticas o manuales según prefieras"
    }
  ];

  const benefits = [
    "Búsqueda potenciada con IA",
    "Perfiles pre-seleccionados",
    "Proceso manual o automático",
    "Mayor exposición profesional",
    "Posicionamiento optimizado",
    "Soporte para recruiters"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01161E] to-emerald-600">
      {/* Header */}
      <header className="bg-green-200/40 backdrop-blur-lg border left-1/2 -translate-x-1/2 border-green-100/40 fixed top-5 w-7/12 rounded-full z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl ml-5 font-bold text-green-200">Opus</span>
            </div>
            <nav className="hidden md:flex space-x-8 mr-5">
              <a href="#features" className="text-green-100 rounded-full hover:text-green-200 hover:bg-emerald-900 p-2 pr-2.5 pl-2.5 transition-all">Características</a>
              <a href="#how-it-works" className="text-green-100 rounded-full hover:text-green-200 hover:bg-emerald-900 p-2 pr-2.5 pl-2.5 transition-all">Cómo Funciona</a>
              <a href="#platforms" className="text-green-100 rounded-full hover:text-green-200 hover:bg-emerald-900 p-2 pr-2.5 pl-2.5  transition-all">Plataformas</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-green-400 mb-6 leading-tight">
              Tú buscas,
              <span className="text-green-300 bg-clip-text"> nosotros encontramos</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-200 mb-8 leading-relaxed">
              La plataforma que conecta freelancers con empresas usando inteligencia artificial. 
              Encuentra el talento perfecto o el trabajo ideal con un solo clic.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 bg-white/15 w-7/8 mx-auto rounded-3xl border border-white/40 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-green-200 mb-6">El Problema</h2>
              <p className="text-lg text-green-100 mb-8">
                Muchas veces necesitamos realizar una tarea particular y no queremos dedicar nuestros recursos internos. 
                Los freelancers luchan por encontrar oportunidades, mientras las empresas buscan talento específico.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-green-100">Dificultad para encontrar freelancers calificados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-green-100">Procesos de selección lentos e ineficientes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-green-100">Falta de visibilidad para profesionales independientes</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-green-200 mb-6">Nuestra Solución</h2>
              <p className="text-lg text-green-100 mb-8">
                Opus conecta freelancers con empresas y particulares que necesiten servicios específicos. 
                Con nuestro sistema de AI Match, automatizamos la búsqueda y selección.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-200 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Tecnología de vanguardia para revolucionar el mercado freelance en LATAM
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-sm p-8 rounded-2xl border border-white/30 hover:border-green-200/60 transition-all hover:shadow-lg group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-all">
                  <div className="text-green-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-200 mb-4">{feature.title}</h3>
                <p className="text-green-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white/15 w-7/8 mx-auto rounded-3xl border border-white/40 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-200 mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-green-100">
              Proceso simple y eficiente para todos
            </p>
          </div>
          
          <div className="flex justify-center mb-10">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-1 border border-green-200">
              <button 
                onClick={() => setActiveTab('freelancers')}
                className={`px-6 py-3 rounded-lg cursor-pointer transition-all ${
                  activeTab === 'freelancers' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white mr-5 md:mr-0' 
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                Para Freelancers
              </button>
              <button 
                onClick={() => setActiveTab('companies')}
                className={`px-6 py-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'companies' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white ml-5 md:ml-0' 
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                Para Empresas
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === 'freelancers' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Crea tu Perfil</h3>
                  <p className="text-green-100">Registra tus habilidades y experiencia profesional</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">AI te Conecta</h3>
                  <p className="text-green-100">Nuestro algoritmo encuentra trabajos perfectos para ti</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Comienza a Trabajar</h3>
                  <p className="text-green-100">Conecta con clientes y desarrolla proyectos exitosos</p>
                </div>
              </div>
            )}
            
            {activeTab === 'companies' && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Publica tu Proyecto</h3>
                  <p className="text-green-100">Describe qué necesitas y tus requerimientos específicos</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Recibe Matches</h3>
                  <p className="text-green-100">AI preselecciona los mejores candidatos automáticamente</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Elige y Contrata</h3>
                  <p className="text-green-100">Selecciona el freelancer ideal y comienza tu proyecto</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-green-200 mb-4">
            Disponible en Todas las Plataformas
          </h2>
          <p className="text-xl text-green-100 mb-12">
            Accede desde cualquier dispositivo, en cualquier momento
          </p>
          <div className="flex justify-center space-x-12">
            <div className="flex flex-col items-center">
              <Monitor className="w-16 h-16 text-green-400 mb-4" />
              <span className="text-lg font-semibold text-green-100">Web</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-16 h-16 text-green-400 mb-4" />
              <span className="text-lg font-semibold text-green-100">iOS</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-16 h-16 text-green-400 mb-4" />
              <span className="text-lg font-semibold text-green-100">Android</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-16 pb-10 mb-20 bg-white/15 w-7/8 mx-auto rounded-3xl border border-white/40 shadow-lg">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-green-100 mb-6">
            ¿Listo para Revolucionar tu Forma de Trabajar?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a la nueva era del freelancing con inteligencia artificial. 
            Maximiza tu eficiencia y encuentra las mejores oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-100/15 text-green-100 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl font-bold">Opus</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm opacity-80">
                © 2025 Opus. Conectando talento con oportunidades en LATAM.
              </p>
              <p className="text-xs opacity-60 mt-1">
                "You search, we find" | "Tú buscas, nosotros encontramos"
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OpusLanding;