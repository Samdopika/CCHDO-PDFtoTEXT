const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const extractedText = await extractTextFromPDF(req.file.buffer);

        res.json({
            success: true,
            text: extractedText
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            success: false,
            message: 'Failed to convert PDF'
        });
    }
});

async function extractTextFromPDF(pdfBuffer) {
    const data = await pdf(pdfBuffer);
    return data.text;
}

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
