import React from 'react'
import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';

export const Login = () => {

  //Rellenar el estado de form con el método changed que se importan del componente HOOKS useForm.jsx
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sent");

  const {setAuth} = useAuth();

  const loginUser = async (e) => {
    e.preventDefault();

    //Recoger los datos del usuario a través del método changes y guardarlos en el estado form
    //console.log(form);
    let userToLogin = form;

    //Peticion al backend
    const request = await fetch(Global.url + 'user/login', {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();
    console.log("data tiene: " + JSON.stringify(data));

    //Persistir LA SESIÓN con el TOKEN en todo el navegador mientras tenga la sesión iniciada
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.status == "success") {
      setSaved("login");

      //SETEAR LOS DATOS EN EL AUTH
      setAuth(data.user);
      console.log("DATA.USER: " + JSON.stringify(data.user));
      //REDIRECCIÓN DE LOGIN AL FEED
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } else {
      setSaved("error");
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">LOGIN</h1>
      </header>

      <div className="content__posts">
        {saved == "login" ?
          <strong className='alert alert-success'>Usuario identificado correctamente!"</strong>
          : ""}

        {saved == "error" ?
          <strong className='alert alert-danger'>"Error, usuario o contraseña no existen"</strong>
          : ""}
        <form className='form-login' onSubmit={loginUser}>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input type='password' name='password' onChange={changed} />
          </div>

          <input type='submit' value="Identifícate" className="btn btn-success" />

        </form>
      </div>
    </>
  )
}
