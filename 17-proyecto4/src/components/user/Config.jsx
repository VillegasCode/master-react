import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';

export const Config = () => {

  const {auth} = useAuth();

  const [saved, setSaved] = useState("not_saved");

  const updateUser = (e) => {

    console.log(auth);

    e.preventDefault();
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">AJUSTES</h1>
      </header>

      <div className="content__posts">

        {saved == "saved" ?
          <strong className='alert alert-success'>Usuario Registrado correctamente!"</strong>
          : ""}

        {saved == "duplicate" ?
          <strong className='alert alert-danger'>No se puede registrar, el usuario ya existe</strong>
          : ""}

        {saved == "error" ?
          <strong className='alert alert-danger'>"Error, no se registró usuario!"</strong>
          : ""}

        <form className='config-form' onSubmit={updateUser}>
          <div className='form-group'>
            <label htmlFor='name'>Nombre</label>
            <input type='text' name='name' defaultValue={auth.name} />
          </div>

          <div className='form-group'>
            <label htmlFor='surname'>Apellidos</label>
            <input type='text' name='surname' defaultValue={auth.surname} />
          </div>

          <div className='form-group'>
            <label htmlFor='nick'>Nickname</label>
            <input type='text' name='nick' defaultValue={auth.nick} />
          </div>

          <div className='form-group'>
            <label htmlFor='bio'>Biografía</label>
            <textarea name='bio' defaultValue={auth.bio} />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Correo Electrónico</label>
            <input type='email' name='email' defaultValue={auth.email} />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input type='password' name='password' />
          </div>

          <div className='form-group'>
            <label htmlFor='file0'>Avatar</label>
            <div className="general-info__container-avatar">
                            {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image == "default.png" && <img src={avatar} className='container-avatar__img' alt="Foto de perfil" />}
            </div>
            <br />
            <input type='file' name='file0' id="file" />
          </div>
          <br/>

          <input type='submit' value='Regístrate' className='btn btn-success' />
        </form>
      </div>
    </>
  )
}