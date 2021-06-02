const {Router} = require('express')
const path = require('path');
const multer = require('multer');
const File = require('../models/File')
const Upload = require('../models/Upload')

const router = Router()
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, './uploads');
        },
        filename(req, file, cb) {
            cb(null, `${new Date().getTime()}_${file.originalname}`);
        }
    }),
    limits: {
        fileSize: 1000000 // max file size 1MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
            return cb(
                new Error(
                    'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
                )
            );
        }
        cb(undefined, true); // continue with upload
    }
});

router.post(
    '/upload',
    upload.single('file'),
    async (req, res) => {
        try {
            const {title, description} = req.body;
            const {path, mimetype} = req.file;
            const file = new File({
                title,
                description,
                file_path: path,
                file_mimetype: mimetype
            });
            await file.save();
            res.send('file uploaded successfully.');
        } catch (error) {
            console.log(error)
            res.status(400).send('Error while uploading file. Try again later.');
        }
    },
    (error, req, res, next) => {
        if (error) {
            res.status(500).send(error.message);
        }
    }
);

router.get('/uploads/all', [], async (req, res) => {
    try {
        const files = await File.find()
        if (files.length < 0) {
            return res.status(200).json('empty')
        }
        res.status(200).json(files)
    } catch (e) {
        res.status(500).json('error on upload')
    }
})

router.get('/upload/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id)
        res.set({
            'Content-Type': file.file_mimetype
        })
        res.sendFile(path.join(__dirname, '..', file.file_path));
    } catch (e) {
        console.log(e)
        res.status(400).send('This file in space')
    }
})
module.exports = router