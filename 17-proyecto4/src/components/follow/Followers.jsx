import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';
import { useParams } from 'react-router-dom';

export const Followers = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  const params = useParams();
  
  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Efecto de carga
    setLoading(true);


    //Sacar userId de la url
    const userId = params.userId;

    //Petición para sacar usuarios
    const request = await fetch(Global.url + 'follow/followers/' + userId + "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    //Recorrer y limpiar follows para quedarme con followed
    let cleanUsers = [];
    data.follows.forEach(follow => {
        cleanUsers = [...cleanUsers, follow.user]
    });

    data.users = cleanUsers;

    console.log(cleanUsers);

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



  return (
    <section className="layout__content">

      <header className="content__header">
        <h1 className="content__title">Seguidores de NOMBRE USUARIO</h1>
      </header>

      <UserList users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        more={more}
        loading={loading}
      />
      <br />
    </section>
  )
}
