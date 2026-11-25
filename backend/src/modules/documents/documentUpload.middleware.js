import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Private secure storage directory (outside /uploads static mount - NO public URLs exposed)
export const PRIVATE_DOCS_DIR = path.resolve(__dirname, '../../../private_uploads/documents');

if (!fs.existsSync(PRIVATE_DOCS_DIR)) {
  fs.mkdirSync(PRIVATE_DOCS_DIR, { recursive: true });
}

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024; // 5 MB strict limit

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PRIVATE_DOCS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomId = crypto.randomBytes(16).toString('hex');
    cb(null, `doc-${Date.now()}-${randomId}${ext}`);
  },
});

export const secureDocumentUpload = multer({
  storage,
  limits: {
    fileSize: MAX_DOCUMENT_BYTES,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const mime = String(file.mimetype || '').toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`Invalid file extension "${ext}". Allowed formats: PDF, JPG, JPEG, PNG.`));
    }
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      return cb(new Error(`Invalid MIME type "${mime}". Allowed types: application/pdf, image/jpeg, image/png.`));
    }
    cb(null, true);
  },
});
