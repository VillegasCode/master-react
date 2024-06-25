import React, { useState, useEffect, createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authUser();
    }, []);

    const authUser = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            setLoading(false);
            return;
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id;

        try {
            const [profileResponse, countersResponse] = await Promise.all([
                fetch(Global.url + "user/profile/" + userId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                }),
                fetch(Global.url + "user/counters/" + userId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                })
            ]);

            const profileData = await profileResponse.json();
            const countersData = await countersResponse.json();

            setAuth(profileData.Profile);
            setCounters(countersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, counters, setCounters, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
