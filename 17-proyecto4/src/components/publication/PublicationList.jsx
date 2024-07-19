import React from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png';
import ReactTimeAgo from "react-time-ago";

export const PublicationList = ({
    publications,
    getPublications,
    page,
    setPage,
    more,
    setMore
}) => {
    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    }

    const deletePublication = async (publicationId) => {
        try {
            const request = await fetch(Global.url + "publication/remove/" + publicationId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            });

            if (!request.ok) {
                throw new Error("Error deleting publication");
            }

            const data = await request.json();
            setPage(1);
            setMore(true);
            getPublications(1, true);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    console.log("publications: " + JSON.stringify(publications));
    return (
        <>
            <div className="content__posts">
                {publications.map(publication => {
                    // Convertir created_at a timestamp
                    const createdAtTimestamp = new Date(publication.created_at).getTime();

                    return (
                        <article className="posts__post" key={publication._id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={"/social/perfil/" + publication.user._id} className="post__image-link">
                                        {publication.user.image !== "default.png" ? (
                                            <img src={Global.url + "user/avatar/" + publication.user.image} className="post__user-image" alt="Foto de perfil" />
                                        ) : (
                                            <img src={avatar} className='post__user-image' alt="Foto de perfil" />
                                        )}
                                    </Link>
                                </div>
                                <div className="post__body">
                                    <div className="post__user-info">
                                         <Link to={"/social/perfil/" + publication.user._id} className="user-info__name">{publication.user.name + " "}
                                        <span className="user-info__divider"> | </span>
                                        </Link>
                                         <Link to={"/social/perfil/" + publication.user._id} className="user-info__create-date">
                                            <ReactTimeAgo date={createdAtTimestamp} locale="es-ES" />
                                        </Link>
                                    </div>
                                    <h4 className="post__content">{publication.text}</h4>
                                    {publication.file && <img src={Global.url + "publication/media/" + publication.file} alt="Contenido multimedia" />}
                                </div>
                            </div>
                            {auth._id === publication.user._id && (
                                <div className="post__buttons">
                                    <button onClick={() => deletePublication(publication._id)} className="post__button">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
            {more && (
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver más publicaciones
                    </button>
                </div>
            )}
        </>
    );
}