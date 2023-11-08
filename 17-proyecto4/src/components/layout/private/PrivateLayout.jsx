import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const PrivateLayout = () => {
    return (
        <>
            {/* Cabecera y Navegación */}
            <Header />

            {/* MAIN CONTENT */}
            <section className="layout__content">
                <Outlet />
            </section>

            {/* Barra Lateral */}
            <Sidebar />
        </>
    )
}
