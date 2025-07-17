// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { Providers } from '@/contexts/Providers';

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
