import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import { connectDB } from './config/dbConfig.mjs';
import paisesRoutes from './routes/PaisesRoutes.mjs';
import expressLayouts from 'express-ejs-layouts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Conexión a la base de datos
connectDB();

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts); // Importante para usar layouts
app.set('layout', 'layout'); // Nombre del layout base, sin extensión .ejs

// Middleware para establecer title globalmente
app.use((req, res, next) => {
  res.locals.title = 'Países';  // Título predeterminado
  next();
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/paises', paisesRoutes);
app.get('/', (req, res) => {
  res.render('index');
});

// Middleware 404
app.use((req, res) => res.status(404).render('404'));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));

