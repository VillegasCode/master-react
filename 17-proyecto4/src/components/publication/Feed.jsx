import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { useParams, Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';
import { UserList } from '../user/UserList';

export const Feed = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([]);
    const [more, setMore] = useState(true);
    const params = useParams();

    useEffect(() => {
        getPublications(1, false);
        getUsers(1);
    }, []);

    const getUsers = async (nextPage = 1) => {
        //Efecto de carga
        setLoading(true);

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
            console.log("USERS de Feed: " + JSON.stringify(data.users));
            setUsers(newUsers);
            setFollowing(data.user_following);
            //Termina de hacer la petición AJAX entonces se vuelve false el estado LOADING
            setLoading(false);
        }
    }

    const getPublications = async (nextPage = 1, showNews = false) => {
        if (showNews) {
            setPublications([]);
            setPage(1);
            nextPage = 1;
        }

        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            let newPublications = data.publications;

            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            setPublications(newPublications);

            if (!showNews && publications.length >= (data.total - data.publications.length)) {
                setMore(false);
            }
        }
    }

    return (
        <section className="layout__content">
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
            </header>

            <PublicationList
                publications={publications}
                users={users}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            />

            <br />

        </section>
    )
}