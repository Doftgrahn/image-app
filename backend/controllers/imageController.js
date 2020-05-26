const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const ImageMetadata = require('../models/ImageMetadataModel');
const IMG_DIRECTORY_PATH = 'public/img';
const { validateImgName } = require('../utils/validation');

const multerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, IMG_DIRECTORY_PATH);
    },

    filename: (_req, file, cb) => {
        const extension = file.mimetype.split('/')[1];
        const fullFileName = validateImgName(file.originalname, extension);
        cb(null, fullFileName);
    },
});

const fileFilter = (_req, file, cb) => {
    const { mimetype } = file;
    if (mimetype === 'image/png' || mimetype === 'image/jpeg') {
        return cb(null, true);
    }
    cb(null, false);
};

const upload = multer({
    fileFilter: fileFilter,
    storage: multerStorage,
});

exports.getAllImages = async (_req, res, _next) => {
    const data = await ImageMetadata.find();

    return res.status(200).json({
        status: 'success',
        data: data,
    });
};

exports.uploadImage = upload.single('photo');

exports.createImageMetadata = async (req, res, _next) => {
    // return error if filetype validation fails
    if (!req.file) {
        return res.status(422).json({
            status: 'fail',
            message: 'invalid filetype.',
        });
    }

    sharp(req.file.path)
        .resize(400, 400)
        .toBuffer((_err, buffer) => {
            fs.writeFile(req.file.path, buffer, (error, sharp) => {});
        });

    const doc = await ImageMetadata.create({
        name: req.file.originalname,
        path: `/img/${req.file.filename}`,
    });

    // return error if document could not be saved on database
    if (!doc) {
        return res.status(400).json({
            status: 'fail',
            message: 'invalid input',
        });
    }

    return res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
};
