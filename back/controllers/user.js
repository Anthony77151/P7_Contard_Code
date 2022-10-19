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

// update un utilisateur
module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try {
        await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true},
            (err , docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).send({message: err})
            }
        )
    } catch(err) {
        return res.status(500).json({message: err})
    }
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

// follow un utilisateur
module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: {following: req.body.idToFollow}},
            { new: true, upsert: true},
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet: {followers: req.params.id}},
            { new: true, upsert: true},
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

// unfollow un utilisateur
module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    try {

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}