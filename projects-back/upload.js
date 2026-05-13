const multer = require('multer');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Create a descriptive name: [field]-[original-name-slugified]-[timestamp].[ext]
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        const slugifiedName = slugify(originalName, { lower: true, strict: true });
        
        const descriptiveName = `${file.fieldname}-${slugifiedName}-${Date.now()}${extension}`;
        cb(null, descriptiveName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
}).fields([
    { name: 'cardImage', maxCount: 1 },
    { name: 'word_az', maxCount: 1 },
    { name: 'word_en', maxCount: 1 },
    { name: 'ppt_az', maxCount: 1 },
    { name: 'ppt_en', maxCount: 1 }
]);

module.exports = upload;
