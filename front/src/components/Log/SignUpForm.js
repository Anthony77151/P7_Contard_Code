import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from './SignInForm';

const SignUpForm = () => {
    const [formSubmit, setFromSubmit] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        // On déclare toute les variables pour les div errors
        const pseudoError = document.querySelector('.pseudo.error');
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-confirm.error');

        // on réinjecte une string vide pour enlever l'erreur
        passwordConfirmError.innerHTML = '';

        // si les mdp ne correspondent pas
        if (password !== controlPassword) {
            passwordConfirmError.innerHTML = "Les mots de passe ne correspondent pas";
        } else {
            await axios({
                // envoi à notre api une methode post contenant pseudo, email et password
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                data: {
                    pseudo,
                    email,
                    password
                }
            })
                .then((res) => {
                    if (res.data.errors) {
                        pseudoError.innerHTML = res.data.errors.pseudo;
                        emailError.innerHTML = res.data.errors.email;
                        passwordError.innerHTML = res.data.errors.password;
                    } else {
                        setFromSubmit(true);
                    }
                })
                .catch((err) => console.log(err));
        }
    }


    return (
        <>
        {/* Lorsque l'utilisateur s'inscrit, le renvoi sur le formulaire de connection */}
            {formSubmit ? (
                <>
                    <SignInForm />
                    <span></span>
                    <h4 className='success'>Enregistrement réussi, merci de vous connecter</h4>
                </>
            ) : (
                <form action='' onSubmit={handleRegister} id='sign-up-form'>
                    <label htmlFor='pseudo'>Pseudo</label>
                    <br />
                    <input type="text" name="pseudo" id="pseudo" onChange={(e) => setPseudo(e.target.value)} value={pseudo} />
                    <div className='pseudo error'></div>
                    <br />
                    <label htmlFor='email'>Email</label>
                    <br />
                    <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                    <div className='email error'></div>
                    <br />
                    <label htmlFor='password'>Mot de passe</label>
                    <br />
                    <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    <div className='password error'></div>
                    <br />
                    <label htmlFor='password-conf'>Confirmer le mot de passe</label>
                    <br />
                    <input type="password" name="password" id="password-conf" onChange={(e) => setControlPassword(e.target.value)} value={controlPassword} />
                    <div className='password-confirm error'></div>
                    <br />
                    <input type="submit" value="Valider inscription" />
                </form>
            )}
        </>
    );
};

export default SignUpForm;