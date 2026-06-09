# addins-reports — Agent Instructions

Part of the **RouteTrackingT2.Addins.Web.V2** system. A React 19 + TypeScript 6 + Vite 8 SPA for rendering addins reports.

## Commands

```bash
npm run dev        # Start dev server with HMR (Vite)
npm run build      # Type-check (tsc -b) then bundle
npm run lint       # ESLint across all .ts/.tsx files
npm run preview    # Serve the production build locally
```

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 (no import needed — JSX transform) |
| Language | TypeScript 6, strict mode, target ES2023 |
| Build | Vite 8 with `@vitejs/plugin-react` (Oxc transform) |
| Lint | ESLint 10 flat config (`eslint.config.js`) |
| Module resolution | `"bundler"` (Vite-optimized, not Node-style) |

## TypeScript Conventions

- Strict mode is on: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Do **not** import React explicitly — JSX transform handles it
- No path aliases configured yet; use relative imports

## Project State (early stage)

- No routing — add `react-router-dom` if navigation is needed
- No state management library — use React Context or a lightweight store
- No testing setup — add `vitest` + `@testing-library/react` when tests are needed
- No environment variables yet — use `.env` files (Vite loads `VITE_*` vars automatically)

## File Structure

```
src/
  App.tsx       # Root component
  main.tsx      # ReactDOM.createRoot entry point
  assets/       # Static images/SVGs imported in components
public/         # Files served at root URL (no import, referenced by path)
```

## ESLint Note

The current config uses `tseslint.configs.recommended`. For production work, upgrade to `recommendedTypeChecked` (see [README.md](README.md#expanding-the-eslint-configuration)).

# Rules
- Use CSS and BEM notation
- Use Arquitecture based on components with atomic design.
- Use syncfusion componentes and let me register the license from environtment variable.
- All tables/grids of syncfusion must have: Excel filters, Column Resizing, Ordering capability, and alingment based on excel aligments criteria.
- Use environtment variables.
- Use [Open API Docs](./docs/routetrackingt2addinsv2api-v1.json) for documentation of API for construction.
- Use latest version of Axios.
- Use Redux for state.
- Use TanQuery.
- Use best practices of frontend developing. Use hooks or create custom hooks.
- For palette of colors in css use variables.
- System must be able to let me change the font from css.
- Prototypes are inside the folder [Prototypes](./docs/prototypes/). Use them as reference, always try to omprove it. In more, use to get palette of colors.
- Use a middleware or boundary error when each error must obed to a notification, sweet alert, use react-toastify for that.
- Use interceptors or middleware on axios for control errors. Error on service or error on response, based on field "succeded" and show the message and the eeror messages of formated text.
- Use adapter pattern for responses of backend, backend service responses allways with the next structure (wrapper response must be its name): 
{
    {
        "succeeded": true | false, (bool)
        "message": string?,
        "errors": string[]?,
        "data": T?
    }
}
so you have to create a generic model or interface for that backend responses. So, you have to create for any backend response, a service model and application model, a service model is a reponse of backend, a application model is the model that frontend uses it, and for transform from service model to application model, you have to use and adapter, use Zod for this transformation.

For example:
If backed returns

{
    {
        "succeeded": true | false, (bool)
        "message": string?,
        "errors": string[]?,
        "data": T?
    }
}

- On security, make sure that configure origin so backend can be accesed.

- Every report created (in a view), must be able to published on mygeotab addins, so prepared to it; if you dont know how to do it or what app needs for that, make a deep search about that.

- Como estamos usando Vite, usa Vitest para las pruebas unitarias, las pruebas unitarias deben abarcar como mínimo el 90% de cobertura de ramas y de lineas. El objetivo es el 100%.

# Reglas adicionales 1
 Cada vez que se consuma un endpoint que tenga parametros por query, en el frontend se debe tener en cuenta que en la url del frontend, debe tener esos parametros en la query de la url.

 # Reglas adicionales 2
- El tamaño del paginado de las grillas/tablas debe tener una variable de entorno, si la variable no existe el valor por defecto es 10.

- Los componentes de syncfusion, deben obedecer a los colores del css.

- Si es posible dejar los textos de synfusion.