import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const PrivateLayout = () => {
    const { auth, loading } = useAuth();

    if (loading) {
        return <h1>Cargando...</h1>;
    }

    return (
        <>
            {/* Cabecera y Navegación */}
            <Header />

            {/* MAIN CONTENT */}
            <section className="layout__content">
                {/* Conditional for verify if the user is logged */}
                {auth._id ? <Outlet /> : <Navigate to="/login" />}
            </section>

            {/* Barra Lateral */}
            <Sidebar />
        </>
    );
}
