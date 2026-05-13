import React from 'react';
import { Navigate } from 'react-router-dom';
import MainPage from "../pages/UserPages/index.jsx";
import ProjectsPage from "../pages/ProjectsPage.jsx";
import PublicProjectPage from "../pages/PublicProjectPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const ROUTES = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                path: 'admin',
                element: <ProtectedRoute><ProjectsPage/></ProtectedRoute>,
            },
            {
                path: ':slug',
                element: <PublicProjectPage/>,
            },
            {
                path: 'login',
                element: <LoginPage/>
            }
        ]
    }
];