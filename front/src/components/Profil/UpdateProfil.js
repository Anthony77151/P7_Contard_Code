import React from 'react'
import { useSelector } from 'react-redux'
import { dateParser } from '../Utils';

const UpdateProfil = () => {
    const userData = useSelector((state) => state.userReducer);


    return (
        <div className="profil-container">
            <h1>Profil de {userData.pseudo}</h1>
            <div className='update-container'>
                <div className='left-part'>
                    <h3>Photo de profil</h3>
                    <img src="./img/profil-picture.webp" alt="profil"/>
                    <form action="" className='upload-pic'>
                        <label htmlFor="file">Changer d'image</label>
                        <input type="file" id="file" name="file" accept=".jpg, .jpeg, .png"/>
                        <br/>
                        <input type="submit" value="Envoyer"/>
                    </form>
                </div>
                <div className='right-part'>
                    <div className='bio-update'>
                        <h3>Bio</h3>
                        <p>Voici ma bio !</p>
                        <button>Modifier</button>
                    </div>
                    {/* récupère la date de création de l'utilisateur */}
                    <h4>Membre depuis le : {dateParser(userData.createdAt)}</h4>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfil