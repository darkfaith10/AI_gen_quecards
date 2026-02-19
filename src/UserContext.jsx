
import React, {createContext, useEffect, useState} from "react";
import axios from "axios";

function UserProvider({children}) {
    const [logged, setLogged] = useState(false);
    const [userId, setUserId] = useState(null);

}

export default UserProvider;
