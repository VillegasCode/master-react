import React from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from 'react-router-dom';
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { Feed } from "../components/publication/Feed";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../components/user/Logout";
import { People } from "../components/user/People";
import { Config } from "../components/user/Config";

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* RUTA PUBLICA */}
                    <Route path="/" element={<PublicLayout />} >
                        <Route index element={<Login />} />
                        <Route path="login" element={<Login />} />
                        <Route path="registro" element={<Register />} />
                    </Route>

                    {/* RUTA PRIVADA */}
                    <Route path="/social" element={<PrivateLayout />}>
                        <Route index element={<Feed />} />
                        <Route path="feed" element={<Feed />} />
                        <Route path="logout" element={<Logout />} />
                        <Route path="gente" element={<People />} />
                        <Route path="ajustes" element={<Config/>} />
                    </Route>

                    {/* RUTA DE ERROR 404 */}
                    <Route path="*" element={
                        <>
                            <p>
                                <h1>Error 404</h1>
                                <Link to="/">Volver al Inicio</Link>
                            </p>
                        </>
                    }>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}