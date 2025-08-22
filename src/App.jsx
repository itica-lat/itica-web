import { useState, useEffect } from 'react';
import { ChevronDown, Brain, Globe, Code, Users, ArrowRight, Menu, X, Star, CheckCircle } from 'lucide-react';
import { useTypingEffect } from './hooks/typingEffect';
import { useScrollAnimation } from './hooks/scrollAnimations';
import { AnimatedElement } from './components/AnimatedElement';
import IticaLogo from './assets/Itica_Logo_Invertido.png';
import services from './data/services.json';
import { Icon } from './components/Icon';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import WaitlistPage from './pages/waitlist';
import ContactPage from './pages/contact';
import OpusPage from './pages/opus';

// Componente principal de la página de inicio
function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    { name: "Opus", description: "Plataforma de hiring autonomo", tech: "AI/ML", link: "/opus" },
  ];

  const frases = ["transciende", "mejora", "potencia", "transforma"];
  
  const textoAnimado = useTypingEffect(frases, {
    velocidadEscritura: 120,
    velocidadBorrado: 60,
    pausaEntreFrames: 2500,
    fraseAleatoria: true
  });

  const handleWaitlistClick = () => {
    navigate('/waitlist');
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleOpusClick = () => {
    navigate('/opus')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01161E] to-emerald-950">
      {/* Navigation */}
      <nav className={`fixed w-7/12 z-50 transition-all rounded-4xl duration-300 left-1/2 -translate-x-1/2 backdrop-blur-lg shadow-lg border-1 border-white/20 mt-5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={IticaLogo} alt="Logo Itica" className='w-10 h-10' />
              <span className="text-2xl font-bold bg-slate-300 bg-clip-text text-transparent">
                Itica
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-200 hover:text-emerald-600 transition-colors">Inicio</a>
              <a href="#servicios" className="text-gray-200 hover:text-emerald-600 transition-colors">Servicios</a>
              <a href="#proyectos" className="text-gray-200 hover:text-emerald-600 transition-colors">Proyectos</a>
              <a href="#contacto" className="text-gray-200 hover:text-emerald-600 transition-colors">Contacto</a>
              <Link 
                to="/waitlist"
                className="bg-emerald-600/80 text-white px-6 py-2 rounded-full hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-emerald-600"
              >
                Únete a Opus
              </Link>
            </div>

            <button 
              className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-lg border-t border-white/20">
            <div className="px-4 py-4 space-y-3">
              <a href="#inicio" className="block text-gray-200 hover:text-emerald-600 transition-colors py-2">Inicio</a>
              <a href="#servicios" className="block text-gray-200 hover:text-emerald-600 transition-colors py-2">Servicios</a>
              <a href="#proyectos" className="block text-gray-200 hover:text-emerald-600 transition-colors py-2">Proyectos</a>
              <a href="#contacto" className="block text-gray-200 hover:text-emerald-600 transition-colors py-2">Contacto</a>
              <Link 
                to="/waitlist"
                className="block w-full bg-emerald-600 text-white px-6 py-3 rounded-full mt-4 text-center"
              >
                Únete a Opus
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20 mb-8 shadow-lg">
              <Star className="w-4 h-4 text-emerald-500 mr-2" />
              <span className="text-sm font-medium text-gray-200">Especialistas en AI para LATAM</span>
            </div>
            
            <AnimatedElement animation="scale" delay={300} threshold={0.1} triggerOnce={true}>
              <h1 className="cursor-default text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-700 to-emerald-600 bg-clip-text text-transparent leading-tight">
                Innovación que
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text">{textoAnimado}<span className="animate-pulse">|</span></span>
              </h1>
            </AnimatedElement>
            
            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Desarrollamos soluciones de software de vanguardia con inteligencia artificial, 
              especialmente diseñadas para impulsar el crecimiento tecnológico en América Latina.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleContactClick}
                className="group bg-emerald-600 cursor-pointer text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Contáctanos
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-gray-200 px-8 py-4 rounded-full font-medium hover:bg-white/40 cursor-pointer transition-all duration-300 border border-white/20">
                Conocer servicios
              </button>
            </div>
          </div>

          {/* Floating Cards */}
          <AnimatedElement animation='fadeInUp' delay={600} threshold={0.1} triggerOnce={true}>
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              {[
                { icon: <Brain className="w-6 h-6" />, title: "AI-First", desc: "Desarrollo centrado en IA" },
                { icon: <Globe className="w-6 h-6" />, title: "LATAM Focus", desc: "Soluciones para la región" },
                { icon: <Code className="w-6 h-6" />, title: "Calidad Premium", desc: "Estándares internacionales" }
              ].map((item, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-200 mb-2">{item.title}</h3>
                  <p className="text-gray-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8">
        <AnimatedElement animation='scale' delay={300} threshold={0.1} triggerOnce={true}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gray-200 bg-clip-text text-transparent">
                Nuestros Servicios
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Transformamos ideas en soluciones tecnológicas que impulsan el futuro digital de América Latina
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {services.services.map((service, i) => (
                <div key={i} className="group bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
                  <div className="w-16 h-16 bg-slate-800/70 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={service.icon} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-200 mb-4">{service.title}</h3>
                  <p className="text-gray-200 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedElement>
      </section>

      {/* Projects Section */}
      <section id="proyectos" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gray-200 bg-clip-text text-transparent">
              Proyectos Destacados
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Cada proyecto lleva el nombre de figuras clásicas que representan sabiduría, innovación y excelencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <div key={i} className="group bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-200 group-hover:text-emerald-600 transition-colors">
                    {project.name}
                  </h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {project.tech}
                  </span>
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed">{project.description}</p>
                <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-2 transition-transform">
                  <button onClick={handleOpusClick} className='hover:cursor-pointer'>Ver detalles</button>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-200 bg-clip-text">
            ¿Listo para innovar?
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Conversemos sobre cómo podemos transformar tu visión en realidad tecnológica
          </p>
          
          <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-200 mb-4">Hablemos de tu proyecto</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-200">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Consulta inicial gratuita</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Propuesta técnica detallada</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    <span>Metodología ágil y transparente</span>
                  </div>
                </div>
              </div>
              
              <div>
                <button 
                  onClick={handleContactClick}
                  className="w-full cursor-pointer bg-emerald-500 text-white px-8 py-4 rounded-2xl font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Contáctanos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src={IticaLogo} alt="Itica Logo" className="w-18 h-18" />
              <span className="text-2xl font-bold">Itica</span>
            </Link>
            
            <div className="text-center md:text-right">
              <p className="text-slate-400 mb-2">Innovación tecnológica para América Latina</p>
              <p className="text-slate-500 text-sm">© 2025 Itica. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente principal con Router
export default function IticaWebsite() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal - página de inicio */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta de la waitlist */}
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/opus' element={<OpusPage />} />
        
        {/* Ruta 404 - página no encontrada */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#01161E] to-emerald-950">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
              <p className="text-xl text-gray-200 mb-6">Página no encontrada</p>
              <Link 
                to="/" 
                className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}