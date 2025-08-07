import React, { useState } from 'react';
import { Mail, Users, CheckCircle, AlertCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    consulta: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { nombre, apellido, correo, consulta } = formData;
    
    if (!nombre.trim() || !apellido.trim() || !correo.trim()) {
      return 'Todos los campos son obligatorios';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return 'Por favor ingresa un correo electrónico válido';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({
        type: 'error',
        message: validationError
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Aquí harías la llamada a tu API backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Tu consulta ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.'
        });
        setFormData({ nombre: '', apellido: '', correo: '', consulta: '' });
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Ocurrió un error al enviar la solicitud. Por favor intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-green-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-200 mb-2">
              Ponte en contacto con nosotros
            </h1>
            <p className="text-gray-300">
              Envianos tu solicitud y nos pondremos en contacto contigo pronto.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-300/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-300/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tu apellido"
                />
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700  mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 bg-gray-300/60 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu@correo.com"
                />
              </div>

                            <div>
                <label htmlFor="consulta" className="block text-sm font-medium text-gray-700 mb-2">
                  Consulta *
                </label>
                <textarea
                  type="textarea"
                  id="consulta"
                  name="consulta"
                  value={formData.consulta}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 bg-gray-300/60 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Escribe tu consulta"
                />
              </div>

              {/* Status Message */}
              {submitStatus && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm">{submitStatus.message}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-500 hover:to-green-400 hover:scale-105 cursor-pointer focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Contactar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-300">
              Te responderemos a la brevedad posible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;