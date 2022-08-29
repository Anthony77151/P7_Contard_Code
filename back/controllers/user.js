const UserModel = require('../models/User');
const ObjectID = require('mongoose').Types.ObjectId;

// Récupère tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

// Informations d'un utilisateur
module.exports.userInfo = (req, res) => {
    // Vérifie que l'id est valide
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
// Recherche l'utilisateur par son id (docs = data/response)
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID unknown : ' + err);
    }).select('-password');
}

// Supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: 'Successfully deleted.' });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}