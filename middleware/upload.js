import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Resolve the uploads directory to an absolute path
const uploadDir = path.resolve('uploads')

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true })
    console.log(`Uploads directory created at: ${uploadDir}`)
  } catch (err) {
    console.error(`Failed to create uploads directory: ${err.message}`)
  }
} else {
  console.log(`Uploads directory already exists at: ${uploadDir}`)
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir) // Use resolved absolute path
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`
    cb(null, uniqueName) // Generate unique file name
  },
})

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true) // Accept the file
  } else {
    cb(new Error('Not an image! Please upload an image.'), false) // Reject the file
  }
}

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: fileFilter,
})

export default upload
