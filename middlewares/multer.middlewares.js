import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})
export const upload = multer({
    storage,
    // limits: {
    //     fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    // },
    // fileFilter: (req, file, cb) => {
    //     if (!file.mimetype.startsWith("image/")) {
    //         return cb(new Error("Only image files are allowed"));
    //     }
    //     cb(null, true);
    // },
})