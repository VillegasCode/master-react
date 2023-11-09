import React from 'react';
import { useForm } from '../../hooks/useForm';

export const Register = () => {

  const {form, changed} = useForm({});

  const saveUser = async(e) => {
    //Prevenir actualización de pantalla al presionar el botón registrar
    e.preventDefault();

    //Recoger datos del formulario
    let newUser = form;

    //Guardar usuario en el backend
    console.log(newUser);
    //const request = await fetch("url completa", opciones)
  }


  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">
        <form className='register-form' onSubmit={saveUser}>
          <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input type='text' name='name' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Apellidos</label>
            <input type='text' name='surname' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Correo Electrónico</label>
            <input type='email' name='email' onChange={changed} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input type='password' name='password' onChange={changed} />
          </div>

          <input type='submit' value='Regístrate' className='btn btn-success' onChange={changed} />
        </form>
      </div>
    </>
  )
}
