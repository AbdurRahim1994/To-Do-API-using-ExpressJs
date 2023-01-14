const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/assets/uploads')
    },
    filename: (req, file, cb) => {
        const uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname;
        cb(null, uniqueFileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true)
        }
        else {
            cb(null, false);
            throw new Error('Only png or jpg or jpeg format are applicable');
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 1
    }
}).array('photo');

module.exports = { upload };