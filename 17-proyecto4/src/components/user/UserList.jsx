import React from 'react';
import avatar from '../../assets/img/user.png';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ReactTimeAgo from "react-time-ago";

export const UserList = ({
    users = [],
    getUsers,
    following = [],
    setFollowing,
    page,
    setPage,
    more,
    loading
}) => {
    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
    }
    
    const follow = async (userId) => {
        //Petición al backend para guardar el follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            setFollowing([...following, userId]);
        }
    }

    const unfollow = async (userId) => {
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            const updatedFollowing = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(updatedFollowing);
        }
    }

    return (
        <>
            <div className="content__posts">
                {users.map(user => {
                    // Imprimir el objeto user para verificar su estructura
                    console.log("Los USERSlist deben estar con sus nombres: " + JSON.stringify(users));
                    
                    // Usar la propiedad correcta que contiene el ID del usuario
                    console.log("USERid: " + user._id);
                    // Verificar que created_at sea válido antes de parsear
                    const createdAtTimestamp = user.created_at ? Date.parse(user.created_at) : null;
                    
                    console.log("NAME: " + user.name);
                    console.log("SURNAME: " + user.surname);
                    console.log("IMAGEN: " + user.image);

                    return (
                        <article className="posts__post" key={user._id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={"/social/perfil/" + user._id} className="post__image-link">
                                        {user.image !== "default.png" ? (
                                            <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />
                                        ) : (
                                            <img src={avatar} className='post__user-image' alt="Foto de perfil" />
                                        )}
                                    </Link>
                                </div>
                                <div className="post__body">
                                    <div className="post__user-info">
                                        <Link to={"/social/perfil/" + (user._id)} className="user-info__name">
                                            {user.name} {user.surname}
                                        </Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={"/social/perfil/" + (user._id)} className="user-info__create-date">
                                            {createdAtTimestamp && <ReactTimeAgo date={createdAtTimestamp} locale="es-ES" />}
                                        </Link>
                                    </div>
                                    <h4 className="post__content">{user.bio}</h4>
                                </div>
                            </div>

                            {(user._id) !== auth._id && (
                                <div className="post__buttons">
                                    {!following.includes(user._id) ? (
                                        <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                                            Seguir
                                        </button>
                                    ) : (
                                        <button className="post__button" onClick={() => unfollow(user._id)}>
                                            Dejar de seguir
                                        </button>
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>

            {loading && <h1>Cargando...</h1>}

            {more && (
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver más personas
                    </button>
                </div>
            )}
        </>
    );
}
