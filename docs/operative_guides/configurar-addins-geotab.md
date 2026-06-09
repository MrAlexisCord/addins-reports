# Guía de Configuración de Addins en MyGeotab

> **Versión:** 1.0 | **Fecha:** 2026-06-09
> Aplica al proyecto `addins-reports` (React 19 + Vite 8 + TypeScript 6).

---

## Índice

1. [Conceptos fundamentales](#1-conceptos-fundamentales)
2. [Guía paso a paso: publicar un reporte React como addin](#2-guía-paso-a-paso-publicar-un-reporte-react-como-addin)
3. [Qué necesita tu aplicación React para funcionar como addin](#3-qué-necesita-tu-aplicación-react-para-funcionar-como-addin)
4. [Checklist de verificación](#4-checklist-de-verificación)

---

## 1. Conceptos fundamentales

### ¿Qué es un Addin de MyGeotab?

Un **addin** es una extensión de la interfaz web de MyGeotab. MyGeotab carga el addin dentro de un `<iframe>` embebido en su shell de navegación. La plataforma inyecta automáticamente dos objetos globales en el `window` del iframe:

| Objeto | Propósito |
|---|---|
| `window.geotab` (`GeotabApi`) | Permite llamar a métodos del SDK de MyGeotab (ej. `Get`, `Search`, `GetSession`) |
| `window.state` (`GeotabState`) | Contiene la base de datos activa, usuario y servidor |

### Modos de operación

| Modo | Descripción |
|---|---|
| **Page addin** | Se incrusta como una página de navegación dentro de MyGeotab (menú lateral) |
| **Button addin** | Aparece como un botón en una página existente de MyGeotab |
| **Map addin** | Se superpone sobre el mapa interactivo |

El reporte `PnP & PNA` usa el modo **Page addin** (`"page": "map"` en `addin.json`).

### Cómo MyGeotab carga el addin

```
MyGeotab Shell
  └── <iframe src="https://tudominio.com/index.html">
        └── Tu SPA React (cargada con Hash Router)
              └── Recibe window.geotab y window.state inyectados por el shell
```

El iframe requiere que la URL esté **accesible públicamente vía HTTPS**. No se soportan URLs locales en producción.

---

## 2. Guía paso a paso: publicar un reporte React como addin

### Paso 1 — Compilar la aplicación para producción

Asegúrate de tener las variables de entorno de producción configuradas antes de compilar.

```bash
# 1. Crea el archivo de entorno de producción (solo una vez)
copy .env.example .env.production

# 2. Edita .env.production con los valores reales:
#    VITE_API_BASE_URL=https://api.tudominio.com
#    VITE_SYNCFUSION_LICENSE_KEY=<tu-licencia>
#    VITE_PAGE_SIZE=10

# 3. Compilar
npm run build
```

El output se genera en la carpeta `dist/`. Contiene:
- `index.html` — punto de entrada del SPA
- `assets/` — JS, CSS y recursos con hash de contenido
- `addin.json` — descriptor del addin (copiado desde `public/`)

> **Importante:** Vite genera nombres de archivo con hash (`main-Abc123.js`). El `addin.json` solo necesita apuntar a `index.html`; el HTML ya incluye las referencias correctas.

---

### Paso 2 — Publicar los archivos en un servidor HTTPS

MyGeotab **exige HTTPS** para todos los addins. Las opciones más comunes son:

| Opción | Descripción |
|---|---|
| **Azure Static Web Apps** | Recomendado. HTTPS gratuito, dominio personalizado, CI/CD con GitHub Actions |
| **Azure Blob Storage + CDN** | Económico, HTTPS via Azure CDN |
| **Nginx / IIS en servidor propio** | Requiere certificado TLS configurado manualmente |
| **Netlify / Vercel** | Rápido para prototipos, HTTPS automático |

Sube el **contenido completo de `dist/`** a la raíz del hosting. La URL final debe resolver a `index.html`.

**Ejemplo de URL resultante:**
```
https://reports.tudominio.com/index.html
```

---

### Paso 3 — Configurar el `addin.json`

El archivo `public/addin.json` es el **descriptor del addin**. MyGeotab lo lee para saber cómo registrar la extensión.

```json
{
  "name": "RouteTracking Reports",
  "supportEmail": "dev@routetracking.local",
  "version": "1.0.0",
  "items": [
    {
      "page": "map",
      "title": {
        "es": "RT Reports",
        "en": "RT Reports"
      },
      "noView": false,
      "url": "https://reports.tudominio.com/index.html"
    }
  ]
}
```

**Campos clave:**

| Campo | Descripción |
|---|---|
| `name` | Nombre identificador del addin en MyGeotab |
| `version` | Versión semántica. Actualizar en cada publicación importante |
| `items[].page` | En qué página de MyGeotab se muestra (`map`, `engine`, `logs`, etc.) |
| `items[].title` | Texto del menú por idioma (objeto `{ "es": "...", "en": "..." }`) |
| `items[].url` | **URL absoluta y pública** al `index.html` del addin (HTTPS obligatorio) |
| `items[].noView` | `false` = el addin ocupa el área de contenido completo del iframe |

> El `addin.json` en `public/` también se despliega en `dist/`. Sin embargo, la URL dentro del campo `url` debe ser la URL pública, **no una ruta relativa**.

---

### Paso 4 — Registrar el addin en MyGeotab

1. Iniciar sesión en **MyGeotab** con una cuenta con rol de **Administrador**.
2. Navegar a: `Administración → Sistema → Complementos del sistema`.
3. Hacer clic en **`+ Nuevo`**.
4. En el campo **"Origen del archivo de configuración del complemento (JSON)"**, pegar la URL pública del `addin.json`:
   ```
   https://reports.tudominio.com/addin.json
   ```
   O bien pegar directamente el contenido JSON en el campo de texto.
5. Hacer clic en **`Guardar`**.
6. Recargar la página de MyGeotab (`F5`).
7. El ítem del addin debe aparecer en la barra de navegación lateral bajo la página configurada.

> **Nota:** Si el addin ya existía y se actualizó, a veces es necesario limpiar la caché del navegador (`Ctrl+Shift+Del`) para que MyGeotab cargue la nueva versión.

---

### Paso 5 — Verificar el funcionamiento del iframe

1. Abrir MyGeotab y navegar al addin recién registrado.
2. El iframe debe cargar la SPA React.
3. Abrir las **DevTools del navegador** (`F12`) → pestaña **Console**.
4. Verificar que no aparecen errores de CORS ni de Content Security Policy (CSP).
5. En la consola, verificar que `window.geotab` está disponible:
   ```javascript
   // Ejecutar en la consola del iframe seleccionado en DevTools
   window.geotab?.getSession(s => console.log(s))
   // Debe imprimir: { database: "tuBD", userName: "user@mail.com", server: "my.geotab.com" }
   ```

---

### Paso 6 — Configurar CORS en el backend

El navegador bloqueará las peticiones de la SPA al API backend si el servidor no permite el origen del hosting del addin.

En el backend .NET, agregar el origen del addin a la política CORS:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AddinsPolicy", policy =>
    {
        policy
            .WithOrigins(
                "https://reports.tudominio.com",  // URL del addin
                "https://*.geotab.com"            // Shell de MyGeotab
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

app.UseCors("AddinsPolicy");
```

---

## 3. Qué necesita tu aplicación React para funcionar como addin

Esta sección documenta los requisitos técnicos que ya están implementados en este proyecto y los que deben revisarse antes de cada publicación.

### 3.1 Hash Router (obligatorio)

MyGeotab carga el addin en un `<iframe>`. La **History API del navegador no está disponible** en ese contexto, por lo que el router debe usar fragmentos de hash (`#/ruta`).

```typescript
// src/config/router.tsx
import { createHashRouter } from 'react-router-dom'

export const router = createHashRouter([
  // ...rutas
])
```

> **No usar** `createBrowserRouter` ni `BrowserRouter`. Provocaría rutas rotas dentro del iframe.

---

### 3.2 Integración con `window.geotab` (obligatorio)

La plataforma inyecta `window.geotab` después de que el iframe carga. El hook `useGeotabApi` implementa el patrón correcto:

```typescript
// src/hooks/useGeotabApi.ts
useEffect(() => {
  if (window.geotab) {
    window.geotab.getSession((s) => setSession(s))
  }
}, [])
```

**Reglas importantes:**
- Siempre verificar `if (window.geotab)` antes de llamarlo — en desarrollo local no existe.
- Definir un valor fallback para desarrollo (`VITE_DEV_DATABASE`).
- Los tipos están en `src/config/geotab.ts` (`GeotabApi`, `GeotabState`).

---

### 3.3 El archivo `addin.json` en `public/` (obligatorio)

Debe existir en `public/addin.json` para que Vite lo copie a `dist/` en cada build. En **producción**, el campo `url` dentro de `items` debe apuntar a la URL HTTPS pública.

Para manejar la URL por entorno, considera parametrizarla con una variable de entorno:

```json
// addin.json (estrategia: mantener solo en producción)
{
  "items": [{
    "url": "https://reports.tudominio.com/index.html"
  }]
}
```

O bien generar el archivo vía un script de post-build que lea `VITE_ADDIN_URL`.

---

### 3.4 Variables de entorno por entorno (obligatorio)

| Variable | Desarrollo | Producción |
|---|---|---|
| `VITE_API_BASE_URL` | `https://localhost:7268` | URL del API en producción |
| `VITE_SYNCFUSION_LICENSE_KEY` | Licencia de dev (puede ser Community) | Licencia de producción |
| `VITE_PAGE_SIZE` | `10` | `10` (o ajustar) |
| `VITE_APP_FONT_FAMILY` | `"Segoe UI, Roboto, sans-serif"` | Misma o personalizada |
| `VITE_DEV_DATABASE` | Base de datos Geotab de prueba | No se usa en producción |

Archivos:
- `.env.development` — cargado con `npm run dev`
- `.env.production` — cargado con `npm run build`
- `.env.example` — plantilla sin valores sensibles (sí va al repositorio)

---

### 3.5 Configuración de Vite para producción (recomendado)

Verificar que `vite.config.ts` no tenga `base` apuntando a una ruta incorrecta. Para hosting en raíz de dominio:

```typescript
// vite.config.ts
export default defineConfig({
  base: '/',   // Raíz — valor por defecto, correcto para la mayoría de hostings
  // ...
})
```

Si el addin se sirve desde una sub-ruta (ej. `https://dominio.com/reportes/`), ajustar:
```typescript
base: '/reportes/',
```

---

### 3.6 Seguridad: headers recomendados en el servidor

El servidor que sirve el addin debe incluir estos headers HTTP para que MyGeotab pueda embeber el contenido:

```
# NO enviar X-Frame-Options: DENY ni SAMEORIGIN
# Geotab necesita poder embeber el addin en su iframe

Content-Security-Policy: frame-ancestors https://*.geotab.com
```

Si el servidor envía `X-Frame-Options: DENY`, MyGeotab **no podrá cargar el addin** en el iframe.

---

### 3.7 Licencia de Syncfusion (obligatorio en producción)

Sin una licencia válida, los componentes de Syncfusion muestran un banner de alerta. La licencia se registra antes del mount en `src/main.tsx`:

```typescript
if (ENV.SYNCFUSION_LICENSE) {
  registerLicense(ENV.SYNCFUSION_LICENSE)
}
```

La clave se obtiene en [syncfusion.com/account](https://www.syncfusion.com/account/my-account).

---

## 4. Checklist de verificación

Usar esta lista antes de cada despliegue a producción y al verificar que el addin funciona en MyGeotab.

### 4.1 Build y artefactos

- [ ] `npm run lint` pasa sin errores
- [ ] `npm run test:coverage` pasa con ≥ 90% de cobertura (líneas y ramas)
- [ ] `npm run build` completa sin errores de TypeScript ni Vite
- [ ] La carpeta `dist/` fue generada y contiene `index.html`, `assets/` y `addin.json`
- [ ] `dist/addin.json` tiene la URL correcta de producción en `items[].url`
- [ ] La versión en `addin.json` fue incrementada si hubo cambios significativos

### 4.2 Variables de entorno de producción

- [ ] `.env.production` existe y **no está en el repositorio** (está en `.gitignore`)
- [ ] `VITE_API_BASE_URL` apunta al API de producción (HTTPS)
- [ ] `VITE_SYNCFUSION_LICENSE_KEY` contiene una licencia válida y activa
- [ ] `VITE_PAGE_SIZE` tiene el valor correcto
- [ ] `VITE_DEV_DATABASE` está vacío o ausente en producción

### 4.3 Servidor / Hosting

- [ ] Los archivos de `dist/` están publicados en el servidor de hosting
- [ ] La URL del hosting resuelve a `index.html` correctamente en HTTPS
- [ ] El certificado TLS es válido (no autofirmado, no expirado)
- [ ] El servidor **no envía** el header `X-Frame-Options: DENY` ni `SAMEORIGIN`
- [ ] El servidor envía `Content-Security-Policy: frame-ancestors https://*.geotab.com`
- [ ] CORS está habilitado en el API backend para el origen del hosting del addin
- [ ] Los archivos estáticos (`assets/`) responden con código HTTP 200

### 4.4 Registro del addin en MyGeotab

- [ ] Se accedió con una cuenta de rol **Administrador**
- [ ] El addin fue registrado en `Administración → Sistema → Complementos del sistema`
- [ ] Se usó la URL pública del `addin.json` (no una ruta local)
- [ ] El addin aparece en la lista de complementos sin errores de carga
- [ ] Se recargó la página de MyGeotab después del registro (`F5`)

### 4.5 Verificación funcional dentro del addin

- [ ] El ítem del addin aparece en el menú de navegación de MyGeotab
- [ ] El iframe carga sin pantalla en blanco ni error de red (pestaña Network en DevTools)
- [ ] No aparecen errores de CORS en la consola del navegador
- [ ] No aparecen errores de CSP (Content Security Policy) en la consola
- [ ] `window.geotab` está disponible dentro del iframe (verificable en DevTools)
- [ ] El hook `useGeotabApi` obtiene la sesión correcta (base de datos, usuario, servidor)
- [ ] Las llamadas al API backend retornan datos correctos (verificar pestaña Network)
- [ ] El reporte PnP & PNA carga y muestra datos correctamente
- [ ] Los filtros de la grilla funcionan (Excel filters, ordenamiento, redimensionado)
- [ ] Los parámetros de búsqueda se reflejan en la URL (query params en el hash)
- [ ] No aparece el banner de licencia de Syncfusion

### 4.6 Compatibilidad y accesibilidad

- [ ] El addin funciona en Chrome, Edge y Firefox (los más usados en entornos corporativos)
- [ ] El responsive del addin es aceptable en el ancho del iframe de MyGeotab (aprox. 1100-1400 px)
- [ ] No hay errores de consola en ningún navegador probado

---

## Referencias

- [Documentación oficial de Addins MyGeotab](https://developers.geotab.com/myGeotab/addIns/addIns)
- [SDK de MyGeotab — métodos disponibles](https://developers.geotab.com/myGeotab/api/reference)
- [Syncfusion License Registration](https://www.syncfusion.com/account/my-account)
- [Vite — Static Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [`public/addin.json`](../../public/addin.json) — descriptor del addin de este proyecto
- [`src/config/geotab.ts`](../../src/config/geotab.ts) — tipos de la API Geotab
- [`src/hooks/useGeotabApi.ts`](../../src/hooks/useGeotabApi.ts) — hook de sesión Geotab
- [`src/config/router.tsx`](../../src/config/router.tsx) — Hash Router configurado
