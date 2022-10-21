const UserModel = require('../models/User');
const { uploadErrors } = require('../utils/errors');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadProfil = async (req, res) => {
    try {
        // vérification du format de l'image
        if (
            req.file.detectedMimeType != 'image/jpg' &&
            req.file.detectedMimeType != 'image/jpeg' &&
            req.file.detectedMimeType != 'image/png' &&
            req.file.detectedMimeType != 'image/webp'
        )
            throw Error('invalid file');
        if (req.file.size > 500000)
            throw Error('max size');
    } catch (error) {
        const errors = uploadErrors(error);
        return res.status(201).json({ errors });
    }

    const fileName = req.body.name + ".webp";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../../front/public/images/profil/${fileName}`
        ),
    );

    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: "./images/profil/" + file } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}