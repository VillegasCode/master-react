import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';

export const People = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers(nextPage);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Petición para sacar usuarios
    const request = await fetch(Global.url + 'user/list/' + nextPage, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    //Crear un estado para poder listar usuarios
    if (data.users && data.status == "success") {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);

      //Termina de hacer la petición AJAX entonces se vuelve false el estado LOADING
      setLoading(false);

      //Paginación
      if (users.length >= (data.total - data.users.length)) {
        setMore(false);
      }
    }
  }

  //Mostrar usuarios de acuerdo a sus páginas correspondientes (PAGINAR USUARIOS Y LISTARLOS)
  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
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

                <a href="#" className="post__button post__button--green">
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

        {loading ? <h1>Cargando...</h1> : ""}

      {more &&
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas personas
          </button>
        </div>
      }
    </section>
  )
}
