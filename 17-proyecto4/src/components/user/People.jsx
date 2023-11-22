import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';

export const People = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    //Petición para sacar usuarios
    const request = await fetch(Global.url + 'user/list/1', {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    //Crear un estado para poder listar usuarios
    if (data.users && data.status == "success") {
      setUsers(data.users);
      console.log(data.users);
      //Paginacion

    }
  }

  return (
    <section className="layout__content">

      <header className="content__header">
        <h1 className="content__title">GENTE</h1>
      </header>

      <div className="content__posts">

        {users.map(user => {
          return (
            <article className="posts__post" key={user._id}>

              <div className="post__container">

                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                    {user.image == "default.png" && <img src={avatar} className='post__user-image' alt="Foto de perfil" />}
                  </a>
                </div>

                <div className="post__body">

                  <div className="post__user-info">
                    <a href="#" className="user-info__name">{user.name} {user.surname}</a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">{user.created_at}</a>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>

                </div>

              </div>


              <div className="post__buttons">

                <a href="#" className="post__button post__">
                  Seguir
                </a>

                {/* <a href="#" className="post__button">
      Dejar de seguir
    </a> */}

              </div>

            </article>

          );
        })
        }



      </div>

      <div className="content__container-btn">
        <button className="content__btn-more-post">
          Ver mas personas
        </button>
      </div>

    </section>
  )
}
