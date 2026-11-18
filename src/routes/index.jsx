import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import TravelRoutes from './TravelRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([TravelRoutes, AuthenticationRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
