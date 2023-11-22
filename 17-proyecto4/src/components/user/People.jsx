import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth'

export const People = () => {

  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);

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
      setFollowing(data.user_following);
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

  const follow = async (userId) => {
    //petición al backend para guardar el follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    //cuando este todo correcto
    if (data.status == "success") {
      //Actualizar estado de following agregando el nuevo follow
      setFollowing([...following, userId])
    }

  }

  const unfollow = async (userId) => {
    //petición al backend para borrar el follow
    const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    //cuando este todo correcto
    if (data.status == "success") {
      //Actualizar estado de following
      //filtrando los datos para eliminar el antiguo userId
      //que acabo de dejar de seguir
      let filterFollowings = following.filter(followingUserId => userId !== followingUserId);
      setFollowing(filterFollowings);
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

              {/* SOLO MOSTRAR ESTO CUANDO EL USUARIO NO SEA EL MÍO */}
              {user._id != auth._id &&
                <div className="post__buttons">
                  {!following.includes(user._id) &&
                    <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                      Seguir
                    </button>
                  }

                  {following.includes(user._id) &&
                    <button className="post__button" onClick={() => unfollow(user._id)}>
                      Dejar de seguir
                    </button>
                  }

                </div>
              }
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
