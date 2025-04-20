// multer.js
import multer from "multer";

export const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'), false);
    }
    return cb(null, true);
  };

  const storage = multer.memoryStorage();

  return multer({ storage, fileFilter });
};
