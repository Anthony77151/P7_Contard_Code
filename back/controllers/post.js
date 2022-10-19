const PostModel = require('../models/Post');
const UserModel = require('../models/User');
const ObjectID = require('mongoose').Types.ObjectId;
const { uploadErrors } = require('../utils/errors');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require("stream").pipeline);

// Affiché un post
module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data : " + err);
    }).sort({ createdAt: -1 });
};

// Créer un post
module.exports.createPost = async (req, res) => {
    let fileName;

    if (req.file !== null) {
        try {
            // vérification du format de l'image
            if (
                req.file.detectedMimeType != 'image/jpg' &&
                req.file.detectedMimeType != 'image/jpeg' &&
                req.file.detectedMimeType != 'image/png' &&
                req.file.detectedMimeType != 'image/webp'
            )
                throw Error('invalid file');
            // vérification de la taille de l'image
            if (req.file.size > 500000)
                throw Error('max size');
        } catch (error) {
            const errors = uploadErrors(error);
            return res.status(201).json({ errors });
        }
        // créer le nom de la photo et la transforme en .jpg
        fileName = req.body.posterId + Date.now() + '.webp';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../../front/public/images/${fileName}`
            ),
        );
    }

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./images/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: []
    });
    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};

// Mettre à jour un post
module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    const updatedRecord = {
        message: req.body.message,
    };

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error : " + err);
        }
    );
};

// Supprimer un post
module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    PostModel.findByIdAndDelete(req.params.id)
        .then(deleteImage)
        .then(() => res.status(200).json({message: 'Produit supprimé !'}))
        .catch(error => res.status(404).json({error}))
}

// supprime l'image du produit
function deleteImage(post) {
    const filename = post.picture.split("/images")[1];
    fs.unlink(`../front/public/images/${filename}`, (error) => {
        if(error) {
            console.log(error);
        }
    });
    return post
}

// like un post
module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id },
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err);
            }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id },
            },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(200).send(err);
    }
};

// retire le like d'un post
module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id },
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(200).send(err);
            }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id },
            },
            { new: true },
            (err, docs) => {
                if (!err) res.send(docs);
                else return res.status(200).send(err);
            }
        )
    } catch (err) {
        return res.status(200).send(err);
    }
};

// Ajouter un commentaire à un post
module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};

// editer un commentaire
module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find((comment) =>
                comment._id.equals(req.body.commentId)
            );

            if (!theComment) return res.status(404).send("Comment not found");
            theComment.text = req.body.text;

            return docs.save((err) => {
                if (!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            });
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};

// supprimer un commentaire d'un post
module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }));
    } catch (err) {
        return res.status(400).send(err);
    }
};