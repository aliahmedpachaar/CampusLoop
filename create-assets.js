const fs = require('fs');
const path = require('path');

// Minimal valid PNG data (1x1 white pixel)
// We'll create larger ones using sharp
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');

// Teal color #0D9488
const teal = { r: 13, g: 148, b: 136 };
const white = { r: 255, g: 255, b: 255 };

async function createAssets() {
    // Icon 1024x1024 - white background with teal circle and C
    await sharp({
        create: {
            width: 1024,
            height: 1024,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    })
    .composite([{
        input: Buffer.from(`<svg width="1024" height="1024">
            <circle cx="512" cy="512" r="420" fill="#0D9488"/>
            <text x="512" y="620" font-size="500" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">C</text>
        </svg>`),
        top: 0,
        left: 0
    }])
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
    console.log('Created icon.png');

    // Adaptive icon
    await sharp({
        create: {
            width: 1024,
            height: 1024,
            channels: 4,
            background: { r: 13, g: 148, b: 136, alpha: 1 }
        }
    })
    .composite([{
        input: Buffer.from(`<svg width="1024" height="1024">
            <text x="512" y="620" font-size="500" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">C</text>
        </svg>`),
        top: 0,
        left: 0
    }])
    .png()
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log('Created adaptive-icon.png');

    // Favicon 48x48
    await sharp({
        create: {
            width: 48,
            height: 48,
            channels: 4,
            background: { r: 13, g: 148, b: 136, alpha: 1 }
        }
    })
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
    console.log('Created favicon.png');

    // Splash 1284x2778
    await sharp({
        create: {
            width: 1284,
            height: 2778,
            channels: 4,
            background: { r: 13, g: 148, b: 136, alpha: 1 }
        }
    })
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
    console.log('Created splash.png');

    console.log('All assets created!');
}

createAssets().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
