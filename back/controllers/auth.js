const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors');

// validité du token
const options = { expiresIn: '24h' };
// créer un token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, options);
};


// enregistre un utilisateur
module.exports.signUp = async (req, res) => {
    const { pseudo, email, password } = req.body;
    let isAdmin = false;
    try {
        if (req.body.email === "modo@gmail.com") {
            isAdmin = true;
        }
        const user = await UserModel.create({ pseudo, email, password, isAdmin })
        res.status(201).json({ user: user._id })
    }
    catch (error) {
        const errors = signUpErrors(error);
        res.status(200).send({ errors });
    }
}

// connecter un utilisateur
module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id, user.isAdmin);
        // place le token dans un cookie
        res.cookie('jwt', token, { httpOnly: true, options });
        res.status(200).json({
            user: user._id,
            isAdmin: user.isAdmin
        });
    }
    catch (error) {
        const errors = signInErrors(error);
        res.status(200).json({ errors });
    }
};

// déconnecter un utilisateur
module.exports.logout = (req, res) => {
    // supprime le cookie (token)
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};