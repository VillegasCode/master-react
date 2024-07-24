import React, { useEffect, useState } from 'react';
import useAuth from '../../../src/hooks/useAuth';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ReactTimeAgo from "react-time-ago";
import avatar from '../../assets/img/user.png';


export const Inicio = () => {
    const { auth, loading } = useAuth();
    const [publications, setPublications] = useState([]);
    const [usuarioID, setUsuarioID] = useState([]);
    const [more, setMore] = useState(true);
    const [page, setPage] = useState();
    const params = useParams();

    const getIdUSER = auth._id;


    useEffect(() => {
        getPublications(1, true);
    }, []);

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    }

    //Método para obtener las publicaciones del usuario que inició sesión en la red que luego son llamados a través de los Hooks useEffect
    const getPublications = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(Global.url + "publication/user/" + getIdUSER + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            let newPublications = data.publications;

            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            } else if (newProfile) {
                newPublications = data.publications;
                setMore(true);
                setPage(1);
            }

            setPublications(newPublications);

            if (newPublications.length == 0){
                //Ocultamos el botón ver más si no hay publicaciones que mostrar
                setMore(false);
            }

            //Ocultamos el botón ver más si llegamos al final de las publicaciones que mostrar
            if (!newProfile && publications.length >= (data.total - data.publications.length)) {
                setMore(false);
            }

            if (data.pages <= 1) {
                //Ocultamos el botón ver más si no hay publicaciones que mostrar
                setMore(false);
            }

        }
        else {
            setMore(false);
        }
    }
    console.log("publications: " + JSON.stringify(publications));

    return (
        <>
            <h1><p>Ingresa a la sección Gente y empieza a seguir a personas</p></h1>
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
