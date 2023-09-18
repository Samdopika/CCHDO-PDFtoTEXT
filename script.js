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
            finalText += content.items.map(item => item.str).join(' ') + '\n';
        }

        document.getElementById('outputText').value = finalText;
    };

    reader.readAsArrayBuffer(file);
}
