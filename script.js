document.getElementById('uploadBtn').addEventListener('click', handlePDFUpload);

async function handlePDFUpload() {
    const fileInput = document.getElementById('pdfInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a PDF file before uploading.');
        return;
    }

    convertPDFToText(file);
}

async function convertPDFToText(file) {
    const reader = new FileReader();

    reader.onload = async (event) => {
        const typedArray = new Uint8Array(event.target.result);
        const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
        let finalText = '';

        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);

            // Reassemble the text to consider new lines
            let lastY = content.items[0].transform[5]; // initial y position
            for (const item of content.items) {
                // Check if y position has changed significantly indicating new line
                if (Math.abs(item.transform[5] - lastY) > 5) {
                    finalText += '\n';
                    lastY = item.transform[5];
                }
                finalText += item.str + ' ';
            }
            finalText += '\n';
        }

        document.getElementById('outputText').value = finalText.trim();
    };

    reader.readAsArrayBuffer(file);
}
