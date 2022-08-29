import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { UidContext } from './AppContext';
import Logout from './Log/Logout';

export const Navbar = () => {
    const uid = useContext(UidContext);
    const userData = useSelector((state) => state.userReducer);
    return (
        <nav>
            <div className='nav-container'>
                <div className='logo'>
                    <NavLink exact to="/">
                        <div className='logo'>
                            <img src='../img/Icon.ico' alt="icon"></img>
                            <h3>Groupomania</h3>
                        </div>
                    </NavLink>
                </div>
                {uid ? (
                    <ul>
                        <li></li>
                        <li className='welcome'>
                            <NavLink exact to="/profil">
                                <h4>Bienvenue {userData.pseudo}</h4>
                            </NavLink>
                        </li>
                        <Logout />
                    </ul>
                ) : (
                    <ul>
                        <li></li>
                        <li>
                            <NavLink exact to="/profil">
                                <img src='./img/icons/login.svg' alt="login"></img>
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    )
}

export default Navbar;