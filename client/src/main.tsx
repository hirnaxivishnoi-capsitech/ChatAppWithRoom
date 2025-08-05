import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import './index.css'
import App from './App.tsx'
import { store , persistor} from './store/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
  </StrictMode>,
)
