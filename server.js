import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
// En producción (fly.io), las sesiones en memoria se perderán en reinicios
// Para una solución más robusta, considerar usar Redis, pero para uso simple esto funciona
app.use(session({
  secret: process.env.SESSION_SECRET || 'lu-finanzas-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.FLY_APP_NAME !== undefined,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
  }
}));

// Servir login.html sin autenticación
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Redirigir /login a login.html
app.get('/login', (req, res) => {
  res.redirect('/login.html');
});

// Proteger index.html - redirigir a login si no está autenticado
app.get('/', (req, res) => {
  if (!req.session || !req.session.user) {
    res.redirect('/login.html');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Servir archivos estáticos para el resto
app.use(express.static(path.join(__dirname, 'public')));

// Configurar rutas de base de datos
// En fly.io, usar volúmenes persistentes si están disponibles, sino usar directorio temporal
const DATA_DIR = process.env.FLY_VOLUME_PATH || process.env.DATA_DIR || __dirname;
const DB_PATH = path.join(DATA_DIR, 'db.json');
const USERS_PATH = path.join(DATA_DIR, 'users.json');

// Helpers DB
const leerDB = () => {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { movimientos: [] };
  }
};
const guardarDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Helpers Usuarios
const leerUsuarios = () => {
  try {
    const raw = fs.readFileSync(USERS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    // Si no existe, crea un usuario por defecto
    const defaultHash = bcrypt.hashSync('admin123', 10);
    const usuarios = { 
      lu: {
        password: defaultHash,
        nombre: 'Lu'
      }
    };
    fs.writeFileSync(USERS_PATH, JSON.stringify(usuarios, null, 2));
    console.log('Usuario por defecto creado: usuario="lu", contraseña="admin123"');
    console.log('IMPORTANTE: Cambia esta contraseña por seguridad!');
    return usuarios;
  }
};
const guardarUsuarios = (data) => fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2));

// Middleware de autenticación
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ error: 'No autenticado' });
};

// Validación básica
const validarMovimiento = (m) => {
  const errores = [];
  if (!m) return ['Body vacío'];
  if (!['ingreso','gasto'].includes(m.tipo)) errores.push('tipo inválido');
  if (!m.area) errores.push('area requerida');
  if (!m.categoria) errores.push('categoria requerida');
  if (!(typeof m.monto === 'number') || m.monto < 0) errores.push('monto inválido');
  if (!m.fecha) errores.push('fecha requerida (YYYY-MM-DD)');
  return errores;
};

// --- Utilidades de fecha ---
const parseISO = (s) => {
  if (!s) return null;
  const [y,m,d] = String(s).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m-1, d));
};
const enRangoFecha = (mov, start, end) => {
  if (!mov.fecha) return false;
  const dt = parseISO(mov.fecha);
  if (!dt) return false;
  if (start && dt < start) return false;
  if (end && dt > end) return false;
  return true;
};
// --- Rutas de Autenticación ---

// Login
app.post('/api/auth/login', async (req, res) => {
  const { usuario, password } = req.body;
  
  if (!usuario || !password) {
    return res.status(400).json({ success: false, message: 'Usuario y contraseña requeridos' });
  }

  const usuarios = leerUsuarios();
  
  if (!usuarios[usuario] || !bcrypt.compareSync(password, usuarios[usuario].password)) {
    return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }

  req.session.user = usuario;
  res.json({ success: true, user: usuario, nombre: usuarios[usuario].nombre });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Verificar sesión
app.get('/api/auth/me', (req, res) => {
  if (req.session && req.session.user) {
    const usuarios = leerUsuarios();
    const user = usuarios[req.session.user];
    res.json({ authenticated: true, user: req.session.user, nombre: user.nombre });
  } else {
    res.json({ authenticated: false });
  }
});

// Cambiar contraseña (requiere autenticación)
app.post('/api/auth/cambiar-password', requireAuth, (req, res) => {
  const { passwordActual, passwordNueva } = req.body;
  
  if (!passwordActual || !passwordNueva) {
    return res.status(400).json({ success: false, message: 'Contraseñas requeridas' });
  }

  const usuarios = leerUsuarios();
  const usuario = usuarios[req.session.user];
  
  if (!bcrypt.compareSync(passwordActual, usuario.password)) {
    return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
  }

  usuarios[req.session.user].password = bcrypt.hashSync(passwordNueva, 10);
  guardarUsuarios(usuarios);
  
  res.json({ success: true, message: 'Contraseña actualizada' });
});

// --- Rutas API ---

// Crear movimiento (requiere autenticación)
app.post('/api/movimientos', requireAuth, (req, res) => {
  const errores = validarMovimiento(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const db = leerDB();
  const mov = { id: uuid(), ...req.body, ts: Date.now() };
  db.movimientos.push(mov);
  guardarDB(db);
  res.status(201).json(mov);
});

// Listar movimientos (filtros: tipo, q, start, end)
app.get('/api/movimientos', requireAuth, (req, res) => {
  const { tipo, q, start, end } = req.query;
  const startDate = start ? parseISO(start) : null;
  const endDate   = end   ? parseISO(end)   : null;

  let lista = leerDB().movimientos;
  if (tipo) lista = lista.filter(m => m.tipo === tipo);
  if (q) {
    const t = String(q).toLowerCase();
    lista = lista.filter(m => m.area.toLowerCase().includes(t) || m.categoria.toLowerCase().includes(t));
  }
  if (startDate || endDate) {
    lista = lista.filter(m => enRangoFecha(m, startDate, endDate));
  }
  lista = lista.sort((a,b)=> b.ts - a.ts);
  res.json(lista);
});

// Borrar movimiento
app.delete('/api/movimientos/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const db = leerDB();
  const antes = db.movimientos.length;
  db.movimientos = db.movimientos.filter(m => m.id !== id);
  guardarDB(db);
  if (db.movimientos.length === antes) return res.status(404).json({ error: 'No existe el movimiento' });
  res.json({ ok: true });
});

// Resumen (mismos filtros que /api/movimientos)
app.get('/api/resumen', requireAuth, (req, res) => {
  const { tipo, q, start, end } = req.query;
  const startDate = start ? parseISO(start) : null;
  const endDate   = end   ? parseISO(end)   : null;

  let { movimientos } = leerDB();
  if (tipo) movimientos = movimientos.filter(m => m.tipo === tipo);
  if (q) {
    const t = String(q).toLowerCase();
    movimientos = movimientos.filter(m => m.area.toLowerCase().includes(t) || m.categoria.toLowerCase().includes(t));
  }
  if (startDate || endDate) {
    movimientos = movimientos.filter(m => enRangoFecha(m, startDate, endDate));
  }

  const totalIngresos = movimientos.filter(m=>m.tipo==='ingreso').reduce((acc,m)=>acc+m.monto,0);
  const totalGastos   = movimientos.filter(m=>m.tipo==='gasto').reduce((acc,m)=>acc+m.monto,0);
  const balance = totalIngresos - totalGastos;

  const acumPor = (tipoFiltro) => {
    const map = new Map();
    movimientos.filter(m => !tipoFiltro || m.tipo===tipoFiltro).forEach(m => {
      map.set(m.area, (map.get(m.area)||0) + m.monto);
    });
    return [...map.entries()].sort((a,b)=>b[1]-a[1]);
  };

  const ingresosPorArea = acumPor('ingreso');
  const gastosPorArea = acumPor('gasto');

  // Desglose por área con sus categorías
  const desglosePorArea = () => {
    const map = new Map();
    
    // Agrupar por área
    movimientos.forEach(m => {
      if (!map.has(m.area)) {
        map.set(m.area, {
          area: m.area,
          ingresos: 0,
          gastos: 0,
          balance: 0,
          categorias: new Map()
        });
      }
      
      const areaData = map.get(m.area);
      if (m.tipo === 'ingreso') {
        areaData.ingresos += m.monto;
      } else {
        areaData.gastos += m.monto;
      }
      areaData.balance = areaData.ingresos - areaData.gastos;
      
      // Agrupar categorías dentro del área
      const catKey = `${m.tipo}-${m.categoria}`;
      areaData.categorias.set(catKey, (areaData.categorias.get(catKey) || 0) + m.monto);
    });
    
    // Convertir a array y ordenar
    return [...map.values()]
      .map(area => ({
        ...area,
        categorias: [...area.categorias.entries()]
          .map(([key, monto]) => {
            const [tipo, categoria] = key.split('-');
            return { tipo, categoria, monto };
          })
          .sort((a, b) => b.monto - a.monto)
      }))
      .sort((a, b) => b.balance - a.balance);
  };

  const desglose = desglosePorArea();

  res.json({
    totalIngresos,
    totalGastos,
    balance,
    ingresosPorArea,
    gastosPorArea,
    topIngresos: ingresosPorArea.slice(0,5),
    topGastos: gastosPorArea.slice(0,5),
    cantidad: movimientos.length,
    desglose
  });
});

// Export CSV (respeta tipo, q, start, end)
app.get('/api/export.csv', requireAuth, (req, res) => {
  const { tipo, q, start, end } = req.query;
  const startDate = start ? parseISO(start) : null;
  const endDate   = end   ? parseISO(end)   : null;

  let lista = leerDB().movimientos;
  if (tipo) lista = lista.filter(m => m.tipo === tipo);
  if (q) {
    const t = String(q).toLowerCase();
    lista = lista.filter(m => m.area.toLowerCase().includes(t) || m.categoria.toLowerCase().includes(t));
  }
  if (startDate || endDate) {
    lista = lista.filter(m => enRangoFecha(m, startDate, endDate));
  }

  const header = ['id','tipo','area','categoria','monto','fecha','ts'];
  const rows = [header.join(',')];
  for (const m of lista) {
    const vals = [m.id, m.tipo, m.area, m.categoria, m.monto, m.fecha, m.ts].map(v => {
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? '"' + s + '"' : s;
    });
    rows.push(vals.join(','));
  }
  const csv = "\ufeff" + rows.join("\n");
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=\"movimientos.csv\"');
  res.send(csv);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // fly.io necesita escuchar en 0.0.0.0
app.listen(PORT, HOST, () => {
  console.log(`Servidor listo en http://${HOST}:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Datos en: ${DATA_DIR}`);
});
