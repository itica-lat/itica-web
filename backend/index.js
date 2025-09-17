// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Demasiadas solicitudes, intenta de nuevo más tarde.'
});

// Conectar a MongoDB
// Production uses 'mongodb' container, development uses 'localhost'
const mongoUri = process.env.MONGODB_URI ||
  (process.env.NODE_ENV === 'production' ? 'mongodb://mongodb:27017/waitlist' : 'mongodb://localhost:27017/waitlist');

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
  logger.error('MongoDB connection error', 'database', {
    errorDetails: error,
    timestamp: new Date().toISOString()
  });
});
db.once('open', () => {
  console.log('Conectado a MongoDB');
  logger.info('Successfully connected to MongoDB', 'database', {
    timestamp: new Date().toISOString()
  });
});

// Schema de Waitlist
const waitlistSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un correo válido']
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

// Schema for Ideas and Jobs submissions
const submissionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['idea', 'job'],
  },
  formData: {
    type: Object,
    required: true
  },
  metadata: {
    ip: String,
    userAgent: String,
    language: String,
    platform: String,
    cookieEnabled: Boolean,
    screen: Object,
    viewport: Object,
    timezone: String,
    url: String,
    referrer: String,
    location: Object,
    timestamp: Date
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processed: {
    type: Boolean,
    default: false
  }
});

const Submission = mongoose.model('Submission', submissionSchema);

// Schema for system logs
const logSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    enum: ['info', 'warn', 'error', 'debug'],
    default: 'info'
  },
  message: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  userId: String,
  sessionId: String,
  ip: String,
  userAgent: String,
  endpoint: String,
  method: String,
  statusCode: Number,
  responseTime: Number,
  requestData: Object,
  errorDetails: Object,
  metadata: Object,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1 });
logSchema.index({ action: 1 });
logSchema.index({ ip: 1 });

const Log = mongoose.model('Log', logSchema);

// Logging utility functions
const logger = {
  async log(level, message, action, options = {}) {
    try {
      // Always log to console
      console.log(`[${level.toUpperCase()}] ${action}: ${message}`);

      // Try to save to database if connected
      if (mongoose.connection.readyState === 1) {
        const logEntry = new Log({
          level,
          message,
          action,
          ...options,
          timestamp: new Date()
        });
        await logEntry.save();
      }
    } catch (error) {
      console.error('Failed to save log to database:', error);
    }
  },

  info(message, action, options = {}) {
    return this.log('info', message, action, options);
  },

  warn(message, action, options = {}) {
    return this.log('warn', message, action, options);
  },

  error(message, action, options = {}) {
    return this.log('error', message, action, options);
  },

  debug(message, action, options = {}) {
    return this.log('debug', message, action, options);
  }
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(body) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log the request
    logger.info(
      `${req.method} ${req.originalUrl} - ${res.statusCode} (${responseTime}ms)`,
      'request',
      {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        responseTime,
        requestData: req.method === 'POST' ? req.body : req.query,
        metadata: {
          contentLength: body ? body.length : 0,
          timestamp: new Date().toISOString()
        }
      }
    );

    originalSend.call(this, body);
  };

  next();
};

// Add request logging middleware
app.use(requestLogger);

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Función para enviar email de bienvenida
async function enviarEmailBienvenida(datosUsuario) {
  const { nombre, apellido, correo } = datosUsuario;
  
  const mailOptions = {
    from: `"Lista de Espera" <${process.env.EMAIL_FROM || 'noreply@itica.lat'}>`,
    to: correo,
    subject: '¡Bienvenido a nuestra lista de espera!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">¡Hola ${nombre} ${apellido}!</h2>
        <p>Gracias por unirte a nuestra lista de espera. Te mantendremos informado sobre todas las novedades.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">¿Qué sigue?</h3>
          <ul style="color: #6b7280;">
            <li>Serás el primero en conocer cuando lancemos</li>
            <li>Recibirás actualizaciones exclusivas sobre nuestro progreso</li>
            <li>Tendrás acceso prioritario cuando estemos listos</li>
          </ul>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          Si tienes alguna pregunta, no dudes en contactarnos.
        </p>
        <p style="color: #6b7280; font-size: 14px;>
          <strong>Equipo de Itica</strong>
        </p>
        <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          Este correo fue enviado a ${correo} porque te registraste en nuestra lista de espera.
        </p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

// Function to save submission to file
async function saveSubmissionToFile(submission) {
  try {
    const submissionsDir = path.join(__dirname, 'submissions');

    // Create directory if it doesn't exist
    try {
      await fs.access(submissionsDir);
    } catch {
      await fs.mkdir(submissionsDir, { recursive: true });
    }

    const fileName = `${submission.type}_${submission._id}_${Date.now()}.json`;
    const filePath = path.join(submissionsDir, fileName);

    const fileData = {
      id: submission._id,
      type: submission.type,
      formData: submission.formData,
      metadata: submission.metadata,
      submittedAt: submission.submittedAt,
      savedToFile: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(fileData, null, 2), 'utf8');
    console.log(`Submission saved to file: ${fileName}`);

    return fileName;
  } catch (error) {
    console.error('Error saving submission to file:', error);
    throw error;
  }
}

app.post('/api/contact', async (req, res) => {
  const { nombre, apellido, correo, consulta } = req.body;
    if (!nombre || !correo || !consulta) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    try {
    const mailOptions = {
        from: `"Contacto" <${process.env.EMAIL_FROM || 'noreply@itica.lat'}>`,
        to: process.env.INTERNAL_EMAIL || 'contact@itica.lat',
        subject: `Nuevo mensaje de ${nombre}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Apellido:</strong> ${apellido}</p>
          <p><strong>Correo:</strong> ${correo}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${consulta}</p>
        </div>
        `
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Mensaje enviado exitosamente' });
    } catch (error) {
    console.error('Error enviando mensaje de contacto:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el mensaje' });
    }
});

// Route to handle ideas and jobs form submissions
app.post('/api/submit', limiter, async (req, res) => {
  try {
    const { formData, metadata, submittedAt, type = 'idea' } = req.body;

    // Basic validation
    if (!formData) {
      return res.status(400).json({
        success: false,
        message: 'Form data is required'
      });
    }

    // Create new submission object
    const submissionData = {
      type,
      formData,
      metadata: {
        ...metadata,
        timestamp: new Date(submittedAt || Date.now())
      },
      submittedAt: new Date(submittedAt || Date.now())
    };

    let newSubmission;

    // Try to save to database if connected
    if (mongoose.connection.readyState === 1) {
      newSubmission = new Submission(submissionData);
      await newSubmission.save();
    } else {
      // Create a mock submission object for file saving and logging
      newSubmission = {
        _id: Date.now().toString(),
        ...submissionData
      };
    }

    // Log successful submission
    logger.info(`New ${type} submission received`, 'submission_received', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      submissionId: newSubmission._id,
      submissionType: type,
      metadata: metadata
    });

    // Save to file asynchronously
    try {
      await saveSubmissionToFile(newSubmission);
      logger.info(`Submission saved to file`, 'file_saved', {
        submissionId: newSubmission._id,
        submissionType: type
      });
    } catch (fileError) {
      logger.error('Error saving to file (continuing)', 'file_save_error', {
        submissionId: newSubmission._id,
        submissionType: type,
        errorDetails: fileError
      });
    }

    // Send notification emails (both to internal team and user)
    try {
      const emailType = type === 'job' ? 'oferta de trabajo' : 'idea';
      const userEmail = formData.email || formData.correo;

      // 1. Send notification to internal team
      const internalSubject = `Nueva ${emailType} recibida`;
      let internalEmailContent = `<h2>Nueva ${emailType} recibida</h2>`;

      // Format form data for internal email
      Object.entries(formData).forEach(([key, value]) => {
        internalEmailContent += `<p><strong>${key}:</strong> ${value}</p>`;
      });

      // Add metadata summary for internal email
      if (metadata) {
        internalEmailContent += `<hr><h3>Información técnica:</h3>`;
        internalEmailContent += `<p><strong>IP:</strong> ${metadata.ip || 'No disponible'}</p>`;
        internalEmailContent += `<p><strong>Ubicación:</strong> ${metadata.location ? `${metadata.location.city}, ${metadata.location.country}` : 'No disponible'}</p>`;
        internalEmailContent += `<p><strong>Navegador:</strong> ${metadata.userAgent || 'No disponible'}</p>`;
        internalEmailContent += `<p><strong>Fecha:</strong> ${metadata.timestamp || submittedAt}</p>`;
      }

      const internalMailOptions = {
        from: `"Formulario ITI" <${process.env.EMAIL_FROM || 'noreply@itica.lat'}>`,
        to: process.env.INTERNAL_EMAIL || 'submissions@itica.lat',
        subject: internalSubject,
        html: internalEmailContent
      };

      await transporter.sendMail(internalMailOptions);
      logger.info(`Internal notification email sent for ${type} submission`, 'email_sent', {
        submissionId: newSubmission._id,
        submissionType: type,
        recipient: internalMailOptions.to
      });

      // 2. Send confirmation copy to user
      if (userEmail) {
        const userSubject = type === 'job'
          ? '¡Gracias por tu aplicación a Itica!'
          : '¡Gracias por compartir tu idea con Itica!';

        const userName = formData.nombre || 'Usuario';

        let userEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://itica.lat/logo.png" alt="Itica" style="max-width: 150px; height: auto;" onerror="this.style.display='none'">
                <h1 style="color: #2563eb; margin: 20px 0; font-size: 28px;">Itica</h1>
              </div>

              <h2 style="color: #2563eb; margin-bottom: 20px;">¡Hola ${userName}!</h2>

              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                ${type === 'job'
                  ? 'Gracias por tu interés en formar parte del equipo de Itica. Hemos recibido tu aplicación y la revisaremos cuidadosamente.'
                  : 'Gracias por compartir tu idea con nosotros. Hemos recibido tu propuesta y la evaluaremos junto a nuestro equipo.'}
              </p>

              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0; font-size: 18px;">Resumen de tu ${type === 'job' ? 'aplicación' : 'idea'}:</h3>
        `;

        // Add form data summary for user (excluding sensitive metadata)
        const userFriendlyFields = {
          nombre: 'Nombre',
          email: 'Email',
          correo: 'Email',
          empresa: 'Empresa',
          titulo: 'Título',
          categoria: 'Categoría',
          posicion: 'Posición',
          descripcion: 'Descripción',
          motivacion: 'Motivación'
        };

        Object.entries(formData).forEach(([key, value]) => {
          if (userFriendlyFields[key] && value) {
            userEmailContent += `<p style="margin: 8px 0; color: #6b7280;"><strong>${userFriendlyFields[key]}:</strong> ${value}</p>`;
          }
        });

        userEmailContent += `
              </div>

              <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                <h3 style="color: #065f46; margin-top: 0; font-size: 16px;">¿Qué sigue?</h3>
                <ul style="color: #047857; margin: 10px 0; padding-left: 20px;">
                  ${type === 'job'
                    ? `<li>Revisaremos tu perfil y experiencia</li>
                       <li>Si hay un match, te contactaremos para una entrevista</li>
                       <li>Te mantendremos informado sobre el proceso</li>`
                    : `<li>Nuestro equipo evaluará tu propuesta</li>
                       <li>Te contactaremos si necesitamos más información</li>
                       <li>Si decidimos avanzar, te propondremos los siguientes pasos</li>`
                  }
                </ul>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                Normalmente respondemos en un plazo de 3-5 días hábiles. Si tienes alguna pregunta urgente,
                no dudes en contactarnos respondiendo a este email.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://itica.lat" style="background-color: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Visitar Itica.lat
                </a>
              </div>

              <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">

              <div style="text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
                  <strong>Equipo de Itica</strong><br>
                  Ideas, Talento, Innovación
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 20px 0;">
                  Este correo fue enviado a ${userEmail} porque enviaste ${type === 'job' ? 'una aplicación' : 'una idea'} a través de nuestro formulario.
                </p>
              </div>
            </div>
          </div>
        `;

        const userMailOptions = {
          from: `"Itica - Ideas, Talento, Innovación" <${process.env.EMAIL_FROM || 'noreply@itica.lat'}>`,
          to: userEmail,
          subject: userSubject,
          html: userEmailContent
        };

        await transporter.sendMail(userMailOptions);
        logger.info(`User confirmation email sent for ${type} submission`, 'user_email_sent', {
          submissionId: newSubmission._id,
          submissionType: type,
          recipient: userEmail
        });
      }

    } catch (emailError) {
      logger.error('Error sending notification emails', 'email_error', {
        submissionId: newSubmission._id,
        submissionType: type,
        errorDetails: emailError
      });
    }

    res.status(201).json({
      success: true,
      message: 'Submission received successfully',
      data: {
        id: newSubmission._id,
        type: newSubmission.type,
        submittedAt: newSubmission.submittedAt
      }
    });

  } catch (error) {
    console.error('Error in /api/submit:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Route to get submission statistics
app.get('/api/submissions/stats', async (req, res) => {
  try {
    const totalSubmissions = await Submission.countDocuments();
    const ideasCount = await Submission.countDocuments({ type: 'idea' });
    const jobsCount = await Submission.countDocuments({ type: 'job' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySubmissions = await Submission.countDocuments({
      submittedAt: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        total: totalSubmissions,
        ideas: ideasCount,
        jobs: jobsCount,
        today: todaySubmissions
      }
    });
  } catch (error) {
    console.error('Error getting submission stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting statistics'
    });
  }
});
    

// Ruta para agregar usuario a la waitlist
app.post('/api/waitlist', limiter, async (req, res) => {
  try {
    const { nombre, apellido, correo } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !correo) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa un correo electrónico válido'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Waitlist.findOne({ correo: correo.toLowerCase() });
    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: 'Este correo ya está registrado en nuestra lista de espera'
      });
    }

    // Crear nuevo usuario en la waitlist
    const nuevoUsuario = new Waitlist({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      correo: correo.toLowerCase().trim()
    });

    await nuevoUsuario.save();

    // Enviar email de bienvenida
    try {
      await enviarEmailBienvenida({
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallar la request si el email falla
    }

    res.status(201).json({
      success: true,
      message: 'Te has registrado exitosamente en la lista de espera',
      data: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        fechaRegistro: nuevoUsuario.fechaRegistro
      }
    });

  } catch (error) {
    console.error('Error en /api/waitlist:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Este correo ya está registrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener estadísticas (opcional)
app.get('/api/waitlist/stats', async (req, res) => {
  try {
    const total = await Waitlist.countDocuments({ activo: true });
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const registrosHoy = await Waitlist.countDocuments({
      activo: true,
      fechaRegistro: { $gte: hoy }
    });

    res.json({
      success: true,
      data: {
        totalUsuarios: total,
        registrosHoy: registrosHoy
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas'
    });
  }
});

// API endpoints for logs management
app.get('/api/logs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      level,
      action,
      startDate,
      endDate,
      ip,
      search
    } = req.query;

    // Build query
    const query = {};

    if (level) query.level = level;
    if (action) query.action = action;
    if (ip) query.ip = ip;

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { message: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { endpoint: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      Log.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Log.countDocuments(query)
    ]);

    logger.info('Logs queried successfully', 'logs_query', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      query: req.query,
      resultsCount: logs.length
    });

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalLogs: total,
          hasNextPage: skip + logs.length < total,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    logger.error('Error querying logs', 'logs_query_error', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorDetails: error,
      query: req.query
    });

    res.status(500).json({
      success: false,
      message: 'Error retrieving logs'
    });
  }
});

// Get log statistics
app.get('/api/logs/stats', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalLogs,
      errorLogs,
      warnLogs,
      infoLogs,
      debugLogs,
      recentLogs
    ] = await Promise.all([
      Log.countDocuments(),
      Log.countDocuments({ level: 'error', timestamp: { $gte: startDate } }),
      Log.countDocuments({ level: 'warn', timestamp: { $gte: startDate } }),
      Log.countDocuments({ level: 'info', timestamp: { $gte: startDate } }),
      Log.countDocuments({ level: 'debug', timestamp: { $gte: startDate } }),
      Log.countDocuments({ timestamp: { $gte: startDate } })
    ]);

    // Get top IPs
    const topIPs = await Log.aggregate([
      { $match: { timestamp: { $gte: startDate }, ip: { $exists: true, $ne: null } } },
      { $group: { _id: '$ip', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get top actions
    const topActions = await Log.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get hourly distribution
    const hourlyLogs = await Log.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    logger.info('Log statistics queried successfully', 'logs_stats', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      days: days
    });

    res.json({
      success: true,
      data: {
        summary: {
          total: totalLogs,
          recent: recentLogs,
          byLevel: {
            error: errorLogs,
            warn: warnLogs,
            info: infoLogs,
            debug: debugLogs
          }
        },
        topIPs: topIPs.map(ip => ({ ip: ip._id, requests: ip.count })),
        topActions: topActions.map(action => ({ action: action._id, count: action.count })),
        hourlyDistribution: hourlyLogs.map(hour => ({ hour: hour._id, count: hour.count })),
        period: {
          days: parseInt(days),
          from: startDate.toISOString(),
          to: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    logger.error('Error getting log statistics', 'logs_stats_error', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorDetails: error
    });

    res.status(500).json({
      success: false,
      message: 'Error getting log statistics'
    });
  }
});

// Clear old logs (cleanup endpoint)
app.delete('/api/logs/cleanup', async (req, res) => {
  try {
    const { days = 30, level } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const deleteQuery = { timestamp: { $lt: cutoffDate } };
    if (level) deleteQuery.level = level;

    const result = await Log.deleteMany(deleteQuery);

    logger.info(`Cleaned up ${result.deletedCount} old logs`, 'logs_cleanup', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      deletedCount: result.deletedCount,
      cutoffDate: cutoffDate.toISOString(),
      level: level || 'all'
    });

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} log entries`,
      data: {
        deletedCount: result.deletedCount,
        cutoffDate: cutoffDate.toISOString()
      }
    });

  } catch (error) {
    logger.error('Error cleaning up logs', 'logs_cleanup_error', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errorDetails: error
    });

    res.status(500).json({
      success: false,
      message: 'Error cleaning up logs'
    });
  }
});

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Algo salió mal!'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});