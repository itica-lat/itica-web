import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Briefcase, Users, Globe } from 'lucide-react';
import CustomForm from '../components/CustomForm';

const ITIPage = () => {
  const [activeTab, setActiveTab] = useState('ideas');

  // Form configurations
  const ideasFormFields = [
    {
      name: 'nombre',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      placeholder: 'Tu nombre completo'
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
      placeholder: 'tu@email.com'
    },
    {
      name: 'empresa',
      label: 'Empresa/Organización',
      type: 'text',
      placeholder: 'Nombre de tu empresa (opcional)'
    },
    {
      name: 'categoria',
      label: 'Categoría de la idea',
      type: 'select',
      required: true,
      options: [
        { value: 'ai-ml', label: 'Inteligencia Artificial / Machine Learning' },
        { value: 'web-mobile', label: 'Desarrollo Web / Mobile' },
        { value: 'automation', label: 'Automatización de procesos' },
        { value: 'data-analytics', label: 'Análisis de datos' },
        { value: 'fintech', label: 'Tecnología financiera' },
        { value: 'healthcare', label: 'Salud y tecnología' },
        { value: 'education', label: 'Tecnología educativa' },
        { value: 'other', label: 'Otra categoría' }
      ],
      placeholder: 'Selecciona una categoría'
    },
    {
      name: 'titulo',
      label: 'Título de la idea',
      type: 'text',
      required: true,
      placeholder: 'Resumen corto de tu idea'
    },
    {
      name: 'descripcion',
      label: 'Descripción detallada',
      type: 'textarea',
      required: true,
      rows: 6,
      placeholder: 'Describe tu idea en detalle: problema que resuelve, solución propuesta, mercado objetivo...'
    },
    {
      name: 'presupuesto',
      label: 'Presupuesto estimado (USD)',
      type: 'select',
      required: true,
      options: [
        { value: '1000-5000', label: '$1,000 - $5,000' },
        { value: '5000-15000', label: '$5,000 - $15,000' },
        { value: '15000-50000', label: '$15,000 - $50,000' },
        { value: '50000-100000', label: '$50,000 - $100,000' },
        { value: '100000+', label: 'Más de $100,000' },
        { value: 'no-definido', label: 'No definido aún' }
      ],
      placeholder: 'Selecciona un rango de presupuesto'
    },
    {
      name: 'timeline',
      label: 'Cronograma deseado',
      type: 'select',
      required: true,
      options: [
        { value: '1-3-meses', label: '1-3 meses' },
        { value: '3-6-meses', label: '3-6 meses' },
        { value: '6-12-meses', label: '6-12 meses' },
        { value: '12+-meses', label: 'Más de 12 meses' },
        { value: 'flexible', label: 'Flexible' }
      ],
      placeholder: 'Selecciona un cronograma'
    },
    {
      name: 'comentarios',
      label: 'Comentarios adicionales',
      type: 'textarea',
      rows: 3,
      placeholder: 'Cualquier información adicional que consideres relevante...'
    }
  ];

  const jobsFormFields = [
    {
      name: 'nombre',
      label: 'Nombre completo',
      type: 'text',
      required: true,
      placeholder: 'Tu nombre completo'
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
      placeholder: 'tu@email.com'
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'tel',
      required: true,
      placeholder: '+1234567890'
    },
    {
      name: 'ubicacion',
      label: 'Ubicación',
      type: 'text',
      required: true,
      placeholder: 'Ciudad, País'
    },
    {
      name: 'posicion',
      label: 'Posición de interés',
      type: 'select',
      required: true,
      options: [
        { value: 'fullstack-developer', label: 'Desarrollador Full Stack' },
        { value: 'frontend-developer', label: 'Desarrollador Frontend' },
        { value: 'backend-developer', label: 'Desarrollador Backend' },
        { value: 'ai-ml-engineer', label: 'Ingeniero AI/ML' },
        { value: 'devops-engineer', label: 'Ingeniero DevOps' },
        { value: 'ui-ux-designer', label: 'Diseñador UI/UX' },
        { value: 'product-manager', label: 'Product Manager' },
        { value: 'data-scientist', label: 'Data Scientist' },
        { value: 'mobile-developer', label: 'Desarrollador Mobile' },
        { value: 'other', label: 'Otra posición' }
      ],
      placeholder: 'Selecciona la posición'
    },
    {
      name: 'nivel',
      label: 'Nivel de experiencia',
      type: 'select',
      required: true,
      options: [
        { value: 'junior', label: 'Junior (0-2 años)' },
        { value: 'mid', label: 'Mid-level (2-5 años)' },
        { value: 'senior', label: 'Senior (5-8 años)' },
        { value: 'lead', label: 'Lead/Architect (8+ años)' }
      ],
      placeholder: 'Selecciona tu nivel'
    },
    {
      name: 'tecnologias',
      label: 'Tecnologías que dominas',
      type: 'textarea',
      required: true,
      rows: 3,
      placeholder: 'Ej: React, Node.js, Python, AWS, Docker, PostgreSQL...'
    },
    {
      name: 'experiencia',
      label: 'Años de experiencia',
      type: 'select',
      required: true,
      options: [
        { value: '0-1', label: '0-1 años' },
        { value: '1-3', label: '1-3 años' },
        { value: '3-5', label: '3-5 años' },
        { value: '5-8', label: '5-8 años' },
        { value: '8+', label: 'Más de 8 años' }
      ],
      placeholder: 'Selecciona tu experiencia'
    },
    {
      name: 'modalidad',
      label: 'Modalidad de trabajo preferida',
      type: 'select',
      required: true,
      options: [
        { value: 'remoto', label: 'Remoto' },
        { value: 'presencial', label: 'Presencial' },
        { value: 'hibrido', label: 'Híbrido' },
        { value: 'flexible', label: 'Flexible' }
      ],
      placeholder: 'Selecciona tu preferencia'
    },
    {
      name: 'salario',
      label: 'Expectativa salarial (USD/año)',
      type: 'select',
      required: true,
      options: [
        { value: '20000-40000', label: '$20,000 - $40,000' },
        { value: '40000-60000', label: '$40,000 - $60,000' },
        { value: '60000-80000', label: '$60,000 - $80,000' },
        { value: '80000-120000', label: '$80,000 - $120,000' },
        { value: '120000+', label: 'Más de $120,000' },
        { value: 'negociable', label: 'A negociar' }
      ],
      placeholder: 'Selecciona tu expectativa'
    },
    {
      name: 'disponibilidad',
      label: 'Disponibilidad para empezar',
      type: 'select',
      required: true,
      options: [
        { value: 'inmediata', label: 'Inmediata' },
        { value: '2-semanas', label: 'En 2 semanas' },
        { value: '1-mes', label: 'En 1 mes' },
        { value: '2-meses', label: 'En 2 meses' },
        { value: 'flexible', label: 'Flexible' }
      ],
      placeholder: 'Selecciona tu disponibilidad'
    },
    {
      name: 'portfolio',
      label: 'Portfolio/LinkedIn/GitHub',
      type: 'text',
      placeholder: 'https://tu-portfolio.com o https://linkedin.com/in/tu-perfil'
    },
    {
      name: 'motivacion',
      label: '¿Por qué quieres trabajar en Itica?',
      type: 'textarea',
      required: true,
      rows: 4,
      placeholder: 'Cuéntanos qué te motiva a formar parte de nuestro equipo...'
    },
    {
      name: 'comentarios',
      label: 'Comentarios adicionales',
      type: 'textarea',
      rows: 3,
      placeholder: 'Cualquier información adicional que quieras compartir...'
    }
  ];

  const handleFormSubmit = async (data) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        type: activeTab === 'ideas' ? 'idea' : 'job'
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01161E] to-emerald-950">
      {/* Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-200 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Itica</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-bold text-white">ITI</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 to-emerald-600 bg-clip-text text-transparent leading-tight">
            Ideas, Talento, Innovación
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Conectamos ideas brillantes con talento excepcional. Comparte tu proyecto o encuentra
            oportunidades laborales en el ecosistema tecnológico de América Latina.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Lightbulb className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Comparte tu Idea</h3>
              <p className="text-gray-300">¿Tienes un proyecto tecnológico? Cuéntanos y te ayudamos a hacerlo realidad.</p>
            </div>
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Briefcase className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Únete a Itica</h3>
              <p className="text-gray-300">¿Quieres formar parte de nuestro equipo? Aplica y construye el futuro tecnológico de LATAM.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 px-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-full p-1 border border-white/20 w-full max-w-lg">
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setActiveTab('ideas')}
                  className={`px-2 sm:px-6 py-3 rounded-full font-medium transition-all duration-200 text-xs sm:text-base flex items-center justify-center ${
                    activeTab === 'ideas'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Ideas de Proyecto</span>
                  <span className="sm:hidden">Ideas</span>
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-2 sm:px-6 py-3 rounded-full font-medium transition-all duration-200 text-xs sm:text-base flex items-center justify-center ${
                    activeTab === 'jobs'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Aplicar a Itica</span>
                  <span className="sm:hidden">Aplicar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Forms */}
          {activeTab === 'ideas' && (
            <CustomForm
              title="Comparte tu Idea"
              subtitle="Cuéntanos sobre tu proyecto y te ayudaremos a hacerlo realidad"
              fields={ideasFormFields}
              onSubmit={handleFormSubmit}
              theme="dark"
              collectMetadata={true}
              className="mx-auto"
            />
          )}

          {activeTab === 'jobs' && (
            <CustomForm
              title="Aplicar a Itica"
              subtitle="Únete a nuestro equipo y construye el futuro tecnológico de América Latina"
              fields={jobsFormFields}
              onSubmit={handleFormSubmit}
              theme="dark"
              collectMetadata={true}
              className="mx-auto"
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Itica - Ideas, Talento, Innovación | Conectando el futuro tecnológico de LATAM
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ITIPage;