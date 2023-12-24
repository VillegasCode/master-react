import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { GetProfile } from '../../helpers/GetProfile';
import { useParams, Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Profile = () => {

    const { auth } = useAuth();
    const [user, setUser] = useState({});
    const [counters, setCounters] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const params = useParams();

    useEffect(() => {
        getDataUser();
        getCounters();
        getPublications(1);
    }, []);

    useEffect(() => {
        getDataUser();
        getCounters();
        getPublications(1);
    }, [params]);

    const getDataUser = async () => {
        let dataUser = await GetProfile(params.userId, setUser);
        console.log(dataUser);
        if (dataUser.following && dataUser.following._id) setIFollow(true);
    }

    const getCounters = async () => {
        const request = await fetch(Global.url + "user/counters/" + params.userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.following) {
            setCounters(data);
        }
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
            //Actualizar estado de setIFollow
            setIFollow(true);
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
            //Actualizar estado de setIFollow
            setIFollow(false);
        }

    }

    const getPublications = async (nextPage = 1) => {
        const request = await fetch(Global.url + "publication/user/" + params.userId + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            let newPublications = data.publications;

            if (publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            setPublications(newPublications);

            if (publications.length >= (data.total - data.publications.length)) {
                setMore(false);
            }
        }
    }

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    }


    return (
        <section className="layout__content">

            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Foto de perfil" />}
                        {user.image == "default.png" && <img src={avatar} className='container-avatar__img' alt="Foto de perfil" />}
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1 className='grande'>{user.name}</h1>
                            {user._id != auth._id &&
                                (iFollow ?
                                    <button onClick={() => unfollow(user._id)} className="content__button content__button--right post__button">Dejar de seguir</button>
                                    :
                                    <button onClick={() => follow(user._id)} className="content__button content__button--right">Seguir</button>
                                )
                            }
                        </div>
                        <h2 className="container-names__nickname">{user.nick}</h2>
                        <p>{user.bio}</p>
                    </div>
                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/social/siguiendo/" + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.following >= 1 ? counters.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/seguidores/" + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followed >= 1 ? counters.followed : 0}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/social/perfil/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publications >= 1 ? counters.publications : 0}</span>
                        </Link>
                    </div>


                </div>
            </header>



            <div className="content__posts">

                {publications.map(publication => {
                    return (

                        <article className="posts__post" key={publication._id}>

                            <div className="post__container">

                                <div className="post__image-user">
                                    <Link to={"/social/perfil/" + publication.user._id} className="post__image-link">
                                        {publication.user.image != "default.png" && <img src={Global.url + "user/avatar/" + publication.user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {publication.user.image == "default.png" && <img src={avatar} className='post__user-image' alt="Foto de perfil" />}
                                    </Link>
                                </div>

                                <div className="post__body">

                                    <div className="post__user-info">
                                        <a href="#" className="user-info__name">{publication.user.name + " "}</a>
                                        <span className="user-info__divider"> | </span>
                                        <a href="#" className="user-info__create-date">{publication.created_at}</a>
                                    </div>

                                    <h4 className="post__content">{publication.text}</h4>

                                </div>

                            </div>


                            {auth._id == publication.user._id &&
                                <div className="post__buttons">

                                    <a href="#" className="post__button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </a>

                                </div>
                            }
                        </article>);
                })}
            </div>

            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver mas publicaciones
                    </button>
                </div>
            }
            <br />
        </section>
    )
}
