import React from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AuthProvider } from './api/AuthContext';
import RegisterScreen from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProjectDetail from './pages/ProjectOverview';
import ProtectedRoute from './api/ProtectedRoutes';
import LandingPage from './pages/LandingPage';

const App = () => (
  <div className="flex flex-col h-screen">
    <div className="flex flex-1 overflow-y-auto">
      <div className="flex-1 bg-gray-50 w-full">
        <Outlet />
      </div>
    </div>
  </div>
);

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [


      { path: 'login', element: <Login /> },
      { path: '/', element: <LandingPage /> },
      { path: 'register', element: <RegisterScreen /> },
      { path: 'forgotpassword', element: <ForgotPassword /> },
      {
        path: 'dashboard',
        element: <ProtectedRoute > <Dashboard /> </ProtectedRoute>
      },

      {
        path: 'project/:id',
        element: <ProtectedRoute > <ProjectDetail /> </ProtectedRoute>
      },


    ]
  }
]);

export { App, AppRouter };
