import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';

export const Following = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Efecto de carga
    setLoading(true);

    //Sacar userId de la URL
    const userId = params.userId;

    //Petición para sacar usuarios
    const request = await fetch(Global.url + 'follow/following/' + userId + '/' + nextPage, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();

    //Recorrer y limpiar follows para quedarme con followed
    if (data.status === "success") {
      let cleanUsers = [];
      data.follows.forEach(follow => {
        cleanUsers = [...cleanUsers, follow.followed]
      });
      data.users = cleanUsers;
      console.log("Los users FOLLOWING deben estar con sus nombres: " + data.users);

      //Crear un estado para poder listarlos
      if (data.users && data.status == "success") {
        let newUsers = data.users;

        if (users.length >= 1) {
          newUsers = [...users, ...data.users];
        }
        //El backend no tiene los datos completos dentro de follow
        //console.log(newUsers);
        setUsers(newUsers);
        //data.user_following contiene solo los ID de todos los usuarios a quienes estamos siguiendo
        setFollowing(data.user_following);
        setLoading(false);

        //Paginación
        if (users.length >= data.total - data.follows.length) {
          setMore(false);
        }

      }
    }
  }
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">{userProfile.name} {userProfile.surname} está siguiendo a:</h1>
      </header>

      <UserList
        users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        more={more}
        loading={loading}
      />
      <br />
    </>
  )
}