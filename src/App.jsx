import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';
import ErrorBoundary from 'ui-component/ErrorBoundary';

// auth provider
import { AuthProvider } from 'contexts/AuthContext';
import { TravelContentProvider } from 'contexts/TravelContentContext';

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ErrorBoundary>
        <NavigationScroll>
          <AuthProvider>
            <TravelContentProvider>
              <RouterProvider router={router} />
            </TravelContentProvider>
          </AuthProvider>
        </NavigationScroll>
      </ErrorBoundary>
    </ThemeCustomization>
  );
}
