import { lazy } from 'react';

import Loadable from 'ui-component/Loadable';
import AuthLayout from 'views/auth/AuthLayout';

const LoginPage = Loadable(lazy(() => import('views/auth/LoginPage')));
const RegisterPage = Loadable(lazy(() => import('views/auth/RegisterPage')));

const AuthenticationRoutes = {
  element: <AuthLayout />,
  children: [
    { path: 'login', element: <LoginPage /> },
    { path: 'pages/login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
    { path: 'pages/register', element: <RegisterPage /> }
  ]
};

export default AuthenticationRoutes;
