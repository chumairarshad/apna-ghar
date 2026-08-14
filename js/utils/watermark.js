/**
 * Image Watermark Utility for Sarmayadar Portal
 * Automatically applies a diagonal repeating watermark ("SARMAYADAR.COM")
 * and a prominent brand badge on the bottom-right corner using HTML5 Canvas.
 */

export function addWatermarkToImage(imageSrc, options = {}) {
  return new Promise((resolve) => {
    console.log('IMAGE PROCESSING START', {
      prefix: typeof imageSrc === 'string' ? imageSrc.substring(0, 40) : typeof imageSrc,
      length: imageSrc?.length,
      fileName: options.fileName,
      fileType: options.fileType
    });

    if (!imageSrc) {
      console.warn('addWatermarkToImage: empty imageSrc provided.');
      resolve(imageSrc);
      return;
    }

    const img = new Image();
    // Enable CORS for external image URLs if possible (skip for data URLs)
    if (typeof imageSrc === 'string' && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'))) {
      img.crossOrigin = 'Anonymous';
    }

    console.log('before image load...');
    img.onload = () => {
      console.log('image loaded successfully', { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MAX_DIMENSION = 1600;
        let width = img.naturalWidth || img.width || 1200;
        let height = img.naturalHeight || img.height || 800;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        console.log('canvas dimensions configured:', canvas.width, canvas.height);

        // 1. Draw original image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Draw Repeating Center Diagonal Watermark
        const watermarkText = options.text || 'SARMAYADAR.COM';
        ctx.save();
        ctx.rotate((-22 * Math.PI) / 180);
        ctx.font = `800 ${Math.max(24, Math.round(width / 22))}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const stepX = Math.round(width / 2.5);
        const stepY = Math.round(height / 2.5);

        for (let y = -height * 1.5; y < height * 2.5; y += stepY) {
          for (let x = -width * 1.5; x < width * 2.5; x += stepX) {
            ctx.fillText(watermarkText, x, y);
          }
        }
        ctx.restore();

        // 3. Draw Bottom-Right Brand Badge Overlay
        const badgePaddingX = Math.max(12, Math.round(width * 0.015));
        const badgePaddingY = Math.max(8, Math.round(height * 0.012));
        const fontSize = Math.max(13, Math.round(width / 48));
        ctx.font = `700 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;

        const badgeText = options.badgeText || 'SARMAYADAR | Verified Listing';
        const textMetrics = ctx.measureText(badgeText);
        const badgeWidth = textMetrics.width + badgePaddingX * 2.5;
        const badgeHeight = fontSize + badgePaddingY * 2.2;

        const margin = Math.max(14, Math.round(width * 0.02));
        const badgeX = width - badgeWidth - margin;
        const badgeY = height - badgeHeight - margin;
        const radius = Math.min(8, badgeHeight / 2);

        // Badge Background (Dark Forest Green)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(badgeX + radius, badgeY);
        ctx.lineTo(badgeX + badgeWidth - radius, badgeY);
        ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + radius);
        ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - radius);
        ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX + badgeWidth - radius, badgeY + badgeHeight);
        ctx.lineTo(badgeX + radius, badgeY + badgeHeight);
        ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - radius);
        ctx.lineTo(badgeX, badgeY + radius);
        ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
        ctx.closePath();

        ctx.fillStyle = 'rgba(19, 29, 12, 0.88)';
        ctx.fill();

        // Badge Gold Border
        ctx.lineWidth = Math.max(1.5, Math.round(width / 600));
        ctx.strokeStyle = 'rgba(242, 167, 27, 0.9)';
        ctx.stroke();

        // Badge Text (Gold & White)
        ctx.fillStyle = '#faf1de';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 3;
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeText, badgeX + badgePaddingX * 1.25, badgeY + badgeHeight / 2 + 1);

        ctx.restore();

        // Export watermarked canvas as base64 JPEG
        console.log('before canvas.toDataURL...');
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        console.log('canvas.toDataURL generated length:', dataUrl?.length);
        resolve(dataUrl);
      } catch (err) {
        console.warn('Watermark creation error fallback to original image:', err);
        resolve(imageSrc);
      }
    };

    img.onerror = (err) => {
      console.error('IMAGE LOAD FAILED (img.onerror fired):', err, 'imageSrc prefix:', typeof imageSrc === 'string' ? imageSrc.substring(0, 60) : imageSrc);
      // Return original image if CORS or loading fails
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
