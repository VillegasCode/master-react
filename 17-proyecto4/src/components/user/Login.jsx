import React from 'react'
import { useForm } from '../../hooks/useForm';

export const Login = () => {

  //Rellenar el estado de form con el método changed que se importan del componente HOOKS useForm.jsx
  const { form, changed } = useForm({});

  const loginUser = async (e) => {
    e.preventDefault();

    //Recoger los datos del usuario a través del método changes y guardarlos en el estado form
    console.log(form);
    let userToLogin = form;

    //Peticion al backend


    //Persistir los datos en el navegador


  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">LOGIN</h1>
      </header>

      <div className="content__posts">

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
