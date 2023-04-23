const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const asciiOutput = document.getElementById('ascii-output');
const ctx = canvas.getContext('2d');

// Called when the image is loaded.
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    const img = new Image();
    img.onload = function() {
        //  Adjust the canvas size and draw the picture.
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // Convert to ASCII.
        const ascii = imageToAscii(img, ctx);
        asciiOutput.textContent = ascii;
    };
    img.src = URL.createObjectURL(file);
});

function imageToAscii(img, ctx) {
    const asciiChars = ['.',
        '#',
        'S',
        '%',
        '?',
        '*',
        '+',
        ';',
        ':',
        ',',
        '.'];
    const charWidth = 5;
    const charHeight = 10;
    const asciiWidth = Math.floor(img.width / charWidth);
    const asciiHeight = Math.floor(img.height / charHeight);
    let ascii = '';
    for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
            const imageData = ctx.getImageData(x * charWidth, y * charHeight, charWidth, charHeight);
            const pixelData = imageData.data;
            let brightnessSum = 0;
            for (let i = 0; i < pixelData.length; i += 4) {
                const r = pixelData[i];
                const g = pixelData[i + 1];
                const b = pixelData[i + 2];
                // Calculate brightness (R + G + B) / 3.
                const brightness = (r + g + b) / 3;
                brightnessSum += brightness;
            }
            const brightnessAvg = brightnessSum / (charWidth * charHeight);
            const asciiCharIndex = Math.floor(brightnessAvg / 25.5);
            ascii += asciiChars[asciiCharIndex];
        }
        ascii += '\n';
    }
    return ascii;
}
