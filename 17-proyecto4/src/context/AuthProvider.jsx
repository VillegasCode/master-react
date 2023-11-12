import React, { Profiler } from 'react';
import { useState, useEffect, createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    //Estado de prueba
    //const [compartido, setCompartido] = useState("Compartida en todos los componentes");

    //Objeto que guarda el estado de autenticación del usuario
    const [auth, setAuth] = useState({});

    //Objeto que guarda el estado de los contadores
    const [counters, setCounters] = useState({});


    //Objeto para mostrar una pantalla de CARGANDO
    const [loading, setLoading] = useState(true);

    //Hook useEffect para ejecutar el método authUser cada vez que se carga la página
    useEffect(() => {
        authUser();
    }, []);

    //Método asíncrono para ejecutar varias peticiones ajax de autenticación
    const authUser = async () => {
        //Sacar datos de usuario identificado del localstorage
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        //Comprobar si tengo el token y el user
        if (!token || !user) {
            return false;
        }

        //Transformar los datos a un objeto de javascript
        const userObj = JSON.parse(user);
        const userId = userObj.id;

        //Petición ajax al backend que compruebe el token y
        //que me devuelva todos los datos del usuario
        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();
        //console.log(data.Profile.name);

        //Petición para los contadores follows, following, etc del usuario
        const requestCounters = await fetch(Global.url + "user/counters/" + userId, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": token
            }
        });

        const dataCounters = await requestCounters.json();

        //Setear el estado de auth, counters, loading
        setAuth(data.Profile);
        setCounters(dataCounters);
        setLoading(false);
    }

    return (<AuthContext.Provider
        value={{
            auth,
            setAuth,
            counters,
            loading
        }}
    >
        {children}
    </AuthContext.Provider>
    )
}

export default AuthContext;