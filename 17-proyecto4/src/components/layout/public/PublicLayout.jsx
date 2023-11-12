import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Header } from './Header';
import useAuth from '../../../hooks/useAuth';

export const PublicLayout = () => {

  const { auth } = useAuth();

  return (
    <>
      {/*LAYOUT*/}
      <Header />

      {/* MAIN CONTENT */}
      <section className="layout__content">
        {/* Conditional to knows if the user is identified with his token */}
        {!auth._id ?
          <Outlet />
          :
          <Navigate to="/social" />
        }
      </section>
    </>
  )
}
