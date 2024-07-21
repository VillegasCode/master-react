import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';

export const Config = () => {

  const { auth, setAuth } = useAuth();

  const [saved, setSaved] = useState("not_saved");


  const updateUser = async (e) => {
    e.preventDefault();

    //Recoger datos del formulario
    let newDataUser = SerializeForm(e.target);

    //Capturar el token desde el localstorage
    const token = localStorage.getItem("token");

    //Borrar propiedad innecesaria
    delete newDataUser.file0;

    //Actualizar usuario en la base de datos, hacer petición ajax
    const request = await fetch(Global.url + 'user/update', {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await request.json();

    if (data.status == "success" && data.user) {
      delete data.userUpdated.password;
      setAuth(data.userUpdated);
      setSaved("saved");
      console.log(JSON.stringify(data));
    } else {
      setSaved("error");
    }

    //Subida de imágenes
    const fileInput = document.querySelector("#file");

    if (data.status == "success" && fileInput.files[0]){

      //Recoger imagen a subir
      const formData = new FormData();
      formData.append('file0', fileInput.files[0]);

      //Petición para enviar el fichero
      const uploadRequest = await fetch(Global.url + "user/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": token
        }
      });
      const uploadData = await uploadRequest.json();

      if (uploadData.status == "success" && uploadData.user) {
        setAuth(uploadData.user);
        setSaved("saved");
      } else {
        setSaved("error");
      }
    }
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">AJUSTES</h1>
      </header>

      <div className="content__posts">

        {saved == "saved" ?
          <strong className='alert alert-success'>Usuario Actualizado correctamente!"</strong>
          : ''}


        {saved == "error" ?
          <strong className='alert alert-danger'>"Error, no se actualizó usuario!"</strong>: ''}

        <form className='config-form' onSubmit={updateUser}>
          <div className='form-group'>
            <label htmlFor='name'>ID</label>
            <input type='text' name='_id' defaultValue={auth._id} disabled={true} />
          </div>
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
            <input type="file" name="file0" id="file" />
          </div>
          <br />

          <input type='submit' value='Actualizar' className='btn btn-success' />
        </form>
      </div>
    </>
  )
}