import React, { useEffect, useState } from 'react';
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
    GetProfile(params.userId, setUserProfile);
  }, [params.userId]);

  const getUsers = async (nextPage = 1) => {
    setLoading(true);
    const userId = params.userId;

    try {
      const request = await fetch(`${Global.url}follow/following/${userId}/${nextPage}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      });

      const data = await request.json();
      console.log(data); // Verificar la respuesta en la consola

      if (data.status === "success") {
        let cleanUsers = data.follows.map(follow => follow.followed);

        setUsers(prevUsers => nextPage === 1 ? cleanUsers : [...prevUsers, ...cleanUsers]);
        setFollowing(data.user_following);
        setLoading(false);

        if (nextPage >= data.totalPages) {
          setMore(false);
        }
      } else {
        setLoading(false);
        setMore(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
      setMore(false);
    }
  }

  return (
    <section className="layout__content">
      <header className="content__header">
        <h1 className="content__title">{userProfile.name} {userProfile.surname} sigue a:</h1>
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
    </section>
  );
}
