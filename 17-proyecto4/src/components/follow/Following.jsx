import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';

export const Following = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();
  
  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile); //VER VIDEO 324
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Efecto de carga
    setLoading(true);


    //Sacar userId de la url
    const userId = params.userId;

    //Petición para sacar usuarios
    const request = await fetch(Global.url + 'follow/following/' + userId + "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await request.json();
    console.log(data);
    //Recorrer y limpiar follows para quedarme con followed
    let cleanUsers = [];
    data.follows.forEach(follow => {
        cleanUsers = [...cleanUsers, follow.followed]
    });

    data.users = cleanUsers;
    console.log("DATA USERS: " + data.users);

    

    //Crear un estado para poder listar usuarios
    if (data.users && data.status == "success") {

      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      console.log(newUsers);

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

  //(Actualmente está en un helper llamado GetProfile) Método para sacar datos del usuario logueado por su id
  //Este método lo sacamos cada vez que recargamos la página POR ESO LO PONEMOS EN EL useEffect
  //   const getProfile = async() => {
  //   const request = await fetch(Global.url + "user/profile/" + params.userId, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type" : "application/json",
  //       "Authorization": localStorage.getItem("token")
  //     }
  //   });

  //   //Obtengo los datos en formato JSON de la petición ajax
  //   const data = await request.json();

  //   if (data.status == "success") {
  //     setUserProfile(data.Profile);
  //   }
  //   //console.log(data.Profile.name);
  // }


  return (
    <section className="layout__content">

      <header className="content__header">
        <h1 className="content__title">{userProfile.name} {userProfile.surname} sigue a:</h1>
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
