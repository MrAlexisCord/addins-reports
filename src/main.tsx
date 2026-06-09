import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { registerLicense } from '@syncfusion/ej2-base'
import 'react-toastify/dist/ReactToastify.css'

import { store } from '@store/index'
import { queryClient } from '@config/queryClient'
import { router } from '@config/router'
import { ENV } from '@config/env'

import '@styles/base.css'
import '@styles/syncfusion.css'
import '@styles/utilities.css'

/* Registrar licencia Syncfusion antes de montar la app */
if (ENV.SYNCFUSION_LICENSE) {
  registerLicense(ENV.SYNCFUSION_LICENSE)
}

/* Aplicar fuente desde variable de entorno al custom property CSS */
if (ENV.FONT_FAMILY) {
  document.documentElement.style.setProperty('--font-family-base', ENV.FONT_FAMILY)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="colored"
          style={{ zIndex: 'var(--z-toast)' }}
        />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
