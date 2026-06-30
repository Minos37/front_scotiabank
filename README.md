# Core Financiero — Portal del Personal (Banco Scotiabank)

Front-end en **React + Vite** para la fuerza de ventas / asesores de Banco Scotiabank.
Consume el backend **Core Mobile (FastAPI)** del proyecto
`back_core_mobile_scotiabank_fastapi` (puerto **8003**).

> Sistema interno · uso exclusivo del personal. El portal del **cliente**
> (Banca por Internet) es un proyecto aparte (`scotiabank_banking_front_react`, puerto 5174).

## Puesta en marcha

```powershell
# 1) Instalar dependencias
npm install

# 2) Configurar la URL del backend (opcional, ya viene por defecto)
copy .env.example .env   # VITE_BASE_URL=http://localhost:8003

# 3) Levantar el front (portal del personal -> puerto 5173)
npm run dev
```

Abrir http://localhost:5173

### Acceso demo
El seed del Core Mobile crea un asesor de prueba:

| DNI / código | Contraseña |
|--------------|------------|
| `0001`       | `1234`     |

El backend autentica por `codigo_empleado` + `password`; el campo de login se
muestra como **Número de DNI** según el diseño del portal.

## Requisitos
- Backend `back_core_mobile_scotiabank_fastapi` corriendo en `http://localhost:8003`
  (`uvicorn main:app --reload --port 8003`) con el seed aplicado
  (`python -m scripts.seed_bd_core_mobile`).
- Node.js 18+.

## Funcionalidades (consumen el API del Core Mobile)

| Módulo | Pantalla | Endpoint(s) |
|--------|----------|-------------|
| Acceso | Login partido con carrusel "Nuestra esencia" | `POST /auth/login` |
| Inicio | Dashboard con KPIs y accesos rápidos | `GET /cartera`, `GET /solicitudes` |
| Cartera | Cartera del día + registro de visitas | `GET /cartera`, `POST /cartera/{id}/visita` |
| Ficha | Ficha 360° del cliente (posición, historial, oferta) | `GET /clientes/{id}/ficha` |
| Solicitudes | Tablero de expedientes + notas internas | `GET/POST /solicitudes`, `GET/POST /solicitudes/{id}/notas` |
| Nueva solicitud | Alta de solicitud de crédito (con cuota estimada) | `POST /solicitudes` |
| Evaluación | Pre-evaluación de capacidad de pago + consulta de buró | `POST /pre-evaluar`, `POST /buro/consulta` |
| Cobranza | Mora del día + registro de gestión | `GET /cobranza/mora`, `POST /cobranza/accion` |
| Reportes | Productividad mensual por asesor | `GET /reportes/productividad` |

## Identidad de marca
Paleta institucional de Scotiabank (rojo corporativo `#E52229`, blanco, y tonos oscuros), integrando el logotipo oficial del banco. Las variables de color viven en `src/index.css` (`--hb-*`).

## Estructura

```
src/
  main.jsx                 punto de entrada (Router + AuthProvider)
  App.jsx                  rutas públicas/privadas
  index.css                tema Scotiabank + estilos del portal
  context/AuthContext.jsx  sesión del asesor (JWT en localStorage)
  services/
    api.js                 axios central (Bearer + manejo de 401)
    authService.js         login / sesión
    carteraService.js  clientesService.js  solicitudesService.js
    evaluacionService.js  cobranzaService.js  reportesService.js
  components/
    layout/  Header (topbar + pestañas)  PrivateRoute  PageHead
    ui/      Logo  Alert  Badge  Money  Loader  Card  Modal
  pages/
    LoginPage  DashboardPage  CarteraPage  FichaClientePage
    SolicitudesPage  NuevaSolicitudPage  EvaluacionPage
    CobranzaPage  ReportesPage
  utils/format.js          moneda, fechas, porcentajes, errores
```

## Notas
- La sesión (token JWT del asesor) se guarda en `localStorage` (`cm_token` / `cm_user`).
  Ante un `401` el interceptor limpia la sesión y vuelve al login.
- La pre-evaluación, el buró y la cuota estimada usan las reglas mock del backend
  (en producción invocarían el motor de scoring del core).

## Despliegue en Producción (Vercel)

Para publicar la página web en internet usando **Vercel**:

1. Sube tu código (carpeta frontend) a un repositorio de **GitHub**.
2. Ingresa a [Vercel](https://vercel.com/) e inicia sesión con GitHub.
3. Haz clic en **Add New Project** y selecciona tu repositorio.
4. En la sección de **Environment Variables**, añade la variable de tu backend en Railway:
   - Name: `VITE_BASE_URL`
   - Value: `https://mi-banco-api.up.railway.app` *(reemplaza con tu URL real de Railway)*
5. Haz clic en **Deploy**.
6. ¡Listo! Vercel te dará una URL pública como `mi-portal-scotiabank.vercel.app` para que accedas desde cualquier dispositivo.
