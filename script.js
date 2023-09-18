async function handlePDFUpload() {
    const fileInput = document.getElementById('pdfInput');
    const file = fileInput.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('outputText').value = data.text;
        } else {
            alert('Error converting PDF.');
        }
    } catch (error) {
        console.error('Error uploading PDF:', error);
    }
}
