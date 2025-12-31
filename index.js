const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const fontsDir = path.join(__dirname, 'fonts');

if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

// GET /fonts?page=1
app.get('/fonts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    
    try {
        const files = fs.readdirSync(fontsDir).filter(f => /\.(ttf|otf)$/i.test(f));
        const total = files.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        
        const fonts = files.slice(start, end).map((filename, index) => ({
            number: start + index + 1,
            name: path.parse(filename).name
        }));

        res.json({ page, fonts, total });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read fonts' });
    }
});

// GET /fonts/:number?text=Hello World
app.get('/fonts/:number', (req, res) => {
    const number = parseInt(req.params.number);
    const text = req.query.text || 'Hello World';

    try {
        const files = fs.readdirSync(fontsDir).filter(f => /\.(ttf|otf)$/i.test(f));
        const filename = files[number - 1];

        if (!filename) {
            return res.status(404).json({ error: 'Font not found' });
        }

        const fontPath = path.join(fontsDir, filename);
        const fontName = path.parse(filename).name;
        
        registerFont(fontPath, { family: fontName });

        const canvas = createCanvas(800, 200);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 800, 200);

        ctx.fillStyle = 'black';
        ctx.font = `50px "${fontName}"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 400, 100);

        res.set('Content-Type', 'image/png');
        res.send(canvas.toBuffer('image/png'));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
