import multer from "multer";
import path from "path";

/* =========================
    STORAGE CONFIG
========================= */
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "backend/uploads/");
    },

    filename: (req, file, cb) => {

        const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
        null,
        uniqueSuffix + path.extname(file.originalname)
        );
    },
});

/* =========================
    FILE FILTER
========================= */
const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

/* =========================
    MULTER INSTANCE
========================= */
const upload = multer({
    storage,
    fileFilter,

    limits: {
    fileSize: 2 * 1024 * 1024, // 10MB
    },
});

export default upload;