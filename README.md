# MARVEL UNIVERSE 🦸‍♂️✨

Plataforma web cinematográfica moderna para explorar el universo de personajes de **Marvel Comics**, consultar sus identidades, biografías, estadísticas de habilidades de combate y gestionar una colección personal de favoritos sincronizada en tiempo real mediante **Google Firebase**.

Desarrollada como proyecto integral para la asignatura de **Desarrollo Web Full Stack (Unidad 3)**.

---

## 🚀 1. Tecnologías y Arquitectura

La aplicación implementa una arquitectura desacoplada orientada a servicios:

* **Frontend:**
  * **React 19** con **TypeScript** y compilador de alto rendimiento **Vite**.
  * **Tailwind CSS v4** para estilos utilitarios modernos y paleta visual oficial Marvel (`#ED1D24`, `#080808`, `#181818`, `#FFFFFF`).
  * **React Router v7** para enrutamiento SPA, rutas protegidas y navegación fluida.
  * **Lucide React** para iconografía vectorial optimizada.
  * Tipografías cinemáticas Google Fonts: *Bebas Neue*, *Oswald* e *Inter*.

* **Web Services REST (Consumo de API Externa):**
  * Consumo del servicio REST público: `https://akabab.github.io/superhero-api/api/all.json`.
  * Filtro estricto del publisher `Marvel Comics` (269 personajes reales catalogados).
  * Sin datos ficticios o simulados; consumo directo con `fetch()`, manejo de estados HTTP, caché en memoria y reintento ante fallos de conexión.

* **Backend as a Service (BaaS) - Firebase:**
  * **Firebase Authentication:** Registro de usuarios con validaciones de alta seguridad, actualización de perfil (`updateProfile`), verificación de correo electrónico (`sendEmailVerification`), recuperación de contraseña (`sendPasswordResetEmail`) y persistencia de sesión (`onAuthStateChanged`).
  * **Cloud Firestore (NoSQL):** Almacenamiento distribuido para perfiles de usuario (`users/{uid}`) y subcolecciones privadas de favoritos (`users/{uid}/favorites/{characterId}`) con sincronización reactiva en tiempo real (`onSnapshot`).
  * **Firestore Security Rules:** Reglas basadas en atributos y control de acceso (ABAC), garantizando que ningún usuario pueda leer o escribir en la colección de otro usuario.
  * **Firebase Hosting:** Configuración lista para despliegue global en CDN con HTTPS mediante `firebase.json`.

---

## 🌐 2. Explicación: Web Services REST vs. Backend as a Service (BaaS)

### A. Consumo de Web Service REST
La aplicación utiliza el protocolo HTTP/HTTPS bajo el modelo arquitectónico **REST (Representational State Transfer)** para comunicarse con el catálogo externo de superhéroes:
* **Protocolo:** `GET` a `https://akabab.github.io/superhero-api/api/all.json`.
* **Procesamiento de datos:** El servicio (`src/services/superheroService.ts`) recibe la colección en formato JSON, filtra dinámicamente aquellos registros donde `biography.publisher === "Marvel Comics"`, valida que existan imágenes en alta resolución y aplica funciones de ordenamiento y filtrado por facción (Héroes, Villanos, Neutrales).
* **Resiliencia:** Implementa clases de error personalizadas (`SuperheroApiError`) para distinguir entre errores de red (desconexión, DNS) y respuestas HTTP erróneas.

### B. Firebase como Backend as a Service (BaaS)
En lugar de mantener un servidor tradicional monolítico con Node.js/Express y una base de datos autogestionada, la aplicación delega la autenticación, seguridad perimetral y persistencia de datos a **Firebase**:
* **Desacoplamiento:** El cliente React interactúa directamente con los SDKs de Firebase de forma segura gracias a las **Security Rules** en el servidor de Firestore.
* **Seguridad de Datos:** La seguridad no depende del frontend: si un atacante intenta realizar una petición directa a Firestore sin un token JWT válido o intentando alterar el UID de otro usuario, la base de datos rechaza la operación (`PERMISSION_DENIED`).
* **Sincronización Reactiva:** Mediante `onSnapshot`, cuando el usuario guarda un personaje en favoritos desde cualquier dispositivo, la interfaz se actualiza instantáneamente sin necesidad de recargar la página.

---

## 🔒 3. Seguridad Web Implementada

1. **Validación Exhaustiva de Contraseñas:**
   * Mínimo 8 caracteres.
   * Al menos una letra mayúscula (A-Z).
   * Al menos una letra minúscula (a-z).
   * Al menos un número (0-9).
   * Al menos un carácter especial (`!@#$%^&*...`).
   * Confirmación idéntica en el registro.

2. **Aislamiento de Privilegios y Datos:**
   * Las contraseñas **NUNCA** se almacenan en Firestore; son gestionadas de forma cifrada por Firebase Auth.
   * Firestore solo almacena metadatos del perfil (`uid`, `displayName`, `email`, `createdAt`).

3. **Reglas de Seguridad Zero-Trust (`firestore.rules`):**
   * Bloqueo global por defecto (`match /{document=**} { allow read, write: if false; }`).
   * Validación estricta de UIDs (`request.auth.uid == userId`).
   * Límite de longitud en cadenas de texto para prevenir ataques de denegación de recursos (Denial of Wallet).
   * Prohibición de listado público de la colección de usuarios para evitar enumeración de cuentas.

4. **Variables de Entorno Seguras:**
   * Archivo `.env` excluido del control de versiones mediante `.gitignore`.
   * Plantilla pública `/.env.example` documentada.

---

## 📋 4. Guía Paso a Paso para Conectar un Proyecto Firebase Propio

Si deseas clonar o ejecutar este proyecto en tu propia cuenta de Google Firebase, sigue estos pasos:

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Crear el Proyecto en Firebase Console
1. Ingresa a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **"Crear un proyecto"** (o "Add project") y asígnale un nombre (ej. `marvel-universe-app`).
3. Puedes deshabilitar Google Analytics para proyectos de prueba o habilitarlo si lo prefieres.
4. Una vez creado, haz clic en el icono web **`</>`** para registrar una aplicación web.
5. Copia el objeto `firebaseConfig` generado.

### Paso 3: Activar Firebase Authentication
1. En el menú lateral izquierdo, ve a **Build > Authentication**.
2. Haz clic en **Comenzar** ("Get started").
3. En la pestaña **Sign-in method**, selecciona **Correo electrónico/Contraseña** (Email/Password).
4. Habilita la primera casilla ("Habilitar") y guarda los cambios.

### Paso 4: Crear la Base de Datos Cloud Firestore
1. En el menú lateral izquierdo, ve a **Build > Firestore Database**.
2. Haz clic en **Crear base de datos** ("Create database").
3. Selecciona la ubicación más cercana (ej. `us-east1` o `us-central1`).
4. Selecciona **Modo de producción** (las reglas se configurarán en el siguiente paso).

### Paso 5: Configurar las Variables de Entorno (.env)
Crea un archivo `.env` en la raíz del proyecto copiando la plantilla `.env.example`:
```bash
cp .env.example .env
```
Completa las variables con las claves de tu proyecto Firebase:
```env
VITE_FIREBASE_API_KEY="AIzaSyTuClaveApiKeyAqui"
VITE_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="tu-proyecto"
VITE_FIREBASE_STORAGE_BUCKET="tu-proyecto.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
VITE_SUPERHERO_API_URL="https://akabab.github.io/superhero-api/api"
```

### Paso 6: Aplicar las Reglas de Seguridad en Firestore
En Firebase Console, ve a **Firestore Database > pestaña Reglas** (Rules), copia el contenido de `firestore.rules` de este proyecto y haz clic en **Publicar** (Publish).

O utiliza Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### Paso 7: Ejecutar la Aplicación Localmente
Inicia el servidor de desarrollo en Vite:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Paso 8: Publicar en Firebase Hosting
1. Compila la aplicación para producción:
```bash
npm run build
```
2. Inicia sesión en Firebase CLI (si no lo has hecho):
```bash
npx firebase login
```
3. Inicializa hosting y despliega:
```bash
npx firebase deploy --only hosting
```
¡Tu aplicación estará en línea con certificado SSL (HTTPS) gratuito en `https://tu-proyecto.web.app`!

---

## 📁 5. Estructura del Proyecto

```
/
├── .env.example                # Plantilla de variables de entorno (sin credenciales privadas)
├── .gitignore                  # Reglas de exclusión de git (protege .env y node_modules)
├── firebase-blueprint.json     # Esquema formal y especificación de colecciones Firestore
├── firebase.json               # Configuración de despliegue para Firebase Hosting y Firestore
├── firestore.rules             # Reglas de seguridad ABAC de Cloud Firestore
├── index.html                  # Punto de entrada HTML con metadatos y tipografías cinemáticas
├── metadata.json               # Metadatos del aplicativo para AI Studio
├── package.json                # Dependencias (React, Vite, Firebase, Lucide, Tailwind)
├── security_spec.md            # Especificación de amenazas y modelo de seguridad
├── tsconfig.json               # Configuración estricta de TypeScript
├── vite.config.ts              # Configuración del bundler Vite y Tailwind
└── src/
    ├── main.tsx                # Entrada principal React y montaje en DOM
    ├── App.tsx                 # Envoltura de Providers y BrowserRouter
    ├── index.css               # Estilos globales, paleta Marvel y fuentes
    ├── config/
    │   └── firebase.ts         # Inicialización modular de Firebase Auth y Firestore
    ├── contexts/
    │   ├── AuthContext.tsx     # Contexto de autenticación, perfil y restablecimiento
    │   └── FavoritesContext.tsx# Contexto con sincronización en tiempo real de favoritos
    ├── hooks/
    │   ├── useCharacters.ts    # Hook para catálogo, búsqueda, filtros y paginación
    │   └── useCharacterDetail.ts # Hook para detalle de personaje por ID
    ├── services/
    │   ├── superheroService.ts # Consumo del Web Service REST con filtrado Marvel
    │   ├── favoritesService.ts # Operaciones CRUD en subcolección Firestore
    │   └── errorHandling.ts    # Normalización de errores de Firebase y mensajes amigables
    ├── types/
    │   ├── character.ts        # Tipos e interfaces de personajes, stats y favoritos
    │   └── user.ts             # Tipos para perfiles y formularios de autenticación
    ├── components/
    │   ├── Navbar.tsx          # Barra de navegación con conteo reactivo y sesión
    │   ├── Footer.tsx          # Pie de página con créditos técnicos y académicos
    │   ├── CharacterCard.tsx   # Tarjeta de personaje con toggle de favorito
    │   ├── PowerStatsChart.tsx # Gráfico de barras animadas de atributos de combate
    │   ├── FilterBar.tsx       # Buscador, filtros por facción y selector de orden
    │   └── ProtectedRoute.tsx  # Guardián de rutas autenticadas
    ├── layouts/
    │   └── MainLayout.tsx      # Layout base con Navbar y Footer
    └── pages/
        ├── HomePage.tsx            # Portada cinemática, hero y personajes destacados
        ├── CharactersPage.tsx      # Catálogo con paginación, búsqueda y filtros
        ├── CharacterDetailPage.tsx # Expediente biográfico completo y habilidades
        ├── FavoritesPage.tsx       # Colección de favoritos en Cloud Firestore
        ├── LoginPage.tsx           # Inicio de sesión con validaciones
        ├── RegisterPage.tsx        # Registro con validaciones avanzadas
        └── ForgotPasswordPage.tsx  # Recuperación de contraseña por correo
```

---

## 🎯 6. Cumplimiento de Criterios de Evaluación

| Criterio Requerido | Implementación |
| :--- | :--- |
| **1. Pantalla de inicio** | Hero cinematográfico "EXPLORE THE MARVEL UNIVERSE", personajes destacados, métricas clave y secciones explicativas. |
| **2. Pantalla de registro** | Formulario con validaciones en tiempo real (mínimo 3 caracteres, email válido, contraseña con mayúscula, minúscula, número y símbolo, confirmación idéntica), creación en Firebase Auth y guardado de perfil en Firestore. |
| **3. Pantalla de personajes** | Expediente clasificado con imagen ampliada, biografía, primera aparición, lugar de nacimiento, afiliaciones, rasgo físico y barras animadas de las 6 habilidades de combate. |
| **4. API externa gratuita** | Integración real con `https://akabab.github.io/superhero-api/api/all.json` filtrando `Marvel Comics`. Sin datos inventados ni simulados. |
| **5. Web Service REST** | Uso de `fetch()` HTTP `GET`, parsing JSON, manejo de errores de conexión y arquitectura desacoplada en `src/services/superheroService.ts`. |
| **6. Autenticación segura** | Firebase Authentication modular (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `updateProfile`, `signOut`, `sendPasswordResetEmail`, `sendEmailVerification`). Rutas protegidas (`ProtectedRoute`). |
| **7. Base de datos Firebase** | Cloud Firestore NoSQL estructurado en `users/{uid}/favorites/{characterId}` con reglas de seguridad ABAC aplicadas. |
| **8. Variables de entorno** | Configuración mediante `.env` leída vía `import.meta.env.*`. |
| **9. Archivo .env excluido** | Incluido en `.gitignore` y protegido. Solo se versiona `.env.example`. |
| **10. Diseño UX/UI cinematográfico** | Paleta oficial Marvel (`#ED1D24`, `#080808`, `#181818`), tipografías temáticas, efectos hover con resplandor rojo y diseño 100% responsive. |
