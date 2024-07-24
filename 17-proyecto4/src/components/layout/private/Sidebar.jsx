import React from 'react';
import avatar from '../../../assets/img/user.png';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { useParams, Link } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { useState, useEffect } from 'react';

export const Sidebar = () => {

    const { auth, counters } = useAuth();
    const [counters2, setCounters] = useState({});
    const { form, changed } = useForm({});
    const [activarButton, setActivarButton] = useState(true);
    const [estiloButton, setEstiloButton] = useState("button-disabled");
    const [stored, setStored] = useState("");
    const params = useParams();

    //Modificamos el estado y estilo del botón enviar solo cuando el input que está guarado en form.text cambie
    useEffect(() => {
        let longitudPost = form.text;
        //Verificamos que el valor de longitudPost sea diferente a undefined o null
        if (longitudPost !== undefined && longitudPost !== null) {
            //Creamos cadenatext para almacenar el valor de longitudpost después de limpiar espacios adelante y al final
            let cadenatext = longitudPost.trim();
            //Comprobamos que el valor que tiene cadenatext sea un texto válido y no un texto vacío
            if (cadenatext.trim() !== "") {
                setActivarButton(false);
                setEstiloButton("button-enabled");
            } else {
                setActivarButton(true);
                setEstiloButton("button-disabled");
            }
        }
    }, [form.text]);

    //Este código es para realizar ciertas cosas cada vez que cambie la propiedad onChange de algún input
    // const handleInputChange = (event) => {
    //     const valor = event.target.value;
    //     //Verificar si el valor es válido
    //     if (valor.trim() !== "") {
    //         setActivarButton(false);
    //         setEstiloButton("submit");
    //     } else {
    //         setActivarButton(true);
    //         //setEstiloButton("submit-disabled");
    //     }
    // }

    //Hook useEffect que ejecuta el método getCounters cada vez que hay un cambio en params
    useEffect(() => {
        getCounters();
    }, [params]);

    //Petición AJAX
    //Método para obtener los datos de los contadores del backend que luego son llamados a través de los Hooks useEffect
    const getCounters = async () => {
        //Recibe información de los contadores haciendo una consulta al API
        const request = await fetch(Global.url + "user/counters/" + auth._id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();
        setCounters(data);

    }

    const savePublication = async (e) => {
        e.preventDefault();

        //Recoger los datos del formulario
        let newPublication = form;
        newPublication.user = auth._id;
        const token = localStorage.getItem("token");

        //Hacer request para guardar la BD
        const request = await fetch(Global.url + "publication/save", {
            method: "POST",
            body: JSON.stringify(newPublication),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            }
        });

        const data = await request.json();
        console.log(data);
        //Mostrar mensajes de éxito o error
        if (data.status = "success") {
            setStored("stored");
            setActivarButton(true);
            setEstiloButton("button-disabled");
        } else {
            setStored("error");
        }

        //Subir imagen
        const fileInput = document.querySelector("#file");

        if (data.status == "success" && fileInput.files[0]) {
            const formData = new FormData();
            formData.append("file0", fileInput.files[0]);

            const uploadRequest = await fetch(Global.url + "publication/upload/" + data.publicationStored._id, {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": token
                }
            });

            const uploadData = await uploadRequest.json();

            if (uploadData.status == "success") {
                setStored("stored");
            } else {
                setStored("error");
            }
        }
        //LIMPIAR FORMULARIO RESETEARLO
        //if (data.status == "success" && uploadData.status == "success") {
        const myForm = document.querySelector("#publication-form");
        myForm.reset();
        //Después que se ha publicado Limpiamos el hook stored después de 2 segundos
        setTimeout(() => {
            setStored("");
        }, 2000);
        //}
    }

    return (
        <aside className="layout__aside">

            <header className="aside__header">
                <h1 className="aside__title">Hola, {auth.name}</h1>
            </header>

            <div className="aside__container">

                <div className="aside__profile-info">

                    <div className="profile-info__general-info">
                        <div className="general-info__container-avatar">
                            {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="container-avatar__img" alt="Foto de perfil" />}
                            {auth.image == "default.png" && <img src={avatar} className='container-avatar__img' alt="Foto de perfil" />}
                        </div>

                        <div className="general-info__container-names">
                            <Link to={"/social/perfil/" + auth._id} className="container-names__name">{auth.name}</Link>
                            <p className="container-names__nickname">{auth.nick}</p>
                        </div>
                    </div>

                    <div className="profile-info__stats">

                        <div className="stats__following">
                            <Link to={"/social/siguiendo/" + auth._id} className="following__link">
                                <span className="following__title">Siguiendo</span>
                                <span className="following__number">{counters2.following}</span>
                            </Link>
                        </div>
                        <div className="stats__following">
                            <Link to={"/social/seguidores/" + auth._id} className="following__link">
                                <span className="following__title">Seguidores</span>
                                <span className="following__number">{counters2.followed}</span>
                            </Link>
                        </div>


                        <div className="stats__following">
                            <Link to={"/social/perfil/" + auth._id} className="following__link">
                                <span className="following__title">Publicaciones</span>
                                <span className="following__number">{counters2.publications}</span>
                            </Link>
                        </div>


                    </div>
                </div>


                <div className="aside__container-form">
                    {stored == "stored" ?
                        <strong className='alert alert-success'>Publicada correctamente!"</strong>
                        : ''}


                    {stored == "error" ?
                        <strong className='alert alert-danger'>"Error, no se ha publicado nada"</strong> : ''}
                    <form id="publication-form" className="container-form__form-post" onSubmit={savePublication}>

                        <div className="form-post__inputs">
                            <label htmlFor="text" className="form-post__label">¿Que estás pesando hoy? (obligatorio)</label>
                            <textarea name="text" className="form-post__textarea" onChange={changed} />
                        </div>

                        <div className="form-post__inputs">
                            <label htmlFor="file" className="form-post__label">Sube tu foto (opcional)</label>
                            <input text="Examinar" type="file" name="file0" id="file" className="form-post__image" />
                        </div>

                        <input id={estiloButton} type="submit" value="Enviar" className="form-post__btn-submit" disabled={activarButton} />

                    </form>

                </div>

            </div>

        </aside>
    )
}