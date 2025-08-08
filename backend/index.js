// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://backend:27017/waitlist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
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

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
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