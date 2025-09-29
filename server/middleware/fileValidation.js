import fs from 'fs';
import path from 'path';

// Safe path resolution to prevent path traversal
const resolveSafePath = (basePath, userPath) => {
  const resolved = path.resolve(basePath, userPath);
  const normalized = path.normalize(resolved);
  
  // Ensure the resolved path is within the base directory
  if (!normalized.startsWith(path.resolve(basePath))) {
    throw new Error('Path traversal attempt detected');
  }
  
  return normalized;
};

// Advanced file validation middleware
export const validateUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Validate and sanitize file path
    const uploadsDir = path.resolve('./uploads');
    const safePath = resolveSafePath(uploadsDir, path.basename(req.file.path));
    
    // Check if file exists
    if (!fs.existsSync(safePath)) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    // Get file stats
    const stats = fs.statSync(safePath);
    const filePath = safePath;
    
    // Validate file size (double-check)
    if (stats.size > 5 * 1024 * 1024) {
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({ error: 'File too large. Maximum 5MB allowed.' });
    }

    // Validate file is not empty
    if (stats.size === 0) {
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({ error: 'Empty file not allowed' });
    }

    // Read first few bytes to validate PDF signature
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    // Check PDF magic number (%PDF)
    const pdfSignature = buffer.toString('ascii', 0, 4);
    if (pdfSignature !== '%PDF') {
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({ error: 'Invalid PDF file format' });
    }

    // Sanitize filename for storage
    req.file.sanitizedName = path.basename(req.file.originalname)
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 100);

    next();
  } catch (error) {
    // Clean up file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.status(500).json({ error: 'File validation failed' });
  }
};

// Clean up old uploaded files (run periodically)
export const cleanupOldFiles = () => {
  const uploadsDir = path.resolve('./uploads');
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  try {
    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();

    files.forEach(file => {
      // Sanitize filename and create safe path
      const sanitizedFile = path.basename(file);
      const safePath = resolveSafePath(uploadsDir, sanitizedFile);
      const stats = fs.statSync(safePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(safePath);
        console.log(`Cleaned up old file: ${sanitizedFile}`);
      }
    });
  } catch (error) {
    console.error('File cleanup error:', error);
  }
};