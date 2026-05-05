import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const CustomForm = ({
  title = "Formulario",
  subtitle = "",
  fields = [],
  submitUrl = "/api/submit",
  onSubmit,
  onSuccess,
  onError,
  theme = "dark",
  collectMetadata = true,
  showSuccessMessage = true,
  className = ""
}) => {
  const [formData, setFormData] = useState({});
  const [metadata, setMetadata] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Collect client metadata
  useEffect(() => {
    if (!collectMetadata) return;

    const clientData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      url: window.location.href,
      referrer: document.referrer
    };

    setMetadata(clientData);
  }, [collectMetadata]);

  // Initialize form data
  useEffect(() => {
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || '';
    });
    setFormData(initialData);
  }, [fields]);

  const validateField = (field, value) => {
    if (field.required && (!value || value.trim() === '')) {
      return `${field.label} es requerido`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Ingresa un email válido';
      }
    }

    if (field.type === 'tel' && value) {
      const phoneRegex = /^\+?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Ingresa un teléfono válido';
      }
    }

    if (field.minLength && value && value.length < field.minLength) {
      return `Mínimo ${field.minLength} caracteres`;
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `Máximo ${field.maxLength} caracteres`;
    }

    return null;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const submitData = {
        formData,
        ...(collectMetadata && { metadata }),
        submittedAt: new Date().toISOString()
      };

      let response;

      if (onSubmit) {
        // Custom submit handler
        response = await onSubmit(submitData);
      } else {
        // Default API submission
        response = await fetch(submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        response = await response.json();
      }

      setSubmitted(true);

      if (onSuccess) {
        onSuccess(response);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'Error al enviar el formulario');

      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmitError("");
    setErrors({});
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || '';
    });
    setFormData(initialData);
  };

  const renderField = (field) => {
    const baseInputClasses = theme === 'dark'
      ? "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
      : "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

    const labelClasses = theme === 'dark'
      ? "block text-sm font-medium text-gray-200 mb-2"
      : "block text-sm font-medium text-gray-700 mb-2";

    const errorClasses = "text-red-400 text-sm mt-1";

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="mb-6">
            <label htmlFor={field.name} className={labelClasses}>
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className={`${baseInputClasses} resize-none`}
              required={field.required}
            />
            {errors[field.name] && <p className={errorClasses}>{errors[field.name]}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="mb-6">
            <label htmlFor={field.name} className={labelClasses}>
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className={baseInputClasses}
              required={field.required}
            >
              <option value="">{field.placeholder || 'Selecciona una opción'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && <p className={errorClasses}>{errors[field.name]}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-emerald-600 bg-transparent border-gray-300 rounded focus:ring-emerald-500"
                required={field.required}
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </span>
            </label>
            {errors[field.name] && <p className={errorClasses}>{errors[field.name]}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-6">
            <label htmlFor={field.name} className={labelClasses}>
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
              minLength={field.minLength}
              maxLength={field.maxLength}
            />
            {errors[field.name] && <p className={errorClasses}>{errors[field.name]}</p>}
          </div>
        );
    }
  };

  const containerClasses = theme === 'dark'
    ? "bg-white/15 backdrop-blur-lg border border-white/20 shadow-xl"
    : "bg-white border border-gray-200 shadow-lg";

  if (submitted && showSuccessMessage) {
    return (
      <div className={`${containerClasses} rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ¡Enviado exitosamente!
          </h3>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Gracias por tu mensaje. Te contactaremos pronto.
          </p>
          <button
            onClick={resetForm}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} rounded-2xl p-8 ${className}`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {subtitle}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(renderField)}

        {submitError && (
          <div className="flex items-start space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            theme === 'dark'
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Enviar {title}
            </>
          )}
        </button>
      </form>

      {collectMetadata && Object.keys(metadata).length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Se recopilará información técnica para mejorar nuestros servicios.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomForm;