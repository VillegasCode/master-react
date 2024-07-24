import React, { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { Login } from './Login';

export const Register = () => {

  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sent");
  const myForm = document.querySelector("#register-form");

  const saveUser = async (e) => {
    //Prevenir actualización de pantalla al presionar el botón registrar
    e.preventDefault();

    //Recoger datos del formulario
    let newUser = form;

    //Guardar usuario en el backend
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-type": "application/json"
      }
    });

    const data = await request.json();


    if (data.status == "success") {
      setSaved("saved");
      //Limpiar formulario de registro
      myForm.reset();
      //REDIRECCIÓN DE REGISTER AL LOGIN
      setTimeout(() => {
        location.href = "/login";
      }, 1000);
    } else if (data.status == "duplicate") {
      setSaved("duplicate");
    } else {
      setSaved("error");
    }

  } //FIN DEL MÉTODO GUARDAR


  return (
    <>
    <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">

        {saved == "saved" ?
          <strong className='alert alert-success'>Usuario Registrado correctamente!"</strong>
          : ""}

        {saved == "duplicate" ?
          <strong className='alert alert-danger'>No se puede registrar, el usuario ya existe</strong>
          : ""}

        {saved == "error" ?
          <strong className='alert alert-danger'>"Error, no se registró usuario! " {saved}</strong>
          : ""}

        <form id='register-form' className='register-form' onSubmit={saveUser}>
          <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input type='text' name='name' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='name'>Apellidos</label>
            <input type='text' name='surname' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='nick'>Nickname</label>
            <input type='text' name='nick' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Correo Electrónico</label>
            <input type='email' name='email' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña (min: 8, max: 16 caracteres)</label>
            <input type='password' name='password' onChange={changed} />
          </div>

          <input type='submit' value='Regístrate' className='btn btn-success' onChange={changed} />
        </form>
      </div>
      </>
  )
}