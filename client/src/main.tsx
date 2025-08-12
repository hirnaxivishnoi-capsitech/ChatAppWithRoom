import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import './index.css'
import App from './App.tsx'
import { store , persistor} from './store/index.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
             <QueryClientProvider client={queryClient}>
            <App />
            </QueryClientProvider>
          </PersistGate>
        </Provider>
  </StrictMode>,
)
