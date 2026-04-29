const imageUpload = document.getElementById('imageUpload');
const frameSelect = document.getElementById('frameSelect');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('downloadBtn');

const TARGET_WIDTH = 3500;
const TARGET_HEIGHT = 4500;

async function init() {
    // মডেল লোড হওয়া পর্যন্ত বাটন ডিজেবল রাখা ভালো
    downloadBtn.disabled = true;
    loader.style.display = "block";
    loader.innerText = "Initializing AI...";
    
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        loader.style.display = "none";
        console.log("System Ready");
    } catch (e) {
        loader.innerText = "Error loading AI models.";
    }
}

imageUpload.addEventListener('change', async () => {
    const file = imageUpload.files[0];
    if (!file) return;

    loader.style.display = "block";
    loader.innerText = "Matching Face...";

    const img = await faceapi.bufferToImage(file);
    const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());

    // ফ্রেম লোড করা
    const frameImg = new Image();
    frameImg.src = frameSelect.value;

    frameImg.onload = () => {
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (detections) {
            const { x, y, width, height } = detections.box;
            const zoom = 2.3; 
            const sourceWidth = width * zoom;
            const sourceHeight = sourceWidth * (TARGET_HEIGHT / TARGET_WIDTH);
            const sourceX = x - (sourceWidth - width) / 2;
            const sourceY = y - (sourceHeight - height) / 2.5; 

            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        } else {
            ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        }

        // ছবির ওপর ফ্রেম বসানো
        ctx.drawImage(frameImg, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        
        loader.style.display = "none";
        downloadBtn.disabled = false;
        alert("Processing Complete! You can now download.");
    };
});

downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = '4K_Photo_Frame.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
};

init();
