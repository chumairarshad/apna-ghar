import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem on Vercel Serverless environment
}

const router = express.Router();

// Free Unlimited Image Upload API Endpoint (CDN + Local Disk Storage Fallback)
router.post('/', async (req, res) => {
  console.log('UPLOAD REQUEST RECEIVED', {
    method: req.method,
    contentType: req.headers['content-type'],
    userAgent: req.headers['user-agent'],
    contentLength: req.headers['content-length']
  });

  try {
    const { image } = req.body;
    if (!image) {
      console.warn('UPLOAD REQUEST REJECTED: No image data provided.');
      return res.status(400).json({ success: false, message: 'No image data provided.' });
    }

    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
      return res.json({ success: true, url: image, message: 'Retained existing URL.' });
    }

    // 1. Strip base64 prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // 2. Try ImgBB CDN upload first
    const apiKey = process.env.IMGBB_API_KEY || 'f6d0ec208aa0c0c984cbc6ef2b5315c3'; 
    try {
      const formData = new URLSearchParams();
      formData.append('image', base64Data);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
      const data = await response.json();

      if (data && data.data && data.data.url) {
        console.log('📷 Uploaded photo to ImgBB CDN:', data.data.url);
        return res.json({
          success: true,
          url: data.data.url,
          thumb: data.data.thumb?.url || data.data.url,
          message: 'Image uploaded successfully to CDN.'
        });
      }
    } catch (cdnErr) {
      console.warn('ImgBB CDN upload notice:', cdnErr.message);
    }

    // 3. Reliable Local File Storage Fallback (stored in /uploads directory)
    let ext = 'jpg';
    const extMatch = image.match(/^data:image\/(\w+);base64,/);
    if (extMatch && ['png', 'jpeg', 'jpg', 'webp', 'gif'].includes(extMatch[1].toLowerCase())) {
      ext = extMatch[1].toLowerCase();
    }
    const filename = `img_${Date.now()}_${Math.floor(Math.random() * 100000)}.${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    const localUrl = `/uploads/${filename}`;
    console.log(`📷 Saved property photo locally: ${localUrl} (${buffer.length} bytes)`);

    return res.json({
      success: true,
      url: localUrl,
      message: 'Image stored successfully on server.'
    });

  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Error processing image upload.'
    });
  }
});

export default router;
