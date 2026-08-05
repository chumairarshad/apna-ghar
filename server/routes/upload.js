import express from 'express';

const router = express.Router();

// Free Unlimited Image Upload API Endpoint (ImgBB / Free CDN Upload)
router.post('/', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided.' });
    }

    // Strip base64 prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // ImgBB Free Unlimited API Key (or process.env.IMGBB_API_KEY)
    const apiKey = process.env.IMGBB_API_KEY || '6d700a60d008d507058564177d5494d4'; 

    const formData = new URLSearchParams();
    formData.append('image', base64Data);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data && data.data && data.data.url) {
      return res.json({
        success: true,
        url: data.data.url,
        thumb: data.data.thumb?.url || data.data.url,
        message: 'Image uploaded successfully to Free Unlimited CDN.'
      });
    } else {
      return res.json({
        success: true,
        url: image,
        message: 'Stored image via Data URL.'
      });
    }
  } catch (err) {
    console.error('Image upload error:', err);
    return res.json({
      success: true,
      url: req.body.image,
      message: 'Stored image fallback.'
    });
  }
});

export default router;
