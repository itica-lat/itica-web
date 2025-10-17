import React, { useState, useEffect } from 'react';
import { Search, Users, Zap, Globe, Smartphone, Monitor, ArrowRight, CheckCircle, Star, Brain, Target, Clock } from 'lucide-react';
import { siGooglechrome, siApple, siAndroid } from 'simple-icons';

const OpusLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('freelancers');
  const [showHeader, setShowHeader] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Mostrar header después de scrollear más de 300px
      setShowHeader(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <header className={`bg-green-200/20 backdrop-blur-lg border left-1/2 -translate-x-1/2 border-green-100/40 fixed top-5 w-11/12 md:w-7/12 rounded-full z-50 transition-all duration-500 ${
        showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none'
      }`}>
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex justify-center md:justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl md:ml-5 font-bold text-green-400">Opus</span>
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
      <section 
        className={`flex items-center justify-center px-4 transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          height: `${Math.max(100 - scrollY / 20, 70)}vh`,
          paddingTop: `${Math.max(15 - scrollY / 100, 10)}vh`,
          paddingBottom: `${Math.max(15 - scrollY / 100, 10)}vh`,
        }}
      >
        <div 
          className="container mx-auto text-center transition-all duration-500 ease-out"
          style={{
            transform: `scale(${Math.max(1 - scrollY / 4000, 0.92)})`,
            opacity: Math.max(1 - scrollY / 800, 0.5),
          }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-green-400 mb-4 md:mb-6 leading-tight px-4">
              Tú buscas,
              <span className="text-green-300 bg-clip-text"> nosotros encontramos</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-green-200 mb-6 md:mb-8 leading-relaxed px-4">
              La plataforma que conecta freelancers con empresas usando inteligencia artificial. 
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-12 md:py-16 bg-white/15 w-11/12 md:w-6/8 mx-auto rounded-3xl border border-white/40 shadow-lg mb-12 md:mb-0">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className='md:ml-5'>
              <h2 className="text-3xl md:text-4xl font-bold text-green-200 mb-4 md:mb-6">El Problema</h2>
              <p className="text-base md:text-lg text-green-100 mb-6 md:mb-8">
                Muchas veces necesitamos realizar una tarea particular y no queremos dedicar nuestros recursos internos. 
                Los freelancers luchan por encontrar oportunidades, mientras las empresas buscan talento específico.
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-green-100">Dificultad para encontrar freelancers calificados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-green-100">Procesos de selección lentos e ineficientes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm md:text-base text-green-100">Falta de visibilidad para profesionales independientes</span>
                </div>
              </div>
            </div>
            <div className='md:ml-5'>
              <h2 className="text-3xl md:text-4xl font-bold text-green-200 mb-4 md:mb-6">Nuestra Solución</h2>
              <p className="text-base md:text-lg text-green-100 mb-6 md:mb-8">
                Opus conecta freelancers con empresas y particulares que necesiten servicios específicos. 
                Con nuestro sistema de AI Match, automatizamos la búsqueda y selección.
              </p>
              <div className="space-y-3 md:space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm md:text-base text-green-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-200 mb-3 md:mb-4 px-4">
              Características Principales
            </h2>
            <p className="text-base md:text-xl text-green-100 max-w-2xl mx-auto px-4">
              Tecnología de vanguardia para revolucionar el mercado freelance en LATAM
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7/8 mx-auto px-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/30 hover:border-green-200/60 transition-all hover:shadow-lg group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-all">
                  <div className="text-green-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-medium text-green-200 mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-sm md:text-base text-green-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-12 md:py-20 bg-white/15 w-11/12 md:w-6/8 mx-auto rounded-3xl border border-white/40 shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-200 mb-3 md:mb-4 px-4">
              Cómo Funciona
            </h2>
            <p className="text-base md:text-xl text-green-100 px-4">
              Proceso simple y eficiente para todos
            </p>
          </div>
          
          <div className="flex justify-center mb-8 md:mb-10 px-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-1 border border-green-200 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('freelancers')}
                className={`px-4 md:px-6 py-3 md:py-4 rounded-xl cursor-pointer transition-all text-sm md:text-base ${
                  activeTab === 'freelancers' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                Para Freelancers
              </button>
              <button 
                onClick={() => setActiveTab('companies')}
                className={`px-4 md:px-6 py-3 md:py-4 rounded-xl transition-all cursor-pointer text-sm md:text-base ${
                  activeTab === 'companies' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                Para Empresas
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            {activeTab === 'freelancers' && (
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/80 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">1</div>
                  <h3 className="text-lg md:text-xl font-medium text-green-200 mb-2">Crea tu Perfil</h3>
                  <p className="text-sm md:text-base text-green-100">Registra tus habilidades y experiencia profesional</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/80 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">2</div>
                  <h3 className="text-lg md:text-xl font-medium text-green-200 mb-2">AI te Conecta</h3>
                  <p className="text-sm md:text-base text-green-100">Nuestro algoritmo encuentra trabajos perfectos para ti</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/80 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">3</div>
                  <h3 className="text-lg md:text-xl font-medium text-green-200 mb-2">Comienza a Trabajar</h3>
                  <p className="text-sm md:text-base text-green-100">Conecta con clientes y desarrolla proyectos exitosos</p>
                </div>
              </div>
            )}
            
            {activeTab === 'companies' && (
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/80 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">1</div>
                  <h3 className="text-lg md:text-xl font-medium text-green-200 mb-2">Publica tu Proyecto</h3>
                  <p className="text-sm md:text-base text-green-100">Describe qué necesitas y tus requerimientos específicos</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/80 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">2</div>
                  <h3 className="text-lg md:text-xl font-medium text-green-200 mb-2">Recibe Matches</h3>
                  <p className="text-sm md:text-base text-green-100">AI preselecciona los mejores candidatos automáticamente</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/80 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">3</div>
                  <h3 className="text-lg md:text-xl font-medium text-green-200 mb-2">Elige y Contrata</h3>
                  <p className="text-sm md:text-base text-green-100">Selecciona el freelancer ideal y comienza tu proyecto</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-200 mb-3 md:mb-4 px-4">
            Disponible en Todas las Plataformas
          </h2>
          <p className="text-base md:text-xl text-green-100 mb-8 md:mb-12 px-4">
            Accede desde cualquier dispositivo, en cualquier momento
          </p>
          <div className="flex justify-center space-x-12">
            <div className="flex flex-col items-center">
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="w-16 h-16 mb-4 fill-[#4285F4]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={siGooglechrome.path} />
              </svg>
              <span className="text-lg font-medium text-green-100">Web</span>
            </div>
            <div className="flex flex-col items-center">
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="w-16 h-16 mb-4 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={siApple.path} />
              </svg>
              <span className="text-lg font-medium text-green-100">iOS</span>
            </div>
            <div className="flex flex-col items-center">
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="w-16 h-16 mb-4 fill-[#3DDC84]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={siAndroid.path} />
              </svg>
              <span className="text-lg font-medium text-green-100">Android</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:pt-16 md:pb-10 mb-12 md:mb-20 bg-white/15 w-11/12 md:w-6/8 mx-auto rounded-3xl border border-white/40 shadow-lg">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-medium text-green-100 mb-4 md:mb-6 px-4">
            ¿Listo para Revolucionar tu Forma de Trabajar?
          </h2>
          <p className="text-base md:text-xl text-green-100 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Únete a la nueva era del freelancing con inteligencia artificial. 
            Maximiza tu eficiencia y encuentra las mejores oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-100/15 text-green-100 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold">Opus</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs md:text-sm opacity-80">
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