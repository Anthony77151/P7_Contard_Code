import React, { useContext } from "react";
import Log from '../components/Log';
import { UidContext } from "../components/AppContext";
import UpdateProfil from "../components/Profil/UpdateProfil";

const Profil = () => {
    const uid = useContext(UidContext);


    return (
        <div className="profil-page">
            {/* Si l'utilisateur est déjà connecter = page update */}
            {uid ? (
                <UpdateProfil/>
            ) : (
                // sinon page d'inscription/connexion
                <div className="log-container">
                <Log signin={false} signup={true} />
            </div>
            )}
        </div>
    )
}


export default Profil;