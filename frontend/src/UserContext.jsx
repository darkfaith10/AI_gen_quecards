
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Context = createContext();

export function UserProvider({ children }) {
    const [logged, setLogged] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        async function checkSession() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/check-session`, {
                    withCredentials: true,
                });

                if (res.data.loggedIn) {
                    setLogged(true);
                    setUserId(res.data.user._id);
                } else {
                    setLogged(false);
                    setUserId(null);
                }
            }
            catch (err) {
                console.log("Error checking session", err);
            }
        }
        checkSession();

    }, []);

    return (
         <Context.Provider value={{ logged, setLogged, userId, setUserId }}>
            {children}
        </Context.Provider>
    );

}

// export default UserProvider;
