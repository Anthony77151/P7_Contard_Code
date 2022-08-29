import React from 'react';
import axios from 'axios';
import cookie from 'js-cookie';

const Logout = () => {
    // permet d'assurer que le cookie est bien retirer (sécurité en plus de la fonction présente dans le back)
    const removeCookie = (key) => {
        if (window !== "undefined") {
            cookie.remove(key, {expires: 1});
        }
    };

    const logout = async () => {
        await axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true,
        })
            .then((res) => removeCookie('jwt'))
            .catch((err) => console.log(err));
        // une fois déconnecter nous renvoi sur la page d'acceuil
        window.location = "/";
    }

    return (
        <li onClick={logout}>
            <img src='./img/icons/logout.svg' alt="logout"></img>
        </li>
    );
};

export default Logout;